import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side reverse geocode. The browser passes lat/long and we call
 * Nominatim from the server (keeps the external call server-side, avoids
 * CORS/rate-limit/privacy issues with direct browser calls, and lets us
 * cache + throttle). Free tier, no key required.
 */
export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const long = req.nextUrl.searchParams.get("long");
  if (!lat || !long) {
    return NextResponse.json({ error: "lat and long required" }, { status: 400 });
  }
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(long)}&zoom=10`;
    const r = await fetch(url, {
      headers: { "User-Agent": "MuseApp/1.0 (wyzdesign.com)" },
      // Cache for 30 days — city for a coordinate rarely changes.
      cache: "force-cache",
    });
    const j = await r.json();
    const city =
      j?.address?.city ||
      j?.address?.town ||
      j?.address?.village ||
      j?.address?.state ||
      j?.address?.country ||
      "";
    return NextResponse.json({ city });
  } catch {
    return NextResponse.json({ city: "" });
  }
}
