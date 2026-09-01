"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import StrategyWizard from "@/components/StrategyWizard";
import ScrollReveal from "@/components/ScrollReveal";
import EnhancedMarquee from "@/components/EnhancedMarquee";
import ScrollParallaxCard from "@/components/ScrollParallaxCard";
import TextSplit from "@/components/TextSplit";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { shuffleArray } from "@/lib/utils";
import { getSiteUrl } from "@/lib/site-url";

const CATEGORIES = ["All Services", "Branding Design", "Photography", "Videography", "Consultation", "Web Design"];

const ALL_SERVICES_RAW = [
 { cat: "Photography", name: "Photoshoot", price: "$100", dur: "1 HR", desc: "Capture authentic moments with sleek, professional photography.", img: "/images/services/Photography.webp", bookLink: "/booking-calendar/photoshoot" },
 { cat: "Photography", name: "Photo Retouching", price: "$50", dur: "2 HR", desc: "Basic to advanced professional photo retouching.", img: "/images/services/Photo Retouching.jpg", bookLink: "/booking" },
 { cat: "Photography", name: "Event Photography", price: "$200", dur: "3 HR", desc: "Expertly capturing every moment, from public showcases to private events.", img: "/images/services/Event Photography.jpg", bookLink: "/booking-calendar/event-photography" },
 { cat: "Photography", name: "Product Photography", price: "$120", dur: "2 HR", desc: "Professional product photography with clean backgrounds and multiple angles.", img: "/images/services/Event Photography.jpg", bookLink: "/booking" },
 { cat: "Photography", name: "Headshot Session", price: "$100", dur: "1 HR", desc: "Professional headshots for profiles, portfolios, and casting calls.", img: "/images/services/Photography.webp", bookLink: "/booking-calendar/photoshoot" },
 { cat: "Photography", name: "Behind the Scenes", price: "$150", dur: "2 HR", desc: "Document your creative process with candid behind-the-scenes content.", img: "/images/services/Event Photography.jpg", bookLink: "/booking" },
 { cat: "Branding Design", name: "Graphic Design", price: "$150", dur: "3 HR", desc: "Bring your vision to life with graphic design that hits.", img: "/images/services/Graphic Design.jpg", bookLink: "/booking" },
 { cat: "Branding Design", name: "Logo Design", price: "$100", dur: "3 HR", desc: "Custom logos designed to represent who you are.", img: "/images/services/Logo Design.jpg", bookLink: "/booking" },
 { cat: "Branding Design", name: "Brand Identity Package", price: "$300", dur: "6 HR", desc: "Complete brand identity system with logo, color palette, typography, and brand guidelines.", img: "/images/services/Graphic Design.jpg", bookLink: "/booking" },
 { cat: "Branding Design", name: "Social Media Kit", price: "$200", dur: "4 HR", desc: "Cohesive social media templates and brand assets for consistent posting.", img: "/images/services/Graphic Design.jpg", bookLink: "/booking" },
 { cat: "Branding Design", name: "Business Card Design", price: "$75", dur: "1 HR", desc: "Custom business cards that leave a lasting impression.", img: "/images/services/Logo Design.jpg", bookLink: "/booking" },
 { cat: "Branding Design", name: "Flyer Design", price: "$75", dur: "1 HR", desc: "Eye-catching flyers for events, promotions, and marketing campaigns.", img: "/images/services/Graphic Design.jpg", bookLink: "/booking" },
 { cat: "Videography", name: "Video Shoot", price: "$200", dur: "3 HR", desc: "Make an unforgettable impression with our visual storytelling and professional video production.", img: "/images/services/Video Shoot.jpg", bookLink: "/booking" },
 { cat: "Videography", name: "Video Editing", price: "$200", dur: "4 HR", desc: "Premium video editing with the latest software to bring your footage to life.", img: "/images/services/Video Editing.jpg", bookLink: "/booking" },
 { cat: "Videography", name: "Motion Graphics", price: "$150", dur: "2 HR", desc: "Custom animated graphics and motion design for your promotional videos.", img: "/images/services/Video Editing.jpg", bookLink: "/booking" },
 { cat: "Videography", name: "Music Video Production", price: "$350", dur: "6 HR", desc: "Full music video production from concept to final cut.", img: "/images/services/Video Shoot.jpg", bookLink: "/booking" },
 { cat: "Videography", name: "Short Form Content", price: "$100", dur: "1 HR", desc: "Reels, TikToks, and shorts edited for maximum engagement.", img: "/images/services/Video Editing.jpg", bookLink: "/booking" },
 { cat: "Consultation", name: "Creative Consultation", price: "Free", dur: "30 MIN", desc: "Get a clear game plan for your brand in a free, no-pressure session.", img: "/images/services/Creative Consultation.avif", bookLink: "/booking" },
 { cat: "Consultation", name: "Logo Consultation", price: "$50", dur: "2 HR", desc: "Creating captivating logos through in-depth research and collaborative brainstorming.", img: "/images/services/Logo Consultation.jpg", bookLink: "/booking" },
 { cat: "Consultation", name: "Marketing Consultation", price: "$50", dur: "1 HR", desc: "Straightforward marketing advice to help more people find your brand.", img: "/images/services/Marketing Consultation.jpg", bookLink: "/booking" },
 { cat: "Consultation", name: "Brand Strategy Session", price: "$75", dur: "2 HR", desc: "Deep dive into your brand positioning, audience, and growth roadmap.", img: "/images/services/Creative Consultation.avif", bookLink: "/booking" },
 { cat: "Consultation", name: "Content Planning", price: "$50", dur: "1 HR", desc: "Strategic content calendar and posting plan tailored to your audience.", img: "/images/services/Marketing Consultation.jpg", bookLink: "/booking" },
 { cat: "Web Design", name: "Website Design", price: "$500", dur: "3 HR", desc: "Professional website design and organization to help your business thrive online.", img: "/images/services/Website Design.jpg", bookLink: "/booking" },
 { cat: "Web Design", name: "SEO Audit", price: "$50", dur: "1 HR", desc: "In-depth website audit for a targeted growth strategy and improved search visibility.", img: "/images/services/SEO.jpg", bookLink: "/booking" },
 { cat: "Web Design", name: "Landing Page", price: "$250", dur: "2 HR", desc: "High-converting single-page website for campaigns and product launches.", img: "/images/services/Website Design.jpg", bookLink: "/booking" },
 { cat: "Web Design", name: "E-Commerce Setup", price: "$400", dur: "4 HR", desc: "Full online store setup with product listings, payments, and shipping.", img: "/images/services/Website Design.jpg", bookLink: "/booking" },
 { cat: "Web Design", name: "Website Redesign", price: "$350", dur: "3 HR", desc: "Modernize your existing site with fresh design and improved performance.", img: "/images/services/SEO.jpg", bookLink: "/booking" },
];

