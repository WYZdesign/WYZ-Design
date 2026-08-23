import { NextRequest, NextResponse } from "next/server";

const DRIVE_API = "https://www.googleapis.com/drive/v3";
const ROOT_FOLDER = "1x4Ya8VMdtt8wfG8jil-V_TxRuaEWht0T";

function driveImageUrl(fileId: string): string {
  return `/api/gdrive-image?id=${fileId}`;
}

async function findImages(folderId: string, apiKey: string, limit: number, depth: number = 0): Promise<Array<{ id: string; name: string; folder: string }>> {
  if (depth > 5 || limit <= 0) return [];
  const results: Array<{ id: string; name: string; folder: string }> = [];

  // List all children (folders and images) at this level
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id,name,mimeType)",
    pageSize: "100",
    orderBy: "folder,name",
    key: apiKey,
  });
  const res = await fetch(`${DRIVE_API}/files?${params}`);
  if (!res.ok) return results;
  const data = await res.json();

  for (const f of data.files || []) {
    if (results.length >= limit) break;
    if (f.mimeType === "application/vnd.google-apps.folder") {
      const sub = await findImages(f.id, apiKey, limit - results.length, depth + 1);
      results.push(...sub);
    } else if (f.mimeType.startsWith("image/")) {
      results.push({ id: f.id, name: f.name, folder: folderId });
    }
  }
  return results;
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) return NextResponse.json({ photos: [] });

  const mode = req.nextUrl.searchParams.get("mode");

  try {
    const images = await findImages(ROOT_FOLDER, apiKey, mode === "best-per-model" ? 10 : 30);

    if (mode === "best-per-model") {
      // Deduplicate: one per unique parent folder
      const seenFolders = new Set<string>();
      const results: Array<{ model: string; imageUrl: string }> = [];
      for (const img of images) {
        if (!seenFolders.has(img.folder)) {
          seenFolders.add(img.folder);
          results.push({
            model: img.name.split(/[._-]/)[0].toUpperCase() || "MODEL",
            imageUrl: driveImageUrl(img.id),
          });
        }
      }
      return NextResponse.json({ photos: results });
    }

    return NextResponse.json({ photos: images.map((img) => driveImageUrl(img.id)) });
  } catch {
    return NextResponse.json({ photos: [] });
  }
}
