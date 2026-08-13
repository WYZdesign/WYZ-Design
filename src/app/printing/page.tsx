"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import ParallaxVideo from "@/components/ParallaxVideo";
import TextReveal from "@/components/TextReveal";
import EnhancedMarquee from "@/components/EnhancedMarquee";

const PAPER_TYPES = [
 { name: "Premium Gloss", desc: "Premium high gloss paper is the thinnest, glossiest paper you can get. High gloss paper provides vibrant, rich color reproduction, as well as the crispest images possible. Applications include brochures, advertising, flyers, one-sheets, photography, printing and other presentation documents.", details: ["Thinnest gloss available", "Vibrant color reproduction", "Crispest image detail", "Best for brochures & flyers"] },
 { name: "Matte Photo Paper", desc: "Matte paper is regular-based paper that's covered with a thin layer of alkyl ketene sizing. This coating means that every drop of ink that comes from the printer is received properly which makes for an exceptional, professional finish if you are planning on displaying your photo prints behind glass.", details: ["Anti-reflective finish", "Professional look behind glass", "Exceptional ink absorption", "Reduced glare"] },
 { name: "Luster/Pearl", desc: "This instant-drying paper produces vivid, lifelike images that rival those of traditional silver halide prints. Premium Luster Photo Paper delivers highly saturated prints by offering maximum ink coverage and a high L-Max for true photographic reproductions.", details: ["Instant-drying surface", "Lifelike image quality", "Highly saturated colors", "Pearl-white matte surface"] },
 { name: "Satin/Semi-Gloss", desc: "Premium Photo Paper Satinogloss is a remarkable media that has the look and feel of true photographic paper, ideal for printing displays or scenic color photographs where high quality, high impact images are essential.", details: ["True photographic feel", "Finger smudge resistant", "Water droplet resistant", "Great for enlargements"] },
];

const STICKER_TYPES = [
 { name: "Kiss Cut", desc: "When printed, these stickers initially come in a square shape. Then your sticker design will only be cut through the vinyl, not the backing. When you peel the sticker off, only your sticker shape stays intact.", img: "/images/printing/kiss_cut.jpg", features: ["Cut through vinyl only", "Peel-off backing stays", "Protective border", "Easy to apply"] },
 { name: "Die Cut", desc: "The term 'die cut' means your sticker gets cut around the shape of your artwork. Die-cut stickers can also be referred to as custom shaped stickers, will cut out your sticker into any design or image in whatever shape you want.", img: "/images/printing/die_cut.jpg", features: ["Custom shape cut", "No border needed", "Unique silhouettes", "Premium look"] },
];

function PaperAccordion({ paper, index }: { paper: typeof PAPER_TYPES[0]; index: number }) {
 const [isOpen, setIsOpen] = useState(false);
 return (
 <div className="border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131]/40 transition-all duration-300 overflow-hidden">
 <button onClick={() => setIsOpen(!isOpen)} className="w-full p-5 text-center group">
 <div className="flex items-center justify-center gap-3">
 <span className="w-8 h-8 bg-[#DF3131]/10 text-[#DF3131] font-bold text-[13px] flex items-center justify-center flex-shrink-0 group-hover:bg-[#DF3131] group-hover:text-white transition-all">
 {String(index + 1).padStart(2, "0")}
 </span>
  <h3 className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] text-[14px] sm:text-[15px] tracking-[0.03em] group-hover:text-[#DF3131] transition-colors mb-3">{paper.name}</h3>
  </div>
  <div className={`w-6 h-6 mx-auto mt-2 flex items-center justify-center text-[#999] dark:text-[#aaa] group-hover:text-[#DF3131] transition-all duration-300 ${isOpen ? "rotate-45" : ""}`}>
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
 </div>
 </button>
 <div className="overflow-hidden transition-all duration-500 ease-in-out" style={{ maxHeight: isOpen ? "400px" : "0px" }}>
 <div className="px-5 pb-5">
  <p className="text-[#666] dark:text-[#b0b0b0] text-[15px] leading-relaxed mb-4">{paper.desc}</p>
 <div className="grid grid-cols-2 gap-2">
 {paper.details.map((d) => (
  <div key={d} className="flex items-center gap-2 text-[13px] text-[#333] dark:text-[#e0e0e0] bg-[#f9f9f9] dark:bg-[#2a2a2a] px-3 py-2">
 <span className="w-1.5 h-1.5 bg-[#DF3131] rounded-full flex-shrink-0" />
 {d}
 </div>
 ))}
   </div>
    </div>
    </div>
    </div>
   );
}

