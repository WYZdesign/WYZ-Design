# HANDOVER: wyzdesign.com site audit — 2026-11-06 (Claude Code → opencode)

**Repo:** `V:\wyzdesign` (branch `master`, HEAD `9595981`). The only uncommitted item is `HANDOVER_VISUAL_AUDIT_2026-11-05.md` (untracked).
**Target:** https://www.wyzdesign.com (production)
**Relationship to `HANDOVER_VISUAL_AUDIT_2026-11-05.md`:** that file is a *checklist request*. This file is the *results* of the parts Claude ran: all 174 sitemap URLs, plus 9 extra routes, fetched for status/redirect/title/H1/canonical/visible-text defects; a mobile 375×812 rendered pass on `/`, `/photography`, `/designs`, `/services`; merch product rendering; admin/API auth; robots; security headers.
Copy also at `W:\WYZ_Command_Center\_STATE\handovers\20261106-claude-to-opencode-wyzdesign-site-audit.md`.

No code was changed. Nothing was submitted, and no account was signed into.

---

## P1: SEO / indexing (real, measurable)

### P1-1. Mobile has no H1 on /services, /photography, /designs
On each of these pages the only `<h1>` sits inside the desktop-only hero (`hidden md:grid md:grid-cols-2 absolute …`). The mobile hero ("CREATIVE SERVICES", "CAPTURING MOMENTS", "DESIGNING THE FUTURE") isn't an h1. Google indexes mobile-first, so these three pages effectively have **no H1**. At 375px the first visible headings on `/services` are `H2: PRICING CALCULATOR` and `H2: BUILD YOUR OWN PLAN`.
**Fix:** render one `<h1>` for both layouts. Either make the mobile hero title the `h1` and demote the desktop one to `<p aria-hidden>`, or use a single h1 positioned per breakpoint. Verify: `document.querySelectorAll('h1')` returns exactly 1 element with a non-zero height at 375 *and* at 1440.

### P1-2. `/about` has two H1s
"BUILT DIFFERENT" plus "Nomadic Breed Issue 001". Demote the Nomadic Breed one to `h2`.

### P1-3. Merch product pages can't rank
- `src/app/merch/[id]/metadata.ts:16` hard-codes `canonical: "/merch"`, and `src/app/merch/layout.tsx:7` sets `canonical: "https://www.wyzdesign.com/merch"`. **Every product page tells Google it's a duplicate of /merch.**
- All 4 products share the title "Merch Store | WYZ Design".
- The server HTML has no product name, price or `<h1>`; the product loads client-side from `/api/printful-product/:id`. Crawlers see an empty page.
**Fix:** in `merch/[id]`, add `generateMetadata({ params })` that fetches the product server-side (same call as `/api/printful-product`) and returns `title: \`${name} | WYZ Merch\``, `alternates.canonical: \`/merch/${id}\``, and `openGraph.images: [image]`. Render the name as `<h1>` server-side and add Product JSON-LD (name, image, offers.price, priceCurrency USD, availability). Remove the canonical from `merch/layout.tsx` (it overrides every child). Same issue for `/merch/concepts`: give it its own canonical.

### P1-4. Sitemap lists URLs that redirect
`/brands` → `/about`, `/booking-calendar/photoshoot|consultation|event-photography|photo-retouching` → `/booking`. Five sitemap entries are redirects. Remove them from `src/app/sitemap.ts` (sitemaps should only list final 200 URLs). Also check `/plans` → `/services` and `/referral` → `/loyalty` aren't linked internally anywhere; if they are, link the destination directly.

## P2

- **Merch naming and prices look unfinished.** Products are titled with Printful's generic names ("Unisex Hoodie", "Five Panel Cap", "Vintage corduroy cap", "Vintage Cotton Twill Cap"), with unrounded prices **$29.16 / $22.85 / $20.79 / $21.83** taken straight from Printful variant `price` (`src/app/api/printful-catalog/route.ts:38-45`). For Torreé: set branded product names and rounded retail prices (e.g. $45 / $30) in the Printful dashboard. The code just mirrors them. Don't hardcode prices in the site.
- **`/api/auth/session` is fetched 4–8 times per page load.** One `<SessionProvider>` (`AuthProvider.tsx:73`, default refetch-on-focus) is shared by 10 `useSession()` callers. Set `<SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>` and pass the server session in as `session` from the layout. Each call is a serverless invocation.
- **No `Strict-Transport-Security` header** on www.wyzdesign.com (CSP, XFO, nosniff, Referrer-Policy and Permissions-Policy are present). Add to `next.config` headers: `max-age=63072000; includeSubDomains; preload`.

## Confirmed NOT bugs (don't re-check)
- **Scroll-reveal sections (`.wz-reveal` → `.wz-revealed`) work.** Earlier automated passes flagged many sections as `opacity:0` on /photography, /designs and /services. That happens when the browser isn't painting (the CSS animation freezes at progress 0). With the browser in front, `wzFadeInUp` finishes and opacity becomes 1. **Any future "invisible section" report must first confirm the browser is actually painting** (take a screenshot, or check that `requestAnimationFrame` fires).
- No visible "undefined", "NaN", "$0.00", "lorem" or "TODO" text on any of the 174 sitemap pages (script payloads excluded).
- No broken images, no horizontal overflow, no unnamed buttons/links at 375px on `/`, `/photography`, `/designs`, `/services`. All hero/nav videos load and play (`readyState 4`).
- Every sitemap URL returns 200 (5 via the redirects in P1-4). The custom 404 works.
- Auth: `/api/zeal/status` → 401 and `/api/forms` → 403 signed out. `/admin` is a client shell whose data comes from `/api/admin/*`, which is gated in `src/proxy.ts` (covered by `HANDOVER_ADMIN_*` files). `/account` and `/admin` are disallowed in robots.txt.
- `/api/printful-catalog` being public is intended (catalog data only).

