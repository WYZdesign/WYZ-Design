# WYZ Design — Handover for Claude
**Date:** 2026-09-02
**Repo:** V:\wyzdesign | **Live:** wyzdesign.com | **Port:** 3456
**Build:** 112+ pages, all clean

---

## ⚠️ STANDING DIVISION OF LABOR (applies to EVERY handover, every session)

**Claude owns ALL kinetic + frontend + visual + physical-device work — every single time.** Do not assume these are "unverifiable" or "needs a human." Claude can do literally anything Torreé can, including:

- **Kinetic / motion** — every animation, framer-motion choreography, gyroscope/tilt/parallax/3D effect, micro-interaction, hover/press feel, and `prefers-reduced-motion` handling.
- **Frontend / UI** — everything visual: layout, spacing, hero banners, marquees, overlays, spotlight effects, responsive/mobile behavior, z-index stacking, focus states, contrast.
- **Physical-device verification** — run the dev server / deploy preview in a real browser session and drive it with actual pointer, touch, and motion events. Claude has agentic browsing and a real browser. If a feature needs a "real device," use a live deployed preview + real browser automation, NOT a static source read. Gyro/tilt CAN be tested via an actual browser session with a devtools device-emulation + a real page load; at minimum, verify the permission-gating and event wiring against a live DOM, not just source.
- **Sign-in / authenticated flows** — Claude can and should sign in (token/session available or dev-auth) and exercise the full flow end-to-end rather than leaving it "for the human."

**Rule for WYZMiND (this host, agent side):** WYZMiND should NOT spend session time on kinetic/frontend/visual/physical-device verification. Route it all to Claude. WYZMiND owns: infra (env vars, DBs, migrations, Vercel), data layers, API/backend correctness, security, and cross-system wiring. When a task touches visuals/feel/devices, hand it to Claude in this file with a `CLAUDE TODO` section.

**How to hand off:** every time WYZMiND encounters kinetic/frontend/visual/device work, add it to this file under a clearly-marked `FOR CLAUDE — KINETIC/FRONTEND/DEVICE` heading with: the exact page/route, the file+line, the current behavior, and the desired behavior. No more "can't verify from here" — Claude owns it.

---

## Sessions 34-37 (2026-09-02) — Zeal/Supabase Migration + UI/UX + Motion
**Commits:** `b7193d8`, `d49e5a7`, `5d04762`, `ffb124f`, `a0013c8`

### THE BIG ONE: Zeal/Loyalty + Profile + Newsletter migrated Neo4j → Supabase
**This is the most important thing to verify. It closes the `/api/zeal/status` 500 that had been open for many sessions.**

The root cause was architectural, not a code bug: the vault's `NEO4J_URI` was `bolt://localhost:7687` — a **localhost** endpoint that (a) Vercel serverless can't reach, and (b) uses the Bolt **TCP** protocol which Vercel functions don't allow (same reason Redis got an Upstash REST fallback). It was never going to work in production no matter what env vars were set.

**Decision made (definitive):** Zeal/profile/newsletter now live in **Supabase Postgres** — the same DB the site already uses for referral/bookkeeping/forms. Neo4j is no longer a source of truth for the site (you can keep it local in WYZMiND separately — unrelated).

