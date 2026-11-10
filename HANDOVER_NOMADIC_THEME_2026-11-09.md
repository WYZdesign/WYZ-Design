# Handover: Nomadic Breed polish + full theme coverage (wyzdesign)

**Date:** 2026-11-09
**Repo:** `V:\wyzdesign` (branch `master`)
**Commit:** `e53e18a` (`e53e18a004ba33bf5c5f2636f7d17c31c599dd69`)
**Deploy:** READY, `DEPLOY IS LIVE ✅` (project `wyzdesign`, production `https://www.wyzdesign.com`)
**Verified:** against production `/about` and `/nomadic-breed/issue-001` with Playwright (DOM + computed styles).

## What changed (5 files)

### 1. Nomadic Breed banner (`src/app/nomadic-breed/page.tsx`)
- Removed the cover-image background from the banner. Banner is now plain white (dark: `#1C1C1E`), no gradient overlay, no cropped cover. The cover was redundant there.
- Banner content is fully centered (flex column, `items-center justify-center text-center`), vertically and horizontally.
- Tags are one compact line, centered, next to each other (`px-2 py-0.5 text-[9px]/[10px]`, `flex-nowrap`). Read "70% shorter" as much smaller pills.
- `Read Issue 001` button is now the themed primary (`bg-[#DF3131]` → `var(--wyz-primary)`), `hover:bg-[#B82020]` → hover var.

### 2. Cover preview (same file)
- Replaced the `MagazineFlipbook` (which rendered a half-empty white spread because there is only 1 page) with a clean full-dimension cover: `<Image width=1200 height=1800 object-contain>` inside `max-w-[420px]`. Shows the real 2:3 cover, not cropped, no blank rectangle.
- Removed the redundant "Flip through the preview above… Read the full 16-page issue" caption (the banner already has the Read button).
- Removed a duplicate `application/ld+json` script (was rendered twice).

### 3. Issues Archive (same file)
- Now 3 cards: Issue 001 (real, cover + details) + 2 empty placeholders (`Coming Soon`, Issue 002 / Issue 003) in a `sm:grid-cols-2 lg:grid-cols-3` grid. Restored a `max-w-5xl` width for the 3-card row.

### 4. LeadMagnet placement (`src/app/about/page.tsx`)
- Moved `<LeadMagnet />` (Free Brand Audit Guide strip) so it now sits directly above the Dying Breed Crew "Not Just a Brand. A Standard." section: order is now `NomadicBreedPage` → `LeadMagnet` → `DyingBreedCrewPage`.

### 5. issue-001 page (`src/app/nomadic-breed/issue-001/page.tsx`)
- Replaced the black "Magazine Flipbook Preview" placeholder with the real full cover (`object-contain`).
- Compact one-line tags (same treatment as the landing banner).
- Removed the duplicate inline JSON-LD (kept the single `ISSUE_001_JSON_LD_STRING` render).

### 6. Full theme coverage (`src/app/globals.css` + `src/lib/color-theme-context.tsx`)
The 2026-11-05 override only recolored solid `bg-`/`text-`/`border-` uses of the primary red. Everything else stayed red/gold when a theme was picked. Now:
- **Extended the class remap** to: opacity tints (`bg-/text-/border-/from-/to-... /5..90`), gradient stops (`from-/via-/to-`), `ring-`, `shadow-`, `accent-`, `border-t/b/l/r-`, plus all existing `hover:` / `focus:` / `focus-visible:` / `group-hover:` / `dark:` variants, using `color-mix(in oklab, var(--wyz-*) N%, transparent)` for tints. Generated over every literal usage found in `src` (103 rules).
- **Color mapping:** `#DF3131` → `--wyz-primary`; `#B82020` and the small-text `#C00000` → `--wyz-primary-hover` (the darker, contrast-safe variant); `#C9A227` → `--wyz-secondary`; `#8C6A1D` / `#E7C873` → `--wyz-secondary-text`.
- **New theme vars:** the provider now also sets `--wyz-secondary` and `--wyz-secondary-text` per theme/mode; each of the 6 themes gained `secondary`/`secondaryText` values (Classic keeps gold; others use readable tints of their swatch). Added `:root` / `.dark` fallbacks so first paint (pre-hydration) is correct.
- **Nav/footer brand bar:** `.wyz-red-gradient` stays the exact original red for the default theme; the 5 non-default themes derive a matching gradient from `--wyz-primary` (via `[data-color-theme="…"] .wyz-red-gradient`).

Verified live by setting the same CSS vars the provider sets: primary, tertiary/gold, opacity tints, and the nav gradient all recolor. End-to-end menu switch to Ocean sets `data-color-theme="ocean"`, `--wyz-primary:#006D77`, `--wyz-secondary:#83C5BE`, and the "Issue 001" accent becomes teal.

## Gates
- `npx tsc --noEmit` → 0
- `npx eslint` (changed files) → 0 errors (4 pre-existing warnings in `article/[slug]/page.tsx`)
- `npm run build` → 0 (exit 0)
- `npx vitest run` → 122/122 passed
- `wyz_deploy_check.py e53e18a… --project wyzdesign` → DEPLOY IS LIVE ✅

## Follow-up: desktop theme switcher + SSR fix (commit `2bdc9fa`, live)
- **Added the color-theme switcher to the desktop nav.** It was only in the mobile menu and the signed-in profile dropdown, so a signed-out desktop visitor at ≥1440px had no way to pick a color theme. `<ThemeSwitcher compact />` is now rendered next to the light/dark toggle in the `hidden min-[1440px]:flex` nav block.
- **`compact` prop** on `ThemeSwitcher`: icon-only pill (swatch only, no label) so it fits without pushing the light/dark toggle off-screen. Verified at 1440px: switcher 40px wide at x1318-1358, toggle x1366-1413 (fully inside the 1440 viewport), page has no horizontal overflow. Full switcher (with label) still used in the mobile menu and profile dropdown.
- **Fixed a latent SSR bug** the desktop placement exposed: `ColorThemeProvider` returned bare children until `mounted`, so any SSR-rendered `useColorTheme()` consumer threw `useColorTheme must be used within a ColorThemeProvider` (the mobile menu never hit it because it is only mounted on open). The provider now always supplies the context (default values pre-mount); the color-apply effect still waits for mount. This makes `ThemeSwitcher` safe to render anywhere.
- Verified end-to-end on the built app at 1440px: open switcher → pick Rose → `data-color-theme=rose`, `--wyz-primary=#D63384`, hero/accent recolor, dark toggle stays visible. Gates: tsc 0, eslint 0 errors, build 0, vitest 122/122, deploy `DEPLOY IS LIVE ✅`.

## Notes
- `src/components/magazine/MagazineFlipbook.tsx` is now unused (no imports). Left in place (no deletions without approval); safe to remove later.
- Content/HTML is correct; the cover `<img>` loads lazily, so it shows `naturalWidth 0` until scrolled into view (expected).
