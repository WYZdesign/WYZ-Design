import { NextResponse } from "next/server";

const DRIVE_API = "https://www.googleapis.com/drive/v3";
const ROOT_FOLDER = "1x4Ya8VMdtt8wfG8jil-V_TxRuaEWht0T";

interface ModelEntry {
  name: string;
  folder: string;
  coverImage: string;
}

async function findCoverImage(folderId: string, apiKey: string): Promise<string> {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    fields: "files(id)",
    pageSize: "1",
    orderBy: "name",
    key: apiKey,
  });
  const res = await fetch(`${DRIVE_API}/files?${params}`);
  if (!res.ok) return "";
  const data = await res.json();
  const file = data.files?.[0];
  return file ? `/api/gdrive-image?id=${file.id}` : "";
}

export async function GET() {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) return NextResponse.json({ models: [] });

  try {
    const params = new URLSearchParams({
      q: `'${ROOT_FOLDER}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id,name)",
      pageSize: "100",
      orderBy: "name",
      key: apiKey,
    });
    const res = await fetch(`${DRIVE_API}/files?${params}`);
    if (!res.ok) return NextResponse.json({ models: [] });
    const data = await res.json();
    const folders: Array<{ id: string; name: string }> = data.files || [];

    const models: ModelEntry[] = [];
    for (const folder of folders) {
      const coverImage = await findCoverImage(folder.id, apiKey);
      models.push({
        name: folder.name,
        folder: folder.name,
        coverImage,
      });
    }

    return NextResponse.json({ models });
  } catch {
    return NextResponse.json({ models: [] });
  }
}
