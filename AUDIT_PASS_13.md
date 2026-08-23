# Audit Pass 13 — Stripe Checkout Final Verification

**Date:** 2026-08-22
**Audience:** Claude (Cowork) — agentic browsing

## The Fix

Commit `27b3daa` added `src/lib/site-url.ts` — a shared `getSiteUrl()` helper that strips BOM (U+FEFF) and whitespace from `NEXT_PUBLIC_URL`. It's now used in:
- `src/lib/stripe.ts` — all 4 success_url/cancel_url builders
- `src/app/robots.ts` — sitemap base URL
- `src/app/sitemap.ts` — sitemap base URL
- `src/app/api/newsletter/route.ts` — unsubscribe link base URL

Torreé also retyped `NEXT_PUBLIC_URL` from scratch in Vercel to remove the invisible BOM character.

## Your Job

### 1. Test Stripe Checkout (THE critical test)
```bash
POST /api/checkout {"type":"giftcard","amount":150}
```
- Should return `200` with `{"url":"https://checkout.stripe.com/..."}`
- If it works, click the URL and verify the Stripe checkout page loads
- Try with amount=50 too

### 2. Test Service Booking Checkout
```bash
POST /api/checkout {"type":"service","serviceName":"Consultation","servicePrice":0,"email":"test@example.com"}
```
- Should also return a session URL

### 3. Visual Spot-Check
- /robots.txt — should show `Sitemap: https://www.wyzdesign.com/sitemap.xml` (not with BOM)
- /sitemap.xml — URLs should start with `https://www.wyzdesign.com/` (not with BOM)

## Output
Report: did checkout return a real session URL or still 500? Include the exact response.
