import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getServiceClient } from "@/lib/supabase";

/**
 * Best-effort telemetry sink for client-side trackError() beacons.
 * Persists to muse_error_logs (if the table exists) and always 200s so the
 * beacon never errors. Never throws.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = typeof body?.message === "string" ? body.message.slice(0, 4000) : "unknown";
    const context = typeof body?.context === "string" ? body.context.slice(0, 200) : "client";
    try {
      const sb = getServiceClient();
      await sb.from("muse_error_logs").insert({ message, context, ua: req.headers.get("user-agent") || "" });
    } catch (e) { logger.error("telemetry:insert", e); }
  } catch {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: true });
}
