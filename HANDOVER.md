# WYZ Design — Handover Log

One running file, overwritten each round. Torreé relays it into the repo (Claude has read-only repo access).

## Deployment State

- **Last commit:** `5fb5d30` (HANDOVER update)
- **Build status:** `tsc --noEmit` clean
- **Vercel:** Auto-deploys from `master` branch
- **Supabase:** `form_submissions`, `bk_transactions`, `bk_clients`, `bk_categories` tables + `wyzdesign-uploads` storage bucket + `stripe_events` table

## Key Architecture Notes

- **Forms write path:** `/api/forms` POST → Supabase `form_submissions` table
- **Forms read path:** `/api/admin` GET → Supabase `form_submissions` table
- **Bookkeeping:** All tables in Supabase (bk_transactions, bk_clients, bk_categories). Seed defaults on first load.
- **Image upload:** Supabase Storage `wyzdesign-uploads` bucket (public, auto-created)
- **Admin auth:** `ADMIN_EMAILS` env var (comma-separated), checked via NextAuth session
- **HTML sanitization:** `src/lib/dompurify.ts` (isomorphic-dompurify, allowlist-based). Do NOT use regex-based alternatives.
- **Toast notifications:** `react-hot-toast` — all user-facing forms now have toast.success/toast.error

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
| Stripe subscription Price IDs — need Dashboard creation (Starter $250, Business $500, Pro $750, Ultimate $1000) | Blocked on user |
| End-to-end purchase test — no real purchase completed to verify webhook | Blocked on Price IDs |
| Printful API key not configured (degrades gracefully) | Low priority |
| Neo4j URI may not be set in Vercel | Low priority |

## Claude Code Collaboration Protocol

Claude operates with a **read-only repo clone**. It audits via browser (console + network + vision) and produces handover docs. Opencode applies fixes, commits, pushes, and updates this file. The cycle repeats indefinitely.
