import { NextRequest, NextResponse } from "next/server";
import { getProductWithVariants, printfulConfigured } from "@/lib/printful";

/**
 * Full merch product with every variant (size/color/image/price) for the product
 * page and cart. Cached at the edge; prices are re-validated server-side at
 * checkout, so the client value is never trusted for money.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }
  if (!printfulConfigured()) {
    return NextResponse.json({ error: "Store not configured" }, { status: 503 });
  }
  const product = await getProductWithVariants(productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product, {
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
  });
}
