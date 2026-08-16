"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import StrategyWizard from "@/components/StrategyWizard";
import ScrollReveal from "@/components/ScrollReveal";
import EnhancedMarquee from "@/components/EnhancedMarquee";
import ScrollParallaxCard from "@/components/ScrollParallaxCard";
import TextSplit from "@/components/TextSplit";

function shuffleArray<T>(arr: T[]): T[] {
 const a = [...arr];
 for (let i = a.length - 1; i > 0; i--) {
 const j = Math.floor(Math.random() * (i + 1));
 [a[i], a[j]] = [a[j], a[i]];
 }
 return a;
}

const CATEGORIES = ["All Services", "Branding Design", "Photography", "Videography", "Consultation", "Web Design"];

const ALL_SERVICES_RAW = [
 { cat: "Photography", name: "Photoshoot", price: "$100", dur: "1 HR", desc: "Capture authentic moments with sleek, professional photography.", img: "/images/services/Photography.webp", bookLink: "/booking-calendar/photoshoot" },
 { cat: "Photography", name: "Photo Retouching", price: "$50", dur: "2 HR", desc: "Basic to advanced professional photo retouching.", img: "/images/services/Photo Retouching.jpg", bookLink: "/booking" },
 { cat: "Photography", name: "Event Photography", price: "$200", dur: "3 HR", desc: "Expertly capturing every moment, from public showcases to private events.", img: "/images/services/Event Photography.jpg", bookLink: "/booking-calendar/event-photography" },
 { cat: "Branding Design", name: "Graphic Design", price: "$150", dur: "3 HR", desc: "Transform your vision into stunning reality with customized graphic design.", img: "/images/services/Graphic Design.jpg", bookLink: "/booking" },
 { cat: "Branding Design", name: "Logo Design", price: "$100", dur: "3 HR", desc: "Tailored logos crafted to embody your brand identity.", img: "/images/services/Logo Design.jpg", bookLink: "/booking" },
 { cat: "Videography", name: "Video Shoot", price: "$200", dur: "3 HR", desc: "Make an unforgettable impression with our visual storytelling and professional video production.", img: "/images/services/Video Shoot.jpg", bookLink: "/booking" },
 { cat: "Videography", name: "Video Editing", price: "$200", dur: "4 HR", desc: "Premium video editing with the latest software to bring your footage to life.", img: "/images/services/Video Editing.jpg", bookLink: "/booking" },
 { cat: "Consultation", name: "Creative Consultation", price: "Free", dur: "30 MIN", desc: "Unleash your brand's potential with our expert strategy session.", img: "/images/services/Creative Consultation.avif", bookLink: "/booking" },
 { cat: "Consultation", name: "Logo Consultation", price: "$50", dur: "2 HR", desc: "Creating captivating logos through in-depth research and collaborative brainstorming.", img: "/images/services/Logo Consultation.jpg", bookLink: "/booking" },
 { cat: "Consultation", name: "Marketing Consultation", price: "$50", dur: "1 HR", desc: "Expert marketing strategy and actionable guidance to elevate your brand's reach.", img: "/images/services/Marketing Consultation.jpg", bookLink: "/booking" },
 { cat: "Web Design", name: "Website Design", price: "$500", dur: "3 HR", desc: "Professional website design and organization to help your business thrive online.", img: "/images/services/Website Design.jpg", bookLink: "/booking" },
  { cat: "Web Design", name: "SEO Audit", price: "$50", dur: "1 HR", desc: "In-depth website audit for a targeted growth strategy and improved search visibility.", img: "/images/services/SEO.jpg", bookLink: "/booking" },
  { cat: "Branding Design", name: "Brand Identity Package", price: "$300", dur: "6 HR", desc: "Complete brand identity system with logo, color palette, typography, and brand guidelines.", img: "/images/services/Graphic Design.jpg", bookLink: "/booking" },
  { cat: "Videography", name: "Motion Graphics", price: "$150", dur: "2 HR", desc: "Custom animated graphics and motion design for your promotional videos.", img: "/images/services/Video Editing.jpg", bookLink: "/booking" },
  { cat: "Photography", name: "Product Photography", price: "$120", dur: "2 HR", desc: "Professional product photography with clean backgrounds and multiple angles.", img: "/images/services/Event Photography.jpg", bookLink: "/booking" },
];

