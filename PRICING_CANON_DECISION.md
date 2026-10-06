# WYZ Design Pricing and Billing Decision Brief

**Decision owner:** Torreé Marcel  
**Purpose:** establish one approved source of truth before customer-facing price, billing, or policy copy is changed.

## Decisions needed

1. Which subscription billing terms are actually offered?
   - Monthly only
   - Quarterly only
   - Both monthly and quarterly

2. If subscriptions are offered, what are the approved plan names, prices, included deliverables, minimum term, cancellation process, and refund treatment?

3. Which individual-service prices are fixed checkout prices, which are starting prices, and which require a custom quote?

4. Is a 50% booking deposit the approved policy for every service that currently exposes immediate payment, or only selected project types?

5. Should gift cards be redeemable for services, merch, or both? This needs a real redemption flow before the public promise remains in place.

6. Should merch be purchasable on WYZ Design now? If yes, approve the payment and fulfilment model. If no, present it as a collection or catalog until checkout is live.

## Current evidence to reconcile

| Area | Customer-facing claim or behavior | Source |
|---|---|---|
| Subscription billing | “All plans auto-renew monthly. Cancel anytime.” | `/plans` |
| Subscription billing | “All subscription plans auto-renew monthly or quarterly.” | `/plans` |
| Plan catalog | Starter $250, Business $500, Pro $750, Ultimate $1,000 | `/plans` |
| Alternate plan copy | Startup $500/mo discounted, Artist $250/mo discounted, Enterprise $750/mo discounted | `/plans` source |
| Booking | Service selector presents a mix of fixed, hourly, starting, and custom prices; selected fixed services expose immediate payment | `/booking` |
| Photoshoot service detail | $100/hr standard session, $350 half day, $600 full day, and $75 rush delivery; page promises 20/60/120+ edited photos and five-business-day delivery | `/service-page/photoshoot` |
| Event photography service detail | $200 standard event up to four hours, $350 extended event four to eight hours, $150 second shooter; page promises 48-hour preview and five-day gallery delivery | `/service-page/event-photography` |
| Photo retouching service detail | Visible tiers are $15/photo basic, $35/photo advanced, and $12/photo for 10+ basic images; the page’s structured offer price is $50 | `/service-page/photo-retouching` |
| Creative consultation service detail | Advertised as a free 30-minute video or phone session, Monday–Saturday 10 AM–7 PM PT | `/service-page/creative-consultation` |
| Booking terms | 50% deposit required to confirm all bookings | `/terms-and-conditions` |
| Gift cards | Valid 24 months from purchase (approved 2026-10-06); redeemable for services or merch | `/gift-card`, `/refund-return-policy` |
| Merch | Store presentation and Printful catalog exist; no order or payment path exists | `/merch`, `/merch/[id]` |

## Approval record

Fill this in before task 2 changes any customer-facing money language.

| Item | Approved answer | Effective date |
|---|---|---|
| Subscription cadence |  |  |
| Approved plan catalog |  |  |
| Individual-service pricing rules |  |  |
| Deposit and payment rules |  |  |
| Cancellation and refund rules |  |  |
| Gift-card redemption scope |  |  |
| Merch selling status and fulfilment model |  |  |

## Implementation sequence after approval

1. Codex inventories every price, CTA, metadata claim, and policy reference against this decision.
2. WYZMiND implements approved checkout, fulfilment, and redemption paths where authorized.
3. Both agents verify the changed public copy, service selection, payment paths, policy pages, and mobile presentation before release.
