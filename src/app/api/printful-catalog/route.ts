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
    const res = await fetch(`${PRINTFUL_API}/products/${id}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const p = data.result?.product;
    const variants = data.result?.variants || [];
    if (!p || !variants.length) return null;

    // Find cheapest variant for display price
    const cheapest = variants.reduce((a: any, b: any) => (a.price < b.price ? a : b));

    // Determine category
    let category = "Apparel";
    for (const [cat, ids] of Object.entries(CATEGORY_MAP)) {
      if (ids.includes(id)) { category = cat; break; }
    }

    return {
      id: p.id,
      title: p.title.split("|")[0].trim(), // clean up "Brand | Model" format
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
 * @method GET
 * @request Query param `category` (optional) — Apparel, Headwear, Accessories, Art, or All
 * @response JSON with products array (id, title, type, image, price, category) and total count
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