function StickerCard({ sticker }: { sticker: typeof STICKER_TYPES[0] }) {
 const [flipped, setFlipped] = useState(false);

  return (
  <div className="group relative cursor-pointer" style={{ perspective: "1200px", minHeight: "min(624px, 80vh)" }}
  onMouseEnter={() => setFlipped(true)}
  onMouseLeave={() => setFlipped(false)}
  onClick={() => setFlipped(f => !f)}>
  <div
    className="relative w-full h-full transition-transform duration-700 ease-in-out"
    style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
  >
  {/* Front */}
  <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
  <div className="overflow-hidden bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] transition-all duration-500 hover:shadow-2xl hover:shadow-[#DF3131]/10 hover:-translate-y-1 h-full">
  <div className="aspect-[4/3] overflow-hidden relative">
  <Image src={sticker.img} alt={sticker.name} fill className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" priority />
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
  <div className="absolute bottom-0 left-0 right-0 p-5">
  <h3 className="font-heading font-black text-white text-[22px] tracking-[0.05em] mb-3">{sticker.name}</h3>
  </div>
  </div>
  <div className="p-5">
  <p className="text-[#666] dark:text-[#b0b0b0] text-[15px] leading-relaxed mb-4">{sticker.desc}</p>
  <div className="grid grid-cols-2 gap-2">
  {sticker.features.map((f) => (
  <div key={f} className="flex items-center gap-2 text-[13px] text-[#333] dark:text-[#e0e0e0]">
  <span className="text-[#DF3131] font-bold">✓</span> {f}
  </div>
  ))}
  </div>
  </div>
  </div>
  </div>
   {/* Back */}
   <div className="absolute inset-0" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
   <div className="w-full h-full bg-[#DF3131] text-white p-5 sm:p-6 lg:p-8 flex flex-col justify-between overflow-hidden relative">
   <div className="absolute inset-0 opacity-10">
    <Image src={sticker.img} alt={sticker.name} fill className="w-full h-full object-cover" priority />
   </div>
   <div className="relative z-10 text-center flex-1 flex flex-col justify-center items-center w-full">
    <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/70 block text-center mb-2">Sticker Type</span>
    <h3 className="font-heading font-black text-white text-[24px] tracking-[0.03em] text-center mb-3">{sticker.name}</h3>
    <p className="text-white/80 text-[15px] leading-relaxed mb-4 text-center">{sticker.desc}</p>
    <div className="space-y-2 text-center w-full">
    {sticker.features.map((f) => (
    <div key={f} className="flex items-center justify-center gap-2 text-[14px] text-white/95 font-medium text-center">
    <span>✓</span> {f}
    </div>
    ))}
    </div>
   </div>
   <div className="relative z-10 flex gap-2 justify-center mt-4">
   <Link href="/booking" className="flex-1 text-center py-3 px-4 bg-white text-[#DF3131] text-[14px] font-bold tracking-[0.08em] hover:bg-[#333] hover:text-white transition-all rounded-lg" onClick={(e) => e.stopPropagation()}>
    GET A QUOTE
   </Link>
   <Link href="/plans" className="flex-1 text-center py-3 px-4 border-2 border-white text-white text-[14px] font-bold tracking-[0.08em] hover:bg-white hover:text-[#DF3131] transition-all rounded-lg" onClick={(e) => e.stopPropagation()}>
    VIEW PLANS
   </Link>
  </div>
  </div>
  </div>
  </div>
  </div>
 );
}

