/**
 * Shared merch model + shipping math used by both the client cart UI and the
 * server checkout/webhook. Keep this free of React/DOM imports.
 */

export interface CartLine {
  variantId: number;
  productId: number;
  title: string;
  variantName: string;
  size: string | null;
  color: string | null;
  image: string | null;
  unitPriceCents: number;
  quantity: number;
}

export const SHIPPING_OPTIONS = [
  { id: "standard", label: "Standard (3-5 business days)", amountCents: 595 },
  { id: "express", label: "Express (1-2 business days)", amountCents: 1495 },
] as const;

export type ShippingOptionId = (typeof SHIPPING_OPTIONS)[number]["id"];

export const FREE_SHIPPING_THRESHOLD_CENTS = 7500;
export const MAX_LINE_QUANTITY = 10;
export const MAX_CART_LINES = 25;

export function shippingCentsFor(subtotalCents: number, optionId: string): number {
  if (subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS && optionId === "standard") return 0;
  const opt = SHIPPING_OPTIONS.find((o) => o.id === optionId) || SHIPPING_OPTIONS[0];
  return opt.amountCents;
}

export function cartSubtotalCents(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.unitPriceCents * l.quantity, 0);
}

export function formatUSD(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Validates a single cart line coming from the client. Returns null when invalid. */
export function sanitizeCartLine(raw: unknown): CartLine | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const variantId = Number(r.variantId);
  const productId = Number(r.productId);
  const quantity = Math.min(Math.max(Math.floor(Number(r.quantity) || 0), 1), MAX_LINE_QUANTITY);
  if (!Number.isFinite(variantId) || variantId <= 0) return null;
  if (!Number.isFinite(productId) || productId <= 0) return null;
  return {
    variantId,
    productId,
    title: typeof r.title === "string" ? r.title.slice(0, 160) : "Merch",
    variantName: typeof r.variantName === "string" ? r.variantName.slice(0, 200) : "",
    size: typeof r.size === "string" ? r.size.slice(0, 20) : null,
    color: typeof r.color === "string" ? r.color.slice(0, 40) : null,
    image: typeof r.image === "string" ? r.image.slice(0, 500) : null,
    unitPriceCents: Math.max(0, Math.floor(Number(r.unitPriceCents) || 0)),
    quantity,
  };
}
