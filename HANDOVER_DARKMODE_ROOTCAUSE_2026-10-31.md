# Dark mode was never actually wired up — root cause + fix — 2026-10-31

Torreé flagged that light and dark look the same no matter what's clicked, and asked for a full light/dark audit across the whole site. Went and found the actual root cause instead of guessing — this was a real, sitewide bug, not a cosmetic nitpick.

## What was actually wrong

**The light/dark toggle button has never worked, on any page, for anyone.** Not something either of my last two changes broke — this goes back to however this app's dark mode was first wired up, and nobody would have caught it by testing in a normal browser.

`ThemeProvider.tsx` does the right thing: it toggles a `dark` class on `<html>` and saves the choice to `localStorage`. That part's fine. The problem is on the CSS side: this project runs Tailwind v4, and in v4, the `dark:` prefix compiles to `@media (prefers-color-scheme: dark)` — your operating system's dark/light setting — **unless** the stylesheet explicitly tells it to key off a class instead. Nothing in `globals.css` told it to. So every single `dark:bg-...`, `dark:text-...` etc. utility across the entire codebase was silently just mirroring whatever dark/light mode your OS or browser happens to be set to, and completely ignoring the in-app toggle, localStorage, and the `dark` class ThemeProvider was faithfully adding and removing the whole time.

That's why it looked like nothing was happening when the toggle was clicked: the icon flipped (sun ↔ moon) and the choice saved, but the actual page colors were never listening to that — they were listening to the browser/OS instead. If your OS was in dark mode, the toggle did nothing because `dark:` was always active anyway. If your OS was in light mode, it also did nothing, because `dark:` could never activate no matter what you clicked.

## The fix

One line, in `src/app/globals.css`, right after the Tailwind import:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

This is the standard, documented Tailwind v4 way to make `dark:` respect a class on `<html>` instead of the OS media query — which is what this codebase's whole component layer (`dark:bg-[#1C1C1E]`, `dark:text-white`, etc., used in literally hundreds of places) was already written assuming was happening. This single declaration makes all of that correct, sitewide, in one shot. Nothing else had to change for the mechanism itself.

**File:** `src/app/globals.css`

I could not run a full production build on this device to triple-verify (the Next.js SWC binary isn't installed in this Linux environment — same limitation as every other round; `tsc`/`eslint` remain the available checks here), but this is a single, well-documented Tailwind v4 directive with no ambiguity in its behavior, and it's additive — it doesn't remove or restructure anything that was already there.

## The audit you asked for: which pages are actually dark-mode-ready now that the switch works

Once that one-line fix ships, every page's `dark:` classes start actually applying for real, for the first time. So I went through every top-level page and counted how much `dark:` coverage each one has, because now that the toggle works, coverage gaps that were invisible before (since `dark:` never fired) will suddenly be visible gaps.

**Pages that are fine with zero `dark:` classes — by design, not a bug:** `/admin` (its own always-dark dashboard, same as the hero banners elsewhere — doesn't need to flip with the site theme), the splash/gate pages (`/`, `/splash`, `/splash-gallery`, `/mobile-splash`), and a few utility pages (`/clear-cache`, `/offline`, `/secret`). These are all intentionally fixed-palette and shouldn't change with light/dark.

**The one real gap I found and fixed this round: `/merch`.** This was the standout — your shop page had 1 `dark:` class out of roughly 55 on the page itself, and the shared `ProductGrid`/`BundleSets` components it uses had partial coverage. That means once the toggle actually works, switching to dark mode on `/merch` would have looked broken: white product cards, a white size-guide popup, and a white quick-view popup all sitting on top of a dark page background. Fixed it properly — category filter buttons, the sort dropdown, the size guide modal, the quick-view modal, and the product card grid all now have real dark-mode styling that matches the rest of the site's dark palette, instead of just going dark around them.

**Files:** `src/app/merch/page.tsx`, `src/components/merch/MerchSections.tsx`

**Pages with decent-to-strong existing coverage already** (so lower priority, but not zero risk — worth a quick glance once this ships, since this is the first time any of it has ever actually rendered): `/about`, `/booking`, `/designs`, `/loyalty`, `/community`, `/model-archive`, `/printing`, `/referral`, `/partnerships`, `/gift-card`, `/faq`, `/wyzmind`, `/photography`, `/home` — all have real `dark:` treatment on most of their visible text/backgrounds already written in, it just never got to run until now.

**Pages with thin-but-present coverage, worth a look once deployed, lower priority than merch:** `/plans`, `/search`, `/match`, `/nomadic-breed`, `/brands`, `/services`, `/status`, `/blog`, `/contact`, `/events`, `/3pointprogram`, `/cart`, `/web-design`, `/dying-breed-crew`, `/featured-artist`. None of these are as thin as `/merch` was, but I didn't do a full retrofit pass on all of them this round — flagging them rather than guessing at changes across a dozen more files in one go.

## Verification

- `npx tsc --noEmit` — clean across the whole tree.
- `npx eslint` — clean on every touched file, run individually (`merch/page.tsx`, `MerchSections.tsx`).
- Could not run a full `next build` on this device (SWC binary isn't installed here), so I can't force-compile and eyeball the real dark-mode output before it ships — this is the same build limitation as every prior round. The CSS directive itself is standard, documented Tailwind v4 syntax with one well-defined behavior, and the merch retrofit only adds `dark:` variants alongside existing classes — nothing existing was removed or restructured.
- Once this deploys: the honest, important thing to check first is simply that the toggle now visibly does something at all, anywhere on the site. That's the headline fix. The merch retrofit and the "lower priority" list above are the next layer down from that.

## Not done, by design

No git actions (add/commit/push), no infrastructure changes, no dependency changes. Everything here is additive or a correction to something that was already supposed to work. If you want the remaining "thin-but-present coverage" pages brought fully up to par, say the word and I'll keep going page by page — didn't want to touch a dozen more files blind in the same round as a root-cause fix this size without you seeing this first.
