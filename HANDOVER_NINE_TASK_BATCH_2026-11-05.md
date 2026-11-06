# Handover: the 9-item batch (home hero, events hero/video, nav, theme rebuild, spacing, carousels, merch strip, bundle sets) — 2026-11-05

Torreé handed me a 9-item list in one message. All 9 are done, verified with `npx tsc --noEmit` (clean, full tree) and `npx eslint` (clean, per-file, on every file touched). No git actions taken on my end — that's all yours to review/commit/push/deploy as usual. No `next build` was possible on my device (same standing SWC-binary limitation as every prior round), so the two CSS-only changes (items 1, 3, and the big one, item 5) are logically verified but not pixel-verified by me. Please give those a look in a real browser before shipping.

## 1. Home hero line colors

`src/app/home/page.tsx` — restored per-word coloring on the two-line hero: **WE** white, **MAKE** red / **WHAT** red, **WORKS** white. A recent commit (`c2526b4`, "home hero text layout") had collapsed this into whole-line coloring (`WE MAKE` all white, `WHAT WORKS` all red). Reverted to per-word.

## 2. Events hero formatting vs. home hero

No code change. Read the events hero carefully: it's already `SIMPLIFY` (red) `YOUR` (white) / `EVENT` (white) `PLANNING` (red) — two lines, per-word colored, animated with the same `TextSplit` component the home hero uses. It already matches the home hero's structural pattern  (and you said the colors there are fine). If there's a specific visual mismatch you're seeing that I'm not, point me at it and I'll take another pass.

## 3. Events hero video background

