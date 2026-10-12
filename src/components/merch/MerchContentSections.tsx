"use client";

// Standalone content sections extracted from src/app/merch/page.tsx
// (oversized-file split, board S3). Each of these owns its own state and
// takes no props from the page -- moved verbatim, behavior unchanged.

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ARCHIVE_IMAGES, DBC_MODEL_MOCKUPS, FAOTM_URL } from "@/lib/data/merch";

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
        <p className="text-[#DF3131] text-[11px] sm:text-[13px] font-heading font-bold tracking-[0.3em] uppercase mb-2" style={{ opacity: Math.max(0, 1 - scrollY / 400) }}>
          Dying Breed Crew
        </p>
        <h1 className="wz-stack text-center text-[1.75rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] font-heading font-black text-white leading-[0.9] tracking-[0.05em] mb-4 sm:mb-8" style={{ opacity: Math.max(0, 1 - scrollY / 500), transform: `translateY(${scrollY * 0.15}px)` }}>
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

export function AccordionGallery() {
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);
  return (
    <ErrorBoundary fallback={
      <section className="section-gap bg-[#FEFEFD]">
        <div className="max-w-[130rem] mx-auto px-6 lg:px-12 text-center">
          <p className="text-[#666]">Crew gallery temporarily unavailable</p>
        </div>
      </section>
    }>
    <section className="section-gap bg-[#FEFEFD]">
      <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#DF3131] block mb-2">DBC CREW MODEL MOCKUPS</span>
          <h3 className="text-[1.3rem] sm:text-[1.5rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.05em]">Worn By The Crew</h3>
        </div>
        {!showContent ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[160px] sm:w-[200px] aspect-[3/4] bg-[#ddd] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
        <div className="overflow-hidden -mx-6 px-6 pb-4">
          <div className="flex gap-4 animate-marquee-left hover:[animation-play-state:paused] whitespace-nowrap">
            {[...DBC_MODEL_MOCKUPS, ...DBC_MODEL_MOCKUPS].map((item, i) => (
              <div key={`crew-${i}`} className="flex-none w-[160px] sm:w-[200px]">
                <div className="aspect-[3/4] rounded-lg overflow-hidden border border-[#E2E2E2] dark:border-[#444] bg-[#f5f5f5] mb-2">
                  <SafeImage src={item.model} alt={item.name} width={400} className="w-full h-full object-contain" />
                </div>
                <h4 className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] text-[13px] sm:text-[14px] mb-1 text-left">{item.name}</h4>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-[#666] dark:text-[#aaa] text-left">{item.category}</p>
                  <span className="text-[#DF3131] font-black text-[14px]">${item.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
        <div className="mt-8 text-center">
          <Link href={FAOTM_URL} className="inline-block px-8 py-3 bg-white text-[#111] border-2 border-[#111] font-heading font-bold tracking-[0.15em] uppercase text-[13px] hover:bg-[#DF3131] hover:text-white hover:border-[#DF3131] transition-all">
            VIEW FULL COLLECTION
          </Link>
        </div>
      </div>
    </section>
    </ErrorBoundary>
  );
}

export function DynamicContentUnderShop() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const designStories = [
    { id: 1, name: "Crown Tee", image: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie-1.jpg", story: "The Crown. A nod to the crew's roots. Printed on premium heavyweight cotton. Each tee is hand-checked before shipping.", meaning: "Represents the crew's identity - the crown symbol is a mark of belonging." },
    { id: 2, name: "Denim Jacket", image: "/images/merch/dbc-archive/WYZ-Crown-Unisex-denim-jacket.jpg", story: "Built to last. vintage-wash denim with custom DBC embroidery. One-of-a-kind - no two are exactly the same. Worn by the crew on location.", meaning: "The jacket is the crew's uniform - durable, timeless, and impossible to ignore." },
    { id: 3, name: "Crop Hoodie", image: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie.jpg", story: "The crew's favorite. Brushed fleece inside, raw hem, custom DBC tag. Limited drops - once they're gone, they're gone.", meaning: "Scarcity is part of the story. Not everything is available forever." },
    { id: 4, name: "Dad Hat", image: "/images/merch/dbc-archive/WYZ-Crown-Dad-hat.jpg", story: "Structured crown, flat visor. Adjustable snapback. The DBC dad hat is the crew's on-duty uniform. Worn from the studio to the street.", meaning: "The hat is the crew's flag - visible even when no one is speaking." },
    { id: 5, name: "Ribbed Beanie", image: "/images/merch/dbc-archive/98442d-60d7fe9cb1a14d4696d62ca1b5902cdf~mv2.jpg", story: "Organic ribbed beanie. One-size-fits-all. Folded cuff with DBC embroidery. The winter staple - crew-tested in freezing conditions.", meaning: "Warmth matters. The beanie is the crew's armor against the elements." },
    { id: 6, name: "Embroidered Socks", image: "/images/merch/dbc-archive/WYZ-Crown-Embroidered-socks.jpg", story: "Bold minimalist look. US-made. DBC crown embroidered along the ankle. The detail the camera never catches - but the crew knows.", meaning: "The small details are where the crew shows who they really are." },
    { id: 7, name: "White Glossy Mug", image: "/images/merch/dbc-archive/WYZ-Crown-White-glossy-mug.jpg", story: "11oz black glossy ceramic. Dishwasher safe. The morning ritual, with DBC on the side. The crew drinks coffee before every session.", meaning: "The mug is the crew's downtime - the small moments between the noise." },
    { id: 8, name: "Denim Tote Bag", image: "/images/merch/dbc-archive/WYZ-Crown-Organic-denim-tote-bag.jpg", story: "Organic denim tote. Spacious, functional. Built for the crew's gear - cameras, sketches, vinyl, whatever the session demands.", meaning: "The tote carries the crew's tools. Without it, nothing moves." },
  ];
  return (
    <ErrorBoundary fallback={
      <section className="section-gap bg-[#FEFEFD]">
        <div className="max-w-[130rem] mx-auto px-6 lg:px-12 text-center">
          <p className="text-[#666]">Crew content temporarily unavailable</p>
        </div>
      </section>
    }>
    <section className="section-gap bg-[#FEFEFD]">
      <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#DF3131] block mb-2">EVERY PIECE HAS A STORY</span>
          <h2 className="text-[2.25rem] sm:text-[2rem] md:text-[2.5rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.06em]">Built From The Crew, For The Crew</h2>
          <p className="text-[#666] dark:text-[#666] text-[15px] max-w-2xl mx-auto mt-3">Every design comes from a real artist with a real story. No generic graphics. No mass-produced templates. Just art that means something.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {designStories.map((d) => (
            <button type="button" key={d.id} className="group cursor-pointer text-left w-full bg-transparent border-0 p-0" aria-expanded={expandedId === d.id} onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}>
              <div className="aspect-[3/4] rounded-lg overflow-hidden border border-[#E2E2E2] dark:border-[#444] bg-[#f5f5f5] mb-3">
                <SafeImage src={d.image} alt={d.name} width={500} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h4 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[1.1rem] tracking-[0.04em] mb-2">{d.name}</h4>
              <div className={`overflow-hidden transition-all duration-500 ${expandedId === d.id ? "max-h-[200px]" : "max-h-0"}`}>
                <div className="pb-4">
                  <p className="text-[#666] dark:text-[#666] text-[14px] leading-relaxed mb-2">{d.story}</p>
                  <p className="text-[#DF3131] dark:text-[#DF3131] text-[13px] font-bold tracking-[0.05em] uppercase">{d.meaning}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
    </ErrorBoundary>
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
