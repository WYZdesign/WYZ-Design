# Gallery depth audit: photography albums + model archive, 2026-10-19 (Claude)

Torree asked for every photography-category album and every model-archive gallery to
reliably show 20-50 of the best images each. Audited the live data; neither currently
comes close, and closing the gap needs a real decision from Torree before any agent
(me or WYZMiND) builds it, because it runs straight into a storage budget limit.

## Current state (measured against the live data files, not estimated)

**Photography albums** (`src/lib/data/photography-category.ts`, 343 albums, 3,619
images total): every album is capped at exactly 12 picks if the shoot had 12+ usable
frames (242 of 343 albums), and fewer than 12 if it didn't (100 albums, as low as 4).
Nothing exceeds 16. This matches `HANDOVER_PHOTOGRAPHY_PORTFOLIO_2026-10-18.md`'s
documented curation rule: the vision-curation pass was told to pick "EXACTLY 12" per
album from a 40-frame time-spread sample, specifically to fit the Supabase free-tier
storage cap (currently 570MB of 1GB used).

**Model archive** (`src/lib/data/model-galleries.json`, 91 models): every single model
has exactly 6 images, no exceptions (546 = 91 x 6 exactly). This isn't curation at
all -- it's a flat fallback added in last night's `aa9faae`/`efe8dbf` commits ("first 6
images found" per model), not a best-of selection. The real per-model source photos
live on the Windows machine at `G:\My Drive\Pictures\models (old)\<NAME>\` and have
never been culled/curated the way the main photography pipeline was.

## Why this needs a real pipeline run, not a code tweak

Both galleries are built by a Windows-side pipeline (cull -> vision-curate -> export ->
upload to Supabase -> regenerate the site's data file) that runs against the Lightroom
catalog and G: Drive folders on `W:\WYZ_Command_Center`. This cloud session is only
connected to `V:\wyzdesign` (the repo), not that drive, so I can't run it myself -- this
is WYZMiND's (opencode's) pipeline to re-run, per last night's handover's own "do not
hand-edit, regenerate" rule for `photography-category.ts`.

Raising the target to 20-50 picks per album also isn't just "pick more from the same
batch" for most shoots: the cull step only ever time-spread-samples 40 frames per album
to begin with, and curation already picked the best 12 of those. Reaching 50 genuinely
good, non-duplicate images on a shoot that has them means culling a bigger sample (not
just 40) before vision-curation chooses from it; on the 100 shoots that only ever had
4-16 usable frames, no process can manufacture up to 20 "best" images that don't exist
-- the honest rule there is "take all usable frames," not pad to a floor.

## The actual blocker: storage budget

At the current export settings (1400px long edge, JPEG q82, ~161KB/image average),
raising every album's average from 10.55 to the bottom of the requested range already
blows the free Supabase tier:

| Target avg/album | Total images (343 albums) | Storage at current compression |
|---|---|---|
| 20 (low end of ask) | ~6,860 | ~1.08 GB |
| 25 | ~8,575 | ~1.35 GB |
| 30 | ~10,290 | ~1.62 GB |
| 40 | ~13,720 | ~2.16 GB |
| 50 (high end of ask) | ~17,150 | ~2.70 GB |

Supabase's free tier caps at 1GB total. Even the low end of the requested range (20/
album) doesn't fit without one of:

1. **Upgrade Supabase to a paid tier** (Pro is 100GB for $25/mo) -- simplest, no quality
   compromise, scales past 50/album with headroom if the catalog keeps growing.
2. **Compress harder to stay on the free tier** -- fitting a 30/album average in 1GB
   needs roughly ~102KB/image (vs. today's 161KB), which likely means dropping to
   around 1100px long edge and/or q65-70 JPEG. Visibly softer than today's images,
   especially on retina displays or full-screen lightbox view.
3. **A hybrid**: keep the current 12 "hero" picks at full 1400px/q82 quality (these are
   what the auto-scroll row shows by default) and add the rest of the 20-50 range as a
   second, more-compressed tier only loaded when a visitor opens the full-screen
   lightbox/slideshow for that album. More engineering work (two image sets per
   album, the page already has the lightbox plumbing) but keeps the primary browsing
   experience crisp.

The model-archive galleries have the same tradeoff once they're genuinely curated
instead of a flat top-6: 91 models x 20-50 images is 1,820-4,550 additional images on
top of the photography total, same per-image cost math.

## Decisions (Torree, 2026-10-19)

- **Storage**: compress harder, stay on the free Supabase tier -- no tier upgrade.
- **Scope**: both galleries, photography albums AND model archive, target ~25-30
  images per album/model (not the full 20-50 ask, to fit the free tier honestly
  rather than quietly padding toward 50 with worse compression).

## What that means in concrete numbers for WYZMiND

Target avg 27.5/album across 343 photography albums + 91 model galleries =
**~11,935 total images**. To leave real headroom in the free 1GB tier (not run it to
the edge, since the catalog will keep growing):

| Budget used | Per-image size budget |
|---|---|
| 1024MB (100% of free tier -- do not actually target this) | 87.9 KB |
| 900MB (~88% of tier) | 77.2 KB |
| **800MB (~78% of tier, recommended)** | **68.6 KB** |

Recommend targeting the 800MB number, leaving ~220MB (22%) of free-tier headroom for
future shoots/models added after this pass. That's roughly **43% of today's per-image
size** (161KB avg at 1400px q82) -- in practice this likely means something like
~1100-1150px long edge at JPEG q62-68, but the exact combination should be tuned
empirically against a handful of real sample images (content affects JPEG size more
than quality/dimension alone) rather than assumed from the math -- check real output
file sizes after a test export, not just the quality/dimension parameters, before
running the full 11,935-image batch.

- For the ~100 photography albums and most model folders that won't have 25+ usable
  frames to begin with: **take all usable frames, do not pad** with repeats or
  lower-quality rejects just to hit a floor. A 6-image album staying at 6 (or growing
  to whatever its real usable count is) is correct; forcing it to 25 would make that
  gallery worse, not better.

## Concrete instruction for WYZMiND

1. Raise `wyz_cull_all.py`'s per-album sample size (currently 40 time-spread frames)
   enough that vision-curation has a real pool to choose ~25-30 *good, non-duplicate*
   images from per album, not just all 40 forced through.
2. Re-run vision curation with the new picks target in `reviewed.json` (floor = all
   usable frames for albums that don't have 25+, ceiling = ~30) in place of today's
   flat "EXACTLY 12" rule.
3. Change `wyz_export_all.py`'s output settings to hit the ~68.6KB/image budget above
   (test actual file sizes on a sample batch first, then tune dimension/quality until
   the real average lands near that number -- don't just trust the math on paper).
4. For the model archive: run the same cull-then-curate process (not today's flat
   top-6 fallback) against each model's real source folder at
   `G:\My Drive\Pictures\models (old)\<NAME>\` (with the backup mirror at
   `G:\My Drive\Pictures\.olddrive (backup)\models\<NAME>\` as a fallback source for
   any model whose primary folder is thin), same ~25-30 target, same no-padding rule.
5. Re-export, re-upload to the `portfolio` bucket, regenerate both
   `src/lib/data/photography-category.ts` and `src/lib/data/model-galleries.json` per
   the existing pipeline in `HANDOVER_PHOTOGRAPHY_PORTFOLIO_2026-10-18.md` section 4,
   and verify total bucket usage lands near 800MB (not creeping back toward 1GB) before
   calling it done.

## Not committed to git

This is an audit + spec, not a code change. Nothing in the repo was touched for this
item (the earlier `services/consultation` whitespace fix from this session is a
separate, already-applied change, logged in the main audit handover).
