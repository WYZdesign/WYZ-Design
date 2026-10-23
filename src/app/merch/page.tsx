"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { useModalA11y } from "@/hooks/useModalA11y";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  colors: string[];
  image: string;
  hoverImage?: string;
  badge?: string;
  materials?: string[];
}

const fmt = (n: number) => (n > 0 ? `$${n.toFixed(2)}` : "Price on request");

const ARCHIVE_IMAGES = [
  "/images/merch/dbc-archive/98442d-488e206ac0954202bc9563140aa2b55b~mv2.jpg",
  "/images/merch/dbc-archive/98442d-b3c114b8dab6450887e3d3aee9c71030~mv2.jpg",
  "/images/merch/dbc-archive/98442d-bd1e1406036d4ba99d4f8197e1495337~mv2.jpg",
  "/images/merch/dbc-archive/98442d-84cab96655a54e569290d09abd01eaed~mv2.jpg",
  "/images/merch/dbc-archive/98442d-95706f79d3f649dd9dda6bc28ef99f65~mv2.jpg",
  "/images/merch/dbc-archive/98442d-71e847c4dd9546b0bef2a69d72d2baa6~mv2.jpg",
  "/images/merch/dbc-archive/98442d-7ef7fb49e39942f687d13018406e72a8~mv2.jpg",
  "/images/merch/dbc-archive/98442d-3aa0e795baf84e72affb65d9c1cf76a6~mv2.jpg",
  "/images/merch/dbc-archive/98442d-a35038eae10c4de8a68b7ca3aa5f28f3~mv2.jpg",
  "/images/merch/dbc-archive/98442d-60d7fe9cb1a14d4696d62ca1b5902cdf~mv2.jpg",
  "/images/merch/dbc-archive/nsplsh-ea5cee04903c44399fee2f8de391fa51~mv2.jpg",
  "/images/merch/dbc-archive/98442d-422f5f161e544ce9bf0e06f901881db4~mv2.jpg",
];

const CATEGORIES = ["All", "Apparel", "Headwear", "Accessories"];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function TypewriterText({ text, speed = 40 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return <span ref={ref}>{displayed}<span className="animate-pulse">|</span></span>;
}

function ParallaxHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="relative h-[85vh] sm:h-[80vh] overflow-hidden bg-[#111]">
      {/* Accordion gallery of crew wearing merch - panels expand on hover */}
      <div className="absolute inset-0 flex">
        {ARCHIVE_IMAGES.slice(0, 6).map((img, i) => (
          <div key={i} className="relative flex-1 group overflow-hidden transition-all duration-700 ease-out hover:flex-[3.5]">
            <SafeImage src={img} alt={`DBC crew wearing merch ${i + 1}`} width={700} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500" />
          </div>
        ))}
      </div>
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111]/80 via-[#111]/40 to-[#111]/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#111]/60 via-transparent to-[#111]/60 pointer-events-none" />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[#DF3131] text-[11px] sm:text-[13px] font-heading font-bold tracking-[0.3em] uppercase mb-2" style={{ opacity: Math.max(0, 1 - scrollY / 400) }}>
          Dying Breed Crew
        </p>
        <h1 className="text-center text-[1.75rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] font-heading font-black text-white leading-[0.9] tracking-[0.05em] mb-4 sm:mb-8" style={{ opacity: Math.max(0, 1 - scrollY / 500), transform: `translateY(${scrollY * 0.15}px)` }}>
          <span className="block">WORN</span>
          <span className="block text-[#DF3131]">DIFFERENT</span>
        </h1>
        <div className="text-white/50 text-[11px] sm:text-[13px] max-w-lg leading-relaxed min-h-[3em] mb-3" style={{ opacity: Math.max(0, 1 - scrollY / 300) }}>
           <TypewriterText text="Crew-made designs. Quality you can feel. Every piece carries the story." speed={30} />
        </div>
        <a href="#shop" className="mt-8 px-8 py-3 bg-white text-[#111] border-2 border-white text-[13px] font-bold tracking-[0.15em] uppercase hover:bg-[#DF3131] hover:text-white hover:border-[#DF3131] transition-all" style={{ opacity: Math.max(0, 1 - scrollY / 250) }}>
          Shop Now
        </a>
      </div>
    </div>
  );
}

