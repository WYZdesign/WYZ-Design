"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCamera, FiMonitor, FiVideo, FiMessageCircle, FiGlobe, FiSearch, FiAward } from "react-icons/fi";
import ScrollReveal from "@/components/ScrollReveal";
import { SmoothCarousel, LogoCarousel, VideoPlaylist } from "@/components/home/HomeCarousels";

import Testimonials from "@/components/Testimonials";
import LeadMagnet from "@/components/LeadMagnet";
import GyroTilt from "@/components/GyroTilt";
import TextMaskReveal from "@/components/TextMaskReveal";
import MagneticElement from "@/components/MagneticElement";
import EnhancedMarquee from "@/components/EnhancedMarquee";
import CountUp from "@/components/CountUp";

import TextSplit from "@/components/TextSplit";
import ImageReveal from "@/components/ImageReveal";
import { shuffleArray } from "@/lib/utils";
import { LOGO_INTROS_RAW, HERO_IMAGES_RAW, CLIENT_LOGOS_RAW, DESIGN_SHOWCASE_RAW, MODELS_RAW_RECORDS, FAQ_ITEMS } from "@/lib/data/home";

const SERVICES = [
 { icon: <FiCamera />, name: "Artist Launch Kit", desc: "Creative direction, photoshoot, cover art, social graphics, landing page. For musicians, models, performers ready to level up.", href: "/services#plans", tab: "FOR ARTISTS" },
 { icon: <FiMonitor />, name: "Brand Identity System", desc: "Logo refresh, visual identity, web design, photo content, social kit. For businesses tired of looking forgettable.", href: "/services#plans", tab: "FOR BRANDS" },
 { icon: <FiVideo />, name: "Studio Growth System", desc: "Event programming, promotional assets, recap content, booking strategy. For studios and production spaces.", href: "/services#plans", tab: "FOR STUDIOS" },
 { icon: <FiMessageCircle />, name: "Event Production", desc: "Flyers, social rollout, Eventbrite setup, photo/video recap, artist coordination. From concept to curtains.", href: "/events", tab: "EVENTS" },
 { icon: <FiGlobe />, name: "WYZMiND Systems", desc: "AI intake bots, client portals, booking tools, and automated workflows. Systems that keep up as you grow.", href: "/services", tab: "SYSTEMS" },
 // 2026-10-10 (Claude, board K6): added so the ALL tab renders 6 cards
 // instead of 5 -- at lg:grid-cols-3 that fills two clean rows of 3
 // instead of a 3+2 orphan row, and at md:grid-cols-2 it fills three
 // clean rows of 2 instead of 2+2+1.
 { icon: <FiAward />, name: "Custom Print & Merch", desc: "Stickers, apparel, and branded merch printed to order. For artists and brands who want their identity on something real.", href: "/printing", tab: "PRINT & MERCH" },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("ALL");
 const [spTab, setSpTab] = useState<"services" | "plans">("services");
 const [openFaq, setOpenFaq] = useState<number | null>(null);
 const [faqSearch, setFaqSearch] = useState("");
 const [faqCount, setFaqCount] = useState(4);
 const heroRef = useRef<HTMLDivElement>(null);
 const [heroVis, setHeroVis] = useState(false);
  const [shuffledHero, setShuffledHero] = useState<string[]>([]);
  const [shuffledDesign, setShuffledDesign] = useState<string[]>([]);
  const [shuffledModels, setShuffledModels] = useState<string[]>([]);
  const [logoIntros, setLogoIntros] = useState(LOGO_INTROS_RAW);
  const [clientLogos, setClientLogos] = useState(CLIENT_LOGOS_RAW);

  useEffect(() => {
  setShuffledHero(shuffleArray(HERO_IMAGES_RAW));
  setShuffledDesign(shuffleArray(DESIGN_SHOWCASE_RAW));
  setShuffledModels(shuffleArray(MODELS_RAW_RECORDS));
  setLogoIntros(shuffleArray(LOGO_INTROS_RAW));
  setClientLogos(shuffleArray(CLIENT_LOGOS_RAW));
  }, []);

 useEffect(() => {
 const el = heroRef.current;
 if (!el) return;
 const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeroVis(true); obs.disconnect(); } }, { threshold: 0.1 });
 obs.observe(el);
 const t = setTimeout(() => setHeroVis(true), 1200);
 return () => { obs.disconnect(); clearTimeout(t); };
 }, []);

 const filteredFaq = FAQ_ITEMS.filter(f =>
 f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase())
 );

  return (
 <main className="pt-0">
 <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.wyzdesign.com" },
      ],
    }),
  }}
 />
 <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    }),
  }}
 />
 <style>{`
 @keyframes heroSlideIn { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: none; } }
 @keyframes heroSlideInR { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: none; } }
 @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
 .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
 .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
 `}</style>

    <section ref={heroRef} className="relative -mt-20 lg:-mt-24 pt-20 lg:pt-24 min-h-[80vh] sm:min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden hero-banner">
    {/* Single wrapper - keeps this the only direct child of .hero-banner so mobile padding-stripping CSS doesn't hit the text container */}
    <div className="absolute inset-0 flex items-center justify-center">
    {/* Background: video fills entire hero */}
    <div className="absolute inset-0 z-0 bg-black">
    <VideoPlaylist videos={logoIntros} />
    </div>
     {/* 80% + 30% black overlay (or overall opacity increase) between video and text */}
       <div className="absolute inset-0 bg-black/65 z-[1]" />
     {/* Text content on top */}
    <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center px-6 sm:px-10 lg:px-16 py-8 sm:py-12 overflow-hidden"
    style={{ opacity: heroVis ? 1 : 0, transform: heroVis ? "none" : "translateY(24px)", transition: "all 0.8s ease-out" }}>
     <GyroTilt intensity={8} enableOnDesktop>
     <p className="text-white/70 text-[11px] sm:text-[13px] font-heading font-bold tracking-[0.1em] uppercase text-center mb-6 sm:mb-8 max-w-full">
        <TextSplit stagger={0.04} direction="up">Wild Vision. Zealous Execution.</TextSplit>
      </p>
        <TextMaskReveal direction="up">
        <h1 className="wz-stack text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-white tracking-[0.08em] text-center mb-6 sm:mb-10 max-w-lg mx-auto" style={{ lineHeight: 0.9 }}>
           <span>WE <span className="text-[#DF3131]">MAKE</span></span><br />
           <span>WHAT <span className="text-[#DF3131]">WORKS</span></span>
        </h1>
        </TextMaskReveal>
         <p className="text-white/70 text-[14px] sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-xs sm:max-w-sm mx-auto text-center">
       Photography and brand design in Los Angeles. Book a session or a project.
       </p>
       </GyroTilt>
