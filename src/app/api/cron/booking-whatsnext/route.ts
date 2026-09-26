import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { sendBookingWhatsNext } from "@/lib/email";
import { logger } from "@/lib/logger";

/**
 * Day-before "What to Expect" email automation.
 * Cron: /api/cron/booking-whatsnext (daily). Finds booking submissions whose
 * requested `date` is tomorrow and sends sendBookingWhatsNext exactly once
 * (deduped via data.whatsnext_sent in Supabase).
 * @method GET
 * @auth Bearer CRON_SECRET when CRON_SECRET is set
 */

const BOOKING_TYPES = ["booking", "photoshoot-booking", "consultation-booking"];

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

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
    const supabase = getServiceClient();
    const target = ymd(new Date(Date.now() + 24 * 60 * 60 * 1000));

    const { data: rows, error } = await supabase
      .from("form_submissions")
      .select("id, form_type, data")
      .in("form_type", BOOKING_TYPES)
      .order("submitted_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);

    const due = (rows || []).filter((row: { data: Record<string, unknown> | null }) => {
      const d = row.data || {};
      return (
        String(d.date || "") === target &&
        d.whatsnext_sent !== true &&
        String(d.email || "").includes("@")
      );
    });

    let sent = 0;
    for (const row of due) {
      const d = (row.data || {}) as Record<string, unknown>;
      const ok = await sendBookingWhatsNext({
        email: String(d.email),
        customerName: String(d.name || ""),
        serviceType: String(row.form_type),
        serviceName: String(d.service || d.topic || String(row.form_type).replace(/-/g, " ")),
      });
      if (ok) {
        sent++;
        const { error: upErr } = await supabase
          .from("form_submissions")
          .update({ data: { ...d, whatsnext_sent: true } })
          .eq("id", row.id);
        if (upErr) logger.error("cron:whatsnext-mark", upErr.message);
      }
    }

    return NextResponse.json({ ok: true, target, candidates: due.length, sent });
  } catch (e) {
    logger.error("cron:booking-whatsnext", e);
    return NextResponse.json({ error: "Failed to run booking whats-next" }, { status: 500 });
  }
}
