# Admin panel deep pass — padding/jargon/missed-features — 2026-10-30

Follow-up to the same-day audit (`HANDOVER_ADMIN_PANEL_AUDIT_2026-10-30.md`). Torreé asked to go deeper: fix layout/spacing on desktop and mobile, make every data point "normie friendly," and surface any backend/logistics features that exist in the codebase but aren't visible in the admin panel, with any new tool recommendations kept open-source. Same standing rules as always — no git actions, no credentials touched, every edit verified with `tsc`/`eslint` before being called done.

## Layout/spacing fixes

### 1. Admin panel was wearing the public site's Navbar and Footer on top of its own

`/admin` had no `layout.tsx` of its own, so it fell through to the root layout and got the full public `<Navbar/>` stacked above its own header, and the full public `<Footer/>` (newsletter signup, social links, sitemap) stacked below its own content — on a page that already has its own header and sidebar nav. On mobile this ate a large chunk of the screen for nothing; on both sizes it put two unrelated nav systems on screen together. It wasn't just visual waste either — I kept mis-clicking the wrong hamburger button and the wrong sidebar while testing, because both the site's mobile menu and the admin's own menu use the same generic markup and were both present at once.

Fixed by extracting a small client component, `AppShell.tsx`, that checks the URL and skips the public Navbar/Footer/CartButton entirely when the path starts with `/admin`. `layout.tsx` now renders through that instead of the chrome directly.

**Files:** `src/components/AppShell.tsx` (new), `src/app/layout.tsx`. **Needs a deploy to take effect** — I can't verify this one live until it ships, since it changes server-rendered layout.

### 2. Admin dashboard title was rendering at the wrong size, truncating on mobile

The main panel title ("OVERVIEW", "GROWTH", etc.) was truncating to "OVERV…" on phone width. Checked the actual rendered font size with `getComputedStyle` and it came back **34px** — the admin's own styling calls for **15px**. Root cause: a sitewide CSS rule meant for marketing-page headlines (`h1 { font-size: ... !important }`) applies to any `<h1>` anywhere, including this one, and it was winning over the admin's own `!important` rule purely because of where it sits in the stylesheet. Confirmed this wasn't mobile-only — same wrong size at both phone and desktop widths.

Fixed without touching the shared marketing CSS (editing that risks changing dozens of other pages) — just changed this one title from an `<h1>` tag to a `<div role="heading" aria-level={1}>`, which reads identically to screen readers but isn't caught by the global rule.

**File:** `src/app/admin/page.tsx`

### 3. Section headers were being force-centered

Headers like "Form Submissions by Type" and "Recent Submissions" were rendering centered instead of left-aligned, which looks off in a dashboard. Same root cause as #2 — a sitewide rule centers every heading tag. Added a left-align override to the shared section-title component and to standalone headers that don't use it, instead of touching the global rule.

**Files:** `src/components/admin/AdminShared.tsx` (the shared `SectionTitle` used everywhere), `src/components/admin/AdminFinanceTabs.tsx`, `src/components/admin/AdminManageTabs.tsx`, `src/components/admin/AdminProfileTab.tsx`

## Plain-language fixes ("normie friendly")

Went through every KPI label looking for anything a non-technical person would have to guess at, and added hover tooltips (title="..." attributes — no new UI, just hover-and-read) where the label alone doesn't say what it means:

- **Bounce Rate** — "Share of visitors who left after viewing only one page"
- **Pages/Session** — "Average number of pages a visitor looks at before leaving"
- **Schedule C** (the tax-export button) — relabeled to "Schedule C (tax form)" so it's clear what kind of document it is without needing to already know IRS form names

Added the underlying mechanism (an optional `hint` prop) to the shared `KpiCard` component so any other metric can get the same treatment going forward with a one-line change.

Left "Unique Visitors," "Unique Pages," and "Avg Duration" as-is — on reflection those are plain English already and a tooltip would be clutter, not help.

