# WYZ Design — Handover Log

## Session Summary

### Session 1 — Full Site Wiring Audit (Handover #6)
**Auditor:** Claude (Cowork), read-only browser + repo clone
**Date:** 2026-08-22

**Findings & Fixes Applied (by opencode):**

| Fix | File(s) | Status |
|-----|---------|--------|
| Gift card amount mismatch (frontend $25/50/100/150/250 vs backend $10/25/50/100/200/500) | `api/checkout/route.ts` | ✅ Fixed — backend now matches frontend |
| Booking service price/name mismatch (substring + cents vs dollars) | `api/checkout/route.ts` | ✅ Fixed — exact key match, dollar values |
| Dead `/api/contact` route (writes to ephemeral tmpdir, nothing calls it) | `api/contact/route.ts` | ✅ Deleted |
| Featured artist dead links (empty href, # placeholders) | `featured-artist/page.tsx` | ✅ Removed dead buttons/icons |
| Dead test for removed contact route | `api/api.test.ts` | ✅ Removed test block |

**Still Open (requires user action):**
- Stripe 500 error — API key validity, account restrictions, or Vercel function logs need checking

---

### Session 2 — Visual Audit Fixes (Handover #5)
**Auditor:** Claude (Cowork), browser visual sweep
**Date:** 2026-08-22

**Findings & Fixes Applied:**

| Fix | File(s) | Status |
|-----|---------|--------|
| `loading="lazy"` breaks images in JS-transform carousels | `home/page.tsx`, `designs/page.tsx`, `merch/page.tsx`, `photography/page.tsx` | ✅ Removed lazy from carousel tracks |
| Mobile hero "WEBSITES" hidden behind fixed header | `web-design/page.tsx` | ✅ Added pt-20 to mobile wrapper |
| Home hero CTA buttons crop on mobile | `home/page.tsx` | ✅ Added flex-wrap |
| FAQ question text clips on mobile | `components/FAQ.tsx` | ✅ Added whitespace-normal |
| TED___SYLVIA.jpg broken | `public/images/models/` | ✅ False alarm — file is valid JPEG |

---

### Session 3 — Data Plumbing Audit (Handover #7)
**Auditor:** Claude (Cowork), code review + live testing
**Date:** 2026-08-22

**Findings & Fixes Applied (by opencode):**

| Fix | File(s) | Status |
|-----|---------|--------|
| Admin dashboard reads forms from dead tmpdir file instead of Supabase | `api/admin/route.ts` | ✅ Fixed — now queries `form_submissions` table |
| Admin Chats tab reads from dead tmpdir file (no persistence exists) | `api/admin/route.ts` | ✅ Fixed — returns empty with note |
| `/loyalty` sign-in says "Admin Access" | `admin/page.tsx` | ✅ Fixed — heading now "Sign In", subtitle updated |

**Still Open (code-level, needs decision or more work):**
- Inline image upload writes to tmpdir (no serve route, no persistence) — needs real object storage (Vercel Blob / Supabase Storage)
- Printful API key not configured in Vercel (degrades gracefully to static fallback)
- Neo4j URI env var may not be set in Vercel (Users/Newsletter tabs silently empty)
- Stripe 500 error (from Session 1) — still top blocker for checkout

---

## Deployment State

- **Last commit:** Session 3 data plumbing fixes (`926d488` → pending commit)
- **Build status:** tsc clean, `next build` clean
- **Vercel:** Auto-deploys from `master` branch
- **Supabase:** `form_submissions` table — all forms write here, admin now reads here

## Key Architecture Notes

- **Forms write path:** `/api/forms` POST → Supabase `form_submissions` table
- **Forms read path:** `/api/admin` GET → Supabase `form_submissions` table (fixed in Session 3)
- **Admin auth:** `ADMIN_EMAILS` env var (comma-separated), checked via NextAuth session
- **Chat persistence:** None — `/api/chat` is stateless (OpenRouter proxy, no save step)
- **Image upload:** Writes to `tmpdir()/uploads/` (ephemeral on Vercel, no serve route)