function ServiceCard({ service, index }: { service: typeof ALL_SERVICES_RAW[0]; index: number }) {
 const [flipped, setFlipped] = useState(false);

 return (
 <div
 className="group relative cursor-pointer"
 style={{ perspective: "1200px" }}
 onMouseEnter={() => setFlipped(true)}
 onMouseLeave={() => setFlipped(false)}
 onClick={() => setFlipped(f => !f)}
 >
  <div className="relative w-full" style={{ minHeight: "min(400px, 60vh)" }}>
 {/* Front — full image + 60% overlay + title */}
 <div
    className="absolute inset-0 transition-all duration-700 ease-in-out"
    style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)" }}
  >
   <div className="relative w-full h-full overflow-hidden border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#DF3131]/10">
  <Image src={service.img} alt={service.name} fill className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" priority />
  <div className="absolute inset-0 bg-black/60" />
  <div className="absolute inset-0 flex items-center justify-center z-10">
  <h3 className="font-heading font-black text-white text-[22px] sm:text-[26px] md:text-[30px] tracking-[0.06em] text-center drop-shadow-lg px-4">{service.name}</h3>
  </div>
 </div>
 </div>

 {/* Back — info, details, price, button (centered) */}
 <div
    className="absolute inset-0 transition-all duration-700 ease-in-out"
    style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(0deg)" : "rotateY(180deg)" }}
  >
 <div className="w-full h-full bg-[#DF3131] text-white p-6 flex flex-col justify-between overflow-hidden relative">
  <div className="absolute inset-0 opacity-10">
  <Image src={service.img} alt={service.name} fill className="w-full h-full object-cover" priority />
  </div>
 <div className="relative z-10 text-center">
 <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/70 mb-2 block">{service.cat}</span>
  <h3 className="font-heading font-black text-white text-[22px] tracking-[0.03em] mb-3">{service.name}</h3>
 <p className="text-white/80 text-[15px] leading-relaxed mb-4">{service.desc}</p>
 <div className="flex items-center justify-center gap-3 mb-4">
 <span className="text-[45px] font-black">{service.price}</span>
 <span className="text-white/60 text-[14px]">· {service.dur}</span>
 </div>
 </div>
 <div className="relative z-10 flex gap-2">
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
 const allServices = useMemo(() => shuffleArray(ALL_SERVICES_RAW), []);

 const filtered = active === "All Services" ? allServices : allServices.filter(s => s.cat === active);

return (
  <main className="pb-12 bg-white dark:bg-[#232326]">

{/* ── Hero: Split Layout ── */}
  <ScrollReveal animation="fadeIn" duration={1.2}>
   <section className="relative min-h-[60vh] lg:min-h-[70vh] flex flex-col lg:flex-row hero-banner">
  {/* Left: Image */}
  <div className="w-full lg:w-1/2 h-[40vh] lg:h-auto relative overflow-hidden">
  <Image src="/images/wix-extracted/services/category-cards/services_category-cards_03_w_1000,h_557,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_auto.jpg" alt="WYZ Design creative services" fill className="w-full h-full object-cover" priority />
   <div className="absolute inset-0 bg-black/20" />
  </div>
  {/* Right: Text with gradient */}
 <div className="relative w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-10 lg:px-16 py-16 lg:py-0 overflow-hidden">
   <div className="absolute inset-0 hero-grad-services z-0" />
   <div className="absolute inset-0 bg-black/20 z-[1]" />
    <div className="relative z-10 text-center max-w-xl mx-auto flex flex-col items-center justify-center h-full">
<h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-white tracking-[0.12em] mb-3 sm:mb-6" style={{ lineHeight: 1 }}>
  <TextSplit stagger={0.03} direction="up">CREATIVE</TextSplit> <span className="text-[#DF3131]"><TextSplit stagger={0.03} direction="up">SERVICES</TextSplit></span>
  </h1>
  <p className="text-white/70 text-[16px] sm:text-base leading-relaxed mb-3 sm:mb-3 max-w-md mx-auto">
   From photography to web design, we deliver end-to-end creative solutions that make your brand stand out.
   </p>
   <Link href="/plans"
   className="inline-block bg-[#DF3131] text-white px-6 sm:px-8 py-3 sm:py-4 font-heading font-bold tracking-[0.15em] uppercase text-[12px] sm:text-sm text-center hover:bg-[#B82020] transition-all">
   VIEW PLANS
   </Link>
   </div>
   </div>
  </section>
  </ScrollReveal>

{/* ═══ SERVICES MARQUEE ═══ */}
  <EnhancedMarquee speed="slow" pauseOnHover gradientFade className="py-3 bg-white dark:bg-[#232326]">
    {(["PHOTOSHOOTS","RETOUCHING","GRAPHIC DESIGN","LOGOS","VIDEO","WEBSITES","SEO","CONSULTATION"] as const).map((word, i) => {
      const M = ["text-[#DF3131]", "text-[#111] dark:text-white", "marquee-outline", "text-[#6E6E6E] dark:text-[#8F8F8F]"];
      return (
        <>
          <span key={`w-${i}`} className={`inline-flex items-center text-[1.25rem] sm:text-[1.75rem] font-heading font-black tracking-[0.08em] uppercase px-4 sm:px-6 ${M[(i + 2) % 4]}`}>{word}</span>
          <span key={`b-${i}`} className="inline-flex items-center text-[1.25rem] sm:text-[1.75rem] font-heading font-black tracking-[0.08em] uppercase px-4 sm:px-6 opacity-50 text-[#111] dark:text-white">&bull;</span>
        </>
      );
    })}
  </EnhancedMarquee>

 <div className="max-w-[130rem] mx-auto px-6 lg:px-12 pt-12">

 {/* ── Category Tabs — pill-style with indicator ── */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <div className="flex flex-wrap gap-2 mb-6 justify-start lg:justify-center pb-2">
 {CATEGORIES.map(cat => {
 const isActive = active === cat;
 return (
 <button key={cat} onClick={() => setActive(cat)}
 className={`relative px-4 py-2.5 text-[12px] font-bold tracking-[0.1em] uppercase rounded-full transition-all duration-300 shrink-0 ${
 isActive
 ? "bg-[#DF3131] text-white shadow-lg shadow-[#DF3131]/30 scale-105"
  : "bg-white dark:bg-[#2b2b2e] text-[#666] dark:text-[#b0b0b0] border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] hover:text-[#DF3131] hover:scale-105"
 }`}>
 {cat}
 </button>
 );
 })}
 </div>
 </ScrollReveal>

 {/* ── Service Count ── */}
 <div className="mb-4 text-center">
  <span className="text-[16px] text-[#999] dark:text-[#b0b0b0] tracking-wider">{filtered.length} SERVICE{filtered.length !== 1 ? "S" : ""} AVAILABLE</span>
 </div>

 {/* ── Service Grid — flip cards ── */}
 <ScrollReveal animation="fadeUp" delay={0.15}>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
 {filtered.map((s, i) => (
 <ServiceCard key={s.name} service={s} index={i} />
 ))}
 </div>
 </ScrollReveal>

 {/* ── Strategy Wizard ── */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <StrategyWizard />
 </ScrollReveal>
 </div>
 </main>
 );
}
