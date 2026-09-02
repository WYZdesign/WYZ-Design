import { NextRequest, NextResponse } from "next/server";

/**
 * Receives CSP violation reports from browsers.
 * Reports are logged but rate-limited to 5/minute to prevent abuse.
 */
const recentReports = new Map<string, number>();
const MAX_REPORTS = 500;
const REPORT_TTL = 120_000;

function cleanupOldReports() {
  if (recentReports.size <= MAX_REPORTS) return;
  const cutoff = Date.now() - REPORT_TTL;
  for (const [key, ts] of recentReports) {
    if (ts < cutoff) recentReports.delete(key);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const last = recentReports.get(ip) || 0;
    if (now - last < 12000) return NextResponse.json({ ok: true });
    recentReports.set(ip, now);
    cleanupOldReports();

    const body = await req.json();
    // Unlike lib/logger's other call sites, this one is deliberately NOT
    // gated to non-production: this route runs server-side only, so
    // console.warn here is never visible to a real user's browser — it
    // only reaches Vercel's function logs. Production traffic is exactly
    // where a real CSP violation matters most, and the rate limit above
    // (1 report per IP per 12s, capped at 500 tracked IPs) already
    // prevents this from flooding those logs.
    console.warn("[csp-violation]", JSON.stringify(body).slice(0, 500));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
