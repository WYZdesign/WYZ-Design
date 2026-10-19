# HANDOVER — Photography Portfolio + Model Archive (2026-10-18)

Owner: Torreé. Implemented by opencode against the WYZMIND Lightroom catalog.
This document is the single source of truth for what changed on the site and how to
re-generate or audit it. Read this before touching `photography-category.ts`.

---

## 1. What was delivered

| Surface | Content | Status |
|---|---|---|
| `/photography` (landing) | 13 category tiles/rows | unchanged layout |
| `/photography/[category]` | 343 auto-scroll album carousels, 3,619 images | LIVE |
| `/model-archive` | 91 models (roster) | LIVE |

Every image on `/photography/[category]` is now served from **Supabase Storage**
(public bucket `portfolio`), not from `public/`.

Deploys: `ed3d1a0` (data) → `c5c5bb6` (CSP fix) → `c73745d` (model roster).
All three verified `DEPLOY IS LIVE` via `wyz_deploy_check.py`.

---

## 2. Data flow (end to end)

```
Lightroom Classic catalog (W:\WYZ_Command_Center\lightroom-app\Lightroom_Master_TEST.lrcat)
        │  1. cull   -> _STATE\portfolio_cull\<albumId>_<slug>\{sample.json,contact_sheet.jpg}
        │  2. curate -> _STATE\portfolio_cull\reviewed.json  (category, label, 12 picks)
        │  3. export -> _STATE\portfolio_export\<Category>\<albumId>_<slug>\NN.jpg
        │  4. upload -> Supabase Storage bucket "portfolio"
        │  5. generate -> src/lib/data/photography-category.ts  (this repo)
        ▼
Next.js build -> Vercel
```

### 2.1 Cull (all 394 albums, done)

`W:\WYZ_Command_Center\_ENGINE\wyz_cull_all.py`

- Time-spreads a 40-image sample per album (even spacing across the shoot, which is
  what guarantees background/outfit/pose variety).
- Scores each sample: Laplacian sharpness, clipped-pixel ratio, face count,
  perceptual hash (near-duplicate removal).
- Handles **CR3/CR2 via rawpy** (embedded JPEG preview first, half-size postprocess
  as fallback). Plain PIL cannot decode CR3, which is why the first pass produced
  12 empty albums.
- Writes one contact sheet per album (numbered tiles, `s` = sharpness, `f` = faces).

