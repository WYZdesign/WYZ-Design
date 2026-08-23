const DEFAULT_URL = "https://www.wyzdesign.com";

/**
 * Returns a clean site URL with BOM and whitespace stripped.
 * NEXT_PUBLIC_URL in Vercel has been observed with a leading BOM (U+FEFF)
 * that breaks Stripe checkout URL validation. This helper guards against that.
 */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_URL || DEFAULT_URL).replace(/^\uFEFF/, "").trim();
}
