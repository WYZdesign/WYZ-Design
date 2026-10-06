import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { hashGiftCardCode, isGiftCardExpired } from "@/lib/gift-cards";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

/**
 * Validates a gift-card code and returns its remaining balance. Read-only:
 * it does not spend anything. The spend happens server-side at checkout and is
 * committed by the Stripe webhook.
 */
export async function POST(req: NextRequest) {
  try {
    const { ok } = await rateLimit(`gc-validate:${getIp(req)}`, 30, 60_000);
    if (!ok) return NextResponse.json({ valid: false, message: "Too many attempts. Try again shortly." }, { status: 429 });

    const { code } = await req.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ valid: false, message: "Enter a gift card code." }, { status: 400 });
    }

    const sb = getServiceClient();
    const hash = hashGiftCardCode(code);
    const { data, error } = await sb
      .from("gift_cards")
      .select("id, balance_cents, currency, status, expires_at")
      .eq("code_hash", hash)
      .maybeSingle();

    if (error) {
      logger.error("gift-card:validate", error.message);
      return NextResponse.json({ valid: false, message: "Could not check that code. Try again." }, { status: 500 });
    }
    if (!data) return NextResponse.json({ valid: false, message: "Gift card not found." });
    if (data.status !== "active") return NextResponse.json({ valid: false, message: "This gift card is no longer active." });
    if (isGiftCardExpired(data.expires_at)) return NextResponse.json({ valid: false, message: "This gift card has expired." });
    if (!data.balance_cents || data.balance_cents <= 0) return NextResponse.json({ valid: false, message: "This gift card has no balance left." });

    return NextResponse.json({
      valid: true,
      balanceCents: data.balance_cents,
      currency: data.currency || "usd",
      expiresAt: data.expires_at,
    });
  } catch (e) {
    logger.error("gift-card:validate", e instanceof Error ? e.message : String(e));
    return NextResponse.json({ valid: false, message: "Could not check that code. Try again." }, { status: 500 });
  }
}
