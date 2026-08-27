import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

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
    if (process.env.NODE_ENV !== "production") {
      logger.warn("csp-violation", JSON.stringify(body).slice(0, 500));
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
