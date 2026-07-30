/**
 * Lightweight client-side error tracker.
 *
 * Chosen over @sentry/nextjs to avoid next.config instrumentation and
 * webpack build risk on Next 16. Logs to the console and best-effort
 * POSTs to /api/telemetry which persists to Supabase (muse_error_logs).
 */

export interface TrackErrorPayload {
  message: string;
  context?: string;
}

function toMessage(err: unknown): string {
  if (err instanceof Error) return err.stack || err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/**
 * Track an error: logs to console and fires a best-effort telemetry beacon.
 * Safe to call on both client and server; never throws.
 */
export function trackError(err: unknown, context?: string): void {
  const message = toMessage(err);

  // Always log locally.
  // eslint-disable-next-line no-console
  console.error("[trackError]", context ?? "", err);

  const payload: TrackErrorPayload = { message, context };

  try {
    // Prefer sendBeacon on the client for reliability during unloads.
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/telemetry", blob);
      return;
    }

    if (typeof fetch === "function") {
      void fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        /* swallow — telemetry must never break the app */
      });
    }
  } catch {
    /* swallow — telemetry must never break the app */
  }
}

export interface TrackEventPayload {
  name: string;
  props?: Record<string, unknown>;
}

/**
 * Track a product/analytics event. Reuses the /api/telemetry sink
 * (best-effort, never throws). Use for signup, match, message, etc.
 */
export function trackEvent(name: string, props?: Record<string, unknown>): void {
  const payload: TrackEventPayload = { name, props };
  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/event", blob);
      return;
    }
    if (typeof fetch === "function") {
      void fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* swallow */
  }
}
