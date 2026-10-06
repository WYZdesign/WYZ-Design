/**
 * Printful integration for the merch store.
 *
 * The live store ("Dying Breed Crew", id 18447141) sells *sync products*: each
 * bundles a design with a catalog product and is ordered by `sync_variant_id`.
 * Raw catalog variants (the old hardcoded id list) cannot be ordered without
 * uploads, so the store reads sync products instead.
 *
 * Catalog reads use the v1 store endpoints; order creation uses v1 `/orders`
 * with `sync_variant_id`. Verified against the live store 2026-10-06.
 */

const PRINTFUL_API = "https://api.printful.com";

export const PRINTFUL_STORE_ID = Number(process.env.PRINTFUL_STORE_ID || 18447141);

export function printfulConfigured(): boolean {
  return Boolean(process.env.PRINTFUL_API_KEY);
}

export interface MerchVariant {
  id: number; // sync_variant_id — the id used to order
  name: string;
  size: string | null;
  color: string | null;
  colorCode: string | null;
  image: string | null;
  price: number; // USD retail price (0 = not sellable yet)
}

export interface MerchProduct {
  id: number; // sync_product_id
  title: string;
  type: string;
  image: string;
  variants: MerchVariant[];
  colors: { name: string; code: string | null; image: string | null }[];
  sizes: string[];
}

interface PrintfulOpts {
  timeoutMs?: number;
  revalidate?: number;
  method?: string;
  body?: unknown;
  noCache?: boolean;
}

async function printful(path: string, opts: PrintfulOpts = {}): Promise<Response> {
  const { timeoutMs = 12_000, revalidate, method = "GET", body, noCache } = opts;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${process.env.PRINTFUL_API_KEY || ""}`,
    "User-Agent": "WYZDesign/1.0",
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  return fetch(`${PRINTFUL_API}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(timeoutMs),
    ...(method === "GET" && !noCache ? { next: { revalidate: revalidate ?? 3600 } } : { cache: "no-store" }),
  });
}

interface RawSyncVariant {
  id: number;
  variant_id?: number;
  name: string;
  retail_price?: string | null;
  size?: string | null;
  color?: string | null;
  files?: { type: string; preview_url?: string | null; thumbnail_url?: string | null }[];
}
interface RawSyncProduct {
  id: number;
  name: string;
  thumbnail_url?: string | null;
  variants?: number;
}

/** Parse "Product (Black / L)" -> { color: "Black", size: "L" } when present. */
function parseVariantName(name: string): { color: string | null; size: string | null } {
  const m = name.match(/\(([^)]+)\)\s*$/);
  if (!m) return { color: null, size: null };
  const parts = m[1].split("/").map((p) => p.trim());
  if (parts.length === 1) {
    // single token: "One size" is a size, otherwise treat as color
    return /one size|os|onesize/i.test(parts[0]) ? { color: null, size: parts[0] } : { color: parts[0], size: null };
  }
  return { color: parts[0] || null, size: parts[1] || null };
}

function previewImage(v: RawSyncVariant, fallback: string): string {
  const files = v.files || [];
  const preview = files.find((f) => f.type === "preview");
  return preview?.preview_url || preview?.thumbnail_url || fallback;
}

async function fetchStoreProductList(): Promise<RawSyncProduct[]> {
  const res = await printful(`/store/products?store_id=${PRINTFUL_STORE_ID}`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.result || []) as RawSyncProduct[];
}

/** All sellable store products with their variants. Cached 1h via Next data cache. */
export async function listStoreProducts(): Promise<MerchProduct[]> {
  if (!printfulConfigured()) return [];
  const list = await fetchStoreProductList();
  const details = await Promise.all(
    list.map(async (p) => {
      const res = await printful(`/store/products/${p.id}?store_id=${PRINTFUL_STORE_ID}`);
      if (!res.ok) return null;
      const r = (await res.json())?.result;
      const sp: RawSyncProduct = r?.sync_product || p;
      const rawVariants: RawSyncVariant[] = r?.sync_variants || [];
      return mapProduct(sp, rawVariants);
    })
  );
  return details.filter(Boolean) as MerchProduct[];
}