<div className="flex flex-wrap gap-3 justify-center w-full px-2">
      <MagneticElement tag="div" strength={0.25}>
      <Link href="/booking"
       className="inline-block bg-[#DF3131] text-white border-2 border-[#DF3131] px-6 py-3 font-heading font-bold tracking-[0.15em] uppercase text-[12px] sm:text-[15px] text-center hover:bg-[#B82020] hover:border-[#B82020] transition-all">
      BOOK A FREE CALL
      </Link>
      </MagneticElement>
      <MagneticElement tag="div" strength={0.25}>
      <Link href="/designs"
       className="inline-block bg-transparent text-white border-2 border-white px-6 py-3 font-heading font-bold tracking-[0.15em] uppercase text-[12px] sm:text-[15px] text-center hover:bg-white hover:text-[#111] transition-all">
      SEE THE WORK
      </Link>
      </MagneticElement>
     </div>
   </div>
   </div>
    </section>

{/* ═══ TRUST SIGNALS ═══ */}
  <section aria-label="WYZ Design track record" data-chat-avoid className="bg-[#111] border-b border-[#333] py-6 sm:py-8">
    <ul className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 text-center list-none">
      {[
        { stat: "90+", label: "Events Produced" },
        { stat: "45+", label: "Clients Served" },
        { stat: "10,000+", label: "Photos Delivered" },
        { stat: "13+", label: "Years Running" },
      ].map((t) => (
        <li key={t.label} className="flex flex-col items-center">
          <CountUp value={t.stat} className="text-[#C9A227] font-heading font-black text-[26px] sm:text-[32px] leading-none" />
          <span className="text-white/60 text-[11px] sm:text-[11px] font-heading font-bold tracking-[0.15em] uppercase mt-2">{t.label}</span>
        </li>
      ))}
    </ul>
  </section>

