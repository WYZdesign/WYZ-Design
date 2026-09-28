# WYZ Design — expanded 2,000-point audit

**Framework:** 20 categories × 10 subcategories × 10 leaf checks = **2,000 checks**. This doubles the 1,000-point rubric in `WYZDESIGN_1000_POINT_COMPREHENSIVE_AUDIT_2026-09-28.md` by splitting every one of its ten categories into two independently-scored halves: navigation vs. conversion paths, mobile shell vs. mobile content/overlays, core semantics vs. widget/a11y automation, component state vs. rendering/code health, core APIs vs. admin/integrations, auth controls vs. abuse/privacy, pricing truth vs. disclosure/commerce data, Supabase persistence vs. records/retention, frontend perf vs. reliability, and quality gates vs. release operations — so merch/Printful pricing, Zeal/referral reward surfaces, booking cron, the community demo, and content integrity each sit under their own scored line instead of hiding inside a broader category.

**Current evidence-based score: 1,241 / 2,000 (6.21 / 10).** This is a direct representation of the 620.5/1,000 calibrated score in `WYZDESIGN_1000_POINT_COMPREHENSIVE_AUDIT_2026-09-28.md` — each category /100 = its row-average mean × 10, and the 2,000 total = 2 × 620.5 = 1,241 — not an invented precision claim. Every point must be supported by source, test, live, or production evidence.

**Evidence states:** a line is marked **proven**, **source-only**, **test-only**, **live-proven**, **production-proven**, or **open** in future passes; this first pass records the evidence basis honestly instead.

| # | Expanded category | /100 | Evidence basis | Highest-value next proof |
|---:|---|---:|---|---|
| 1 | Navigation, account & discovery | 63.4 | source + 20-route mobile captures | End-to-end nav/search/account regression on deployed SHA |
| 2 | Primary conversion paths (plans, booking, forms, checkout) | 61.4 | source + live form/checkout E2E | Plans -> checkout -> account happy-path + negative matrix |
| 3 | Mobile layout: shell & core pages | 65 | live 390/320 screenshot audit | Post-remediation 20x2 capture re-run with zero-defect sign-off |
| 4 | Mobile layout: content pages, footer & overlays | 62 | live 390/320 screenshot audit | FAB/overlay stacking + community 320 fix verification |
| 5 | Core semantics, forms & dialogs | 69 | source + ledger (rounds 16-20) | axe run with landmark/heading/dialog assertions |
| 6 | Widget accessibility, contrast & a11y automation | 62 | source; no automation yet | axe-core CI job failing on new violations |
| 7 | Component boundaries, providers & state | 57 | source audit | Provider memoization + hook-level tests |
| 8 | Rendering architecture, dependencies & code health | 48.4 | source audit | Delete 51 orphan metadata.ts + dependency slim-down proof |
| 9 | Core API contracts & validation | 68.4 | source + focused E2E | Per-route contract test matrix (4xx/5xx/2xx) |
| 10 | Admin, cron & integration APIs | 61 | source + cron E2E | CSRF-closed admin mutations + webhook replay test |
| 11 | Authentication, authorization, CSRF & XSS | 69.2 | source + deploy checks | Deployed negative matrix (no-token/foreign-origin/CSP) |
| 12 | Abuse controls, privacy & supply-chain security | 67.4 | source; deps unverified | Full IP-hash sweep + merged dependabot PRs + PAT rotation |
| 13 | Pricing, billing & content truth | 56.6 | source (ledger E-H2/E-H3/E44) | Price single-source-of-truth module + freshness cron |
| 14 | Disclosure, brand policy & commerce data | 68.6 | source + live catalog probe | Emoji/em-dash CI check + product price E2E |
| 15 | Supabase persistence, access & incident recovery | 62.6 | live-proven (incident closure) | Two-identity RLS matrix in production |
| 16 | Records, retention & backup lifecycle | 54 | source + table creation proof | Retention job + restore drill evidence |
| 17 | Frontend performance (scripts, images, fonts) | 55.8 | source (ledger 3.x + I-H1) | sizes/priority lint rule + font-display swap + Web Vitals capture |
| 18 | Reliability, error UX & observability | 59.6 | live status + capture; no budgets | Sentry alert thresholds + perf budget gate in CI |
| 19 | Type/lint/test quality gates | 58.8 | source (2 test files) | Vitest suites per API route + Playwright E2E smoke |
| 20 | CI, deploy verification & release operations | 70.8 | source + deploy READY proof | Rollback drill + exact-SHA post-deploy probe in CI |

## Expanded leaf-check catalog

Each category is assessed using ten subcategories, each with ten concrete checks. These are the active 2,000 audit points; a point is marked **proven**, **source-only**, **test-only**, **live-proven**, **production-proven**, or **open** in future passes.

