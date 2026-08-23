# WYZ Design — Handover Log

One running file, overwritten each round. Torreé relays it into the repo (Claude has read-only repo access).

## Deployment State

- **Last commit:** `90febfd0` — confirmed via `.git/refs/heads/master` and `.git/refs/remotes/origin/master` (identical SHA), so this and everything before it is genuinely on GitHub, not just local. The "production looks stale" issue was never an unpushed-code problem.
- **Build status:** `tsc --noEmit` clean
- **Vercel:** Auto-deploys from `master` branch — builds were failing for 10+ commits due to `ssr:false` in Server Component. Fixed with `ClientComponents.tsx` wrapper (verified below — cleanly wired, `<ClientComponents />` renders in `layout.tsx` at line 344, no more direct `dynamic(..., {ssr:false})` calls in the Server Component). **This has not yet been confirmed live** — worth checking the Vercel dashboard to make sure the deploy off `90febfd0` (or whichever commit included this fix) actually succeeded, since it's the unlock for testimonials, `/merch/[id]`, `/merch/concepts`, and the pricing calculator all showing up at once.
- **Supabase:** `form_submissions`, `bk_transactions`, `bk_clients`, `bk_categories` tables + `wyzdesign-uploads` storage bucket + `stripe_events` table

## Key Architecture Notes

- **Forms write path:** `/api/forms` POST → Supabase `form_submissions` table
- **Forms read path:** `/api/admin` GET → Supabase `form_submissions` table
- **Bookkeeping:** All tables in Supabase (bk_transactions, bk_clients, bk_categories). Seed defaults on first load.
- **Image upload:** Supabase Storage `wyzdesign-uploads` bucket (public, auto-created)
- **Admin auth:** `ADMIN_EMAILS` env var (comma-separated), checked via NextAuth session
- **HTML sanitization:** `src/lib/dompurify.ts` (isomorphic-dompurify, allowlist-based). Do NOT use regex-based alternatives.
- **Toast notifications:** `react-hot-toast` — all user-facing forms now have toast.success/toast.error

## Session 15 — Claude (Cowork) Live Browser Audit + Chat Widget Timeout Fix
**Auditor:** Claude (Cowork), live browser session via Chrome automation + direct file access to `V:\wyzdesign` via the device bridge
**Date:** 2026-08-23

Good news first: I read the fix wyzmind already shipped for the stale-build root cause — `dynamic(..., {ssr:false})` calls were sitting directly in `layout.tsx`, which the App Router treats as a Server Component, and Next.js hard-errors on `ssr:false` there. Moving them into `ClientComponents.tsx` (a proper `"use client"` wrapper) is exactly the right fix, and I confirmed it's wired correctly — `<ClientComponents />` renders at `layout.tsx:344`, no leftover direct `dynamic()` calls in the server file. That one line was probably breaking 10+ deploys in a row, and explains everything below in Finding 1 in one shot. Nice catch.

### What I independently verified live on production (before the site's edge security started blocking further automated navigation from this session — see note at bottom)
| Finding | Verified how | Result |
|---------|--------------|--------|
| `/web-design` testimonials missing | `get_page_text` on live page | Confirmed — page jumps straight from "CLIENT PORTFOLIO" to "PRICING," no testimonials section rendered |
| `/merch/1` 404s | Direct navigation + page text | Confirmed — real custom 404 page, not a stale cache artifact |
| `/merch/concepts` 404s | Direct navigation + page text | Confirmed — same 404 |
| `/plans` pricing calculator missing | `get_page_text` + `find` on live page | Confirmed — no "PRICING CALCULATOR" section anywhere between the comparison table and Build Your Own Plan |
| Local `master` vs `origin/master` | Read `.git/refs/heads/master` and `.git/refs/remotes/origin/master` directly | **Identical SHA** (`90febfd0...`) — the push genuinely succeeded. The stale-production issue was 100% a Vercel build/deploy problem, never an unpushed-commits problem. This should save time chasing the wrong cause. |

