"use client";

import { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import SafeImage from "@/components/SafeImage";
import ScrollReveal from "@/components/ScrollReveal";
import { useCart } from "@/lib/cart";
import { formatUSD } from "@/lib/merch";

interface Variant {
  id: number;
  name: string;
  size: string | null;
  color: string | null;
  colorCode: string | null;
  image: string | null;
  price: number;
}
interface Product {
  id: number;
  title: string;
  type: string;
  image: string;
  variants: Variant[];
  colors: { name: string; code: string | null; image: string | null }[];
  sizes: string[];
}

export default function MerchProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const productId = parseInt(id, 10);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const { addLine } = useCart();

  useEffect(() => {
    if (!productId || isNaN(productId)) {
      setLoading(false);
      return;
    }
    fetch(`/api/printful-product/${productId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Product | null) => {
        if (d) {
          setProduct(d);
          const pricedVariants = d.variants.filter((v) => v.price > 0);
          const first = pricedVariants[0] || d.variants[0];
          setColor(first?.color ?? null);
          setSize(first?.size ?? null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const sizesForColor = useMemo(() => {
    if (!product) return [];
    const set = new Set<string>();
    for (const v of product.variants) {
      if (v.color === color && v.size) set.add(v.size);
    }
    return [...set];
  }, [product, color]);

  const selectedVariant = useMemo(() => {
    if (!product) return null;
    const pool = product.variants.filter((v) => v.price > 0);
    return (
      pool.find((v) => v.color === color && v.size === size) ||
      pool.find((v) => v.color === color) ||
      pool[0] ||
      null
    );
  }, [product, color, size]);

  function handleAddToCart() {
    if (!product || !selectedVariant || selectedVariant.price <= 0) {
      toast.error("Choose an available option first.");
      return;
    }
    addLine({
      variantId: selectedVariant.id,
      productId: product.id,
      title: product.title,
      variantName: selectedVariant.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      image: selectedVariant.image || product.image,
      unitPriceCents: Math.round(selectedVariant.price * 100),
      quantity: 1,
    });
    toast.success("Added to cart");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1C1C1E] flex items-center justify-center">
        <p className="text-[#666] dark:text-white/70 font-heading tracking-[0.1em] uppercase">Loading…</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1C1C1E] flex flex-col items-center justify-center px-6">
        <h1 className="font-heading font-black text-[#333] dark:text-white text-2xl mb-4">Product Not Found</h1>
        <p className="text-[#666] dark:text-white/70 mb-6 text-center max-w-md">
          This product may have been removed or the link is invalid.
        </p>
        <Link href="/merch" className="px-6 py-3 bg-[#DF3131] text-white font-bold tracking-[0.1em] hover:bg-[#B82020] transition-colors">
          Back to Shop
        </Link>
      </main>
    );
  }

  const available = selectedVariant && selectedVariant.price > 0;
  const priceCents = available ? Math.round((selectedVariant as Variant).price * 100) : 0;

  return (
    <main className="min-h-screen bg-white dark:bg-[#1C1C1E]">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <Link href="/merch" className="inline-flex items-center gap-2 text-[#666] dark:text-white/70 hover:text-[#DF3131] transition-colors mb-8 text-sm font-semibold tracking-[0.1em] uppercase">
          ← Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <ScrollReveal animation="fadeUp">
            <div className="relative aspect-square bg-[#f5f5f5] dark:bg-[#252528] rounded-xl overflow-hidden">
              <SafeImage
                src={selectedVariant?.image || product.image}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.1}>
            <div className="flex flex-col">
              <h1 className="font-heading font-black text-[#333] dark:text-white text-3xl lg:text-4xl tracking-[0.04em] uppercase mb-4">
                {product.title}
              </h1>
              <p className="text-[#666] dark:text-white/70 text-base leading-relaxed mb-6">
                Premium print-on-demand {product.type || "apparel"}, printed fresh on every order. Ships from our fulfillment partner in 3-5 business days.
              </p>

              <div className="text-4xl font-black text-[#333] dark:text-white mb-6">
                {available ? formatUSD(priceCents) : "Currently unavailable"}
              </div>

              {product.colors.length > 1 && (
                <div className="mb-5">
                  <p className="text-[13px] font-bold tracking-[0.15em] uppercase text-[#666] dark:text-white/70 mb-2">
                    Color{color ? `: ${color}` : ""}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setColor(c.name);
                          const stillValid = product.variants.some((v) => v.color === c.name && v.size === size && v.price > 0);
                          if (!stillValid) {
                            const firstSize = product.variants.find((v) => v.color === c.name && v.price > 0)?.size ?? null;
                            setSize(firstSize);
                          }
                        }}
                        aria-label={c.name}
                        aria-pressed={color === c.name}
                        className={`w-9 h-9 rounded-full border-2 transition-transform ${color === c.name ? "border-[#DF3131] scale-110" : "border-[#ccc] dark:border-[#555]"}`}
                        style={{ backgroundColor: c.code || "#ddd" }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {sizesForColor.length > 1 && (
                <div className="mb-6">
                  <p className="text-[13px] font-bold tracking-[0.15em] uppercase text-[#666] dark:text-white/70 mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {sizesForColor.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        aria-pressed={size === s}
                        className={`px-4 py-2 border text-[13px] font-bold tracking-[0.05em] transition-colors ${
                          size === s
                            ? "border-[#DF3131] bg-[#DF3131] text-white"
                            : "border-[#ccc] dark:border-[#555] text-[#333] dark:text-white/80 hover:border-[#DF3131]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={!available}
                className="mt-2 w-full py-4 text-[14px] font-bold tracking-[0.12em] uppercase transition-all bg-[#DF3131] text-white hover:bg-[#B82020] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {available ? "Add to Cart" : "Unavailable"}
              </button>

              <p className="text-[#666] dark:text-white/50 text-[12px] text-center mt-3">
                Print-on-demand via Printful. Ships in 3-5 business days.
              </p>

              {available && (
                <Link href="/cart" className="mt-4 w-full text-center py-3 border border-[#333] dark:border-white/30 text-[#333] dark:text-white font-bold tracking-[0.12em] uppercase text-[13px] hover:bg-[#333] hover:text-white transition-colors">
                  View Cart
                </Link>
              )}

              <div className="mt-8 pt-8 border-t border-[#E2E2E2] dark:border-[#444]">
                <Link href="/merch" className="text-[#DF3131] hover:underline text-sm font-semibold tracking-[0.05em]">
                  Continue Shopping →
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
