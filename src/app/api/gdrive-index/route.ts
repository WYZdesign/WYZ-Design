import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const DRIVE_API = "https://www.googleapis.com/drive/v3";
const ROOT_FOLDER = "1x4Ya8VMdtt8wfG8jil-V_TxRuaEWht0T";

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  path: string;
  folder: string;
}

async function listRecursive(
  folderId: string,
  folderPath: string,
  apiKey: string,
  limit: number,
  collected: DriveFile[] = []
): Promise<DriveFile[]> {
  if (collected.length >= limit) return collected;

  const params = new URLSearchParams({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id,name,mimeType),nextPageToken",
    pageSize: "100",
    orderBy: "folder,name",
    key: apiKey,
  });

  const res = await fetch(`${DRIVE_API}/files?${params}`);
  if (!res.ok) return collected;
  const data = await res.json();

  for (const f of data.files || []) {
    if (collected.length >= limit) break;
    if (f.mimeType === "application/vnd.google-apps.folder") {
      await listRecursive(f.id, `${folderPath}/${f.name}`, apiKey, limit, collected);
    } else if (f.mimeType.startsWith("image/")) {
      collected.push({
        id: f.id,
        name: f.name,
        mimeType: f.mimeType,
        path: `${folderPath}/${f.name}`,
        folder: folderPath,
      });
    }
  }
  return collected;
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) return NextResponse.json({ files: [] });

  const rl = await rateLimit(`gdrive-idx:${getIp(req)}`, 10, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const folder = req.nextUrl.searchParams.get("folder") || ROOT_FOLDER;
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "200"), 500);

  try {
    const files = await listRecursive(folder, "", apiKey, limit);
    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ files: [] });
  }
}