function ServiceCard({ service, index }: { service: typeof ALL_SERVICES_RAW[0]; index: number }) {
 const [flipped, setFlipped] = useState(false);
 const canHover = useRef(false);
 useEffect(() => { canHover.current = window.matchMedia("(hover: hover)").matches; }, []);

 return (
<div
className="group relative cursor-pointer"
style={{ perspective: "1200px" }}
role="button"
tabIndex={0}
aria-expanded={flipped}
aria-label={`${service.name ? service.name + " details" : "Service details"}`}
onMouseEnter={() => { if (canHover.current) setFlipped(true); }}
onMouseLeave={() => { if (canHover.current) setFlipped(false); }}
onClick={() => setFlipped(f => !f)}
onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipped(f => !f); } }}
>
  <div className="relative w-full" style={{ minHeight: "min(400px, 60vh)" }}>
 {/* Front — full image + 60% overlay + title */}
 <div
    className="absolute inset-0 transition-all duration-700 ease-in-out"
    style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)" }}
  >
   <div className="relative w-full h-full overflow-hidden border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#DF3131]/10">
   <Image src={service.img} alt={service.name} fill sizes="(max-width:640px) 50vw, (max-width:768px) 33vw, 25vw" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
  <div className="absolute inset-0 bg-black/60" />
  <div className="absolute inset-0 flex items-center justify-center z-10">
  <h3 className="font-heading font-black text-white text-[30.8px] sm:text-[26px] md:text-[30px] tracking-[0.06em] text-center drop-shadow-lg px-4">{service.name}</h3>
  </div>
 </div>
 </div>

 {/* Back — info, details, price, button (centered) */}
 <div
    className="absolute inset-0 transition-all duration-700 ease-in-out"
    style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(0deg)" : "rotateY(180deg)" }}
  >