**Schema created in Supabase** (`ccznkpcmpadgftqhwvdx`, WYZ-Design project) via the Management API using a user-level `sbp_...` access token (vault key `muse_SUPABASE_ACCESS_TOKEN` — it's account-wide, covers all projects, good ~90 days). 4 tables, RLS-enabled (`sql/zeal-supabase-migration.sql`):
- `zeal_users` (email PK, points, tier, actions/achievements/quests_completed/counters as jsonb, visit_streak, longest_streak, last_visit_day)
- `loyalty_transactions` (email, amount, reason, created_at)
- `profiles` (user profile fields, role, provider, avatar_url, socials)
- `newsletter_subscribers` (email, active, subscribed_at)

**Code refactor:**
- `src/lib/zeal-store.ts` (NEW) — Supabase CRUD for `zeal_users` + `loyalty_transactions`. `addLoyaltyPoints()` recomputes points from summed transaction history atomically, then derives tier.
- `src/lib/wyzmind.ts` — `findOrCreateUser`, `updateUserProfile`, `updateUserIdentity`, `isAdmin`, `getAllUsers`, newsletter funcs, `getDashboardStats`, `getLoyaltyPoints`, `getUserByEmail` all rewritten over Supabase. Uses a `datum()` helper that snake_case→camelCase normalizes so return shapes stay identical to the old Neo4j versions (consumers don't break). `addLoyaltyPoints`/`getLoyaltyHistory` re-export from `zeal-store.ts`.
- `src/lib/zeal.ts` — `loadUserState`/`saveUserState` now Supabase-backed; `getZealStatus` keeps graceful degrade as a safety net on any store error.
- `src/app/status/page.tsx` — replaced `checkNeo4j()` with `checkZealDatabase()` (queries `zeal_users` via service client).
- Deleted orphaned `src/lib/neo4j-setup.ts`; removed `ensureNeo4jConstraints()` calls from admin + zeal status routes.

**IMPORTANT for you to verify with agentic browsing:** open `/loyalty`, sign in (or check the API), confirm `/api/zeal/status` returns `200` with real `points`/`tier` (NOT 500, NOT the "Zeal is Taking a Nap" degraded card). Also verify the profile and newsletter APIs persist. The old graceful-degrade card should now only appear if Supabase itself errors.

### UI/UX fixes (visual, verify in browser at 375x667 + desktop)
- **Events YouTube section** — removed double black overlays + static red glow divs; replaced with a uniform `bg-black/65` overlay + a **mouse-tracking red spotlight** (`radial-gradient` following cursor) across the whole background.
- **About hero** — same treatment: `bg-black/65` + mouse-tracking spotlight (was a `bg-gradient-to-b` 80/60/100 overlay).
- **Events hero video autoplay** — added `preload="auto"` + `key={heroVideo}` so the `<video>` remounts and reliably autoplays a **random event recap** on every refresh.
- **ColorAuraVideo flip-card playlist** — added `autoPlay` + `preload="auto"` so videos between the carousel galleries actually play on mount.
- **Events hero content centering** — text container changed from `h-full` (didn't stretch against `min-h-screen`) to `absolute inset-0` flex, so h1/paragraph/BUTTON center vertically.
- **"Zeal Rewards" renamed → "Rewards"** — metadata, footer link, search, layout. Live title now "Rewards | WYZ Design".

### Motion / a11y consistency (global)
- **Form focus states** — added a global `:where()` rule in `globals.css` `@layer base`: smooth 0.25s red focus ring (border + box-shadow) on all plain text/email/tel/url/number inputs + textareas. Components defining their own focus (DynamicForm) unaffected (specificity ordering).
- **Scroll lock** on splash page + mobile hamburger menu; **back-to-top hidden** when menu open or near top (`!visible || hidden` in `ScrollToTop.tsx`).
- **Card/hover audit** — verified `Services.tsx` etc. already use consistent recipes (border shift + shadow + icon scale). `.spring-hover` remains defined-but-unused as an available utility.
- **Horizontal overflow** — `overflow-x: clip` on html / `hidden` on body handles the far-right negative-space issue.

---

## Prior Sessions (30-33) — most verified PASS
### Hero Spacing — ALL VERIFIED PASS
Every hero across all 9 pages: `min-h-screen`, `bg-black/65`, H1 `text-[2rem]` mobile, tagline→H1/H1→p/ p→buttons `mb-4`/`mb-4`/`mb-6`, paragraph `max-w-sm`, buttons `flex-row flex-nowrap px-5 py-3 text-[12px]`.
**Home:** tagline `text-[6px] tracking-[0.1em] whitespace-nowrap`; container `py-8 sm:py-12 overflow-hidden`; buttons no `mt-6`; hero `min-h-[80vh] sm:min-h-[90vh] lg:min-h-screen` (intentional for video).

### Security (DEPLOYED)
- `gdrive-photos` / `gdrive-index`: `requireAdmin()` + `isSafeFolderId()` validation.
- Referral endpoint already has `x-convert-secret` gate.
- Zeal/earn, Zeal/redeem, profile routes now have CSRF origin checks (`validateCsrf`).
- Newsletter `verifyToken()` uses `crypto.timingSafeEqual` (timing-safe).

### Accessibility & Correctness (DEPLOYED)
- `/designs` dead anchors → `id="cover-art"/"flyers"/"logos"` + `scroll-mt-24`.
- `/web-design` low-contrast text `text-white/40`→`text-white/70`.
- Gallery/photography lightboxes gained `aria-label` prev/next.
- Community composer shows inline "Title and body are both required." error.
- Mid-word heading breaks fixed site-wide: letter-spaced headings (`M A T C H`, `G A L L E R Y`, `S E R V I C E S`, mobile menu labels) use non-breaking spaces.

### Motion / overlays (DEPLOYED)
- Global smooth-interaction baseline: `:where(button, a, [role="button"], ...)` 0.25s transitions + `:active { scale(0.97) }`.
- 11 remaining full-screen overlays wired to `wzFadeIn`/`wzScaleIn` (gallery, photography, events, designs, splash*, ImagePicker, NoiseOverlay).
- AgeGateModal fade-in; CookieBanner `wzSlideUp` real keyframe (was dead `sm:animate-slideUp`).
- Navbar z-index fixes; CookieBanner `z-[var(--z-modal)]`; ScrollToTop `z-[var(--z-toast)]`.

### Merch / data (DEPLOYED)
- Merch `$0.00` pricing fixed — fetches real variant prices from Printful V2 API.
- `sitemap.ts` / `PRODUCT_IDS` — /merch URLs derived from real Printful IDs (no more 1-14 soft-404s).
- admin dashboard "recent forms" `slice(-10)`→`slice(0,10)` (was showing oldest).
- Duplicate JSON-LD on `/photography` + `/services` deduped (offer catalog merged into layout version).
- Referral PII leak fixed — conversions endpoint no longer returns raw `referred_email`; session-vs-owner check enforced.

### Gyroscope / splash (DEPLOYED)
- iOS gyro permission gating via `useGyroPermission` (gesture-gated, was broken on iPhone).
- SplashVariants: 16/24 variants phone-tilt driven; `Depth`/`Magnetic`/`TiltGlass`/`MeshDrift` patched; Glitch + CaretType variants actually implemented; removed double-tilt on home cards.
- `/splash-gallery` replaced with 24-variant interactive gallery.
- `/mobile-splash` dark background fixed (`bg-dark` was a no-op → inline style from `DARK` constant).

---

## What's NOT Done (Your Queue — prioritized)

### HIGH PRIORITY — verify my migration actually works in production
1. **Live Zeal round-trip** — sign in on `/loyalty`, check `/api/zeal/status` returns 200 + real points (NOT the degrade card, NOT 500). This is THE thing I changed most and must be confirmed with agentic browsing since I can't sign in.
2. **Profile save persistence** — update profile on `/account`, reload, confirm bio/phone/socials persist (now going to `profiles` table).
3. **Newsletter opt-in** — subscribe in footer, confirm it lands in `newsletter_subscribers` (active). Double opt-in confirm flow intact.
4. **Admin dashboard** — `/admin` users + newsletter tabs should read from Supabase now. Confirm no "Neo4j offline" fallback message.
5. **Scan the rest of the API surface for other Neo4j references** — grep `getNeo4j|from "@/lib/wyzmind"` across `src/app/api/**`; anything still wired to `isNeo4jReachable`/`getNeo4j` that I missed.

### MEDIUM — Claude-owned (see FOR CLAUDE section; verify in a live browser, don't defer)
6. **Real-device gyro** — Claude: test SplashVariants (Depth/Glitch/Magnetic/TiltGlass/MeshDrift) + home/plans card tilt in a real browser session with device emulation + live page load. Verify permission-gating + event wiring against live DOM.
7. **Merch `S:1` stale-ticker artifact** — live `/merch` still had two ProductMarquee wrappers (one zero-height, old sequential `/merch/1..14` URLs) inside a streaming-SSR boundary. Invisible to humans but a crawler soft-404 risk. Claude: confirm whether the round-4 ScrollToTop/globals.css fixes are actually live and whether this persists.
8. **Left-align long-form paragraphs** — About founder bio + home "What We Do" are center-aligned (audit recommended left-align for >3 lines). User prefers center unless absolutely necessary — confirm before changing (copy decision, not a bug).
9. **Hero container redesign** — square containers for half-panel heroes, 2:4 rectangle for full-stretched, closed in a prior session but re-verify visually. Claude-owned.

### LOW
10. **`/community` NSFW gating + composer** — re-verify.
11. **Form focus states on booking/contact ** — confirms the global ring actually applies; some inputs use inline `outline-none` and may need the global rule to win.

---

## FOR CLAUDE — KINETIC/FRONTEND/DEVICE (YOURS — verify & finish, you own these)
Claude owns all of the below. Use agentic browsing + a real browser session; do not defer to Torreé. Sign in to exercise authenticated flows:
- **Sign in and drive the Zeal flow end-to-end**: earn points (`POST /api/zeal/earn`), redeem a reward (`POST /api/zeal/redeem`), refresh the progress bar, watch tier progression. Brand-new backend logic — THE most valuable test.
- **Verify `/api/zeal/status`** returns `200` + real `points`/`tier` (NOT "Zeal is Taking a Nap", NOT 500). Confirm profile + newsletter persistence round-trips.
- **Verify the mouse-tracking spotlights** on `/events` (YouTube section) and `/about` (hero) actually follow the cursor in a live browser.
- **Check `/status`** shows "Zeal DB (Supabase)" green and no "Neo4j" row.
- **Confirm the random event-recap hero video** changes on refresh and autoplays on `/events`.
- **Test mobile menu scroll-lock + back-to-top hiding** at 375px (open hamburger, body doesn't scroll, floating buttons hidden/covered).
- **Real-device gyro/tilt** (SplashVariants Depth/Glitch/Magnetic/TiltGlass/MeshDrift, home/plans card tilt): test in a real browser with device emulation + real page load; verify permission-gating and event wiring against live DOM.
- **CSP**: read Vercel function logs for `[csp-violation]` to identify the actual directive being tripped.

---

## Verification Pattern
```
# Build
npm run build  # must show all routes clean

# Screenshot at 375x667
node _shot-se.mjs  # creates screenshots/se-*.png

# Check for dead links
# Check contrast ratios
# Check aria-labels on all icon-only buttons
```

## File Locations
- Zeal store: `src/lib/zeal-store.ts` | Zeal engine: `src/lib/zeal.ts`
- DB layer: `src/lib/wyzmind.ts` (Supabase now) | `src/lib/supabase.ts`
- Migration SQL: `sql/zeal-supabase-migration.sql`
- Heroes: `src/app/*/page.tsx` (each page has its own hero section, not a shared component)
- Lightboxes: `src/app/gallery/page.tsx`, `src/app/photography/page.tsx`
- API routes: `src/app/api/*/route.ts`
- Admin auth: `src/lib/admin-auth.ts` (`requireAdmin()`)
- Marquee: `src/components/EnhancedMarquee.tsx`
- Navbar: `src/components/Navbar.tsx`

## Supabase access (for you)
- Vault keys (WYZMIND host): `muse_SUPABASE_ACCESS_TOKEN` (Management API, account-wide, ~90 days), `wyzdesign_SUPABASE_SERVICE_ROLE_KEY`, `wyzdesign_NEXT_PUBLIC_SUPABASE_URL` (project `ccznkpcmpadgftqhwvdx`).
- Tables: `zeal_users`, `loyalty_transactions`, `profiles`, `newsletter_subscribers` — all RLS-enabled, service-role-only access.

---

### Hero Spacing (Sessions 30-32) — ALL VERIFIED PASS
Every hero across all 9 pages now has:
- `min-h-screen` (full viewport)
- `bg-black/65` overlay (uniform)
- H1: `text-[2rem]` on mobile (32px)
- Tagline → H1: `mb-4` (16px)
- H1 → Paragraph: `mb-4` (16px)
- Paragraph → Buttons: `mb-6` (24px)
- Paragraph: `max-w-sm` (384px, never wider than H1)
- Buttons: `flex-row flex-nowrap` (side by side, never stacked)
- Buttons: `px-5 py-3 text-[12px]` (compact for 375px)

**Home page specifics:**
- Tagline: `text-[6px] tracking-[0.1em] whitespace-nowrap`
- Text container: `py-8 sm:py-12 overflow-hidden` (was py-16, caused dead space)
- Buttons div: no `mt-6` (was causing 106px gap before marquee)
- Hero: `min-h-[80vh] sm:min-h-[90vh] lg:min-h-screen` (not flat min-h-screen like others — intentional for video playlist hero)

### Security (Session 32) — DEPLOYED
- `gdrive-photos`: `requireAdmin()` + `isSafeFolderId()` validation
- `gdrive-index`: `requireAdmin()` + `isSafeFolderId()` validation on folder param
- Referral endpoint: already has `x-convert-secret` gate (was NOT open as initially reported)

### Accessibility & Correctness (Session 33) — DEPLOYED
- Dead anchor links on `/designs`: added `id="cover-art"`, `id="flyers"`, `id="logos"` with `scroll-mt-24`
- Low-contrast text on `/web-design`: `text-white/40` → `text-white/70`, hover `text-white/90`
- Gallery lightbox: added `aria-label="Previous image"` and `aria-label="Next image"`
- Photography lightbox: same aria-labels added
- Community composer: shows "Title and body are both required." error on empty submit
- Photography "Become a Model" form: already has proper error handling (toast.error + early return)
- Printing "Get a Quote" form: already has proper error handling (toast.error + early return)
- Merch product images: no `priority={true}` found — all use lazy loading by default (Session 33's finding was incorrect for this repo)

---

## What's NOT Done (Your Queue)

### HIGH PRIORITY
1. **Homepage hero** — `min-h-[80vh]` not `min-h-screen` (intentional for video, but inconsistent with other pages). Buttons div has `overflow-hidden px-2` which may cause clipping. Verify at 375x667.
2. **Booking-calendar title** — "Book a Photoshoot | WYZ Design | WYZ Design" (duplicated suffix). Page source not in this repo — need to find and fix separately.
3. **Photography duplicate hero video** — both desktop and mobile hero blocks render their own `<video autoPlay>` of the same file simultaneously (CSS visibility toggles, both download). Real bandwidth waste on mobile.

### MEDIUM PRIORITY
4. **`<div onClick>` as buttons** — gallery, designs, merch, events use div+onClick for lightbox/quick-view with no keyboard access. Convert to `<button>` for a11y.
5. **Raw `<img>` in gallery lightbox** — full-size view uses `<img>` not `next/image`. Added `loading="lazy"` as partial fix, but full fix means switching to `next/image`.
6. **No `next.config.js`** — no explicit image-optimization config. Images route through API proxy so not broken, but should exist.
7. **Profile endpoint** — echoes raw internal error messages to users, doesn't validate website/social links stored (rendered as clickable links elsewhere).
8. **Three duplicate image-editor components** — confirm with Torreé which to keep, delete the other two.

### LOW PRIORITY
9. **`/community` NSFW gating** — needs fresh confirmation (couldn't re-test composer this session).
10. **Carousel-pause-on-click** — new component logic for `/`, `/photography`, `/designs` carousels.
11. **Full hero-banner container redesign** — square containers for half-panel heroes, 2:4 rectangle for full-stretched, centered/wrapped text, equal header spacing, side-by-side buttons.
12. **Dark mode marquee outline** — Session 31 said the fill was `transparent` causing letter bleed, but the live code already has `#111` fill. Verify visually.

### ALREADY FIXED (don't chase)
- `/merch` product carousel links — now point to `/merch/1` through `/merch/14`
- `/loyalty` page title — no longer duplicated
- `/match` page title — now "Find Your Match | WYZ Design"
- `/account/my-account` page title — now "My Account | WYZ Design"
- `/partnerships` heading clipping — no longer overflowing at 375px

---

## Verification Pattern
```
# Build
npm run build  # must show 112/112 pages

# Screenshot at 375x667
node _shot-se.mjs  # creates screenshots/se-*.png

# Check for dead links
# Check contrast ratios
# Check aria-labels on all icon-only buttons
```

## File Locations
- Heroes: `src/app/*/page.tsx` (each page has its own hero section, not a shared component)
- Lightboxes: `src/app/gallery/page.tsx`, `src/app/photography/page.tsx`
- API routes: `src/app/api/*/route.ts`
- Admin auth: `src/lib/admin-auth.ts` (`requireAdmin()`)
- Marquee: `src/components/EnhancedMarquee.tsx`
- Navbar: `src/components/Navbar.tsx`
