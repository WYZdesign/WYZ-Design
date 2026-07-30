import { NextRequest, NextResponse } from "next/server";

const DRIVE_API = "https://www.googleapis.com/drive/v3";
const ROOT_FOLDER = "1x4Ya8VMdtt8wfG8jil-V_TxRuaEWht0T";

async function findSubfolder(parentId: string, name: string, apiKey: string): Promise<string | null> {
  const params = new URLSearchParams({
    q: `'${parentId}' in parents and name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
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
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) return NextResponse.json({ images: [] });

  const category = req.nextUrl.searchParams.get("category") || "";
  const perPage = Math.min(parseInt(req.nextUrl.searchParams.get("per_page") || "20"), 50);

  try {
    // Find the category subfolder under root
    const catFolderId = await findSubfolder(ROOT_FOLDER, category, apiKey);
    if (!catFolderId) return NextResponse.json({ images: [] });

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
      (f: { id: string }) => `${DRIVE_API}/files/${f.id}?alt=media&key=${apiKey}`
    );
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