<div className="w-full h-full bg-[#DF3131] text-white p-6 flex flex-col items-center justify-center overflow-hidden relative">
  <div className="absolute inset-0 opacity-10">
   <Image src={service.img} alt={service.name} fill sizes="100vw" className="w-full h-full object-cover" />
   </div>
  <div className="relative z-10 text-center flex flex-col items-center justify-center">
 <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/70 mb-2 block">{service.cat}</span>
  <h3 className="font-heading font-black text-white text-[27.6px] sm:text-[29.9px] tracking-[0.03em] mb-3">{service.name}</h3>
 <p className="text-white/80 text-[15px] leading-relaxed mb-5 max-w-xs">{service.desc}</p>
 <div className="flex flex-col items-center justify-center gap-0 mb-5">
 <span className="text-[50px] sm:text-[56px] font-black leading-none">{service.price}</span>
 <span className="text-white/60 text-[15px] mt-1">· {service.dur}</span>
 </div>
 </div>
 <div className="relative z-10 flex gap-2 w-full max-w-xs">
  <Link href={service.bookLink} className="flex-1 text-center py-3 bg-white text-[#111] text-[14px] font-bold tracking-[0.08em] hover:bg-[#DF3131] hover:text-white transition-all" onClick={(e) => e.stopPropagation()}>
 BOOK NOW
  </Link>
  <Link href="/plans" className="flex-1 text-center py-3 border-2 border-white text-white text-[14px] font-bold tracking-[0.08em] hover:bg-white hover:text-[#DF3131] transition-all" onClick={(e) => e.stopPropagation()}>
 VIEW PLANS
  </Link>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

export default function ServicesPage() {
 const [active, setActive] = useState("All Services");
 const [hoveredTab, setHoveredTab] = useState<string | null>(null);
 const [allServices, setAllServices] = useState(ALL_SERVICES_RAW);

 useEffect(() => {
  setAllServices(shuffleArray(ALL_SERVICES_RAW));
 }, []);

 const filtered = active === "All Services" ? allServices : allServices.filter(s => s.cat === active);

return (
  <main className="pb-12 bg-white dark:bg-[#1C1C1E]">
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "WYZ Design Creative Services",
        description: "Professional photography, graphic design, videography, web design, and marketing services for artists, brands, and businesses.",
        provider: {
          "@type": "Organization",
          name: "WYZ Design",
          url: getSiteUrl(),
        },
        areaServed: "US",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Creative Services",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Photoshoot", price: "$100", priceCurrency: "USD" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Graphic Design", price: "$150", priceCurrency: "USD" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Website Design", price: "$500", priceCurrency: "USD" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Video Shoot", price: "$200", priceCurrency: "USD" } },
          ],
        },
      }),
    }}
  />

{/* ── Hero: Split Layout ── */}
  <ScrollReveal animation="fadeIn" duration={1.2}>
   <section className="relative -mt-20 lg:-mt-24 pt-20 lg:pt-24 min-h-screen overflow-hidden hero-banner">
   {/* Desktop: split grid */}
   <div className="hidden lg:grid lg:grid-cols-2 lg:h-full">
   <div className="relative h-full overflow-hidden">
    <Image src="/images/wix-extracted/services/category-cards/services_category-cards_03_w_1000,h_557,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_auto.jpg" alt="WYZ Design creative services" fill className="w-full h-full object-cover" priority />
    <div className="absolute inset-0 bg-black/20" />
   </div>
   <div className="relative flex items-center justify-center px-4 sm:px-10 lg:px-16 py-16 lg:py-0 pt-32 lg:pt-40 overflow-hidden">
    <div className="absolute inset-0 hero-grad-services z-0" />
    <div className="absolute inset-0 bg-black/20 z-[1]" />
    <div className="relative z-10 text-center max-w-xl mx-auto flex flex-col items-center justify-center h-full">
    <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-white tracking-[0.12em] mb-4 sm:mb-8" style={{ lineHeight: 0.9 }}>
    <TextSplit stagger={0.03} direction="up">CREATIVE</TextSplit><br />
    <span className="text-[#DF3131]"><TextSplit stagger={0.03} direction="up">SERVICES</TextSplit></span>
    </h1>
    <p className="text-white/70 text-[16px] sm:text-base leading-relaxed mb-6 max-w-sm mx-auto">
    From photography to web design, we handle the full creative process to make your brand stand out.
    </p>
    <Link href="/plans"
    className="inline-block bg-[#DF3131] text-white px-6 sm:px-8 py-3 sm:py-4 font-heading font-bold tracking-[0.15em] uppercase text-[12px] sm:text-sm text-center hover:bg-[#B82020] transition-all mt-4 sm:mt-6">
    VIEW PLANS
    </Link>
    </div>
   </div>
   </div>
   {/* Mobile: merged hero */}
   <div className="lg:hidden absolute inset-0 flex flex-col items-center justify-center text-center">
   <div className="absolute inset-0 z-0">
    <video src="/videos/hero-banners/photography.mp4" autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-black/65 z-[1]" />
   </div>
   <div className="relative z-10 max-w-lg mx-auto px-4 sm:px-10 py-16 sm:py-20 pt-32 lg:pt-40 flex flex-col items-center justify-center h-full">
    <h1 className="text-[2rem] sm:text-[2.5rem] font-heading font-black text-white tracking-[0.12em] mb-4 sm:mb-8" style={{ lineHeight: 0.9 }}>
    <TextSplit stagger={0.03} direction="up">CREATIVE</TextSplit><br />
    <span className="text-[#DF3131]"><TextSplit stagger={0.03} direction="up">SERVICES</TextSplit></span>
    </h1>
    <p className="text-white/70 text-[16px] sm:text-base leading-relaxed mb-6 max-w-sm mx-auto">
    From photography to web design, we handle the full creative process to make your brand stand out.
    </p>
    <Link href="/plans"
    className="inline-block bg-[#DF3131] text-white px-6 sm:px-8 py-3 sm:py-4 font-heading font-bold tracking-[0.15em] uppercase text-[12px] sm:text-sm text-center hover:bg-[#B82020] transition-all mt-4 sm:mt-6">
    VIEW PLANS
    </Link>
   </div>
   </div>
   </section>
   </ScrollReveal>

