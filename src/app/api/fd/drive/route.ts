import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

const DRIVE_API = "https://www.googleapis.com/drive/v3";
const FOLDER_ID = "1x4Ya8VMdtt8wfG8jil-V_TxRuaEWht0T";
const FOLDER_ID_RE = /^[a-zA-Z0-9_-]{10,}$/;

async function listFiles(folderId: string, apiKey: string, pageToken?: string) {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id,name,mimeType,size,webViewLink,createdTime,fileExtension,iconLink,thumbnailLink,imageMediaMetadata),nextPageToken",
    pageSize: "100",
    orderBy: "folder,name",
    key: apiKey,
  });
  if (pageToken) params.set("pageToken", pageToken);

  const r = await fetch(`${DRIVE_API}/files?${params}`, { next: { revalidate: 300 } });
  if (!r.ok) {
    throw new Error("Drive API request failed");
  }
  return r.json();
}

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const rl = await rateLimit(`fd-drive:${ip}`, 30, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_DRIVE_API_KEY not set", hint: "Add to .env.local. Get from Google Cloud Console (enable Drive API)" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder") || FOLDER_ID;
  if (!FOLDER_ID_RE.test(folder)) {
    return NextResponse.json({ error: "Invalid folder id" }, { status: 400 });
  }
  const pageToken = searchParams.get("pageToken") || undefined;

  try {
    const data = await listFiles(folder, apiKey, pageToken);

    const files = (data.files || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      isFolder: f.mimeType === "application/vnd.google-apps.folder",
      size: f.size ? parseInt(f.size) : null,
      webViewLink: f.webViewLink || `https://drive.google.com/file/d/${f.id}/view`,
      downloadLink: `https://drive.google.com/uc?export=download&id=${f.id}`,
      createdTime: f.createdTime,
      fileExtension: f.fileExtension,
      iconLink: f.iconLink,
      thumbnailLink: f.thumbnailLink,
    }));

    return NextResponse.json({
      files,
      nextPageToken: data.nextPageToken || null,
      folderId: folder,
    });
  } catch (err: any) {
    logger.error("fd:drive-list", err && err.message ? err.message : String(err));
    return NextResponse.json({ error: "Could not load Drive files. Check server logs." }, { status: 500 });
  }
}
