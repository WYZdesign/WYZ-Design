# Totality audit, 2026-10-21 (Claude)

Torree asked: "double check all current work, use vision to audit, and clean up and
fix whatever is needed in totality." This covers everything shipped since the last
handover (`HANDOVER_AUDIT_2026-10-18.md` / `HANDOVER_GALLERY_DEPTH_AUDIT_2026-10-19.md`)
through today: the new designs/events/model-archive gallery surfaces, the storage-budget
re-curation work, and the three visual bugs flagged in an earlier (partially-failed)
parallel audit pass that were never confirmed or fixed.

As always under the standing protocol: nothing here is committed. All three fixes
below are plain file edits on disk at `V:\wyzdesign`, verified with `tsc --noEmit` and
`eslint` (both clean) and a clean `git diff --ignore-all-space` (the raw diff shows
hundreds of lines per file from CRLF/LF noise -- the actual changes are 1-3 lines each,
confirmed below). WYZMiND should review and commit when ready.

## 1. Code health check (before touching anything)

- `npx tsc --noEmit` -- clean, no errors.
- `npx eslint src --max-warnings 999` -- clean, no warnings.
- `git status --short` (before my edits) -- clean except one pre-existing, **not mine**,
  uncommitted change already sitting in the working tree: `src/app/sitemap.ts` adds
  sitemap entries for the new `/designs/gallery/*`, `/events/gallery/*`, and
  `/model-archive/gallery/*` routes (reads `EVENT_GALLERIES`, `DESIGN_CATEGORIES`,
  `MODEL_GALLERIES` and emits URLs for each). I read it and it looks correct and
  complete -- just flagging that it's sitting uncommitted so WYZMiND doesn't lose track
  of it. I did not touch it.

## 2. Live visual audit -- new gallery surfaces

