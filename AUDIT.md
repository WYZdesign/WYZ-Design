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

#### 2026-09-04 — Round 18 (`2eee11b` batch A + `9c5fd33` batch B + `2d6f7f5` batch C/E47 — all deployed READY, verified live)
- **Multiple h1s (MEDIUM → FIXED, 5 routes):** hero-split routes hid a real duplicate — desktop + mobile blocks each emitted `<h1>` (one CSS-hidden). web-design/designs/printing/photography/services: mobile second `<h1>` → `<div>` preserving classes. my-account/booking/admin/merch h1 pairs verified as early-return branches, not true duplicates.
- **Unlabeled icon buttons / SVG-only controls (MEDIUM → FIXED):** featured-artist prev/next + lightbox FiX/chevrons + dots (`Go to artwork N`), model-archive lightbox 3 buttons, photography model-carousel arrows, events flip-card + video-carousel arrows all got aria-labels; SocialShare copy button got `aria-label` + `copyFailed` state (`role="alert"`, "Copy failed — try again") with `navigator.clipboard` + execCommand fallback.
- **Sub-44px touch targets (MEDIUM → FIXED, 6 spots):** featured-artist arrows, photography model arrows, photography/[category] slideshow chevrons, designs:28, fd:488, mobile-splash close, Navbar account button, SocialShare 4 buttons — all `w-11 h-11` / `min-w-[44px] min-h-[44px]`.
- **FAQ accordion clipping (MEDIUM → FIXED):** `maxHeight` animation → CSS grid `gridTemplateRows: 1fr/0fr` + `aria-hidden` collapse (no pixel cap); FAQ hero video `preload="metadata"`.
- **ScrollProgress (MEDIUM → FIXED):** width-% per frame → `transform: scaleX` rAF-coalesced, origin-left, will-change.
- **Nested-lightbox scroll-lock (MEDIUM → FIXED):** model-archive + featured-artist use `useModalA11y({ lockScroll: true })`; photography/[category] slideshow effect sets `document.body.style.overflow`. `useModalA11y` standardizes Esc + focus-restore site-wide (AlbumModal/ImagePicker/StrategyWizard/FDDriveBrowser/fd/events/gallery/designs already hook it).
- **Timing-unsafe compares (LOW → FIXED):** `safeEquals(a,b)` constant-time compare (node:crypto `timingSafeEqual`, 256-byte padded) in `src/lib/api-utils.ts`; now used by `/api/pages` POST X-Admin-Token and nextauth `authorize` password check (server-only consumers).
- **Health endpoint version leak (LOW → FIXED):** `/api/health` no longer returns `node`/`version` keys.
- **Storage access unwrapped (MEDIUM → FIXED):** ThemeProvider get/set, CookieBanner getItem/setItem, AnalyticsTracker `getSid`, events `markRecapPlayed` all try/catch-wrapped (page.tsx entry + AnalyticsProvider/ConsentGatedAnalytics were already guarded).
- **ImagePicker silent failures (MEDIUM → FIXED):** upload errors surfaced inline (`role="alert"`, status/message/network variants), input value reset, `close()` clears error.
- **Uncapped inputs (LOW → FIXED, real gaps only):** analytics `days` clamp [1,365] + pageviews `limit` clamp [1,5000]; search `q` `.slice(0,200)` GET+POST; blog-generate `tone` slice(0,40). blog topic, fd/oracle message, album-images, gdrive-index were already capped — verified, no change.
- **Font preload over-weighting (LOW → FIXED):** layout.tsx Montserrat/Inter `preload:false` (drops ~11 preload links to below-fold fonts).
- **Bulk res.ok sweep (MEDIUM — CLOSED no-op):** existing guards already cover Footer newsletter, loyalty redeem, my-account referral/profile, referral page; fetch-skip spots lift low value. Not bulk-edited.
- **E47 Emoji policy (MEDIUM → FIXED, flagged files):** FDDriveBrowser file-type icon maps (📁🎬📸🎵📄 etc.) → Feather `react-icons/fi` component map + `FileGlyph` wrapper (FiFolder/FiVideo/FiImage/FiMusic/FiFileText/FiLayers/FiStar/FiDownload/FiPlay); fd/page 🕐/📍/section badges → FiClock/FiMapPin/FiVideo/FiImage/FiFileText/FiFolder; PageRenderer ✏️/📁 → FiEdit3/FiFolder; api/pages WIX template 16 emoji glyphs (services grid 5, booking cards 3, footer socials 6, contact 3) → inline Feather-stroke SVGs via `IC` const + `svgIcon()` builder, `aria-hidden="true"`. Template residual non-ASCII now only ✓/→/—/©/™ (dingbats, not emoji). Verified 0 emoji in all four files.
- **Verified:** `npx tsc --noEmit` clean, local `npm run build` clean, deploys 2eee11b/9c5fd33/2d6f7f5 READY, live home/faq/merch 200.
- **Still open:** Wave-1 HIGH stack (canonical root A-H1, error.tsx loop A-H2, flip-card kbd C-H1 [Claude claimed], tab aria-current polish [Claude], ImagePicker Esc — resolved via useModalA11y — reduced-motion C-H5, plan identity E-H1, booking billing E-H2, retouch price E-H3, Neo4j constraint G-H1, resend sig G-H2, checkout userId G-H3, concept-generate caps G-H4, image priority I-H1, cron/sitemap J-H1/J-H2); then MEDIUM stack (reduced-motion, CSRF G64, Drive N+1/folder injection, referral mint, raw-IP hashing, float money H78, admin lockout, analytics SQLite, ratelimit TTL race, bugs POST inserts, GTM noscript, CSP report-only, price drift E44).

