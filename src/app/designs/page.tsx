"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiSearch, FiCpu } from "react-icons/fi";
import ScrollReveal from "@/components/ScrollReveal";
import ParallaxVideo from "@/components/ParallaxVideo";
import { LOGOS_IMAGES, COVER_ART_WYZ, FLYERS_IMAGES } from "@/data/designs-data";
import EnhancedMarquee from "@/components/EnhancedMarquee";
import ScrollParallaxCard from "@/components/ScrollParallaxCard";
import ImageHoverReveal from "@/components/ImageHoverReveal";

function shuffleArray<T>(arr: T[]): T[] {
 const a = [...arr];
 for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
 return a;
}

const FALLBACK_MERCH = [
 { name: "Cute Ghost Hat", price: "$35.00", img: "/images/wix-extracted/designs/merch/designs_merch_00_98442d_9a9d17df21e54a95832a6eefa209cf53.jpg.jpg" },
 { name: "WYZ Logo Hoodie", price: "$45.00", img: "/images/wix-extracted/designs/merch/designs_merch_01_98442d_cf50acabf53341bab93848f757fe46a8.jpg.jpg" },
 { name: "Anime Tee", price: "$25.00", img: "/images/wix-extracted/designs/merch/designs_merch_02_98442d_502b0119f4e4494888a4a3c7ac88cc0c.jpg.jpg" },
 { name: "Cyberpunk Cap", price: "$30.00", img: "/images/wix-extracted/designs/merch/designs_merch_03_98442d_e4e50dc9a3b141c8b391f2484691794d.jpg.jpg" },
 { name: "Neon Frog Tee", price: "$25.00", img: "/images/wix-extracted/designs/merch/designs_merch_04_98442d_8d5eabc9f79e4dd4a260d5cddef772c4.jpg.jpg" },
 { name: "Studio Backpack", price: "$55.00", img: "/images/wix-extracted/designs/merch/designs_merch_05_98442d_9fc8ea304a2a4858a0966d2f4522a94c.jpg.jpg" },
 { name: "Retro Mug", price: "$15.00", img: "/images/wix-extracted/designs/merch/designs_merch_06_98442d_92fc84c3f5f6450e97f33be06603d04d.jpg.jpg" },
 { name: "WYZ Sticker Pack", price: "$10.00", img: "/images/wix-extracted/designs/merch/designs_merch_07_98442d_f1f818f6a1e042639783e9458b3235da.jpg.jpg" },
];

function usePrintfulMerch() {
 const [products, setProducts] = useState(FALLBACK_MERCH);
 useEffect(() => {
 fetch("/api/printful-catalog")
 .then((r) => r.json())
 .then((data) => {
 if (!data.products?.length) return;
 setProducts(data.products.map((p: any) => ({
 name: p.title,
 price: `$${p.price.toFixed(2)}`,
 img: p.image || "/images/wix-extracted/designs/merch/designs_merch_00.jpg.jpg",
 })));
 })
 .catch(() => {});
 }, []);
 return products;
}

function SimpleLightbox({ src, alt, onClose }: { src: string; alt?: string; onClose: () => void }) {
 const hk = useCallback((e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }, [onClose]);
 useEffect(() => {
 document.addEventListener("keydown", hk);
 document.body.style.overflow = "hidden";
 return () => { document.removeEventListener("keydown", hk); document.body.style.overflow = ""; };
 }, [hk]);
 return (
 <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center cursor-pointer" onClick={onClose}>
 <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[210] text-white/60 hover:text-white transition-colors w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:border-white/40">✕</button>
  <Image src={src} alt={alt || "Design preview"} width={1200} height={800} className="max-w-[92vw] max-h-[92vh] object-contain" onClick={(e) => e.stopPropagation()} loading="lazy" />
 </div>
 );
}

function useInView(threshold = 0.1) {
 const ref = useRef<HTMLDivElement>(null);
 const [vis, setVis] = useState(false);
 useEffect(() => {
 const el = ref.current;
 if (!el) return;
 const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect(); } }, { threshold });
 o.observe(el);
 return () => o.disconnect();
 }, [threshold]);
 return { ref, vis };
}

