import { NextRequest, NextResponse } from "next/server";

const PRINTFUL_API = "https://api.printful.com";
const API_KEY = process.env.PRINTFUL_API_KEY || "";

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
}

interface PrintfulAvailabilityData {
  techniques: { selling_regions: { availability: string }[] }[];
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
}

interface PrintfulPricesResponse {
  data: PrintfulPricesData;
}

interface PrintfulAvailabilityResponse {
  data: PrintfulAvailabilityData;
}

async function fetchVariantPrices(variantId: number): Promise<number> {
  try {
    const res = await fetch(
      `${PRINTFUL_API}/v2/catalog-variants/${variantId}/prices`,
      { headers: { Authorization: `Bearer ${API_KEY}` }, signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return 0;
    const data: PrintfulPricesResponse = await res.json();
    const placements: PlacementPrice[] = data.data?.product?.placements || [];
    const prices = placements.map((p: PlacementPrice) => parseFloat(p.price));
    if (prices.length === 0) return 0;
    return Math.min(...prices);
  } catch {
    return 0;
  }
}

async function fetchVariantAvailability(variantId: number): Promise<boolean> {
  try {
    const res = await fetch(
      `${PRINTFUL_API}/v2/catalog-variants/${variantId}/availability`,
      { headers: { Authorization: `Bearer ${API_KEY}` }, signal: AbortSignal.timeout(8000) }
    );
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
    const res = await fetch(`${PRINTFUL_API}/v2/catalog-products/${id}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const p: PrintfulProductResponse | undefined = data.data;
    if (!p) return null;

    const varRes = await fetch(`${PRINTFUL_API}/v2/catalog-products/${id}/catalog-variants`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: 3600 },
    });
    if (!varRes.ok) return null;
    const varData = await varRes.json();
    const variants: PrintfulVariant[] = varData.data || [];
    if (!variants.length) return null;

    const prices = await Promise.all(variants.map((v) => fetchVariantPrices(v.id)));
    const availabilities = await Promise.all(variants.map((v) => fetchVariantAvailability(v.id)));

    const cheapestIdx = prices.reduce((bestIdx, price, i, arr) => {
      if (price === 0 && arr[bestIdx] !== 0) return bestIdx;
      if (price === 0) return bestIdx;
      if (arr[bestIdx] === 0) return i;
      return price < arr[bestIdx] ? i : bestIdx;
    }, 0);

    const variant = variants[cheapestIdx];
    const inStock = availabilities[cheapestIdx];
    const price = prices[cheapestIdx] || 0;

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

  let ids = PRODUCT_IDS;
  if (category && category !== "All" && CATEGORY_MAP[category]) {
    ids = CATEGORY_MAP[category];
  }

  const products = await Promise.all(ids.map(fetchProduct));
  const valid = products.filter(Boolean) as PrintfulProduct[];

  return NextResponse.json(
    { products: valid, total: valid.length },
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
}