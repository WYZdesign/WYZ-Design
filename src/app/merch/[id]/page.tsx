"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import ScrollReveal from "@/components/ScrollReveal";

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

const fmt = (n: number) => (n > 0 ? `$${n.toFixed(2)}` : "Price on request");

export default function MerchProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const productId = parseInt(id, 10);
  const [product, setProduct] = useState<PrintfulProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!productId || isNaN(productId)) {
      setLoading(false);
      return;
    }
    fetch(`/api/printful-catalog`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.products) {
          const match = (d.products as PrintfulProduct[]).find((p) => p.id === productId);
          if (match) setProduct(match);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1C1C1E] flex items-center justify-center">
        <p className="text-[#666] dark:text-white/70 font-heading tracking-[0.1em] uppercase">Loading...</p>
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
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.1}>
            <div className="flex flex-col">
              <span className="text-[#DF3131] text-[11px] font-bold tracking-[0.25em] uppercase mb-2">
                {product.category}
              </span>
              <h1 className="font-heading font-black text-[#333] dark:text-white text-3xl lg:text-4xl tracking-[0.04em] uppercase mb-4">
                {product.title}
              </h1>
              <p className="text-[#666] dark:text-white/70 text-base leading-relaxed mb-6">
                Premium print-on-demand {product.type || "apparel"}. Custom Dying Breed Crew designs printed fresh on every order. Ships from our print partner in 3-5 business days.
              </p>

              <div className="text-4xl font-black text-[#333] dark:text-white mb-6">
                {fmt(product.price)}
              </div>

              <div className="mb-6">
                <p className="text-[13px] font-bold tracking-[0.15em] uppercase text-[#666] dark:text-white/70 mb-2">Style</p>
                <p className="text-[14px] text-[#333] dark:text-white/80 bg-[#f5f5f5] dark:bg-[#252528] px-3 py-2 rounded-lg inline-block">
                  {product.variantName}
                </p>
              </div>

              <button
                onClick={handleAddToCart}
                className={`mt-4 w-full py-4 text-[14px] font-bold tracking-[0.12em] uppercase transition-all ${
                  addedToCart
                    ? "bg-green-600 text-white"
                    : "bg-[#DF3131] text-white hover:bg-[#B82020]"
                }`}
              >
                {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
              </button>

              <p className="text-[#999] dark:text-white/50 text-[12px] text-center mt-3">
                Print-on-demand via Printful. Ships in 3-5 business days.
              </p>

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