function mapProduct(sp: RawSyncProduct, rawVariants: RawSyncVariant[]): MerchProduct {
  const thumb = sp.thumbnail_url || "";
  const variants: MerchVariant[] = rawVariants.map((v) => {
    const { color, size } = parseVariantName(v.name);
    return {
      id: v.id,
      name: v.name,
      size,
      color,
      colorCode: null,
      image: previewImage(v, thumb) || null,
      price: v.retail_price ? Number(v.retail_price) : 0,
    };
  });
  const colorMap = new Map<string, { name: string; code: string | null; image: string | null }>();
  for (const v of variants) if (v.color && !colorMap.has(v.color)) colorMap.set(v.color, { name: v.color, code: null, image: v.image });
  const sizeSet = new Set<string>();
  for (const v of variants) if (v.size) sizeSet.add(v.size);

  return {
    id: sp.id,
    title: sp.name,
    type: "apparel",
    image: thumb,
    variants,
    colors: [...colorMap.values()],
    sizes: [...sizeSet],
  };
}

export async function getProductWithVariants(syncProductId: number): Promise<MerchProduct | null> {
  if (!printfulConfigured()) return null;
  try {
    const res = await printful(`/store/products/${syncProductId}?store_id=${PRINTFUL_STORE_ID}`);
    if (!res.ok) return null;
    const r = (await res.json())?.result;
    if (!r?.sync_product) return null;
    return mapProduct(r.sync_product, r.sync_variants || []);
  } catch {
    return null;
  }
}

export interface VariantInfo {
  id: number;
  productId: number;
  name: string;
  size: string | null;
  color: string | null;
  image: string | null;
  price: number;
}

/** Server-side truth for a cart line: finds the sync variant across the store. */
export async function getVariantInfo(syncVariantId: number): Promise<VariantInfo | null> {
  if (!printfulConfigured()) return null;
  const products = await listStoreProducts();
  for (const p of products) {
    const v = p.variants.find((x) => x.id === syncVariantId);
    if (v) {
      return { id: v.id, productId: p.id, name: v.name, size: v.size, color: v.color, image: v.image, price: v.price };
    }
  }
  return null;
}

export interface PrintfulOrderItemInput {
  syncVariantId: number;
  quantity: number;
  name?: string;
  retailPrice?: number; // USD
}

export interface PrintfulRecipient {
  name: string;
  address1: string;
  address2?: string | null;
  city: string;
  state_code?: string | null;
  country_code: string;
  zip: string;
  phone?: string | null;
  email?: string | null;
}

export interface PrintfulOrderResult {
  id: number;
  status: string;
  externalId?: string | null;
}

/**
 * Create and submit a Printful order for paid merch. Sync products carry their
 * own print files, so items only need `sync_variant_id`. `confirm: true` sends
 * it straight to fulfillment.
 */
export async function createPrintfulOrder(params: {
  recipient: PrintfulRecipient;
  items: PrintfulOrderItemInput[];
  externalId: string;
  shipping?: "STANDARD" | "EXPRESS";
}): Promise<PrintfulOrderResult> {
  const res = await printful(`/orders`, {
    method: "POST",
    noCache: true,
    body: {
      store_id: PRINTFUL_STORE_ID,
      external_id: params.externalId,
      recipient: params.recipient,
      items: params.items.map((it) => ({
        sync_variant_id: it.syncVariantId,
        quantity: it.quantity,
        ...(it.name ? { name: it.name } : {}),
        ...(typeof it.retailPrice === "number" ? { retail_price: it.retailPrice.toFixed(2) } : {}),
      })),
      shipping: params.shipping || "STANDARD",
      confirm: true,
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const reason = json?.error?.message || json?.error?.reason || json?.result || `Printful HTTP ${res.status}`;
    throw new Error(`Printful order failed: ${typeof reason === "string" ? reason : JSON.stringify(reason)}`);
  }
  const result = json?.result;
  return { id: result?.id, status: result?.status, externalId: result?.external_id };
}
