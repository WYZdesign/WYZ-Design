# Round 13 — Claude Update (2026-09-04/05)

**Scope:** Continued the page-by-page manual audit of `V:\wyzdesign` per Torreé's "just go, continue auditing, fixing, finding more to fix" instruction. All changes below are **uncommitted working-tree edits** in `V:\wyzdesign` — I did not touch git (index.lock + maintenance.lock are held by an active process on that repo right now, consistent with WYZMiND working concurrently — same signal as round 9-12's reconciliation). Per "you guys take turns," these are left for whoever's turn it is to commit.

`npx tsc --noEmit` is clean (0 errors) after every change below, verified incrementally and once at the end as a full pass.

## Real bugs fixed

1. **Gift-card Zeal exploit (`src/app/gift-card/page.tsx`)** — the client called `earn("buy-gift-card")` (a one-time 75-Zeal milestone) the instant a Stripe Checkout session URL came back, **before** any payment happened. A user could click "Buy Now" once, never pay, and still bank the milestone. Confirmed via the webhook (`src/app/api/webhook/route.ts`) that gift-card purchases already get rewarded correctly and post-payment via the generic `addLoyaltyPoints` (1pt/$) path on `checkout.session.completed` — so this client-side call was both premature and redundant. Removed the client-side `earn()` call, the `useZeal` import, and the hook usage.
   - **Flag for WYZMiND:** if the one-time 75-Zeal "Purchased a gift card" milestone bonus (on top of the per-dollar loyalty points) is still wanted, it belongs in the webhook's existing `if (session.metadata?.type === "giftcard")` block, called only after Stripe confirms payment. That's an API-route change, your territory.

2. **`match/page.tsx` was a content stub for a feature that already exists elsewhere.** The page's copy promises an interactive "answer a few questions, get matched" quiz (steps: "Tell Us Your Style" → "Get Matched" → "Start Creating"), but the actual page was just static marketing copy ending in a "Get Started" button that skipped straight to `/booking` — no quiz at all. Meanwhile `StrategyWizard` (a self-contained, already-working "what service / what goal / what budget" quiz component) is already built and wired into `/services`. Rendered `<StrategyWizard />` on `/match` so the page delivers on its own promise, and relabeled the old button "Skip to Booking" underneath it.

3. **`model-archive/page.tsx` "VIEW MODELS" toggle was invisible in light mode.** Its active state was hardcoded `bg-white text-[#111] border-white` with no light/dark variants — on the page's white light-mode background that's a white button with a white border, i.e. invisible except for the dark text floating with no visible container. Changed to `bg-[#333] text-white border-[#333] dark:bg-white dark:text-[#111] dark:border-white` so it's visible in both themes (matches the inverted-tab look in dark mode, gets real contrast in light mode).

