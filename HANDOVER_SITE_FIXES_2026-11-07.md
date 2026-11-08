# HANDOVER: wyzdesign.com audit fixes applied — 2026-11-07 (Claude)

**Repo:** `V:\wyzdesign` (branch `master`, base HEAD `30f8374`). Applied directly by Claude at Torree's request ("check all handovers and apply accordingly") rather than handed off to opencode/WYZMiND.

**No git actions taken.** Everything below is uncommitted in the working tree. `git status --short` at the end of this round:

```
 M src/app/about/page.tsx
 M src/app/designs/page.tsx
 M src/app/layout.tsx
 M src/app/merch/[id]/page.tsx
 M src/app/merch/layout.tsx
 M src/app/nomadic-breed/page.tsx
 M src/app/photography/page.tsx
 M src/app/services/page.tsx
 M src/app/sitemap.ts
 M src/components/AuthProvider.tsx
?? HANDOVER_SITE_AUDIT_2026-11-06.md   (now historical — see below)
?? src/app/merch/[id]/MerchProductClient.tsx
```

Someone still needs to review, build, commit, and deploy this. Verification gates run so far (all green): `npx tsc --noEmit` clean across the tree; `npx eslint` clean (0 errors, 0 new warnings) on every touched file. `npm run build` was **not** run (no SWC binary on this device, same limitation as every prior round) — run it before committing.

## What this applies

The source is `HANDOVER_SITE_AUDIT_2026-11-06.md`, which was the most recent/authoritative audit sitting uncommitted in the repo. All of P1-1 through P1-4 and the two actionable P2 items are done.

### P1-1. Mobile has no H1 on /services, /photography, /designs — fixed
The mobile hero text block on each page was a `<div>`; the real `<h1>` only existed in the desktop-only hero. Changed the mobile block's tag to `<h1>` on all three pages (classes/content untouched, zero visual diff):
- `src/app/services/page.tsx`
- `src/app/photography/page.tsx`
- `src/app/designs/page.tsx`

### P1-2. /about has two H1s — fixed
`NomadicBreedPage` (from `src/app/nomadic-breed/page.tsx`) is reused as an embedded section inside `/about`, and its own internal `<h1>` collided with `/about`'s real `<h1>` ("BUILT DIFFERENT"). Added an `asSection?: boolean` prop: when true, the component renders `<h2>` instead of `<h1>` for "Nomadic Breed Issue 001" (same content/classes). `src/app/about/page.tsx` now calls `<NomadicBreedPage asSection />`. Standalone `/nomadic-breed` route is unaffected (still renders its own real `<h1>`).

### P1-3. Merch product pages can't rank — fixed (the real refactor)
Root cause turned out to be slightly different from the audit's literal description: `src/app/merch/[id]/metadata.ts` was **dead code** — nothing imported it, and since the page is `"use client"`, Next.js was never picking it up. The actually-applied metadata was the generic one cascading down from `src/app/merch/layout.tsx` (title "Merch Store", canonical hardcoded to `/merch`), which is why every product shared the same title/canonical, and why the server HTML had no product name/price/`<h1>` — the whole page was client-fetched post-hydration.

