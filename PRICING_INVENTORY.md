# PRICING & CTA INVENTORY (board #2, 2026-10-15)

Source of truth: `PRICING_CANON_DECISION.md` (APPROVED 2026-10-11). This file inventories
every customer-facing price, plan, and payment CTA against that canon and records the
reconciliation. Rendered-only changes; no payment logic was altered.

## Subscription plans (`/plans`, `PRICING_CANON_DECISION.md`)

| Plan | Canon | `/plans` | Status |
|---|---|---|---|
| Starter Pack | $250 / month | $250 | MATCH |
| Business Boost | $500 / month | $500 | MATCH |
| Pro Plus | $750 / month | $750 | MATCH |
| Ultimate Suite | $1,000 / month | $1,000 | MATCH |
| Cadence | monthly only, auto-renew, cancel anytime | "Billed monthly, cancel anytime"; "All subscription plans auto-renew monthly" | MATCH |

Non-canon plans (Startup $500 / Artist $250 / Enterprise $750 per month) were removed
2026-10-15. `/plans` now shows the approved catalog only. No "quarterly" claim exists
anywhere in `src`.

## Individual services (`/services`, `/booking` display; `/booking` payment)

Canon service rules: Photoshoot $100/hr (1hr $100, 2hr $200, half day 4hr $350); Event
photography $200 up to 4hr ($350 4-8hr, $150 second shooter); Photo retouching from $15
basic / $35 advanced; Graphic design $150 / 3hr; Product photography $120; Creative
consultation free 30 min; complex/custom scope = quote.

| Service | Site (services card) | Canon | Status |
|---|---|---|---|
| Photoshoot | $100 | $100/hr | MATCH |
| Event Photography | $200 | $200 (up to 4hr) | MATCH |
| Product Photography | $120 | $120 | MATCH |
| Creative Consultation | Free | Free 30 min | MATCH |
| Graphic Design | $75+ | $150 / 3hr | **FIXED to $150** (services + booking display) |
| Photo Retouching | $50 | from $15 basic | **FIXED to "from $15"** (services card; booking already said "from $15") |
| Logo Design $100, Brand Identity $300, Social Media Kit $200, Business Card $75, Flyer $75 | listed | canon silent (custom/quote) | LISTED PRICE, canon does not govern |
| Video Shoot $200, Video Editing $200, Motion Graphics $150, Music Video $350, Short Form $100, Event Recap $250 | listed | canon silent | LISTED PRICE, canon does not govern |
| Logo/Marketing Consultation $50, Brand Strategy $75, Content Planning $50, Launch Strategy $75 | listed | canon silent | LISTED PRICE, canon does not govern |
| Website Design $500, SEO Audit $50, Landing Page $250, E-Commerce $400, Website Redesign $350, Maintenance $75 | listed | canon silent | LISTED PRICE, canon does not govern |

Payment map (`SERVICE_PRICES`, the only services that charge at checkout): Photoshoot
$100, Event Photography $200, Logo Consultation $50, Marketing Consultation $50, SEO
Audit $50. Every one agrees with the canon where the canon speaks; the two services that
were out of line (Graphic Design, Photo Retouching) are quote-based and not in the
payment map, so the fixes are copy-only.

## Deposit / booking

- "50% deposit confirms all bookings; fixed-price services are payable at checkout"
  (canon). `/booking` collects the request and charges only the fixed-price services above
  via `/api/checkout`; consistent.

## Gift cards / merch

- Gift cards: 24 months from purchase, services and merch (`/gift-card`, confirmation
  email, Stripe line, `lib/gift-cards.ts`). MATCH.
- Merch: live Stripe checkout + Printful fulfilment (verified live). MATCH.

## Follow-up

- The "canon silent" rows are real, live service prices the canon does not name. If any
  should move or become quote-only, extend `PRICING_CANON_DECISION.md` and reconcile then;
  they are not currently in conflict with the canon.
- Regression locks live in `src/app/a11y-mobile-gate.test.tsx` (`pricing canon` block):
  plan names/prices/monthly cadence and the two fixed service prices.
