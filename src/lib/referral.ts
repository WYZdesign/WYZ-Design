import { getServiceClient } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export interface ReferralConversionParams {
  code: string;
  email: string;
  eventType: "signup" | "purchase";
  amount?: number;
  stripeEventId?: string;
}

export interface ReferralConversionResult {
  ok: boolean;
  status: number;
  error?: string;
  commission?: number;
}

/**
 * Records a referral conversion (signup or purchase) and computes commission
 * (10% of amount for purchases). Shared by the /api/referral convert action
 * and the Stripe webhook so conversions are always recorded the same way.
 */
export async function recordReferralConversion(
  params: ReferralConversionParams
): Promise<ReferralConversionResult> {
  const { code, email, eventType, amount } = params;
  if (!code || !email || !eventType) {
    return { ok: false, status: 400, error: "Missing required fields" };
  }

  const sb = getServiceClient();
  try {
    const { data: codeRow } = await sb.from("referral_codes")
      .select("code, referrer_email")
      .eq("code", code.toUpperCase())
      .maybeSingle();
    if (!codeRow) return { ok: false, status: 404, error: "Invalid referral code" };

    // Prevent self-referral
    if (codeRow.referrer_email === email.toLowerCase()) {
      return { ok: false, status: 400, error: "Cannot refer yourself" };
    }

    // Calculate commission (10% for purchases) — compute in cents and round
    const purchaseAmount = typeof amount === "number" ? amount : 0;
    const commission = eventType === "purchase" ? Math.round(purchaseAmount * 10) : 0;

    // Dedup: skip if this event already created a conversion
    if (params.stripeEventId) {
      const { data: existing } = await sb.from("referral_conversions")
        .select("id").eq("stripe_event_id", params.stripeEventId).maybeSingle();
      if (existing) return { ok: true, status: 200 };
    }

    const { error } = await sb.from("referral_conversions").insert({
      referral_code: code.toUpperCase(),
      referred_email: email.toLowerCase(),
      event_type: eventType,
      amount: purchaseAmount,
      commission,
      stripe_event_id: params.stripeEventId || null,
    });
    if (error) {
      logger.error("referral:convert", error.message);
      return { ok: false, status: 500, error: "Failed to record conversion" };
    }
    return { ok: true, status: 200, commission };
  } catch (e) {
    logger.error("referral:convert", e);
    return { ok: false, status: 500, error: "Failed to record conversion" };
  }
}
