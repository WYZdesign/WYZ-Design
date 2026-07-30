import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY || "";
    _stripe = new Stripe(key);
  }
  return _stripe;
}

export const SUBSCRIPTION_PRICES: Record<string, { priceId: string; name: string }> = {
  // WYZ Design agency plans
  starter: { priceId: process.env.STRIPE_STARTER_PRICE_ID || "", name: "Starter Pack" },
  business: { priceId: process.env.STRIPE_BUSINESS_PRICE_ID || "", name: "Business Boost" },
  pro: { priceId: process.env.STRIPE_PRO_PRICE_ID || "", name: "Pro Plus" },
  ultimate: { priceId: process.env.STRIPE_ULTIMATE_PRICE_ID || "", name: "Ultimate Suite" },
  // Muse app tiers (map to same underlying Stripe prices by ascending value)
  spark: { priceId: process.env.STRIPE_MUSE_SPARK_PRICE_ID || process.env.STRIPE_STARTER_PRICE_ID || "", name: "Spark" },
  muse: { priceId: process.env.STRIPE_MUSE_MUSE_PRICE_ID || process.env.STRIPE_PRO_PRICE_ID || "", name: "Muse" },
  sovereign: { priceId: process.env.STRIPE_MUSE_SOVEREIGN_PRICE_ID || process.env.STRIPE_ULTIMATE_PRICE_ID || "", name: "Sovereign" },
};

export async function createCheckoutSession(plan: string, email?: string, userId?: string) {
  const stripe = getStripe();
  const planConfig = SUBSCRIPTION_PRICES[plan];
  if (!planConfig || !planConfig.priceId) {
    throw new Error(`Unknown plan: ${plan}`);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email,
    client_reference_id: userId || undefined,
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL || "https://wyzdesign.com"}/muse?upgraded=${plan}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL || "https://wyzdesign.com"}/muse`,
    allow_promotion_codes: true,
    metadata: { plan, userId: userId || "" },
  });

  return session;
}

export async function createGiftCardCheckout(amount: number, email?: string) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: "WYZ Design Gift Card", description: "Redeemable for any WYZ Design service" },
        unit_amount: amount * 100,
      },
      quantity: 1,
    }],
    success_url: `${process.env.NEXT_PUBLIC_URL || "https://wyzdesign.com"}/gift-card?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL || "https://wyzdesign.com"}/gift-card`,
  });
  return session;
}

export async function createServiceCheckout(serviceName: string, servicePrice: number, email?: string) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: {
          name: serviceName,
          description: `WYZ Design - ${serviceName}`,
        },
        unit_amount: Math.round(servicePrice * 100),
      },
      quantity: 1,
    }],
    success_url: `${process.env.NEXT_PUBLIC_URL || "https://wyzdesign.com"}/booking?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL || "https://wyzdesign.com"}/booking`,
    allow_promotion_codes: true,
    metadata: { service: serviceName },
  });
  return session;
}
