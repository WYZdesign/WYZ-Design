import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, createGiftCardCheckout, createServiceCheckout, isValidPlan, getMissingPriceIds } from "@/lib/stripe";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { validateCsrf } from "@/lib/csrf";
import { rateLimit } from "@/lib/rate-limit";
import { errorResponse } from "@/lib/http";
import { logger } from "@/lib/logger";

const SERVICE_PRICES: Record<string, number> = {
  "Photoshoot": 100,
  "Event Photography": 200,
  "Logo Consultation": 50,
  "Marketing Consultation": 50,
  "SEO Audit": 50,
};

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

/**
 * Creates a Stripe checkout session for subscriptions, gift cards, or services.
 * @method POST
 * @request Body `{ type: "subscription"|"giftcard"|"service", plan?: string, amount?: number, email?: string, serviceName?: string, servicePrice?: number, ref?: string }`
 * @response JSON with Stripe checkout session URL
 * @auth Optional — NextAuth session supplies the userId; client-sent values ignored
 */
export async function POST(req: NextRequest) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  try {
    const { ok } = await rateLimit(`checkout:${getIp(req)}`, 30, 60_000);
    if (!ok) {
      return errorResponse("Too many requests. Please try again shortly.", 429, { code: "RATE_LIMITED" });
    }
    const { type, plan, amount, email, serviceName, servicePrice, ref } = await req.json();

    // Server-derived identity only. Client-sent userId is ignored so a
    // forged body cannot write a muse tier to someone else's account.
    // Email is the app-wide identity key (loyalty, zeal, profiles).
    const authSession = await auth();
    const serverUserId = authSession?.user?.email?.toLowerCase() || undefined;

    // Referral attribution: optional code captured from ?ref= share links
    let referralCode: string | undefined;
    if (typeof ref === "string" && ref.trim()) {
      referralCode = ref.trim().toUpperCase().slice(0, 40);
    }

    if (type === "subscription") {
      if (!plan) return NextResponse.json({ error: "Plan required" }, { status: 400 });
      if (!isValidPlan(plan)) {
        const missing = getMissingPriceIds();
        logger.warn("Checkout: invalid or unconfigured plan", { plan, missingPriceIds: missing });
        return NextResponse.json({
          error: missing.length > 0
            ? `Payment processing is not configured yet. Missing Price IDs for: ${missing.join(", ")}. Please contact support.`
            : `Unknown plan: "${plan}".`,
        }, { status: 400 });
      }
      const checkoutSession = await createCheckoutSession(plan, email, serverUserId, referralCode);
      return NextResponse.json({ url: checkoutSession.url });
    }

    if (type === "giftcard") {
      if (typeof amount !== "number" || !Number.isInteger(amount)) {
        return NextResponse.json({ error: "Gift card amount must be $5-$500" }, { status: 400 });
      }
      if (amount < 5 || amount > 500) {
        return NextResponse.json({ error: "Gift card amount must be $5-$500" }, { status: 400 });
      }
      const session = await createGiftCardCheckout(amount, email, referralCode);
      return NextResponse.json({ url: session.url });
    }

    if (type === "service") {
      if (!serviceName || !servicePrice) return NextResponse.json({ error: "Service name and price required" }, { status: 400 });
      const expectedPrice = SERVICE_PRICES[serviceName];
      if (expectedPrice === undefined) {
        return NextResponse.json({ error: "Unknown service" }, { status: 400 });
      }
      if (servicePrice !== expectedPrice) {
        return NextResponse.json({ error: "Invalid service price" }, { status: 400 });
      }
      const session = await createServiceCheckout(serviceName, servicePrice, email, referralCode);
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: "Invalid checkout type" }, { status: 400 });
  } catch (e: any) {
    logger.error("Checkout session creation failed", { error: e.message, stack: e.stack });
    if (e.message?.includes("Price ID not configured")) {
      return NextResponse.json({ error: "Payment processing is not configured yet. Please contact support." }, { status: 503 });
    }
    return NextResponse.json({ error: "Unable to create checkout session. Please try again." }, { status: 500 });
  }
}
