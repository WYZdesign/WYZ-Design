import { NextRequest } from "next/server";
import { SUBSCRIPTION_PRICES, getMissingPriceIds } from "@/lib/stripe";
import { requireAdmin } from "@/lib/admin-auth";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin.ok) return admin.response;

    const missing = getMissingPriceIds();
    const configured = Object.entries(SUBSCRIPTION_PRICES)
      .filter(([, cfg]) => cfg.priceId)
      .map(([key, cfg]) => ({ plan: key, name: cfg.name, priceId: cfg.priceId.slice(0, 12) + "..." }));

    return Response.json({
      stripeKeySet: !!process.env.STRIPE_SECRET_KEY,
      webhookSecretSet: !!process.env.STRIPE_WEBHOOK_SECRET,
      configured,
      missing,
      allConfigured: missing.length === 0,
    });
  } catch (e) {
    logger.error("stripe-status", e);
    return Response.json({ error: "Failed to check Stripe status" }, { status: 500 });
  }
}
