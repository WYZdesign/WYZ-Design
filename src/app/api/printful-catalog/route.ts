import { NextRequest, NextResponse } from "next/server";

const PRINTFUL_API = "https://api.printful.com";
const API_KEY = process.env.PRINTFUL_API_KEY || "";

// Printful v2 rate-limits aggressively (~30 req/min). Each product maps to
// dozens of variants, so unbounded parallel per-variant price+availability
// fetches (pre-fix: ~1200 uncached requests per page load) string 429s and
// produced the all-$0.00 catalog. Now: sample a bounded variant set, run all
// Printful calls through one shared concurrency pool, cache every result for
// an hour via the Next Data Cache, and retry 429 once.
const MAX_VARIANTS = 4;
const CONCURRENCY = 4;

export const PRODUCT_IDS = [
  71, 12, 831, 77, 100, 140, 300, 2, 3, 350, 465, 400, 200, 619, 301,
];

const CATEGORY_MAP: Record<string, number[]> = {
  Apparel: [71, 12, 831, 200, 400, 301, 619],
  Headwear: [77, 100, 140],
  Accessories: [300, 350, 465],
  Art: [2, 3],
};

interface PrintfulProductResponse {
  id: number;
  type: string;
  name: string;
  brand: string;
  model: string;
  image: string;
}

interface PrintfulVariant {
  id: number;
  name: string;
}

interface PlacementPrice {
  price: string;
}

interface PrintfulPricesData {
  currency: string;
  product: { placements: PlacementPrice[] };
  variant?: {
    techniques: { technique_key: string; price: string }[];
  };
}

interface PrintfulAvailabilityData {
  techniques: { selling_regions: { availability: string }[] }[];
}

interface PrintfulPricesResponse {
  data: PrintfulPricesData;
}

interface PrintfulAvailabilityResponse {
  data: PrintfulAvailabilityData;
}

interface PrintfulProduct {
  id: number;
  title: string;
  type: string;
  image: string;
  price: number;
  variantId: number;
  variantName: string;
  category: string;
  inStock: boolean;
}

let inFlight = 0;
let waiters: Array<() => void> = [];

async function withConcurrencyLimit<T>(fn: () => Promise<T>): Promise<T> {
  while (inFlight >= CONCURRENCY) {
    await new Promise<void>((resolve) => waiters.push(resolve));
  }
  inFlight++;
  try {
    return await fn();
  } finally {
    inFlight--;
    const next = waiters.shift();
    if (next) next();
  }
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array<R>(items.length);
  let i = 0;
  const worker = async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx]);
    }
  };
  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

async function jprintful(path: string, timeout = 8000): Promise<Response> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(`${PRINTFUL_API}${path}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      signal: AbortSignal.timeout(timeout),
      next: { revalidate: 3600 },
    });
    if (res.status === 429 && attempt === 0) {
      await new Promise((r) => setTimeout(r, 600));
      continue;
    }
    return res;
  }
  return new Response("{}", { status: 429 });
}

async function fetchVariantPrices(variantId: number): Promise<number> {
  try {
    const res = await withConcurrencyLimit(() => jprintful(`/v2/catalog-variants/${variantId}/prices`));
    if (!res.ok) return 0;
    const data: PrintfulPricesResponse = await res.json();
    const techniquePrices = (data.data?.variant?.techniques || [])
      .map((t) => parseFloat(t.price))
      .filter((n) => Number.isFinite(n) && n > 0);
    if (techniquePrices.length > 0) return Math.min(...techniquePrices);
    const placementPrices = (data.data?.product?.placements || [])
      .map((p) => parseFloat(p.price))
      .filter((n) => Number.isFinite(n) && n > 0);
    if (placementPrices.length > 0) return Math.min(...placementPrices);
    return 0;
  } catch {
    return 0;
  }
}

async function fetchVariantAvailability(variantId: number): Promise<boolean> {
  try {
    const res = await withConcurrencyLimit(() => jprintful(`/v2/catalog-variants/${variantId}/availability`));
    if (!res.ok) return false;
    const data: PrintfulAvailabilityResponse = await res.json();
    const allRegions: string[] = data.data?.techniques?.flatMap((t: { selling_regions: { availability: string }[] }) =>
      t.selling_regions?.map((r: { availability: string }) => r.availability) || []
    ) || [];
    return allRegions.some((a: string) => a === "in stock" || a === "available");
  } catch {
    return false;
  }
}

async function fetchProduct(id: number): Promise<PrintfulProduct | null> {
  try {
    const [productRes, variantsRes] = await Promise.all([
      withConcurrencyLimit(() => jprintful(`/v2/catalog-products/${id}`, 10000)),
      withConcurrencyLimit(() => jprintful(`/v2/catalog-products/${id}/catalog-variants`, 10000)),
    ]);
    if (!productRes.ok || !variantsRes.ok) return null;

    const productData = await productRes.json();
    const p: PrintfulProductResponse | undefined = productData.data;
    if (!p) return null;

    const varData = await variantsRes.json();
    const allVariants: PrintfulVariant[] = varData.data || [];
    if (!allVariants.length) return null;

    const variants = allVariants.slice(0, MAX_VARIANTS);
    const prices = await mapLimit(variants, 2, (v: PrintfulVariant) => fetchVariantPrices(v.id));

    const cheapestIdx = prices.reduce((bestIdx, price, i, arr) => {
      if (price > 0 && (arr[bestIdx] <= 0 || price < arr[bestIdx])) return i;
      return bestIdx;
    }, 0);

    const variant = variants[cheapestIdx];
    const price = prices[cheapestIdx] || 0;
    const inStock = price > 0 ? await withConcurrencyLimit(() => fetchVariantAvailability(variant.id)) : false;

    let category = "Apparel";
    for (const [cat, ids] of Object.entries(CATEGORY_MAP)) {
      if (ids.includes(id)) { category = cat; break; }
    }

    return {
      id: p.id,
      title: p.name.split("|")[0].trim(),
      type: p.type,
      image: p.image || "",
      price,
      variantId: variant.id,
      variantName: variant.name,
      category,
      inStock,
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: "PRINTFUL_API_KEY not set" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const includeStock = searchParams.get("stock") === "1";

  let ids = PRODUCT_IDS;
  if (category && category !== "All" && CATEGORY_MAP[category]) {
    ids = CATEGORY_MAP[category];
  }

  const products = await mapLimit(ids, 2, fetchProduct);
  const valid = (products.filter(Boolean) as PrintfulProduct[])
    .filter((p) => (includeStock ? p.inStock : true));

  return NextResponse.json(
    { products: valid, total: valid.length },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}