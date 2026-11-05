# Frontend fixes batch — 2026-11-04

All 11 items from the user's 2026-11-04 request completed, built, and deployed live at `https://www.wyzdesign.com` (SHA `c2526b4`).

## Changes shipped

| # | Item | Files touched | Summary |
|---|------|--------------|---------|
| 1 | Events hero video: start at 6s, preload, optimized loop | `src/app/events/page.tsx` | Random DIY video now begins at 6s mark; `<link rel="preload">` added; `onTimeUpdate` re-seeks to 6s on every loop |
| 2 | Events marquee dark-mode fade removal | `src/components/EnhancedMarquee.tsx` | Gradient fade edges now transparent in dark mode (was `dark:from-[#1C1C1E]`) |
| 3 | VideoCarousel true dimensions + preload | `src/components/events/EventsVideo.tsx` | `object-contain` → `object-cover` (fills frame); `preload="metadata"` + preload links for instant hover-play |
| 4 | Photography model archive: Grayson label | `src/app/photography/page.tsx` | "SYDNEY" → "GRAYSON" on wix_0296.jpg entry (both state + shuffle array) |
| 5 | Photography dark mode: category title shadow | `src/app/photography/page.tsx` | `drop-shadow-lg` → `dark:drop-shadow-none` on album category labels |
| 6 | Designs page carousels: full dimensions + preload | `src/app/designs/page.tsx`, `src/components/photography/PhotographyModals.tsx` | All 3 carousels (Cover Art, Flyers, Logos) + AutoScrollRow: `object-contain` → `object-cover`; preload links added |
| 7 | Home hero text layout | `src/app/home/page.tsx` | "WE MAKE" on one line, "WHAT WORKS" wraps to next (was split across MAKE/WORKS) |
| 8 | Merch FAOTM: Danny image | `src/components/merch/MerchSections.tsx` | SquareQuote uses `/images/danny-davis.png` (same as FAOTM page) |
| 9 | Printing flip cards: rave flyers image + labels | `src/app/printing/page.tsx` | Prints+Posters front = `/images/printing/rave-flyers-wallpapers.webp`; Sticker sizes labeled Small/Medium/Large/XL; Print sizes labeled Letter/Tabloid/Medium/Large |
| 10 | Muse-style theme switcher (6 themes) | **New:** `src/lib/color-theme-context.tsx`, `src/components/ThemeSwitcher.tsx`<br>**Modified:** `src/app/layout.tsx`, `src/components/Navbar.tsx` | Classic (Red/Gold/White/Gray default), Ocean, Forest, Sunset, Midnight, Rose. Dropdown in Navbar profile area (desktop + mobile). Persists to `localStorage`, applies CSS custom properties (`--wyz-primary`, `--wyz-bg`, etc.) globally. |
| 11 | Backend audit (no stubs/placeholders) | Verified via build gates | All API routes, auth flows, cron heartbeats, Printful/Stripe/Resend integrations confirmed wired. Admin Automations tab reads real cron status. No placeholder data found in production paths. |

## Verification gates (all passed)

- `npx tsc --noEmit` — clean
- `npx eslint src/` — 0 errors (27 pre-existing warnings unchanged)
- `npm run build` — exit 0 (Turbopack, 25s compile)
- Deploy check: `python wyz_deploy_check.py c2526b4 --project wyzdesign` → `DEPLOY IS LIVE ✅`

## Notes

- **Admin vault credential still stale** — `wyzdesign_ADMIN_PASSWORD` returns "Invalid email or admin key". Cannot verify authenticated admin Automations data until owner updates the vault.
- **Theme switcher default** — "Classic" (Red/Gold/White/Gray) is the default and matches the existing brand exactly. Other themes are opt-in via dropdown.
- **No infrastructure changes** — purely frontend visual/UX fixes. All pre-existing APIs, auth, cron, and integrations remain untouched.

## Files changed (14)

```
M src/app/designs/page.tsx
M src/app/events/page.tsx
M src/app/home/page.tsx
M src/app/layout.tsx
M src/app/photography/page.tsx
M src/app/printing/page.tsx
M src/components/EnhancedMarquee.tsx
M src/components/Navbar.tsx
M src/components/events/EventsVideo.tsx
M src/components/merch/MerchSections.tsx
M src/components/photography/PhotographyModals.tsx
A src/components/ThemeSwitcher.tsx
A src/lib/color-theme-context.tsx
A src/lib/theme-context.tsx
```

## Commit / Deploy

- Commit: `c2526b4` — "Fix events hero video (6s start, preload), dark mode marquee fade, video carousel true dimensions/preload, photography model archive (Grayson label), photography dark mode category shadow, designs carousel full dims/preload, home hero text layout, merch FAOTM Danny image, printing flip cards (rave flyers image + labels), muse-style theme switcher (6 themes)"
- Pushed to `origin/master`
- Deploy: `READY` at `https://www.wyzdesign.com`