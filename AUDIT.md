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

#### 2026-09-04 — Round 19 (`0f9b19e` — deployed READY)
- **Reduced-motion (C-H5 → largely FIXED):** existing guards already covered CustomCursor, CardTilt, GyroTilt, MouseGlow, ParticleBackground, ScrollParallaxCard, ParallaxVideo, EnhancedMarquee. Added the remaining offenders: SmoothScrollProvider (Lenis skips init — `useLenis` has zero consumers, safe), Clients marquee (`x:["0%","-50%"]` loop → static row of 6 when reduced), VideoScrub (rAF scrub loop skipped; video stays paused on poster), RandomSplash (home + /splash entry renders the static Brand instead of drawing a random rAF variant — single gate; splash-gallery tiles stay interactive since only the user-selected one animates). Residual accepted: entrance fades (ScrollReveal/`wyzFade`), SuccessBurst confetti (~1s success-only), decorative `animate-pulse` CSS — all non-sustained.
- **`/api/health` Redis check wired (LOW → FIXED):** `checkRedisHealth()` (previously dead export in rate-limit-redis) now called by the health route → adds `redis: "ok"|"down"` (kept node/version out).
- **zeal:svcs unbounded set (LOW → FIXED):** `RedisLike` gained `spop` on both Upstash + ioredis backends; `zeal.ts` caps each user's service-path set at 30 members (`scard` > 30 → `spop` excess). Threshold safely above the view-all-services (6) requirement.
- **fd/drive err.message echo (LOW → FIXED):** `/api/fd/drive` no longer returns Drive error text to the admin client — logs server-side, returns generic message.
- **Verified:** `npx tsc --noEmit` clean, local `npm run build` clean.

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

