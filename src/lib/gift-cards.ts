import { createHash, randomBytes } from "crypto";

/**
 * Gift-card policy + code helpers (single source of truth).
 *
 * Owner decisions (2026-10-06, Torreé):
 *  - Valid for 24 months from purchase.
 *  - Redeemable for services or merch.
 * Redemption model (Spec 24): balance is tracked in `gift_cards.balance_cents`
 * and every change is written to the append-only `gift_card_ledger`.
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

// Excludes ambiguous 0/O/1/I/L.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Crypto-random code, formatted WYZ-XXXX-XXXX-XXXX-XXXX. */
export function generateGiftCardCode(): string {
  const bytes = randomBytes(16);
  let out = "";
  for (let i = 0; i < 16; i++) out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return `WYZ-${out.slice(0, 4)}-${out.slice(4, 8)}-${out.slice(8, 12)}-${out.slice(12, 16)}`;
}

/** Uppercase, strip everything that is not A-Z0-9 (so dash/space entry still matches). */
export function normalizeGiftCardCode(raw: string): string {
  return (raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function hashGiftCardCode(raw: string): string {
  return createHash("sha256").update(normalizeGiftCardCode(raw)).digest("hex");
}

export function last4(raw: string): string {
  const n = normalizeGiftCardCode(raw);
  return n.slice(-4);
}

export function isGiftCardExpired(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() < Date.now();
}
