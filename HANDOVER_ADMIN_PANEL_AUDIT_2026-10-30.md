# Admin panel audit — 2026-10-30

Torreé logged me into the live admin panel (`www.wyzdesign.com/admin`) and asked for a full audit. Went through every tab (Overview, Bookkeeping/Income/Expenses/Reports, Analytics/SEO/Traffic, Forms/Users/Newsletter/Chats/Content, Health/Export/Profile/Bug Report). Found and fixed four real bugs, flagged one thing worth a follow-up look. No git actions taken, no credentials touched — same standing instructions as every other round.

## 1. Fixed: Overview tab's "Recent Submissions" table always showed empty, even with real data

`AdminOverviewTab.tsx` read `s.recentForms` (`s` being `data.stats`), but `/api/admin` (`route.ts`) actually returns `recentForms` as a **sibling** of `stats`, not nested inside it — so the lookup was always `undefined` and the table always rendered "No recent submissions," regardless of how many forms came in. Confirmed live: the API genuinely has 5 real submissions (4 contact, 1 booking) while the UI showed none.

There was a second, compounding mismatch once the first one's fixed: the API's form objects use camelCase (`formType`, `submittedAt`), but the table's row renderer expected snake_case (`form_type`, `created_at`), so even reading the right array would have rendered blank cells.

Fixed both: `recentForms` is now read off `data` (not `data.stats`), and the table/type definitions use the real camelCase field names.

**Files:** `src/lib/types/admin.ts`, `src/components/admin/AdminOverviewTab.tsx`

## 2. Fixed: 9 spots showing literal `←`/`↓` text instead of arrows

Several admin buttons and the "back to site" link were typed as literal JSX text `←`/`↓` instead of actual arrow characters — JSX doesn't interpret backslash-escapes in plain text, so the page rendered the literal string `← Site` and `↓ Export CSV` instead of `← Site` / `↓ Export CSV`. Reproduced live on Bookkeeping, Reports, and the page header. Replaced all 9 occurrences with the real `←`/`↓` characters.

**Files:** `src/app/admin/page.tsx` (1), `src/components/admin/AdminFinanceTabs.tsx` (7), `src/components/admin/AdminManageTabs.tsx` (1)

## 3. Fixed: Growth → Traffic tab crashes with "Cannot read properties of undefined (reading 'toLocaleString')"

Reproduced live: open Growth → SEO, then click Growth → Traffic right after — the page throws and shows the "ADMIN ERROR" screen.

Root cause: in `admin/page.tsx`, `setTab(newTab)` triggers an immediate re-render on the new tab, but the `useEffect([status, tab])` that calls `fetchTab()` (and flips `loading` back to `true`) only runs *after* that render. For one frame, `tab === "traffic"` while `data`/`loading` are still holdovers from whatever tab you were just on. SEO's response shape (`{checks, checkedAt, period}`) is different from the analytics-summary shape Traffic expects (`{total_pageviews, unique_visitors, ...}`) — but both have a `period` field, so `TrafficTab`'s `if (!data?.period) return <Empty>` guard doesn't catch it. It falls through to `<KpiCard value={data.total_pageviews} .../>`, `data.total_pageviews` is `undefined`, and `undefined.toLocaleString()` throws.

Fixed by clearing `data` and setting `loading` synchronously in the same click handler that changes tabs, so that stale-shape frame can never render — the loader shows instead until the new tab's fetch resolves.

**File:** `src/app/admin/page.tsx` (the sidebar nav button's `onClick`)

## 4. Fixed: Health tab's "DB Connected" and "Analytics Active" indicators were hardcoded, not real checks

`HealthTab` in `AdminSystemTabs.tsx` only wired up "API Status" to the real `/api/health` response (`health?.status`). "DB Connected" and "Analytics Active" were hardcoded to always render green with a checkmark — they never looked at `health` at all. `/api/health` already computes a real `redis: "ok" | "down"` signal via `checkRedisHealth()` (Redis/Upstash backs rate limiting, zeal cooldowns, and analytics per the comment in `wyzmind.ts`), the component was just discarding it. Wired both indicators to that real signal, so the dashboard can actually go red if Redis goes down instead of always showing healthy.

Left "Vault Locked" alone — it's a separate, still-hardcoded amber indicator with no real backing signal available from `/api/health`, and wiring it up for real needs an actual vault-status check, which is out of scope for this pass. Flagging it as the same class of issue in case it's worth a follow-up.

**File:** `src/components/admin/AdminSystemTabs.tsx`

## 5. Flagged, not fixed: Growth → Analytics/Traffic shows 0 pageviews across all 30 days

`/api/analytics?tab=analytics&days=30` returns all-zero (`total_pageviews: 0`, etc.) despite the site clearly having real visitors (5 real form submissions exist). Checked `/api/health` directly — Redis is genuinely connected (`"redis":"ok"`), so this isn't a missing-Upstash-config issue.

Two real candidates, and I didn't want to write a synthetic pageview into production to disambiguate further (that's a live-data write, out of scope for me to decide on my own):

- Pageviews are stored in Redis with a **24-hour TTL** (`setex(key, 86400, ...)` in `src/lib/analytics.ts`). A "30-day" summary is structurally incapable of showing real history beyond the last day — only today's writes (if any landed in the current UTC-day bucket) would ever be readable. If this is a low-traffic site, "zero in the last 24h" may just be real.
- Or there's a key-matching bug between how `logPageview` writes (`analytics:pv:<today>:<ts>`) and how `getAnalyticsSummary` scans (`r.keys('analytics:pv:<day>:*')` per day in range) — Upstash's REST `KEYS` command can behave differently from a local Redis `KEYS`, and I didn't verify a live round-trip (write-then-read) because that write is exactly the kind of production side effect I shouldn't make unilaterally.

Worth a look, but I'm flagging it rather than guessing at a fix.

## Verification

- `npx tsc --noEmit` — clean on every file touched.
- `npx eslint` — clean on every file touched (ran per-file since a full-tree run kept timing out on this box, not because of errors).
- Reproduced the Overview/Recent-Submissions bug and the Traffic-tab crash live before fixing, confirmed the literal-escape-sequence bug live on Bookkeeping/Reports.
- Did not test the Traffic-tab race-condition fix live, since it requires a deploy to take effect (the live site is still on `dce433c`).
- Did not write a synthetic pageview to test item 5, per standing instructions not to make production writes outside what I'm asked to do.

## Not done, by design

No git actions (add/commit/push), no credential retrieval, no login attempts beyond the session Torreé provided by signing in himself.
