import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { logger } from "@/lib/logger";

/**
 * Returns a paid merch order for the confirmation page, keyed by the Stripe
 * checkout session id (unguessable). The webhook writes the order; this returns
 * `pending: true` (202) if it has not landed yet so the client can re-poll.
 */
export async function GET(req: NextRequest) {
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }
  try {
    const sb = getServiceClient();
    const { data: order } = await sb
      .from("orders")
      .select("id, email, status, subtotal_cents, shipping_cents, total_cents, currency, shipping_name, printful_status, created_at")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (!order) return NextResponse.json({ pending: true }, { status: 202 });

    const { data: items } = await sb
      .from("order_items")
      .select("name, variant_name, quantity, unit_price_cents, image")
      .eq("order_id", order.id);

    return NextResponse.json({ order, items: items || [] });
  } catch (e) {
    logger.error("order-summary", e instanceof Error ? e.message : String(e));
    return NextResponse.json({ error: "Unable to load order" }, { status: 500 });
  }
}
