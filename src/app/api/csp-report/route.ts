import { NextRequest, NextResponse } from "next/server";

/**
 * Receives CSP violation reports from browsers.
 * Reports are logged but rate-limited to 5/minute to prevent abuse.
 */
const recentReports = new Map<string, number>();
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const last = recentReports.get(ip) || 0;
    if (now - last < 12000) return NextResponse.json({ ok: true });
    recentReports.set(ip, now);

    const body = await req.json();
    if (process.env.NODE_ENV !== "production") {
      console.warn("[csp-violation]", JSON.stringify(body).slice(0, 500));
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
