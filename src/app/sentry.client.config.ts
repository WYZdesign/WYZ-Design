"use client";

import * as Sentry from "@sentry/nextjs";

if (process.env.NODE_ENV === "production") {
  const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 1.0,
      debug: false,
      integrations: [
        Sentry.dedupeIntegration(),
        Sentry.inboundFiltersIntegration(),
        Sentry.functionToStringIntegration(),
      ],
      beforeSend(event, hint) {
        if (event.exception) {
          const error = hint.originalException;
          if (error instanceof Error) {
            if (error.message.includes("NEXT_REDIRECT")) return null;
            if (error.message.includes("ECONNREFUSED")) return null;
            if (error.message.includes("timeout")) return null;
          }
        }
        return event;
      },
      ignoreErrors: [
        "NEXT_REDIRECT",
        "ChunkLoadError",
        "Loading chunk",
        "hydration",
        "ResizeObserver loop",
        "Non-Error promise rejection captured",
      ],
    });

    if (typeof window !== "undefined") {
      window.onerror = (message, source, lineno, colno, error) => {
        Sentry.captureException(error || new Error(String(message)));
      };
      window.onunhandledrejection = (event) => {
        Sentry.captureException(event.reason);
      };
    }
  }
}
