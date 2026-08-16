"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FiExternalLink, FiMonitor, FiSmartphone, FiTrendingUp, FiZap, FiGlobe, FiLock, FiArrowRight } from "react-icons/fi";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import EnhancedMarquee from "@/components/EnhancedMarquee";

function FlipCard({ plan }: { plan: { name: string; price: string; features: string[]; accent: boolean } }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ perspective: "1200px", minHeight: "480px" }}
      onClick={() => setFlipped(f => !f)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipped(f => !f); } }}
      tabIndex={0}
      role="button"
      aria-label={`${plan.name} package - click to ${flipped ? "see price" : "see features"}`}
    >
      <div
        className="relative w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
      {/* Front */}
      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
        <div className={`w-full h-full p-8 text-center flex flex-col items-center justify-center ${plan.accent ? "bg-[#DF3131] text-white shadow-xl shadow-[#DF3131]/30 border-4 border-[#DF3131]" : "bg-white border border-[#E2E2E2] hover:border-[#DF3131] hover:shadow-xl hover:shadow-[#DF3131]/10"}`}>
          {plan.accent && <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#333] dark:bg-[#111] text-white text-[11px] font-bold tracking-[0.1em] px-4 py-1 uppercase mb-2">★ Most Popular</span>}
          <h3 className={`font-heading font-bold text-[18px] tracking-[0.1em] uppercase mb-2 ${plan.accent ? "text-white" : "text-[#333]"}`}>{plan.name}</h3>
          <p className={`text-[2.5rem] font-heading font-black mb-4 ${plan.accent ? "text-white" : "text-[#DF3131]"}`}>{plan.price}</p>
          <p className={`text-[12px] tracking-[0.15em] uppercase ${plan.accent ? "text-white/60" : "text-[#999]"}`}>Tap to see what&apos;s included</p>
        </div>
      </div>
      {/* Back */}
      <div className="absolute inset-0" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
        <div className={`w-full h-full p-8 flex flex-col justify-between ${plan.accent ? "bg-[#DF3131] text-white border-4 border-[#DF3131]" : "bg-[#333] dark:bg-[#111] text-white border border-[#444] dark:border-[#333]"}`}>
          <div className="text-center">
            <h3 className={`font-heading font-bold text-[16px] tracking-[0.1em] uppercase mb-1 ${plan.accent ? "text-white" : "text-[#DF3131]"}`}>{plan.name}</h3>
            <p className={`font-heading font-black text-[1.8rem] mb-4 ${plan.accent ? "text-white" : "text-[#DF3131]"}`}>{plan.price}</p>
            <ul className="space-y-2 text-[13px]">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center justify-center gap-2">
                  <span className="text-[#DF3131]">✓</span>
                  <span className="text-white/80">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center mt-4">
            <p className="text-[11px] tracking-[0.15em] uppercase text-white/50 mb-3">Tap to flip back</p>
            <Link href="/booking" onClick={(e) => e.stopPropagation()} className="inline-block w-full max-w-[200px] py-3 font-heading font-bold tracking-[0.12em] uppercase text-[13px] text-center bg-white text-[#DF3131] hover:bg-[#333] dark:hover:bg-[#111] hover:text-white transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

const CLIENT_SITES = [
  { name: "The Greenhouse", url: "https://thegreenhouselife.wixstudio.com/thegreenhouse", category: "Lifestyle / Wellness", accent: "#00FF88" },
  { name: "Artfinix Studios", url: "https://www.artfinixstudios.com/", category: "Photography / Creative", accent: "#FF6B35" },
  { name: "Kidbode", url: "https://www.kidbode.com/", category: "Kids / Education", accent: "#00BFFF" },
  { name: "Greater Fun Timez", url: "https://wyzdesign.wixstudio.com/greaterfuntimez", category: "Events / Entertainment", accent: "#FF1493" },
  { name: "Coach Win E", url: "https://wyzdesign.wixstudio.com/coachwin-e", category: "Coaching / Personal Brand", accent: "#FFD700" },
  { name: "Tasha Harris", url: "https://tashaharris12.wixsite.com/thetashaharris", category: "Personal Brand / Portfolio", accent: "#FF4500" },
  { name: "The Kahari Kyle's", url: "https://wyzdesign.wixstudio.com/thekaharikyles", category: "Family / Lifestyle", accent: "#7B68EE" },
  { name: "Dying Breed Crew", url: "https://wyzdesign.wixstudio.com/dyingbreedcrew", category: "Music / Entertainment", accent: "#FF0000" },
  { name: "Contrabrand", url: "https://nicbeans311.wixstudio.com/controbrand", category: "Fashion / Brand", accent: "#FF8C00" },
];

const CAPABILITIES = [
  { icon: <FiMonitor />, title: "Custom Design", desc: "Unique layouts built from scratch, no templates, no cookie-cutter. Your brand, your vision." },
  { icon: <FiSmartphone />, title: "Fully Responsive", desc: "Pixel-perfect on every device, desktop, tablet, phone. Your site works everywhere." },
  { icon: <FiTrendingUp />, title: "SEO Optimized", desc: "Built for Google from day one. Proper meta tags, fast load times, structured data." },
  { icon: <FiZap />, title: "Lightning Fast", desc: "Optimized images, clean code, CDN delivery. Sub-second load times that keep visitors engaged." },
  { icon: <FiGlobe />, title: "E-Commerce Ready", desc: "Full online store setup, product listings, cart, checkout, payment processing." },
  { icon: <FiLock />, title: "Secure & Reliable", desc: "SSL certificates, secure hosting, automated backups, and 99.9% uptime guaranteed." },
];

const PROCESS_STEPS = [
  { num: "01", title: "Discovery", desc: "We learn your brand, audience, and goals. Every great site starts with understanding." },
  { num: "02", title: "Design", desc: "Wireframes and mockups you approve before any code is written. You see it first." },
  { num: "03", title: "Develop", desc: "Clean, fast, responsive code. Built on modern frameworks for performance and reliability." },
  { num: "04", title: "Launch", desc: "Deploy to production, configure analytics, submit to search engines. We go live." },
  { num: "05", title: "Support", desc: "Ongoing maintenance, updates, and optimization. Your site stays sharp." },
];

function SiteCard({ site, index }: { site: typeof CLIENT_SITES[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLAnchorElement>(null);
  const gyroActive = useRef(false);

  // Gyroscope for mobile
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    const startGyro = () => {
      const handler = (e: DeviceOrientationEvent) => {
        if (e.beta === null || e.gamma === null) return;
        gyroActive.current = true;
        const x = Math.max(0, Math.min(100, ((e.gamma || 0) + 90) / 1.8));
        const y = Math.max(0, Math.min(100, ((e.beta || 0) + 90) / 1.8));
        setMousePos({ x, y });
      };
      window.addEventListener("deviceorientation", handler, true);
      cleanup = () => window.removeEventListener("deviceorientation", handler, true);
    };
    const requestPerm = async () => {
      try {
        if (typeof DeviceOrientationEvent !== "undefined" && typeof (DeviceOrientationEvent as any).requestPermission === "function") {
          const perm = await (DeviceOrientationEvent as any).requestPermission();
          if (perm === "granted") startGyro();
        } else { startGyro(); }
      } catch (e) { console.warn("[web-design-page] Gyro permission failed", e); }
    };
    const onFirst = () => { document.removeEventListener("touchend", onFirst); document.removeEventListener("click", onFirst); requestPerm(); };
    document.addEventListener("touchend", onFirst, { once: true });
    document.addEventListener("click", onFirst, { once: true });
    return () => { document.removeEventListener("touchend", onFirst); document.removeEventListener("click", onFirst); cleanup?.(); };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gyroActive.current) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  return (
    <a href={site.url} target="_blank" rel="noopener noreferrer"
      ref={cardRef}
      className="group relative block overflow-hidden aspect-[16/10] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{ animationDelay: `${index * 0.06}s` }}>
      {/* Gradient background with mouse-follow highlight */}
      <div className="absolute inset-0 bg-black transition-all duration-500">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]"
          style={{ background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${site.accent}60 0%, transparent 60%)` }} />
      </div>
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 group-hover:text-white/60 transition-colors mb-2">{site.category}</span>
        <h3 className="font-heading font-black text-white text-[1.1rem] sm:text-[1.3rem] tracking-[0.04em] uppercase group-hover:scale-105 transition-transform duration-300 mb-3">{site.name}</h3>
        {/* Hover reveal */}
        <div className="flex items-center gap-2 mt-3 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-all duration-300 sm:translate-y-3 sm:group-hover:translate-y-0">
          <span className="text-[12px] font-bold tracking-[0.1em] uppercase mb-2" style={{ color: site.accent }}>Visit Live Site</span>
          <FiExternalLink className="w-3.5 h-3.5" style={{ color: site.accent }} />
        </div>
      </div>
      {/* Border glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 2px ${site.accent}60, inset 0 0 30px ${site.accent}15` }} />
    </a>
  );
}

