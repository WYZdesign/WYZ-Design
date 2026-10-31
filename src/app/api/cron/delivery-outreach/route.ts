import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { markCronRun } from "@/lib/cron-heartbeat";
import { sendEmail } from "@/lib/email";
import {
  OUTREACH_STAGES,
  OUTREACH_PHASE,
  maySend,
  renderStage,
  logPreview,
  stageSent,
  cadenceBlocked,
  consentAllows,
  bodyToHtml,
  flagEnabled,
  type CommPref,
  type DeliveryRow,
} from "@/lib/delivery";

/**
 * Spec 22 (board task 22) outreach runner. Phase 3 = live, per-stage flags.
 *
 * For each delivery_events row past a stage's due date it checks, in order:
 *   1. consent  - client_comm_preferences opt-out wins, always,
 *   2. cadence  - max 1 marketing message per client per 14 days (stages 2-4),
 *   3. allowlist - WYZ_OUTREACH_ENABLED + that stage's flag must both be on,
 *   4. dry-run  - WYZ_OUTREACH_DRY_RUN=1 previews instead of sending.
 * A successful send stamps `<stage>_sent_at`, so every stage fires once.
 * Failures are not stamped and are retried on the next run.
 *
 * Cron: /api/cron/delivery-outreach (daily). Idempotent.
 * @method GET
 * @auth Bearer CRON_SECRET when CRON_SECRET is set
 *
 * NOTE: requires migration 0002. If the tables are absent this returns
 * { ok:true, skipped:"tables-not-ready" } instead of erroring.
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
    const dryRun = flagEnabled("WYZ_OUTREACH_DRY_RUN");

    const { data, error } = await sb
      .from("delivery_events")
      .select(
        "id, email, client_name, service_name, delivered_at, stage1_sent_at, stage2_sent_at, stage3_sent_at, stage4_sent_at",
      )
      .order("delivered_at", { ascending: true })
      .limit(500);

    if (error) {
      // Table not present yet (migration 0002 pending) or other read issue.
      logger.warn("cron:delivery-outreach", `delivery_events read failed: ${error.message}`);
      return NextResponse.json({ ok: true, skipped: "tables-not-ready", detail: error.message });
    }

    const now = Date.now();
    const rows = (data || []) as unknown as DeliveryRow[];

    // Consent is one lookup for the whole batch, not one query per row.
    const dueEmails = new Set<string>();
    for (const row of rows) {
      for (const stage of OUTREACH_STAGES) {
        if (stageSent(row, stage.key)) continue;
        if (now - new Date(row.delivered_at || 0).getTime() < stage.days * DAY_MS) continue;
        dueEmails.add(row.email.toLowerCase());
      }
    }

    const prefs = new Map<string, CommPref>();
    if (dueEmails.size) {
      const { data: prefRows, error: prefErr } = await sb
        .from("client_comm_preferences")
        .select("email, email_opt_in, opt_out_at")
        .in("email", [...dueEmails]);
      if (prefErr) {
        logger.warn("cron:delivery-outreach", `comm preferences read failed: ${prefErr.message}`);
      } else {
        for (const p of (prefRows || []) as CommPref[]) prefs.set(p.email.toLowerCase(), p);
      }
    }

    const sent: number[] = [];
    const previews: Array<{ id: number; stage: string; to: string; subject: string }> = [];
    let optedOut = 0;
    let cadenceSkipped = 0;
    let failed = 0;

    for (const row of rows) {
      const deliveredMs = new Date(row.delivered_at || 0).getTime();
      for (const stage of OUTREACH_STAGES) {
        if (stageSent(row, stage.key)) continue; // already handled
        if (now - deliveredMs < stage.days * DAY_MS) continue; // not due yet

        const { subject, body } = renderStage(stage, {
          name: row.client_name,
          serviceName: row.service_name,
        });

        // 1. Consent is never optional, flag or no flag.
        if (!consentAllows(prefs.get(row.email.toLowerCase()))) {
          optedOut++;
          logger.info("cron:delivery-outreach", `[${stage.key}] opted out, suppressed ${row.email}`);
          continue;
        }

        // 2. Marketing cadence cap across stages 2-4.
        if (cadenceBlocked(stage, row, now)) {
          cadenceSkipped++;
          continue;
        }

        // 3. Master switch + per-stage allowlist (and 4. dry-run override).
        if (!maySend(stage) || dryRun) {
          logPreview(stage, row.email, subject);
          previews.push({ id: row.id, stage: stage.key, to: row.email, subject });
          continue;
        }

        const ok = await sendEmail(row.email, subject, bodyToHtml(subject, body));
        if (!ok) {
          failed++;
          logger.error("cron:delivery-outreach", `[${stage.key}] send failed for ${row.email}; will retry next run`);
          continue;
        }

        const { error: updErr } = await sb
          .from("delivery_events")
          .update({ [`${stage.key}_sent_at`]: new Date().toISOString() })
          .eq("id", row.id);
        if (updErr) {
          // Sent but not stamped: log loudly so it is not double-sent next run.
          logger.error(
            "cron:delivery-outreach",
            `[${stage.key}] sent to ${row.email} but stamp failed: ${updErr.message}`,
          );
          failed++;
          continue;
        }
        sent.push(row.id);
        logger.info("cron:delivery-outreach", `[${stage.key}] sent to ${row.email}`);
      }
    }

    const summary = `phase ${OUTREACH_PHASE}: sent ${sent.length}, previewed ${previews.length}, opted-out ${optedOut}, cadence-held ${cadenceSkipped}, failed ${failed}${dryRun ? " (dry run)" : ""}`;
    logger.info("cron:delivery-outreach", summary);
    await markCronRun("delivery-outreach", true, summary);
    return NextResponse.json({
      ok: true,
      phase: OUTREACH_PHASE,
      dryRun,
      sent: sent.length,
      previewed: previews.length,
      optedOut,
      cadenceSkipped,
      failed,
      previews,
    });
  } catch (e) {
    logger.error("cron:delivery-outreach", e instanceof Error ? e.message : String(e));
    await markCronRun("delivery-outreach", false, e instanceof Error ? e.message : String(e));
    return NextResponse.json({ error: "Outreach runner failed" }, { status: 500 });
  }
}