4. **`gallery/page.tsx` category filter pills had no active-state styling at all.** Clicking "Portraits," "Fashion," etc. correctly filtered the images, but the button never visually indicated which filter was selected — every pill used the same static className regardless of `cat === c`. Every other filter UI on the site (`services/page.tsx`'s category tabs, `3pointprogram`'s pillar tabs, `wyzmind`'s stack-category tabs) has this pattern; gallery was the one page missing it. Added the same active/inactive treatment (`bg-[#DF3131]` + white text when active).

5. **`MagneticElement.tsx` (`src/components/MagneticElement.tsx`) — the `strength` prop was completely dead.** Both real call sites (`home/page.tsx` passes `strength={0.25}`, `Navbar.tsx` passes `strength={0.2}`) expect a configurable magnetic pull, but the component only did a fixed `onMouseEnter`/`onMouseLeave` scale-to-1.08 with no cursor tracking whatsoever — "magnetic" in name only. Rebuilt it with real `onMouseMove` cursor-following translation (`translate(dx * strength, dy * strength)`) plus the existing scale/glow, so `strength` now actually does something and both call sites get the subtler pull they were already asking for.

6. **`case-studies/page.tsx`'s copy-link button gave zero feedback.** `onClick={() => navigator.clipboard.writeText(SHARE_URL)}` with no confirmation — click it and nothing visibly happens. The site's other two copy-link implementations (`referral/page.tsx`, `components/SocialShare.tsx`) both already have a `copied` state that swaps the icon to a checkmark for 2s. Brought this button in line with that pattern (`FiLink2` → `FiCheck` + green outline for 2s).

7. **`status/page.tsx` mislabeled a field.** "Build time (UTC)" was actually `new Date().toISOString()` computed at request time — the page is `dynamic = "force-dynamic"`, so it re-renders (and re-stamps that timestamp) on every single load, never reflecting an actual build. Renamed the field to "Checked at (UTC)" to match what it actually measures. Copy-only, no logic touched (this page's actual health checks — Supabase/Redis/Stripe — are backend territory, untouched).

## Dead code / broken half-features removed

8. **`SafeImage.tsx`'s blur-placeholder preload was silently 404ing on every `priority` image, on all 6 pages that use it** (blog, designs, merch x3, photography category). It requested `/images/blur<filename>` for a pre-generated blurred thumbnail that doesn't exist anywhere in `public/images` — I checked, there are zero `blur*` files in the tree. Since the `Image` object load was fire-and-forget with no error handler, it never surfaced as a visible bug, just a wasted request per load. Removed the dead preload effect, its `IMAGE_BASE_PATH` constant, and three now-unused local variables (`baseName`, `ext`, `webpPath`) inside `getWebPSources` that were computed but never read — the actual webp/fallback swap logic (which does work) is untouched.
   - **Flag for WYZMiND if you want this back**: real LQIP/blur placeholders would need an actual blur-thumbnail generation step in the image pipeline (build-time or upload-time) — that's infra, not something I'll invent unilaterally.

9. Removed several other genuinely-dead values found via a second `tsc --noUnusedLocals --noUnusedParameters` sweep, none of which had any visible effect either way (confirmed each one's only reference was itself before removing):
   - `fd/page.tsx`: `lightboxIndex`/`setLightboxIndex` state — the "X / Y" counter shown in that page's event lightbox is already computed inline from `filtered.indexOf(...)`, so this tracked state was never read anywhere.
   - `home/page.tsx`: fixed a missing `key` prop on the 3-item "why work with us" card `.map()` (was throwing a React console key-warning on every home page load) and dropped the now-unused loop index.
   - `services/page.tsx`: `ServiceCard`'s `index` prop was threaded in from the caller but never read inside the component — no stagger animation, no first-card treatment, nothing. Removed the prop entirely rather than guess at unbuilt intent.
   - `featured-artist/page.tsx`, `plans/page.tsx`: unused destructured loop variables (`g`, `plan`) — trivial renames to `_`.

## Verified clean, no changes needed

- `booking/page.tsx`, `loyalty/page.tsx` — read in full, `SERVICES`/`PRICING_MAP` cross-checked programmatically, no bugs.
- `3pointprogram`, `brands`, `case-studies` (besides the copy-link fix), `dying-breed-crew`, `nomadic-breed`, `plans` (besides the trivial cleanup), `partnerships`, `search`, `secret`, `status` (besides the label), `wyzmind`, `featured-artist` (besides the trivial cleanup) — all read in full; image assets referenced by each were checked to actually exist in `public/`; all internal API/route references (`/api/referral/leaderboard`, `/api/checkout`, `/api/forms`, `/service-page/*`, etc.) resolve to real routes.
- `secret/page.tsx`'s claimed "100 Zeal" reward and `featured-artist`'s claimed Zeal rewards both cross-checked against `src/lib/zeal.ts` — all correct and correctly gated (post-success-response only, unlike the gift-card bug above).

## Still open / not mine to touch

- Everything already flagged in prior rounds (Printful catalog price mapping, NEO4J_URI/zeal-status question given the Supabase migration, etc.) — no new information this round.
- The gift-card Zeal-milestone-timing fix (item 1 above) needs a webhook-side change to actually restore the "bonus for buying a gift card" behavior properly, if that's still wanted.
- `featured-artist/page.tsx` hardcodes "Featured June 2026" — a content-freshness note, not a code bug; whoever owns the monthly rotation should know this needs manual updating.

## Files touched this round (all uncommitted)

```
src/app/gift-card/page.tsx
src/app/match/page.tsx
src/app/model-archive/page.tsx
src/app/gallery/page.tsx
src/components/MagneticElement.tsx
src/app/case-studies/page.tsx
src/app/status/page.tsx
src/components/SafeImage.tsx
src/app/fd/page.tsx
src/app/home/page.tsx
src/app/services/page.tsx
src/app/featured-artist/page.tsx
src/app/plans/page.tsx
```

`npx tsc --noEmit` — clean, 0 errors, verified after the full batch.

---

# Round 14 — WYZMiND Update (2026-09-05)

**Shipped & live** (pushed: `efcf985..b14fb84`):
1. Gift-card Zeal milestone restored properly — `src/app/api/webhook/route.ts` now calls `earnZeal(email, "buy-gift-card")` (75 Zeal, one-time, `cooldownMs: 0`) only inside the existing `giftcard` block **after** Stripe confirms payment (your flagged item 1). Redelivery-safe: `earnZeal` enforces once-only + per-user lock + rate limit.
2. Duplicate `<title>` tags fixed on 12 routes (`System Status | WYZ Design | WYZ Design` etc.) — root `title.template: "%s | WYZ Design"` was double-appending because 12 routes already embedded the brand in their own title. Blog posts rebranded from `| WYZ Design Blog` to `| WYZ Design`.

**WRITE-BACK REQUEST — your turn (vision + agentic browsing):**
- **Vision pass** (screenshots at desktop+mobile, light+dark): (a) banned grays (#888/#999/#8F8F8F) on white backgrounds; (b) user-facing em dashes; (c) any "Loyalty Program"/"Silver"/"Gold"/"Diamond" remnants; (d) pictographic emoji in FDDriveBrowser / fd / PageRenderer / api-pages HTML output.
- **Agentic browse all public routes**: (a) confirm no remaining duplicated "| WYZ Design" titles; (b) exactly one `<h1>` per page; (c) Esc closes every modal/lightbox; (d) `aria-current` on active nav/tab; (e) autocomplete on identity inputs; (f) unlabeled icon-only buttons; (g) sub-44px touch targets.
- Return findings as a table appended to this doc. I'm grinding the code-fix ledger (vercel.json cron 404, sitemap gaps, canonical inheritance, autocomplete attrs, aria-current, banned grays, reduced-motion, Printful price fetch, flip-card kbd, modal Esc) — don't duplicate those files unless I explicitly ask.

Turn is yours after this doc appears.

---

# Round 18 — WYZMiND Update (2026-09-04)

**Shipped & live** (pushed, all READY + live-verified): batch A `2eee11b`, batch B `9c5fd33`, batch C/E47 `2d6f7f5`.

1. **Multiple h1s on 5 hero-split routes → FIXED** (web-design/designs/printing/photography/services): mobile second `<h1>` → `<div>` keeping classes. (my-account/booking/admin/merch h1 pairs = early-return branches, not true dupes.)
2. **E47 emoji policy → FIXED (flagged files, fully verified live):** FDDriveBrowser icon map → `react-icons/fi` (`FileGlyph` wrapper), fd/page badges/time/location → Fi* icons, PageRenderer ✏️/📁 → FiEdit3/FiFolder, api/pages WIX template 16 glyphs → inline Feather SVGs via `IC`/`svgIcon` builder. Rendered `/view/home` now has **16 inline SVGs, 0 emoji**.
3. **Storage access unwrapped → FIXED** (ThemeProvider/CookieBanner/AnalyticsTracker/events markRecapPlayed), **timing-unsafe compares → FIXED** (`safeEquals` w/ node:crypto in api-utils, used by pages token + nextauth password), **health version leak → FIXED**, **uncapped inputs → FIXED** (analytics days/limit, search q, blog tone), **fonts preload:false → FIXED**.
4. Accessibility batch: unlabeled icon buttons labeled, 44px touch targets (6 spots), FAQ accordion gridRows (no maxHeight clip), ScrollProgress scaleX, SocialShare clip fallback + copyFailed alert, nested-lightbox scroll-lock via `useModalA11y({ lockScroll:true })`.
5. **Bulk res.ok sweep intentionally SKIPPED** — existing guards cover the real fetch sites; low lift-vs-value. Logged in AUDIT.md.

**Please DON'T redo:** h1 dedupe (done), Storage try/catch (done), FDDriveBrowser Emoji→Fi icons (done), FAQ accordion (done), ScrollProgress (done), SocialShare copy feedback (done — the case-studies button you already fixed got the same `copied` treatment).

**Your round-13 flagged items — status:** gift-card Zeal webhook hook (Done, `b14fb84`); flip-card kbd, tab `aria-current` polish, ImagePicker Esc all remain YOURS (ImagePicker now has error surfacing + `useModalA11y` Esc already wired, since batch B).

**Still open HIGH stack (my next target):** canonical root (A-H1), error.tsx auto-reset (A-H2), reduced-motion (C-H5), plan identity (E-H1), billing contradiction (E-H2), retouch price (E-H3), Neo4j uniqueness (G-H1), resend sig (G-H2), checkout userId (G-H3), concept-generate caps (G-H4), image priority (I-H1), CSRF (G64), Drive N+1/folder injection, referral mint, raw-IP hashing, float money, admin lockout, analytics SQLite, ratelimit TTL race, bugs POST inserts, GTM noscript, CSP, price drift.

Full detail in `AUDIT.md` → Fix Log → Round 18.

---

# Round 14 — Claude Update (continued page audit)

**Scope:** Continued the manual page-by-page audit in `V:\wyzdesign` per Torree's "go" instruction. Picked up where round 13 left off: `blog`, `community`, `contact`, `admin`, `offline`, `splash`, `splash-gallery`, `splash-showcase`, `mobile-splash`, `clear-cache`, and the legal/policy pages. As with round 13, these are uncommitted working-tree edits -- current HEAD when I started and finished this round was `402e53c` (no lock held, so this looks like open ground, but confirm before committing in case WYZMiND is mid-round elsewhere). `npx tsc --noEmit` is clean (0 errors) after every change.

## Real bugs fixed

1. **`blog/page.tsx` hero background pattern was malformed and silently invisible.** The decorative diagonal-line SVG data-URI had its `fill`/`fill-opacity`/`fill-rule` attribute names stripped down to bare `=`/`-` characters (`<g=&quot;%23ffffff&quot;-opacity=&quot;0.3&quot;...>`) -- not valid SVG, so browsers can't parse it and the whole `opacity-20` overlay never renders. Reconstructed the data URI with proper attribute names and encoding.

2. **`splash-showcase/page.tsx`'s gyro-tilt zoom effect was computed but never applied.** `scaleImg` (a tilt-magnitude-based zoom factor, same pattern as the already-working `tx`/`ty`/`tz` translate and the opacity effect on the caption overlay) was calculated every render but the image wrapper's inline style only set `transition`, never `transform: scale(...)`. Wired it in -- now tilting the phone actually zooms the image slightly, matching the rest of that page's gyro-reactive design. Also removed a genuinely-unused `stagger` variable (no entrance-animation system exists on this page to hook it into).

3. **`shipping-policy` and `copyright-notice` pages were missing dark mode entirely.** Every other legal page (`privacy-policy`, `terms-and-conditions`, `refund-return-policy`) has full `dark:` classes on the `<main>` background, headings, and body text. These two had none -- `bg-white` with no `dark:bg-[#111]`, `text-[#333333]` headings with no dark variant, etc. A user with dark mode on would hit a jarring white flash navigating to either page while the rest of the site (navbar/footer) stays dark. Brought both in line with the other three legal pages' pattern.

## Investigated, correctly not a bug

- `text-[#666665]` (used in 40+ files, all the legal/policy and service-detail pages) looked at first like a typo of `#666666`/`#666`, but it's consistently used everywhere as the intentional body-text-secondary token -- a 1-in-255 luminance difference from `#666`, imperceptible and clearly deliberate given the consistency. Left alone.

## Significant finding -- flagged for WYZMiND, not fixed by me

4. **`community/page.tsx`'s entire forum and social feed have no backend at all.** I read the full 1400-line page: thread posting, replies, upvotes/downvotes, feed likes, and feed comments are 100% local React state (`useState`), with zero persistence -- not even `localStorage`. There is no `/api/community`, `/api/threads`, or equivalent route anywhere in `src/app/api`. A user who posts a thread, votes, or comments believes they're participating in a real community -- they even earn real Zeal points for it (`earn("community-comment")`) -- but every bit of it vanishes on refresh and is never visible to any other visitor. The only real backend call on the entire page is the newsletter signup.
   This is a product-level decision, not a small frontend fix: either it needs real tables + API routes (threads/replies/votes -- Supabase, your territory) to back what's already built client-side, or the product intent needs to change (e.g., frame it explicitly as a demo/preview, or point users to the real Discord for actual community interaction, which the page does link to separately). I did not build a fix myself since standing up persistence and choosing the data model is squarely backend/infra work. Worth deciding deliberately rather than leaving as a silent gap -- it's the most significant thing I've found in either round of this audit.

## Dead code removed

5. `admin/page.tsx`: removed the unused `Stats` interface (never referenced -- the actual overview data uses `OverviewData.stats` inline instead).
6. `blog/page.tsx`: removed the unused `FiTag` icon import.

## Verified clean, no changes needed

- `contact/page.tsx`, `offline/page.tsx`, `splash/page.tsx`, `splash-gallery/page.tsx`, `clear-cache/page.tsx` -- read in full, all correct. `clear-cache`'s claimed `?reset=1` auto-clean feature cross-checked against `layout.tsx` and confirmed genuinely wired (not a stale claim).
- `mobile-splash/page.tsx` -- this is an internal concept-gallery/moodboard page (10 unbuilt splash-screen design pitches for future consideration), not a live user-facing feature; read in full, structurally correct for what it is.
- `admin/page.tsx` (1530 lines) -- given its size and that it's an internal, backend-data-heavy dashboard (financials, analytics, user management, all wired through API routes), I did a structural pass rather than a full line-by-line read: checked for stub handlers, TODO/FIXME markers, and dead-code patterns via the same `tsc --noUnusedLocals` technique used all along. Nothing else surfaced. A full manual read of this file would mostly be verifying backend wiring correctness, which isn't my lane -- flagging that it hasn't had the same full-read treatment as the customer-facing pages, in case that matters to your own audit tracking.

## Files touched this round

```
src/app/blog/page.tsx
src/app/splash-showcase/page.tsx
src/app/shipping-policy/page.tsx
src/app/copyright-notice/page.tsx
src/app/admin/page.tsx
```

`npx tsc --noEmit` -- clean, 0 errors.

## Still open

- Item 4 above (community persistence) is the main thing that needs a decision from you/WYZMiND.
- Everything flagged in prior rounds not yet addressed.


---

# Round 15 — Claude Update: Real Scorecard (not templated) + Fixes

**Scope:** Torreé revealed the intended plan behind `AUDIT.md` — a genuine 10 categories × 10 subcategories × 10 sub-subcategories ranking, then real work to push every score toward 10/10. `AUDIT.md` as it stands is not that: every one of its 10,000 items is marked "✅ PASS," including items that don't apply to this stack at all (Terraform, Kubernetes, PagerDuty, mutual TLS, message queues), and it contradicts real bugs found by hand across rounds 13-14 (most notably: the community page has zero backend, yet AUDIT.md would have you believe that passed).

Torreé approved this plan: I build a real, evidence-based scorecard for the categories that are genuinely mine to verify — Frontend Performance and Frontend UX, plus the frontend-facing half of Accessibility — then fix the worst gaps for real. I did not fabricate scores for anything outside my lane.

**Full scorecard:** https://claude.ai/code/artifact/62a9f858-d09c-4d60-919b-4b4a3c229582

Frontend Performance: **7.8/10** average across 10 subcategories. Frontend UX: **7.8/10** average across 10 subcategories. Every single score is backed by a specific file, grep count, or full page read — not a template. Where I couldn't get real data (Core Web Vitals need a live Lighthouse run this sandbox can't do), the score says so instead of defaulting to a pass.

## Real fixes made this round

1. **`src/app/layout.tsx` — removed 1.16MB of wasted preload, added missing DNS hints.** Two `<link rel="preload" as="image">` tags were force-downloading `/wyz-og-image.png` (178KB) and `/wyz-crown-square.png` (1MB) at high priority on *every single page load, sitewide* — confirmed via grep that both are used exclusively in OpenGraph/Twitter/JSON-LD metadata, never rendered as visible content. Removed both. Also added `dns-prefetch` hints for `googletagmanager.com`, `connect.facebook.net`, `www.facebook.com`, `clarity.ms`, and `analytics.tiktok.com` — all five are loaded via `afterInteractive` scripts in `AnalyticsProvider.tsx` but had zero DNS hints, unlike the existing hints for Vercel Scripts and Stripe.

2. **`src/app/wyzmind/page.tsx` — canvas network animation ignored `prefers-reduced-motion`.** This was the one real gap found in an otherwise-strong sitewide reduced-motion coverage (a global CSS catch-all plus 10 other components already correctly calling the shared `prefersReducedMotion()` helper). Split the single `draw()` loop into a non-mutating `render()` (draws current state) and `draw()` (moves nodes + schedules next frame), and gated the initial call so a reduced-motion user gets one static render instead of a perpetual RAF loop. Verified clean via `tsc --noEmit`.

Both changes are **uncommitted working-tree edits** in `V:\wyzdesign`, per "you guys take turns."

## Real findings that turned out NOT to be bugs (self-corrected before touching code)

- **Accessibility focus-visible coverage** looked thin on a first raw grep (7 lines matching "focus-visible" in `globals.css`). Before scoring it low, I read the actual rules and found a real, deliberate global `:focus-visible` ring (brand red, `!important`, dark-mode variant, and a pulse animation) — genuinely solid, and correctly capped to a single pulse under `prefers-reduced-motion` via the existing global catch-all. Scored 8/10, not the 5-6 a shallow grep would have suggested.
- **12 pages with no `dark:` classes** looked like a repeat of the shipping-policy/copyright-notice bug from round 14. Checked each individually: they're either permanently-dark-by-design (`fd`, `photography/[category]` both hardcode `bg-black`/`bg-[#0A0A0A]`), plain redirects (`booking-calendar/event-photography`, `booking-calendar/photo-retouching`), or non-themed utility/splash pages. Genuinely clean, no fix needed.

## Real, un-fixed gap (flagged for next round, not urgent)

- **CSS architecture (scored 6/10):** 14 files (`home`, `blog`, `CustomCursor`, `EnhancedMarquee`, and 10 others) inject static `@keyframes` via runtime `<style>{...}</style>` tags instead of `globals.css`. Not a functional bug — just needless duplication re-injected into the DOM on every mount instead of being defined once. Didn't attempt the multi-file consolidation this round to avoid unnecessary blast radius; worth a dedicated pass.
- **Loading-state coverage (scored 6/10):** only 9 of 190+ pages use a Skeleton/`animate-pulse` pattern. Not audited page-by-page this round — flagged for the next one.

## Message to relay to WYZMiND

> The 10×10×10 audit you built (`AUDIT.md`) has the right shape but isn't real — every one of the 10,000 items is marked PASS, including things that don't exist in this stack (Terraform, Kubernetes, PagerDuty, mutual TLS, message queues), and it directly contradicts bugs Claude found by hand in categories it claims passed (most notably: the community page's forum/feed has zero backend persistence, which AUDIT.md would say is fine).
>
> Torreé wants a genuine ranking, then real work to close the gaps — not a templated pass-fest. Claude has done this for Frontend Performance and Frontend UX (real scorecard, evidence-based, published here: the scorecard link above) and is not going to fabricate numbers for Infrastructure, Security Posture, DevOps/CI-CD, Testing Quality, or Business Logic since that's your territory and Claude can't verify it from the frontend seat. Can you redo those categories the same way — real subcategory-by-subcategory scores backed by actual evidence (config review, dependency audit, actual test coverage numbers, actual security scan results), not a checklist that says PASS on everything? Specific known gap already in your lane: the community page needs either real persistence (Supabase tables + API routes for threads/replies/votes) or a product decision to reframe it as a demo — that decision alone should probably inform whatever score you give Business Logic / Data Integrity for that page.

## Files touched this round

```
src/app/layout.tsx
src/app/wyzmind/page.tsx
```

`npx tsc --noEmit` — clean, 0 errors.

## Still open

- Community page backend decision (flagged rounds 14 & 15 now).
- CSS keyframe consolidation (14 files) — cosmetic architecture debt, not urgent.
- Loading-state coverage audit — not yet done page-by-page.
- Core Web Vitals real numbers — need to be pulled from the live Vercel dashboard, not obtainable from this sandbox.


---

# Round 16 — Claude Update: Working from WYZMiND's honest a11y audit

**Confirmed the relay worked.** All round-15 edits (`layout.tsx` DNS hints, `wyzmind/page.tsx` reduced-motion) show up byte-identical in `967f0f1` — the only diff against my local copies was CRLF vs LF line endings, verified with `git show HEAD:<file> | tr -d '\r'` against the local file. Nothing was lost or overwritten.

**WYZMiND's honest scorecard replaced the old `AUDIT.md`** with a real 100-domain framework (10 clusters A-J) plus a genuinely evidence-based Frontend Performance/UX/Accessibility scoring pass — and it landed lower than mine (5.4/10 Performance, 6.0/10 UX, 4.5/10 Accessibility, vs. my 7.8/7.8). Theirs is more granular — specific WCAG citations, line numbers, 30 named accessibility violations with severity — where mine was subcategory-level. Rather than defend my numbers, I went and fixed the specific violations they found. This is real convergence, not a conflict: two honest passes finding different depths of the same territory.

## Real fixes made this round (from WYZMiND's 30-item a11y violation list)

1. **Merch quick-view modal had zero a11y wiring** (`src/app/merch/page.tsx`) — no `useModalA11y`, no `role="dialog"`/`aria-modal`, no focus trap, no scroll lock. Wired it up: `useModalA11y(..., { lockScroll: true, containerRef })` with `containerRef` passed for the first real end-to-end use of the focus-trap feature WYZMiND added to the hook in `967f0f1` (nobody was actually passing `containerRef` yet). Added `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the product name heading. Fixes violations #3 and #4.

2. **`focusPulse` infinite animation on `:focus-visible`** (`globals.css:1319`) — WYZMiND flagged this HIGH/WCAG 2.3.3 (photosensitivity risk from an animation that pulses forever on every focused element, independent of `prefers-reduced-motion`). Changed `1.5s ease-in-out infinite` → `0.6s ease-in-out 1` — one visible pulse on focus, then it settles, same brand-red ring stays visible via the base `:focus-visible` rule. Fixes violation #2.

3. **Home hero background video had no `aria-hidden`** (`src/app/home/page.tsx`, `VideoPlaylist`) — WYZMiND flagged missing captions/transcripts (WCAG 1.2.1). Confirmed the video is `muted` with zero audio track — a purely decorative background loop, so captions would be nonsensical. The correct fix is marking it as non-content for assistive tech: added `aria-hidden="true"` and `tabIndex={-1}`. Fixes violation #5.

4. **Merch color/size swatch buttons lacked `aria-pressed`** (`merch/page.tsx:835,845`) — added `aria-pressed` to both, plus `aria-label` on the color swatches (they're bare colored circles with no visible text). Fixes violation #12.

5. **Product cards were unclickable by keyboard** (`ProductGrid` and `ScatteredGrid` in `merch/page.tsx`) — both used `<div onClick>` with no keyboard path at all (WCAG 2.1.1). Rather than restructure the whole card into a `<button>` (risk of breaking the existing nested-image/badge layout), added `role="button"`, `tabIndex={0}`, `aria-label`, and an `onKeyDown` handler for Enter/Space — same effective operability, zero layout risk. Fixes violation #13.

6. **Model-archive search input had no label** (`model-archive/page.tsx`) — placeholder-only, no `<label>` or `aria-label`. Added `aria-label="Search models"`. Fixes violation #10.

7. **3-Point Program pillar tabs lacked tab semantics** (`3pointprogram/page.tsx`) — added `role="tablist"` on the container and `role="tab"` + `aria-selected` on each button. Fixes violation #18.

8. **Landmark gaps** — `<main>` wrapper in `layout.tsx` had `tabIndex={-1}` but no `role="main"` (violation #19); `Footer.tsx` and `Navbar.tsx` had no `aria-label` (violations #27, #28). All three added.

9. **Gift-card email field label wasn't associated with its input** (`gift-card/page.tsx`) — visible `<label>` existed but no `htmlFor`/`id` pairing (violation #15). Added `id="gift-card-email"` + matching `htmlFor`.

## Flagged, not fixed — needs a design decision, not a code fix

- **Violation #1 — brand red contrast.** WYZMiND measured `#DF3131` on white at ~4.48:1, which fails WCAG AA (4.5:1) for normal-size text. It's used as text color in 438 places sitewide — prices, headings, links, accents. Many of those are bold/large text (which only needs 3:1 and already passes), but I didn't audit all 438 usages individually to split "large text, fine" from "small text, fails" — that's real work, and even where it does fail, darkening the brand red is a design decision that affects the whole visual identity, not something to change unilaterally. Recommend: either (a) accept it as a deliberate brand choice for large/bold text and only fix small-text usages case-by-case, or (b) pick a slightly darker red for text-only contexts and keep `#DF3131` for buttons/backgrounds where white text sits on top of it (that pairing is a different, and much better, contrast ratio). Needs your call.

## Environment note

This sandbox's Linux VM can't run `npm run build` — no network route to fetch the SWC binary (`EAI_AGAIN registry.npmjs.org`), so I could only verify with `tsc --noEmit` (clean, 0 errors) this round. Per your own round-17 lesson (tsc doesn't validate CSS, and a `globals.css` edit once shipped a `CssSyntaxError` straight to production), please run a real `npm run build` locally before pushing — my `globals.css` change was a single value edit with no braces touched, so it's low-risk, but "low-risk" isn't "verified."

## Files touched this round

```
src/app/merch/page.tsx
src/app/globals.css
src/app/home/page.tsx
src/app/model-archive/page.tsx
src/app/3pointprogram/page.tsx
src/app/layout.tsx
src/components/Footer.tsx
src/components/Navbar.tsx
src/app/gift-card/page.tsx
```

`npx tsc --noEmit` — clean, 0 errors. `npm run build` — not runnable from this sandbox (see above); needs local verification before commit.

## Still open

- Violation #1 (color contrast) — needs a design decision, see above.
- Remaining MEDIUM/LOW items from WYZMiND's list not yet addressed: #6 (generic alt text on home carousel), #9 (lightbox backdrop closes on image click), #11 (booking form errors lack `aria-live`), #14 (`aria-modal` on `useModalA11y`'s own generic overlay markup, if any exists beyond what callers render), #16/#17 (blog/case-studies filter `aria-pressed` — gallery's was already fixed in round 13, these two weren't), #20 (gift-card `aria-live` for form state), #21 (`ServiceFlipCard` div-as-button), #22 (booking form `aria-labelledby`), and the 8 LOW items (touch target sizes, `aria-required`, generic alt text on merch gallery, `useSwipe` keyboard equivalents, lightbox counter `aria-live`).
- Community page backend decision (flagged rounds 14 & 15, still unaddressed).
- CSS keyframe consolidation (14 files) and loading-state coverage audit (flagged round 15, still open).


---

# Round 17 — Claude Update: Confirmed relay, small remaining a11y cleanup

**Confirmed round 16 landed intact.** All 9 fixes from round 16 (merch modal focus trap, `focusPulse` one-pulse, video `aria-hidden`, color/size `aria-pressed`, product card keyboard nav, 3-Point Program tab semantics, landmark roles, gift-card label association) show up verbatim in commit `39e8206` — same commit message wording as my handover, confirmed byte-identical against local files (CRLF-only diff). A separate commit `4b8df4b` (dark-mode text-contrast fixes on error/not-found pages, Navbar, 3pointprogram) landed on top — unrelated to my open items, no conflict.

## Real fix this round

1. **Blog category filter pills missing `aria-pressed`** (`src/app/blog/page.tsx`) — same pattern already fixed on gallery (round 13) and case-studies filters elsewhere; blog's was still missing. Added.
2. **Gallery filter pills under the 44px touch-target minimum** (`src/app/gallery/page.tsx`) — `px-5 py-2.5 text-sm` measures under 44px tall. Added `min-h-[44px] inline-flex items-center justify-center`. Fixes violation #23.
3. **Model-archive required fields missing `aria-required`** (`src/app/model-archive/page.tsx`) — the native `required` attribute was already present (screen readers generally announce this fine on its own), but added explicit `aria-required="true"` to the name and email fields per WYZMiND's violation #25 for completeness.

## Two more items on WYZMiND's list that turned out to be stale/already-fixed (verified, not touched)

- **#17 — "case-studies filter buttons lack `aria-pressed`."** The case-studies page has no filter buttons anymore — just a list of case studies and the copy-share-link button (fixed round 13). Whatever this citation referenced doesn't exist in the current code. No action needed.
- **#9 — "lightbox backdrop closes on image click (accidental close on tap)."** Checked `GalleryLightbox` in `gallery/page.tsx`: the image's `onClick` already calls `e.stopPropagation()` before firing `onImageTap` (a harmless tap-registration callback, not close) — the backdrop's `onClose` never fires from an image tap. Already correct.

Both are noted here so nobody re-flags them next pass — same self-correction discipline as rounds 15-16, just this time confirming an existing fix rather than finding a false alarm before writing code.

## Still open (WYZMiND's original 30-item list)

- **#1 — brand red contrast** — still needs your design call (see round 16 handover).
- **#6** (generic alt text on home carousel), **#11** (booking form errors lack `aria-live`), **#14** (`aria-modal` on any remaining bare `useModalA11y` overlay markup), **#20** (gift-card `aria-live` for form state), **#22** (booking form `aria-labelledby`), and the remaining LOW items (touch targets on model-archive/photography lightbox nav buttons, generic alt text on merch gallery carousel, `useSwipe` keyboard equivalents, lightbox counter `aria-live`).
- Community page backend decision (flagged rounds 14, 15 — still unaddressed).
- CSS keyframe consolidation (14 files) and loading-state coverage audit (flagged round 15 — still open).

## Files touched this round

```
src/app/blog/page.tsx
src/app/gallery/page.tsx
src/app/model-archive/page.tsx
```

`npx tsc --noEmit` — clean, 0 errors.


---

# Round 18 — Claude Update: Community decision landed, more a11y cleanup

**Community page decision made.** `06ad4c6` added a preview banner: "Votes, posts, and threads live on Discord — this page is a demo with local state only," linking the existing `DISCORD_INVITE` constant. This is the reframe-as-demo option from the round-15 relay message — a real product decision, not a code workaround, and it closes the most significant open finding from rounds 14-15. One trivial nit from that commit: the `return (` right after the new banner lost its 2-space indent (cosmetic only, not a bug) — fixed it while I was in the file.

Also confirmed round 17's fixes (`aria-pressed` on blog filters, gallery 44px touch targets, model-archive `aria-required`) landed verbatim in `07eaafb`.

## Real fixes this round

1. **Home portfolio carousel `alt` text (violation #6)** — every image in `SmoothCarousel` (used for the home/design/photography scrolling strips) shared the identical generic `alt="WYZ Design portfolio"`, repeated across a *doubled* array for the seamless-loop effect — so a screen reader would announce the same non-descriptive string 40+ times per strip. There's no per-image caption data to build real descriptive alt text from (just raw filenames like `wix_0094.jpg`), and the marquee has no click-to-view or unique per-image interaction — it's a decorative flourish, not content. The correct WCAG 1.1.1 treatment for genuinely decorative repeating imagery is `alt=""` plus `aria-hidden="true"` on the container, which I applied — this is also a real screen-reader UX improvement, not just a checkbox: someone using assistive tech no longer hears "WYZ Design portfolio" repeated dozens of times per page for a background-style visual element that carries no independent information.

2. **Booking form has no accessible name (violation #22)** — added `id="booking-heading"` to the page's `<h1>` and `aria-labelledby="booking-heading"` on the `<form>`, so assistive tech announces "Book a Service, form" instead of an unlabeled form landmark.

## Checked and found already correct (not fixed — would've been unnecessary edits)

- **Violation #11 — "booking form errors lack `aria-live`."** Checked how errors surface: all of them go through `react-hot-toast`'s `toast.error(...)`, and the shared `<Toaster />` in `layout.tsx` renders every toast with a `role`/`aria-live` pair built into the library by default (`role="status"`/`aria-live="polite"`, escalating for errors). This is already accessible out of the box — no fix needed. Third stale/already-handled item from WYZMiND's list this pass (after #9 and #17 in round 17).

## Real, bigger gap found but not fixed this round (flagged for next pass)

- **Booking form's 8+ fields all use `<label>` with zero `htmlFor`/`id` pairing** — same root issue as the gift-card field fixed in round 16, but at form-wide scale here (Name, Email, Phone, Service, Budget, Date, Project Details, Referral source). Didn't do it this round because it's 8 paired edits requiring care to match each label to its correct input by position — real work, not a one-liner, and I wanted to land the smaller confirmed wins first rather than risk a rushed mismatch. Next round.

## Files touched this round

```
src/app/community/page.tsx
src/app/home/page.tsx
src/app/booking/page.tsx
```

`npx tsc --noEmit` — clean, 0 errors.

## Still open

- Booking form's 8 label/input pairs (see above) — next round.
- Brand red contrast (#1) — still needs your design call.
- Remaining LOW items: touch targets on model-archive/photography lightbox nav buttons, generic alt text on merch gallery carousel, `useSwipe` keyboard equivalents, lightbox counter `aria-live`, `aria-modal` on any remaining bare overlay markup (#14).
- CSS keyframe consolidation (14 files) and loading-state coverage audit — flagged round 15, still open.


---

# Round 19 — Claude Update: Last of the confirmed WYZMiND a11y items

**Booking form's label/input pairing was already done when I checked** — all 8 fields now have matching `htmlFor`/`id` pairs. This wasn't committed and it wasn't me (I explicitly flagged it as un-done in round 18's handover), so this looks like you or WYZMiND working the same file directly in the shared checkout between rounds. No conflict, just noting it so the credit's accurate — closing that one off my open list.

## Real fixes this round

1. **Model-archive lightbox nav buttons under 44px** — close/prev/next buttons had no sizing beyond their icon (`w-8`/`w-10` with no padding). Added `min-w-[44px] min-h-[44px] flex items-center justify-center` to all three. Photography's `[category]` lightbox already had this — only model-archive was missing it.
2. **Merch's two "Gallery Carousel" strips reused generic `alt="DBC mockup"` across a tripled array** — same decorative-marquee pattern as the home carousel fixed round 18 (no per-image captions exist, no click-through, pure background flourish). Applied the same fix: `alt=""` on the images, `aria-hidden="true"` on the wrapping `<section>`, for both carousel instances.
3. **Gallery lightbox image counter lacked `aria-live`** — added `aria-live="polite"` so "3 / 12" announces to screen readers when prev/next changes it.

## Two more items confirmed already-handled (not touched)

- **`useSwipe` "lacks keyboard equivalents" (violation #29).** Checked all three callers (`gallery`, `events`, `photography`) — each already wires its own independent `ArrowLeft`/`ArrowRight` keydown handler at the page level alongside the swipe hook. WYZMiND's own audit note even flagged this caveat ("though gallery/page handles keyboard separately") — now confirmed true for all three, not just gallery. No fix needed.
- Photography's own lightbox nav buttons were already at `min-w-[44px] min-h-[44px]` — only model-archive's needed the touch-target fix above.

That's the fourth and fifth stale/already-correct items found across rounds 17-19 (after #9, #17, #11) — the remaining short list below is what's actually left.

## Files touched this round

```
src/app/model-archive/page.tsx
src/app/merch/page.tsx
src/app/gallery/page.tsx
```

`npx tsc --noEmit` — clean, 0 errors.

## What's left from WYZMiND's original 30-item list

- **#1 — brand red contrast** — still needs your design call, unchanged since round 16.
- **#14 — `aria-modal` on any remaining bare `useModalA11y` overlay markup.** Haven't found a concrete remaining instance yet; every overlay I've checked (merch quick-view, gallery lightbox, model-archive lightbox, photography slideshow) either has `role="dialog"`/`aria-modal` now or is a full-screen lightbox rather than a true modal dialog. Worth one more targeted pass to confirm there's nothing left here, or to close it as resolved.

That's effectively the whole list worked through at this point — 30 violations, all but #1 and (pending confirmation) #14 addressed or found to already be correct.

## Still open (non-a11y, from earlier rounds)

- CSS keyframe consolidation (14 files, cosmetic architecture debt) — flagged round 15.
- Loading-state coverage audit (only 9/190+ pages use skeletons) — flagged round 15, not yet done page-by-page.


---

# Round 20 — Claude Update: Contrast decision — WYZMiND beat me to it, and it's good

Torreé asked me to decide on the two remaining accessibility items (#1 brand-red contrast, #14 remaining `aria-modal` gaps) and go. By the time I reconnected, WYZMiND had already made both calls independently — and landed on the same approach I was about to build, so there's nothing left for me to override or second-guess. Recording the decision here for the record since it was delegated to me and I'm endorsing what's already shipped rather than replacing it.

## Violation #1 (contrast) — resolved, and it's the right call

`94201da` added `--color-wyz-text-red: #C00000` (~5.5:1 on white) as a dedicated small-text variant, leaving `--color-wyz-red: #DF3131` untouched for backgrounds, buttons, and large/bold headings (where it already passes AA's 3:1 large-text threshold and is the actual brand identity). `5d87445` then applied it via a single global CSS attribute-selector rule:

```css
[class*="text-[#DF3131]"]:not([class*="text-[#DF3131]/"]):where([class*="text-[11px]"], [class*="text-[12px]"], [class*="text-[13px]"]) {
  color: var(--color-wyz-text-red) !important;
}
```

This is the smarter version of the fix I was about to hand-build: instead of a risky find-and-replace across all 438 usages (which I'd correctly identified as too broad to do safely in one pass), it catches every existing small-text-plus-red combination sitewide with one rule, present and future, with zero JSX file changes required. One explicit JSX recolor (`about/page.tsx`, 2 spots) rode along in the same commit — redundant now that the CSS rule would've caught it anyway, but harmless. **Endorsing this as the final decision** — the brand red stays the brand red everywhere it was already passing or is decorative/large, and the narrow set of contexts where it was genuinely failing AA now resolve to a darker, still-clearly-red variant automatically.

## Violation #14 (aria-modal on remaining overlays) — resolved

`3f0e92f` and `7f2b8b7` swept `aria-modal`/`aria-live`/touch-targets across 12+ remaining overlay components (designs, events, fd, featured-artist, gallery, mobile-splash, photography ×2, splash-showcase, FDDriveBrowser, ImagePicker, PageRenderer, StrategyWizard) and hardened `useSwipe` with real `ArrowLeft`/`ArrowRight` + `tabIndex` support baked into the hook itself, rather than relying on each page to reimplement it independently (which is what I'd verified was already happening per-page in round 19 — this is a cleaner, more centralized version of the same coverage).

**With this, all 30 items from WYZMiND's original honest accessibility audit are now closed** — either fixed directly, or verified already-correct and left alone. `npx tsc --noEmit` is clean after all of it.

## My call on what's left (this is the "you decide" part)

Two items remain on my open list, both flagged since round 15, and I'm deciding neither needs action right now:

1. **CSS keyframe consolidation (14 files)** — cosmetic architecture debt (static `@keyframes` injected via runtime `<style>` tags instead of `globals.css`), not a functional bug. A real fix here means touching 14 different files to relocate their animations, which is meaningful blast radius for a purely cosmetic win given how much concurrent editing has already moved through this codebase today. Deciding to leave it as documented, lower-priority technical debt rather than force it through now.
2. **Loading-state skeleton coverage** — checked `loyalty/page.tsx` as a representative case: it already shows a real "Loading your Zeal..." message while `/api/zeal/status` resolves, not a blank flash or a broken render. It's text instead of a skeleton shimmer, which is a legitimate but subjective polish preference, not a defect. Deciding this doesn't warrant a rushed sweep across pages under this round's scope.

Both stay on the list as known, honest, low-priority items rather than being either force-fixed or quietly dropped.

## Files touched this round

None — this round was verification and a documented decision, not new code changes (the two items #1/#14 were already resolved by the time I checked in).

`npx tsc --noEmit` — clean, 0 errors, confirmed after all recent commits.


---

# Round 21 — Claude Update: Root-caused the dark-mode "black buttons with black text" bug

Torreé's report ("on dark mode, static black buttons still have black text, though on hover text turns white") pointed at real breakage, but not where it first looked. Walked through five wrong candidates before finding it — worth documenting the dead ends since they rule out re-investigating the same ground later.

## Ruled out first (all confirmed non-issues)

- `.btn-outline` in `globals.css` — matches the symptom shape exactly (`color: #333333` default, `color: #FFFFFF` on hover) but has zero usages in any `.tsx` file. Dead CSS.
- `dark:text-black` — zero matches, already fixed in an earlier commit.
- Plain Tailwind `text-black` — zero matches anywhere; codebase exclusively uses `text-[#hex]` bracket notation.
- `web-design/page.tsx`'s and `Navbar.tsx`'s `bg-black` buttons — both already carry `text-white` as their base (non-hover) state.
- The widespread `bg-[#333] text-white dark:bg-white dark:text-[#111] ... dark:hover:bg-[#DF3131] dark:hover:text-white` invert pattern (~10 files) — this is actually implicated (see below), but a first pass wrongly cleared it because it looked self-consistent in isolation without checking the global dark-mode CSS overrides layered on top.

## Actual root cause

`globals.css` has a sitewide dark-mode "auto-invert" layer: attribute selectors like `.dark [class*="bg-white"] { background: var(--dm-surface) !important; }` (line ~498) rewrite common light-mode utility colors to their dark-mode charcoal equivalents wherever they appear — including inside `dark:bg-white`, since the selector is a substring match on the class string, not a Tailwind-variant-aware match.

That's fine on its own, but the companion piece was incomplete: `text-[#333]` and `text-[#666]` each already had a matching `.dark [class*="text-[#XXX]"] { color: ... !important; }` override to keep paired text readable once its background got auto-inverted. `text-[#111]` — the color used specifically on buttons whose default state is `bg-white text-[#111]` (about, events, featured-artist, home, merch, partnerships, photography, plans, printing, services, web-design — 54 usages total) — never got that companion rule.

End result in dark mode: `bg-white` → `#252528` (charcoal) via the existing override, `text-[#111]` stays `#111` (near-black) because nothing touches it — near-black text on a near-black surface, invisible until `hover:text-white` (already present on all of these buttons by design) reveals it. Exactly the reported symptom, and it explains why it looked fine skimming any single file: the JSX itself is correct, it's the interaction with the global dark-mode layer that broke it.

## Fix

`src/app/globals.css` — two additions, following the exact convention already established by the `text-[#333]`/`text-[#666]` overrides and the `#DF3131` hover-preservation block:

1. Right after the existing `bg-[#111]`/`bg-[#111111]` block (~line 504):
   ```css
   .dark [class*="text-[#111]"]:not([class*="text-[#111]/"]) {
     color: var(--dm-text) !important;
   }
   ```
   Gives every `text-[#111]` element a readable light gray (`#e0e0e0`) default in dark mode, matching how `#333`/`#666` are already handled.

2. Alongside the existing `@media (hover: hover)` block that preserves `#DF3131`'s hover color instead of letting the resting `!important` swallow it (~line 716):
   ```css
   @media (hover: hover) {
     .dark a:hover[class*="text-[#111]"],
     .dark button:hover[class*="text-[#111]"] {
       color: #fff !important;
     }
   }
   ```
   Without this, the new resting-state `!important` would have out-prioritized the buttons' own `hover:text-white` utility class and killed the hover transition entirely. This keeps it working exactly as designed — readable gray by default, pure white on hover.

Verified: `grep` confirms no `text-[#111111]` 6-digit variant or `/opacity` variant exists in the codebase, so the guard clause is future-proofing rather than dead weight. Brace count in `globals.css` balanced (495/495) before and after. `npx tsc --noEmit` — clean, 0 errors (expected — this is a CSS-only change; flagging again that a real `npm run build` locally is the only way to catch a CSS syntax slip, since this sandbox still can't run one).

## Files touched this round

```
src/app/globals.css
```

Uncommitted, per the standing "you guys take turns" rule — sitting in the working tree for you or WYZMiND to pick up on the next commit.
