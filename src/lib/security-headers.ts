/**
 * SecurityHeaders — Content-Security-Policy + X-Frame-Options + X-Content-Type-Options
 * + Strict-Transport-Security.
 *
 * Renders as a <meta> tag so it works on both client and server renders.
 * The policy is intentionally strict but allows the known third-party
 * domains the site actually loads: Stripe, Google, Facebook, TikTok,
 * Vercel analytics, and the local Ollama proxy (127.0.0.1).
 */
// 2026-10-27 (Claude): this module isn't imported anywhere yet (checked --
// no component or layout references CSP_POLICY/SECURITY_HEADERS), so it
// wasn't live and wasn't the source of the site's actual production CSP
// (that's next.config.ts's headers() function, which IS live). Fixed two
// real bugs here anyway, before this gets wired in anywhere, so it doesn't
// regress things if/when it is:
//   1. `upgrade-in-requests` was a typo -- the real CSP directive is
//      `upgrade-insecure-requests`. The typo meant this had zero effect
//      (an unrecognized directive is just ignored, not an error), silently
//      providing none of the HTTP->HTTPS upgrade protection it claimed to.
//   2. img-src/connect-src were missing several origins the site actually
//      depends on today, already present in next.config.ts's live policy:
//      the Supabase storage host serving all 3,600+ portfolio images,
//      Printful product images, Cloudinary, Unsplash, Google user content
//      (OAuth avatars), Resend, Sentry/o11y, and cal.com. Added those so
//      this policy wouldn't silently break images/embeds if it's ever
//      switched on in place of (or alongside) the one in next.config.ts.
export const CSP_POLICY = `
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.clarity.ms https://analytics.tiktok.com https://connect.facebook.net https://va.vercel-scripts.com https://challenges.stripe.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https://images.stripe.com https://i.imgur.com https://*.stripe.com https://*.facebook.com https://*.google-analytics.com https://*.googletagmanager.com https://ccznkpcmpadgftqhwvdx.supabase.co https://res.cloudinary.com https://lh3.googleusercontent.com https://*.googleusercontent.com https://images.unsplash.com https://*.printful.com;
font-src 'self' data:;
connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://analytics.tiktok.com https://www.clarity.ms https://connect.facebook.net https://va.vercel-scripts.com https://api.printful.com https://api.supabase.co https://*.supabase.co wss://*.supabase.co https://api.openai.com https://api.anthropic.com https://api.ollama.com http://127.0.0.1:11434 http://localhost:11434 https://api.resend.com https://o11y.sentry.io https://app.cal.com;
media-src 'self' https://*.supabase.co blob:;
frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.google.com https://www.youtube.com https://www.facebook.com https://www.clarity.ms https://app.cal.com;
frame-ancestors 'none';
object-src 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
`.trim();

export const SECURITY_HEADERS = {
  "Content-Security-Policy": CSP_POLICY,
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-XSS-Protection": "1; mode=block",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "Cache-Control": "no-store",
};