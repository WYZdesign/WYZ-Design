# WYZ Design — Production Readiness Audit

**Date:** 2026-09-28
**For:** Torreé
**Scope:** `V:\wyzdesign` (Next.js 16.2.6 App Router + Tailwind + Supabase + Upstash Redis + Stripe + Resend + Cal.com + Vercel), commit `43e2ba2`, live at wyzdesign.com.
**Method:** source review, local tests, live HTTP checks, and the 20-route mobile capture matrix (390px/320px) — same rubric as the Muse production-readiness audit. Section scores are the arithmetic mean of their listed sub-scores; the headline SCORE is the mean of the four section scores. All means computed by script.

---

## SCORE: 6.8 / 10

*Not a production sign-off. Security is shippable-grade; backend survived a real 48-hour incident closure with E2E proof; UX and performance are where a paying user would still feel friction. Section means: Security 8.0, UX/UI 6.5, Performance 5.7, Backend 7.0 → 6.797 → **6.8**.*

**Order to fix:** (1) price/billing canon → (2) axe + Playwright gate → (3) CSRF on admin/bookkeeping + PAT rotation → (4) inline-script diet → (5) skeletons/empty states.

---

## Security — 8.0 / 10

**WHAT'S DONE**
- Security rounds 17-23 all deployed: Svix webhook signature verification, server-derived `userId` (never client-trusted), Upstash zeal adapter, randomized referral codes, CSP `unsafe-eval` removal, IP hashing helper, CSRF middleware on 14 routes, constant-time string compares, TTL race fix, GTM consent gating, integer-cents money math, leaderboard initials-only.
- No hardcoded keys anywhere in `src/` — credentials via DPAPI vault / Vercel env only.
- Supabase production incident root-caused as env hygiene (BOM in service-role key, wrong project URL) — fixed via Vercel env PATCH with clean values, not code workarounds.
- Zero regressions today: this audit session touched no `src/` files.

**CRITICAL — none.**

### HIGH

| # | Issue | Impact | Effort |
|---|---|---|---|
| S1 | CSRF protection missing on admin + bookkeeping mutations (only 14 of the state-changing routes are covered) | Any origin can forge authenticated admin/bookkeeping writes from a victim's session | S — extend the existing middleware to the admin/bookkeeping route tree |
| S2 | Raw client IPs written in newsletter, referral, chat, and telemetry handlers | CCPA/GDPR exposure + unbounded PII in log storage; contradicts the IP-hashing standard set in round 21 | S — route all four through the existing hash helper |
| S3 | GitHub PAT rotation pending since last sweep — old repo-scoped token still assumed live in Vercel/secrets | Full-repo compromise window stays open indefinitely | S — owner rotates, update secrets (user-owned) |

### MEDIUM

| # | Issue | Impact | Effort |
|---|---|---|---|
| S4 | Dependabot PRs unmerged: next 16.3.1, jsdom, yet-another-react-lightbox, isomorphic-dompurify, @supabase/ssr | Known CVEs drift against a live commerce site | S–M — owner approves merges (user-owned) |
| S5 | Admin authz negative matrix not re-run for admin routes added after round 20 | A new admin endpoint could ship without its deny-path test | S — extend the existing negative test matrix |

---

## UX/UI — 6.5 / 10

**WHAT'S DONE**
- Visual identity is the site's strongest asset — vision pass over 22 captures shows consistent dark/gold system, working splash/scroll-lock, correct hero/marquee conventions, and readable pricing cards.
- Status page now tells the truth (`checkZealDatabase` throws on resolved supabase-js errors — false-green closed 2026-09-27).
- Mobile defect sweep completed today: 20 routes × 2 widths, zero JS errors, measured defects enumerated and fix-in-progress.

**CRITICAL — none.**

### HIGH