`src/app/events/page.tsx` — three precise edits, nothing else touched:
- Skip-intro start time bumped from 6s to **10s** in both places that set it (initial play, and the re-apply-on-loop-restart handler — `loop` restarts silently at 0 without firing `ended`, so there's a second spot that has to match).
- Overlay opacity **65% → 75%** as requested.
- Confirmed the rest of what you described was already built and working: a random DIY-show video picks on every page load (12 of the 13 real files in `public/videos/diy-shows/` are wired into `DIY_SHOWS_RAW` in `src/lib/data/events.ts` — flagging below), it's `preload="auto"` plus an early `<link rel="preload">` injected the moment the chosen video is known, and `loop` + `muted` + `playsInline` are already set for lag-free autoplay.

**Flag, not fixed:** `C.O. Reloaded Vol. 1 recap.mp4` exists in `public/videos/diy-shows/` but isn't listed in `DIY_SHOWS_RAW` at all, so it never gets picked. There's also a dead filter in the page (`v.title !== "C.O. Reloaded Vol. 1"`) that doesn't match anything in the data — looks like an earlier attempt to exclude a similarly-named video that no longer does anything. I didn't touch either, since I don't know if that video was left out on purpose (bad intro, quality issue, licensing) or just missed. Let me know and I'll add it to the pool or clean up the dead filter.

## 4. Nav restructure

`src/components/Navbar.tsx` — data-only change (`NAV_LINKS` / `MORE_GROUPS`), the rendering was already fully generic so nothing else needed touching:
- Main menu: **Home, Photography, Designs, Events, Printing**.
- More dropdown, in order: **About, Services, Merch, F.A.O.T.M., WYZMiND, Rewards, Community, Blog, Contact, FAQ**.
- Regrouped into 4 labeled sections that preserve that exact flattened order: **About** (About, Services), **Shop & Perks** (Merch, F.A.O.T.M., WYZMiND, Rewards), **Community** (Community, Blog), **Support** (Contact, FAQ). Open to renaming any of those group headers if you want something punchier.

## 5. Theme switcher — the big one

This is the one to actually click around on before it ships. Here's exactly what changed and, just as important, what didn't.

**The real bug, fixed:** the 6 themes now genuinely recolor the site. Previously `ColorThemeProvider` (`src/lib/color-theme-context.tsx`) set CSS variables that literally nothing read, so 5 of 6 themes did nothing visible at all, and "Midnight" was just a disguised duplicate of the dark-mode toggle that fought the real toggle for the same `.dark` class (I reproduced that fight live last round — toggle said Midnight, page showed light).

**How it actually recolors now, with no edits to the ~110 component files:** every theme now defines a light-mode and a dark-mode primary/hover color pair. `ColorThemeProvider` writes the active pair to `--wyz-primary` / `--wyz-primary-hover` on `<html>`. A new block at the bottom of `src/app/globals.css` re-points the generated Tailwind classes for the site's two brand hex colors (`#DF3131` and `#B82020`) — in their plain, `hover:`, `dark:`, `dark:hover:`, `focus:`, `focus-visible:`, and `group-hover:` forms — at those two variables. So when a theme is picked, every red button, link, border, and badge across the site that uses those exact utilities re-colors instantly.

**Scope of that recolor, stated plainly so it's not a surprise:** it covers solid `bg-`/`text-`/bormer-` usages of `#DF3131`/`#B82020` — the overwhelming majority of visible brand-red on the site. It does **not** cover: opacity-modified variants (`bg-[#DF3131]/20` and friends), gradient stops (`from-`/`via-`/`to-[#DF3131]`), or `shadow-`/`ring-` color utilities. Those exist in smaller numbers scattered across the codebase (roughly 40 more distinct exact utility strings, mostly low-visibility accents/glows) and I deliberately didn't hand-transcribe CSS overrides for all of them unverified — every rule I add is a rule I can't see rendered on this device, and getting an opacity/color-mix override subtly wrong is the kind of thing that only shows up live. If you want full 100% coverage, say so and I'll do a second pass just on those, and I'd want you to actually look at it in a browser before it ships.

**Light/dark variant per theme:** each of the 6 themes has its own light-mode and dark-mode color pair (dark variants are brighter/more saturated versions of the same hue, tuned for a near-black background). Which pair is live follows the **existing** sun/moon toggle in the top right — the color-theme picker no longer has any opinion about light/dark itself, so the two controls can't fight anymore. "Midnight" is now a real color theme (a purple family) like the other 5, not a hidden alias for dark mode.

**Guest preview vs. real default — this is the part I want you to double check:**
- A guest (not signed in) can click through any theme and watch the site recolor live, but nothing is written to storage. Reload the page, open a new tab, anything — it's back to Classic (red/gold/gray/white/black). That's the "preview only" behavior you asked for.
- A signed-in user's pick is saved to `localStorage` under its own key and restored next time they're signed in, including from a new picker I added in the **Appearance** section of `/account/my-account`.
- **Honest limitation:** "saved" above is still a per-browser `localStorage` value, not yet written to the account/profile in the database. So right now, an account's real default theme follows the browser, not the account, across devices. Making it truly account-level (same theme on a different device/browser) needs a profile field and an API round-trip — I didn't build that without being asked, since it touches the DB schema, but it's a natural next step if you want it to be a real cross-device preference.

**Also redesigned** `src/components/ThemeSwitcher.tsx` per your "needs to look much better" note: it was a plain list with a double gear-icon bug (two `<FiSettings>` icons in the same button, clearly a leftover mistake) and single swatch circles. Now it's a 3-column grid of two-tone swatches (primary + accent, split diagonally) with a checkmark on the active one, a header that states which light/dark variant is showing, and an explicit line at the bottom telling the visitor whether they're previewing or have it saved. Same component, same two places it's rendered in `Navbar.tsx` (desktop + mobile), so nothing else needed to change there.

**Not touched:** the dead, unimported `src/lib/theme-context.tsx` (flagged two handovers ago, still there, still a zero-risk delete whenever you get to it — I still can't `rm` it myself).

## 6. Spacing: Client Events carousel → YouTube section

`src/app/events/page.tsx` — added `mt-10 sm:mt-16` to the YouTube section's wrapper. There was no deliberate gap between the two sections at all before (the carousel's own bottom margin was all there was), so the "Client Events" heading and the start of the YouTube block sat right on top of each other.

## 7. Carousel image sizing: uniform height, no crop

Two components, same fix pattern — swap the fixed-width-plus-`object-cover` box (which crops anything that isn't exactly the box's aspect ratio) for a fixed-height-only box with the image/video shown at `object-contain`, auto width:
- `src/app/designs/page.tsx` — the shared `Carousel` component used for Cover Art, Flyers, and Logos. Flyers in particular are portrait event posters being forced into a landscape-ish box before this, so this is the biggest visible improvement of the three.
- `src/components/events/EventsVideo.tsx` — the `VideoCarousel` used for both DIY Shows and Client Events on `/events`.

Heights stay exactly as uniform as before; widths now vary per item so nothing gets cropped.

## 8. Designs-page merch strip → real, wired quick view

This was the biggest hidden problem in the batch: the "MERCH SHOP" strip on `/designs` was never connected to real products at all. It rendered 12 hardcoded archive lookbook photos with made-up prices ($35, $65...) under the name "Dying Breed Crew," and clicking one just linked to `/merch` — it couldn't actually show you that exact item.

Fixed properly:
- Pulled the quick-view modal out of `src/app/merch/page.tsx` into a new shared `QuickViewModal` component in `src/components/merch/MerchSections.tsx` — same exact markup and behavior, just reusable.
- Extracted the retrying Printful-catalog fetch (same one `/merch` already used) into a new shared hook, `src/hooks/usePrintfulCatalog.ts`, so any page can pull the same real, live, order-able product list without copy-pasting 40 lines of fetch/retry logic.
- `merch/page.tsx` now uses both of those instead of its own copies — verified identical behavior (clean `tsc`/`eslint`, no logic changes, just de-duplicated).
- `designs/page.tsx`'s merch strip now pulls the same live catalog and opens the same real quick-view modal on click, with a "Quick View" hover label matching the one already on `/merch`. The fake `dbcMerch` mock array is gone entirely.

## 9. Merch bundle sets: 3 more

`src/components/merch/MerchSections.tsx`, `BundleSets()`. It used to grab exactly one product per category (`Apparel`/`Headwear`/`Accessories`) via `.find()` and build exactly 3 sets from those three items. Now it pulls every product per category and can build up to 3 more real combinations: **Cap + Carry** ((headwear + accessory, no top), **Double Top** (two different tops bundled), and **The Alt Fit** (a second full-fit combination using the second-pick item in each category where one exists). Since the catalog comes live from Printful and its contents can change, every new set is built by position-within-category rather than by hardcoded product names, and a de-dupe guard means you'll never see two sets with the exact same items even if the catalog is small on a given day — it just gracefully shows fewer sets instead of duplicating one.

## Everything verified

- `npx tsc --noEmit` — clean, full tree, after every single edit in this batch.
- `npx eslint` — clean on every file touched ((ran per-file; full-tree eslint still times out at 120s on this device, same as prior rounds).
- No `next build` — same SWC-binary limitation as every round so far. Items 1, 3, and 5 are CSS/visual changes I could not screenshot-verify myself; please eyeball those three before they go out, especially the theme switcher.

## Not done, by design

No git actions. No deletion of `src/lib/theme-context.tsx` (still flagged, still blocked, still zero-risk whenever you get to it). No DB/profile-level theme persistence (flagged above under item 5 as a clear next step if you want it). No full coverage of opacity/gradient/shadow color utilities in the theme override (flagged above under item 5, happy to do a follow-up pass).
