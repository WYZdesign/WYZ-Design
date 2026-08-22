# WYZ Design — Handover Log

## Session Summary

### Session 4 — Bookkeeping DB + Upload Fix (Handover #8)
**Auditor:** Claude (Cowork), code review + live testing
**Date:** 2026-08-22

**Findings & Fixes Applied (by opencode):**

| Fix | File(s) | Status |
|-----|---------|--------|
| Bookkeeping DB uses local SQLite (`better-sqlite3`) — won't persist on Vercel serverless | `src/lib/bookkeeping.ts` | ✅ Fixed — migrated to Supabase (bk_transactions, bk_clients, bk_categories tables) |
| Bookkeeping API routes call now-async functions without `await` | `api/bookkeeping/route.ts`, `api/bookkeeping/meta/route.ts` | ✅ Fixed — all calls properly awaited |
| Inline image upload writes to `tmpdir()` — ephemeral on Vercel, no serve route | `api/upload/route.ts` | ✅ Fixed — migrated to Supabase Storage (`wyzdesign-uploads` bucket, auto-created) |

**Supabase Schema (run once in SQL Editor):**
```sql
-- Bookkeeping tables
CREATE TABLE IF NOT EXISTS bk_clients (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL UNIQUE, email TEXT DEFAULT '', notes TEXT DEFAULT '', created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS bk_categories (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL UNIQUE, schedule_c_line TEXT DEFAULT '', type TEXT DEFAULT 'expense');
CREATE TABLE IF NOT EXISTS bk_transactions (id BIGSERIAL PRIMARY KEY, date TEXT NOT NULL, type TEXT NOT NULL CHECK(type IN ('income','expense')), amount NUMERIC NOT NULL, client_id BIGINT REFERENCES bk_clients(id), vendor TEXT DEFAULT '', category_id BIGINT REFERENCES bk_categories(id), channel TEXT DEFAULT '', description TEXT DEFAULT '', business_personal TEXT DEFAULT 'business' CHECK(business_personal IN ('business','personal')), receipt_url TEXT DEFAULT '', created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_bk_tx_date ON bk_transactions(date);
CREATE INDEX IF NOT EXISTS idx_bk_tx_type ON bk_transactions(type);
CREATE INDEX IF NOT EXISTS idx_bk_tx_cat ON bk_transactions(category_id);
```
Also: ensure `wyzdesign-uploads` bucket exists in Supabase Storage (the upload route auto-creates it on first use).

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
- `STRIPE_WEBHOOK_SECRET` — verify it's set in Vercel env vars
- Printful API key not configured in Vercel (degrades gracefully to static fallback)
- Neo4j URI env var may not be set in Vercel (Users/Newsletter tabs silently empty)

---

## Deployment State

- **Last commit:** Session 4 bookkeeping + upload fixes (pending)
- **Build status:** tsc clean, `next build` clean
- **Vercel:** Auto-deploys from `master` branch
- **Supabase:** `form_submissions`, `bk_transactions`, `bk_clients`, `bk_categories` tables + `wyzdesign-uploads` storage bucket

## Key Architecture Notes

- **Forms write path:** `/api/forms` POST → Supabase `form_submissions` table
- **Forms read path:** `/api/admin` GET → Supabase `form_submissions` table
- **Bookkeeping:** All tables in Supabase (bk_transactions, bk_clients, bk_categories). Seed defaults on first load.
- **Image upload:** Supabase Storage `wyzdesign-uploads` bucket (public, auto-created)
- **Admin auth:** `ADMIN_EMAILS` env var (comma-separated), checked via NextAuth session
- **Chat persistence:** None — `/api/chat` is stateless (OpenRouter proxy, no save step)

## Claude Code Collaboration Protocol

Claude operates with a **read-only repo clone**. It audits via browser (console + network + vision) and produces handover docs. Opencode applies fixes, commits, pushes, and updates this file. The cycle repeats indefinitely.
