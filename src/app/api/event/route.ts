import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Best-effort product-analytics sink for client-side trackEvent() beacons.
 * Persists to muse_events_log (if the table exists) and always 200s.
 * Never throws.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await rateLimit(`event:${ip}`, 30, 60_000);
    if (!rl.ok) return NextResponse.json({ ok: true });

    const body = await req.json().catch(() => ({}));
    const name = typeof body?.name === "string" ? body.name.slice(0, 200) : "unknown";
    const props = typeof body?.props === "object" && body?.props !== null ? body.props : {};
    try {
      const sb = getServiceClient();
      await sb.from("muse_events_log").insert({
        name,
        props,
        ua: req.headers.get("user-agent") || "",
        ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
      });
    } catch {
      /* table may not exist yet — never fail the beacon */
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
