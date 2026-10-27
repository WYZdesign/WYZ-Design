/**
 * SecurityHeaders — Content-Security-Policy + X-Frame-Options + X-Content-Type-Options
 * + Strict-Transport-Security.
 *
 * Renders as a <meta> tag so it works on both client and server renders.
 * The policy is intentionally strict but allows the known third-party
 * domains the site actually loads: Stripe, Google, Facebook, TikTok,
 * Vercel analytics, and the local Ollama proxy (127.0.0.1).
 */
export const CSP_POLICY = `
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.clarity.ms https://analytics.tiktok.com https://connect.facebook.net https://va.vercel-scripts.com https://challenges.stripe.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https://images.stripe.com https://i.imgur.com https://*.stripe.com https://*.facebook.com https://*.google-analytics.com https://*.googletagmanager.com;
font-src 'self' data:;
connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://analytics.tiktok.com https://www.clarity.ms https://connect.facebook.net https://va.vercel-scripts.com https://api.printful.com https://api.supabase.co https://*.supabase.co https://api.openai.com https://api.anthropic.com https://api.ollama.com http://127.0.0.1:11434 http://localhost:11434;
frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.google.com https://www.youtube.com https://www.facebook.com https://www.clarity.ms;
frame-ancestors 'none';
object-src 'none';
base-uri 'self';
form-action 'self';
upgrade-in-requests;
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