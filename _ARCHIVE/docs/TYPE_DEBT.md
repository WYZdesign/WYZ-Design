# WYZ Design — Explicit `any` Type Debt Inventory (board task 25)

**Date:** 2026-10-04 · **Owner:** WYZMiND · **Method:** AST-position regex scan of `src/**/*.ts(x)` for type-position `any` only (`: any`, `as any`, `<any>`, `any[]`, `Record<..., any>`, `Promise<any>`). Prose/JSX-text false positives excluded. Raw evidence: `_any_scan_raw.txt` (85 loose hits) refined to this file's 38 real hits across 18 files.

**Headline:** 38 real hits in 18 files. The booking-critical Cal.com bridge (board task 19) is already fixed and no longer appears. None of these break the build today; all are type-safety gaps that can be closed in mechanical, runtime-neutral passes.

---

## File-level inventory

| Tier | File | Hits | Lines | Kind |
|------|------|-----:|-------|------|
| 1 | `src/lib/wyzmind.ts` | 7 | 125, 127, 182, 191, 233, 303, 327 | Supabase row mappers (`datum(row: any): any`), role/points casts |
| 1 | `src/lib/bookkeeping.ts` | 5 | 136, 152, 153, 179, 268 | bk_* row mapping, `Record<string, any>` update bag |
| 2 | `src/app/splash-showcase/page.tsx` | 2 | 34, 35 | `DeviceOrientationEvent as any` iOS permission |
| 2 | `src/app/web-design/page.tsx` | 2 | 115, 116 | same iOS permission hack |
| 2 | `src/hooks/useGyroscope.ts` | 2 | 28, 30 | same |
| 2 | `src/hooks/useGyroPermission.ts` | 1 | 22 | same |
| 2 | `src/components/ErrorBoundary.tsx` | 2 | 23, 24 | `(window as any).Sentry` |
| 2 | `src/components/SentryErrorBoundary.tsx` | 2 | 23, 24 | same (duplicate component) |
| 2 | `src/components/AnalyticsProvider.tsx` | 2 | 137, 149 | `(window as any).fbq` / `ttq` |
| 2 | `src/app/admin/page.tsx` | 2 | 70, 1172 | `useState<any>` data/health |
| 2 | `src/app/api/fd/drive/route.ts` | 2 | 55, 74 | `(f: any)` row map, `catch (err: any)` |
| 3 | `src/components/DynamicForm.tsx` | 1 | 125 | `catch (err: any)` |
| 3 | `src/app/api/admin/route.ts` | 1 | 32 | `(r: any)` row map |
| 3 | `src/app/api/album-images/route.ts` | 1 | 23 | `fetch(...) as any` (Next revalidate option) |
| 3 | `src/lib/rate-limit-redis.ts` | 2 | 3, 9 | lazy ioredis `let redis: any` |
| 3 | `src/lib/stripe.ts` | 1 | 10 | `apiVersion: "..." as any` |
| 3 | `src/lib/supabase.ts` | 1 | 20 | proxy `as any` passthrough |
| 3 | `src/components/SplashVariants.tsx` | 2 | 262, 392 | `useRef<any[]>` particle arrays |
| **0** | ~~`src/app/booking/page.tsx`~~ | ~~3~~ | — | **DONE (task 19): `CalStub`/`CalNamespaceStub` interfaces** |

---

## Low-risk replacement plan

**Ground rules for every pass:** runtime-identical output (types only), `npx tsc --noEmit` + `npm run build` + `npm run test:run` + `npm run lint` green after each tier, one bundled push per tier (bundling rule), no behavior changes hidden inside type edits.

### Tier 1 — shared data layer (highest value, needs payload-verified interfaces)
1. `wyzmind.ts`: replace `datum(row: any): any` with a `Record<string, unknown>` base + per-endpoint interfaces built from the actual Supabase column names already read in the file (`role`, `points`, `tier`, `joined`, `email`, `subscribed_at`). Role check becomes a typed guard instead of `(data as any)?.role`.
2. `bookkeeping.ts`: define `BkClient`, `BkCategory`, `BkTxnRow` from the SELECTs in the same file; replace the `Record<string, any>` update bag with `Record<string, string | number | null>`.
3. Verify by running the affected admin/bookkeeping views locally (read-only screens).

### Tier 2 — platform/global hacks (mechanical, one shared helper each)
4. iOS gyroscope: one helper `src/lib/device-orientation.ts` exporting `DeviceOrientationEventCtor` (optional `requestPermission`) and a `requestGyroPermission()` function; migrate all 7 sites (4 files) to it.
5. Window globals: one `src/lib/globals.d.ts` with `declare global` for `Window.Sentry?`, `Window.fbq?`, `Window.ttq?`; delete all `(window as any)` casts (6 hits, 3 files).
6. `catch (err: any)` → `catch (err: unknown)` + `err instanceof Error ? err.message : String(err)` (2 sites: fd/drive, DynamicForm).
7. `admin/page.tsx` `useState<any>` → minimal `AdminData`/`AdminHealth` interfaces from the fetch handlers that produce them.

### Tier 3 — library wrappers (small, slightly more care)
8. `rate-limit-redis.ts`: typed lazy import (`typeof import("ioredis")`, instance via `Redis.default` typing).
9. `stripe.ts`: align `apiVersion` literal with the installed `stripe` SDK's type (drop `as any` only if the SDK accepts it; otherwise pin SDK bump as separate decision).
10. `album-images` `fetch(...) as any`: use Next's documented `next: { revalidate }` typing (`RequestInit` augmentation) instead of the cast.
11. `supabase.ts` proxy: retype passthrough as `unknown` + call-site narrowing, OR keep as a documented single exception (proxy typing is the one place `unknown` can cascade).
12. `SplashVariants` particle refs: `useRef<Particle[]>` with the local particle shape already defined in-file.

### Explicitly out of scope
- `window.fbq/ttq`, Sentry, and DeviceOrientation runtime behavior (shims stay, only their types get honest).
- Test files (none currently use `any` in type positions).
- Any `// eslint-disable` suppression sites (none found).

**Recommended batching:** Tier 2 in one push (purely mechanical, zero payload risk), Tier 1 in a second push (interface-building, needs one local verification pass), Tier 3 folded into whichever push touches those files next.
