# WYZ Design — Master Audit Framework

100 audit domains across 10 clusters (A-J). Each domain lists its live checkpoints.
Findings appended per-domain during execution with severity: [C] critical, [H] high, [M] medium, [L] low, [OK] clean.

---

## CLUSTER A — Frontend Architecture & Rendering

### A1. Server/Client Component Boundaries
- No "use client" on files lacking hooks/handlers/browser APIs
- Server components do not import client-only libs unnecessarily
- Metadata exported only from server files
- Client boundaries at leaf nodes where possible
- generateStaticParams coverage on dynamic routes
- dynamic/revalidate choices deliberate per route

### A2. Hydration Determinism
- No Date/Math.random/crypto in render path
- No storage/window reads during render
- Conditional browser-only rendering behind mounted flag
- Shuffle/random order identical SSR vs first client render
- Third-party widgets injected only in effects

### A3. Route Structure & Layouts
- Every route folder has intentional layout or inherits root cleanly
- /secret noindexed AND absent from sitemap
- not-found.tsx styled and linked
- error.tsx at root and risky segments; loading.tsx on slow routes

### A4. Metadata Generation
- Every public page has title + description
- OG/Twitter absolute URLs; canonicals per page
- viewport/themeColor correct light+dark
- JSON-LD valid, robots meta correct per page type

### A5. Code Splitting & Imports
- Heavy widgets lazy or justified eager
- Named icon imports only; framer-motion confined to animating components
- Admin bundle isolated from public pages

### A6. Error Boundaries
- Root + global-error exist with recovery actions
- Errors reported to tracker, never silently swallowed

### A7. Loading States
- Fetch-driven views have real initial states
- Skeletons match final shape
- Async buttons disable in flight; double-submit impossible

### A8. RSC Data Flow
- No fetch waterfalls; Promise.all for independent calls
- No duplicate DB hits per request across layout+page

### A9. Context Providers
- Provider order correct; values memoized
- No heavy work per render inside providers

### A10. Portals & Overlays
- Modals portal to body; scroll lock + restore
- Esc/backdrop close; Toaster mounted once globally

---

## CLUSTER B — Visual/UI Correctness

### B11. Typography Scale
- Display heading ramp consistent per breakpoint
- lineHeight 0.9 rule everywhere (never 0)
- tracking vocabulary consistent; body text readable on mobile

### B12. Spacing System
- Section padding rhythm consistent; containers map to intent
- Card padding consistent per family; no one-off magic margins