export default function WebDesignPage() {
  const [activeStep, setActiveStep] = useState(0);
  const stepTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    stepTimer.current = setInterval(() => setActiveStep(p => (p + 1) % PROCESS_STEPS.length), 3000);
    return () => { if (stepTimer.current) clearInterval(stepTimer.current); };
  }, []);

return (
    <>
      <main className="min-h-screen bg-white dark:bg-[#111] pt-0 pb-0">
        {/* ═══ HERO — Split (desktop video/text, mobile merged) ═══ */}
        <section className="relative min-h-[70vh] sm:min-h-[75vh] lg:min-h-screen overflow-hidden hero-banner">
        {/* Desktop split grid */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:h-full">
          <div className="relative h-full">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#DF3131]/20">
              <video autoPlay muted loop playsInline preload="metadata"
                className="w-full h-full object-cover">
                <source src="/videos/hero-banners/web-design.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          <div className="relative z-10 bg-gradient-to-br from-[#e8e8e8] to-[#dadada] flex flex-col items-center text-center px-6 lg:px-12 py-16 min-h-[500px]">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase text-[#DF3131] block mb-2">WYZ DESIGN - WEB DEVELOPMENT</span>
            <h1 className="text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-[#111] tracking-[0.08em] mb-3 sm:mb-6" style={{ lineHeight: 1 }}>
              WEBSITES<br />
              THAT <span className="text-[#DF3131]">WORK</span>
            </h1>
            <p className="text-[#333] text-[16px] sm:text-[16px] leading-relaxed mb-2 max-w-md">
              From concept to launch, custom-built, responsive, SEO-optimized websites designed to convert visitors into customers.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              <Link href="/booking" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.12em] uppercase text-[12px] sm:text-[14px] hover:bg-[#B82020] transition-all hover:shadow-lg hover:shadow-[#DF3131]/30">
                GET A QUOTE <FiArrowRight className="w-4 h-4" />
              </Link>
              <a href="#portfolio" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-black text-black font-heading font-bold tracking-[0.12em] uppercase text-[12px] sm:text-[14px] hover:bg-black hover:text-white transition-all">
                VIEW WORK
              </a>
            </div>
            {/* Stats strip */}
            <div className="flex gap-6 sm:gap-10 mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-black/10 justify-center">
              <AnimatedCounter end={11} suffix="+" className="text-[1.5rem] sm:text-[2rem] font-heading font-black text-[#DF3131] whitespace-nowrap text-center" labelClassName="text-[11px] text-[#666] tracking-[0.1em] uppercase" label="Sites Built" />
              <AnimatedCounter end={100} suffix="%" className="text-[1.5rem] sm:text-[2rem] font-heading font-black text-[#DF3131] whitespace-nowrap text-center" labelClassName="text-[11px] text-[#666] tracking-[0.1em] uppercase" label="Responsive" />
              <AnimatedCounter end={7} suffix="-Day" className="text-[1.5rem] sm:text-[2rem] font-heading font-black text-[#DF3131] whitespace-nowrap text-center" labelClassName="text-[11px] text-[#666] tracking-[0.1em] uppercase" label="Turnaround" />
            </div>
          </div>
        </div>
        {/* Mobile merged */}
        <div className="lg:hidden absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#DF3131]/20">
            <video autoPlay muted loop playsInline preload="metadata"
              className="w-full h-full object-cover">
              <source src="/videos/hero-banners/web-design.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 bg-black/30 z-[1]" />
          <div className="relative z-10 max-w-lg mx-auto px-4 sm:px-10 lg:px-16 py-16 sm:py-20 text-center flex flex-col items-center justify-center h-full">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase text-[#DF3131] block text-center mb-2">WYZ DESIGN - WEB DEVELOPMENT</span>
            <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-white tracking-[0.08em] text-center mb-3 sm:mb-6" style={{ lineHeight: 1 }}>
              WEBSITES<br />
              THAT <span className="text-[#DF3131]">WORK</span>
            </h1>
            <p className="text-white/70 text-[16px] sm:text-[16px] leading-relaxed mb-3 sm:mb-3 max-w-md mx-auto text-center">
              From concept to launch, custom-built, responsive, SEO-optimized websites designed to convert visitors into customers.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center w-full">
              <Link href="/booking" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.12em] uppercase text-[12px] sm:text-[14px] text-center hover:bg-[#B82020] transition-all justify-center">
                GET A QUOTE <FiArrowRight className="w-4 h-4" />
              </Link>
              <a href="#portfolio" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#111] border-2 border-white font-heading font-bold tracking-[0.12em] uppercase text-[12px] sm:text-[14px] text-center hover:bg-[#DF3131] hover:text-white hover:border-[#DF3131] transition-all justify-center">
                VIEW WORK
              </a>
            </div>
            {/* Stats strip */}
            <div className="flex gap-6 sm:gap-10 mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 justify-center w-full">
              <AnimatedCounter end={11} suffix="+" className="text-[1.5rem] sm:text-[2rem] font-heading font-black text-[#DF3131] whitespace-nowrap text-center" labelClassName="text-[11px] text-white/50 tracking-[0.1em] uppercase" label="Sites Built" />
              <AnimatedCounter end={100} suffix="%" className="text-[1.5rem] sm:text-[2rem] font-heading font-black text-[#DF3131] whitespace-nowrap text-center" labelClassName="text-[11px] text-white/50 tracking-[0.1em] uppercase" label="Responsive" />
              <AnimatedCounter end={7} suffix="-Day" className="text-[1.5rem] sm:text-[2rem] font-heading font-black text-[#DF3131] whitespace-nowrap text-center" labelClassName="text-[11px] text-white/50 tracking-[0.1em] uppercase" label="Turnaround" />
            </div>
          </div>
        </div>
        </section>

        {/* ═══ WEB DESIGN MARQUEE ═══ */}
        <EnhancedMarquee speed="normal" pauseOnHover gradientFade className="py-3 -mt-6 bg-white dark:bg-[#232326]">
          {(["RESPONSIVE","SEO","E-COMMERCE","LANDING PAGES","CMS","CUSTOM CODE"] as const).map((word, i) => {
            const M = ["text-[#DF3131]", "text-[#111] dark:text-white", "marquee-outline", "text-[#6E6E6E] dark:text-[#8F8F8F]"];
            return (
              <>
                <span key={`w-${i}`} className={`inline-flex items-center text-[1.25rem] sm:text-[1.75rem] font-heading font-black tracking-[0.08em] uppercase px-4 sm:px-6 ${M[i % 4]}`}>{word}</span>
                <span key={`b-${i}`} className="inline-flex items-center text-[1.25rem] sm:text-[1.75rem] font-heading font-black tracking-[0.08em] uppercase px-4 sm:px-6 opacity-50 text-[#111] dark:text-white">&bull;</span>
              </>
            );
          })}
        </EnhancedMarquee>

        {/* ═══ CAPABILITIES — Scroll reveal ═══ */}
        <ScrollReveal animation="fadeUp">
          <section className="pt-6 pb-20 bg-white dark:bg-[#232326]">
            <div className="max-w-[115rem] mx-auto px-6 lg:px-12">
              <div className="text-center mb-8">
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#DF3131] block mb-2">WHAT WE DO</span>
                <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase text-[#333] dark:text-[#e0e0e0] mb-4">CAPABILITIES</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {CAPABILITIES.map((c, i) => (
                  <div key={c.title} className="group text-center p-10 border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#DF3131]/10 cursor-default"
                    style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="w-14 h-14 mx-auto flex items-center justify-center bg-[#DF3131]/10 text-[#DF3131] text-xl mb-5 group-hover:bg-[#DF3131] group-hover:text-white transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
                      {c.icon}
                    </div>
                    <h3 className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] text-[15px] tracking-[0.05em] uppercase mb-3">{c.title}</h3>
                    <p className="text-[13px] text-[#888] dark:text-white/50 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ═══ PROCESS — Auto-cycling timeline ═══ */}
        <ScrollReveal animation="fadeUp">
          <section className="py-20 bg-[#111]">
            <div className="max-w-[115rem] mx-auto px-6 lg:px-12">
              <div className="text-center mb-10">
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#DF3131] block mb-2">HOW IT WORKS</span>
                <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase text-white mb-4">OUR PROCESS</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {PROCESS_STEPS.map((step, i) => (
                  <div key={step.num}
                    className={`relative p-6 text-center cursor-pointer transition-all duration-500 border ${i === activeStep ? "bg-[#DF3131] scale-105 shadow-xl shadow-[#DF3131]/30 border-[#DF3131]" : "bg-[#1a1a1a] border-white/20 hover:border-[#DF3131]"}`}
                    onClick={() => setActiveStep(i)}
                    onMouseEnter={() => { if (stepTimer.current) clearInterval(stepTimer.current); }}
                    onMouseLeave={() => { stepTimer.current = setInterval(() => setActiveStep(p => (p + 1) % PROCESS_STEPS.length), 3000); }}>
                    <span className={`text-[2rem] font-heading font-black block mb-2 transition-colors ${i === activeStep ? "text-white" : "text-[#DF3131]"}`}>{step.num}</span>
<h3 className={`font-heading font-bold text-[14px] tracking-[0.08em] uppercase mb-2 transition-colors ${i === activeStep ? "text-white" : "text-white"}`}>{step.title}</h3>
 <p className={`text-[12px] leading-relaxed transition-colors ${i === activeStep ? "text-white/80" : "text-white/60"}`}>{step.desc}</p>
                    {i < PROCESS_STEPS.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-[2px] bg-white/20" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ═══ CLIENT PORTFOLIO — Interactive grid ═══ */}
        <ScrollReveal animation="fadeUp" delay={0.1}>
          <section id="portfolio" className="py-20 bg-[#F5F5F3] dark:bg-[#2b2b2e]">
            <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
              <div className="text-center mb-12">
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#DF3131] block mb-2">OUR WORK</span>
                <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase text-[#333] dark:text-[#e0e0e0] mb-4">CLIENT PORTFOLIO</h2>
                <p className="text-[#888] dark:text-white/50 text-[14px] mt-3 max-w-lg mx-auto">Tap any card to visit the live site. Real clients, real results.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CLIENT_SITES.map((site, i) => <SiteCard key={site.name} site={site} index={i} />)}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ═══ PRICING ═══ */}
        <ScrollReveal animation="fadeUp">
          <section className="py-20 bg-white dark:bg-[#232326]">
            <div className="max-w-[115rem] mx-auto px-6 lg:px-12">
              <div className="text-center mb-14">
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#DF3131] block mb-2">PRICING</span>
                <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase text-[#333] dark:text-[#e0e0e0] mb-4">MAKE IT AN ADD-ON</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto" style={{ perspective: "1200px" }}>
                {[
                  { name: "Starter", price: "$499", features: ["1-page landing", "Mobile responsive", "Contact form", "Basic SEO", "7-day delivery"], accent: false },
                  { name: "Business", price: "$1,299", features: ["Up to 5 pages", "Custom design", "CMS integration", "Advanced SEO", "Analytics setup", "14-day delivery"], accent: true },
                  { name: "E-Commerce", price: "$2,499", features: ["Unlimited products", "Payment processing", "Inventory management", "Custom checkout", "Full SEO suite", "30-day delivery"], accent: false },
                ].map((plan) => (
                  <FlipCard key={plan.name} plan={plan} />
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ═══ CTA ═══ */}
        <ScrollReveal animation="fadeUp">
          <section className="py-16 bg-white dark:bg-[#111] text-center">
            <div className="max-w-3xl mx-auto px-6">
<h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase text-[#333] dark:text-white mb-4">READY TO BUILD?</h2>
 <p className="text-[#666] dark:text-white/50 text-[15px] mb-8 max-w-lg mx-auto">Let&apos;s create a website that works as hard as you do. Book a free consultation to get started.</p>
              <Link href="/booking" className="inline-block px-12 py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.15em] uppercase text-[15px] hover:bg-[#B82020] transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#DF3131]/30">
                BOOK CONSULTATION
              </Link>
            </div>
          </section>
        </ScrollReveal>
      </main>
    </>
  );
}