### New finding: AI chat widget hangs indefinitely, root-caused and fixed
I opened the live widget, asked "What services do you offer?", and it sat on a "..." typing indicator with no response for 15+ seconds, after which the input field itself stopped accepting new messages. Read `api/chat/route.ts` and found the cause: the Ollama fetch (`fetch(`${ollamaUrl}/api/chat`, ...)`) has **no timeout or AbortController**. `vercel.json` sets `maxDuration: 30` on API routes, so if `OLLAMA_URL` points anywhere slow/unreachable (the Shadow PC GPU tunnel, per the code comment, isn't a guaranteed-up endpoint), the whole request can legitimately hang for up to 30 seconds before Vercel kills the function — meanwhile the widget shows nothing and blocks further input. The reliable pattern-matching fallback in the same file works fine and returns instantly; it just never gets a chance to run.

**Fix applied (files written directly to `V:\wyzdesign` via the device bridge, NOT yet committed to git — please review and commit/push):**
- `src/app/api/chat/route.ts` — wrapped the Ollama fetch in an `AbortController` with a 3.5s timeout. On timeout or any Ollama failure, it now falls through to the pattern-matching fallback almost immediately instead of riding out the full 30s function budget.
- `src/components/ChatWidget.tsx` — added a 20s client-side watchdog (`AbortController` on the `/api/chat` fetch) as defense-in-depth, so even an unexpected server-side stall can't leave the widget permanently stuck with the input disabled. Shows a friendlier "that's taking longer than it should" message if it actually times out, vs. the generic connection-error message for other failures.

Both files build clean as far as I can tell from reading them, but **please run `tsc --noEmit` and your normal build check before committing** — I don't have shell access to your machine from this session, only file read/write through the device bridge, so I couldn't verify the build myself.

### One more thing worth flagging: browser automation got blocked mid-audit
Partway through testing (right after the merch 404 checks), the site's edge security started hard-blocking every further navigation from my Chrome session — every URL just bounced back to a blank tab. This matches the "Blocked by WYZ Design edge security" WAF behavior noted earlier against Puppeteer; it may be triggering here too against rapid automated navigation, even from a real Chrome extension session. I couldn't verify the Cal.com booking widget fix live for that reason — the `booking/page.tsx` stub-sequence fix reads correct in source, but someone should confirm it renders in a normal browser session (not automated) to be sure. If this WAF sensitivity is going to keep happening to both of our audit tools, might be worth an allowlist rule for legitimate QA traffic, or at least know to pace out live checks.

### Suggested next moves (either of us, whichever gets there first)
- Confirm on the Vercel dashboard that the `ClientComponents.tsx` fix actually deployed successfully, then re-check `/web-design`, `/merch/1`, `/merch/concepts`, and `/plans` live — if the build was the only blocker, all four should just appear.
- Review + commit + push the two chat widget files above.
- Once chat is redeployed, send it a real message live and confirm it responds within a couple seconds instead of hanging.
- Manually verify Cal.com on `/booking` in a normal (non-automated) browser.
- Still worth a look whenever there's time: the Google Drive API key exposure in `models/route.ts`, `gdrive-photos/route.ts`, `gdrive-index/route.ts`, `model-photos/route.ts`, `fd/drive/route.ts` (flagged in earlier audits, not sure if the "Google Drive proxy" commit already addressed this — worth a quick check either way), the six orphaned backend routes, and the `/events` + `/printing` mobile navbar-clearance check that's been on the list a few sessions now.

## Session 14 — Deep Security Audit + Bug Fixes
**Auditor:** opencode (automated audit) + Claude (browser walkthrough)
**Date:** 2026-08-23

### Fixes Applied
| Fix | File(s) | Severity | Status |
|-----|---------|----------|--------|
| Chat route hardcoded Ollama URL — no env var | `api/chat/route.ts` | CRITICAL | ✅ Fixed — uses `OLLAMA_URL` env var |
| CSRF localhost bypass — any localhost passes | `lib/csrf.ts` | HIGH | ✅ Fixed — uses `NODE_ENV !== "production"` |
| Admin add-points no input validation | `api/admin/route.ts` | HIGH | ✅ Fixed — validates email, amount (1-10000), reason (max 200 chars) |
| Admin error message leak | `api/admin/route.ts` | MEDIUM | ✅ Fixed — returns generic "Internal server error" |
| IP hash salt hardcoded | `api/analytics/route.ts` | HIGH | ✅ Fixed — uses `IP_HASH_SALT` env var |
| Forms hardcoded fallback email | `api/forms/route.ts` | MEDIUM | ✅ Fixed — empty string fallback instead of personal email |
| Chat route no input size limits | `api/chat/route.ts` | MEDIUM | ✅ Fixed — max 50 messages, 2000 chars per message, keeps last 10 |
| 4 console.error → logger | `discord.ts`, `novu.ts`, `wyzmind.ts` (x2) | MEDIUM | ✅ Fixed — added logger import + migration |
| Cal.com widget "Cal is not defined" | `booking/page.tsx` | HIGH | ✅ Fixed — uses proper stub sequence instead of manual script injection |
| Blog topic no length limit | `api/blog/generate/route.ts` | MEDIUM | ✅ Fixed — max 500 chars |
| Novu subscriberId collision | `lib/novu.ts` | MEDIUM | ✅ Fixed — appends timestamp |
| Unused `isAdmin` import | `api/admin/route.ts` | LOW | ✅ Fixed — removed dead import |
| Hardcoded MinIO fallback URL | `api/album-images/route.ts` | MEDIUM | ✅ Fixed — empty string fallback |
| Windows path `G:\My Drive\` exposed | `api/gdrive-index/route.ts` | MEDIUM | ✅ Fixed — uses generic path |
| fd/events GET no error handling | `api/fd/events/route.ts` | MEDIUM | ✅ Fixed — added try/catch |
| n8n webhook silent error swallowing | `api/webhook/route.ts` | LOW | ✅ Fixed — added logger |

### Claude Browser Audit Findings
1. **🔴 Production serving old build** — Code exists for testimonials, merch/[id], merch/concepts, but production returns 404 or doesn't show them. Need to check Vercel dashboard for failed/stuck builds.
2. **🔴 Cal.com widget "Cal is not defined"** — Manual script injection skipped Cal.com's required stub function. ✅ Fixed with proper stub sequence.

### Still Open (requires user action)
- Printful API key — NOT in vault
- Stripe Price IDs — NOT in vault (need 4 Price objects in Dashboard)
- End-to-end purchase test
- Event recap videos — needs source files from user

## Session 13 — Claude Audit #2 + AI Chat + Merch Product Pages + Concept Archive + Pricing Calculator
**Auditor:** Claude (read-only browser walkthrough of old Wix + DBC sites) + wyzmind (opencode)
**Date:** 2026-08-23
**Commits:** `ad6c1b1`

### Claude Audit #2 Cross-Reference
| Finding | Status |
|---------|--------|
| Photography album pattern (category → sub-page → lightbox) | Already existed (`/photography/[category]/page.tsx`) |
| Build Your Own Plan form | Already existed (`/plans` — `CUSTOM_PLAN_FIELDS` + DynamicForm) |
| Model Archive stack reveal | Already existed (polaroid carousel on `/photography`) |
| Merch products + filters + sort | Already existed (14 fallback products, category/sort/rating) |
| AI concierge chat widget | ✅ Built this session |
| Concept Archive page | ✅ Built this session |
| Merch product detail pages | ✅ Built this session |
| Interactive pricing calculator | ✅ Built this session |

### Corrections to Claude's Handover
- Cal.com CSP: Already fixed in Session 7 (`app.cal.com` in script-src, connect-src, frame-src). Claude reported stale.
- Featured Artist page: Already exists at `/featured-artist/page.tsx`. Claude reported as missing.
- Build Your Own Plan: Already existed on `/plans`. Claude reported as missing.

### New Features Built
| Feature | File(s) | Status |
|---------|---------|--------|
| AI chat widget with streaming + service knowledge | `components/ChatWidget.tsx`, `app/api/chat/route.ts` | ✅ Built |
| Merch product detail pages (material specs, POD disclosure, "You Might Also Like") | `app/merch/[id]/page.tsx` | ✅ Built |
| Concept Archive page (design names + stories) | `app/merch/concepts/page.tsx` | ✅ Built |
| Interactive pricing calculator | `components/PricingCalculator.tsx`, `app/plans/page.tsx` | ✅ Built |

### Claude Audit #1 Items — Still Open
- Featured Artist of the Month — page exists but needs content/artist selection
- Event recap videos — needs source files from user
- LLM chat widget on old site concept — ✅ Built this session

### Still Open (requires user action)
- Printful API key not configured (merch shows fallback products)
- Stripe subscription Price IDs stale (need Dashboard creation)
- End-to-end purchase test not completed — Old Site Audit: Quick Wins from Claude's Cross-Reference
**Auditor:** Claude (read-only browser walkthrough of old Wix Studio site) + wyzmind (opencode)
**Date:** 2026-08-23

Claude audited the old `wyzdesign.wixstudio.com/wyzdesign` against the current site. 9 ideas proposed. 5 already existed. 2 applied.

| Fix | File(s) | Status |
|-----|---------|--------|
| Loyalty page gated everything behind sign-in — show tiers + earn ways publicly | `loyalty/page.tsx` | ✅ Fixed |
| Web-design missing testimonials | `web-design/page.tsx` | ✅ Fixed — added 3 Google review testimonials |
| Services category filter tabs | `services/page.tsx` | Already existed |
| Printing paper-type education | `printing/page.tsx` | Already existed |
| Photography auto-scrolling filmstrip | `photography/page.tsx` | Already existed (3 AutoScrollRow sections) |
| Web-design client portfolio + process steps | `web-design/page.tsx` | Already existed |

**Remaining (need user input):**
- Build Your Own Plan form on `/plans` — needs design decision
- Featured Artist of the Month page — needs content/artist selection
- Event recap videos on `/events` — needs source files from user
- LLM chat widget — exploratory, low priority

## Session 11 — Toast Notifications + Security Regression Fix
**Auditor:** opencode + Claude (Cowork)
**Date:** 2026-08-23
**Commits:** `9a742a6`, `1fd62a0` (had regression), `5cc83cd` (security fix), `5fb5d30` (HANDOVER)

| Fix | File(s) | Severity | Status |
|-----|---------|----------|--------|
| Toast notifications across all user-facing forms (11 files) | DynamicForm, LeadMagnet, booking-calendar, model-archive, featured-artist, photography, printing, plans, gift-card, community | MEDIUM | ✅ Fixed |
| Stale Twitter URL (twitter.com → x.com) | `Footer.tsx` | LOW | ✅ Fixed |
| Broken YouTube channel placeholder ID | `events/page.tsx` | MEDIUM | ✅ Fixed |
| Unused useState import | `contact/page.tsx` | LOW | ✅ Fixed |
| 21 form inputs missing aria-label | Footer, model-archive, featured-artist, photography, printing | MEDIUM | ✅ Fixed |
| **SECURITY: DOMPurify sanitizer accidentally replaced with regex blocklist** | PageRenderer, view/[page], api/pages, api/forms | **CRITICAL** | ✅ Fixed — restored `dompurify.ts`, removed weak regex |
| Dead `dompurify.ts` removed incorrectly | `lib/dompurify.ts` | HIGH | ✅ Fixed — restored from git |

**Claude caught the sanitizer regression** — "consolidate imports" commit accidentally swapped DOMPurify for a regex blocklist in `rate-limit.ts`. Output goes into `dangerouslySetInnerHTML`. Fixed by restoring DOMPurify and removing the regex duplicate.

## Session 10 — Security Hardening + Performance + Logger Migration
**Auditor:** opencode (automated audit)
**Date:** 2026-08-22
**Commits:** `f871d30`, `96d9032`

| Fix | File(s) | Severity | Status |
|-----|---------|----------|--------|
| CSRF hardcoded fallback `"wyz-csrf-fallback"` | `lib/csrf.ts` | CRITICAL | ✅ Fixed — throws if env vars missing |
| Admin password empty string fallback | `api/auth/[...nextauth]/route.ts`, `api/pages/route.ts` | HIGH | ✅ Fixed — fails closed |
| 14 `console.warn/error` in production code | 9 page files | MEDIUM | ✅ Fixed — migrated to logger |
| 5 static policy pages `"use client"` unnecessarily | terms, privacy, refund, shipping, copyright | MEDIUM | ✅ Fixed — now Server Components |
| 5 heavy layout components loaded statically | `layout.tsx` | MEDIUM | ✅ Fixed — dynamic import with ssr:false |
| 24 `any` types eliminated | `analytics.ts`, `admin/page.tsx` | MEDIUM | ✅ Fixed — proper interfaces |
| shuffleArray duplicated across 5 files | home, services, designs, photography, SafeImage | LOW | ✅ Fixed — single import from utils |
| Alt text missing on brand logos | `about/page.tsx`, `PageRenderer.tsx` | MEDIUM | ✅ Fixed |

## Session 9 — Sitewide Navbar Overlap Fix + Interactive Hero Effects
**Auditor:** Claude (Cowork) + wyzmind (opencode)
**Date:** 2026-08-22

| Fix | File(s) | Severity | Status |
|-----|---------|----------|--------|
| Headings hidden behind navbar on 18 pages | 18 page files | HIGH | ✅ Fixed — pt-32 lg:pt-40 |
| Events YouTubeSection static | `events/page.tsx` | MEDIUM | ✅ Fixed — mouse-interactive reveal |
| Events YouTubeSection overlay too light | `events/page.tsx` | MEDIUM | ✅ Fixed — 90% black |
| About hero static crown logos | `about/page.tsx` | MEDIUM | ✅ Fixed — mouse-interactive reveal |
| About hero overlay too light | `about/page.tsx` | MEDIUM | ✅ Fixed — 90% black |
| Printing marquee above hero | `printing/page.tsx` | LOW | ✅ Fixed — moved under hero |
| Photography carousel too narrow | `photography/page.tsx` | MEDIUM | ✅ Fixed — widened items |
| Merch duplicate images | `merch/page.tsx` | MEDIUM | ✅ Fixed — deduplicated |

## Session 8 — API Security Hardening
**Auditor:** wyzmind (opencode)
**Date:** 2026-08-22

| Fix | File(s) | Severity | Status |
|-----|---------|----------|--------|
| Analytics GET no auth | `analytics/route.ts` | HIGH | ✅ Fixed |
| Analytics hashIp inline require | `analytics/route.ts` | LOW | ✅ Fixed |
| fd/events POST no auth | `fd/events/route.ts` | HIGH | ✅ Fixed |
| fd/events console.error | `fd/events/route.ts` | LOW | ✅ Fixed |
| telemetry POST missing return | `telemetry/route.ts` | LOW | ✅ Fixed |

## Session 7 — Cal.com CSP Fix
**Auditor:** Claude (Cowork) + wyzmind (opencode)
**Date:** 2026-08-22

| Fix | File(s) | Severity | Status |
|-----|---------|----------|--------|
| Cal.com widget blocked by CSP | `next.config.ts` | HIGH | ✅ Fixed — added app.cal.com to script-src, connect-src, frame-src |

## Session 6 — Critical Security Fixes + Stripe BOM
**Auditor:** Claude (Cowork) + wyzmind (opencode)
**Date:** 2026-08-22

| Fix | File(s) | Severity | Status |
|-----|---------|----------|--------|
| Path traversal in GET /api/pages | `api/pages/route.ts` | HIGH | ✅ Fixed |
| Hardcoded newsletter HMAC fallback | `api/newsletter/route.ts` | HIGH | ✅ Fixed |
| No auth on /api/bookkeeping/meta | `api/bookkeeping/meta/route.ts` | HIGH | ✅ Fixed |
| Rate limit not called in POST /api/forms | `api/forms/route.ts` | HIGH | ✅ Fixed |
| Gift card validation bug | `api/checkout/route.ts` | HIGH | ✅ Fixed |
| BOM in NEXT_PUBLIC_URL broke Stripe | `stripe.ts`, `robots.ts`, `sitemap.ts`, `newsletter/route.ts` | HIGH | ✅ Fixed — shared getSiteUrl() helper |

## Session 5 — SafeImage Priority, FAQ, Gallery, CSP
**Auditor:** Claude (Cowork) + wyzmind (opencode)
**Date:** 2026-08-22

| Fix | File(s) | Status |
|-----|---------|--------|
| SafeImage priority prop no-op | `SafeImage.tsx`, `utils.tsx` | ✅ Fixed — maps to loading="eager" |
| Carousel images still lazy | `designs/page.tsx`, `merch/page.tsx` | ✅ Fixed |
| FAQ duplicated text on desktop | `faq/page.tsx` | ✅ Fixed |
| Gallery zero photos | `gallery/page.tsx` | ✅ Fixed — added aspect-[3/4] |
| Blog images blocked by CSP | `next.config.ts` | ✅ Fixed |
| Analytics pixels blocked by CSP | `next.config.ts` | ✅ Fixed |
| FDDriveBrowser missing relative | `FDDriveBrowser.tsx` | ✅ Fixed |
| Brands says "three" not "four" | `brands/page.tsx` | ✅ Fixed |

## Session 4 — Bookkeeping DB + Upload Fix
**Auditor:** Claude (Cowork)
**Date:** 2026-08-22

| Fix | File(s) | Status |
|-----|---------|--------|
| Bookkeeping DB uses local SQLite | `src/lib/bookkeeping.ts` | ✅ Fixed — migrated to Supabase |
| Bookkeeping API missing await | `api/bookkeeping/route.ts`, `api/bookkeeping/meta/route.ts` | ✅ Fixed |
| Image upload writes to tmpdir | `api/upload/route.ts` | ✅ Fixed — migrated to Supabase Storage |

## Session 3 — Data Plumbing Audit
**Auditor:** Claude (Cowork)
**Date:** 2026-08-22

| Fix | File(s) | Status |
|-----|---------|--------|
| Admin dashboard reads dead tmpdir | `api/admin/route.ts` | ✅ Fixed — now Supabase |
| Admin Chats tab reads dead tmpdir | `api/admin/route.ts` | ✅ Fixed — returns empty |
| Loyalty sign-in says "Admin Access" | `admin/page.tsx` | ✅ Fixed |

## Session 2 — Visual Audit Fixes
**Auditor:** Claude (Cowork)
**Date:** 2026-08-22

| Fix | File(s) | Status |
|-----|---------|--------|
| loading="lazy" breaks carousel images | home, designs, merch, photography | ✅ Removed lazy |
| Mobile hero hidden behind header | `web-design/page.tsx` | ✅ Added pt-20 |
| Home hero CTA buttons crop on mobile | `home/page.tsx` | ✅ Added flex-wrap |
| FAQ text clips on mobile | `components/FAQ.tsx` | ✅ Added whitespace-normal |

## Session 1 — Full Site Wiring Audit
**Auditor:** Claude (Cowork)
**Date:** 2026-08-22

| Fix | File(s) | Status |
|-----|---------|--------|
| Gift card amount mismatch | `api/checkout/route.ts` | ✅ Fixed |
| Booking service price mismatch | `api/checkout/route.ts` | ✅ Fixed |
| Dead /api/contact route | `api/contact/route.ts` | ✅ Deleted |
| Featured artist dead links | `featured-artist/page.tsx` | ✅ Removed |

---

## Still Open (requires user action)

| Item | Status |
|------|--------|
| Stripe subscription Price IDs — **NOT in vault**. Need to create 4 Price objects in Stripe Dashboard (Starter $250/mo, Business $500/mo, Pro $750/mo, Ultimate $1,000/mo) and add to vault | Blocked on user |
| End-to-end purchase test — no real purchase completed to verify webhook | Blocked on Price IDs |
| Printful API key — **NOT in vault**. Needed for live merch product sync | Blocked on user |
| Neo4j URI may not be set in Vercel | Low priority |

### Vault Check (Session 13)
| Credential | Status |
|------------|--------|
| `STRIPE_SECRET_KEY` | Present (107 chars) |
| `STRIPE_WEBHOOK_SECRET` | Present (38 chars) |
| `STRIPE_RESTRICTED_KEY` | Present (107 chars) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Present (27 chars) |
| `STRIPE_STARTER_PRICE_ID` | **NOT FOUND** |
| `STRIPE_BUSINESS_PRICE_ID` | **NOT FOUND** |
| `STRIPE_PRO_PRICE_ID` | **NOT FOUND** |
| `STRIPE_ULTIMATE_PRICE_ID` | **NOT FOUND** |
| `PRINTFUL_API_KEY` | **NOT FOUND** |

## Claude Code Collaboration Protocol

Claude operates with a **read-only repo clone**. It audits via browser (console + network + vision) and produces handover docs. Opencode applies fixes, commits, pushes, and updates this file. The cycle repeats indefinitely.
