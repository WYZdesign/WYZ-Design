"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getSiteUrl } from "@/lib/site-url";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  colors: string[];
  image: string;
  hoverImage?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  trending?: number;
  materials?: string[];
}

const FALLBACK_PRODUCTS: Product[] = [
  { id: 1, name: "Denim Tee", category: "Apparel", price: 34.99, description: "Unisex premium denim tee. Heavyweight cotton with a lived-in feel.", colors: ["#282828", "#1B3A5C"], image: "/images/merch/dbc-archive/WYZ-Crown-Unisex-denim-jacket.jpg", rating: 4.8, reviews: 124, badge: "Best Seller", trending: 95 },
  { id: 2, name: "Zip-Up Hoodie", category: "Apparel", price: 64.99, description: "Unisex fleece zip-up hoodie. Brushed interior, metal hardware.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie.jpg", rating: 4.9, reviews: 87, badge: "Premium", trending: 88 },
  { id: 3, name: "Hooded Long Sleeve", category: "Apparel", price: 44.99, description: "Unisex hooded long sleeve tee. Lightweight layering piece.", colors: ["#282828", "#7A8B99"], image: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie-1.jpg", rating: 4.7, reviews: 65, trending: 78 },
  { id: 4, name: "Cropped Hoodie", category: "Apparel", price: 54.99, description: "Women's cropped hoodie. Relaxed fit, raw hem, ribbed cuffs.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/98442d-bd1e1406036d4ba99d4f8197e1495333~mv2.jpg", rating: 4.8, reviews: 52, badge: "New", trending: 72 },
  { id: 5, name: "Ribbed Beanie", category: "Headwear", price: 24.99, description: "Organic ribbed beanie. One-size-fits-all, folded cuff.", colors: ["#282828", "#DF3131", "#FFFFFF"], image: "/images/merch/dbc-archive/98442d-60d7fe9cb1a14d4696d62ca1b5902cdf~mv2.jpg", rating: 4.7, reviews: 203, badge: "Popular", trending: 92 },
  { id: 6, name: "Snapback Cap", category: "Headwear", price: 32.99, description: "Adjustable snapback cap. Structured crown, flat visor.", colors: ["#282828", "#DF3131", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Dad-hat.jpg", rating: 4.7, reviews: 89, trending: 85 },
  { id: 7, name: "Crop Top", category: "Apparel", price: 29.99, description: "Classic crop top. Premium ring-spun cotton, retail fit.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/98442d-c13840a266e44b959886dc63b5826213~mv2.jpg", rating: 4.6, reviews: 156, trending: 80 },
  { id: 8, name: "Denim Tote Bag", category: "Accessories", price: 39.65, description: "Organic denim tote bag. Spacious, functional, everyday use.", colors: ["#282828"], image: "/images/merch/dbc-archive/WYZ-Crown-Organic-denim-tote-bag.jpg", rating: 4.5, reviews: 45, trending: 62 },
  { id: 9, name: "Ceramic Mug", category: "Accessories", price: 14.99, description: "Black glossy ceramic mug. 11oz, dishwasher safe.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-White-glossy-mug.jpg", rating: 4.6, reviews: 189, trending: 72 },
  { id: 10, name: "Stainless Tumbler", category: "Accessories", price: 27.78, description: "Stainless steel tumbler. Protects against peeling and fading.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Stainless-steel-tumbler.jpg", rating: 4.8, reviews: 76, trending: 60 },
  { id: 11, name: "Embroidered Patches", category: "Accessories", price: 11.87, description: "Embroidered patches. Durable twill fabric, adds color to any outfit.", colors: ["#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Embroidered-patches.jpg", rating: 4.9, reviews: 54, badge: "Value", trending: 78 },
  { id: 12, name: "Embroidered Socks", category: "Accessories", price: 29.77, description: "Embroidered socks. Bold minimalist look, US-made.", colors: ["#282828", "#999999", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Embroidered-socks.jpg", rating: 4.7, reviews: 67, trending: 55 },
  { id: 13, name: "Water Bottle", category: "Accessories", price: 22.00, description: "Flip straw water bottle. BPA-free, on-the-go hydration.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Flip-straw-water-bottle.jpg", rating: 4.5, reviews: 41, trending: 48 },
  { id: 14, name: "Organic Apron", category: "Accessories", price: 32.18, description: "Organic cotton apron. 100% organic, sturdy cotton.", colors: ["#282828"], image: "/images/merch/dbc-archive/WYZ-Crown-Organic-cotton-apron.jpg", rating: 4.6, reviews: 33, trending: 42 },
];

const ARCHIVE_IMAGES = [
  "/images/merch/dbc-archive/98442d-488e206ac0954202bc9563140aa2b55b~mv2.jpg",
  "/images/merch/dbc-archive/98442d-b3c114b8dab6450887e3d3aee9c71030~mv2.jpg",
  "/images/merch/dbc-archive/98442d-bd1e1406036d4ba99d4f8197e1495337~mv2.jpg",
  "/images/merch/dbc-archive/98442d-c13840a266e44b959886dc63b5826213~mv2.jpg",
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
const FAOTM_URL = "/featured-artist";
const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <svg className="w-3.5 h-3.5 text-[#DF3131]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span className="text-[12px] font-heading font-bold text-[#DF3131]">{rating}</span>
    </div>
  );
}

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
      {/* Accordion gallery of crew wearing merch — panels expand on hover */}
      <div className="absolute inset-0 flex">
        {ARCHIVE_IMAGES.slice(0, 6).map((img, i) => (
          <div key={i} className="relative flex-1 group overflow-hidden transition-all duration-700 ease-out hover:flex-[3.5]">
            <SafeImage src={img} alt={`DBC crew wearing merch ${i + 1}`} className="w-full h-full object-cover" />
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
    <section className="py-12 sm:py-16 bg-[#FEFEFD]">
      <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-[11px] sm:text-[13px] font-bold tracking-[0.3em] uppercase text-[#DF3131] block mb-2">WHY DBC MERCH</span>
          <h2 className="text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.06em]">Built By The Crew, For The Crew</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f) => (
            <div key={f.title} className="bg-white dark:bg-[#252528] p-6 sm:p-8 rounded-xl border border-[#E2E2E2] dark:border-[#444] shadow-sm hover:shadow-xl hover:shadow-[#DF3131]/10 transition-all text-center">
              <div className="text-[2.5rem] sm:text-[3rem] mb-4">{f.icon}</div>
              <h3 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[1.1rem] tracking-[0.05em] mb-2">{f.title}</h3>
              <p className="text-[#666] dark:text-[#999] text-[14px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const DBC_MODEL_MOCKUPS = [
  { id: 1, name: "Denim Jacket", category: "Outerwear", price: 89.99, img: "/images/merch/dbc-archive/WYZ-Crown-Unisex-denim-jacket.jpg", model: "/images/merch/dbc-archive/98442d-488e206ac0954202bc9563140aa2b55b~mv2.jpg" },
  { id: 2, name: "Zip-Up Hoodie", category: "Apparel", price: 64.99, img: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie.jpg", model: "/images/merch/dbc-archive/98442d-b3c114b8dab6450887e3d3aee9c71030~mv2.jpg" },
  { id: 3, name: "Crown Tee", category: "Apparel", price: 34.99, img: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie-1.jpg", model: "/images/merch/dbc-archive/98442d-bd1e1406036d4ba99d4f8197e1495337~mv2.jpg" },
  { id: 4, name: "Dad Hat", category: "Headwear", price: 32.99, img: "/images/merch/dbc-archive/WYZ-Crown-Dad-hat.jpg", model: "/images/merch/dbc-archive/98442d-c13840a266e44b959886dc63b5826213~mv2.jpg" },
  { id: 5, name: "Ribbed Beanie", category: "Headwear", price: 24.99, img: "/images/merch/dbc-archive/WYZ-Crown-Embroidered-patches.jpg", model: "/images/merch/dbc-archive/98442d-95706f79d3f649dd9dda6bc28ef99f65~mv2.jpg" },
  { id: 6, name: "Embroidered Socks", category: "Accessories", price: 29.77, img: "/images/merch/dbc-archive/WYZ-Crown-Embroidered-socks.jpg", model: "/images/merch/dbc-archive/98442d-a35038eae10c4de8a68b7ca3aa5f28f3~mv2.jpg" },
  { id: 7, name: "White Glossy Mug", category: "Accessories", price: 14.99, img: "/images/merch/dbc-archive/WYZ-Crown-White-glossy-mug.jpg", model: "/images/merch/dbc-archive/98442d-71e847c4dd9546b0bef2a69d72d2baa6~mv2.jpg" },
  { id: 8, name: "Denim Tote Bag", category: "Accessories", price: 39.65, img: "/images/merch/dbc-archive/WYZ-Crown-Organic-denim-tote-bag.jpg", model: "/images/merch/dbc-archive/98442d-7ef7fb49e39942f687d13018406e72a8~mv2.jpg" },
];

function AccordionGallery() {
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);
  return (
    <ErrorBoundary fallback={
      <section className="py-12 bg-[#FEFEFD]">
        <div className="max-w-[130rem] mx-auto px-6 lg:px-12 text-center">
          <p className="text-[#666]">Crew gallery temporarily unavailable</p>
        </div>
      </section>
    }>
    <section className="py-12 bg-[#FEFEFD]">
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
                  <SafeImage src={item.model} alt={item.name} className="w-full h-full object-cover" />
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

function DynamicContentUnderShop() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const designStories = [
    { id: 1, name: "Crown Tee", image: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie-1.jpg", story: "The Crown. A nod to the crew's roots. Printed on premium heavyweight cotton. Each tee is hand-checked before shipping.", meaning: "Represents the crew's identity — the crown symbol is a mark of belonging." },
    { id: 2, name: "Denim Jacket", image: "/images/merch/dbc-archive/WYZ-Crown-Unisex-denim-jacket.jpg", story: "Built to last. vintage-wash denim with custom DBC embroidery. One-of-a-kind — no two are exactly the same. Worn by the crew on location.", meaning: "The jacket is the crew's uniform — durable, timeless, and impossible to ignore." },
    { id: 3, name: "Crop Hoodie", image: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie.jpg", story: "The crew's favorite. Brushed fleece inside, raw hem, custom DBC tag. Limited drops — once they're gone, they're gone.", meaning: "Scarcity is part of the story. Not everything is available forever." },
    { id: 4, name: "Dad Hat", image: "/images/merch/dbc-archive/WYZ-Crown-Dad-hat.jpg", story: "Structured crown, flat visor. Adjustable snapback. The DBC dad hat is the crew's on-duty uniform. Worn from the studio to the street.", meaning: "The hat is the crew's flag — visible even when no one is speaking." },
    { id: 5, name: "Ribbed Beanie", image: "/images/merch/dbc-archive/98442d-60d7fe9cb1a14d4696d62ca1b5902cdf~mv2.jpg", story: "Organic ribbed beanie. One-size-fits-all. Folded cuff with DBC embroidery. The winter staple — crew-tested in freezing conditions.", meaning: "Warmth matters. The beanie is the crew's armor against the elements." },
    { id: 6, name: "Embroidered Socks", image: "/images/merch/dbc-archive/WYZ-Crown-Embroidered-socks.jpg", story: "Bold minimalist look. US-made. DBC crown embroidered along the ankle. The detail the camera never catches — but the crew knows.", meaning: "The small details are where the crew shows who they really are." },
    { id: 7, name: "White Glossy Mug", image: "/images/merch/dbc-archive/WYZ-Crown-White-glossy-mug.jpg", story: "11oz black glossy ceramic. Dishwasher safe. The morning ritual, with DBC on the side. The crew drinks coffee before every session.", meaning: "The mug is the crew's downtime — the small moments between the noise." },
    { id: 8, name: "Denim Tote Bag", image: "/images/merch/dbc-archive/WYZ-Crown-Organic-denim-tote-bag.jpg", story: "Organic denim tote. Spacious, functional. Built for the crew's gear — cameras, sketches, vinyl, whatever the session demands.", meaning: "The tote carries the crew's tools. Without it, nothing moves." },
  ];
  return (
    <ErrorBoundary fallback={
      <section className="py-12 sm:py-16 bg-[#FEFEFD]">
        <div className="max-w-[130rem] mx-auto px-6 lg:px-12 text-center">
          <p className="text-[#666]">Crew content temporarily unavailable</p>
        </div>
      </section>
    }>
    <section className="py-12 sm:py-16 bg-[#FEFEFD]">
      <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#DF3131] block mb-2">EVERY PIECE HAS A STORY</span>
          <h2 className="text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.06em]">Built From The Crew, For The Crew</h2>
          <p className="text-[#666] dark:text-[#999] text-[15px] max-w-2xl mx-auto mt-3">Every design comes from a real artist with a real story. No generic graphics. No mass-produced templates. Just art that means something.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {designStories.map((d) => (
            <div key={d.id} className="group cursor-pointer" onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}>
              <div className="aspect-[3/4] rounded-lg overflow-hidden border border-[#E2E2E2] dark:border-[#444] bg-[#f5f5f5] mb-3">
                <SafeImage src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h4 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[1.1rem] tracking-[0.04em] mb-2">{d.name}</h4>
              <div className={`overflow-hidden transition-all duration-500 ${expandedId === d.id ? "max-h-[200px]" : "max-h-0"}`}>
                <div className="pb-4">
                  <p className="text-[#666] dark:text-[#999] text-[14px] leading-relaxed mb-2">{d.story}</p>
                  <p className="text-[#DF3131] dark:text-[#DF3131] text-[13px] font-bold tracking-[0.05em] uppercase">{d.meaning}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </ErrorBoundary>
  );
}

function SquareQuote() {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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
          <div className="relative h-64 md:h-auto">
            <SafeImage src="/images/merch/dbc-archive/98442d-488e206ac0954202bc9563140aa2b55b~mv2.jpg" alt="Featured Artist" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111]/80 hidden md:block" />
          </div>
          <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#DF3131] mb-3">Featured Artist of the Month</span>
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

function MerchCarousel({ products }: { products: Product[] }) {
  const items = [...products, ...products, ...products];
  return (
    <div className="py-8 bg-[#FEFEFD] overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-[#DF3131] scrollbar-track-[#f5f5f5]">
      <div className="flex whitespace-nowrap animate-marquee-left hover:[animation-play-state:paused]">
        {items.map((p, i) => (
          <Link key={`mc-${i}`} href={`/merch/${p.id}`} className="flex-none cursor-pointer w-[140px] sm:w-auto">
              <div className="bg-[#f5f5f5] w-full sm:w-[200px] aspect-[3/4] overflow-hidden relative mx-2 sm:mx-3 shadow-lg hover:shadow-2xl hover:shadow-[#DF3131]/20 transition-all duration-500 hover:-translate-y-2">
               <SafeImage src={p.image} alt={p.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-heading font-bold text-[12px] tracking-[0.05em] uppercase text-white">{p.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProductMarquee({ products }: { products: Product[] }) {
  const items = [...products, ...products, ...products];
  return (
    <div className="relative overflow-x-auto overflow-y-hidden bg-gradient-to-r from-[#0a0a0a] via-[#1a0a0a] to-[#0a0a0a] py-10 border-y border-white/10 scrollbar-thin scrollbar-thumb-[#DF3131] scrollbar-track-black/20">
      <div className="flex whitespace-nowrap animate-marquee-left min-w-max">
        {items.map((p, i) => (
          <Link key={`pm-${i}`} href={`/merch/${p.id}`} className="flex-none cursor-pointer group">
            <div className="w-[140px] sm:w-[200px] lg:w-[240px] px-2 sm:px-4 aspect-square flex flex-col items-center">
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden relative flex-1 w-full mb-2 group-hover:border-[#DF3131]/50 group-hover:shadow-xl group-hover:shadow-[#DF3131]/20 transition-all duration-500">
                <SafeImage src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="w-full text-center">
                <h4 className="font-heading font-bold text-white text-[11px] tracking-[0.05em] uppercase truncate">{p.name}</h4>
                <span className="text-[#DF3131] font-bold text-[13px]">${p.price.toFixed(2)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ScatteredGrid({ products, onSelect }: { products: Product[]; onSelect: (p: Product) => void }) {
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
        return (
          <div key={product.id} className="group cursor-pointer" onClick={() => onSelect(product)}
            style={{
              transform: `rotate(${pos.rotate}deg) translate(${pos.offsetX}px, ${pos.offsetY}px) scale(${pos.scale})`,
              transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
            }}>
            <div className="bg-[#f5f5f5] aspect-[3/4] overflow-hidden relative mb-3 shadow-lg group-hover:shadow-2xl group-hover:shadow-[#DF3131]/20 transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-105">
              <SafeImage src={product.image} alt={product.name} fill sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" decoding="async" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white/70 text-[7px] font-bold tracking-[0.15em] uppercase .5 mb-2">{product.category}</p>
                <p className="text-white font-heading font-bold text-[8px] tracking-[0.03em] uppercase mb-2">{product.name}</p>
                 <p className="text-[#DF3131] font-black text-[11px]">${product.price.toFixed(2)}</p>
              </div>
              {product.badge && <span className="absolute top-2 left-2 bg-[#DF3131] text-white text-[9px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 z-10 mb-2">{product.badge}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProductGrid({ products, onSelect }: { products: Product[]; onSelect: (p: Product) => void }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8">
      {products.map((product) => (
        <div key={product.id} className="group cursor-pointer"
          onMouseEnter={() => setHoveredId(product.id)} onMouseLeave={() => setHoveredId(null)}
          onClick={() => onSelect(product)}>
          <div className={`bg-[#f5f5f5] aspect-[4/5] overflow-hidden relative mb-2 transition-all duration-500 ${hoveredId === product.id ? "shadow-2xl shadow-[#DF3131]/20 -translate-y-2" : "shadow-sm"}`}>
               <SafeImage src={product.image} alt={product.name} fill sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw" className={`w-full h-full object-cover transition-transform duration-700 ${hoveredId === product.id ? "scale-110" : "scale-100"}`} decoding="async" />
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${hoveredId === product.id ? "opacity-100" : "opacity-0"}`}>
              <span className="bg-white text-[#333] text-[8px] font-bold tracking-[0.1em] uppercase px-4 py-2 hover:bg-[#DF3131] hover:text-white transition-all mb-2">Quick View</span>
            </div>
            {product.badge && <span className="absolute top-2 left-2 bg-[#DF3131] text-white text-[9px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 z-10 mb-2">{product.badge}</span>}
          </div>
          <div className="text-center px-1">
            <p className="text-[10px] text-[#666] font-bold tracking-[0.12em] uppercase .5 mb-2">{product.category}</p>
            <h3 className="text-[9px] sm:text-[10px] font-heading font-bold tracking-[0.03em] uppercase text-[#333] leading-tight line-clamp-2 group-hover:text-[#DF3131] transition-colors mb-3">{product.name}</h3>
            <p className="text-[#DF3131] font-black text-[11px] whitespace-nowrap">${product.price.toFixed(2)}</p>
          </div>
          {product.rating && (
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <StarRating rating={product.rating} />
              <span className="text-[10px] text-[#666]">({product.reviews})</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function MerchPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("trending");
  const [storeMode, setStoreMode] = useState<"grid" | "explore">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickColor, setQuickColor] = useState(0);
  const [quickSize, setQuickSize] = useState("M");
  const [products, setProducts] = useState<Product[]>([]);
  const [showStore, setShowStore] = useState(false);
  const [storeVisible, setStoreVisible] = useState(false);
  const [portalAnimating, setPortalAnimating] = useState(false);

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
          if (!data.products?.length) return;
          const printfulProducts: Product[] = data.products.map((p: Record<string, unknown>) => ({
            id: p.id as number,
            name: p.title as string,
            category: (p.category as string) || "Apparel",
            price: (p.price as number) || 0,
            description: `Custom ${p.title}, Dying Breed Crew x WYZ Design`,
            colors: ["#333333", "#DF3131", "#FFFFFF"],
            image: (p.image as string) || "/images/merch/dbc-archive/WYZ-Crown-Dad-hat.jpg",
            rating: 4.7,
            reviews: Math.floor(Math.random() * 150) + 20,
            trending: Math.floor(Math.random() * 40) + 60,
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
      case "trending": result.sort((a, b) => (b.trending ?? 0) - (a.trending ?? 0)); break;
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
    }
    return result;
  }, [activeCategory, sortBy, products]);

  const crossSells = useMemo(() => {
    if (!selectedProduct) return [];
    return products.filter((p) => p.id !== selectedProduct.id && p.category === selectedProduct.category).slice(0, 4);
  }, [selectedProduct, products]);

  const handleToggleStore = () => {
    if (!showStore) {
      setPortalAnimating(true);
      setShowStore(true);
      setTimeout(() => setStoreVisible(true), 200);
      setTimeout(() => setPortalAnimating(false), 1200);
    } else {
      setStoreVisible(false);
      setPortalAnimating(true);
      setTimeout(() => {
        setShowStore(false);
        setPortalAnimating(false);
      }, 800);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-[#FEFEFD]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "WYZ Design Merch Store",
              description: "Premium apparel, headwear, and accessories from the Dying Breed Crew collection.",
              itemListElement: products.slice(0, 10).map((product, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Product",
                  name: product.name,
                  description: product.description,
                  image: `${getSiteUrl()}${product.image}`,
                  offers: {
                    "@type": "Offer",
                    price: product.price.toFixed(2),
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock",
                    url: `${getSiteUrl()}/merch/${product.id}`,
                  },
                  brand: { "@type": "Organization", name: "WYZ Design" },
                },
              })),
            }),
          }}
        />
        <ParallaxHero />
        <DynamicContentUnderHero />

        {/* Gallery Carousel 1 — under hero */}
        <div className="py-6 bg-[#111] overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-[#DF3131] scrollbar-track-black/20">
          <div className="flex whitespace-nowrap min-w-max">
            {[...ARCHIVE_IMAGES, ...ARCHIVE_IMAGES, ...ARCHIVE_IMAGES].map((img, i) => (
              <div key={`gc1-${i}`} className="relative flex-shrink-0 h-56 sm:h-72 overflow-hidden mx-2">
                <SafeImage src={img} alt="DBC mockup" className="h-full w-auto object-contain hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Auto-Scroll Merch Gallery — Black-to-Red Gradient Background (only renders after catalog loads) */}
        {products.length > 0 && (
          <div className="relative overflow-hidden bg-gradient-to-b from-black via-[#1a0a0a] to-[#111] py-16 border-y border-white/5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#DF3131] to-transparent opacity-50" />
            <div className="text-center mb-10">
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#DF3131] block mb-2">DBC CREW COLLECTION</span>
              <h3 className="text-[1.5rem] sm:text-[2rem] font-heading font-black text-white tracking-[0.05em]">Worn By The Crew</h3>
            </div>
            <ProductMarquee products={products} />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#DF3131] to-transparent opacity-50" />
          </div>
        )}

        {/* Product Name Marquee Strip (only renders after catalog loads) */}
        {products.length > 0 && (
          <div className="relative overflow-hidden bg-[#111] py-3 border-y border-white/5">
            <div className="flex whitespace-nowrap animate-marquee-left">
              {[...products, ...products, ...products].map((p, i) => (
                <span key={`pm1-${i}`} className="flex-none text-white/20 text-[11px] font-heading font-bold tracking-[0.15em] uppercase px-6 mb-2">{p.name}</span>
              ))}
            </div>
          </div>
        )}

        {/* Brand Statement — Animated Square Quote */}
        <section className="py-20 px-6">
          <ScrollReveal animation="fadeUp">
            <SquareQuote />
          </ScrollReveal>
        </section>

        {/* Merch Carousel (only renders after catalog loads) */}
        {products.length > 0 && (
          <ScrollReveal animation="fadeUp" delay={0.1}>
            <MerchCarousel products={products} />
          </ScrollReveal>
        )}

        {/* Enter Store Toggle */}
        <section className="py-16 px-6 text-center" id="shop">
          <ScrollReveal animation="fadeUp">
            <p className="text-[11px] text-[#666] font-bold tracking-[0.2em] uppercase mb-2">Print-on-Demand via Printful</p>
            <h2 className="text-[1.5rem] sm:text-[2rem] font-heading font-black text-[#333] tracking-[0.05em] mb-4">The Collection</h2>
            <button onClick={handleToggleStore}
              className={`group px-10 py-4 text-[13px] font-bold tracking-[0.15em] uppercase transition-all border-2 ${showStore ? "bg-[#DF3131] text-white border-[#DF3131]" : "bg-transparent text-[#333] border-[#333] hover:bg-[#333] hover:text-white"}`}>
              {showStore ? "Hide Store" : "Enter Store"}
              {!showStore && (
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  <svg className="w-4 h-4 inline-block animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </span>
              )}
            </button>
            {!showStore && <p className="text-[11px] text-[#666] mt-3 tracking-wider animate-pulse">Click to expand the store</p>}
          </ScrollReveal>
        </section>

        {/* Store Section — Portal Expansion */}
        <div className="relative">
          <style>{`
            @keyframes portalOpen {
              0% {
                clip-path: circle(0% at 50% 50%);
                filter: blur(20px);
                opacity: 0;
              }
              40% {
                filter: blur(8px);
                opacity: 0.6;
              }
              100% {
                clip-path: circle(75% at 50% 50%);
                filter: blur(0px);
                opacity: 1;
              }
            }
            @keyframes portalClose {
              0% {
                clip-path: circle(75% at 50% 50%);
                filter: blur(0px);
                opacity: 1;
              }
              100% {
                clip-path: circle(0% at 50% 50%);
                filter: blur(20px);
                opacity: 0;
              }
            }
            @keyframes floatGeo1 {
              0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.15; }
              50% { transform: translateY(-30px) rotate(180deg); opacity: 0.3; }
            }
            @keyframes floatGeo2 {
              0%, 100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.1; }
              50% { transform: translateY(-20px) rotate(-120deg) scale(1.2); opacity: 0.25; }
            }
            @keyframes floatGeo3 {
              0%, 100% { transform: translateX(0) rotate(0deg); opacity: 0.12; }
              50% { transform: translateX(15px) rotate(90deg); opacity: 0.22; }
            }
            @keyframes portalGlow {
              0%, 100% { box-shadow: 0 0 60px rgba(223, 49, 49, 0.0); }
              50% { box-shadow: 0 0 80px rgba(223, 49, 49, 0.15); }
            }
            @keyframes staggerFadeIn {
              from { opacity: 0; transform: translateY(16px); filter: blur(4px); }
              to { opacity: 1; transform: translateY(0); filter: blur(0); }
            }
            .portal-enter {
              animation: portalOpen 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
            .portal-exit {
              animation: portalClose 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            .stagger-1 { animation: staggerFadeIn 0.6s ease-out 0.3s forwards; opacity: 0; }
            .stagger-2 { animation: staggerFadeIn 0.6s ease-out 0.5s forwards; opacity: 0; }
            .stagger-3 { animation: staggerFadeIn 0.6s ease-out 0.7s forwards; opacity: 0; }
            .stagger-4 { animation: staggerFadeIn 0.6s ease-out 0.9s forwards; opacity: 0; }
            .stagger-5 { animation: staggerFadeIn 0.6s ease-out 1.1s forwards; opacity: 0; }
          `}</style>

          {/* Floating geometric decorations */}
          {showStore && (
            <>
              <div className="absolute top-10 left-[10%] w-16 h-16 border border-[#DF3131]/20 rotate-45 pointer-events-none z-20"
                style={{ animation: "floatGeo1 6s ease-in-out infinite" }} />
              <div className="absolute top-32 right-[15%] w-8 h-8 rounded-full border border-[#D49341]/20 pointer-events-none z-20"
                style={{ animation: "floatGeo2 8s ease-in-out infinite 1s" }} />
              <div className="absolute bottom-20 left-[20%] w-12 h-12 border border-[#DF3131]/15 pointer-events-none z-20"
                style={{ animation: "floatGeo3 7s ease-in-out infinite 0.5s", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
              <div className="absolute top-1/2 right-[8%] w-6 h-6 bg-[#DF3131]/10 rounded-full pointer-events-none z-20"
                style={{ animation: "floatGeo1 9s ease-in-out infinite 2s" }} />
              <div className="absolute bottom-1/3 left-[5%] w-10 h-10 border border-white/10 pointer-events-none z-20"
                style={{ animation: "floatGeo2 10s ease-in-out infinite 1.5s", clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }} />
            </>
          )}

          {showStore && storeVisible && (
            <div className="portal-enter stagger-1 relative z-10">
              <AccordionGallery />
            </div>
          )}
          {!showStore && storeVisible && (
            <div className="portal-exit stagger-1 relative z-10">
              <AccordionGallery />
            </div>
          )}
        </div>


      </main>

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-[#f5f5f5] aspect-square flex items-center justify-center overflow-hidden relative">
                <SafeImage src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                {selectedProduct.badge && <span className="absolute top-3 left-3 bg-[#DF3131] text-white text-[10px] font-bold px-3 py-1">{selectedProduct.badge}</span>}
              </div>
              <div className="p-8">
                <button onClick={() => setSelectedProduct(null)} className="text-[#666] hover:text-[#333] text-[15px] mb-4 block">&larr; Back to shop</button>
                <p className="text-[12px] text-[#666] font-heading font-bold tracking-[0.1em] uppercase mb-2">{selectedProduct.category}</p>
                <h2 className="text-[1.5rem] font-heading font-bold tracking-[0.1em] uppercase text-[#333] mb-4">{selectedProduct.name}</h2>
                <p className="text-[1.5rem] font-bold text-[#DF3131] mb-4">${selectedProduct.price.toFixed(2)}</p>
                <p className="text-[14px] text-[#666] mb-4">{selectedProduct.description}</p>
                {selectedProduct.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <StarRating rating={selectedProduct.rating} />
                    <span className="text-[12px] text-[#666]">{selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-[12px] font-heading font-bold tracking-[0.1em] uppercase text-[#666] mb-2">Color</p>
                  <div className="flex gap-2">
                    {selectedProduct.colors.map((color, i) => (
                      <button key={i} onClick={() => setQuickColor(i)}
                        className={`w-9 h-9 rounded-full border-2 transition-all ${quickColor === i ? "border-[#DF3131] ring-2 ring-[#DF3131]/30 scale-110" : "border-[#ccc] hover:scale-105"}`}
                        style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-[12px] font-heading font-bold tracking-[0.1em] uppercase text-[#666] mb-2">Size</p>
                  <div className="flex gap-2">
                    {["XS", "S", "M", "L", "XL", "2XL"].map((size) => (
                      <button key={size} onClick={() => setQuickSize(size)}
                        className={`w-11 h-11 border text-[14px] font-semibold transition-all ${quickSize === size ? "bg-[#DF3131] text-white border-[#DF3131] scale-105" : "border-[#ccc] hover:border-[#DF3131]"}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <Link href={FAOTM_URL}
                  className="block w-full py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.15em] uppercase text-center transition-all text-[14px] hover:bg-[#B82020]">
                  Shop the FAOTM Art Store
                </Link>
                <p className="text-center text-[12px] text-[#666] mt-3">Each month features a new independent artist</p>
              </div>
            </div>
            {crossSells.length > 0 && (
              <div className="border-t border-[#E2E2E2] p-8">
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#999] mb-2">You might also like</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {crossSells.map((cp) => (
                    <button key={cp.id} onClick={() => { setSelectedProduct(cp); setQuickColor(0); setQuickSize("M"); }} className="text-left group">
<div className="bg-[#f5f5f5] aspect-square overflow-hidden mb-2">
                           <SafeImage src={cp.image} alt={cp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <p className="text-[11px] font-bold text-[#333] truncate">{cp.name}</p>
                      <p className="text-[12px] text-[#DF3131] font-bold">${cp.price.toFixed(2)}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    {/* Dynamic Content — under expandable shop */}
    <DynamicContentUnderShop />

    {/* Gallery Carousel 2 — under store */}
    <div className="py-6 bg-[#111] overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-[#DF3131] scrollbar-track-black/20">
      <div className="flex whitespace-nowrap min-w-max">
        {[...ARCHIVE_IMAGES, ...ARCHIVE_IMAGES, ...ARCHIVE_IMAGES].map((img, i) => (
          <div key={`gc2-${i}`} className="relative flex-shrink-0 h-56 sm:h-72 overflow-hidden mx-2">
            <SafeImage src={img} alt="DBC mockup" className="h-full w-auto object-contain hover:scale-110 transition-transform duration-500" />
          </div>
        ))}
      </div>
      </div>
    </>
  );
}
