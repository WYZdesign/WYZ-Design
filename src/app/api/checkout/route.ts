import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, createGiftCardCheckout, createServiceCheckout } from "@/lib/stripe";
import { validateCsrf } from "@/lib/csrf";
import { rateLimit } from "@/lib/rate-limit";
import { errorResponse } from "@/lib/http";

const VALID_GIFT_AMOUNTS = [25, 50, 100, 150, 250];

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
 * @request Body `{ type: "subscription"|"giftcard"|"service", plan?: string, amount?: number, email?: string, serviceName?: string, servicePrice?: number }`
 * @response JSON with Stripe checkout session URL
 * @auth None
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
    const { type, plan, amount, email, serviceName, servicePrice, userId } = await req.json();

    if (type === "subscription") {
      if (!plan) return NextResponse.json({ error: "Plan required" }, { status: 400 });
      const session = await createCheckoutSession(plan, email, userId);
      return NextResponse.json({ url: session.url });
    }

    if (type === "giftcard") {
      if (!amount) return NextResponse.json({ error: "Amount required" }, { status: 400 });
      if (!VALID_GIFT_AMOUNTS.includes(amount) && amount < 5) {
        return NextResponse.json({ error: "Invalid gift card amount" }, { status: 400 });
      }
      const session = await createGiftCardCheckout(amount, email);
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
      const session = await createServiceCheckout(serviceName, servicePrice, email);
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: "Invalid checkout type" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
