import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { logger } from "@/lib/logger";

/**
 * Housekeeping cron: cleans up abandoned merch checkouts.
 *  - Releases gift-card reservations held by sessions that never paid
 *    (`gift_card_ledger` rows still marked 'reserved' after 24h).
 *  - Deletes `orders` left in 'pending' for over 24h, plus their items.
 * Cron: /api/cron/cleanup-orders (daily). Idempotent.
 * @method GET
 * @auth Bearer CRON_SECRET when CRON_SECRET is set
 */

const MAX_AGE_MS = 24 * 60 * 60 * 1000;

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
    const cutoff = new Date(Date.now() - MAX_AGE_MS).toISOString();

    // 1. Release stale gift-card reservations
    const { data: staleReservations } = await sb
      .from("gift_card_ledger")
      .select("gift_card_id, ref")
      .eq("reason", "reserved")
      .lt("created_at", cutoff)
      .limit(500);

    let released = 0;
    for (const row of staleReservations || []) {
      const { error } = await sb.rpc("release_gift_card", { p_id: row.gift_card_id, p_ref: row.ref });
      if (error) logger.error("cron:cleanup-release", `${row.ref}: ${error.message}`);
      else released++;
    }

    // 2. Delete stale pending orders (+ their items)
    const { data: staleOrders } = await sb
      .from("orders")
      .select("id")
      .eq("status", "pending")
      .lt("created_at", cutoff)
      .limit(500);

    const ids = (staleOrders || []).map((o) => o.id);
    if (ids.length) {
      await sb.from("order_items").delete().in("order_id", ids);
      await sb.from("orders").delete().in("id", ids);
    }

    logger.info("cron:cleanup-orders", `released ${released} reservations, deleted ${ids.length} pending orders`);
    return NextResponse.json({ ok: true, cutoff, released, ordersDeleted: ids.length });
  } catch (e) {
    logger.error("cron:cleanup-orders", e instanceof Error ? e.message : String(e));
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
