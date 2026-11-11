# Handover: Red remnants audit — done (Claude → WYZMiND/opencode), 2026-11-11

Reply to `HANDOVER_RED_REMNANTS_AUDIT_2026-11-10.md`. **No git actions taken.** Everything is uncommitted in the working tree; please review, build, commit, deploy.

## Gates (run on this device)
- `npx tsc --noEmit` → 0
- `npx eslint` on all touched files → 0 errors, 0 warnings
- `npm run build` → NOT run (SWC "Bus error" on this device). Run before committing.
- vitest not re-run (no logic changes).

## Item 1 — data colors themed (consumption-side, data files untouched)
New `src/lib/theme-colors.ts` (untracked): `themeColor(c)` maps `#DF3131` → `var(--wyz-primary)`, `#C9A227` → `var(--wyz-secondary)`; `themeText(c)` uses the contrast-safe `--wyz-primary-hover` / `--wyz-secondary-text`; `themeTint(c, pct)` = `color-mix(in oklab, themeColor ... pct%, transparent)`. Any other color passes through unchanged (so no new category meanings invented).

Wired into:
- `src/app/community/page.tsx` — program tiles, post/comment/reply avatars, flairs
- `src/app/loyalty/page.tsx` — tierColor text + progress bar, tier-card top bar + heading
- `src/app/account/my-account/page.tsx` — both `zeal.tierColor` uses (`src/lib/zeal.ts` unchanged)
- `src/components/HeroDots.tsx` — red dot → `var(--wyz-primary)`
- `src/app/about/page.tsx` — sub-brand bar + tagline
- `src/app/photography/page.tsx` — benefit icon boxes
- `src/app/designs/page.tsx` — service accordion circle/“+”/GET A QUOTE

## Item 2 — splash screens: KEPT as brand (default per brief), no change.
## Item 3 — KEPT as brand, untouched
YouTube reds on /events, Instagram `#E4405F`/`#C22E4E`, per-client case-study accents (incl. kid-bode `#DF3131` in /designs case studies, Artfinix `#e94560`, web-design oranges), `#ef4444` status dot, Google "G" fills.

## Item 4 — live matrix (Ocean theme, forced via the provider's CSS vars, transitions disabled)
Scanned against production (which does NOT yet include the edits above):
- Clean: /merch, /booking
- Residual on prod, expected to be fixed by these edits: /community, /loyalty, /about bar, /photography, /designs, HeroDots.
- Needs re-check after deploy: /printing (12× `span.wz-dot` bg — likely HeroDots, fixed here), /contact (1× absolute top-0 left-0 div bg — unidentified, check after deploy).
- Not yet scanned: /blog, /faq, /wyzmind, /featured-artist, /model-archive, /services/*, /legal/*, /photography/*, /events/gallery, /designs/*, and dark mode across all six themes. Recommend a post-deploy pass on those.
- /events SVG fills ×256 are YouTube brand reds (kept).

## Item 5
`_STATE/handovers/SITE_AUDITS.md` isn't in this repo; this file is the record.

## Notes for WYZMiND
- Your uncommitted batch (metadata.ts deletions, package.json/lock) was not touched.
- Line endings preserved per-file (community/loyalty/designs/zeal are CRLF).
