# HANDOVER: Full Visual Audit & Edit Pass for Claude — 2026-10-29

**Deploy Status:** ✅ LIVE at `https://www.wyzdesign.com` (SHA: `7bb2619`)

---

## 1. What Just Landed (Committed + Deployed)

| Area | Change |
|------|--------|
| **All gallery carousels** | Unified height: `h-[232px] sm:h-[338px] md:h-[423px]` everywhere (Home hero/models/design, Designs covers/flyers/logos, Photography rows, Events video). `object-cover` → images fill slots fully. Gray backgrounds removed. Fade-in on load (opacity-0→100 via onLoad + ref-complete check). |
| **Home hero** | "WE MAKE / WHAT WORKS" split across two lines; red on MAKE + WORKS. |
| **Designs hero** | "DESIGNING THE / FUTURE" split; red on FUTURE. |
| **Events hero** | "SIMPLY YOUR / EVENT PLANNING" split; red on SIMPLIFY + PLANNING. |
| **FAQ page** | Hero banner centered, no horizontal offset. Simplified to single centered panel with split text. |
| **SafeImage** | Cached-image bug fixed (ref + useEffect checks `img.complete && img.naturalWidth>0` on mount). New `hideOnError` prop to suppress gray fallback box in carousels. |

**Files Changed:**
- `src/components/SafeImage.tsx` — cached-image fix, hideOnError prop
- `src/components/home/HomeCarousels.tsx` — SmoothCarousel unified height, cover, fade-in
- `src/app/designs/page.tsx` — Carousel unified height, native Image + cover, removed whiteBgInDark
- `src/components/photography/PhotographyModals.tsx` — AutoScrollRow unified height, cover, fade-in
- `src/components/events/EventsVideo.tsx` — VideoCarousel aspect-video + unified height, cover, no dark bg
- `src/app/home/page.tsx` — imports from HomeCarousels
- `src/app/events/page.tsx` — hero text fix (SIMPLIFY/PLANNING red)
- `src/app/faq/page.tsx` — hero banner centered, split text
- `src/app/merch/page.tsx` — import ARCHIVE_IMAGES
- `src/components/merch/MerchSections.tsx` — export all components
- `HANDOVER_ADMIN_AUDIT_ACCESS_2026-10-27.md` — admin login instructions for you

---

## 2. Your Audit Checklist (Open Each URL, Visually Verify)

### Home — `https://www.wyzdesign.com/`
- [ ] Hero text: "WE MAKE" line break "WHAT WORKS" — red on MAKE, red on WORKS, rest white
- [ ] **Models carousel** (below hero): 3+ items, uniform height ~423px desktop, images cover fully, no gray bars
- [ ] **Design showcase carousel**: same height, cover, no gray
- [ ] **Client logos marquee** (LogoCarousel) — logos scale on hover, no gray
- [ ] Mobile: all carousels same height (232px), no horizontal overflow
- [ ] Hard refresh (Ctrl+Shift+R) — carousels render fully formed, no gray flash

### Designs — `https://www.wyzdesign.com/designs`
- [ ] Hero: "DESIGNING THE" line break "FUTURE" — red on FUTURE
- [ ] **Cover Art carousel**: height 423px desktop, images cover (portrait flyers crop top/bottom — expected), no gray letterbox
- [ ] **Flyers carousel**: same
- [ ] **Logos carousel**: same
- [ ] Accordion service cards below — images object-cover, no gray
- [ ] Mobile: all three carousels 232px, consistent

### Photography — `https://www.wyzdesign.com/photography`
- [ ] Category rows (AutoScrollRow): Outdoors, Studio, Boudoir, Portraits — each row uniform height 423px desktop / 338px sm / 232px mobile
- [ ] Images: height fills row, width auto (no gray), no letterbox
- [ ] Click → lightbox/album modal works

### Events — `https://www.wyzdesign.com/events`
- [ ] Hero: "SIMPLIFY YOUR" line break "EVENT PLANNING" — red on SIMPLIFY, red on PLANNING
- [ ] **DIY Shows video carousel**: cards same height as other carousels (423px desktop), aspect-video width (≈752px), video cover, no dark letterbox
- [ ] **Client Events video carousel**: same
- [ ] YouTube marquee section — no regression
- [ ] Mobile: video cards 232px tall, width scales

### FAQ — `https://www.wyzdesign.com/faq`
- [ ] Hero banner: centered, no left/right offset, text readable
- [ ] Split text: "FREQUENTLY ASKED" / "QUESTIONS" (red on QUESTIONS)
- [ ] Search + category filters work
- [ ] Accordion FAQs open/close
- [ ] Chat widget opens, bot responds

