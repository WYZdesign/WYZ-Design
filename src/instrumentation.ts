// Sentry instrumentation — requires @sentry/nextjs package
// Install: npm install @sentry/nextjs
// Then uncomment below:
/*
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
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

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
*/