**Files:** `src/components/admin/AdminShared.tsx` (the `hint` prop), `src/components/admin/AdminGrowthTabs.tsx`, `src/components/admin/AdminFinanceTabs.tsx`

## Backend/logistics features that exist but aren't visible in the admin panel

Went through every route under `src/app/api/` to find real, running functionality that doesn't show up anywhere in the dashboard's nav. This is a "what you have that you might not know you have" list, not a to-do list — I didn't build anything new here, just reporting what's already live.

**Running automation you can't currently see the status of:**
- Three scheduled jobs run on their own on Vercel's cron system: a day-before booking reminder email, an abandoned-checkout/gift-card-reservation cleanup, and a staged delivery-outreach drip email campaign. All three are real, currently running, and have zero visibility in the admin panel — no way to tell if the last run succeeded, failed, or when it last fired.
- There's an error/event log (`muse_error_logs`, `muse_events_log` in the database) that the backend writes to, with no admin screen reading it back. Right now the only way to see if something broke in the backend is to go look at the raw database.

**Integrations already in use with no admin-panel visibility (these are already paid-for and working — not suggesting you replace any of them, just flagging that you can't see their status from the dashboard):**
- **Stripe** — all payments, checkout, and order records flow through it; no order list/status view in admin.
- **Printful** — merch orders are auto-placed with Printful via webhook when a customer checks out (real print-on-demand fulfillment happening automatically); no view into fulfillment status.
- **Google Drive** — the photo/model galleries on the site are pulled live from a specific Google Drive folder, not stored in your own database; no admin view of what's in that folder or how it's organized.

**Other systems with partial or no admin coverage:**
- **Gift cards** — there's a full gift-card ledger system in the database; worth checking whether the admin panel's gift-card view (if any) is actually reading the real balances.
- **Referral program** and **loyalty/points ("zeal") system** — both have working backend routes; neither has a dedicated admin screen to see who's referred whom or who's earned what.
- **AI concept-generator tool** — there's a working route that calls an AI service (OpenRouter) to generate design concepts; no usage tracking visible in admin (useful to know if you're being billed per call and want to see how often it's used).

One correction from my first look: I initially thought `/api/pages` was a live content-editor nobody was using. On closer reading it's not that — it's a one-time static-export generator for migrating pages to a different platform. Not a missed feature, just not something that needs admin surfacing.

**If you want to close any of these gaps** (per your "all open source" note — this applies to any *new* tool I'd be suggesting, not the paid tools above, which stay as-is):
- For the missing cron-job/error-log visibility, the simplest fix doesn't need a new tool at all — just a new admin tab reading the existing `muse_error_logs`/`muse_events_log` tables and each cron job's last-run timestamp, which are already being written.
- If you ever want proper uptime/error alerting beyond what's in the dashboard, open-source options like **Sentry (self-hosted)** or **GlitchTip** (a lighter open-source Sentry-compatible alternative) are worth a look — but again, nothing here requires that; the data you already have could just get its own admin tab.

## Verification

- `npx tsc --noEmit` — clean across the whole tree after every edit in this pass.
- `npx eslint` — clean, run per-file on every touched file (`AdminGrowthTabs.tsx`, `AdminShared.tsx`, `AdminFinanceTabs.tsx`, `AdminManageTabs.tsx`, `AdminProfileTab.tsx`, `admin/page.tsx`, `layout.tsx`, `AppShell.tsx`).
- Confirmed the h1-size bug and the centered-heading bug live via `getComputedStyle` before fixing (34px vs. intended 15px; `text-align: center` vs. intended left).
- The AppShell chrome fix is a layout-level change and needs a deploy to verify live — not yet tested on the live site.

## Not done, by design

No git actions (add/commit/push), no credential retrieval, no new accounts or tools actually installed — the open-source suggestions above are just that, suggestions, not changes I made.
