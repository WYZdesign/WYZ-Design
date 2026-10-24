/**
 * Bundle rule for merch: any 2+ distinct pieces in one order get 10% off the
 * item subtotal (shipping excluded). Server-validated; the client only displays
 * the rule. Pure so it can be unit-tested without Stripe.
 */
export const BUNDLE_MIN_ITEMS = 2;
export const BUNDLE_DISCOUNT_PERCENT = 10;

type BundleLine = { productId: number; unitPriceCents: number; quantity: number };

export function bundleDiscountCents(lines: BundleLine[]): number {
  const distinctProducts = new Set(lines.map((l) => l.productId)).size;
  if (distinctProducts < BUNDLE_MIN_ITEMS) return 0;
  const subtotal = lines.reduce((n, l) => n + l.unitPriceCents * l.quantity, 0);
  return Math.round((subtotal * BUNDLE_DISCOUNT_PERCENT) / 100);
}
