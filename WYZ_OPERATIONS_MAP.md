# WYZ Design — Operations Map (Intake → Repeat Work)

**Owner:** Torreé Marcel · **Author:** WYZMiND · **Date:** 2026-10-02
**Purpose:** board task #5 (WYZMiND half). Single view of how a stranger becomes a paying,
delighted, referring client — built from code evidence in this repo, not assumptions.
Status key: `VERIFIED` (tested this session) · `IMPL` (code present, not independently tested) · `GAP` (missing).

## The pipeline

| # | Stage | What exists (evidence) | Status | Gap / next |
|---|-------|------------------------|--------|-----------|
| 1 | **Attract** | SEO metadata across page set, sitemap, 40+ pages (services, merch, events, blog, case-studies, portfolio), `src/lib/seo.ts` | IMPL | No channel attribution — board #4 |
| 2 | **Inquire** | `/contact`, `/partnerships`, `/service-page`, dynamic forms → `POST /api/forms` (CSRF + rate-limited), newsletter → `POST /api/newsletter` (Resend), WYZi chat → `/api/chat`, bugs → `/api/bugs` | VERIFIED (forms path in E2E suite) | Lead source capture in form payloads = GAP |
| 3 | **Consult / book** | `/booking`, `/booking-calendar`, `POST /api/booking/email`, daily follow-up cron `POST /api/cron/booking-whatsnext` (0 16 UTC), `POST /api/event` | IMPL | Booking→CRM handoff not visible in code = GAP |
| 4 | **Pay** | Stripe: `POST /api/checkout`, `POST /api/webhook` (signed), `/api/stripe-status`, subscriptions on `/plans`, gift cards (`/gift-card`), merch checkout + Printful (`/api/printful-catalog`) | IMPL | Production revenue-path proof = board #12 (Codex); pricing canon = board #1 (owner) |
| 5 | **Deliver** | Photos: `gdrive-index/photos/image` + `album-images` + `upload`; merch: Printful fulfill; web/design: repo + client handoff (manual) | IMPL | Automated delivery-confirmation email = GAP |
| 6 | **Review / proof** | `/community`, `/blog`, `/case-studies`, `/gallery`, `/featured-artist` | IMPL | No review-request flow (ask + collect testimonial) = **GAP** |
| 7 | **Refer** | `/referral` + `GET/POST /api/referral`, `/api/referral/conversions`, `/api/referral/leaderboard` (initials-only, random codes), gift cards | IMPL | Referral touchpost-delivery = GAP |
| 8 | **Repeat** | Zeal loyalty (`/api/zeal/earn|redeem|status`, `/loyalty`, `/3pointprogram`), newsletter re-engagement, `/events` calendar, merch drops | IMPL | Win-back campaign for lapsed clients = GAP |
| 9 | **Operate** | Admin (`/admin`, `admin-auth.ts`), analytics (Redis pageviews `analytics.ts`), bookkeeping (`/api/bookkeeping`), telemetry, NSFW scan/verify, health/status, error tracker | IMPL | Conversion/revenue dashboards = board #4 |

## Systems split (keep claims honest)

- **Public `wyzdesign.com/wyzmind`** = product-positioning page (narrative + explainer).
- **Local Command Center (`W:\WYZ_Command_Center`)** = the real ops layer: bridge `:8000`
  (`/api/intake`), n8n (18 workflows), Qdrant vectors, Redis queue, lead engine (20K+ leads),
  vault. Internal only — do not claim client-facing capability until it exists (WYZ_AI_HANDOVER.md rule).

## Top profitability gaps (evidence-ranked)

1. **Board #1 → #2:** no pricing canon; price language historically inconsistent (trust risk).
2. **Stage 6 GAP:** zero automated review/testimonial collection = weakest proof loop.
3. **Board #4:** no lead attribution — cannot tell which channel pays.
4. **Stage 3 GAP:** booking not tied to any CRM/lead state (follow-up cron exists, state does not).
5. **Stage 5 GAP:** no delivery-confirmation → review-ask → referral-ask sequence (the money loop).

## Next actions

- Codex: board #12 (verify stage 4 live, read-only) and #7 (loading/error/empty states on stages 2-4).
- Owner: board #1 pricing canon unlocks #2; board #4 analytics access.
- WYZMiND: available to spec the stage 5→6→7 sequence (delivery-ask automation) once #1 lands.
