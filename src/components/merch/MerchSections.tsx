"use client";

// Section components extracted verbatim from src/app/merch/page.tsx
// (oversized-file split, board S3 follow-up). No behavior change --
// moved as-is, only the imports below are new.

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { type Product, fmt, ARCHIVE_IMAGES } from "@/lib/data/merch";

export function TypewriterText({ text, speed = 40 }: { text: string; speed?: number }) {
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

export function ParallaxHero() {
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
        <p className="wz-on-dark text-[#DF3131] text-[11px] sm:text-[13px] font-heading font-bold tracking-[0.3em] uppercase mb-2" style={{ opacity: Math.max(0, 1 - scrollY / 400) }}>
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

export function DynamicContentUnderHero() {
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

export function SquareQuote() {
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

export function BundleSets({ products }: { products: Product[] }) {
  const pick = (cat: string) => products.find((p) => p.category === cat);
  const apparel = pick("Apparel");
  const headwear = pick("Headwear");
  const accessory = pick("Accessories");

  const sets: { name: string; items: Product[] }[] = [];
  if (apparel && headwear) sets.push({ name: "Top + Cap", items: [apparel, headwear] });
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
          Buy any 2 or more pieces in one order and 10% comes off the item subtotal at checkout. Prices above are
          the exact sum of the items before that bundle discount.
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
                      <Link key={p.id} href={`/merch/${p.id}`} className="px-3 py-2 border border-[#d9d6d3] dark:border-[#444] text-[11px] font-bold uppercase tracking-[0.06em] text-[#333] dark:text-white hover:border-[#DF3131] hover:text-[#DF3131] transition-colors">
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

export function ProductGrid({ products, onSelect }: { products: Product[]; onSelect: (p: Product) => void }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8">
      {products.map((product) => (
        <button type="button" key={product.id} className="group cursor-pointer text-left w-full bg-transparent border-0 p-0"
          aria-label={`View ${product.name}`}
          onMouseEnter={() => setHoveredId(product.id)} onMouseLeave={() => setHoveredId(null)}
          onClick={() => onSelect(product)}>
          <div className={`bg-[#f7f7f5] dark:bg-[#252528] aspect-square overflow-hidden relative mb-3 transition-all duration-300 ${hoveredId === product.id ? "shadow-xl shadow-[#DF3131]/15 -translate-y-1" : "shadow-sm"}`}>
               <SafeImage src={product.image} alt={product.name} fill sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw" className={`w-full h-full object-contain p-3 transition-transform duration-500 ${hoveredId === product.id ? "scale-[1.03]" : "scale-100"}`} decoding="async" />
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${hoveredId === product.id ? "opacity-100" : "opacity-0"}`}>
              <span className="bg-white text-[#333] text-[8px] font-bold tracking-[0.1em] uppercase px-4 py-2 hover:bg-[#DF3131] hover:text-white transition-all mb-2">Quick View</span>
            </div>
            {product.badge && <span className="absolute top-2 left-2 bg-[#DF3131] text-white text-[11px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 z-10 mb-2">{product.badge}</span>}
          </div>
          <div className="text-center px-1">
            <p className="text-[11px] text-[#666] dark:text-[#aaa] font-bold tracking-[0.12em] uppercase mb-2">{product.category}</p>
            <h3 className="text-size-9 font-heading font-bold tracking-[0.03em] uppercase text-[#333] dark:text-white leading-tight line-clamp-2 group-hover:text-[#DF3131] transition-colors mb-3">{product.name}</h3>
            <p className="text-[#DF3131] font-black text-[11px] whitespace-nowrap">{fmt(product.price)}</p>
            <p className="text-[9px] uppercase tracking-[0.12em] text-[#6B6B6B] dark:text-[#A8A8A8] mt-1">Printed to order</p>
          </div>
        </button>
      ))}
    </div>
  );
}