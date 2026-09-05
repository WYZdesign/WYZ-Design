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
