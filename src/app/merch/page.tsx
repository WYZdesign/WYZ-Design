"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { useModalA11y } from "@/hooks/useModalA11y";
import { type Product, fmt, CATEGORIES, SORT_OPTIONS, ARCHIVE_IMAGES } from "@/lib/data/merch";
import { TypewriterText, ParallaxHero, DynamicContentUnderHero, SquareQuote, BundleSets, ProductGrid } from "@/components/merch/MerchSections";

export default function MerchPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [sizeGuide, setSizeGuide] = useState(false);

  useEffect(() => {
    if (!sizeGuide) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSizeGuide(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sizeGuide]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const quickViewRef = useRef<HTMLDivElement>(null);
  useModalA11y(() => setSelectedProduct(null), { lockScroll: true, active: !!selectedProduct, containerRef: quickViewRef });
  const [products, setProducts] = useState<Product[]>([]);

  const [catalogStatus, setCatalogStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  useEffect(() => {
    setCatalogStatus("loading");
    let attempts = 0;
    const maxAttempts = 3;
    const delay = 1000;
    const controller = new AbortController();

    const fetchCatalog = () => {
      fetch("/api/printful-catalog", { signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((data) => {
          // An empty (but successful) catalog must land in a real empty state,
          // not sit on the loading skeleton forever: the early return here used
          // to skip setCatalogStatus("loaded") entirely.
          const list: Record<string, unknown>[] = Array.isArray(data.products) ? data.products : [];
          if (list.length === 0) { setProducts([]); setCatalogStatus("loaded"); return; }
          const printfulProducts: Product[] = list.map((p) => ({
            id: p.id as number,
            name: p.title as string,
            category: (p.category as string) || "Apparel",
            price: (p.price as number) || 0,
            description: `Custom ${p.title}, Dying Breed Crew x WYZ Design`,
            colors: ["#333333", "#DF3131", "#FFFFFF"],
            image: (p.image as string) || "/images/merch/dbc-archive/WYZ-Crown-Dad-hat.jpg",
          }));
          setProducts(printfulProducts);
          setCatalogStatus("loaded");
        })
        .catch(() => {
          attempts++;
          if (attempts < maxAttempts && !controller.signal.aborted) {
            setTimeout(fetchCatalog, delay * attempts);
          } else {
            setCatalogStatus("error");
          }
        });
    };
    fetchCatalog();
    return () => controller.abort();
  }, []);

  const filteredProducts = useMemo(() => {
    const result = activeCategory === "All" ? [...products] : products.filter((p) => p.category === activeCategory);
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
    }
    return result;
  }, [activeCategory, sortBy, products]);

  return (
    <>
      <main className="min-h-screen bg-[#FEFEFD]">
        <ParallaxHero />
        <section id="shop" className="section-gap">
          <div className="max-w-[82rem] mx-auto px-6 lg:px-12">
            <div className="flex flex-col gap-5 border-b border-[#e5e2df] pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#DF3131] mb-2">WYZ Design Merch</p>
                <h2 className="text-[2rem] sm:text-[2.5rem] sm:whitespace-nowrap font-heading font-black tracking-[0.03em] text-[#333]">Shop the collection</h2>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#666]">Crew-made pieces, printed to order. Pick a piece, choose your options, and check out securely.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category}
                    className={`min-h-11 px-4 text-[11px] font-bold tracking-[0.08em] uppercase border transition-colors ${activeCategory === category ? "bg-[#333] text-white border-[#333]" : "bg-white text-[#333] border-[#d9d6d3] hover:border-[#DF3131]"}`}>
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-4">
              <button type="button" onClick={() => setSizeGuide(true)} className="min-h-11 border border-[#d9d6d3] bg-white px-4 text-[11px] font-bold tracking-[0.08em] uppercase text-[#333] hover:border-[#DF3131] transition-colors">Size Guide</button>
              <label className="flex items-center gap-3 text-[11px] font-bold tracking-[0.08em] uppercase text-[#555]">
                Sort
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="min-h-11 border border-[#d9d6d3] bg-white px-3 text-[12px] text-[#333] focus:border-[#DF3131] focus:outline-none">
                  {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-8">
              {catalogStatus === "loading" && <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="aspect-square animate-pulse bg-[#efedeb]" />)}</div>}
              {catalogStatus === "error" && <p className="py-12 text-center text-[15px] text-[#555]">The collection is unavailable right now. Please try again shortly.</p>}
              {catalogStatus === "loaded" && filteredProducts.length === 0 && <p className="py-12 text-center text-[15px] text-[#555]">{activeCategory === "All" ? "New pieces are coming soon. Check back shortly." : "No pieces in this category yet."}</p>}
              {filteredProducts.length > 0 && <ProductGrid products={filteredProducts} onSelect={setSelectedProduct} />}
            </div>
          </div>
        </section>
                {products.length > 0 && <BundleSets products={products} />}

        {/* Lookbook: archive strip, swipeable, hover zoom */}
        <section className="py-14 bg-[#0A0A0A] overflow-hidden">
          <div className="max-w-[82rem] mx-auto px-6 lg:px-12 mb-6 flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#DF3131] mb-2">Lookbook</p>
              <h2 className="text-[2rem] sm:text-[2.5rem] font-heading font-black text-white">DBC in the wild</h2>
            </div>
            <p className="hidden sm:block text-white/50 text-[13px] max-w-xs">Crew shots from the archive. Swipe through the full set.</p>
          </div>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 lg:px-12 pb-2">
            {ARCHIVE_IMAGES.map((img, i) => (
              <div key={i} className="relative flex-none w-[62vw] sm:w-[300px] aspect-[4/5] snap-start overflow-hidden rounded-xl group bg-[#1C1C1E]">
                <SafeImage src={img} alt={`Dying Breed Crew lookbook ${i + 1}`} width={600} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 text-white text-[10px] font-bold tracking-[0.1em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">DBC Archive</span>
              </div>
            ))}
          </div>
        </section>

        <DynamicContentUnderHero />
        <section className="pb-16 pt-4 sm:pb-24"><SquareQuote /></section>
      </main>

      {sizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSizeGuide(false)}>
          <div role="dialog" aria-modal="true" aria-label="Size guide" className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <h2 className="text-[1.25rem] font-heading font-black tracking-[0.06em] uppercase text-[#333]">Size Guide</h2>
              <button type="button" onClick={() => setSizeGuide(false)} aria-label="Close size guide" className="min-h-11 min-w-11 text-[#666] hover:text-[#DF3131] text-xl leading-none">&times;</button>
            </div>
            <h3 className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#DF3131] mb-2">Tops</h3>
            <table className="w-full text-[13px] text-[#444] mb-6 border-collapse">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-[#888] border-b border-[#e5e2df]">
                  <th className="py-2">Size</th><th className="py-2">Chest (in)</th><th className="py-2">Length (in)</th>
                </tr>
              </thead>
              <tbody>
                {[["S","34-36","27"],["M","38-40","28"],["L","42-44","29"],["XL","46-48","30"],["2XL","50-52","31"],["3XL","54-56","32"]].map((r) => (
                  <tr key={r[0]} className="border-b border-[#f0eeec]">
                    <td className="py-2 font-bold">{r[0]}</td><td className="py-2">{r[1]}</td><td className="py-2">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#DF3131] mb-2">Headwear</h3>
            <p className="text-[13px] text-[#444] mb-6">One size fits most. Adjustable strap where applicable.</p>
            <h3 className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#DF3131] mb-2">Care</h3>
            <p className="text-[13px] text-[#444]">Machine wash cold, inside out. No bleach. Tumble dry low or hang dry. Do not iron the print.</p>
            <p className="text-[11px] text-[#999] mt-6">Measured flat, garment to garment. Allow about half an inch of variance.</p>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedProduct(null)}>
          <div ref={quickViewRef} role="dialog" aria-modal="true" aria-labelledby="quick-view-title" className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(event) => event.stopPropagation()}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-[#f7f7f5] aspect-square flex items-center justify-center overflow-hidden relative"><SafeImage src={selectedProduct.image} alt={selectedProduct.name} width={700} className="w-full h-full object-contain p-6" /></div>
              <div className="p-6 sm:p-8">
                <button type="button" onClick={() => setSelectedProduct(null)} className="min-h-11 text-[#555] hover:text-[#111] text-[14px] mb-4 block">Back to shop</button>
                <p className="text-[12px] text-[#666] font-heading font-bold tracking-[0.1em] uppercase mb-2">{selectedProduct.category}</p>
                <h2 id="quick-view-title" className="text-[1.5rem] font-heading font-bold tracking-[0.06em] uppercase text-[#333] mb-4">{selectedProduct.name}</h2>
                <p className="text-[1.5rem] font-bold text-[#DF3131] mb-4">{fmt(selectedProduct.price)}</p>
                <p className="text-[14px] text-[#666] mb-3">{selectedProduct.description}</p>
              <p className="text-[12px] text-[#666] dark:text-[#aaa] mb-6">Printed to order. Usually ships in 3-6 business days.</p>
                <Link href={`/merch/${selectedProduct.id}`} className="block w-full py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.12em] uppercase text-center text-[13px] hover:bg-[#B82020]">Choose options and add to cart</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

}