Fix: split the page into a server/client pair.
- **`src/app/merch/[id]/page.tsx`** (rewritten, now a Server Component): exports `generateMetadata({ params })` that calls `getProductWithVariants(productId)` from `@/lib/printful` (same function the `/api/printful-product/:id` route already uses) and returns a per-product `title`, `description`, `alternates.canonical: /merch/${id}`, and `openGraph.images`. The page component itself also fetches the product server-side, renders a `Product` JSON-LD script tag (name, image, `AggregateOffer` with low/high price, USD, in/out of stock), and renders `<MerchProductClient product={product} />`. The old inline "Product Not Found" UI is preserved as-is for the not-found case.
- **`src/app/merch/[id]/MerchProductClient.tsx`** (new file): the interactive part — color/size selection, add-to-cart, "you might also like" — moved here verbatim from the old `page.tsx`, now taking `product` as a prop instead of fetching it client-side itself. Because the product is now supplied synchronously (fetched server-side by the parent), the real `<h1>{product.title}</h1>` and price render in the initial server HTML instead of after a client-side fetch, which is the actual fix for "crawlers see an empty page." The old loading-spinner branch was removed since there's no longer a client-side fetch to wait on; the related-products fetch (`/api/printful-catalog`) is unchanged.
- **`src/app/merch/layout.tsx`**: removed the redundant `alternates.canonical` (was overriding every child route's own canonical, as the audit flagged). `title`/`openGraph`/`twitter` left alone — still correct as the fallback for `/merch` itself.
- `src/app/merch/[id]/metadata.ts` was left in place, untouched — it's genuinely dead/unused code, zero behavior either way. Safe to delete in a future cleanup pass; not deleted here since file deletion needs your go-ahead on this device.
- `/merch/concepts` already had its own correct canonical (`merch/concepts/metadata.ts`) — audit's "same issue" note for that route was a false positive, no change needed.

Verify once deployed: `curl.exe -s https://www.wyzdesign.com/merch/445705140 | Select-String '<h1|rel="canonical"|application/ld\+json'` should show the real product name, `/merch/445705140`, and the JSON-LD block.

### P1-4. Sitemap lists URLs that redirect — fixed
Removed from `PUBLIC_ROUTES` in `src/app/sitemap.ts`: `/brands` (→ `/about`) and the four `/booking-calendar/*` entries (→ `/booking`). Checked `/plans` and `/referral` — neither is linked internally anywhere (`grep -rn 'href="/plans"\|href="/referral"' src/` came back empty), so nothing further to do there. Both already redirect correctly in `next.config.ts`.

### P2: SessionProvider refetch spam — fixed
`src/components/AuthProvider.tsx`: `<SessionProvider>` now takes `refetchOnWindowFocus={false} refetchInterval={0}` and a `session` prop. `src/app/layout.tsx`: `RootLayout` is now `async`, calls `auth()` (imported from the NextAuth route handler at `@/app/api/auth/[...nextauth]/route`, which already exports it) once per request, and passes the result into `<AuthProvider session={session}>`. This stops each of the 10 `useSession()` call sites from independently re-fetching `/api/auth/session` on every window focus, and seeds them all from one server-side session read instead.

### P2: Strict-Transport-Security header — already present, no action needed
Checked `next.config.ts`'s `headers()` function: the HSTS header (`max-age=63072000; includeSubDomains; preload`) is already there (line 134, alongside CSP/XFO/nosniff/Referrer-Policy/Permissions-Policy). The audit's claim that it was missing doesn't match the current code — either it shipped between the audit and now, or the live site needs a fresh deploy to pick it up. Nothing to change here; worth re-checking the live response headers after the next deploy.

### P2: Merch naming/prices — explicitly not touched
Per the audit's own note, this needs Torree's input in the Printful dashboard (branded names, rounded prices), not a code change. The code already just mirrors whatever Printful returns.

## Files changed (10 modified, 1 added)

```
M  src/app/about/page.tsx                 (1 line: NomadicBreedPage asSection)
M  src/app/designs/page.tsx               (1 line: mobile hero div -> h1)
M  src/app/layout.tsx                     (async RootLayout, auth() call, session prop)
M  src/app/merch/[id]/page.tsx            (rewritten: server component, generateMetadata, JSON-LD)
M  src/app/merch/layout.tsx               (removed redundant canonical)
M  src/app/nomadic-breed/page.tsx         (asSection prop, h1/h2 toggle)
M  src/app/photography/page.tsx           (1 line: mobile hero div -> h1)
M  src/app/services/page.tsx              (1 line: mobile hero div -> h1)
M  src/app/sitemap.ts                     (removed 5 redirect-destination entries)
M  src/components/AuthProvider.tsx        (session prop, refetch settings)
A  src/app/merch/[id]/MerchProductClient.tsx  (new: interactive client half of the product page)
```

## A note on line endings

Partway through this round, `src/app/about/page.tsx` and `src/app/photography/page.tsx` picked up a full CRLF-conversion artifact from an earlier edit pass (the whole file's line endings flipped even though only one real line changed), which would have shown up as a 600-1400 line diff for a 1-line change. Caught it via `git diff -b --stat` vs plain `git diff --stat` disagreeing, and normalized both files back to match git HEAD's line-ending convention before finishing. `git diff --stat` now shows only the real, intended changes per file (see above) — double-checked with `npx tsc --noEmit` and `npx eslint` again after the normalization, both still clean.

## Done criteria / next steps for whoever picks this up
1. `npm run build` (not run here — SWC binary unavailable on this device).
2. Review the diff, especially `src/app/merch/[id]/page.tsx` + the new `MerchProductClient.tsx` (the one real refactor in this batch).
3. Commit, push, deploy.
4. Verify P1-3 live: product page shows real `<h1>`/title/canonical/JSON-LD in server HTML (view-source, not devtools).
5. Verify P1-1/P1-2 live: exactly one visible `<h1>` on `/services`, `/photography`, `/designs`, `/about` at both mobile and desktop widths.
6. Re-check `Strict-Transport-Security` on the live response headers once deployed, to confirm it's actually being sent (it's in the config; confirming it reaches production closes that P2 item for good).
7. `HANDOVER_SITE_AUDIT_2026-11-06.md` can be left as historical record; everything in it that was actionable is now applied.