{/* ═══ BRAND MARQUEE ═══ */}
  <section className="py-3 sm:py-6">
  <EnhancedMarquee speed="semislow" pauseOnHover gradientFade className="bg-white dark:bg-[#1C1C1E]">
    {(["PHOTOGRAPHY","DESIGN","PRINT","WEB","VIDEO","EVENTS","BRANDING"] as const).map((word, i) => {
      const M = ["text-[#DF3131]", "text-[#111] dark:text-white", "marquee-outline", "text-[#6E6E6E] dark:text-[#666]"];
      return (
        <span key={i} className="inline-flex items-center">
          <span className={`inline-flex items-center text-[2.25rem] sm:text-[2rem] md:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase px-4 sm:px-6 ${M[i % 4]}`}>{word}</span>
          <span className="inline-flex items-center text-[2.25rem] sm:text-[2rem] md:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase px-4 sm:px-6 opacity-50 text-[#111] dark:text-white">&bull;</span>
        </span>
      );
    })}
  </EnhancedMarquee>
  </section>

{/* ═══ IMAGE GALLERY STRIP ═══ */}
<ScrollReveal animation="fadeIn" duration={1}>
   <ImageReveal direction="up">
   <section className="py-2 w-full relative overflow-hidden">
   <SmoothCarousel items={shuffledHero.length > 0 ? shuffledHero : HERO_IMAGES_RAW} speed={0.55} direction="right" />
   </section>
   </ImageReveal>
   </ScrollReveal>