| # | Issue | Impact | Effort |
|---|---|---|---|
| U1 | Price/billing contradiction — E-H2 (home "Every 3 months. Cancel anytime." vs Pricing.tsx "$250 Every month" vs plans page mixed billing labels), E-H3/E44 (retouching "Varies" vs $50; design $75 vs $150) | Direct trust break on the money path; the single biggest reason a qualified lead bounces | M — extract `pricing.ts` single source + vitest contract test + `$`-literal grep gate (needs owner's canon decision first) |
| U2 | Zero automated accessibility testing — playwright in devDependencies but **0 spec files**, no axe run in CI | Every a11y fix (13 rounds) can regress silently on the next deploy | M — axe + Playwright smoke specs on the 20 audited routes |

### MEDIUM

| # | Issue | Impact | Effort |
|---|---|---|---|
| U3 | Footer copyright line occluded by fixed scroll-top + chat FABs at page end (mobile sweep, 390/320) | Legal/attribution line literally unreadable on mobile — measured today | S — bottom padding + FAB stack clearance *(fix in progress)* |
| U4 | ~10px labels: merch categories, home stat labels, plans add-ons, printing unit prices, web-design categories | Below readable minimum; hits conversion microcopy where decisions are made | S |
| U5 | Letter-spaced display headings break mid-word: "GALLERY", "SYSTEM STATUS" (390 *and* 320), community "WYZ DESIGN · CHANNELS" header (320) + grid-cols-2 channel truncation | Visible typographic breakage on flagship headings | S — `text-wrap: balance` / `overflow-wrap: normal` + grid rework *(fix in progress)* |
| U6 | No loading skeletons; error boundaries minimal — slow networks get blank regions (visible even in captures: booking embed, portfolio grids, merch images) | Perceived as "site broken" during exactly the moment a client is evaluating you | M — route-level skeletons + empty/error states |
| U7 | Residual a11y defects: my-account two `<h1>`, gift-card missing `aria-live`, ServiceFlipCard `div`-as-button, case-studies missing `aria-pressed`, `DF3131` text ≈ 4.48:1 (just under 4.5:1) | Screen-reader and contrast failures on money/contact surfaces | S each |

---

## Performance — 5.7 / 10

**WHAT'S DONE**
- Static-first route structure with SSG on the big marketing pages; deterministic merch metadata shipped.
- `next/image` used broadly; dark-mode color bug (`#C00000`) fixed in the same pass.

**CRITICAL — none.**

### HIGH

| # | Issue | Impact | Effort |
|---|---|---|---|
| P1 | ~57 inline scripts in root `layout.tsx` (~+300ms main-thread work before hydration) | TBT hit on every page load; worst on mid-tier mobile — the exact device wyzdesign's clients use | M — consolidate/move to `after()` or lazy injection |
| P2 | No real-user Web Vitals collection and no perf budgets in CI | Performance work is guesswork; regressions ship undetected | M — `web-vitals` reporter + CI budget step |

### MEDIUM

| # | Issue | Impact | Effort |
|---|---|---|---|
| P3 | ~40 `next/image` `fill` usages without `sizes` (I-H1) | Browser downloads desktop-size variants on mobile — silent bandwidth tax on LCP | S |
| P4 | Fonts loaded without `font-display: swap` | FOIT flash of invisible text on first paint | S |
| P5 | Heavy client deps (tfjs/nsfwjs) + unmemoized context providers re-render on every route change | Hydration cost and layout thrash beyond what the scripts alone cost | M |
| P6 | Caching headers / asset immutability verified only from source (U) — no live `Cache-Control` probe in CI | CDN behavior can drift per deploy unnoticed | S — add to deploy probe |

---

## Backend — 7.0 / 10

**WHAT'S DONE**
- **Supabase production incident: CLOSED with production evidence (2026-09-26/27).** BOM stripped from service-role key, `NEXT_PUBLIC_SUPABASE_URL` repointed WYZ-Design, project restored `ACTIVE_HEALTHY`, missing tables (`email_log`, `stripe_events`, `gift_cards`) created with RLS, status-page false-green fixed. E2E: form POST → 200 + persisted row (test row removed), cron `/api/cron/booking-whatsnext` → 200 with secret / 401 without, `wyz_deploy_check 43e2ba2... --project wyzdesign` → DEPLOY IS LIVE, preflight **29 PASS / 0 FAIL / 2 WARN**.
- Stripe integer-cents math, webhook idempotency branches (giftcard/referral) present in source; Upstash zeal adapter; Printful caching; Resend Svix; day-before booking whats-next cron.
- CI order correct: lint → typecheck → vitest → build (`.github/workflows/ci-cd.yml`).

**CRITICAL — none.**

### HIGH

| # | Issue | Impact | Effort |
|---|---|---|---|
| B1 | Money-path test coverage: only 2 test files exist (`api.test.ts`, `utils.test.ts`) — no integration test drives Stripe webhook idempotency or commission rounding end-to-end | A webhook double-fire or rounding drift ships silently into revenue | M — contract tests per Gate 3 of the 1,000-point audit |
| B2 | RLS enabled but the access matrix (service-role vs anon vs authenticated) never asserted by test | The exact class of failure that caused the December-style incident can recur unannounced | S — SQL asserts in CI against a scratch schema |

### MEDIUM

| # | Issue | Impact | Effort |
|---|---|---|---|
| B3 | No retention job, backup, or restore drill for the new `email_log` / `stripe_events` / `gift_cards` tables | Tables grow unbounded; restore path unproven (records/retention category scored 54/100 in the 2,000-point audit) | M |
| B4 | Community surface is demo-only — no persistence behind it | Marketed feature with no backend; retention loop unrealized | L — real auth + persistence, or relabel as demo |
| B5 | No error tracker wired (Sentry or equivalent); the status page is the only signal | Production errors are discovered by users, not by us | M |

---

## Growth gaps (owner + AI split)

| # | Gap | Owner of the fix |
|---|---|---|
| G1 | Google Analytics newsletter verification for the wyzdesign GA property — no verification record | Owner (needs email/record) |
| G2 | Google Business Profile still says Chicago — should be Los Angeles | Owner (profile edit) |
| G3 | Case studies lack share buttons — distribution loop ends at the reader | AI |
| G4 | Community is a demo — the retention/referral flywheel around it doesn't exist yet | AI (build) / Owner (scope decision) |
| G5 | Referral + Zeal surfaces are live but post-purchase/again-share flows unverified end-to-end | AI (E2E test) |
| G6 | Dependabot merges + PAT rotation gate security at 8.0, not 9.0 | Owner |

## Polish list

| # | Item |
|---|---|
| Q1 | FAB/scroll-top clearance so the footer copyright is readable at page end |
| Q2 | 10px → 14px minimum on all listed micro-labels |
| Q3 | Loading skeletons + empty/error states on booking, merch, portfolio, printing |
| Q4 | Word-break/balance on letter-spaced display headings (gallery, status, community) |
| Q5 | Delete or wire the 51 orphan `metadata.ts` files |
| Q6 | Consolidate ~57 layout inline scripts; add `sizes` to ~40 `fill` images; `font-display: swap` |
| Q7 | Sweep 8 TODO/FIXME and 11 `: any` occurrences |
| Q8 | fd-form select tap targets ≥ 44px |

## FILE AUDIT

| Metric | Value |
|---|---|
| TS/TSX source files | 319 |
| Test files | 2 (`api.test.ts`, `utils.test.ts`) |
| Playwright specs | 0 (dependency installed) |
| Largest files | `admin/page.tsx` 1,437 L · `community/page.tsx` 1,358 L · `home/page.tsx` 1,239 L · `merch/page.tsx` 845 L · `events/page.tsx` 820 L |
| `: any` occurrences | 11 |
| `console.log/debug` | 2 |
| TODO/FIXME | 8 |
| Orphan `metadata.ts` | 51 |
| Git commits (repo) | 427 — HEAD `43e2ba2` |
| `src/` changes this audit | 0 (read-only audit) |

---

## BOTTOM LINE

The backend is battle-tested by a real incident and closed with production proof; security is a disciplined program with three named holes (CSRF-admin, raw IPs, PAT). What blocks a 9 is not infrastructure — it's **truth on the money path (price canon), an automated accessibility/performance gate, and the mobile polish landing**. Fix U1→U2→S1→P1 in that order and this moves past 8.0 without new architecture.

**Self-check:** audit is read-only □ · every number script-computed □ · evidence codes traceable to the 1,000/2,000-point docs □ · no secrets printed □
