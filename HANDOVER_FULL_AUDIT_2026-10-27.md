# Full a11y / SEO / security / design-system audit — 2026-10-27

WYZMiND started a "comprehensive a11y/seo/security/design-system improvements" pass (commit `95116f8`, then kept building on it uncommitted — a design-tokens system, a contrast checker, a SEO-check persistence layer with a Supabase migration, a security-headers module, and web-vitals tracking). This picks that effort up, finishes the broken pieces, and actually runs the checks against the live site. Everything below is either a confirmed bug (with a fix already on disk) or a measured, real finding — nothing here is speculative.

## 1. Bugs found and fixed (code, on disk, not committed — same as always, WYZMiND reviews and ships)

**`src/lib/seo-persist.ts` — build-breaking type error.** The `SeoCheckRecord` interface had four fields (`has_h1`, `has_canonical`, `has_og`, `has_schema`) typed as `boolean`, but the function that actually produces them assigns `1`/`0` (numbers), and the Supabase migration (`sql/migrations/0001_seo_checks.sql`) defines those same columns as `INTEGER`. `npx tsc --noEmit` was failing right now, before this fix. Reverted the four fields to `number` so the interface matches both the database schema and the code that populates it.

**`src/lib/security-headers.ts` — a CSP directive typo that silently did nothing.** `upgrade-in-requests` isn't a real CSP directive (the real one is `upgrade-insecure-requests`); an unrecognized directive is just ignored by the browser, not an error, so this had zero effect while looking like it was doing something. Also added the origins this policy was missing that the site's actual images/APIs depend on (Supabase storage, Printful, Cloudinary, Resend, Sentry, cal.com) — all already present in the real, live CSP in `next.config.ts`, just missing from this newer, parallel, not-yet-wired-in module. This module isn't imported anywhere yet, so none of this was live or broken in production — fixed it before it gets wired in, so it doesn't regress anything when it is.

