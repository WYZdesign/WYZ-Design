import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { OUTREACH_STAGES, OUTREACH_PHASE, maySend, renderStage, logPreview } from "@/lib/delivery";

/**
 * Spec 22 (board task 22) staging runner. Phase 1 = DRY RUN ONLY.
 *
 * Finds delivery_events that are due for each stage, checks consent, and logs
 * the would-be message. It NEVER sends while OUTREACH_PHASE < 3 (see
 * src/lib/delivery.ts), no matter how the env flags are set.
 *
 * Cron: /api/cron/delivery-outreach (daily). Idempotent.
 * @method GET
 * @auth Bearer CRON_SECRET when CRON_SECRET is set
 *
 * NOTE: requires migration 0002 to be applied. If the tables are absent this
 * returns { ok:true, skipped:"tables-not-ready" } instead of erroring.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = req.headers.get("authorization") || "";
    const querySecret = req.nextUrl.searchParams.get("secret") || "";
    if (authHeader !== `Bearer ${secret}` && querySecret !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const sb = getServiceClient();

    const { data: events, error } = await sb
      .from("delivery_events")
      .select("id, email, client_name, service_name, delivered_at, stage1_sent_at, stage2_sent_at, stage3_sent_at, stage4_sent_at")
      .order("delivered_at", { ascending: true })
      .limit(500);

    if (error) {
      // Table not present yet (migration 0002 pending) or other read issue.
      logger.warn("cron:delivery-outreach", `delivery_events read failed: ${error.message}`);
      return NextResponse.json({ ok: true, skipped: "tables-not-ready", detail: error.message });
    }

    const now = Date.now();
    const previews: Array<{ id: number; stage: string; to: string; subject: string }> = [];

    for (const ev of events || []) {
      const deliveredMs = new Date(ev.delivered_at).getTime();
      for (const stage of OUTREACH_STAGES) {
        const sentKey = `${stage.key}_sent_at` as keyof typeof ev;
        if (ev[sentKey]) continue; // already handled
        if (now - deliveredMs < stage.days * DAY_MS) continue; // not due yet

        const { subject } = renderStage(stage, { name: ev.client_name, serviceName: ev.service_name });

        if (maySend(stage)) {
          // Phase 3 only. Unreachable in Phase 1 (OUTREACH_PHASE < 3).
          logger.info("cron:delivery-outreach", `[${stage.key}] send path not enabled in this build; skipping ${ev.email}`);
        } else {
          logPreview(stage, ev.email, subject);
          previews.push({ id: ev.id, stage: stage.key, to: ev.email, subject });
        }
      }
    }

    logger.info("cron:delivery-outreach", `phase ${OUTREACH_PHASE}: ${previews.length} would-be sends (no email sent)`);
    return NextResponse.json({ ok: true, phase: OUTREACH_PHASE, sent: 0, previewed: previews.length, previews });
  } catch (e) {
    logger.error("cron:delivery-outreach", e instanceof Error ? e.message : String(e));
    return NextResponse.json({ error: "Outreach runner failed" }, { status: 500 });
  }
}
