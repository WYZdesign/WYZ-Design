import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getServiceClient } from "@/lib/supabase";
import { addLoyaltyPoints } from "@/lib/wyzmind";
import { earnZeal } from "@/lib/zeal";
import { sendDiscordAlert } from "@/lib/discord";
import { recordReferralConversion } from "@/lib/referral";
import { giftCardExpiry, generateGiftCardCode, hashGiftCardCode } from "@/lib/gift-cards";
import { sendGiftCardEmail } from "@/lib/email";
import { createPrintfulOrder } from "@/lib/printful";
import { sendBookingConfirmation } from "@/lib/email";
import Stripe from "stripe";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!endpointSecret) {
    logger.error("webhook", "STRIPE_WEBHOOK_SECRET not set — refusing unverified request");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = getStripe();
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    logger.warn("webhook", "Missing stripe-signature header");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret, 300);
  } catch (e) {
    logger.error("webhook", (e as Error).message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const sb = getServiceClient();

  // IDEMPOTENCY: skip events we've already processed successfully
  try {
    const { data: existing } = await sb.from("stripe_events")
      .select("id")
      .eq("stripe_event_id", event.id)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ received: true });
    }
  } catch { /* table may not exist yet — continue */ }

  // Process first, record after. Recording before processing made Stripe
  // retries see a recorded ID and skip, permanently dropping failed events.
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const plan = session.metadata?.plan;
        const userId = session.metadata?.userId || session.client_reference_id;
        const email = session.customer_details?.email?.toLowerCase();
        const amountTotal = session.amount_total || 0;

        if (plan && userId) {
          try {
            const { error } = await sb.from("muse_profiles").update({ tier: plan }).eq("auth_id", userId);
            if (error) logger.error("webhook:museTier", error.message);
          } catch (e) {
            logger.error("webhook:museTier", (e as Error).message);
          }
        }

        // Auto-earn loyalty points on purchase (1 point per dollar spent)
        try {
          const pointsEarned = Math.floor(amountTotal / 100); // 1 point per dollar
          if (email && pointsEarned > 0) {
            await addLoyaltyPoints(email, pointsEarned, `Purchase: ${plan || "subscription"}`);
          }
        } catch (e) { logger.error("webhook:loyalty-earn", (e as Error).message); }

        // Gift cards: insert DB record + alert staff + award post-payment Zeal milestone
        if (session.metadata?.type === "giftcard") {
          try {
            const gcAmount = Number(session.metadata.amount) || Math.round(amountTotal / 100);
            const gcCode = generateGiftCardCode();
            const gcExpiry = giftCardExpiry();
            const { error: gcErr } = await sb.from("gift_cards").insert({
              stripe_session_id: session.id,
              buyer_email: email || "unknown",
              recipient_email: session.metadata.recipientEmail || null,
              amount: gcAmount,
              balance_cents: Math.round(gcAmount * 100),
              currency: "usd",
              code: gcCode,
              code_hash: hashGiftCardCode(gcCode),
              status: "active",
              // 24-month policy (Torré 2026-10-06) — single source: lib/gift-cards.ts
              expires_at: gcExpiry.toISOString(),
            });
            if (gcErr) logger.error("webhook:giftcard-insert", gcErr.message);

            if (email) {
              try {
                await sendGiftCardEmail({ email, code: gcCode, amount: gcAmount, expiresAt: gcExpiry.toISOString() });
              } catch (e) { logger.error("webhook:giftcard-email", (e as Error).message); }
            }

            await sendDiscordAlert("Gift Card Purchase", {
              "Buyer Email": email || "Unknown",
              Amount: `$${gcAmount}`,
              Code: gcCode,
              "Session ID": session.id,
            });
          } catch (e) { logger.error("webhook:giftcard", (e as Error).message); }

          // One-time 75-Zeal "Purchased a gift card" milestone — only now that
          // Stripe has confirmed payment. earnZeal enforces the once-per-user
          // claim itself and is rate-limited + locked, so Stripe redeliveries
          // cannot double-award.
          if (email && session.customer_details?.email?.toLowerCase() === email) {
            try {
              const result = await earnZeal(email, "buy-gift-card");
              if (result.success && (result.zeal ?? 0) > 0) {
                logger.info("webhook:giftcard-zeal", `Awarded ${result.zeal} Zeal to ${email} (buy-gift-card)`);
              }
            } catch (e) { logger.error("webhook:giftcard-zeal", (e as Error).message); }
          }
        }

        // Merch: finalize the pending order and place the Printful fulfillment order
        if (session.metadata?.type === "merch") {
          try {
            const orderId = session.metadata.orderId;
            if (orderId) {
              const ci = (session as unknown as { collected_information?: { shipping_details?: { name?: string | null; address?: Stripe.Address | null } } }).collected_information;
              const legacy = (session as unknown as { shipping_details?: { name?: string | null; address?: Stripe.Address | null } }).shipping_details;
              const ship = ci?.shipping_details || legacy;
              const addr = ship?.address;
              await sb.from("orders").update({
                status: "paid",
                email: email || null,
                stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null,
                total_cents: amountTotal,
                shipping_name: ship?.name || null,
                shipping_address: addr ? { line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state, postal_code: addr.postal_code, country: addr.country } : null,
                updated_at: new Date().toISOString(),
              }).eq("id", orderId);

              const { data: items } = await sb
                .from("order_items")
                .select("printful_variant_id, name, quantity, unit_price_cents")
                .eq("order_id", orderId);

              if (items?.length && ship && addr?.line1 && addr.city) {
                try {
                  const po = await createPrintfulOrder({
                    recipient: {
                      name: ship.name || email || "WYZ Customer",
                      address1: addr.line1 || "",
                      address2: addr.line2 || null,
                      city: addr.city || "",
                      state_code: addr.state || null,
                      country_code: addr.country || "US",
                      zip: addr.postal_code || "",
                      email: email || null,
                    },
                    items: items.map((it) => ({
                      syncVariantId: it.printful_variant_id,
                      quantity: it.quantity,
                      name: it.name || undefined,
                      retailPrice: it.unit_price_cents / 100,
                    })),
                    externalId: orderId,
                    shipping: session.metadata?.shipping === "express" ? "EXPRESS" : "STANDARD",
                  });
                  await sb.from("orders").update({ printful_order_id: String(po.id), printful_status: po.status }).eq("id", orderId);
                  logger.info("webhook:merch-printful", `Printful order ${po.id} created for ${orderId}`);
                } catch (e) {
                  await sb.from("orders").update({ printful_status: `error: ${(e as Error).message}`.slice(0, 200) }).eq("id", orderId);
                  logger.error("webhook:merch-printful", (e as Error).message);
                }
              } else {
                logger.error("webhook:merch", `Order ${orderId} paid but shipping details incomplete; needs manual fulfillment`);
              }

              await sendDiscordAlert("Merch Order Paid", {
                Email: email || "Unknown",
                Total: `$${(amountTotal / 100).toFixed(2)}`,
                Order: orderId,
                Session: session.id,
              });
            }
          } catch (e) { logger.error("webhook:merch", (e as Error).message); }
        }

        // Gift-card redemption: commit the spend that was reserved at checkout
        const gcId = session.metadata?.giftCardId;
        const gcApplied = Number(session.metadata?.giftCardAppliedCents || 0);
        if (gcId && gcApplied > 0) {
          try {
            const gcNumId = Number(gcId);
            const { data: card } = await sb.from("gift_cards").select("balance_cents").eq("id", gcNumId).maybeSingle();
            const newBalance = Math.max(0, (card?.balance_cents || 0) - gcApplied);
            await sb.from("gift_cards").update({
              balance_cents: newBalance,
              status: newBalance <= 0 ? "redeemed" : "active",
              ...(newBalance <= 0 ? { redeemed_at: new Date().toISOString() } : {}),
            }).eq("id", gcNumId);
            await sb.from("gift_card_ledger").insert({
              gift_card_id: gcNumId,
              delta_cents: -gcApplied,
              reason: "redeemed at checkout",
              actor: "webhook",
              order_id: session.metadata?.orderId || null,
            });
            logger.info("webhook:giftcard-redeem", `Applied ${gcApplied} to card ${gcNumId} (balance ${newBalance})`);
          } catch (e) { logger.error("webhook:giftcard-redeem", (e as Error).message); }
        }

        // Record referral conversion server-to-server (no client round trip)
        const referralCode = session.metadata?.referralCode;
        if (referralCode && email) {
          try {
            const result = await recordReferralConversion({
              code: referralCode,
              email,
              eventType: "purchase",
              amount: Math.floor(amountTotal / 100),
              stripeEventId: event.id,
            });
            if (!result.ok) {
              logger.warn("webhook:referral", `${result.error} (code: ${referralCode}, session: ${session.id})`);
            }
          } catch (e) { logger.error("webhook:referral", (e as Error).message); }
        }

        if (email) {
          try {
            await sendBookingConfirmation({
              email,
              serviceType: plan || "service",
              serviceName: plan || "Your Order",
              amount: amountTotal / 100,
              orderId: session.id.slice(-8).toUpperCase(),
            });
          } catch (e) {
            logger.error("webhook:booking-email", (e as Error).message);
          }
        }

        const n8nUrl = process.env.N8N_WEBHOOK_URL;
        if (n8nUrl) {
          await fetch(n8nUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "checkout.session.completed", customer: session.customer, email: session.customer_details?.email, plan }),
          }).catch((e) => logger.error("webhook:n8n-notify", (e as Error).message));
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        try {
          const customerId = sub.customer as string;
          const customer = await stripe.customers.retrieve(customerId);
          const email = "email" in customer ? customer.email : null;
          if (email) {
            await sb.from("muse_profiles").update({ tier: "free" }).eq("email", email.toLowerCase());
          }
        } catch (e) { logger.error("webhook:subscriptionDelete", (e as Error).message); }

        const n8nUrl = process.env.N8N_WEBHOOK_URL;
        if (n8nUrl) {
          await fetch(n8nUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "customer.subscription.deleted", customer: sub.customer, subscription_id: sub.id }),
          }).catch((e) => logger.error("webhook:n8n-notify", (e as Error).message));
        }
        break;
      }
    }

    // Record the event only after successful processing so failures retry
    try {
      await sb.from("stripe_events").insert({
        stripe_event_id: event.id,
        type: event.type,
        processed_at: new Date().toISOString(),
      });
    } catch { /* best-effort */ }

    return NextResponse.json({ received: true });
  } catch (e) {
    logger.error("webhook:handler", (e as Error).message);
    // No idempotency row was written, so the next Stripe delivery retries cleanly
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
