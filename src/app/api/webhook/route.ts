import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getServiceClient } from "@/lib/supabase";
import Stripe from "stripe";

/**
 * Handles Stripe webhook events (checkout.session.completed, subscription deleted).
 * @method POST
 * @request Raw body with `stripe-signature` header
 * @response JSON with `{ received: true }`
 * @auth None — verified via Stripe signature
 */
export async function POST(req: NextRequest) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!endpointSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not set — refusing to process unverified webhook");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = getStripe();
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  try {
    const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const plan = session.metadata?.plan;
        const userId = session.metadata?.userId || session.client_reference_id;

        // Update Muse profile tier if this was a Muse subscription
        if (plan && userId) {
          try {
            const sb = getServiceClient();
            const { error } = await sb.from("muse_profiles").update({ tier: plan }).eq("auth_id", userId);
            if (error) console.error("Muse tier update failed:", error.message);
          } catch (e) {
            console.error("Muse tier update error:", (e as Error).message);
          }
        }

        const stripeWebhookUrl = process.env.N8N_WEBHOOK_URL;
        if (stripeWebhookUrl) {
          await fetch(stripeWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: "checkout.session.completed",
              customer: session.customer,
              email: session.customer_details?.email,
              plan,
            }),
          }).catch(() => {});
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        try {
          const sb = getServiceClient();
          const customerId = sub.customer as string;
          const customer = await stripe.customers.retrieve(customerId);
          const email = "email" in customer ? customer.email : null;
          if (email) {
            await sb.from("muse_profiles").update({ tier: "free" }).eq("email", email.toLowerCase());
          }
        } catch (e) { console.error("[webhook:subscriptionDelete]", (e as Error).message); }
        const stripeWebhookUrl = process.env.N8N_WEBHOOK_URL;
        if (stripeWebhookUrl) {
          await fetch(stripeWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: "customer.subscription.deleted",
              customer: sub.customer,
              subscription_id: sub.id,
            }),
          }).catch(() => {});
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[webhook] Error:", (e as Error).message);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 });
  }
}