### B13. Light Palette Compliance
- Approved hexes only; banned grays (#8F8F8F/#888/#999) absent from white backgrounds
- Red reserved for action/accent semantics

### B14. Dark Mode Completeness
- bg-white pairs with #1C1C1E/#252528 by role
- text/border/shadow/gradient dark counterparts present
- Images legible on dark surfaces

### B15. Responsive Breakpoints
- No horizontal scroll at 390px anywhere
- Grids collapse sensibly at 768px; max-widths hold at 1440px
- Hero splits stack sensibly; nav overlaps nothing

### B16. Overflow & Clipping
- Flip faces fit containers at all breakpoints
- line-clamp on overflow-prone copy
- Long strings break properly; decorations pointer-events-none

### B17. Z-Index Layering
- Documented ladder (nav < modal < toast); no arms race
- Decorative layers behind content

### B18. Animation Smoothness
- transform/opacity-only animations
- rAF loops pause when hidden; durations from fixed vocabulary

### B19. Icon Consistency
- Fi set dominant; sizes consistent per role; currentColor inherited

### B20. Imagery & Aspect Ratios
- aspect wrappers prevent CLS; cover vs contain matches slot intent
- fill images inside positioned parents; alt text meaningful

---

## CLUSTER C — Interaction & Micro-UX

### C21. Button States
- hover/focus-visible/active/disabled styled everywhere
- Async buttons show loading; disabled reads as disabled
- Icon-only buttons labeled; touch targets >=44px

### C22. Form Input States
- Visible focus rings light+dark; error styling exists
- Labels or aria-labels present; autocomplete attrs on identity fields

### C23. Touch Targets
- Carousel arrows, accordions, close buttons, steppers all thumb-sized

### C24. Tap/Toggle Correctness (Mobile)
- Single-tap flips site-wide (hover-guard pattern)
- Carousels pause on touch; no hover-gated content on touch devices

### C25. Hover Affordances
- Hover previews have click equivalents on touch
- group-hover does not shift layout

### C26. Scroll Behavior
- Anchors respect fixed header offset; load-at-top enforced
- Scroll-to-top appears after threshold and works

### C27. Modals & Dialogs
- Esc/backdrop/X close; media stops on close; focus restores
- Body scroll locks; tall content scrolls internally

### C28. Toasts
- Success/error visually distinct; errors persist longer
- Messages human; Zeal toasts include amount + reason

### C29. Clipboard & Share Flows
- Copy confirms via toast; share links carry ref params
- Clipboard fallback for insecure contexts

### C30. Empty States
- Every list/grid guides next action when empty
- Search zero-results suggests alternatives

---

## CLUSTER D — Accessibility

### D31. Landmarks & Structure
- header/nav/main/footer present once; skip link targets main-content
- Real list semantics; sections labeled

### D32. Heading Hierarchy
- One h1 per page; no skipped levels; headings describe content

### D33. Keyboard Paths
- All interactions Tab-reachable
- Flip cards: tabIndex + Enter/Space toggle
- No keyboard traps outside intentional modal loops

### D34. Focus Visibility
- focus-visible styled site-wide, visible on dark; skip link appears on first Tab

### D35. ARIA on Custom Widgets
- role=button on clickable divs with key handling
- aria-expanded (accordions/menus), aria-current (nav/tabs)
- Progress/scroll indicators expose values where meaningful

### D36. Alt Text Quality
- Content images described; decorative alt=""
- Logos follow "{Name} logo"; no filename leakage

### D37. Contrast Verification
- #666-on-white AA; dark-mode opacity text only for secondary info

### D38. Reduced Motion
- Marquee/particles/parallax/gyro disabled under prefers-reduced-motion

### D39. SR Announcements
- Async result counts in polite live regions; toasts role-appropriate

### D40. Link Purpose
- Contextual labels for generic links; external links noopener + indication

---

## CLUSTER E — Content & Copy

### E41. Em-Dash Ban — zero em dashes user-facing
### E42. Tone & Contractions — personable voice; no corporate filler
### E43. Grammar Sweep — key pages typo-free; capitalization consistent
### E44. Factual Consistency
- Prices identical across services/home/calculator/chat KNOWLEDGE
- Plan prices/values identical across plans/home/calculator/chat
- Contact identical footer/contact/chat

### E45. Brand Naming — zero Silver/Gold/Diamond or Loyalty Program remnants
### E46. Placeholder Leftovers — no TODO/FIXME/console.log/test data shipping
### E47. Emoji Policy — none in code files
### E48. CTA Quality — one primary action per page; verb-led labels
### E49. Legal Pages — exist, reachable, dark-clean, contact consistent
### E50. Meta Descriptions — unique per page, under 160 chars

---

## CLUSTER F — Client State & Data Flow

### F51. useState Discipline
- Derived values computed not stored; setters never called during render
- Deterministic initial values for SSR

### F52. useEffect Correctness
- Complete deps; cleanup for every subscription/interval/listener/timeout
- Idempotent under double-invoke

### F53. Memoization Sanity — correct deps; no trivial memo cost
### F54. Fetch Patterns
- AbortController on unmount-prone calls; res.ok verified; JSON guarded

### F55. Client Races — latest-wins on search/autocomplete; submit guards intact
### F56. Rollback Semantics — failed actions revert state; earn failures don't burn session gates
### F57. Storage Guards — try/catch everywhere; namespaced keys; nothing sensitive stored
### F58. Cross-Tab — auth syncs acceptably; stale-privilege risk documented
### F59. URL State — params parsed defensively (?ref/?q); hash nav respects scroll-top
### F60. Global Value Stability — context identities stable across renders

---

## CLUSTER G — API Surface

### G61. Input Validation
- Every POST validates types, ranges, lengths before use
- Enum fields checked against whitelists
- Path/param strings sanitized (prefix checks, length caps)

### G62. AuthZ Coverage
- Every non-public route enforces session/admin correctly
- Admin actions check checkAdmin/requireAdmin; no action smuggling
- User-scoped data only readable by owner (or admin)

### G63. Rate Limiting
- Public write endpoints limited; expensive reads too
- Limits sized to legit traffic (documented per route)

### G64. CSRF — origin-checked on browser-facing mutations; server-to-server exempt deliberately
### G65. Response Contracts — frontend expectations match actual payloads field-for-field
### G66. Error Format Consistency — { error } JSON everywhere; no HTML error leaks
### G67. Status Codes — 400 validation /401 authn /403 authz /429 limits /500 real faults
### G68. Payload Bounds — array caps + string truncation on every list/string input
### G69. Injection Safety — parameterized Cypher/SQL only; no string interpolation into queries
### G70. Secrets Exposure — no keys/tokens in responses or client bundles

---

## CLUSTER H — Data Layer Integrity

### H71. Neo4j Constraints
- Uniqueness constraint on User.email (duplicate-node risk)
- MERGE patterns safe under concurrency
- Property writes non-breaking for existing nodes

### H72. Neo4j Atomicity
- Multi-write flows under locks where read-modify-write exists (zeal lock shipped)
- Tier recalculation correct after negative (spend) adjustments

### H73. Redis Key Policy
- Every key has deliberate TTL (cooldowns/once/locks/redemptions documented)
- No unbounded key growth

### H74. Redis Failure Surfaces
- Fail-open spots enumerated and accepted; fail-closed where money moves
- Ping/health exposed on /status

### H75. Supabase RLS — service vs anon client usage correct; tables not publicly writable
### H76. Supabase Schema — indexes on lookup columns; consistent field naming across tables
### H77. Stripe Webhook Idempotency — process-first ordering; retry-safe; giftcard/referral branches covered
### H78. Money Precision — integer cents handling; no float math on amounts
### H79. PII Hygiene — emails in logs minimized; no PII in analytics events beyond need
### H80. Export/Backup — CSV export works; critical stores recoverable or documented as at-risk

---

## CLUSTER I — Performance

### I81. LCP & Priority — hero images priority-correct site-wide; nothing below fold preloading
### I82. CLS Risks — dimensions reserved for media/embeds/fonts
### I83. Bundle Weight — heavy deps out of first load; admin split; barrel imports avoided
### I84. Video Strategy — posters present; preload=metadata default; autoplay muted+playsinline only
### I85. Image Optimization — next/image everywhere; sizes prop on fill grids; formats modern
### I86. Fonts — display swap; subset weights only; preloaded above-fold fonts
### I87. Third-Party Scripts — consent-gated; none render-blocking on first paint
### I88. Memory Leaks — listeners/intervals/observers cleaned on unmount (sweep)
### I89. List Virtualization — long galleries paginate or virtualize where >200 nodes
### I90. Caching & Headers — static assets immutable; API no-store where personal; ISR where stable

---

## CLUSTER J — Ops, Security & Compliance

### J91. Env Inventory — every referenced var documented; missing-var behavior graceful (no crash)
### J92. Crawling — robots.txt rules match reality; sitemap complete/accurate; noindex set on private pages
### J93. Security Headers — CSP report-only baseline; frame/xcto/referrer policies via next config or middleware
### J94. Dependencies — no known-vulnerable majors; unused deps flagged (cloudinary/novu removed)
### J95. Consent Gating — analytics/marketing scripts respect cookie consent flags fully
### J96. Admin Hardening — /admin rate-limited login; session checks on every admin surface; no user enumeration
### J97. Logging Hygiene — logger used; no secrets/PII; prod console clean
### J98. Monitoring — /status accurate; errorTracker wired; health endpoint truthful
### J99. Deploy Config — vercel.json maxDuration/regions sane; env scoping correct prod/preview
### J100. Resilience — dead-service fallbacks (chat Ollama, Redis fail-open, DB try/catch) verified end-to-end

---

## Execution Log

### Wave 1 — Clusters A-E (rendering, visual, interaction, a11y, content)
**Status:** IN PROGRESS

### Wave 2 — Clusters F-J (state, APIs, data, performance, ops)
**Status:** PENDING

### Findings Ledger

**Wave status:** Clusters A-J audited by 5 parallel agents. Consolidated priorities below (full per-checkpoint tables in session transcripts). Live-bug fixes from Claude's browser audit folded in first.

#### FIXED ALREADY (this wave)
| Sev | Finding | Fix |
|-----|---------|-----|
| C | Cal.com embed crash on /booking: stub never created ns.booking synchronously -> TypeError, widget never mounted (revenue path) | Faithful official embed pattern: init creates namespace API stubs sync; guard against double-init |
| H | Merch carousel tiles linked every product to /featured-artist | Links to /merch/{id} |
| H | /account/my-account redirected ALL users incl. customers to /admin login | Real account page: sign-in prompt when logged out; Zeal balance/tier card + CTAs when signed in |
| C | novu.ts deleted as "dead" broke forms route build (grep regex missed import; Discord alert already covered same payload) | Import+call removed; lesson: verify imports via compiler, not grep alone |

#### CRITICAL
| ID | Domain | Finding | Status |
|----|--------|---------|--------|
| G-C1 | H73/74 | Zeal Redis split-brain: ioredis targeted REDIS_HOST (localhost) unreachable on Vercel -> cooldowns/locks fail-open AND redemption records could vanish after deduction. Confirmed live by Vercel 5xx alert: 100% failures on /api/zeal/earn across deployments, sub-200ms sync throws from client construction called outside try blocks, zero server logs (logger dev-gated). | **FIXED** `6a031cd`: getRedis() now returns an ioredis-compatible adapter backed by @upstash/redis REST when UPSTASH_REDIS_REST_* present (same store as rate limiting), ioredis only as local-dev fallback; getRedis() calls moved inside try/catch everywhere; redemption record persists BEFORE point deduction with orphan-record compensation on deduct failure; earn route 500s now carry a short error signature so future incidents are diagnosable; ioredis fallback attaches a no-op error handler (prevents bare-error-event crashes); /status Redis check works against both backends. **Requires UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN in Vercel prod env (already used by rate limiter).** |

#### HIGH
| ID | Domain | Finding |
|----|--------|---------|
| A-H1 | A4 | Root layout canonical inherited by ~9 public routes -> mass canonical-to-homepage deindexation signal; remove root canonical or add per-page |
| A-H2 | A6 | error.tsx auto-reset loop every 1.2s unconditionally; neither error file reports to tracker |
| C-H1 | D33 | Flip cards keyboard-dead on home/services/printing/photography (no tabIndex/role/onKeyDown) |
| C-H2 | D34-adjacent | 5 modals lack Esc close (AlbumModal, ImagePicker, StrategyWizard, FDDriveBrowser preview, fd lightbox); zero focus-return-to-trigger site-wide |
| C-H3 | C22 | Zero autocomplete attrs on identity inputs; DynamicForm htmlFor has no matching input id |
| C-H4 | D35 | aria-current never used site-wide; nav/tab active state invisible to SRs |
| C-H5 | D38 | JS-driven motion (marquee/particles/gyro/cursor/glow) ignores prefers-reduced-motion |
| E-H1 | E44 | Plan identity split-brain: home sells Creator Access/Growth Retainer/etc while plans/calculator/chat sell Starter Pack/Business Boost/etc |
| E-H2 | E44 | Billing contradiction on home plan card ("Every 3 months" + "Monthly") vs plans page "Valid for 3 months" |
| E-H3 | E44 | Photo retouching "Price Varies" on home flip vs $50 everywhere else |
| G-H1 | H71 | No Neo4j uniqueness constraint on User.email anywhere; concurrent MERGE can duplicate users/split balances |
| G-H2 | G62 | /api/webhook/resend verifies no Svix signature -> forgeable unsubscribes |
| G-H3 | G62 | Checkout trusts client userId; webhook writes muse tier by it -> derive server-side from session/email |
| G-H4 | G61 | concept-generate forwards uncapped unvalidated text to paid OpenRouter |
| I-H1 | I81/I85 | Grid-wide image priority stragglers + ~40 fill images without sizes -> preload flood + 100vw overserving |
| J-H1 | J99 | vercel.json cron hits /api/backup which does not exist -> guaranteed daily 404 |
| J-H2 | J92 | Sitemap missing public pages: /booking, both booking-calendars, /merch/concepts, /match, splash pages, /merch/[id] products |

#### MEDIUM (top of stack)
ZealProvider/ThemeProvider/VideoMute context values unmemoized (site-wide re-render churn); banned grays resurfaced (#888/#999 spots listed); FAQ accordion maxHeight clips long answers; ScrollProgress animates width per frame; z-ladder doc-only; duplicate themeColor metas; 6 routes missing title/desc; no generateStaticParams on finite dynamic routes; ImagePicker silent upload failures; Esc missing on Navbar menu/ChatWidget/ImagePicker; toast errors dismiss at 4s like successes; SocialShare copy silent-catch + no insecure fallback; scroll-margin missing under fixed nav anchors (global fix one line); multiple h1s on 6 routes; sub-44px touch targets (5 spots); unlabeled icon buttons (7 spots); nested-lightbox scroll-lock bug (photography); no aria-live for async counts; storage access unwrapped in ThemeProvider/CookieBanner/AnalyticsTracker/events; ~13 fetch sites skip res.ok; em dashes user-facing (concepts meanings, brands longDesc, chat KNOWLEDGE x25); pictographic emojis in FDDriveBrowser/fd/PageRenderer/api-pages HTML; price drift ($75+/design in FAQ, $100+/video-edit in booking); Loyalty Program remnants in Navbar/home-FAQ/plan features; ratelimit INCR-EXPIRE TTL race; CSRF missing on zeal/redeem/profile/admin/bookkeeping mutations; Drive N+1 endpoints unrate-limited + folder param injection surface; bugs POST ignores insert errors (success:true with data lost); raw IPs stored unhashed (events/forms); referral code minting public + leaderboard name fragments attacker-influenceable; analytics SQLite dead-on-Vercel; float money math (bookkeeping parseFloat, commission *0.10, fractional admin points); admin lockout memory-only email-keyed; CSP unsafe-inline/eval enforced without report-only phase; @novu/node still in package.json; no .env.example (54 vars undocumented); GTM noscript bypasses consent; Referrer-Policy conflict between configs.

#### LOW
CrownDraw Math.random render seed; stray `.5` class token; admin header literal arrow char; body suppressHydrationWarning; /match absent from sitemap; zeal:svcs sets unbounded; checkRedisHealth unwired; updateUserProfile field-name interpolation; pages POST header-token auth model; response-shape drift (plain text/bare array/500-on-bad-json); Printful parseFloat display prices; timing-unsafe compares (admin password, pages token); fd/drive err.message echo; health endpoint version leak; uncapped search/blog-style/event-props/analytics-limit inputs; font preload over-weighting (11 files); FAQ video no poster/preload.

---

### Fix Log

#### 2026-09-04 — Round 15 (`24065c7` — deployed READY, verified live)
- **E41 Em-Dash Ban:** purged all user-facing em dashes — chat KNOWLEDGE (25), brands longDesc, PricingCalculator FAQ (2), StrategyWizard rushNote (+ en dashes), email.ts signatures (3), fd/drive API error hint, my-account empty-state copy, dying-breed-crew body + OG/twitter card titles. Only comments + dead files retain dashes.
- **E45 Brand Naming:** "View Loyalty Dashboard" → "View Rewards Dashboard". Silver/Gold/Diamond matches verified = artwork filenames (Diamond Kiss, Gold Drop) + palette description only — legit. No Loyalty Program remnants in user-facing copy.
- **Referrer-Policy conflict:** unified next.config.ts to `strict-origin-when-cross-origin` (matches vercel.json). Live header verified.
- **Duplicate themeColor metas:** removed `themeColor` from `viewport` export; production now emits exactly 2 media-queried metas (light #DF3131 / dark #1C1C1E). Verified live.
- **Sitemap:** added `/splash`. Confirmed J-H2 gaps already resolved in `e2103d5` (booking, booking-calendars, merch/concepts, match, splash-gallery/showcase, merch/[id] derived from PRODUCT_IDS).
- **Vercl cron:** `/api/backup` 404 already fixed in `e2103d5` → `/api/health` (exists). Closed.
- **`.5` class token (LOW):** 100+ matches audited — all legitimate Tailwind spacing utilities (px-2.5, py-3.5, w-1.5...). No stray token. Closed no-op.
- **Admin `↓` arrow (LOW):** admin-only decorative sidebar glyph, not emoji, no public surface. Closed with rationale (icon-library adoption tracked as design-system work).
- **Housekeeping note:** 13 orphaned `metadata.ts` files (about, community, booking, blog, case-studies, web-design, wyzmind, 3pointprogram, clear-cache, my-account, view, admin, etc.) are superseded by per-route `layout.tsx` metadata — dead files, zero runtime effect. Safe to delete or ignore.
- **Still open:** E47 emoji policy (MEDIUM — FDDriveBrowser/fd/PageRenderer/api-pages HTML), Printful $0.00, autocomplete/aria Easy-Win-C, Wave 1 HIGH stack.