Re-run: `python _ENGINE\wyz_cull_all.py` (skips albums that already have
`sample.json`; delete a folder's `sample.json` to redo it).

### 2.2 Curate (343 albums, done)

Vision curation by agents reading each contact sheet. Results are merged into
`_STATE\portfolio_cull\reviewed.json`:

```json
"18660339": {
  "name": "April 8, 2024",
  "category": "Studio",
  "label": "Neon Studio, April 2024",
  "picks": [0,3,8,9,7,14,4,12,10,24,22,19,21,27,26,29],
  "note": "one line describing the shoot"
}
```

Rules used: quality first (sharp, exposed, eyes open, good expression), then
maximum variety of pose/crop/background/outfit/mood, no near-duplicates,
**EXACTLY 12 picks** (all usable frames if fewer than 12 exist).

Standardisation + quality guard: `_ENGINE\wyz_standardize_picks.py`
(trims to 12 by sharpness, tops up small albums, records `quality` stats;
alerts if an album's pick average falls below 15% of that album's max sharpness).

### 2.3 Export

`_ENGINE\wyz_export_all.py`

- 1400 px long edge, JPEG q82, progressive, EXIF orientation applied.
- Output: `_STATE\portfolio_export\<Category>\<albumId>_<slug>\NN.jpg`
  plus `manifest.json` per album and a top-level `index.json`.
- Result: **343 albums, 3,619 images, 543.6 MB, 0 failures, 14 min**.

### 2.4 Upload

`_ENGINE\wyz_portfolio_upload.py`

- Bucket `portfolio` (public), path layout `<Category>/<albumId>_<slug>/NN.jpg`.
- 8 parallel workers, `x-upsert: true`, `Cache-Control: public, max-age=31536000`.
- Reads creds from the DPAPI vault: `wyzdesign_NEXT_PUBLIC_SUPABASE_URL`
  (project `ccznkpcmpadgftqhwvdx`) and `wyzdesign_SUPABASE_SERVICE_ROLE_KEY`.
  Never hardcode these.
- Writes `_STATE\portfolio_export\supabase_manifest.json` with public URLs.
- Result: **3,619 files, 570 MB, 0 errors, 2.6 min**.

Public URL shape:
`https://ccznkpcmpadgftqhwvdx.supabase.co/storage/v1/object/public/portfolio/<Category>/<album>/NN.jpg`

### 2.5 Site data generation

`_ENGINE\wyz_generate_category_data.py` → `src/lib/data/photography-category.ts`

- Emits `CATEGORY_META` (13 categories + descriptions) and `CATEGORY_ALBUMS`
  (`Record<category, Array<{ name, images[] }>>`).
- **Album labels are the shoot dates**, normalized to `Month D, YYYY` (the catalog
  stores them inconsistently: "Aug 7, 2021", "Dec 11 2021", "December 18, 2022").
  Duplicate suffixes are preserved as `(2)`. Non-date names pass through.
- **Same-date albums are merged per category.** The catalog often holds one shoot
  twice ("Dec 11 2021" + "Dec 11, 2021"); they render as one carousel with the
  union of images (deduped), capped at `MAX_PER_ALBUM = 20`.
- Result: 343 source albums → **286 carousels**, 3,506 images shown.
- Album order inside a category: newest first (descending Lightroom collection id).
- File is ~500 KB, auto-generated. **Do not hand-edit** — regenerate.

The existing `[category]/page.tsx` consumes this unchanged: one `AutoScrollRow`
per album, labelled, with the full-screen slideshow and NSFW gating already wired.

### 2.6 Model archive

`src/app/model-archive/page.tsx` — `MODELS = [{ name, img }]` pointing at
`/images/models/<NAME>.<ext>` in `public/`.

Audit of that roster (91 entries, all files present; only
`FARREN_BODYPAINT.jpg` intentionally unlisted, it is a second shot of FARREN).
Per-model source folders exist on G: Drive at
`G:\My Drive\Pictures\models (old)\<NAME>\` (and a mirror at
`G:\My Drive\Pictures\.olddrive (backup)\models\<NAME>\`) — that is where
multi-image galleries should be sourced from if that is wired next.

---

## 3. The CSP change (critical, easy to break)

`next.config.ts` sets a strict Content-Security-Policy. `img-src` did **not**
include Supabase, so every portfolio image was blocked by the browser and
`SafeImage` fell back to its alt-text tile (the page looked like blank white
rows). `c5c5bb6` first added `https://*.supabase.co` to `img-src` in **both** the
enforced and the Report-Only policy. That wildcard was then narrowed in
`0b4df7f` to the exact project origin
`https://ccznkpcmpadgftqhwvdx.supabase.co`, which is the only host any of the
3,619 portfolio URLs use (verified live: 1,728 image elements on
`/photography/studio`, 0 broken). `images.remotePatterns` now also lists that
exact host with the `/storage/v1/object/public/portfolio/**` path.

If images ever go blank again:
1. Check the response header `Content-Security-Policy` on the category page.
2. Confirm `img-src` lists `https://ccznkpcmpadgftqhwvdx.supabase.co`.
3. Check `SafeImage` did not flip to `broken` (it renders a `<div>` with the alt
   text instead of an `<img>`).

`SafeImage` leaves remote URLs untouched (no `/_next/image` proxying), so
`images.remotePatterns` is NOT required for Supabase.

---

## 4. Re-generating after new Lightroom albums

```powershell
# 1. cull any new albums (idempotent)
python W:\WYZ_Command_Center\_ENGINE\wyz_cull_all.py

# 2. vision-curate the new contact sheets -> append to reviewed.json
#    (same rules: quality first, then variety, exactly 12, clean label)

# 3. export
python W:\WYZ_Command_Center\_ENGINE\wyz_export_all.py

# 4. upload (adds/overwrites in Supabase)
python W:\WYZ_Command_Center\_ENGINE\wyz_portfolio_upload.py

# 5. regenerate the data file
python W:\WYZ_Command_Center\_ENGINE\wyz_generate_category_data.py

# 6. build, commit ONLY the generated file, push, verify the deploy
npm run build
git add src/lib/data/photography-category.ts
git commit -m "feat(photography): refresh portfolio albums"
git push origin master
python W:\WYZ_Command_Center\wyz_deploy_check.py <full-sha> --project wyzdesign
```

---

## 5. Verification checklist

- `npm run build` compiles (route list includes `/photography` and
  `/photography/[category]`).
- `wyz_deploy_check.py <sha> --project wyzdesign` → `DEPLOY IS LIVE ✅`
  (local build passing is NOT proof; Vercel uses its own env).
- Visual: `python W:\WYZ_Command_Center\_ENGINE\wyz_web_shoot.py
  "https://www.wyzdesign.com/photography/studio" --dark --width 1600`, then read
  the PNG. Expect: marquee title, "576 images across 54 albums", album labels,
  and real photographs in the rows.
- DOM check (fast): open the page and evaluate
  `[...document.images].filter(i=>i.naturalWidth>0).length` — should be > 0 and
  growing as you scroll.
- Supabase: `HEAD` any URL from `supabase_manifest.json` → `200 image/jpeg`.

---

## 6. Known issues / limits

1. **Free tier**: Supabase Storage is **570 MB of 1 GB** after this import.
   Adding many more albums will hit the cap; either compress harder (1200 px
   q80) or move to a paid tier / R2.
2. **Small albums**: 22 albums have only 4-6 usable distinct frames; they render
   shorter rows. That is data reality, not a bug.
3. **`/photography` landing page** shows a tall blank band in full-page
   screenshots. It is a scroll-reveal animation that does not trigger in a static
   capture; confirm by scrolling in a real browser before treating it as a bug.
4. **`public/images/photography*`** still holds the old hand-picked images
   (243 files). They are no longer referenced by the category pages but are safe
   to keep; remove only after a visual pass on every category.
5. **Album labels are date-derived**: 343 albums are named by shoot date in
   Lightroom, so the display labels were written by vision to be human-readable.
   They are stored in `reviewed.json`; edit there and regenerate, do not hand-edit
   the `.ts`.

---

## 7. Open items / next steps

- **Per-model galleries on `/model-archive`**: wire click/hover to a multi-image
  gallery sourced from `G:\My Drive\Pictures\models (old)\<NAME>\`. Selection
  should follow the same cull rules (time-spread, dedupe, best-of).
- **Lightroom CC album restore**: the 437 album sync flags were restored in the
  Classic catalog (`AgLibraryCollectionTrackedAssets`) but were parked again to
  keep the photo re-push ordered newest-first. Re-enable after the photo passes to
  recreate the cloud albums.
- **iCloud backup**: blocked by a crashed iCloud cloud-file provider; needs a
  Windows reboot to rehydrate the placeholders before the backup can complete.

---

## 8. Do not

- Do not hand-edit `src/lib/data/photography-category.ts` (generated).
- Do not commit the `.bak_*` copies of the data file (they live in
  `W:\WYZ_Command_Center\_ARCHIVE`).
- Do not remove `https://ccznkpcmpadgftqhwvdx.supabase.co` from `img-src` (the
  admin/API origins are still on `connect-src`/`media-src`; only the image policy
  was narrowed to this exact host, which is the sole origin the portfolio uses).
- Do not delete the `portfolio` bucket without regenerating `reviewed.json`
  picks and re-running export + upload (the picks are the only record of the
  curation).