{/* SERVICES MARQUEE */}
  <section className="py-6">
  <EnhancedMarquee speed="semislow" pauseOnHover gradientFade className="bg-white dark:bg-[#1C1C1E]">
    {(["PHOTOSHOOTS","RETOUCHING","GRAPHIC DESIGN","LOGOS","VIDEO","WEBSITES","SEO","CONSULTATION"] as const).map((word, i) => {
      const M = ["text-[#DF3131]", "text-[#111] dark:text-white", "marquee-outline", "text-[#6E6E6E] dark:text-[#666]"];
      return (
        <span key={i} className="inline-flex items-center">
          <span className={`inline-flex items-center text-[1.25rem] sm:text-[1.75rem] font-heading font-black tracking-[0.08em] uppercase px-4 sm:px-6 ${M[(i + 3) % 4]}`}>{word}</span>
          <span className="inline-flex items-center text-[1.25rem] sm:text-[1.75rem] font-heading font-black tracking-[0.08em] uppercase px-4 sm:px-6 opacity-50 text-[#111] dark:text-white">&bull;</span>
        </span>
      );
    })}
  </EnhancedMarquee>
  </section>

 <div className="max-w-[130rem] mx-auto px-6 lg:px-12 pt-12">

 {/* ── Category Tabs — pill-style with indicator ── */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
<div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-10 -mx-6 px-6">
  {CATEGORIES.map(cat => {
  const isActive = active === cat;
  return (
    <button key={cat} onClick={() => setActive(cat)}
    className={`relative px-5 py-2.5 text-[12px] font-bold tracking-[0.1em] uppercase rounded-full transition-all duration-300 shrink-0 whitespace-nowrap ${
    isActive
    ? "bg-[#DF3131] text-white shadow-lg shadow-[#DF3131]/30 scale-105"
      : "bg-white dark:bg-[#252528] text-[#666] dark:text-[#b0b0b0] border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] hover:text-[#DF3131] hover:scale-105"
    }`}>
    {cat}
    </button>
  );
  })}
  </div>
 </ScrollReveal>

 {/* ── Service Count ── */}
 <div className="mb-4 text-center">
  <span className="text-[16px] text-[#666] dark:text-[#b0b0b0] tracking-wider">{filtered.length} SERVICE{filtered.length !== 1 ? "S" : ""} AVAILABLE</span>
 </div>

  {/* ── Service Grid — flip cards ── */}
  <ScrollReveal animation="fadeUp" delay={0.15}>
  <ErrorBoundary fallback={
    <div className="text-center py-16 col-span-full">
      <p className="text-[#666]">Services temporarily unavailable. Please try again later.</p>
    </div>
  }>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 lg:gap-6 lg:mb-6">
  {filtered.map((s, i) => (
  <ServiceCard key={s.name} service={s} index={i} />
  ))}
  </div>
  </ErrorBoundary>
  </ScrollReveal>

 {/* ── Strategy Wizard ── */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <StrategyWizard />
 </ScrollReveal>
 </div>
 </main>
 );
}
