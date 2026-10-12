"use client";

// Product-list display components extracted from src/app/merch/page.tsx
// (oversized-file split, board S3). Each takes `products`/`onSelect` from
// the page; moved verbatim, behavior unchanged.

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { type Product, fmt } from "@/lib/data/merch";

export function MerchCarousel({ products }: { products: Product[] }) {
  const items = [...products, ...products, ...products];
  return (
    <div className="py-4 sm:py-8 bg-[#FEFEFD] overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-[#DF3131] scrollbar-track-[#f5f5f5]">
      {/* 2026-10-08 (Claude): tripled content (3x) needs the -33.3333% loop
          variant, not the shared 2x/-50% one -- see globals.css comment on
          .animate-marquee-left-x3 for why. */}
      <div className="flex whitespace-nowrap animate-marquee-left-x3 hover:[animation-play-state:paused]">
        {items.map((p, i) => (
          <Link key={`mc-${i}`} href={`/merch/${p.id}`} className="flex-none cursor-pointer w-[140px] sm:w-auto">
              <div className="bg-[#f5f5f5] w-full sm:w-[200px] aspect-[3/4] overflow-hidden relative mx-2 sm:mx-3 shadow-lg hover:shadow-2xl hover:shadow-[#DF3131]/20 transition-all duration-500 hover:-translate-y-2">
               <SafeImage src={p.image} alt={p.name} width={400} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-heading font-bold text-size-12 tracking-[0.05em] uppercase text-white">{p.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ProductMarquee({ products }: { products: Product[] }) {
  const items = [...products, ...products, ...products];
  return (
    <div className="relative overflow-x-auto overflow-y-hidden bg-gradient-to-r from-[#0a0a0a] via-[#1a0a0a] to-[#0a0a0a] py-4 sm:py-10 border-y border-white/10 scrollbar-thin scrollbar-thumb-[#DF3131] scrollbar-track-black/20">
      {/* 2026-10-08 (Claude): tripled content (3x) -- see
          .animate-marquee-left-x3 comment in globals.css. */}
      <div className="flex whitespace-nowrap animate-marquee-left-x3 min-w-max">
        {items.map((p, i) => (
          <Link key={`pm-${i}`} href={`/merch/${p.id}`} className="flex-none cursor-pointer group">
            <div className="w-[140px] sm:w-[200px] lg:w-[240px] px-2 sm:px-4 aspect-square flex flex-col items-center">
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden relative flex-1 w-full mb-2 group-hover:border-[#DF3131]/50 group-hover:shadow-xl group-hover:shadow-[#DF3131]/20 transition-all duration-500">
                <SafeImage src={p.image} alt={p.name} width={480} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="w-full text-center">
                <h4 className="font-heading font-bold text-white text-size-11 tracking-[0.05em] uppercase truncate">{p.name}</h4>
                <span className="text-[#DF3131] font-bold text-[13px]">{fmt(p.price)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ScatteredGrid({ products, onSelect }: { products: Product[]; onSelect: (p: Product) => void }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const positions = useMemo(() => {
    return products.map((_, i) => ({
      rotate: ((i * 37) % 15) - 7,
      offsetX: ((i * 53) % 40) - 20,
      offsetY: ((i * 31) % 30) - 15,
      scale: 0.95 + ((i * 17) % 10) / 100,
    }));
  }, [products.length]);

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 md:gap-8 lg:gap-10 px-4">
      {products.map((product, i) => {
        const pos = positions[i] || { rotate: 0, offsetX: 0, offsetY: 0, scale: 1 };
        const depth = (i % 3) - 1;
        const parallaxY = scrollY * 0.02 * depth;
        return (
          <button type="button" key={product.id} className="group cursor-pointer text-left w-full bg-transparent border-0 p-0" aria-label={`View ${product.name}`}
            style={{
            transform: `rotate(${pos.rotate}deg) translate(${pos.offsetX}px, ${pos.offsetY + parallaxY}px) scale(${pos.scale})`,
            transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
          onClick={() => onSelect(product)}>
            <div className="bg-[#f5f5f5] aspect-[3/4] overflow-hidden relative mb-3 shadow-lg group-hover:shadow-2xl group-hover:shadow-[#DF3131]/20 transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-105">
              <SafeImage src={product.image} alt={product.name} fill sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" decoding="async" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white/70 text-[7px] font-bold tracking-[0.15em] uppercase mb-2">{product.category}</p>
                <p className="text-white font-heading font-bold text-[8px] tracking-[0.03em] uppercase mb-2">{product.name}</p>
                 <p className="text-[#DF3131] font-black text-[11px]">{fmt(product.price)}</p>
              </div>
              {product.badge && <span className="absolute top-2 left-2 bg-[#DF3131] text-white text-[11px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 z-10 mb-2">{product.badge}</span>}
            </div>
          </button>
        );
      })}
    </div>
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
          </div>
        </button>
      ))}
    </div>
  );
}