1. Navigation & discovery: navbar links, hamburger menu, footer sitemap, theme toggle, search entry, breadcrumb absence, active nav state, skip link, scroll-to-top, load-at-top.
2. Conversion paths: plan card CTAs, booking form submit, contact submit, checkout session, referral entry, gift-card purchase, newsletter signup, trust bar CTA, confirmation feedback, redirect safety.
3. Mobile shell: 320 grid, 375 grid, 390 grid, 768 grid, safe areas, 44px targets, text scaling, document overflow, reduced motion, visual hierarchy.
4. Mobile content & overlays: footer clearance, FAB stacking, fixed-header occlusion, word-break headings, grid truncation, label sizes, select sizes, marquee bleed-by-design, long-word handling, orientation.
5. Semantics & forms: landmarks, heading levels, form names, label/id pairs, fieldsets, error association, status regions, lists, alt text, link purpose.
6. Widget a11y & automation: flip-card semantics, tab/filter pressed states, contrast pairs, focus rings, axe coverage, screen-reader pass, target sizes, motion guards, zoom to 200%, heading word-break.
7. Component & state: boundaries, prop contracts, hooks, providers memoization, derived state, effect cleanup, fetch abort, race handling, storage guards, test seams.
8. Rendering & code health: route structure, static params, error boundaries, loading boundaries, dependency weight, orphan files, keyframe consolidation, dead exports, docs currency, bundle budget.
9. Core APIs: auth, validation, authorization, contracts, errors, rate limits, idempotency, consistency, logging, tests.
10. Admin & integrations: admin authz, CSRF, bookkeeping math, cron auth, Stripe webhook, Printful caching, Resend Svix, telemetry, search caps, chat guards.
11. Auth & XSS: secrets, session, admin lockout, CSRF matrix, CSP prod, CSP report-only, sanitizer use, constant-time compares, header config, negative matrix.
12. Abuse & privacy: rate-limit TTL, IP hashing coverage, PII in logs, consent gating, analytics flags, dependency scanning, dependabot merges, PAT rotation, secret scanning, audit trail.
13. Pricing truth: home cards, pricing page, plans page, calculator, FAQ, booking map, chat knowledge, service flips, add-ons, drift tests.
14. Content & commerce: demo disclosure, em-dash ban, emoji policy, brand naming, CTA copy, sitemap, robots, product prices, stock states, meta descriptions.
15. Supabase & recovery: schema, RLS, table creation, incident runbook, env key hygiene, status truth, query round trips, indexes, migrations, access matrix.
16. Records & retention: Stripe rows, email log, gift cards, bookkeeping, retention job, cleanup, backup, restore drill, export, governance inventory.
17. Frontend perf: inline scripts, image sizes/priority, font display, third-party loading, memoization cost, animation cost, caching headers, asset immutability, preload budget, CLS.
18. Reliability & ops: error recovery, skeletons, empty states, monitoring, status page, Sentry wiring, Web Vitals, runtime JS errors, overflow regression, perf budgets.
19. Quality gates: typecheck, lint, unit, integration, contract, E2E, visual, accessibility, coverage thresholds, build reproducibility.
20. Release operations: CI order, deploy probe, SHA verification, rollback drill, env scoping, release records, ledger discipline, alerting, incident runbooks, post-deploy QA.

## Rules for reaching 2,000 / 2,000

- A code change earns at most **source-only** credit until a relevant test proves it.
- A local test earns at most **test-only** credit until an equivalent deployed behavior is confirmed where deployment matters.
- Credentials, migrations, provider configuration, and production storage behavior require direct non-secret proof; they cannot be assumed from repository code.
- No release claim is valid until the final deployed SHA equals the reviewed commit and its health checks pass.

## Evidence updates — 2026-09-28 (post-baseline)

- **Supabase production incident — closed, production-proven.** Root-cause chain fixed end to end: (1) BOM (U+FEFF) at index 0 of prod `SUPABASE_SERVICE_ROLE_KEY` killed every query at header build; (2) prod `NEXT_PUBLIC_SUPABASE_URL` pointed at the Muse project (`Invalid API key`); (3) WYZ-Design project was paused (NXDOMAIN). Fixed via Vercel env PATCH with clean values + project restore to `ACTIVE_HEALTHY`. Missing tables `email_log`, `stripe_events`, `gift_cards` created (RLS enabled, service-role access). Status-page false-green fixed: `checkZealDatabase` now throws on resolved supabase-js `error` instead of swallowing 401/PGRST205. E2E: form POST → 200 + row persisted (test row removed), cron 200/401 with/without secret, status zeal green, `wyz_deploy_check 43e2ba2... --project wyzdesign` → DEPLOY IS LIVE, preflight **29 PASS / 0 FAIL / 2 WARN**. Vault gotcha recorded: `wyz_vault.py --add` stores keys UPPERCASE, so `get()` is case-sensitive.
- **Mobile audit — measured, vision-verified.** 20 routes × 390px and 320px captured at `W:\WYZ_Command_Center\_STATE\web_shots\mobile\`: **zero JS errors**, **zero document-level horizontal overflow** except `/plans` **+4px** and `/community` **+13px** at 320px. Confirmed defects: community channel header word-break + grid-cols-2 hard truncation @320, footer copyright occluded by fixed scroll-top + chat FABs, ~10px labels (merch categories, home stat labels, plans add-ons, printing unit prices, web-design categories), fd selects <44px, letter-spaced display headings ("GALLERY", "SYSTEM STATUS") breaking mid-word at both widths. Remediation is in progress during this session — scores in categories 3/4 assume the fixes land and re-verify; nothing is credited until the post-fix capture matrix passes.
- **Security rounds 17-23 remain deployed** (Svix, server-derived userId, Upstash zeal adapter, randomized referral codes, CSP unsafe-eval removal, IP hashing, CSRF on 14 routes, constant-time compares, TTL race fix, GTM consent, integer cents, leaderboard initials). Open: CSRF on admin/bookkeeping mutations, raw IPs in newsletter/referral/chat/telemetry, dependabot PRs unmerged, PAT rotation pending. No score above 79 in categories 11/12 until those close.
