import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, createGiftCardCheckout, createServiceCheckout, createMerchCheckout, isValidPlan, getMissingPriceIds } from "@/lib/stripe";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { validateCsrf } from "@/lib/csrf";
import { rateLimit } from "@/lib/rate-limit";
import { errorResponse } from "@/lib/http";
import { logger } from "@/lib/logger";
import { getServiceClient } from "@/lib/supabase";
import { getVariantInfo } from "@/lib/printful";
import { sanitizeCartLine, cartSubtotalCents, shippingCentsFor, SHIPPING_OPTIONS, MAX_CART_LINES, MAX_LINE_QUANTITY, type CartLine } from "@/lib/merch";

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
    const { type, plan, amount, email, serviceName, servicePrice, ref, items, shipping } = await req.json();

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

    if (type === "merch") {
      if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
      }
      if (items.length > MAX_CART_LINES) {
        return NextResponse.json({ error: "Too many items in cart." }, { status: 400 });
      }
      const shippingId = SHIPPING_OPTIONS.some((o) => o.id === shipping) ? shipping : "standard";

      // Resolve every line against Printful: the variant must exist, belong to
      // the claimed product, and have a real price. Client prices are ignored.
      const resolved: CartLine[] = [];
      for (const raw of items) {
        const candidate = sanitizeCartLine({ ...(raw as object), unitPriceCents: 0 });
        if (!candidate) return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
        const info = await getVariantInfo(candidate.variantId);
        if (!info || info.productId !== candidate.productId || info.price <= 0) {
          return NextResponse.json({ error: `One item is no longer available in that option. Please refresh your cart.` }, { status: 409 });
        }
        resolved.push({
          variantId: info.id,
          productId: info.productId,
          title: candidate.title,
          variantName: info.name,
          size: info.size,
          color: info.color,
          image: info.image || candidate.image,
          unitPriceCents: Math.round(info.price * 100),
          quantity: candidate.quantity,
        });
      }

      // Merge duplicate variants (same variant picked twice).
      const merged = new Map<number, CartLine>();
      for (const l of resolved) {
        const existing = merged.get(l.variantId);
        if (existing) existing.quantity = Math.min(existing.quantity + l.quantity, MAX_LINE_QUANTITY);
        else merged.set(l.variantId, l);
      }
      const lines = [...merged.values()];
      const subtotal = cartSubtotalCents(lines);
      const shipCents = shippingCentsFor(subtotal, shippingId);

      const sb = getServiceClient();
      const { data: order, error: orderErr } = await sb
        .from("orders")
        .insert({
          email: email || serverUserId || null,
          status: "pending",
          subtotal_cents: subtotal,
          shipping_cents: shipCents,
          total_cents: subtotal + shipCents,
          currency: "usd",
        })
        .select("id")
        .single();
      if (orderErr || !order) {
        logger.error("Checkout: merch order insert failed", orderErr?.message);
        return NextResponse.json({ error: "Unable to start checkout. Please try again.", detail: orderErr?.message || "no order row returned" }, { status: 500 });
      }

      const { error: itemsErr } = await sb.from("order_items").insert(
        lines.map((l) => ({
          order_id: order.id,
          printful_product_id: l.productId,
          printful_variant_id: l.variantId,
          name: l.title,
          variant_name: l.variantName,
          quantity: l.quantity,
          unit_price_cents: l.unitPriceCents,
          image: l.image,
        }))
      );
      if (itemsErr) {
        logger.error("Checkout: merch order items insert failed", itemsErr.message);
        return NextResponse.json({ error: "Unable to start checkout. Please try again.", detail: itemsErr.message }, { status: 500 });
      }

      const session = await createMerchCheckout(lines, shippingId, order.id, email, referralCode);
      await sb.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: "Invalid checkout type" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown checkout error";
    const stack = error instanceof Error ? error.stack : undefined;
    logger.error("Checkout session creation failed", { error: message, stack });
    if (message.includes("Price ID not configured")) {
      return NextResponse.json({ error: "Payment processing is not configured yet. Please contact support." }, { status: 503 });
    }
    return NextResponse.json({ error: "Unable to create checkout session. Please try again." }, { status: 500 });
  }
}