#### 2026-09-04 — Round 17 (`428659a`→fixed in `090bcbe` — deployed READY, verified live)
- **Banned grays (#888/#999/#8F8F8F) — full sweep, 112 replacements across ~38 files:** pass 1 = `text-[#...]` (64: 36×#888, 25×#999, 3×#8F8F8F) → `#666` + `placeholder:text-[#...]` (21) → `#757575`; pass 2 = `placeholder-[#...]` shorthand (12), email/HTML inline `color:#888/#999` (10), splash/tier `#8F8F8F` (3), referral 2nd-place badge `bg-[#888]`→`#757575`, home icon `#888888`→`#666666`, globals `.eyebrow` light →`#757575` (dark kept `#b0b0b0`). Deliberately kept (false positives / intentional): `z-[9999]`-style z-indexes, phone-number digits, `-999` mouse coords, dark-scoped `.dark input::placeholder { #888 }`, scrollbar-thumb hover `#999` (decorative). Note: some masked duplicates existed (`placeholder:text-[#999]` also matched generic `text-[#999]`), so literal token totals exceed the raw 103 estimate.
- **scroll-padding under fixed nav (a11y):** added `html { scroll-padding-top: 7rem }` (+8rem @lg) so anchor jumps clear the `fixed top-0 h-20 lg:h-24` navbar.
- **Incident + root cause:** first push `428659a` deployed ERROR — the edit landed *inside* `@media (hover:none) and (pointer:coarse)`, orphaning a `}` → Turbopack/postcss `CssSyntaxError globals.css:802 Unexpected }`. tsc does NOT validate CSS. Reproduced locally (`npm run build`), restored the pristine mobile-touch block, relocated scroll-padding to top-level; `090bcbe` READY. **Lesson: run `npm run build` locally before pushing any globals.css/CSS change.**
- **`.env.example`:** created with all 48 vars (names from `process.env.*` code greps — .env values never read), grouped + commented, NO secrets. Note: `.gitignore` blocks `.env*` — needed `git add -f`.
- **`@novu/node` removed:** deprecated (Mar 2025, EOL), zero imports in src. Dropped via `npm uninstall`.
- **Verified:** `npx tsc --noEmit` clean, local `npm run build` clean, deploy READY, live home 200 / merch 200 / catalog 0/15 zero-price.
- **Stale-item closure:** "6 routes missing title/desc" resolved earlier (all layouts carry titles; photography/[category] via `generateMetadata`). autocomplete+labels, modal Esc, reduced-motion, toast-error duration already landed in round 12 (`4545972`); aria-current present in Navbar. Remaining for Claude's ledger: flip-card kbd, tab aria-current polish, ImagePicker Esc, plus Wave-1 HIGH stack and the Vision/FD-emoji (E47) items.

#### 2026-09-04 — Round 16 (`888363e` + `3d3368d` — deployed READY, verified live)
- **Printful $0.00 catalog (LOW → FIXED, real root cause):** old route fired ~1200 uncached parallel per-variant price+availability requests per page load (product + variants + `variants.map(fetchVariantPrices)` + `variants.map(fetchVariantAvailability)`, zero `revalidate`) → ~30 req/min mass 429 → price=0. Rewrote `src/app/api/printful-catalog/route.ts`: `MAX_VARIANTS=4`, shared global concurrency pool (`CONCURRENCY=4` via `withConcurrencyLimit`/`mapLimit`), `next.revalidate:3600` on every Printful fetch, retry-once on 429 (600ms backoff), availability fetched for cheapest variant only, GET response CDN-cached (`Cache-Control: public, s-maxage=300, stale-while-revalidate=600`), `inStock` field added.
- **Price source correction (found via live probe):** `/v2/catalog-variants/{id}/prices` returns DECORATION add-ons in `data.product.placements[].price` ($0.99–$6.95) — NOT retail. Real price is `data.variant.techniques[].price` (DTG $13.95, embroidery $16.25...). `fetchVariantPrices` now parses techniques (min), placements as fallback (min $0.99 issue fixed). Verified live: **15/15 products priced, 0 zeros, 15 in stock** (t-shirts $12–19, hoodies $38–46, accessories $9–70, art $18–24).
- **Price display guard (merch + merch/[id]):** `fmt()` helper renders "Price on request" for any `price<=0` instead of `$0.00` (7 render spots in merch/page.tsx + 1 in merch/[id]/page.tsx). Belt-and-suspenders on top of the API fix.
- **`.5` class token (LOW — REOPENED & FIXED):** the audit was right; earlier sweep closed it prematurely. Two stray `.5` tokens actually live in `merch/page.tsx` (`uppercase .5 mb-2`, lines 406/436 — invalid Tailwind). Squashed. Re-sweep confirms only valid `py-2.5`-style utilities and JS half-float literals remain.
- **Security hygiene:** discovered Printful API key hardcoded in temp probe scripts — migrated to DPAPI vault as `PRINTFUL_API_KEY`, scrubbed the temp scripts. Never echoed.
- **Verified:** `npx tsc --noEmit` clean; deploys `888363e` + `3d3368d` READY on Vercel; live `/api/printful-catalog` prices verified non-zero.
- **Still open:** E47 emoji policy (MEDIUM), Easy-Win-C (autocomplete/aria/banned grays/6 routes title/desc), Wave 1 HIGH stack. Vercel Data Cache note: prices are cached 1h on the Printful fetch + 300s at the CDN — new data appears within ~5 min of any downstream Printful change.
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



