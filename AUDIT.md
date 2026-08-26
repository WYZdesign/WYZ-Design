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
| ID | Domain | Severity | Finding | Status |
|----|--------|----------|---------|--------|

### Fix Log
Appended as fixes land, referencing Finding IDs.



