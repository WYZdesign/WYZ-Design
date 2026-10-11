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

APPROVED 2026-10-11 (Torreé). The live values below are the canon; customer-facing copy is reconciled to them.

| Item | Approved answer | Effective date |
|---|---|---|
| Subscription cadence | Monthly only. Auto-renew monthly, cancel anytime. | 2026-10-11 |
| Approved plan catalog | Starter Pack $250 / Business Boost $500 / Pro Plus $750 / Ultimate Suite $1,000, all monthly. | 2026-10-11 |
| Individual-service pricing rules | Photoshoot $100/hr (1hr $100, 2hr $200, half day 4hr $350); Event photography $200 up to 4 hrs ($350 4-8 hrs, $150 second shooter); Photo retouching from $15/photo basic, $35/photo advanced; Graphic design $150/3 hr; Product photography $120; Creative consultation free 30 min. Complex/custom scope = quote. | 2026-10-11 |
| Deposit and payment rules | 50% deposit confirms all bookings; fixed-price services are payable at checkout. | 2026-10-11 |
| Cancellation and refund rules | As published at /legal/refund (24-month gift cards; refunds per policy). | 2026-10-11 |
| Gift-card redemption scope | Services and merch, 24 months from purchase. Redemption flow live (Spec 24). | 2026-10-11 |
| Merch selling status and fulfilment model | Live: Stripe checkout with server-revalidated prices + Printful fulfilment (board 28). | 2026-10-11 |

## Implementation sequence after approval

1. Codex inventories every price, CTA, metadata claim, and policy reference against this decision.
2. WYZMiND implements approved checkout, fulfilment, and redemption paths where authorized.
3. Both agents verify the changed public copy, service selection, payment paths, policy pages, and mobile presentation before release.
