import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { requireAdmin } from "@/lib/admin-auth";

const DRIVE_API = "https://www.googleapis.com/drive/v3";
const ROOT_FOLDER = "1x4Ya8VMdtt8wfG8jil-V_TxRuaEWht0T";

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isSafeFolderId(id: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(id) && id.length <= 200;
}

async function findSubfolder(parentId: string, name: string, apiKey: string): Promise<string | null> {
  const sanitizedName = name.replace(/[^a-zA-Z0-9 _-]/g, "").slice(0, 100);
  if (!sanitizedName) return null;
  const params = new URLSearchParams({
    q: `'${parentId}' in parents and name = '${sanitizedName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id,name)",
    pageSize: "1",
    key: apiKey,
  });
  const res = await fetch(`${DRIVE_API}/files?${params}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.files?.[0]?.id || null;
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) return NextResponse.json({ images: [] });

  const rl = await rateLimit(`gdrive-photos:${getIp(req)}`, 20, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const category = req.nextUrl.searchParams.get("category") || "";
  const perPage = Math.min(Math.max(parseInt(req.nextUrl.searchParams.get("per_page") || "20"), 1), 50);

  try {
    // Find the category subfolder under root
    const catFolderId = await findSubfolder(ROOT_FOLDER, category, apiKey);
    if (!catFolderId) return NextResponse.json({ images: [] });
    if (!isSafeFolderId(catFolderId)) return NextResponse.json({ images: [] });

    // List images in that folder
    const imgParams = new URLSearchParams({
      q: `'${catFolderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: "files(id,name,mimeType)",
      pageSize: String(perPage),
      orderBy: "name",
      key: apiKey,
    });
    const imgRes = await fetch(`${DRIVE_API}/files?${imgParams}`);
    if (!imgRes.ok) return NextResponse.json({ images: [] });
    const imgData = await imgRes.json();

    const images = (imgData.files || []).map(
      (f: { id: string }) => `/api/gdrive-image?id=${f.id}`
    );
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