### Cross-Page Stress
- [ ] Hard refresh on each page — carousels render fully formed, no gray flash, no staggered pop-in
- [ ] Viewport resize: desktop → tablet → mobile — heights transition cleanly at breakpoints
- [ ] Dark mode toggle (if present) — carousels backgrounds transparent, no white flash

---

## 3. Admin Panel Access (If You Need to Edit Content/Data)

**Do NOT paste credentials anywhere.** Fetch at runtime:

```bash
# Admin email(s)
python W:\WYZ_Command_Center\wyz_vault.py --get wyzdesign_ADMIN_EMAILS

# Admin password ("Admin Key" field)
python W:\WYZ_Command_Center\wyz_vault.py --get wyzdesign_ADMIN_PASSWORD
```

**Login flow:**
1. Go to `https://www.wyzdesign.com/admin` (or local `http://localhost:3000/admin`)
2. Click "or sign in with email" divider
3. Enter email + Admin Key → Sign In
4. You're in. All tabs: Overview, Finance, Growth, Manage, System

**Sidebar collapse handle:** New dedicated tab on right edge of sidebar (rotating chevron, red glow on hover) — works in collapsed desktop rail + mobile drawer.

---

## 4. Key Files to Edit If You Find Issues

| Target | File |
|--------|------|
| Carousel heights / cover / fade-in | `src/components/home/HomeCarousels.tsx` (SmoothCarousel) |
| Designs carousels | `src/app/designs/page.tsx` (Carousel function) |
| Photography category rows | `src/components/photography/PhotographyModals.tsx` (AutoScrollRow) |
| Events video carousel | `src/components/events/EventsVideo.tsx` (VideoCarousel) |
| Home hero text | `src/app/home/page.tsx` (lines ~124-128) |
| Designs hero text | `src/app/designs/page.tsx` (lines 254, 267) |
| Events hero text | `src/app/events/page.tsx` (lines 284-286) |
| FAQ hero | `src/app/faq/page.tsx` (lines 157-184) |
| SafeImage cached fix | `src/components/SafeImage.tsx` |

---

## 5. Known Issues / Things to Watch

| Issue | Status |
|-------|--------|
| `src/app/a11y-mobile-gate.test.tsx` | **Failing** (1 test) — expects old splash markup; `HomeEntry.tsx` refactor moved splash out of `page.tsx`. Test reads `page.tsx` for `<RandomSplash onEnter={handleEnter} />` which no longer exists. Test debt — NOT a visual bug. |
| `PhotographyCategoryRows` test assertion | Same test asserts `md:h-\[381px\]` — now unified to `md:h-\[423px\]`. Update assertion if re-running tests. |
| `contrast.ts` | Logs `console.table` at module load (harmless, noisy). Imported by nothing currently. |
| `design-tokens.ts` / `contrast.ts` | Created but not consumed by any component. Decide: wire up or remove. |
| Merch catalog | Empty — no products in CMS. Admin → Manage → Products to add. |
| Analytics IDs | Four tracker IDs (GTM/Clarity/Meta/TikTok) all empty in env. Not wired. |

---

## 6. How to Run Tests / Build Locally (If You Edit)

```bash
cd V:\wyzdesign

# Type-check
npx tsc --noEmit

# Lint
npx eslint src/

# Unit tests (Vitest)
npm test

# Build (catches more than tsc)
npm run build

# Dev server (if you want to preview edits)
npm run dev
# → http://localhost:3000
```

---

## 7. Commit / Deploy Protocol (If You Make Edits)

1. Edit files
2. `npx tsc --noEmit && npx eslint src/` — must be clean
3. `npm run build` — must succeed
4. `git add <specific files you changed>` — **never `git add -A`**
5. `git commit -m "descriptive message"`
6. `git push origin master`
7. Verify deploy: `python W:\WYZ_Command_Center\wyz_deploy_check.py <FULL_SHA> --project wyzdesign` → `DEPLOY IS LIVE ✅`

---

## 8. Handoff Back to WYZMIND

When your audit/edit pass is done, drop a handover file in the repo root:

```
V:\wyzdesign\HANDOVER_CLAUDE_AUDIT_2026-10-29.md
```

Include:
- What you verified ✅
- What you fixed (files + summary)
- Any remaining issues / follow-ups
- Deploy SHA you confirmed live

---

## 9. Quick Commands Reference

```bash
# Check current git status
cd V:\wyzdesign && git status --short

# See last 5 commits
git log --oneline -5

# Get full SHA for deploy check
git rev-parse HEAD

# View any file
code <path>  # or your editor
```

---

**You have full write access to the repo.** Make edits, commit, push, verify deploy. WYZMIND will pick up from your handover.