/**
 * Normalize an email address for allowlist comparison.
 *
 * GHSA-7rqj-j65f-68wh (Auth.js): the address was validated before Unicode
 * normalization, so a homoglyph could impersonate an allowlisted address.
 * NFKC-normalizing BOTH the stored ADMIN_EMAILS entries and the incoming
 * session/login email collapses compatibility/homoglyph forms to one
 * canonical form before the comparison. A no-op for normal ASCII addresses.
 */
export function normalizeEmail(email: string | null | undefined): string {
  return String(email ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .toLowerCase();
}
