import { NextRequest, NextResponse } from "next/server";
import { validateUpload, sanitizeFileName } from "@/lib/api-utils";
import { validateCsrf } from "@/lib/csrf";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getServiceClient } from "@/lib/supabase";

const BUCKET = "wyzdesign-uploads";

async function ensureBucket(sb: ReturnType<typeof getServiceClient>) {
  const { data: buckets } = await sb.storage.listBuckets();
  if (!buckets?.find(b => b.name === BUCKET)) {
    await sb.storage.createBucket(BUCKET, { public: true });
  }
}

/**
 * Uploads an image or video file (max 10MB) to Supabase Storage.
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

    const sb = getServiceClient();
    await ensureBucket(sb);

    const isVideo = file.type.startsWith("video/");
    const subDir = isVideo ? "videos" : "images";
    const ext = file.name.split(".").pop() || (isVideo ? "mp4" : "jpg");
    const safeBase = sanitizeFileName(file.name.replace(/\.[^.]+$/, ""));
    const path = `${subDir}/${safeBase}-${Date.now().toString(36)}.${ext.toLowerCase()}`;

    const bytes = await file.arrayBuffer();
    const { error } = await sb.storage.from(BUCKET).upload(path, Buffer.from(bytes), {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw error;

    const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(path);

    return NextResponse.json({
      url: urlData.publicUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (e) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