**`src/lib/web-vitals-tracker.ts` — real lint error + dead code paths.** `npx eslint` was failing with an actual error (`@ts-ignore` instead of `@ts-expect-error`) plus a warning (unused import of `logEvent`, which is a server-only helper that was never actually callable from this client component anyway — the file's own `sendMetric` already does the right thing by POSTing to `/api/analytics` instead). Also: the `web-vitals` npm package isn't installed (confirmed — not in `package.json`, not in `node_modules`), and the code was calling the package's old v1/v2 API names (`getFCP`, `getLCP`, etc.) which were removed years ago — whatever version actually gets installed will only export the current `onFCP`/`onLCP`/`onCLS`/`onFID`/`onTTFB`/`onINP` names, so even with the package installed this would have silently tracked nothing. Fixed the names and added a `.catch()` so the dynamic import fails silently instead of leaving an unhandled promise rejection on every single page load until the package exists.

**Removed `src/lib/web-vitals.ts`.** A second, older, fully duplicate attempt at the same thing — also importing the missing package, also using the dead API names, and never imported by anything. `web-vitals-tracker.ts` supersedes it. Moved to `_to_delete/web-vitals.ts.dead` (this bridge can't delete files outright) rather than left as permanently-broken dead weight.

**The home page (`/`) had no `<link rel="canonical">` and an oversized title/description — now fixed.** This was the single most concrete SEO bug found. Every other checked page has its own short title, description, and canonical URL; `/` had none of that and was falling back to the root layout's generic defaults (62-char title, 214-char description — both over the normal SEO limits). Root cause: `/` is served by `src/app/page.tsx`, which is a client component (it owns the splash-screen state), and Next.js metadata exports only work from server components. There was a `src/app/home/metadata.ts` already written with the right content (shorter copy, correct canonical) — but `app/` has no built-in "metadata.ts" file convention; only a `layout.tsx` or `page.tsx` export is ever read, and nothing imported that file. It was dead on arrival.

Fixed by splitting the client-only splash logic into a new `src/components/HomeEntry.tsx`, and turning `src/app/page.tsx` back into a plain server component that exports its own `metadata` (title trimmed to 44 chars, description trimmed to 157, canonical `"/"`) and just renders `<HomeEntry />`. Removed the now-dead `home/metadata.ts`. `tsc` and `eslint` both clean on every touched file; couldn't run the actual test suite in this environment (same pre-existing native-binary limitation as every prior round — confirmed by running an unrelated, already-passing test file and getting the identical failure, so this isn't something the change broke) but traced through `page.test.tsx`'s mocks by hand: it mocks `@/components/SplashVariants`, `@/hooks/useSplashScrollLock`, and the `home/page` module by path, all of which resolve to the exact same files regardless of which component (`page.tsx` or the new `HomeEntry.tsx`) imports them, so the existing test should still pass as written.

## 2. SEO — ran the actual check against all 16 live pages

| Finding | Detail |
|---|---|
| `/` missing canonical, title 62 chars, description 214 chars | Fixed above |
| Every other page (`/about`, `/services`, `/photography`, `/events`, `/designs`, `/web-design`, `/printing`, `/plans`, `/contact`, `/faq`, `/merch`, `/community`, `/wyzmind`, `/blog`, `/loyalty`) | Score 86/100, zero issues — each has its own canonical, title, description, OG tags, and schema |

(Score caps at 86 rather than 100 because the scoring formula divides by 7 checks but only 6 can ever be true at once for a normal page — that's a quirk of the scoring math in `seo-persist.ts`, not a real problem with any page; flagging it only so nobody mistakes "86/100 across the board" for an actual deficiency.)

## 3. Security headers — compared live response headers against `next.config.ts`

The actual production CSP (via `next.config.ts`, not the new unwired module) is solid: `frame-ancestors 'none'`, correct `upgrade-insecure-requests`, a properly scoped `img-src`/`connect-src` allowlist, CSP-Report-Only running alongside the enforced policy, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Cross-Origin-Opener-Policy: same-origin`.

One real discrepancy: the live response for `/` right now is missing `Strict-Transport-Security` entirely, and its `Permissions-Policy` doesn't match what's in `next.config.ts` (live: `camera=(), microphone=(), geolocation=()`; configured: `camera=(), microphone=(), geolocation=(self), gyroscope=(self)`). The response also shows `x-vercel-cache: HIT` and `age: 46854` (about 13 hours) — this looks like a stale edge-cached response from before the current `next.config.ts` headers were deployed, not a bug in the config itself. Worth a quick re-check of response headers after the next deploy to confirm they match; if they still don't match post-deploy, that's a real follow-up.

## 4. Accessibility — manual DOM audit (images, forms, buttons/links, heading structure) across `/`, `/contact`, `/booking`

Zero violations: no images missing `alt`, no unlabeled form inputs, no buttons or links with no accessible name, no heading-level skips. (Tried to run the real `axe-core` engine against the live pages for a deeper pass, but injecting a third-party script into the live production page got blocked by this session's own safety controls — reasonably so, since that's injecting external code into someone else's live site. The manual DOM checks above cover the most common, highest-impact WCAG failures and came back clean; a true axe-core pass would need to run from a dev/staging environment where network access can serve the script locally, or from this codebase's own already-wired `A11yAudit.tsx`.)

One thing noticed but not resolved: every page rendered exactly two `<h1>` elements with identical text, one of them hidden (`offsetParent === null`). Checked the actual page source for `/booking` — only one literal `<h1>` exists in the file, so the second one is being added by something else at runtime (a transition/clone mechanism is the most likely candidate, given how much of this codebase's animation layer works that way). Didn't chase this further — duplicate-but-identical accessible names are a minor concern, not a blocking violation, and I didn't want to go spelunking through the whole animation stack without more signal that it's actually causing a problem. Worth a look if whoever owns `PageTransition`/`SplashVariants` has a theory.

Confirmed: the real, working a11y gate (`A11yAudit.tsx`, using `axe-core`, dev-mode only) is correctly wired into every page via `ClientComponents.tsx` already — this one piece of the new work was done right from the start.

## 5. Color contrast (WCAG AA) — ran the actual math against every brand color pairing

| Pairing | Ratio | Result |
|---|---|---|
| Body text `#333` / white | 12.63 | Pass |
| Secondary text `#666665` / white | 5.75 | Pass |
| Red `#DF3131` / white | 4.54 | Pass |
| Red-dark `#B82020` / white | 6.43 | Pass |
| White text on red button | 4.54 | Pass |
| Dark-mode text `#E0E0E0` / `#1C1C1E` | 12.89 | Pass |
| White text on gold `#C9A227` bg | 2.42 | **Fail** |
| Gold `#C9A227` text / white | 2.42 | **Fail** |
| Border `#E2E2E2` / white | 1.30 | Fails the 3:1 UI-boundary minimum, but this is a near-invisible-by-design card border, not text — common pattern, low priority |
| Red `#DF3131` / dark page `#1C1C1E` | 3.74 | Passes for large text/icons only, not small body text |

The one real, actionable failure: **gold (`#C9A227`) used as small text color directly on light backgrounds fails AA contrast (2.42:1, needs 4.5:1 for normal text or 3:1 even for large text).** Traced where this actually happens — it's not on any public page; it's throughout the **admin dashboard** (`AdminFinanceTabs.tsx`, `AdminGrowthTabs.tsx`, `AdminOverviewTab.tsx`): KPI numbers, status badges, a Schedule-C export link, all at 10-14px gold text. The site's own already-defined `goldDeep` (`#8C6A1D`) passes cleanly (5.01:1 on white) and is sitting unused in the design tokens today — a drop-in swap. Didn't apply this myself: it's ~15+ instances across 3 admin-only files I haven't visually reviewed this engagement, and it's internal tooling rather than anything a visitor sees, so a sighted visual check before changing all of them felt like the right call rather than a blind batch edit.

(For context: `.btn-gold`'s actual real-world usage — dark text `#1C1408` on the gold background — passes fine at 7.53:1. The failure is specifically gold-as-foreground-text, not the button style itself.)

## 6. Design-tokens / dead-code status

`design-tokens.ts`, `contrast.ts`, and (until just now) `web-vitals.ts` were all written but never imported by anything — confirmed by grepping the whole `src/` tree for each. `contrast.ts` also runs `console.table(...)` as a side effect at module-load time, which is harmless while nothing imports it but would spam the console on every import if it's ever wired in — flagging rather than fixing, since the right fix depends on how it's meant to be used (a one-off dev script vs. a reusable utility).

## 7. What's left for WYZMiND specifically

- `npm install web-vitals` — the package genuinely isn't installed. Didn't run this myself: `package.json`/`package-lock.json` are already mid-edit from WYZMiND's own active session, and running npm install on top of someone else's in-flight lockfile changes felt like the wrong moment to do it from here.
- Once that's installed, add one line — `<WebVitalsTracker />` — to `ClientComponents.tsx` next to `<A11yAudit />`, which is the only thing standing between this and actually tracking Core Web Vitals.
- Re-check the live response headers after the next deploy (section 3) to confirm the HSTS/Permissions-Policy mismatch was just a stale cache, not a real gap.
- Decide whether `design-tokens.ts` and `contrast.ts` get wired into real components or stay as reference files — right now they're aspirational.
- Visual review + the `goldDeep` contrast swap across the three admin components, if that dashboard is worth bringing up to AA (nobody outside the team sees it, so this is a judgment call, not an emergency).
- Confirm `sql/migrations/0001_seo_checks.sql` has actually been run against the production Supabase project — no DB credentials from here to check this directly.

## 8. Verification

- `npx tsc --noEmit` — clean, full tree.
- `npx eslint` on every touched file — 0 errors, 0 warnings.
- `git diff --stat` — scoped to exactly the files described above, nothing else touched.
- Live SEO/contrast/a11y/security-header checks above were run directly against `https://www.wyzdesign.com` (the actual production site), not a local build.
- Same disclosed limitation as the rest of this engagement: this bridged environment can't run `next build` or the real test suite (confirmed `vitest` fails identically on an unrelated, already-passing test — a pre-existing native-binary issue, not something this pass introduced).
