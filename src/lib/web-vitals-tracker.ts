/**
 * Web vitals bridge — WYZ Design
 * Sends CLS, FID, FCP, LCP, TTFB metrics to Redis via the analytics API.
 * Imported once in root layout; runs client-side only.
 */

import { useEffect } from "react";
// 2026-10-27 (Claude): removed an unused `import { logEvent } from
// "./analytics"` that was failing lint (no-unused-vars) -- logEvent is a
// server-only helper (calls the server Redis client directly), so it was
// never callable from this client component anyway; sendMetric below
// already does the right thing by POSTing to /api/analytics instead,
// which runs logEvent server-side on the API route.

function sendMetric(metric: string, value: number) {
  if (typeof window === "undefined") return;
  try {
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: "web_vital",
        path: window.location.pathname,
        label: metric,
        value: Math.round(value),
        metadata: JSON.stringify({ rating: value }),
        session_id: window.sessionStorage.getItem("wyz_session_id"),
      }),
      keepalive: true,
    }).catch(() => void 0);
  } catch { /* noop */ }
}

export function WebVitalsTracker() {
  if (typeof window === "undefined") return null;

  useEffect(() => {
    // Session id for analytics correlation
    if (!window.sessionStorage.getItem("wyz_session_id")) {
      window.sessionStorage.setItem(
        "wyz_session_id",
        `${Math.random().toString(36).slice(2)}-${Date.now()}`,
      );
    }

    // 2026-10-27 (Claude): the `web-vitals` package isn't installed yet
    // (confirmed: not in package.json, not in node_modules -- `npx tsc`
    // fails on the sibling module that imported it the same way). This
    // dynamic import will reject until someone runs
    // `npm install web-vitals`, so it's wrapped in a .catch() to fail
    // silently instead of leaving an unhandled promise rejection on every
    // page load (which could show up as noise in error tracking). Also
    // switched the callback names from the old v1/v2 API (getFCP, getLCP,
    // getFID, getCLS, getTTFB) to the current v3/v4 API (onFCP, onLCP,
    // onFID, onCLS, onTTFB, onINP) -- the "get*" names were removed years
    // ago, so whatever version actually gets installed here will only
    // export "on*", and the old names would have silently done nothing
    // even once the package existed.
    import("web-vitals").then((m) => {
      const entries: Array<{ name: string; value: number }> = [];
      const push = (n: string, v: number) => {
        entries.push({ name: n, value: v });
        sendMetric(n, v);
      };

      // 2026-10-27 (web-vitals v6): no onFID export -- FID was retired from
      // the library in favor of INP, which is tracked below.
      if (m.onFCP) m.onFCP((e: any) => push("FCP", e.value));
      if (m.onLCP) m.onLCP((e: any) => push("LCP", e.value));
      if (m.onCLS) m.onCLS((e: any) => push("CLS", e.value));
      if (m.onTTFB) m.onTTFB((e: any) => push("TTFB", e.value));
      if (m.onINP) m.onINP((e: any) => push("INP", e.value));
    }).catch(() => {
      // web-vitals not installed yet -- no-op until it is.
    });
  }, []);

  return null;
}