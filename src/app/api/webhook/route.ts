import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getServiceClient } from "@/lib/supabase";
import { addLoyaltyPoints } from "@/lib/wyzmind";
import { sendDiscordAlert } from "@/lib/discord";
import { recordReferralConversion } from "@/lib/referral";
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

        // Gift cards: insert DB record + alert staff
        if (session.metadata?.type === "giftcard") {
          try {
            const gcAmount = Number(session.metadata.amount) || Math.round(amountTotal / 100);
            const gcCode = `WYZ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
            const { error: gcErr } = await sb.from("gift_cards").insert({
              stripe_session_id: session.id,
              buyer_email: email || "unknown",
              amount: gcAmount,
              code: gcCode,
            });
            if (gcErr) logger.error("webhook:giftcard-insert", gcErr.message);

            await sendDiscordAlert("Gift Card Purchase", {
              "Buyer Email": email || "Unknown",
              Amount: `$${gcAmount}`,
              Code: gcCode,
              "Session ID": session.id,
            });
          } catch (e) { logger.error("webhook:giftcard", (e as Error).message); }
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
