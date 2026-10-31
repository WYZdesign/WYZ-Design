# Outstanding tasks completed + production outage (2026-10-31)

## URGENT: all Vercel projects are returning HTTP 402

Symptom: `https://www.wyzdesign.com` (and `wyzdesign.com`, the preview URLs, `tracysla.vercel.app`, `muse.wyzdesign.com`) return:

```
HTTP/1.1 402 Payment Required
X-Vercel-Error: DEPLOYMENT_DISABLED
```

Root cause, read from the Vercel API with the stored token:

```
team:      team_JGtMzamqN3UGKwL50pboI6I3 ("WYZ Design")
plan:      pro (pro / plus)
billing:   status = "overdue"
softBlock: { "reason": "UNPAID_INVOICE", "blockedAt": 1793434063071 }
blockedAt: 2026-10-31T08:07:43Z
```

The project itself is not paused (`paused: false`) and the latest deployment is `READY` and promoted with the production aliases. The block is account-wide, triggered by the unpaid invoice.

**Fix (owner action, cannot be done from code):**
1. Open https://vercel.com/wyzdesigns-projects/~/settings/billing
2. Pay the overdue invoice / update the payment method.
3. Soft blocks usually clear within minutes of payment. No redeploy is needed; the latest commit is already READY and aliased.

Until then every project on the account is offline regardless of code state.

## What shipped this session (committed + pushed)

| Commit | Contents |
|---|---|
| `baf83ac` | Removed the dead `/fd` route + exclusive components/data and unused `contrast.ts`; `.gitignore` for scratch dirs. `/fd` 308 redirect and `/api/fd/oracle` kept. |
| `7edcb85` | Claude's three rounds: count-up stats, grayscale logo hover, admin panel fixes (recent submissions, literal arrow escapes, Traffic race crash, real DB/Analytics indicators), admin chrome isolation via `AppShell`. |
| `6a5f189` | Durable 30-day analytics, admin Automations + Integrations tab, cron heartbeats, merch "You might also like", crown cursor, booking confetti. |
| this commit | Light-mode contrast fixes (see below) + this handover. |

### 1. Analytics 30-day history (real bug, fixed)

`logPageview` wrote each pageview with a **24h TTL**, so a 30-day summary could never contain history. `getAnalyticsSummary` also scanned every pageview key per day (`KEYS` + `GET` per key), which would be expensive at volume.

Now:
- Pageviews still stored raw (`analytics:pv:<date>:<ts>`) but with a **40-day** TTL.
- Plus a durable daily rollup hash `analytics:day:<date>` written with `HINCRBY` (views, per-path views and duration sums, referrers, UTM, device/browser/os, per-session counts) and a HyperLogLog `analytics:uniq:<date>` for visitors. 40-day TTL.
- `getAnalyticsSummary` reads 30 hashes + 30 PFCOUNTs (about 60 Redis ops) instead of scanning thousands of keys.
- `RedisLike` in `src/lib/wyzmind.ts` gained `hincrby`, `hgetall`, `expire`, `pfadd`, `pfcount` (both Upstash and ioredis).

Note: analytics only records after a visitor grants analytics consent (`wyz_cookie_consent`), so "0 pageviews" may also be genuine on low-consent traffic. The structural TTL bug is what is fixed here; real history starts building from this deploy.

### 2. Admin Automations + Integrations tab

- New `src/lib/cron-heartbeat.ts`: `CRON_JOBS`, `markCronRun`, `getCronStatus`, `getIntegrationStatus`. Last run + ok/fail stored in Redis (`cron:last:<id>`, 14-day TTL).
- Heartbeats wired into `/api/health` (only when `x-vercel-cron` is present, so a human opening Health can't fake it), `/api/cron/booking-whatsnext`, `/api/cron/cleanup-orders`, `/api/cron/delivery-outreach`, success and failure paths.
- New `GET /api/admin?tab=automations` (admin-only) returns job status (ok / failed / stale / never, with age) and integration presence (Stripe, Printful, Resend, Drive, Supabase, Upstash, OpenRouter, Discord). Booleans only, no values.
- New **Automations** tab under SYSTEM; **Health** now shows a real "Automations n/m" tile instead of the hardcoded "Vault Locked" indicator.

### 3. Merch "You might also like"

`/merch/[id]` now renders up to 4 related products from the existing Printful catalog, same category first, with images and prices.

### 4. Crown cursor

`CustomCursor` now renders a small crown glyph inside the existing gold ring, sized with the ring and tinted with the same contrast colour. Still touch-disabled and fully disabled under `prefers-reduced-motion`.

### 5. Booking confetti

New `ConfettiBurst` (dependency-free, `aria-hidden`, pointer-events none, reduced-motion no-op). Fires once per session on booking success.

### 6. Light-mode contrast (measured, not guessed)

Computed WCAG contrast on 9 routes via the browser. Most flags were white text over images. Two real failures fixed:
- `Printed to order` 9px `#999` on `#FEFEFD` (2.82:1) -> `#6B6B6B` / `#A8A8A8` dark.
- Merch hero label `Dying Breed Crew` computed `#C00000` on `#111` (2.91:1). Cause: the global small-red accessibility rule swaps `text-[#DF3131]` to `#C00000`, which is tuned for white. Added an explicit `.wz-on-dark` opt-out using `#FF5252` (~5.9:1) and applied it to that label.

## Verification

- `npx tsc --noEmit` clean, `npx eslint src/` 0 problems, `npm run build` exit 0 (run after each batch).
- `6a5f189` was confirmed `READY` + aliased before the billing block hit.
- Live checks before the block: `/api/health` 200 with `redis: ok`, `/api/admin?tab=automations` correctly 403 unauthenticated, related-products strip rendered with loaded images, crown SVG present on desktop.
- Could NOT verify the authenticated admin Automations data: the stored admin credential returns "Invalid email or admin key" (`wyzdesign_ADMIN_PASSWORD` in the vault is stale). Update the vault with the current Admin Key to enable that check.

## Still open

- Vercel unpaid invoice (above) — owner action.
- Admin vault password is stale.
- Analytics history starts from this deploy; prior 30 days are unrecoverable.
- Ideas not built (need a decision): light-mode pass on remaining decorative surfaces, "recently viewed" on merch, deeper admin views for Stripe orders / Printful fulfillment / gift cards / referrals / zeal.