## Done criteria
1. Branch `opencode/wyzdesign-audit-fixes`. Don't commit the untracked `HANDOVER_VISUAL_AUDIT_2026-11-05.md` or this file unless Torreé wants handovers in git (the `vercel_ignore.sh` guard makes docs-only pushes free).
2. Build, tsc and lint clean. Push, PR, then `python W:\WYZ_Command_Center\wyz_deploy_check.py <sha> --project wyzdesign` → `DEPLOY IS LIVE ✅`.
3. Verify P1-1 with `wyz_web_shoot.py https://www.wyzdesign.com/services --width 375` plus a DOM check that exactly one visible h1 exists.
4. Verify P1-3: `curl.exe -s https://www.wyzdesign.com/merch/445705140 | Select-String '<h1|rel="canonical"'` shows the product name and `/merch/445705140`.
5. Reply: `W:\WYZ_Command_Center\_STATE\handovers\20261106-opencode-to-claude-wyzdesign-fixes-done.md`.

---

## ADDENDUM: deep pass (2026-11-06 17:30–18:00 PT)

**Cross-reference:** local `master` `30f8374` == GitHub `WYZdesign/WYZ-Design` (public). `30f8374` (16:45 PT) only adds `HANDOVER_VISUAL_AUDIT_2026-11-05.md`. Full history (766 commits) scanned for leaked keys/private keys/DB passwords: **clean**, and no `.env` ever committed.
**Gates at HEAD (clean copy):** `tsc` ✅, ESLint **0 errors / 24 warnings** ✅. `next build` can't complete without Supabase env (`supabaseUrl is required` while collecting `/api/cron/seo-snapshot`). That's expected outside Vercel and not a defect. `better-sqlite3` needs node-gyp; installs fine with headers available.

### NEW P0. Dependency advisories: 22 vulnerabilities (4 critical, 11 high)
- **`next@16.2.6`**:
  - **GHSA-6gpp-xcg3-4w24 Middleware/Proxy bypass (App Router + Turbopack)**. Verified: the admin route handlers (`api/admin/route.ts`, `gift-cards`, `delivery-events`) check the session against `ADMIN_EMAILS` themselves, so a proxy bypass doesn't open admin. It **does** skip what only `src/proxy.ts` enforces: the **CSRF Origin/Referer check on every non-GET `/api/*`**, the content-type allowlist, the 10 MB body cap and the UA/IP blocklists.
  - The 2026 Image-Optimization RCEs (GHSA-2xp9-vwfh-vxw4 / GHSA-2464-fhr4-w9xw), `use cache` RCE (GHSA-673q-mjm6-r5xr), SSRF in rewrites and Server Actions, and DoS.
- **`next-auth@5.0.0-beta.31` / `@auth/core`**: **GHSA-8fpg-xm3f-6cx3 "configuration errors can cause existence-based auth checks to fail open"** (critical): any `if (session)` / `if (auth)` check can pass when Auth.js returns an error object. Also GHSA-7rqj-j65f-68wh (homoglyph email bypass) and GHSA-xmf8-cvqr-rfgj.
- **`dompurify`** (critical, IN_PLACE bypasses), `fast-xml-parser`, `browserslist`, `decode-uri-component` (via `minio`).

**Fix:**
```powershell
Set-Location V:\wyzdesign
git switch -c opencode/wyzdesign-security-bumps
npm i next@16.4.5 eslint-config-next@16.4.5 --save-exact
npm i next-auth@beta @auth/core@latest dompurify@latest
npm audit fix
npm audit --omit=dev
```
Then audit every `auth()` caller in `src/app/api`: checks must compare a concrete field (`session?.user?.email` against the allowlist, as the admin routes already do), never just `if (session)`, because GHSA-8fpg can hand back a truthy error object. Admin access is **email-allowlist based**, so GHSA-7rqj-j65f-68wh (Unicode-homoglyph email bypass) is the one to close first. Normalize with `email.normalize('NFKC').toLowerCase()` in `checkAdmin` / `isAllowedEmail` / `lib/admin-auth.ts` in addition to upgrading. Build, run tests, PR.

### NEW P1-5. Test suite is red at HEAD, so CI (`ci-cd.yml` runs `npm run test:run` on every push to master) is failing
4 of 122 tests fail:
1. `a11y-mobile-gate.test.tsx` › merch empty catalog resolves to a real empty state: expects `setCatalogStatus("loaded")` in the merch page, but the page now uses `usePrintfulCatalog()`. **Check that the empty-catalog state still renders an empty message (not an endless skeleton)**, then update the lock to match the hook.
2. `a11y-mobile-gate.test.tsx` › carousel scale: expects `md:w-[423px]`, but the 2026-11-04 batch switched carousels to fixed-height/auto-width. Update the assertion.
3–4. `api/routes.test.ts` › GET /api/health: the test calls `GET()` with no request, while the route now reads `req.headers.get("x-vercel-cron")`. Pass `new Request("http://x/api/health")` in the test, or make the route guard `req?.headers`.

### Visual (live, mobile)
Home splash ("Enter site") and merch hero render. Reveal animations work when the browser is painting (see the earlier "Confirmed NOT bugs").
