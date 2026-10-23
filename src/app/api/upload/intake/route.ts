import { NextRequest, NextResponse } from "next/server";
import { validateUpload, sanitizeFileName } from "@/lib/api-utils";
import { validateCsrf } from "@/lib/csrf";
import { rateLimit } from "@/lib/rate-limit";
import { getServiceClient } from "@/lib/supabase";

const BUCKET = "wyzdesign-intake";

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

async function ensureBucket(sb: ReturnType<typeof getServiceClient>) {
  const { data: buckets } = await sb.storage.listBuckets();
  if (!buckets?.find((b) => b.name === BUCKET)) {
    // Private: client reference files are not public assets.
    await sb.storage.createBucket(BUCKET, { public: false });
  }
}

/**
 * Public intake upload for forms (reference images, briefs, PDFs).
 * Stores privately and returns the storage path so the form submission can
 * reference it. Admin-only uploads still use /api/upload.
 */
export async function POST(req: NextRequest) {
  try {
    if (!validateCsrf(req)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }

    const rl = await rateLimit(`intake-upload:${getIp(req)}`, 5, 60_000);
    if (!rl.ok) return NextResponse.json({ error: "Too many uploads, try again shortly" }, { status: 429 });

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
    const day = new Date().toISOString().slice(0, 10);
    const path = `${day}/${subDir}/${safeBase}-${Date.now().toString(36)}.${ext.toLowerCase()}`;

    const bytes = await file.arrayBuffer();
    const { error } = await sb.storage.from(BUCKET).upload(path, Buffer.from(bytes), {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw error;

    return NextResponse.json({
      path: `${BUCKET}/${path}`,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
