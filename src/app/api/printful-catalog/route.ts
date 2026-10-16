import { NextRequest, NextResponse } from "next/server";
import { listStoreProductsStrict, printfulConfigured } from "@/lib/printful";

/**
 * Live merch catalog, sourced from the Printful store's sync products (the real,
 * orderable items). Each entry carries the cheapest variant's sync_variant_id so
 * the product page and cart can order it. Cached at the edge.
 */

function categoryFor(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("cap") || t.includes("hat") || t.includes("beanie")) return "Headwear";
  if (t.includes("poster") || t.includes("print") || t.includes("sticker") || t.includes("mug")) return "Accessories";
  return "Apparel";
}

export async function GET(req: NextRequest) {
  if (!printfulConfigured()) {
    return NextResponse.json({ error: "PRINTFUL_API_KEY not set" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  let products;
  try {
    products = await listStoreProductsStrict();
  } catch (e) {
    // Never present a stale/empty store as if it were the real catalog.
    console.error(`[printful-catalog] ${(e as Error).message}`);
    return NextResponse.json(
      { error: "The merch store is temporarily unavailable." },
      { status: 503 }
    );
  }
  const mapped = products
    .map((p) => {
      const priced = p.variants.filter((v) => v.price > 0);
      const cheapest = priced.reduce((best, v) => (v.price < best.price ? v : best), priced[0] || p.variants[0]);
      return {
        id: p.id,
        title: p.title,
        type: p.type,
        image: p.image,
        price: cheapest?.price || 0,
        variantId: cheapest?.id || 0,
        variantName: cheapest?.name || "",
        category: categoryFor(p.title),
        inStock: Boolean(cheapest && cheapest.price > 0),
      };
    })
    .filter((p) => p.variantId > 0);

  const filtered = category && category !== "All" ? mapped.filter((p) => p.category === category) : mapped;

  return NextResponse.json(
    { products: filtered, total: filtered.length },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
