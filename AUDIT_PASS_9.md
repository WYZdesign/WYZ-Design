# Audit Pass 9 — Instructions for Claude

**Date:** 2026-08-22
**Audience:** Claude (Cowork) via Chrome browser + read-only repo clone

## What's Been Fixed Since Your Last Audit

Everything in HANDOVER.md Sessions 1–4. Key new changes:
- `src/lib/bookkeeping.ts` — fully rewritten from SQLite to Supabase. All functions now async.
- `api/bookkeeping/route.ts` + `api/bookkeeping/meta/route.ts` — properly await all calls
- `api/upload/route.ts` — migrated from tmpdir to Supabase Storage (`wyzdesign-uploads` bucket)
- `HANDOVER.md` — updated with full audit history

## Your Job

Go deeper. Double-check opencode's work. Specifically:

### 1. Verify Bookkeeping Works End-to-End
- Go to https://www.wyzdesign.com/bookkeeping (or /admin → Bookkeeping tab)
- Try adding a transaction, editing it, deleting it
- Check the Summary tab — does it show correct income/expense totals?
- Try CSV export and Schedule C export
- **Important:** The Supabase tables (`bk_transactions`, `bk_clients`, `bk_categories`) need to exist. If the page 500s, the tables haven't been created yet. Report the exact error.

### 2. Verify Image Upload Works
- Go to any page with edit mode enabled (admin logged in)
- Try uploading an image via ImagePicker or EditMode
- Does it return a working URL? Does the image display?
- Check browser console for errors
- Check network tab — does the upload POST succeed? What URL does it return?

### 3. Find New Problems
- Crawl every page again. Look for:
  - Broken images, 404s, dead links
  - JavaScript errors in console
  - Network requests that fail (especially API calls)
  - UI elements that look wrong or are misaligned
  - Missing content, placeholder text, lorem ipsum
  - Forms that don't submit or submit to wrong endpoints
- Check every admin page: Bookkeeping, Users, Newsletter, Bookmarks, Chats, Loyalty, Analytics
- Check every public page: Home, Services, Web Design, Photography, Designs, Merch, Gift Card, Booking, About, Contact, FAQ, Featured Artist, Community, Loyalty

### 4. Test Stripe Checkout Again
- Try purchasing a gift card (any amount)
- Try booking a consultation
- Does the Stripe checkout session create? What error do you get?
- Check the network tab for the exact response from `/api/checkout`

### 5. Check for Code Smells
- Look at `api/` routes — any that read from `tmpdir()`, `process.cwd()`, or local filesystem?
- Look for hardcoded URLs that should be env vars
- Look for error swallowing (empty catch blocks, generic "Upload failed" messages)
- Check if any component imports something that doesn't exist

## Output Format

Produce a new handover doc (like previous sessions) with:
- Table of findings (Fix | File | Status)
- Exact error messages from console/network
- Screenshots if something looks visually wrong
- Prioritized list of what to fix next

Save it as `AUDIT_PASS_9_RESULTS.md` in the repo root, or paste it in chat for opencode to apply.