{/* ═══ SERVICES + PRICING PLANS ═══ */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <section className="pt-8 sm:pt-12 lg:pt-16 pb-20 sm:pb-28 lg:pb-36 relative overflow-hidden wyz-gradient-flow">
 {/* Decorative background elements */}
 <div className="absolute top-0 right-0 w-96 h-96 bg-[#DF3131]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
 <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#DF3131]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

  <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
<div className="text-center mb-12 sm:mb-16 md:mb-20">
      <h2 className="text-[1.25rem] sm:text-[2.3rem] md:text-[2.875rem] font-heading font-black text-[#333] dark:text-white tracking-[0.08em] mb-6">
      <TextSplit stagger={0.02} direction="up">WHAT</TextSplit> <span className="text-[#DF3131]"><TextSplit stagger={0.02} direction="up">WE DO</TextSplit></span>
     </h2>
     <p className="text-[#666] dark:text-white/70 text-[15px] sm:text-base max-w-xl mx-auto leading-relaxed mt-4">Every service we offer comes from one simple place: we make things that look good and actually work. WYZ Design started in Chicago&apos;s DIY art and music scene, making flyers for friends, shooting shows in basements, and learning every part of the creative process by doing it. Founder Torreé Marcel built this from the ground up: 90+ events produced, 45+ clients served. Now based in Los Angeles, we help artists, brands, studios, and anyone with a creative vision turn scattered ideas into work that looks and feels like them.</p>
    </div>
  </div>
   {/* Full-width carousel - full bleed stretching to both sides */}
   <div className="relative z-10 my-16 sm:my-24 w-full overflow-hidden">
      <SmoothCarousel items={shuffledModels.length > 0 ? shuffledModels : MODELS_RAW_RECORDS} speed={0.55} />
   </div>
  <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
  {/* Animated tab switcher. data-chat-avoid (2026-10-10, Claude): this pair
     of buttons lands in ScrollToTop's fixed bottom-left corner at common
     scroll stop points, and ScrollToTop already dodges anything tagged
     data-chat-avoid (board #29/#52's clear-zone IntersectionObserver) --
     reusing that instead of inventing a new mechanism. */}
 <div className="flex flex-wrap justify-center gap-4 mb-10" data-chat-avoid>
 <button onClick={() => setSpTab("services")}
 className={`flex-shrink-0 px-5 sm:px-8 py-3 font-heading font-bold tracking-[0.15em] uppercase text-sm border-2 transition-all duration-500 relative overflow-hidden group ${
 spTab === "services" ? "bg-[#333] text-white border-[#333] shadow-lg shadow-[#333]/20" : "bg-white dark:bg-[#1C1C1E] text-[#333] dark:text-white border-[#ccc] dark:border-[#444] hover:border-[#DF3131] hover:text-[#DF3131]"
 }`}>
 <span className="relative z-10">Services</span>
 {spTab !== "services" && <div className="absolute inset-0 bg-[#DF3131]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
 </button>
 <button onClick={() => setSpTab("plans")}
 className={`flex-shrink-0 px-5 sm:px-8 py-3 font-heading font-bold tracking-[0.15em] uppercase text-sm border-2 transition-all duration-500 relative overflow-hidden group ${
 spTab === "plans" ? "bg-[#333] text-white border-[#333] shadow-lg shadow-[#333]/20" : "bg-white dark:bg-[#1C1C1E] text-[#333] dark:text-white border-[#ccc] dark:border-[#444] hover:border-[#DF3131] hover:text-[#DF3131]"
 }`}>
 <span className="relative z-10">Pricing Plans</span>
 {spTab !== "plans" && <div className="absolute inset-0 bg-[#DF3131]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
 </button>
 </div>

 <div className="min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
  {/* ── SERVICES TAB ── */}
  {spTab === "services" && (
<div className="max-w-6xl mx-auto animate-fadeIn">
   <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black text-[#333] dark:text-white tracking-[0.1em] uppercase text-center mb-8">Services</h2>
   <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-10 -mx-6 px-6">
   <button onClick={() => setActiveTab("ALL")}
    className={`min-h-[44px] px-6 py-2.5 text-xs font-heading font-bold tracking-[0.1em] uppercase border transition-all duration-300 relative overflow-hidden group whitespace-nowrap flex-shrink-0 ${
   activeTab === "ALL"
   ? "bg-[#DF3131] text-white border-[#DF3131] shadow-md shadow-[#DF3131]/20"
   : "bg-white dark:bg-[#1C1C1E] text-[#333] dark:text-white border-[#ccc] dark:border-[#444] hover:border-[#DF3131] hover:text-[#DF3131]"
   }`}>
   <span className="relative z-10">ALL</span>
   </button>
   {SERVICES.map((s) => (
    <button key={s.tab} onClick={() => setActiveTab(s.tab)}
    className={`min-h-[44px] px-6 py-2.5 text-xs font-heading font-bold tracking-[0.1em] uppercase border transition-all duration-300 relative overflow-hidden group whitespace-nowrap flex-shrink-0 ${
   activeTab === s.tab
   ? "bg-[#DF3131] text-white border-[#DF3131] shadow-md shadow-[#DF3131]/20"
   : "bg-white dark:bg-[#1C1C1E] text-[#333] dark:text-white border-[#ccc] dark:border-[#444] hover:border-[#DF3131] hover:text-[#DF3131]"
   }`}>
   <span className="relative z-10">{s.tab}</span>
   </button>
   ))}
   </div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
   {SERVICES.filter(s => activeTab === "ALL" || s.tab === activeTab).map((s) => (
     <div key={s.name} className="group relative p-6 sm:p-7 lg:p-8 border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#DF3131]/10 bg-white dark:bg-[#252528] text-center">
       <div className="w-14 h-14 mx-auto flex items-center justify-center bg-[#DF3131]/10 text-[#DF3131] text-2xl mb-6 group-hover:bg-[#DF3131] group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
         {s.icon}
       </div>
       <h3 className="font-heading font-bold text-[#333] dark:text-white text-[15px] tracking-[0.05em] uppercase mb-4">{s.name}</h3>
       <p className="text-[13px] text-[#666] dark:text-white/70 leading-relaxed mb-6 max-w-[22rem] mx-auto">{s.desc}</p>
       <Link href={s.href} className="inline-flex items-center gap-1 text-[#DF3131] text-sm font-bold tracking-[0.08em] uppercase hover:underline">
         Read More <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
       </Link>
     </div>
   ))}
   </div>
    <div className="text-center mt-16 relative z-10">
    <Link href="/services" className="inline-block px-8 py-3 bg-[#333] text-white dark:bg-white dark:text-[#111] border-2 border-[#333] dark:border-white font-heading font-bold tracking-[0.12em] uppercase text-sm hover:bg-[#DF3131] hover:border-[#DF3131] hover:text-white dark:hover:bg-[#DF3131] dark:hover:text-white dark:hover:border-[#DF3131] transition-all duration-300 hover:shadow-lg hover:shadow-[#DF3131]/20">
    VIEW ALL SERVICES
    </Link>
    </div>
  </div>
  )}

 {/* ── PLANS TAB ── */}
  {spTab === "plans" && (
  <div className="max-w-2xl mx-auto text-center animate-fadeIn">
    <h2 className="text-[1.5rem] sm:text-[2rem] font-heading font-black text-[#333] dark:text-white tracking-[0.1em] uppercase mb-4">Pricing Plans</h2>
    <p className="text-[#666] dark:text-white/60 text-[15px] mb-8">Monthly plans from $250. Each plan includes design time, revisions, and priority booking.</p>
    <Link href="/services#plans" className="inline-block px-8 py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.12em] uppercase text-[13px] hover:bg-[#B82020] transition-all">See plans and prices</Link>
  </div>
  )}
  </div>
  </div>
  </section>
  </ScrollReveal>

<div className="h-12 sm:h-16 lg:h-20" />

{/* ═══ DIGITAL PRINTING BANNER ═══ */}
  <ScrollReveal animation="scaleIn" delay={0.1}>
  <section className="relative py-8 sm:section-gap overflow-hidden bg-black hero-banner">
  <div className="absolute inset-0">
   <Image src="/images/printing/wix_0164.jpg" alt="Digital Printing" fill sizes="100vw" className="w-full h-full object-cover opacity-60" priority />
  </div>
  <div className="absolute inset-0 bg-black/20 z-[1]" />
  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
<h2 className="text-[0.78rem] sm:text-[1.25rem] md:text-[2.5rem] lg:text-[3rem] font-heading font-black text-white tracking-[0.15em] uppercase whitespace-nowrap mb-3 max-w-[calc(100vw-3rem)] mx-auto" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
  DIGITAL <span className="text-[#DF3131]">PRINTING</span>
  </h2>
  <p className="text-white/80 tracking-[0.12em] sm:tracking-[0.3em] text-[9px] sm:text-sm uppercase mb-3 whitespace-nowrap">Flyers | Stickers | Posters | Prints</p>
  <Link href="/printing" className="inline-block px-8 py-4 bg-white text-[#111] border-2 border-white text-[14px] font-bold tracking-[0.12em] hover:bg-[#DF3131] hover:text-white hover:border-[#DF3131] transition-all whitespace-nowrap mt-4">
  CUSTOM PRINTING →
  </Link>
  </div>
  </section>
  </ScrollReveal>

 {/* ═══ CLIENTS ═══ */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <section className="section-gap bg-white dark:bg-[#1C1C1E] overflow-hidden">
  <div className="max-w-6xl mx-auto px-6 text-center mb-4">
  <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black text-[#333] dark:text-white tracking-[0.1em] uppercase mb-4">Clients</h2>
 </div>
 <LogoCarousel items={clientLogos} speed={0.5} />
  </section>
  </ScrollReveal>

  {/* ═══ TESTIMONIALS ═══ */}
  <ScrollReveal animation="fadeUp" delay={0.1}>
    <Testimonials />
  </ScrollReveal>

  {/* ═══ FAQ ═══ */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <section className="section-gap bg-white dark:bg-[#1C1C1E] border-t border-[#E2E2E2] dark:border-[#444]" data-chat-avoid>
  <div className="max-w-7xl mx-auto px-6">
  <div className="relative flex flex-col lg:flex-row gap-8">
  <div className="lg:w-1/3 lg:sticky lg:top-28 lg:self-start">
   <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[3rem] xl:text-[3.5rem] font-heading font-black text-[#333] dark:text-white tracking-[0.08em] uppercase mb-4">FAQ</h2>
   <div className="w-16 h-1 bg-[#DF3131] mx-auto mb-3"></div>
  <p className="text-[#666] dark:text-white/70 text-[15px] leading-relaxed mb-4">Have questions? We have answers. If you can&apos;t find what you&apos;re looking for, reach out to our team.</p>
 <div className="relative mb-4">
 <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666] dark:text-white/50 w-5 h-5" />
  <input
  type="text"
  placeholder="Search questions..."
  value={faqSearch}
  onChange={(e) => setFaqSearch(e.target.value)}
  aria-label="Search frequently asked questions"
  className="w-full pl-10 pr-4 py-3 border-2 border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#252528] text-sm text-[#333] dark:text-white outline-none focus:border-[#DF3131] transition-colors rounded-lg"
  />
 </div>
 <p className="text-[13px] text-[#666] dark:text-white/50">{filteredFaq.length} question{filteredFaq.length !== 1 ? "s" : ""} found</p>
 </div>
  <div className="lg:w-2/3 pr-2">
 <div className="space-y-3">
 {filteredFaq.slice(0, faqCount).map((faq, i) => (
 <div key={i}
  className="border border-[#E2E2E2] dark:border-[#444] rounded-lg overflow-hidden transition-all duration-300"
 style={{
 boxShadow: openFaq === i ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
 }}>
  <button
  onClick={() => setOpenFaq(openFaq === i ? null : i)}
  aria-expanded={openFaq === i}
  aria-controls={`home-faq-answer-${i}`}
   className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
   <span className={`w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-300 flex-shrink-0 ${
   openFaq === i ? "bg-[#DF3131] text-white rotate-45" : "bg-[#F5F5F3] dark:bg-[#252528] text-[#333] dark:text-white"
   }`}>+</span>
    <span className={`font-heading font-bold text-[13px] sm:text-sm tracking-[0.02em] transition-colors whitespace-normal min-w-0 leading-tight ${
   openFaq === i ? "text-[#DF3131]" : "text-[#333] dark:text-white"
   }`}>
     {faq.q}
   </span>
  </button>
 <div id={`home-faq-answer-${i}`} className="grid transition-[grid-template-rows,opacity] duration-300" style={{ gridTemplateRows: openFaq === i ? "1fr" : "0fr", opacity: openFaq === i ? 1 : 0 }} aria-hidden={openFaq !== i}>
 <div className="overflow-hidden">
 <div className="px-6 pb-4 pl-14 sm:pl-[4.5rem]">
 <p className="text-[15px] text-[#666] dark:text-white/70 leading-relaxed">{faq.a}</p>
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 {faqCount < filteredFaq.length && (
 <button
 onClick={() => setFaqCount(prev => Math.min(prev + 7, filteredFaq.length))}
 data-chat-avoid
   className="mt-6 w-full py-3 border-2 border-[#E2E2E2] dark:border-[#444] text-[#333] dark:text-white text-sm font-bold tracking-[0.08em] hover:border-[#DF3131] hover:text-[#DF3131] transition-all rounded-lg text-center">
  Load More ({filteredFaq.length - faqCount} remaining)
 </button>
 )}
 {filteredFaq.length === 0 && (
 <div className="text-center py-12">
 <p className="text-[#666] dark:text-white/50 text-[15px]">No questions match your search. Try different keywords.</p>
 </div>
 )}
 </div>
 </div>
 </div>
 </section>
 </ScrollReveal>

 {/* DESIGN SHOWCASE CAROUSEL ═══ */}
 <ScrollReveal animation="fadeIn" duration={1}>
 <section className="py-6">
 <SmoothCarousel items={shuffledDesign.length > 0 ? shuffledDesign : DESIGN_SHOWCASE_RAW} speed={0.55} />
  </section>
  </ScrollReveal>

  <LeadMagnet />
  </main>
 );
}