function DynamicContentUnderHero() {
   const features = [
     { title: "PRINTED TO ORDER", desc: "Every design is printed fresh with premium inks. No warehouse full of old stock.", icon: <svg className="w-10 h-10 mx-auto text-[#DF3131]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg> },
     { title: "CREW TESTED", desc: "Every design gets worn by the Dying Breed Crew first. If we wouldn't wear it, we don't sell it.", icon: <svg className="w-10 h-10 mx-auto text-[#DF3131]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
     { title: "NO HASSLE", desc: "Not feeling it? We'll sort it out. No runaround.", icon: <svg className="w-10 h-10 mx-auto text-[#DF3131]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> },
   ];
   return (
    <section className="section-gap bg-[#FEFEFD]">
      <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-[11px] sm:text-[13px] font-bold tracking-[0.3em] uppercase text-[#DF3131] block mb-2">WHY DBC MERCH</span>
          <h2 className="text-[2.25rem] sm:text-[2rem] md:text-[2.5rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.06em]">Built By The Crew, For The Crew</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f) => (
            <div key={f.title} className="bg-white dark:bg-[#252528] p-6 sm:p-8 rounded-xl border border-[#E2E2E2] dark:border-[#444] shadow-sm hover:shadow-xl hover:shadow-[#DF3131]/10 transition-all text-center">
              <div className="text-[2.5rem] sm:text-[3rem] mb-4">{f.icon}</div>
              <h3 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[1.1rem] tracking-[0.05em] mb-2">{f.title}</h3>
              <p className="text-[#666] dark:text-[#666] text-[14px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SquareQuote() {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handler = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const diff = (center - viewCenter) / viewCenter;
      setScrollOffset(diff * 30);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6" ref={ref}>
      <div className="relative w-full overflow-hidden bg-[#111] border border-[#333]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-64 md:h-auto overflow-hidden">
            <div className="absolute inset-0" style={{ transform: `translateY(${scrollOffset}px) scale(1.1)` }}>
              <SafeImage src="/images/merch/dbc-archive/98442d-488e206ac0954202bc9563140aa2b55b~mv2.jpg" alt="Featured Artist" width={700} className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111]/80 hidden md:block" />
          </div>
          <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#FF5252] mb-3">Featured Artist of the Month</span>
            <h2 className="text-[1.4rem] sm:text-[1.7rem] md:text-[2rem] font-heading font-black text-white tracking-[0.04em] leading-[1.1] mb-4">
              DONTE &quot;DANNY&quot; DAVIS
            </h2>
            <p className="text-white/60 text-[14px] leading-relaxed mb-6 max-w-md">
              Every piece in this collection comes from a real artist with a real story. No generic graphics. No mass-produced templates. Just art that means something.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/featured-artist" className="inline-block px-6 py-3 bg-[#DF3131] text-white font-heading font-bold tracking-[0.12em] uppercase text-[12px] hover:bg-[#B82020] transition-all">
                SEE THE ARTIST
              </Link>
              <Link href="/merch" className="inline-block px-6 py-3 border-2 border-white text-white font-heading font-bold tracking-[0.12em] uppercase text-[12px] hover:bg-white hover:text-[#111] transition-all">
                SHOP FAOTM
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BundleSets({ products }: { products: Product[] }) {
  const pick = (cat: string) => products.find((p) => p.category === cat);
  const apparel = pick("Apparel");
  const headwear = pick("Headwear");
  const accessory = pick("Accessories");

  const sets: { name: string; items: Product[] }[] = [];
  if (apparel && headwear) sets.push({ name: "Tee + Cap", items: [apparel, headwear] });
  if (apparel && accessory) sets.push({ name: "Top + Carry", items: [apparel, accessory] });
  if (apparel && headwear && accessory) sets.push({ name: "The Full Fit", items: [apparel, headwear, accessory] });

  if (sets.length === 0) return null;

  return (
    <section className="py-14 bg-[#F5F5F3] dark:bg-[#1C1C1E]">
      <div className="max-w-[82rem] mx-auto px-6 lg:px-12">
        <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#DF3131] mb-2">Sets</p>
        <h2 className="text-[2rem] sm:text-[2.5rem] font-heading font-black text-[#333] dark:text-white mb-2">Complete the fit</h2>
        <p className="text-[#666] dark:text-[#aaa] text-[15px] mb-8 max-w-xl">
          Pieces we actually shoot together. Everything is printed to order, so a set is made when you order it.
          Prices shown are the exact sum of the items, no padding.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sets.map((set) => {
            const total = set.items.reduce((n, p) => n + p.price, 0);
            return (
              <div key={set.name} className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 gap-1 p-2 bg-[#f7f7f5] dark:bg-[#1C1C1E]">
                  {set.items.map((p) => (
                    <div key={p.id} className="relative aspect-square">
                      <SafeImage src={p.image} alt={p.name} fill sizes="200px" className="object-contain p-2" />
                    </div>
                  ))}
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold uppercase tracking-[0.04em] text-[#333] dark:text-white mb-1">{set.name}</h3>
                  <p className="text-[12px] text-[#666] dark:text-[#aaa] mb-3">{set.items.map((p) => p.name).join(" + ")}</p>
                  <p className="text-[#DF3131] font-black mb-4">
                    {fmt(total)} <span className="text-[11px] font-bold text-[#999] uppercase tracking-[0.08em]">set</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {set.items.map((p) => (
                      <Link key={p.id} href={`/merch/${p.id}`} className="px-3 py-2 border border-[#d9d6d3] text-[11px] font-bold uppercase tracking-[0.06em] text-[#333] hover:border-[#DF3131] hover:text-[#DF3131] transition-colors">
                        {p.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductGrid({ products, onSelect }: { products: Product[]; onSelect: (p: Product) => void }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8">
      {products.map((product) => (
        <button type="button" key={product.id} className="group cursor-pointer text-left w-full bg-transparent border-0 p-0"
          aria-label={`View ${product.name}`}
          onMouseEnter={() => setHoveredId(product.id)} onMouseLeave={() => setHoveredId(null)}
          onClick={() => onSelect(product)}>
          <div className={`bg-[#f7f7f5] aspect-square overflow-hidden relative mb-3 transition-all duration-300 ${hoveredId === product.id ? "shadow-xl shadow-[#DF3131]/15 -translate-y-1" : "shadow-sm"}`}>
               <SafeImage src={product.image} alt={product.name} fill sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw" className={`w-full h-full object-contain p-3 transition-transform duration-500 ${hoveredId === product.id ? "scale-[1.03]" : "scale-100"}`} decoding="async" />
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${hoveredId === product.id ? "opacity-100" : "opacity-0"}`}>
              <span className="bg-white text-[#333] text-[8px] font-bold tracking-[0.1em] uppercase px-4 py-2 hover:bg-[#DF3131] hover:text-white transition-all mb-2">Quick View</span>
            </div>
            {product.badge && <span className="absolute top-2 left-2 bg-[#DF3131] text-white text-[11px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 z-10 mb-2">{product.badge}</span>}
          </div>
          <div className="text-center px-1">
            <p className="text-[11px] text-[#666] font-bold tracking-[0.12em] uppercase mb-2">{product.category}</p>
            <h3 className="text-size-9 font-heading font-bold tracking-[0.03em] uppercase text-[#333] leading-tight line-clamp-2 group-hover:text-[#DF3131] transition-colors mb-3">{product.name}</h3>
            <p className="text-[#DF3131] font-black text-[11px] whitespace-nowrap">{fmt(product.price)}</p>
            <p className="text-[9px] uppercase tracking-[0.12em] text-[#999] mt-1">Printed to order</p>
          </div>
        </button>
      ))}
    </div>
  );
}

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
