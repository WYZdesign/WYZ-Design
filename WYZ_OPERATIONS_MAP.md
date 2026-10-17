# WYZ Design — Operations Map (Intake → Repeat Work)

**Owner:** Torreé Marcel · **Author:** WYZMiND · **Reviewed by:** Codex · **Updated:** 2026-10-17
**Purpose:** board task #5 (WYZMiND half). Single view of how a stranger becomes a paying,
delighted, referring client — built from code evidence in this repo, not assumptions.
Status key: `VERIFIED` (tested this session) · `IMPL` (code present, not independently tested) · `GAP` (missing).

## The pipeline

| # | Stage | What exists (evidence) | Status | Gap / next |
|---|-------|------------------------|--------|-----------|
| 1 | **Attract** | SEO metadata across page set, sitemap, 40+ pages (services, merch, events, blog, case-studies, portfolio), `src/lib/seo.ts` | IMPL | No channel attribution — board #4 |
| 2 | **Inquire** | `/contact`, `/partnerships`, `/service-page`, dynamic forms → `POST /api/forms` (CSRF + rate-limited), newsletter → `POST /api/newsletter` (Resend), WYZi chat → `/api/chat`, bugs → `/api/bugs` | VERIFIED (forms path in E2E suite) | Lead source capture in form payloads = GAP |
| 3 | **Consult / book** | `/booking`, `/booking-calendar`, `POST /api/booking/email`, daily follow-up cron `POST /api/cron/booking-whatsnext` (0 16 UTC), `POST /api/event` | IMPL | Booking→CRM handoff not visible in code = GAP |
| 4 | **Pay** | Stripe: `POST /api/checkout`, signed `/api/webhook`, subscriptions on `/plans`, gift cards, and a Printful-backed merch store with cart, Stripe Checkout, order records, confirmation, and Printful fulfillment | VERIFIED | Pricing canon is approved and inventory-locked. Keep payment-path smoke checks read-only unless Torreé authorizes a transaction. |
| 5 | **Deliver** | Photos: `gdrive-index/photos/image` + `album-images` + `upload`; merch: Printful fulfill; web/design: repo + client handoff. Delivery events, client communication preferences, and `/api/cron/delivery-outreach` are live. | IMPL | Stage 1 outreach is enabled. Stages 2 through 4 remain intentionally off until their content and cadence are approved one at a time. |
| 6 | **Review / proof** | `/community`, `/blog`, `/case-studies`, `/gallery`, `/featured-artist`, plus the delivery-outreach sequence | IMPL | The technical review-request path exists. Public testimonials still need owner-provided original review links or permission records. |
| 7 | **Refer** | `/referral` + `GET/POST /api/referral`, `/api/referral/conversions`, `/api/referral/leaderboard` (initials-only, random codes), gift cards, and delivery-stage outreach | IMPL | Verify referral wording and timing after enough real delivery records exist. |
| 8 | **Repeat** | Zeal loyalty (`/api/zeal/earn|redeem|status`, `/loyalty`, `/3pointprogram`), newsletter re-engagement, `/events` calendar, merch drops, and staged delivery outreach | IMPL | A dedicated lapsed-client win-back campaign remains a future commercial decision. |
| 9 | **Operate** | Admin (`/admin`, `admin-auth.ts`), analytics (Redis pageviews `analytics.ts`), bookkeeping (`/api/bookkeeping`), telemetry, NSFW scan/verify, health/status, error tracker | IMPL | Conversion/revenue dashboards = board #4 |

## Systems split (keep claims honest)

- **Public `wyzdesign.com/wyzmind`** = product-positioning page (narrative + explainer).
- **Local Command Center (`W:\WYZ_Command_Center`)** = the real ops layer: bridge `:8000`
  (`/api/intake`), n8n (18 workflows), Qdrant vectors, Redis queue, lead engine (20K+ leads),
  vault. Internal only — do not claim client-facing capability until it exists (WYZ_AI_HANDOVER.md rule).

## Top profitability gaps (evidence-ranked)

1. **Board #4:** no owner-authorized attribution dashboard evidence, so channel quality cannot be measured end to end.
2. **Public proof:** testimonials need original sources or permission records before they can carry conversion weight.
3. **Stage 3:** booking is not visibly tied to a CRM or durable lead state.
4. **Stage 5-8:** delivery outreach is live, but only stage 1 is intentionally enabled; later stages should be activated from real results, not assumptions.
5. **Win-back:** no dedicated lapsed-client campaign has been approved.

## Next actions

- Owner: provide or authorize attribution-dashboard evidence for board #4, and provide original testimonial sources or permission records.
- WYZMiND: monitor stage 1 delivery outreach before enabling later stages; retain the existing consent and cadence gates.
- Codex: keep the map aligned with deployed evidence and preserve read-only verification for live payment flows.
