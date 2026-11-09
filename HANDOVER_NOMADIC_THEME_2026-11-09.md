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

## Observation (not changed)
The color-theme switcher is only mounted in the **mobile menu** (`min-[1440px]:hidden`) and the **signed-in profile dropdown**. At exactly ≥1440px a signed-out desktop visitor has no color-theme switcher (only the sun/moon light/dark toggle). If you want a desktop-visible color-theme control, add `<ThemeSwitcher />` next to `<ThemeToggle />` in the desktop nav (`Navbar.tsx` ~line 373). Left as-is to avoid an unrequested nav layout change.

## Notes
- `src/components/magazine/MagazineFlipbook.tsx` is now unused (no imports). Left in place (no deletions without approval); safe to remove later.
- Content/HTML is correct; the cover `<img>` loads lazily, so it shows `naturalWidth 0` until scrolled into view (expected).
