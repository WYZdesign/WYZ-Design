import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { validateUpload, sanitizeFileName } from "@/lib/api-utils";
import { validateCsrf } from "@/lib/csrf";
import { auth } from "@/app/api/auth/[...nextauth]/route";

/**
 * Uploads an image or video file (max 10MB) to a non-public temp directory.
 * @method POST
 * @request Multipart form-data with `file` field
 * @response JSON with url, name, size, and type of the uploaded file
 * @auth Required
 */
export async function POST(req: NextRequest) {
  try {
    if (!validateCsrf(req)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const cl = parseInt(req.headers.get("content-length") || "0", 10);
    if (cl === 0) return NextResponse.json({ error: "Empty request" }, { status: 400 });
    if (cl > 10 * 1024 * 1024) return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 413 });

    const ct = req.headers.get("content-type") || "";
    if (!ct.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 415 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const validation = validateUpload(file);
    if (!validation.valid) return NextResponse.json({ error: validation.error }, { status: 400 });

    const isVideo = file.type.startsWith("video/");
    const subDir = isVideo ? "videos" : "images";
    const dir = process.env.VERCEL ? join(tmpdir(), "uploads", subDir) : join(process.cwd(), "_uploads", subDir);
    await mkdir(dir, { recursive: true });

    const ext = join("", sanitizeFileName(file.name)).split(".").pop() || (isVideo ? "mp4" : "jpg");
    const name = `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}.${ext.toLowerCase()}`;
    const filePath = join(dir, name);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    return NextResponse.json({
      url: `/api/upload/${name}`,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (e) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
