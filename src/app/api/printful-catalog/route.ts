import { NextRequest, NextResponse } from "next/server";

const PRINTFUL_API = "https://api.printful.com";
const API_KEY = process.env.PRINTFUL_API_KEY || "";

// Curated product IDs for WYZ Design merch
const PRODUCT_IDS = [
  71,   // Unisex Staple T-Shirt (Bella+Canvas 3001)
  12,   // Unisex Basic Softstyle T-Shirt (Gildan 64000)
  831,  // Unisex Organic Hoodie (Stanley/Stella)
  77,   // Snapback Cap
  100,  // 5 Panel Trucker Cap
  140,  // Closed-Back Structured Cap
  300,  // Black Glossy Mug
  2,    // Framed Poster
  3,    // Canvas
  350,  // All-Over Print Fanny Pack
  465,  // All-Over Print Duffle Bag
  400,  // All-Over Print Joggers
  200,  // All-Over Print Crop Top
  619,  // Cropped Windbreaker
  301,  // Rash Guard
];

const CATEGORY_MAP: Record<string, number[]> = {
  Apparel: [71, 12, 831, 200, 400, 301, 619],
  Headwear: [77, 100, 140],
  Accessories: [300, 350, 465],
  Art: [2, 3],
};

interface PrintfulVariant {
  id: number;
  name: string;
  price: string;
  in_stock: boolean;
}

interface PrintfulProductResponse {
  id: number;
  type: string;
  name: string;
  brand: string;
  model: string;
  image: string;
  variants: PrintfulVariant[];
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

async function fetchProduct(id: number): Promise<PrintfulProduct | null> {
  try {
    // V2 API: /v2/catalog-products/{id}
    const res = await fetch(`${PRINTFUL_API}/v2/catalog-products/${id}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const p: PrintfulProductResponse | undefined = data.data;
    if (!p) return null;

    // V2 returns variants separately — fetch them
    const varRes = await fetch(`${PRINTFUL_API}/v2/catalog-products/${id}/catalog-variants`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: 3600 },
    });
    if (!varRes.ok) return null;
    const varData = await varRes.json();
    const variants: PrintfulVariant[] = varData.data || [];
    if (!variants.length) return null;

    // Find cheapest in-stock variant for display price
    const inStock = variants.filter((v) => v.in_stock);
    const cheapest = (inStock.length ? inStock : variants).reduce((a, b) =>
      parseFloat(a.price) < parseFloat(b.price) ? a : b
    );

    // Determine category
    let category = "Apparel";
    for (const [cat, ids] of Object.entries(CATEGORY_MAP)) {
      if (ids.includes(id)) { category = cat; break; }
    }

    return {
      id: p.id,
      title: p.name.split("|")[0].trim(),
      type: p.type,
      image: p.image || "",
      price: parseFloat(cheapest.price),
      variantId: cheapest.id,
      variantName: cheapest.name,
      category,
    };
  } catch {
    return null;
  }
}

/**
 * Returns curated Printful product catalog, optionally filtered by category.
 * Uses Printful V2 API.
 * @method GET
 * @request Query param `category` (optional) — Apparel, Headwear, Accessories, Art, or All
 * @response JSON with products array and total count
 * @auth None
 */
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
