import { NextResponse } from "next/server";

const DRIVE_API = "https://www.googleapis.com/drive/v3";
const FOLDER_ID = "1x4Ya8VMdtt8wfG8jil-V_TxRuaEWht0T";

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
    const err = await r.text();
    throw new Error(`Drive API ${r.status}: ${err}`);
  }
  return r.json();
}

export async function GET(req: Request) {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_DRIVE_API_KEY not set", hint: "Add to .env.local — get from Google Cloud Console (enable Drive API)" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder") || FOLDER_ID;
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
