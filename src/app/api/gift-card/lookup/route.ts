import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { logger } from "@/lib/logger";

/**
 * Post-purchase display: returns the gift-card code for a Stripe checkout
 * session so the buyer sees it immediately on /gift-card?success=true. The
 * session id is the secret. Codes are also emailed to the buyer.
 */
export async function GET(req: NextRequest) {
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }
  try {
    const sb = getServiceClient();
    const { data, error } = await sb
      .from("gift_cards")
      .select("code_last4, amount, expires_at, balance_cents, currency")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ pending: true }, { status: 202 });
    return NextResponse.json(data);
  } catch (e) {
    logger.error("gift-card:lookup", e instanceof Error ? e.message : String(e));
    return NextResponse.json({ error: "Unable to load gift card" }, { status: 500 });
  }
}
