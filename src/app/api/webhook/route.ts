import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getServiceClient } from "@/lib/supabase";
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

  // IDEMPOTENCY: Check if event already processed
  try {
    const { data: existing } = await sb.from("stripe_events")
      .select("id")
      .eq("stripe_event_id", event.id)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ received: true });
    }
  } catch { /* table may not exist yet — continue */ }

  // Record event first to prevent race conditions
  try {
    await sb.from("stripe_events").insert({
      stripe_event_id: event.id,
      type: event.type,
      processed_at: new Date().toISOString(),
    });
  } catch { /* best-effort */ }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const plan = session.metadata?.plan;
        const userId = session.metadata?.userId || session.client_reference_id;

        if (plan && userId) {
          try {
            const { error } = await sb.from("muse_profiles").update({ tier: plan }).eq("auth_id", userId);
            if (error) logger.error("webhook:museTier", error.message);
          } catch (e) {
            logger.error("webhook:museTier", (e as Error).message);
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

    return NextResponse.json({ received: true });
  } catch (e) {
    logger.error("webhook:handler", (e as Error).message);
    try {
      await sb.from("stripe_events").update({ error: (e as Error).message }).eq("stripe_event_id", event.id);
    } catch { /* best-effort */ }
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
