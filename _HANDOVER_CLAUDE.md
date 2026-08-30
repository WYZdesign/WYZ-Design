# WYZ Design — Handover for Claude
**Date:** 2026-08-30
**Repo:** V:\wyzdesign | **Live:** wyzdesign.com | **Port:** 3456
**Build:** 112 pages, all clean

---

## What's Been Done (Sessions 30-33)

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
