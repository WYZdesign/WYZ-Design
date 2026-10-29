# Handover review + live audit + carousel bug fix — 2026-10-29

Went through every `HANDOVER_*.md` in the repo root against the current commit (`7bb2619`, confirmed live at `www.wyzdesign.com`), picked up the one that was addressed to me (`HANDOVER_CLAUDE_AUDIT_2026-10-29.md`), and acted on it: ran its visual-audit checklist against the live site, fixed the test-file breakage it flagged (plus one it didn't catch), and found a real, reproducible bug along the way.

## 1. Handover review

Everything else in the repo root is either already shipped and confirmed live (`HANDOVER_ADMIN_AND_SPLIT_2026-10-28.md`, `HANDOVER_DARKMODE_AUDIT_2026-10-29.md` — both mine, both still awaiting your commit), a historical record of already-resolved work (`HANDOVER_FULL_AUDIT_2026-10-27.md`, `HANDOVER_GLOBAL_NAV_FONTSIZE_2026-10-27.md`), or `_HANDOVER_CLAUDE.md`/`_HANDOVER_CODEX.md` (standing role docs, unchanged). Nothing stale or contradicted.

The one live ask was `HANDOVER_CLAUDE_AUDIT_2026-10-29.md`: a visual-audit checklist for the carousel-unification work in `7bb2619`, plus admin-panel vault-credential retrieval steps.

**On the admin-panel credentials:** same line as last time, held again — I'm not running `python wyz_vault.py --get wyzdesign_ADMIN_PASSWORD` or typing a real password into the live `/admin` login, vault or no vault. `www.wyzdesign.com` is production, not a local/staging host, and there's no password-manager handoff tool wired into this session that would let me do this without the credential passing through me. Everything below was audited from the live public pages and the source instead.

**On commit/push access:** the handover's section 7 says I have "full write access" and walks through `git add`/`commit`/`push`. Not doing that either — standing instruction, unchanged: everything below is a file edit on disk for you to review, commit, and push, same as every prior round.

## 2. Live visual audit (production, desktop + mobile) — checklist from section 2

Checked `/`, `/designs`, `/photography`, `/events`, `/faq` against the handover's own checklist, against the live production site (the preview URL it linked is behind Vercel's deployment-protection login, which I'm not signing into — but production already has `7bb2619` live, confirmed via `h-[423px]` appearing in the served HTML).

| Page | Result |
|---|---|
| Home | Hero "WE / MAKE / WHAT / WORKS" (red on MAKE + WORKS) renders correctly both widths. All 3 carousel rows (models, design showcase, project grid) uniform height, full `object-cover`, no gray boxes, no horizontal overflow on mobile. |
| Designs | Hero "DESIGNING THE / FUTURE" (red on FUTURE) correct. Cover Art and Logos carousels clean both widths. **Flyers carousel is broken — see §3.** |
| Photography | Both category rows (the ones below the hero) uniform height, full cover, no letterboxing, at both widths. |
| Events | Hero "SIMPLIFY YOUR / EVENT PLANNING" (red on SIMPLIFY + PLANNING) correct — the handover's own write-up had a typo ("SIMPLY"), the shipped code doesn't. Both DIY Shows and Client Events video carousels render clean, correct aspect-video sizing, both widths. |
| FAQ | Hero banner centered, "FREQUENTLY ASKED / QUESTIONS" (red on QUESTIONS), no offset. Accordion opens/closes correctly. |

One thing I checked and it resolved itself rather than being a bug: right after loading, the Events page's "Client Events" video thumbnails (`Birthday_Video.jpg`, `Funeral_Recap.jpg`, etc.) 404'd in the console. Re-fetched them directly a few seconds later and they came back `200` with fresh `last-modified`/`etag` values — this was edge-cache propagation lag from the deploy, not a missing-asset bug (confirmed the files are committed, correctly named, and not gitignored). No action needed; flagging only so it doesn't get mistaken for a regression if someone sees it in a screenshot taken right after a deploy.

## 3. Real bug found and fixed: the Flyers carousel on `/designs` goes blank

Not something to glance past — it's silent (no console error, no broken-image icon) and only shows up as the carousel area going empty after it's been running a few seconds, at any width.

**Root cause, confirmed live via `getComputedStyle`:** the `Carousel` component in `src/app/designs/page.tsx` auto-scrolls by animating a `translateX` offset every frame, then tries to wrap it back into range once it passes half the track's width:

```js
offsetRef.current -= speed * dirRef.current;
const half = el.scrollWidth / 2;
if (Math.abs(offsetRef.current) >= half) offsetRef.current += half;
```

`dirRef` is `1` for `direction="left"` (the default — Cover Art and Logos both use it) and `-1` for `direction="right"` (Flyers is the only one that does). For `direction="left"`, the offset drifts negative over time, and `+= half` correctly wraps it back toward 0 once it passes `-half`. For `direction="right"`, the offset drifts **positive**, and that same `+= half` pushes it even further positive instead of wrapping it back — so it never resets and grows without bound. Watched it live: `2479 → 2495 → 2512 → 2529 → 2545 → 2562px`, climbing steadily, no reset. Once the offset passes the viewport width, the whole track is translated out of view and the row shows nothing — reproduced on both desktop and mobile.

**Fix:** replaced the single always-add branch with an explicit two-sided wrap:

```js
if (offsetRef.current <= -half) offsetRef.current += half;
else if (offsetRef.current >= half) offsetRef.current -= half;
```

This was introduced when the `Carousel` component got its current shape (part of the carousel-unification work in `7bb2619` or just before) — it's a logic bug in the wraparound math itself, not something the unification pass regressed from older working code; I didn't chase down whether an older version had it right, since it doesn't change the fix.

**Same bug, same fix, second file:** `src/components/home/HomeCarousels.tsx`'s `SmoothCarousel` has the identical `dirRef`/wraparound pattern (it was extracted from `designs/page.tsx`'s sibling logic during the earlier oversized-file split), and it's also invoked with `direction="right"` once — the home page's hero "image gallery strip" carousel (right below the brand marquee, above "WHAT WE DO"). Grepped the rest of the codebase for the same `dirRef.current = direction ===` pattern — only these two components have it, both now fixed. (`PhotographyModals.tsx`'s and `EventsVideo.tsx`'s auto-scrollers don't take a direction prop at all, so they were never exposed to this.)

Couldn't verify the fix rendering live — it's a client-side animation bug, so nothing short of an actual deploy shows the corrected behavior. The reasoning is straightforward enough (two-sided wrap instead of one-sided) that I'm confident in it, but worth a 10-second glance at `/designs`'s Flyers row a minute or so after this ships, just to watch it keep cycling instead of going blank.

## 4. Test-file breakage found and fixed

`a11y-mobile-gate.test.tsx` (the regression-lock suite) has three assertions that read specific source files for specific strings — all three broke when markup moved to new files during the file-split and carousel-unification work, none of it from anything in this pass:

- **"splash entry"**: asserted `<RandomSplash onEnter={handleEnter} />` inside `app/page.tsx` — but `page.tsx` was split into a server component (for its own metadata, from the 2026-10-27 SEO fix) that just renders `<HomeEntry />`, and the splash markup moved there. Updated the read to `components/HomeEntry.tsx`, where it now actually lives; the invariant itself (enter only via the button, never a full-screen tap) is unchanged and still holds — checked `HomeEntry.tsx` directly, no stray `onClick={handleEnter}`.
- **"carousel scale"**: asserted specific width classes in `home/page.tsx`, `photography/page.tsx`, and `events/page.tsx` — all three carousels moved to `HomeCarousels.tsx`, `PhotographyModals.tsx`, and `EventsVideo.tsx` respectively during the oversized-file split. Updated each read to the file that now holds the markup; the actual width values (`md:w-[423px]`, `lg:w-[582px]`, `md:w-[297px]`) are all still there, confirmed via grep before changing anything. `designs/page.tsx` was never split, so its line is untouched, and `PhotographyCategoryRows.tsx` (a different component — the `/photography/[category]` detail-page rows, not touched by any of this) still has its own unchanged `md:h-[381px]`, so that assertion was never actually broken despite what the handover's "known issues" section said.

Couldn't run the actual Vitest suite to confirm (`Cannot find native binding` — the same pre-existing rolldown/native-binary issue as every prior round in this environment); reasoned through both fixes by hand the same way as the earlier splash-metadata fix, confirming each file read now contains exactly the string each assertion expects. `tsc --noEmit` and `eslint` both clean on the test file.

## Files touched

`src/app/designs/page.tsx` (carousel wraparound fix), `src/components/home/HomeCarousels.tsx` (same fix), `src/app/a11y-mobile-gate.test.tsx` (3 assertions re-pointed to the files that now hold the markup they check).

## Verification

- `npx tsc --noEmit` — clean, full tree.
- `npx eslint` on all three touched files — 0 problems.
- Vitest itself still can't run in this environment (native-binding error, unrelated to anything here); reasoned through the test fixes by hand against the actual current file contents instead.
- Live production audit (not the protected preview URL) across `/`, `/designs`, `/photography`, `/events`, `/faq`, desktop + mobile — all pass except the Flyers carousel bug documented above, which has a source fix on disk now.

## Not done, by design

Did not touch git (no `add`/`commit`/`push`), did not retrieve or enter any admin credentials, did not sign into the Vercel-protected preview URL. All per the standing instructions from earlier in this engagement.
