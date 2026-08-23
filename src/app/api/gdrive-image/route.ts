import { NextRequest } from "next/server";

const DRIVE_API = "https://www.googleapis.com/drive/v3";

export async function GET(req: NextRequest) {
  const fileId = req.nextUrl.searchParams.get("id");
  if (!fileId) return new Response("Missing id", { status: 400 });

  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) return new Response("API key not configured", { status: 500 });

  try {
    const res = await fetch(`${DRIVE_API}/files/${fileId}?alt=media&key=${apiKey}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return new Response("Not found", { status: 404 });

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const body = await res.arrayBuffer();

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("Error fetching image", { status: 500 });
  }
}