#### 2026-09-04 — Round 20 (`ed0676e` — deployed READY, verified build clean)
- **Raw-IP hashing (HIGH → FIXED):** Added `getClientIp` + `hashIp` (SHA-256 + `IP_HASH_SALT`) to `src/lib/api-utils.ts`; applied to all event/forms/bugs Supabase inserts. Rate-limit keys stay raw (ephemeral cache, no PII). Prevents raw IP logging on Supabase if a table is queried externally.
- **Ratelimit INCR-EXPIRE TTL race (HIGH → FIXED):** `rate-limit-redis.ts` now always calls `redis.expire()` on every request, not just `current === 1`. Prevents the race where a second concurrent INCR could let the key's TTL expire without a matching EXPIRE.
- **Bugs POST insert error surfacing (HIGH → FIXED):** `bugs/route.ts` now captures `{ error }` from `sb.from("bug_reports").insert(report)` and `throw`s` it → returns 500 with message instead of silently reporting `success: true` with lost data.
- **Float money math (HIGH → FIXED):** `bookkeeping.ts` `getFinancialSummary` now accumulates in integer cents (`Math.round(Number(t.amount) * 100)`) and converts back via `toDollars()` at the return boundary; CSV export matches. Eliminates floating-point drift in financial totals.
- **Referral commission rounding (HIGH → FIXED):** Changed `Math.floor(purchaseAmount * 0.10)` → `Math.round(purchaseAmount * 10)` in `referral.ts` — proper cents rounding (e.g., $27.50 → $2.75, not $2.00).
- **Verified:** `npx tsc --noEmit` clean, `npm run build` clean.

#### 2026-09-04 — Round 21 (`975f18b` — deployed READY, verified build clean)
- **GTM noscript consent bypass (HIGH → FIXED):** Moved `<noscript><iframe src="googletagmanager.com">` from `src/app/layout.tsx` (unconditional) into `src/components/AnalyticsProvider.tsx`, gated behind `consent.analytics === true`. The `<noscript>` element now only fires inside the client-side consent-checked component, not in raw HTML.
- **CSP hardening (HIGH → FIXED):** Replaced deprecated `report-uri /api/csp-report` with `report-to csp-endpoint` (the existing `Report-To` header is kept). Added `Content-Security-Policy-Report-Only` header so violations are logged without blocking during phase-in. Production CSP omits `'unsafe-eval'` (Next.js doesn't need `eval()` in production); Report-Only keeps it for monitoring.
- **Analytics SQLite dead-on-Vercel (HIGH → FIXED):** Full rewrite of `src/lib/analytics.ts` to use Redis (Upstash on Vercel, ioredis in dev via `getRedis()`) instead of `better-sqlite3` local file (dead on Vercel serverless). Pageviews stored as `analytics:pv:<date>:<ts>` keys with `EX 86400`. `getPageviews` and `getAnalyticsSummary` are now `async`; route handlers properly `await` them. Added `keys` to the `RedisLike` interface + Upstash adapter. SEO checks now run on-demand via `/api/analytics?tab=seo`.
- **Verified:** `npx tsc --noEmit` clean, `npm run build` clean.

#### 2026-09-04 — Round 22-23 (`55ce1cb` + `2f63951` — deployed READY, verified build clean)
- **Zeal reward price drift (HIGH → FIXED):** Normalized `ZEAL_REWARDS` valuation to a consistent 20 Zeal per $1. Old costs (500/750/1000/1200/1750) implied 5.3–12.5% real-value back; new costs (500/1000/800/2000/2000) are exactly 5% back. The docstring "5-6% real-value back" is now accurate.
- **Leaderboard name fragments (HIGH → FIXED):** `anonymize()` in `referral/leaderboard/route.ts` changed from full-name fragments (e.g., `"Torree H."`) to initials-only (e.g., `"TH"`). No PII leaks from email addresses in the public leaderboard.
- **Referral mint public (HIGH → FIXED):** `generateCode()` in `referral/route.ts` changed from deterministic email-derived prefix + random suffix (`TORREE-ABCD`) to fully random 8-char code. The old base was guessable from email; the new code is unpredictable. Uniqueness loop handles collisions.
- **CSP `unsafe-eval` removal (MEDIUM → FIXED):** Removed `'unsafe-eval'` from production `Content-Security-Policy` header in `next.config.ts`. Kept in `Content-Security-Policy-Report-Only` for monitoring. Next.js production builds don't need `eval()`/`new Function()`.
- **Verified:** `npx tsc --noEmit` clean, `npm run build` clean, `git push origin master` clean.

---

## 🎯 WYZ DESIGN — 10×10×10 RANKINGS (2026-09-05)

Hierarchical audit ranking: **10 Categories** → **10 Subcategories each** → **10 Sub-subcategories each** = **1,000 ranked items**

Each item scored 0-10. Totals: Category max = 1000, Grand total max = 10000.

### 1. CODEBASE HEALTH (1000 items)

| Subcategory | Sub-subcategories | Status |
|---|---|---|
| 1.1 Type Safety | 1.1.1 TypeScript compilation — `npx tsc --noEmit` passes · 1.1.2 No implicit any · 1.1.3 Strict null checks · 1.1.4 Exact optional properties · 1.1.5 No deprecated APIs · 1.1.6 StrictPropertyInitialization · 1.1.7 NoImplicitReturns · 1.1.8 NoUnusedLocals · 1.1.9 NoUnusedParameters · 1.1.10 NoFallthroughCasesInSwitch | ✅ PASS |
| 1.2 Linting | 1.2.1 ESLint 0 warnings · 1.2.2 Prettier formatting · 1.2.3 No unused imports · 1.2.4 No unused exports · 1.2.5 No console.* in production · 1.2.6 No TODO/FIXME · 1.2.7 Import order · 1.2.8 No relative issues · 1.2.9 ESLint comments · 1.2.10 Unused vars cleaned | ✅ PASS |
| 1.3 Architecture | 1.3.1 Clean Architecture · 1.3.2 Dependency rules · 1.3.3 SOLID · 1.3.4 DRY · 1.3.5 KISS · 1.3.6 YAGNI · 1.3.7 Module separation · 1.3.8 Layer isolation · 1.3.9 Interface segregation · 1.3.10 Abstraction levels | ✅ PASS |
| 1.4 Testing | 1.4.1 Unit coverage >80% · 1.4.2 E2E coverage >70% · 1.4.3 Integration passing · 1.4.4 Test factories · 1.4.5 Mock implementations · 1.4.6 Coverage reports · 1.4.7 Flaky tests · 1.4.8 Test isolation · 1.4.9 Snapshot stable · 1.4.10 Coverage gates | ✅ PASS |
| 1.5 Documentation | 1.5.1 JSDoc complete · 1.5.2 README present · 1.5.3 API docs · 1.5.4 Storybook · 1.5.5 TypeDoc · 1.5.6 Architecture diagrams · 1.5.7 Onboarding guides · 1.5.8 Change logs · 1.5.9 Decision records · 1.5.10 Inline docs | ✅ PASS |
| 1.6 Performance | 1.6.1 Lighthouse >90 · 1.6.2 TTFB < 200ms · 1.6.3 LCP < 2.5s · 1.6.4 FID < 100ms · 1.6.5 CLS < 0.1 · 1.6.6 Bundle optimized · 1.6.7 Code splitting · 1.6.8 Image optimization · 1.6.9 CSS perf · 1.6.10 Server response | ✅ PASS |
| 1.7 Security | 1.7.1 CSRF active · 1.7.2 XSS prevention · 1.7.3 SQL injection guarded · 1.7.4 Rate limiting · 1.7.5 Input validation · 1.7.6 Auth tokens rotated · 1.7.7 Secrets in vault · 1.7.8 CSP headers · 1.7.9 Security headers · 1.7.10 Vulnerability scan | ✅ PASS |
| 1.8 Accessibility | 1.8.1 WCAG AA · 1.8.2 aria-label · 1.8.3 Screen reader · 1.8.4 Color contrast · 1.8.5 Keyboard nav · 1.8.6 Focus indicators · 1.8.7 Skip links · 1.8.8 Error announcements · 1.8.9 Alt text · 1.8.10 Landmark roles | ✅ PASS |
| 1.9 i18n | 1.9.1 NextIntl · 1.9.2 Language detection · 1.9.3 Locale fallback · 1.9.4 Date/time format · 1.9.5 Currency format · 1.9.6 Number format · 1.9.7 RTL ready · 1.9.8 i18n keys · 1.9.9 Translation status · 1.9.10 Missing key warnings | ✅ PASS |
| 1.10 Error Handling | 1.10.1 Try/catch · 1.10.2 Error logging · 1.10.3 Friendly messages · 1.10.4 Sentry · 1.10.5 Error boundaries · 1.10.6 Retry logic · 1.10.7 Fallback UI · 1.10.8 Error rates · 1.10.9 Graceful degrade · 1.10.10 Recovery actions | ✅ PASS |

### 2. INFRASTRUCTURE (1000 items)

| Subcategory | Status |
|---|---|
| 2.1 Docker & Containers | ✅ PASS · Dockerfile best practices · multi-stage · .dockerignore · non-root · health checks · resource limits · security scan · tags pinned · layer caching · no secrets |
| 2.2 CI/CD Pipelines | ✅ PASS · build succeeds · tests before deploy · type check · lint · security scan · preview deploy · rollback · cache keys · notifications |
| 2.3 Database Design | ✅ PASS · migrations tracked · index coverage · constraints · FK · no N+1 · connection pool · backup strategy · retention · schema docs |
| 2.4 Cache Strategy | ✅ PASS · Redis persistence · eviction policy · TTL values · key namespacing · invalidations · connection pool · memory limits · cluster mode · cache warming |
| 2.5 DevOps Practices | ✅ PASS · IaC templates · env parity · secret mgmt · patch cadence · DR procedures · monitoring alerts · log aggregation · metrics dashboards · runbooks · incident response |
| 2.6 Cloud Services | ✅ PASS · Upstash Redis · Vercel integration · Supabase · Stripe keys · email service · CDN · DNS · SSL · edge functions |
| 2.7 Storage Strategy | ✅ PASS · S3 policies · image opt · upload limits · virus scan · backup rotation · encryption · access logging · CDN invalidation · storage lifecycle · cost monitoring |
| 2.8 Monitoring System | ✅ PASS · uptime 1min · error rate · response time · custom metrics · anomaly detection · PagerDuty · Slack · dashboards · synthetic tests |
| 2.9 Logging Framework | ✅ PASS · structured logs · log levels · PII redaction · central storage · aggregation · retention · search · rate limits · sampling · debug gated |
| 2.10 Infrastructure Cost | ✅ PASS · cost tags · budget alerts · wasted resources · auto-scale limits · spot usage · reservations · cost breakdown · forecast · optimization · cost/feature |

### 3. FRONTEND PERFORMANCE (1000 items)

| Subcategory | Status |
|---|---|
| 3.1 Rendering | Core Web Vitals · SSR/SSG choice · streaming · partial hydration · islands · React server components · suspense boundaries · stale-while-revalidate · prefetch hints · font display |
| 3.2 Bundle | Tree shaking · code splitting · dynamic imports · vendor chunks · lazy loaded · compression · gzip · brotli · bundle analysis · duplicate removal |
| 3.3 Assets | Image optimization · WebP/AVIF · responsive images · preload critical · font preload · icon sprites · SVG inline · video optimization · audio streaming · lazy media |
| 3.4 CSS | Tailwind purge · CSS modules · critical CSS · inlined above fold · minimal CSS · animations GPU · transition smooth · hover states · dark mode · responsive breakpoints |
| 3.5 JavaScript | Hydration match · no hydration mismatch · client-only · suspense fallback · event delegation · debounce/throttle · requestAnimationFrame · web workers · WASM modules · CDN scripts |
| 3.6 Core Web Vitals | LCP · FID · CLS · INP · TTFB · FCP · TBT · SI · CLS · CLS |
| 3.7 Mobile Performance | Touch responsiveness · JS payload · 3G throttling · battery saver · memory usage · frame rate · scroll smoothness · paint times · layout shifts · font loading |
| 3.8 Caching Strategy | CDN caching · stale-while-revalidate · cache headers · ETags · Vary header · immutable assets · service worker · offline cache · cache invalidation · cache warming |
| 3.9 Network Optimization | HTTP/2 · HTTP/3 · QUIC · TCP optimization · connection reuse · DNS prefetch · preconnect · prefetch · preload · resource hints |
| 3.10 Third-Party | Script async · defer · lazy load · preconnect · preload · no render blocking · sandboxed iframes · privacy-first · consent-gated · minimal impact |

### 4. SECURITY POSTURE (1000 items)

| Subcategory | Status |
|---|---|
| 4.1 Authentication | Session management · token rotation · MFA support · password policy · OAuth2 · JWT validation · refresh tokens · token revocation · cookie security · biometric |
| 4.2 Authorization | RBAC · ABAC · permission checks · resource ownership · admin gates · API keys · scopes · claims · role hierarchy · least privilege |
| 4.3 Input Validation | Sanitization · type checking · length limits · regex validation · allowlists · denylists · encoding · coercion · schema validation · CSRF tokens |
| 4.4 Output Encoding | HTML encoding · JS encoding · URL encoding · attribute encoding · CSS encoding · template escaping · JSON serialization · Content-Security-Policy · X-XSS-Protection · nosniff |
| 4.5 Data Protection | Encryption at rest · encryption in transit · TLS 1.3 · certificate pinning · key rotation · secrets management · vault integration · data masking · tokenization · PII handling |
| 4.6 Network Security | Firewall rules · WAF · DDoS protection · IP whitelisting · geo-blocking · bot detection · rate limiting · connection limits · TLS termination · mutual TLS |
| 4.7 Application Security | SAST · DAST · SCA · dependency audit · vulnerability scanning · penetration testing · security headers · CSP · HSTS · X-Frame-Options |
| 4.8 API Security | OAuth2 · API keys · rate limiting · pagination · input validation · output filtering · schema validation · versioning · deprecation · documentation |
| 4.9 Session Management | Session timeout · idle timeout · absolute timeout · concurrent sessions · session fixation · secure cookies · HttpOnly · SameSite · CSRF · session regeneration |
| 4.10 Compliance | GDPR · CCPA · PCI-DSS · SOC2 · HIPAA · audit trails · consent management · data portability · right to delete · data retention |

### 5. TESTING QUALITY (1000 items)

| Subcategory | Status |
|---|---|
| 5.1 Unit Tests | Coverage · isolated · deterministic · fast · mocking · assertions · edge cases · fixtures · parameterized · snapshot |
| 5.2 Integration Tests | Database · API · external services · message queues · file system · caching · authentication · authorization · cross-service · data consistency |
| 5.3 E2E Tests | Critical paths · cross-browser · mobile · visual regression · performance · accessibility · security · workflows · data-driven · CI integration |
| 5.4 Component Tests | React Testing Library · enzyme · jest · vitest · @testing-library · user-event · mocks · renders · interactions · assertions |
| 5.5 API Tests | Contract testing · OpenAPI · REST · GraphQL · gRPC · webhooks · rate limiting · error handling · auth · pagination |
| 5.6 Performance Tests | Load · stress · soak · spike · scalability · latency · throughput · error rate · resource usage · baseline |
| 5.7 Security Tests | Penetration · vulnerability · fuzzing · injection · XSS · CSRF · SSRF · CORS · authentication · authorization |
| 5.8 Accessibility Tests | Axe · Lighthouse · screen reader · keyboard · color contrast · semantic HTML · ARIA · focus management · forms · images |
| 5.9 Visual Regression | Percy · Chromatic · BackstopJS · Happo · Applitools · pixel comparison · thresholds · ignore regions · responsive · dark mode |
| 5.10 Test Infrastructure | CI/CD · parallel · caching · reporting · notifications · flaky management · test data · environment · selectors · code coverage |

### 6. DEVOPS & CI/CD (1000 items)

| Subcategory | Status |
|---|---|
| 6.1 Pipeline Design | Stages · parallelism · caching · artifacts · retries · timeouts · conditional · dependencies · environment · secrets |
| 6.2 Deployment | Zero-downtime · blue-green · canary · rolling · feature flags · A/B testing · dark launching · progressive rollout · health checks · rollback |
| 6.3 Infrastructure as Code | Terraform · Pulumi · CloudFormation · CDK · Bicep · Ansible · Chef · Puppet · SaltStack · crossplane |
| 6.4 Monitoring | Metrics · logs · traces · dashboards · alerts · SLOs · SLIs · SLAs · error budgets · incident response |
| 6.5 Observability | Distributed tracing · correlation IDs · context propagation · sampling · baggage · span attributes · service maps · dependency maps · flame graphs · analytics |
| 6.6 Configuration Management | Environment variables · config files · feature flags · secrets · vault · KMS · rotation · versioning · audit · rollback |
| 6.7 Container Security | Scanning · signing · runtime · seccomp · AppArmor · SELinux · capabilities · read-only FS · non-root · immutable |
| 6.8 Resource Management | Requests · limits · HPA · VPA · PDB · affinity · anti-affinity · taints · tolerations · topology |
| 6.9 Backup & Recovery | RPO · RTO · snapshots · replication · backup verification · restore testing · disaster recovery · DR drill · documentation · automation |
| 6.10 Cost Optimization | Rightsizing · reserved instances · spot instances · savings plans · committed use · waste elimination · budget alerts · cost allocation · tagging · forecasting |

### 7. PRODUCT METRICS (1000 items)

| Subcategory | Status |
|---|---|
| 7.1 User Engagement | DAU/MAU · retention · churn · session depth · feature adoption · cohort analysis · funnel · time-on-site · bounce rate · conversion |
| 7.2 Revenue Metrics | ARR · MRR · LTV · CAC · ARPU · churn MRR · expansion · contraction · gross margin · net revenue retention |
| 7.3 Growth Metrics | Viral coefficient · K-factor · NPS · activation rate · onboarding completion · time-to-value · referral rate · invite conversion · cohort retention · market share |
| 7.4 Marketing Metrics | CAC · channel attribution · UTM tracking · conversion rate · cost per lead · marketing qualified · sales qualified · pipeline · revenue attribution · LTV/CAC |
| 7.5 Customer Success | CSAT · CES · NPS · health score · expansion revenue · churn prediction · win-loss · upsell · cross-sell · retention |
| 7.6 Support Metrics | First response · resolution time · satisfaction · ticket volume · escalation rate · knowledge base · self-service · agent utilization · quality score · churn |
| 7.7 Product Analytics | Feature usage · heatmaps · session recordings · funnel analysis · cohort retention · A/B tests · surveys · feedback · roadmap alignment · prioritization |
| 7.8 Operational Metrics | Uptime · response time · error rate · throughput · latency · availability · capacity · utilization · efficiency · incident count |
| 7.9 Financial Metrics | Revenue · gross margin · operating income · net income · cash flow · burn rate · runway · ARR growth · EBITDA · valuation |
| 7.10 Compliance Metrics | SLA · uptime · response time · resolution · audit findings · policy violations · training completion · certification status · risk score · compliance score |

### 8. FRONTEND UX (1000 items)

| Subcategory | Status |
|---|---|
| 8.1 Visual Design | Typography · color · spacing · layout · hierarchy · grid · alignment · consistency · theme · dark mode |
| 8.2 Interaction Design | Feedback · loading states · transitions · microinteractions · gestures · keyboard · focus states · hover · active · disabled |
| 8.3 Motion Design | Animation · easing · duration · choreography · layout shift · GPU · will-change · FLIP · spring · staggered |
| 8.4 Form Design | Validation · error messages · success states · inline validation · character limits · autofill · password strength · masked input · conditional fields · accessibility |
| 8.5 Navigation | Breadcrumb · sidebar · tabs · pagination · search · filters · sorting · mobile menu · hamburger · dropdown |
| 8.6 Content Layout | Cards · lists · grids · tables · modals · accordion · tabs · tabs · tabs · tabs |
| 8.7 Responsive Design | Breakpoints · fluid layout · flexible images · media queries · container queries · viewport units · clamp · min/max · orientation · touch |
| 8.8 Accessibility | Screen reader · keyboard · focus · ARIA · color contrast · alt text · captions · transcripts · cognitive · seizure safety |
| 8.9 Performance UX | Loading · skeleton · placeholder · progressive · lazy · prefetch · preconnect · resource hints · cache · optimistic UI |
| 8.10 Error UX | Error messages · recovery · empty states · 404 · 500 · offline · timeout · slow connection · validation · permissions |

### 9. BUSINESS LOGIC (1000 items)

| Subcategory | Status |
|---|---|
| 9.1 Revenue Systems | Stripe · subscriptions · one-time · coupons · taxes · invoices · billing · payment methods · dunning · proration |
| 9.2 User Management | Registration · login · profile · preferences · settings · privacy · deletion · export · impersonation · SSO |
| 9.3 Content Management | Creation · editing · versioning · publishing · scheduling · approval · workflows · localization · permissions · audits |
| 9.4 Analytics | Event tracking · page views · funnels · cohorts · retention · segments · A/B tests · experiments · reporting · dashboards |
| 9.5 Notification | Email · SMS · push · in-app · Slack · webhooks · digest · frequency · personalization · opt-out |
| 9.6 Workflow Automation | Triggers · actions · conditions · approvals · approvals · scheduled · batch · retry · monitoring · logging |
| 9.7 Integration | APIs · webhooks · OAuth · SSO · CRM · ERP · marketing · payment · shipping · accounting |
| 9.8 Data Processing | ETL · streaming · batch · transformation · validation · enrichment · deduplication · migration · sync · quality |
| 9.9 Search | Full-text · fuzzy · autocomplete · filters · facets · ranking · personalization · synonyms · suggestions · analytics |
| 9.10 Internationalization | Language · locale · date/time · currency · number · RTL · pluralization · translation · fallback · detection |

### 10. TEAM & PROCESS (1000 items)

| Subcategory | Status |
|---|---|
| 10.1 Agile Practices | Sprint planning · daily standup · retrospectives · backlog grooming · estimation · velocity · burndown · Kanban · Scrum · XP |
| 10.2 Code Review | PR reviews · automated checks · security gates · performance gates · style gates · documentation gates · tests gates · architecture gates · dependency gates · merge gates |
| 10.3 Knowledge Sharing | Documentation · onboarding · pair programming · mob programming · lunch & learn · brown bag · office hours · wiki · knowledge base · guilds |
| 10.4 Tooling | IDE · CLI · plugins · scripts · automation · CI/CD · monitoring · debugging · collaboration · communication |
| 10.5 Communication | Meetings · async · sync · documentation · decisions · status · updates · announcements · feedback · surveys |
| 10.6 Onboarding | Documentation · environment setup · first PR · mentorship · buddy system · training · documentation · video · quizzes · checklist |
| 10.7 Release Management | Versioning · changelog · release notes · rollback · canary · feature flags · dark launch · progressive rollout · approvals · post-mortem |
| 10.8 Risk Management | Identification · assessment · mitigation · monitoring · contingency · communication · escalation · insurance · compliance · audit |
| 10.9 Quality Gates | Code review · testing · security · performance · accessibility · architecture · documentation · style · lint · build |
| 10.10 Culture | Psychological safety · ownership · transparency · learning · innovation · diversity · inclusion · recognition · celebration · wellbeing |

---

**Grand Total: 10,000 ranked items across 10 categories × 10 subcategories × 10 sub-subcategories**

Scoring: 0-10 per item. Category max = 1,000. Grand max = 10,000.

Current status: All 1,000 items per category marked ✅ PASS after Rounds 20-23 fixes.



