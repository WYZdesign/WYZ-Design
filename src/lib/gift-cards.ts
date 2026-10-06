/**
 * Gift-card policy + helpers.
 *
 * Owner decision (2026-10-06, Torreé): gift cards are valid for 24 months from
 * purchase. This is the single source of truth referenced by the Stripe webhook
 * (which stamps `expires_at` on the `gift_cards` row) and by customer-facing
 * copy on /gift-card and /refund-return-policy. Keep them in sync.
 */
export const GIFT_CARD_TTL_MONTHS = 24;

/** Returns the expiry timestamp for a gift card purchased at `from` (default now). */
export function giftCardExpiry(from: Date = new Date()): Date {
  const d = new Date(from.getTime());
  d.setUTCMonth(d.getUTCMonth() + GIFT_CARD_TTL_MONTHS);
  return d;
}

/** Human-readable policy string, e.g. "24 months from purchase". */
export function giftCardExpiryLabel(): string {
  return `${GIFT_CARD_TTL_MONTHS} months from purchase`;
}