function Carousel({ images, direction = "left", whiteBgInDark }: { images: string[]; direction?: "left" | "right"; whiteBgInDark?: boolean }) {
 const scrollRef = useRef<HTMLDivElement>(null);
 const paused = useRef(false);
 const lastTime = useRef<number>(0);
 const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

 useEffect(() => {
 const el = scrollRef.current;
 if (!el) return;
 let raf: number;
 const dir = direction === "right" ? -1 : 1;

 const tick = (now: number) => {
 if (!lastTime.current) lastTime.current = now;
 const dt = (now - lastTime.current) / 1000;
 lastTime.current = now;

 if (!paused.current && el.scrollWidth > 0) {
 const oneSet = el.scrollWidth / 3;
 el.scrollLeft += 33.6 * dt * dir;
 if (direction === "left" && el.scrollLeft >= oneSet * 2) {
 el.scrollLeft -= oneSet;
 } else if (direction === "right" && el.scrollLeft <= 0) {
 el.scrollLeft += oneSet;
 }
 }
 raf = requestAnimationFrame(tick);
 };
 raf = requestAnimationFrame(tick);
 return () => cancelAnimationFrame(raf);
 }, [direction]);

 const handleClick = () => {
 paused.current = true;
 if (clickTimer.current) clearTimeout(clickTimer.current);
 clickTimer.current = setTimeout(() => { paused.current = false; }, 3000);
 };

return (
  <div className="overflow-hidden" onClick={handleClick}>
  <div
  ref={scrollRef}
  className="flex flex-nowrap gap-2 cursor-pointer no-scrollbar"
  style={{ overflowX: "auto" }}
  >
  {[...images, ...images, ...images].map((src, i) => (
  <button key={i} className={`flex-none w-[30vw] sm:w-[210px] md:w-[230px] h-24 sm:h-36 md:h-52 relative overflow-hidden group cursor-pointer ${whiteBgInDark ? "dark:bg-white" : "dark:bg-[#252528]"}`}>
  <Image src={src} alt="WYZ Design portfolio" fill className="w-full h-full object-cover group-hover:scale-95 transition-transform duration-700" priority />
  </button>
  ))}
 </div>
 </div>
 );
}