All checked with real browser navigation (sequential, not parallel, after last
session's lesson that concurrent browser agents rate-limit each other), waiting
3-5s past first paint before judging anything blank, since several sections use
scroll-reveal animations that don't resolve instantly.

**`/photography/Events`** -- confirmed the date-merged album labels ("November 5,
2023" etc.) are correct, not a regression. Visual spot-check of the merged album
showed consistent same-event imagery across every merged source folder.

**`/designs/gallery` + `/designs/gallery/logos`** -- clean at desktop and mobile.
Lightbox opens correctly, no broken images, no layout issues.

**`/events/gallery` + `/events/gallery/cmb-18`** -- clean at desktop. Grid of 24
photos renders correctly; lightbox opens to the right photo with correct caption
("CMB '18 - 01"), counter ("Event - 1 / 24"), and working prev/next arrows. Minor
nit, not fixed (cosmetic, low priority): every photo tile is tagged with a generic
"Event" badge that's identical on all 24 tiles and adds no information -- consider
dropping it or making it per-photo if there's ever a reason to differentiate tiles.

**`/model-archive/gallery`** (new index, 91 models) -- clean at desktop and mobile.
Each model card shows its real photo count (e.g. Adrienne 22, Aech Dot 28, Aja 8,
Alexandria 28) confirming the curated per-model galleries from the storage-budget
work are live, not a flat fallback anymore.

**`/model-archive/gallery/adrienne`** (sample individual model gallery) -- 22 images,
genuinely varied poses/outfits/backgrounds, no visible duplicates. Lightbox tested:
opens to the right image, correct caption/counter, nav arrows work. Clean at mobile
too (single-column grid, no overflow).

**`/model-archive`** (roster/index page, updated) -- intentionally light-themed
(white background, dark text) consistently at both desktop and mobile -- an early
screenshot looked like a dark/light theme mismatch bug but that was just the
scroll-reveal animation not yet resolved; a second screenshot a few seconds later
confirmed it's consistent, legible, and matches on both viewports. Scrolled through
the full 91-model roster grid, all images load, no broken tiles.

**Conclusion**: the new gallery infrastructure (designs, events, model-archive index
+ individual galleries) is solid. No bugs found on any of these surfaces.

## 3. Three bugs fixed (confirmed still present, then fixed)

These were flagged in an earlier parallel audit pass but never confirmed or acted on
because most of that pass failed to browser-contention. I re-verified all three live
on the production site today, found all three still present, and fixed all three
directly in the source (not yet deployed -- WYZMiND still needs to commit/push).

### 3a. `/printing` -- "Prints + Posters" card had no photo background

The `FlipCardInline` component shows a photo background with the title overlaid when
given an `img` prop, or falls back to a plain white card with "Hover or tap to see
pricing" when `img` is omitted. The Vinyl Stickers and Buttons cards both had `img`;
Prints + Posters didn't, so it rendered as a blank white card standing out awkwardly
next to its two photo-backed siblings. Confirmed live via screenshot before fixing.

**Fix**: added `img="/images/printing/print_1.jpg"` to that card
(`src/app/printing/page.tsx` line 341). `print_1.jpg` and `print_2.jpg` were sitting
in `public/images/printing/` completely unused by any page -- confirmed via a
repo-wide grep -- so this doesn't reuse an image from elsewhere on the site.

### 3b. `/services` -- pricing-tier cards (Starter/Business/Pro/Ultimate) uneven heights

Confirmed live: the four subscription-tier cards render at visibly different heights,
Starter Pack and Business Boost shorter than Pro Plus and Ultimate Suite. Root cause:
`src/app/plans/page.tsx`'s `PlanCard` component computed each card's `minHeight` from
`500 + FEATURES[p.name].length * 45` -- i.e. the card's own feature-list length, so a
plan with more bullet points (Ultimate Suite, 8 features) got a taller card than one
with fewer (Starter Pack, 5 features).

**Fix**: added a `MAX_FEATURE_COUNT` constant (the max feature-list length across all
four plans) right after the `FEATURES` map, and changed the card's `minHeight` calc to
use that shared constant instead of each card's own length. All four cards now get the
same height (sized to fit the longest plan's feature list), so the row reads as even
regardless of which plan has more bullets.

### 3c. `/services` -- "Product Photography" and "Behind the Scenes" reused the same photo

Confirmed live and in source: both service cards pointed at
`/images/services/Event Photography.jpg` -- the exact same file also used by the
separate "Event Photography" card three rows up. All three cards showed the identical
concert-crowd photo.

**Fix**: gave each card its own distinct, thematically appropriate image that was
otherwise sitting unused in the repo (checked via grep that neither is referenced
anywhere else in `src/`):
- Product Photography -> `/images/photography-categories/Products.jpg` (a clean
  product shot of a branded hat on white, exactly matching the card's own description
  "clean backgrounds and multiple angles").
- Behind the Scenes -> `/images/photography-categories/URBEX.jpg` (a candid shot of a
  photographer holding a camera in a doorway -- visually reads as "creative process /
  behind the scenes", matching that card's description).

All three fixes verified with `tsc --noEmit` + `eslint` (clean) and a line-level
`git diff --ignore-all-space` showing exactly the intended 1-3 line change per file,
nothing else touched.

## 4. Not yet re-deployed

None of today's three fixes are live yet -- they're on disk at `V:\wyzdesign` only.
WYZMiND needs to review, commit, push, and verify the deploy (per the existing
`wyz_deploy_check.py <sha> --project wyzdesign` pattern) before they'll show on
wyzdesign.com.

## 5. Other ideas (per Torree's standing "feel free to suggest" invitation)

A few lower-priority things noticed along the way, not acted on, just flagged:

- The `/events/gallery/[slug]` detail pages tag every photo tile with an identical
  "Event" badge (see note under section 2) -- cosmetic, could be dropped or made
  per-photo.
- `public/images/photography*` (the ~243 old hand-picked images, per the Oct-18
  handover's known-issues list) are still sitting in the repo unreferenced by any
  category page. Worth a cleanup pass once there's been a full visual confirmation
  across every category, to shrink repo size.
- Given the free-tier Supabase storage math from the Oct-19 handover (targeting
  ~800MB of the 1GB cap with headroom for growth), it'd be worth a quick
  `wyz_portfolio_upload.py`-side check of actual current bucket usage now that the
  re-curation/re-export has landed, just to confirm the real number matches the
  ~800MB target rather than assuming the math held in practice.
