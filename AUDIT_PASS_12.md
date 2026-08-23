# Audit Pass 12 — Instructions for Claude

**Date:** 2026-08-22
**Audience:** Claude (Cowork) — agentic browsing + vision enabled

## Context

Torreé just rotated all Stripe keys and redeployed. The deploy should be live by the time you read this. Also, 5 critical security fixes just landed in commit `c00e1bd`.

## Your Job

Use your full agentic browsing + vision capabilities to:

### 1. Verify Stripe Checkout Works Now
- Go to https://www.wyzdesign.com/gift-card
- Select an amount, click "Buy Gift Card"
- Does the Stripe checkout page load? (It should now — keys were rotated)
- If it still 500s, check the network tab for the exact error
- Also try the booking flow: https://www.wyzdesign.com/booking → select a service → "Book Now"

### 2. Verify Security Fixes Lived
- Go to https://www.wyzdesign.com/api/pages?page=../../etc/passwd — should return 400 "Invalid page" now
- Go to https://www.wyzdesign.com/api/bookkeeping/meta — should return 403 "Forbidden" (no auth)

### 3. Visual Regression Check with Vision
Take screenshots of these pages and visually verify:
- /home — hero section, carousel images loading (not blank), CTAs visible
- /gallery — masonry grid should show actual photos (was 0-height before)
- /faq — each question should appear ONCE on desktop (was duplicated before)
- /blog — Unsplash images should load (was CSP-blocked before)
- /events — YouTube section should show marquee rows as animated background
- /printing — 3 flip cards should be shorter (less negative space)

### 4. Test Every Form Submission
- /contact → fill and submit → does it show success? Check Supabase `form_submissions` table
- /booking → fill and submit → does it work?
- /gift-card → does checkout work?
- /newsletter footer signup → does it work?

### 5. Check Console for New Errors
Open every major page with DevTools console open. Report any:
- CSP violations (red text in console)
- React errors
- Network failures
- JavaScript errors

### 6. Check Admin Dashboard
- Go to https://www.wyzdesign.com/admin → sign in
- Check Forms tab — are there any real submissions?
- Check Bookkeeping tab — does it load? (tables should exist in Supabase now)
- Check all other tabs for errors

### 7. Deep Code Audit (if time permits)
Look for any remaining issues in:
- `src/app/api/fd/events/route.ts` — missing try/catch on GET/POST handlers
- `src/app/api/telemetry/route.ts` — missing return statement in POST
- Any `console.warn`/`console.error` that should use the logger
- Any remaining `e.message` leaks in error responses

## Output Format

Produce `AUDIT_PASS_12_RESULTS.md` in the repo root with:
- Table of findings (Status | Issue | File | Severity)
- Screenshots of visual issues
- Console output from each page
- Stripe checkout test results
- Prioritized list of remaining issues