function AccordionServiceCard({ img, title, desc, accent = "#DF3131", isOpen, onToggle }: {
 img: string; title: string; desc: string; accent?: string; isOpen: boolean; onToggle: () => void;
}) {
 const contentRef = useRef<HTMLDivElement>(null);
 return (
  <div className="w-full overflow-hidden border-b border-[#E2E2E2] dark:border-[#444] last:border-b-0">
 <button
 onClick={onToggle}
 className="w-full flex items-center gap-4 py-5 px-6 lg:px-10 text-left hover:bg-gray-50 transition-colors group"
 >
 <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300" style={{ background: isOpen ? accent : "transparent", border: isOpen ? "none" : `2px solid ${accent}` }}>
 <span className="text-[18px] font-bold transition-all duration-300" style={{ color: isOpen ? "white" : accent, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
 </div>
 <div className="flex-1">
  <h3 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[20px] sm:text-[24px] tracking-[0.04em] leading-snug mb-3">{title}</h3>
 </div>
  <div className="hidden sm:block w-[60px] h-[60px] relative rounded-lg overflow-hidden flex-shrink-0">
  <Image src={img} alt={title} fill className="w-full h-full object-cover" priority />
  </div>
 </button>
 <div
 ref={contentRef}
 className="overflow-hidden transition-all duration-500 ease-in-out"
 style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight || 500}px` : "0px" }}
 >
 <div className="flex flex-col sm:flex-row">
  <div className="w-full sm:w-[45%] h-[200px] sm:h-[250px] overflow-hidden relative">
  <Image src={img} alt={title} fill className="w-full h-full object-cover" priority />
  </div>
 <div className="w-full sm:w-[55%] px-6 lg:px-10 py-6 flex flex-col justify-center">
  <p className="text-[17px] text-[#666] dark:text-[#b0b0b0] leading-[1.7] mb-5">{desc}</p>
  <Link href="/booking" className="inline-flex items-center gap-2 px-6 py-3 text-[12px] sm:text-[15px] font-bold tracking-[0.08em] text-white text-center transition-all hover:scale-105" style={{ background: accent }}>
  GET A QUOTE <FiArrowRight className="w-4 h-4" />
  </Link>
 </div>
 </div>
 </div>
 </div>
 );
}

function ScrollArrows({ scrollRef, className = "" }: { scrollRef: React.RefObject<HTMLDivElement>; className?: string }) {
 const scroll = (dir: "left" | "right") => {
 if (!scrollRef.current) return;
 scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
 };
 return (
 <div className={`flex items-center gap-3 ${className}`}>
 <button onClick={() => scroll("left")} className="w-11 h-11 flex items-center justify-center border-[1.5px] border-[#333] text-[#333] hover:bg-[#333] hover:text-white transition-all rounded-full flex-shrink-0 text-lg" aria-label="Scroll left">←</button>
 <button onClick={() => scroll("right")} className="w-11 h-11 flex items-center justify-center border-[1.5px] border-[#333] text-[#333] hover:bg-[#333] hover:text-white transition-all rounded-full flex-shrink-0 text-lg" aria-label="Scroll right">→</button>
 </div>
 );
}

export default function DesignsPage() {
 const [conceptText, setConceptText] = useState("");
 const [conceptLoading, setConceptLoading] = useState(false);
 const [conceptResponse, setConceptResponse] = useState("");
 const [lbSrc, setLbSrc] = useState<string | null>(null);
 const [openService, setOpenService] = useState(-1);
 const merchScrollRef = useRef<HTMLDivElement>(null);
 const merchProducts = usePrintfulMerch();
 const dbcMerch = useMemo(() => [
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
 ].map((img, i) => ({ img, name: "Dying Breed Crew", price: "$" + [35,65,45,55,25,32,30,40,15,28,12,30][i] })), []);

 const shuffledLogos = useMemo(() => shuffleArray(LOGOS_IMAGES), []);
 const shuffledCovers = useMemo(() => shuffleArray(COVER_ART_WYZ), []);
 const shuffledFlyers = useMemo(() => shuffleArray(FLYERS_IMAGES), []);

 useEffect(() => {
 const hk = (e: Event) => setLbSrc((e as CustomEvent).detail);
 window.addEventListener("open-lightbox", hk);
 return () => window.removeEventListener("open-lightbox", hk);
 }, []);

 const generateConcept = async () => {
 if (!conceptText.trim() || conceptLoading) return;
 setConceptLoading(true);
 setConceptResponse("");
 try {
 const res = await fetch("/api/concept-generate", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ text: conceptText }),
 });
 const data = await res.json();
 setConceptResponse(data.content || "Concept generation requires local AI. Try again when connected to WYZMIND.");
 } catch (err) {
 setConceptResponse("AI concept generator is currently offline. Contact us directly for creative direction.");
 } finally {
 setConceptLoading(false);
 }
 };

 return (
  <main className="pb-0 bg-white dark:bg-[#1C1C1E]">
 <style>{[
 "@keyframes fadeInUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}",
 "@keyframes slideInLeft{from{opacity:0;transform:translateX(-80px)}to{opacity:1;transform:translateX(0)}}",
 "@keyframes slideInRight{from{opacity:0;transform:translateX(80px)}to{opacity:1;transform:translateX(0)}}",
 "@keyframes pulse3131{0%,100%{box-shadow:0 0 0 0 rgba(223,49,49,.35)}50%{box-shadow:0 0 0 10px rgba(223,49,49,0)}}",
 ".animate-fadeInUp{animation:fadeInUp .8s ease-out forwards}",
 ".animate-slideInLeft{animation:slideInLeft .8s ease-out forwards}",
 ".animate-slideInRight{animation:slideInRight .8s ease-out forwards}",
 ".hover-lft{transition:transform .3s ease,box-shadow .3s ease}",
 ".hover-lft:hover{transform:translateY(-8px);box-shadow:0 20px 40px rgba(0,0,0,.15)}",
 ".pulse3131{animation:pulse3131 2s infinite}"
 ].join("\n")}</style>

{/* ═══ HERO ═══ */}
  <ScrollReveal animation="fadeIn" duration={1.2}>
   <section className="relative min-h-[50vh] md:h-[70vh] md:max-h-[700px] overflow-hidden bg-white dark:bg-black flex items-center hero-banner">
  <div className="absolute inset-0 flex flex-col md:flex-row">
  {/* Left half: text with gradient */}
   <div className="relative w-full md:w-1/2 flex items-center justify-center z-10 overflow-hidden">
   <div className="absolute inset-0 hero-grad-design z-0" />
   <div className="absolute inset-0 bg-black/20 z-[1]" />
   <div className="relative z-10 text-center px-4 sm:px-10 lg:px-16 py-12 md:py-0">
<h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-white tracking-[0.08em] mb-3 sm:mb-6" style={{ lineHeight: 1 }}>DESIGNING<br />THE <span className="text-[#DF3131]">FUTURE</span></h1>
  <p className="text-[16px] sm:text-[17px] text-white/80 max-w-md leading-relaxed mb-3 sm:mb-3 mx-auto">Our creative design services blend bold aesthetics with strategic thinking to build brands that dominate.</p>
   <Link href="/booking" className="inline-block px-6 sm:px-10 py-3 sm:py-4 bg-[#DF3131] text-white text-[12px] sm:text-[15px] font-bold tracking-[0.12em] text-center hover:bg-[#B82020] transition-all pulse3131">GET A QUOTE</Link>
   </div>
   </div>
{/* Right half: video - no overlay */}
    <div className="w-full md:w-1/2 relative overflow-hidden">
       <ParallaxVideo src="/videos/hero-banners/designs.mp4" speed={0.25} />
    </div>
  </div>
  </section>
  </ScrollReveal>

 {/* ═══ COVER ART CAROUSEL ═══ */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <section className="py-3 sm:py-4 lg:py-5">
 <div className="max-w-[130rem] mx-auto px-6 lg:px-12 mb-2 flex items-end justify-between">
  <h2 className="text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] xl:text-[3rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.06em] mb-4">Cover Art</h2>
  <Link href="#cover-art" className="text-[14px] font-bold tracking-[0.08em] text-[#333] dark:text-[#e0e0e0] hover:text-[#DF3131] transition-colors flex items-center gap-1">See All <FiArrowRight className="w-3 h-3" /></Link>
 </div>
 <Carousel images={shuffledCovers} direction="left" />
 </section>
 </ScrollReveal>

 {/* ═══ FLYERS CAROUSEL ═══ */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <section className="py-3 sm:py-4 lg:py-5">
 <div className="max-w-[130rem] mx-auto px-6 lg:px-12 mb-2 flex items-end justify-between">
  <h2 className="text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] xl:text-[3rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.06em] mb-4">Flyers</h2>
  <Link href="#flyers" className="text-[14px] font-bold tracking-[0.08em] text-[#333] dark:text-[#e0e0e0] hover:text-[#DF3131] transition-colors flex items-center gap-1">See All <FiArrowRight className="w-3 h-3" /></Link>
 </div>
 <Carousel images={shuffledFlyers} direction="right" />
 </section>
 </ScrollReveal>

 {/* ═══ LOGOS CAROUSEL ═══ */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <section className="py-3 sm:py-4 lg:py-5">
 <div className="max-w-[130rem] mx-auto px-6 lg:px-12 mb-2 flex items-end justify-between">
  <h2 className="text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] xl:text-[3rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.06em] mb-4">Logos</h2>
  <Link href="#logos" className="text-[14px] font-bold tracking-[0.08em] text-[#333] dark:text-[#e0e0e0] hover:text-[#DF3131] transition-colors flex items-center gap-1">See All <FiArrowRight className="w-3 h-3" /></Link>
 </div>
 <Carousel images={shuffledLogos} direction="left" whiteBgInDark />
 </section>
 </ScrollReveal>

 {/* ═══ SERVICE CARDS — ACCORDION ═══ */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <section className="py-6 max-w-[1100px] mx-auto px-6">
 <AccordionServiceCard
 img="/images/web-design/site_2.jpg"
 title="SOCIAL MEDIA CONTENT"
 desc="Scroll-stopping content designed specifically for Instagram, TikTok, and other platforms."
 isOpen={openService === 0}
 onToggle={() => setOpenService(openService === 0 ? -1 : 0)}
 />
 <AccordionServiceCard
 img="/images/web-design/site_1.jpg"
 title="WEBSITE DESIGN"
 desc="Modern, responsive websites that convert visitors into customers."
 isOpen={openService === 1}
 onToggle={() => setOpenService(openService === 1 ? -1 : 1)}
 />
 <AccordionServiceCard
 img="/images/web-design/site_3.jpg"
 title="LOGO DESIGN"
 desc="Professional logos that embody your brand personality."
 isOpen={openService === 2}
 onToggle={() => setOpenService(openService === 2 ? -1 : 2)}
 />
 </section>
 </ScrollReveal>

{/* ═══ DESIGNS MARQUEE ═══ */}
  <EnhancedMarquee speed="normal" pauseOnHover gradientFade className="py-3 border-y border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#1C1C1E]">
    <span className="text-[1.25rem] sm:text-[1.75rem] font-heading font-black text-[#333] dark:text-white tracking-[0.08em] uppercase px-6">
      COVER&nbsp;ART&nbsp;&bull;&nbsp;LOGOS&nbsp;&bull;&nbsp;FLYERS&nbsp;&bull;&nbsp;WEB&nbsp;DESIGN&nbsp;&bull;&nbsp;BRANDING&nbsp;&bull;&nbsp;MERCH&nbsp;&bull;&nbsp;
    </span>
  </EnhancedMarquee>

  {/* ═══ FOATM — FEATURED ARTIST OF THE MONTH ═══ */}
  <ScrollReveal animation="fadeUp" delay={0.1}>
   <section className="py-10 bg-white dark:bg-[#252528] border-y border-[1.5px] border-[#E2E2E2] dark:border-[#444]">
  <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
   <div className="flex flex-col items-center mb-6 gap-2">
   <div className="text-center">
   <span className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#DF3131] mb-2 block">FEATURED ARTIST OF THE MONTH</span>
    <h2 className="text-[1.5rem] lg:text-[2rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.06em] mb-4">F. A. O. T. M.</h2>
   </div>
    <Link href="/featured-artist" className="inline-flex items-center gap-2 px-6 py-2.5 border-[1.5px] border-[#333] dark:border-[#e0e0e0] text-[#333] dark:text-[#e0e0e0] text-[14px] font-bold tracking-[0.1em] hover:bg-[#333] hover:text-white transition-all">VIEW ALL <FiArrowRight className="w-4 h-4" /></Link>
   </div>
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
  {dbcMerch.slice(0, 4).map((p, i) => (
   <ScrollParallaxCard key={i} tiltAmount={4} scaleAmount={1.03}>
   <ImageHoverReveal>
   <Link href="/merch" className="group cursor-pointer block">
   <div className="aspect-square relative overflow-hidden mb-2 rounded-lg border border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#252528] hover:border-[#DF3131] hover:shadow-lg hover:shadow-[#DF3131]/10 transition-all duration-300">
    <Image src={p.img} alt={p.name} fill className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" priority />
    </div>
     <p className="text-[13px] font-bold text-[#333] dark:text-[#e0e0e0] truncate tracking-wide mb-2">{p.name}</p>
    </Link>
   </ImageHoverReveal>
   </ScrollParallaxCard>
   ))}
  </div>
 </div>
 </section>
 </ScrollReveal>

 {/* ═══ MERCH WIDGET (with scroll arrows) ═══ */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
  <section className="py-8 bg-white dark:bg-[#1C1C1E] border-b border-[1.5px] border-[#E2E2E2] dark:border-[#444]">
 <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
 <div className="flex flex-col items-center mb-4 gap-2">
 <div className="text-center">
  <h2 className="text-[1.5rem] lg:text-[2rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.06em] mb-4">MERCH SHOP</h2>
 </div>
  <Link href="/merch" className="inline-flex items-center gap-2 px-6 py-2.5 border-[1.5px] border-[#333] dark:border-[#e0e0e0] text-[#333] dark:text-[#e0e0e0] text-[14px] font-bold tracking-[0.1em] hover:bg-[#333] hover:text-white transition-all">VIEW ALL <FiArrowRight className="w-4 h-4" /></Link>
 </div>
 <div className="relative">
  <button onClick={() => merchScrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })} className="absolute sm:-left-5 left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-11 sm:h-11 flex items-center justify-center border-[1.5px] border-[#333] dark:border-[#e0e0e0] text-[#333] dark:text-[#e0e0e0] hover:bg-[#333] hover:text-white transition-all rounded-full flex-shrink-0 text-sm sm:text-lg bg-white dark:bg-[#252528]" aria-label="Scroll left">←</button>
 <div ref={merchScrollRef} className="flex gap-2 overflow-x-auto pb-2 px-6" style={{ scrollbarWidth: "none" }}>
 {dbcMerch.map((p, i) => (
 <Link key={i} href="/merch" className="flex-none w-[13vw] min-w-[120px] group cursor-pointer block">
 <div className="aspect-square relative dark:bg-[#252528] overflow-hidden mb-2 rounded-md">
  <Image src={p.img} alt={p.name} fill className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" priority />
  </div>
   <p className="text-[12px] font-bold text-[#333] dark:text-[#e0e0e0] truncate tracking-wide mb-2">{p.name}</p>
  <p className="text-[13px] text-[#666] dark:text-[#b0b0b0]">{p.price}</p>
 </Link>
 ))}
 </div>
  <button onClick={() => merchScrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })} className="absolute sm:-right-5 right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-11 sm:h-11 flex items-center justify-center border-[1.5px] border-[#333] dark:border-[#e0e0e0] text-[#333] dark:text-[#e0e0e0] hover:bg-[#333] hover:text-white transition-all rounded-full flex-shrink-0 text-sm sm:text-lg bg-white dark:bg-[#252528]" aria-label="Scroll right">→</button>
 </div>
 </div>
 </section>
 </ScrollReveal>

 {/* ═══ CONCEPT GENERATOR (Ollama connected) ═══ */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
  <section className="py-6 lg:py-20 bg-white dark:bg-[#1C1C1E] border-t border-[#E2E2E2] dark:border-[#444]">
 <div className="max-w-[130rem] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">
 <div className="text-center"><span className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#DF3131] mb-2">UNLEASH YOUR IMAGINATION</span>  <h2 className="text-[1rem] sm:text-[1.25rem] md:text-[1.5rem] lg:text-[2rem] xl:text-[3rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.06em] mb-4">DESIGN CONCEPT<br />GENERATOR</h2>  <p className="text-[17px] text-[#666] dark:text-[#b0b0b0] leading-[1.8]">Not sure where to start? Describe your vision and our AI will spark creative ideas tailored to your brand.</p></div>
  <div className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] p-4 sm:p-6 lg:p-8 shadow-sm rounded-lg">
 <div className="space-y-4 mb-4 max-h-[320px] overflow-y-auto">
 <div className="flex gap-2 items-start">
 <div className="w-8 h-8 rounded-full bg-[#DF3131] flex items-center justify-center flex-shrink-0"><span className="text-white text-[11px] font-bold">AI</span></div>
  <div className="bg-gray-100 rounded-2xl rounded-tl-none px-5 py-3 text-[15px] text-[#333] max-w-[85%]">Hey! I'm your design concept generator. Describe your vision, a mood, a theme, a feeling, and I'll give you creative direction.</div>
 </div>
 {conceptText && conceptResponse && (
 <>
 <div className="flex gap-2 items-start justify-end">
 <div className="bg-[#DF3131] text-white rounded-2xl rounded-tr-none px-5 py-3 text-[15px] max-w-[85%]">{conceptText}</div>
 </div>
 <div className="flex gap-2 items-start">
 <div className="w-8 h-8 rounded-full bg-[#DF3131] flex items-center justify-center flex-shrink-0"><span className="text-white text-[11px] font-bold">AI</span></div>
 <div className="bg-gray-100 rounded-2xl rounded-tl-none px-5 py-3 text-[15px] text-[#333] max-w-[85%] whitespace-pre-line">{conceptResponse}</div>
 </div>
 </>
 )}
 {conceptLoading && (
 <div className="flex gap-2 items-start">
 <div className="w-8 h-8 rounded-full bg-[#DF3131] flex items-center justify-center flex-shrink-0"><span className="text-white text-[11px] font-bold">AI</span></div>
 <div className="bg-gray-100 rounded-2xl rounded-tl-none px-5 py-3 text-[15px] text-[#666]">Generating concepts...</div>
 </div>
 )}
 </div>
 <div className="relative mb-4">
  <textarea value={conceptText} onChange={(e) => setConceptText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generateConcept(); } }} rows={2} className="w-full border border-[#E2E2E2] dark:border-[#444] py-3 px-5 pr-12 text-[16px] text-[#333] dark:text-[#e0e0e0] dark:bg-[#252528] focus:outline-none focus:border-[#DF3131] transition-colors rounded-lg resize-none" placeholder="Describe your vision..." />
 <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-[#CBCBCA] w-4 h-4" />
 </div>
 <button onClick={generateConcept} disabled={conceptLoading || !conceptText.trim()} className="w-full py-3 bg-[#DF3131] text-white text-[15px] font-bold tracking-[0.12em] hover:bg-[#B82020] transition-all flex items-center justify-center gap-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">{"\u2728"} SPARK CREATIVITY</button>
 </div>
 </div>
 </section>
 </ScrollReveal>

 {lbSrc && <SimpleLightbox src={lbSrc} onClose={() => setLbSrc(null)} />}
 </main>
 );
}