function FlipCardInline({ title, subtitle, backTitle, backContent, backNote, backBg, orderLink, orderLabel, orderClass }: {
  title: string; subtitle: string; backTitle: string; backContent: React.ReactNode; backNote: string; backBg: string; orderLink: string; orderLabel: string; orderClass: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="group relative cursor-pointer" style={{ perspective: "1200px", minHeight: "min(640px, 80vh)" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(f => !f)}>
      <div
        className="relative w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
      {/* Front */}
      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
        <div className="border border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#252528] p-8 lg:p-10 text-center hover:border-[#DF3131] transition-all hover:shadow-xl hover:shadow-[#DF3131]/10 h-full flex flex-col justify-center">
          <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.15em] uppercase text-[#333] dark:text-[#e0e0e0] group-hover:text-[#DF3131] transition-colors mb-4">{title}</h2>
          <p className="text-[#DF3131] text-[16px] tracking-[0.1em] uppercase opacity-80 group-hover:opacity-100 transition-opacity">{subtitle}</p>
          <div className="mt-6 flex items-center justify-center gap-2 text-[13px] text-[#888] dark:text-[#aaa]">
            <span>Hover or tap to see pricing</span>
            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>
      {/* Back */}
      <div className="absolute inset-0" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
        <div className={`w-full h-full ${backBg} text-white p-8 lg:p-12 flex flex-col justify-between overflow-hidden relative`}>
          <div className="relative z-10 text-center">
            <h2 className="font-heading font-black text-white text-[1.5rem] tracking-[0.1em] uppercase mb-4">{backTitle}</h2>
            {backContent}
            <p className="text-white/60 text-[11px] mt-4">{backNote}</p>
          </div>
          <div className="relative z-10 flex justify-center">
            <Link href={orderLink} className={orderClass} onClick={(e) => e.stopPropagation()}>{orderLabel}</Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function PrintingPage() {
 const [quoteSubmitted, setQuoteSubmitted] = useState(false);

 return (
 <>
  <main className="min-h-screen bg-white dark:bg-[#1C1C1E] pb-20">
{/* ── Hero: Split with Video ── */}
  <ScrollReveal animation="fadeUp">
  <section className="relative bg-white dark:bg-black pb-6">
  <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[50vh] pb-10 lg:pb-16">
  {/* Left: Video filling full half */}
   <div className="relative overflow-hidden h-[40vh] lg:h-auto">
    <ParallaxVideo src="/videos/hero-banners/printing.mp4" speed={0.3} opacity={0.8} overlayOpacity={0} playbackRate={0.7} />
    </div>
  {/* Right: Text with gradient bg */}
   <div className="relative overflow-hidden flex flex-col items-center justify-center text-center px-4 sm:px-10 lg:px-16 py-12 lg:py-16">
    <div className="absolute inset-0 hero-grad-print z-0" />
    <div className="absolute inset-0 bg-black/20 z-[1]" />
    <div className="relative z-10 flex flex-col items-center justify-center h-full">
    <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black tracking-[0.15em] uppercase .5 text-white text-center mb-3 sm:mb-6">DIGITAL PRINTING</h1>
    <p className="text-white/70 text-[16px] sm:text-lg mb-3 sm:mb-3 max-w-md text-center">Get your art and photos custom printed to either sell at a concert, handout for promotion, or decorate your room. We keep the customer in mind, and all numbers shown reflect industry prices at a 10% discount.</p>
    <Link href="/designs" className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.15em] uppercase text-[12px] sm:text-sm text-center hover:bg-red-700 transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#DF3131]/30 mb-4">
    GRAPHIC DESIGN
    </Link>
    </div>
    </div>
  </div>
  </section>
  </ScrollReveal>

{/* ═══ PRINTING MARQUEE ═══ */}
  <EnhancedMarquee speed="normal" pauseOnHover gradientFade className="py-3 border-y border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#1C1C1E]">
    <span className="text-[1.25rem] sm:text-[1.75rem] font-heading font-black text-[#333] dark:text-white tracking-[0.08em] uppercase px-6">
      FLYERS&nbsp;&bull;&nbsp;POSTERS&nbsp;&bull;&nbsp;BUSINESS&nbsp;CARDS&nbsp;&bull;&nbsp;STICKERS&nbsp;&bull;&nbsp;BANNERS&nbsp;&bull;&nbsp;PHOTO&nbsp;PRINTS&nbsp;&bull;&nbsp;
    </span>
  </EnhancedMarquee>

 <div className="max-w-[115rem] mx-auto px-6 lg:px-12">

 {/* ── Paper Types — Accordion ── */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <div className="py-12">
  <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black tracking-[0.15em] uppercase text-center text-[#333] dark:text-[#e0e0e0] mb-4">PHOTO PAPER TYPES</h2>
  <p className="text-center text-[#666] dark:text-[#b0b0b0] text-[16px] tracking-[0.1em] uppercase mb-8 max-w-3xl mx-auto">Photo Print Options Include: Premium Gloss, Matte Paper, Luster/Pearl, Semi-Gloss, Satin/Semi-Gloss, Select Sizes, Paper Types, And Quantities Available Upon Request.</p>
 <div className="space-y-2 max-w-4xl mx-auto">
 {PAPER_TYPES.map((paper, i) => (
 <PaperAccordion key={paper.name} paper={paper} index={i} />
 ))}
 </div>
 </div>
 </ScrollReveal>

 {/* ── Sticker Cut Types — Interactive Cards ── */}
 <ScrollReveal animation="fadeUp" delay={0.15}>
  <div className="py-12 border-t border-[#E2E2E2] dark:border-[#444]">
  <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black tracking-[0.15em] uppercase text-center text-[#333] dark:text-[#e0e0e0] mb-4">STICKER CUT TYPES</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
 {STICKER_TYPES.map((s) => (
 <StickerCard key={s.name} sticker={s} />
 ))}
 </div>
 </div>
 </ScrollReveal>

  {/* ── Flip Cards: Vinyl Stickers | Prints + Posters | Buttons ── */}
  <ScrollReveal animation="fadeUp" delay={0.1}>
  <div className="py-12 border-t border-[#E2E2E2] dark:border-[#444]">
   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[115rem] mx-auto">

  {/* Vinyl Stickers */}
  <FlipCardInline
    title="VINYL STICKERS"
    subtitle="Prices based on size, calculated by average inches."
    backTitle="VINYL STICKER PRICING"
    backContent={
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {[{ size: '2" x 2"', price: "$5" }, { size: '3" x 3"', price: "$8" }, { size: '4" x 4"', price: "$12" }, { size: '5" x 5"', price: "$16" }].map((t) => (
          <div key={t.size} className="bg-white/10 border border-white/20 p-3 text-center">
            <p className="text-white/70 text-[11px] mb-1">{t.size}</p>
            <p className="text-white font-black text-[18px]">{t.price}</p>
            <p className="text-white/50 text-[10px]">per sticker</p>
          </div>
        ))}
      </div>
    }
    backNote="Bulk discounts · Custom shapes · Kiss or die cut"
    backBg="bg-[#DF3131]"
    orderLink="/booking"
    orderLabel="ORDER NOW"
    orderClass="px-6 py-3 bg-white text-[#DF3131] text-[13px] font-bold tracking-[0.08em] hover:bg-[#333] hover:text-white transition-all"
  />

  {/* Prints + Posters */}
  <FlipCardInline
    title="PRINTS + POSTERS"
    subtitle="Prices based on size, calculated by average inches."
    backTitle="PRINT + POSTER PRICING"
    backContent={
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {[{ size: '8.5" x 11"', price: "$15" }, { size: '11" x 17"', price: "$25" }, { size: '18" x 24"', price: "$40" }, { size: '24" x 36"', price: "$55" }].map((t) => (
          <div key={t.size} className="bg-white/10 border border-white/20 p-3 text-center">
            <p className="text-white/70 text-[11px] mb-1">{t.size}</p>
            <p className="text-white font-black text-[18px]">{t.price}</p>
            <p className="text-white/50 text-[10px]">per print</p>
          </div>
        ))}
      </div>
    }
    backNote="Premium paper · Bulk discounts · Frame-ready"
    backBg="bg-[#333]"
    orderLink="/booking"
    orderLabel="ORDER NOW"
    orderClass="px-6 py-3 bg-[#DF3131] text-white text-[13px] font-bold tracking-[0.08em] hover:bg-white hover:text-[#DF3131] transition-all"
  />

  {/* Buttons */}
  <FlipCardInline
    title="BUTTONS"
    subtitle="Custom pin-back buttons for any occasion."
    backTitle="BUTTON PRICING"
    backContent={
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {[{ size: '1"', price: "$2" }, { size: '1.5"', price: "$3" }, { size: '2"', price: "$4" }, { size: '3"', price: "$5" }].map((t) => (
          <div key={t.size} className="bg-white/10 border border-white/20 p-3 text-center">
            <p className="text-white/70 text-[11px] mb-1">{t.size} diameter</p>
            <p className="text-white font-black text-[18px]">{t.price}</p>
            <p className="text-white/50 text-[10px]">per button</p>
          </div>
        ))}
      </div>
    }
    backNote="Custom artwork · Pin-back clutch · Bulk discounts"
    backBg="bg-[#1a1a1a]"
    orderLink="/booking"
    orderLabel="ORDER NOW"
    orderClass="px-6 py-3 bg-white text-[#1a1a1a] text-[13px] font-bold tracking-[0.08em] hover:bg-[#DF3131] hover:text-white transition-all"
  />

  </div>
  </div>
  </ScrollReveal>

  {/* ── Get A Quote ── */}
  <ScrollReveal animation="fadeUp" delay={0.15}>
  <div className="py-12 border-t border-[#E2E2E2] dark:border-[#444]">
  <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black tracking-[0.15em] uppercase text-center text-[#333] dark:text-[#e0e0e0] mb-4">GET A QUOTE</h2>
 <form onSubmit={async (e) => { 
 e.preventDefault();
 const fd = new FormData(e.currentTarget as HTMLFormElement);
 const data = Object.fromEntries(fd.entries());
 try {
 await fetch("/api/forms", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ formType: "printing-quote", data }),
 });
 } catch { /* continue */ }
 setQuoteSubmitted(true);
 }} className="max-w-4xl mx-auto space-y-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <input name="firstName" placeholder="First name" required className="px-4 py-3 border border-[#E2E2E2] dark:border-[#555] dark:bg-[#2a2a2a] text-[#333] dark:text-[#e0e0e0] text-[14px] placeholder:text-[#888] focus:border-[#DF3131] focus:ring-2 focus:ring-[#DF3131]/20 outline-none transition-all" />
  <input name="lastName" placeholder="Last name" className="px-4 py-3 border border-[#E2E2E2] dark:border-[#555] dark:bg-[#2a2a2a] text-[#333] dark:text-[#e0e0e0] text-[14px] placeholder:text-[#888] focus:border-[#DF3131] focus:ring-2 focus:ring-[#DF3131]/20 outline-none transition-all" />
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <input name="email" placeholder="Email *" type="email" required className="px-4 py-3 border border-[#E2E2E2] dark:border-[#555] dark:bg-[#2a2a2a] text-[#333] dark:text-[#e0e0e0] text-[14px] placeholder:text-[#888] focus:border-[#DF3131] focus:ring-2 focus:ring-[#DF3131]/20 outline-none transition-all" />
  <input name="phone" placeholder="Phone" type="tel" className="px-4 py-3 border border-[#E2E2E2] dark:border-[#555] dark:bg-[#2a2a2a] text-[#333] dark:text-[#e0e0e0] text-[14px] placeholder:text-[#888] focus:border-[#DF3131] focus:ring-2 focus:ring-[#DF3131]/20 outline-none transition-all" />
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <input name="sizing" placeholder="Explain Sizing + Quantity" className="px-4 py-3 border border-[#E2E2E2] dark:border-[#555] dark:bg-[#2a2a2a] text-[#333] dark:text-[#e0e0e0] text-[14px] placeholder:text-[#888] focus:border-[#DF3131] focus:ring-2 focus:ring-[#DF3131]/20 outline-none transition-all" />
  <select name="product" className="px-4 py-3 border border-[#E2E2E2] dark:border-[#555] dark:bg-[#2a2a2a] text-[14px] text-[#888] dark:text-[#ccc] focus:border-[#DF3131] outline-none">
 <option>Select a Product</option>
 <option>Business Cards</option>
 <option>Flyers & Posters</option>
 <option>Stickers & Decals</option>
 <option>Banners</option>
 <option>T-Shirts & Apparel</option>
 <option>Branded Merch</option>
 </select>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <input name="deadline" placeholder="Project Deadline" type="date" className="px-4 py-3 border border-[#E2E2E2] dark:border-[#555] dark:bg-[#2a2a2a] text-[14px] text-[#888] dark:text-[#ccc] focus:border-[#DF3131] outline-none" />
  <label className="flex items-center gap-2 text-[14px] text-[#666] dark:text-[#b0b0b0]">
  <input name="newsletter" type="checkbox" className="accent-[#DF3131]" /> I want to subscribe to the newsletter.
 </label>
  </div>
  <button type="submit" className="w-full py-4 bg-[#333] text-white font-heading font-bold tracking-[0.15em] uppercase text-[14px] hover:bg-[#DF3131] transition-all hover:scale-[1.01] hover:shadow-lg">
  {quoteSubmitted ? "QUOTE REQUESTED" : "SUBMIT"}
  </button>
 </form>
 </div>
 </ScrollReveal>
 </div>
 </main>
 </>
 );
}
