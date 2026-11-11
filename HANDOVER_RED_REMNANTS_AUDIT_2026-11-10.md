# Task for Claude: finish the WYZ Design red-theme audit (opencode applied the bulk in `43c8ff1`)

**Date:** 2026-11-10 (updated)
**Repo:** `V:\wyzdesign` (branch `master`), production `https://www.wyzdesign.com`
**Deployed by opencode:** `43c8ff1` "Theme every remaining red on the site (light + dark)" — LIVE after the deploy check completes.

Owner's standing requirement: **any color that would otherwise be red becomes the active theme color, on every page, in light AND dark mode.** The header/footer use a red *video* (`wyz-nav-bg-new.mp4`) that opencode now hue-rotates per theme.

## What opencode already fixed (do not redo)
- `globals.css` raw reds: `::selection`, `.btn-primary`, `.filter-btn-active`, focus/outline, `#FF5252` dark-mode block, `#991111`/`#8B0000` gradient stops, all `rgba(223,49,49,…)` glows/keyframes → `rgba(var(--wyz-primary-rgb),…)`.
- `design-tokens.css` brand tokens now resolve to theme vars (`--color-wyz-red`→`--wyz-primary`, `--color-wyz-red-dark`/`--color-wyz-text-red`→`--wyz-primary-hover`, golds→`--wyz-secondary(-text)`). This fixes the site-wide "small red text" (`#C00000`).
- Added `--wyz-primary-rgb` (provider + `:root`/`.dark` fallbacks); themed `rgba(223,49,49)` in `about`, `admin/page`, `designs`, `HeroDots`, `ImageHoverReveal`, `MagneticElement`, `CustomCursor`.
- Routed hover reds through the remap: `#c12a2a`/`#c02a2a`/`#C41C1C`→`#B82020`, `bg-red-700`→`bg-[#B82020]`, `text-[#FF5252]`→`text-[#DF3131]`, `bg-[#FF6B6B]/10`→`bg-[#DF3131]/10`, `dark:text-[#FF5A5A]` removed.
- Themed inline gradients (blog hero, scroll-progress bar) and the `/wyzmind` neural-net canvas (reads `--wyz-primary-rgb` live).
- Hue-rotate the nav/footer background video per theme (`[data-color-theme=…] video[src*="wyz-nav-bg-new"]`).
- Deleted dead `src/app/merch/[id]/metadata.ts` and `src/components/magazine/MagazineFlipbook.tsx`.

## What is LEFT for you (the "excessive work" — audit visually + fix)
1. **Community / loyalty category data colors.** `src/lib/data/community.ts`, `src/lib/zeal.ts`, `src/app/community/page.tsx`, `src/app/loyalty/page.tsx` use literal `#DF3131` / `#C9A227` as *data* colors (category flair, Zeal tiers) rendered inline (`style={{ color/backgroundColor }}`), so they do NOT follow the theme. Decide: map them to `var(--wyz-primary)`/`var(--wyz-secondary)` (recommended for the red ones) or leave as semantic brand colors. Do NOT invent new category meanings.
2. **Splash screens** (`src/components/splash/*`, `SplashVariants.tsx`): canvas particles use the brand constants `R/G/RD` (`#DF3131`/`#C9A227`/`#B82020`) from `SplashBrand.tsx`. These are a deliberate branded intro. Decide with Torreé whether to theme them or keep brand; default to **keep brand** and document, unless the owner says otherwise.
3. **Brand colors to KEEP (do not theme):** YouTube red on `/events` (`#FF0000`/`#CC0000`/`#FF1A1A`/`#FF4D4D`), Instagram `#E4405F`/`#C22E4E`, per-client case-study accents (`#e94560` Artfinix, `#FF6B35`/`#FF4500` in web-design), the `#ef4444` "unhealthy" status dot on `/status`, and the Google "G" SVG fills in `AdminShared.tsx`.
4. **Full visual matrix:** for every route in `src/app/**/page.tsx`, for each of the 6 themes × light/dark, screenshot and flag any element that computes red while the active primary is not red. Use this in-page scan to catch what eyes miss:
   ```js
   // page.evaluate: flag elements whose color/bg/border is red-ish while
   // getComputedStyle(document.documentElement).getPropertyValue('--wyz-primary')
   // is not a red
   ```
5. Update `_STATE/handovers/SITE_AUDITS.md` and reply with `YYYYMMDD-claude-to-opencode-wyzdesign-red-remnants-done.md`.

## Gates (all already green at `43c8ff1`, keep them green)
`npx tsc --noEmit` 0 · `npx eslint src/` 0 errors (14 pre-existing warnings) · `npm run build` 0 · `npx vitest run` 122/122 · deploy check → `DEPLOY IS LIVE ✅`.

## Notes
- The color-theme switcher is `ThemeSwitcher` (compact in the ≥1440px nav, full in the mobile menu + profile dropdown). Drive themes for screenshots by setting `data-color-theme` + `--wyz-primary(-hover/secondary/secondary-text/rgb)` on `<html>`, or click the switcher.
- Keep brand identities. Ask Torreé before changing any brand color (YouTube/Instagram/client accents/splash).
