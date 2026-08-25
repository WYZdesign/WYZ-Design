"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import TextMaskReveal from "@/components/TextMaskReveal";
import EnhancedMarquee from "@/components/EnhancedMarquee";
import ParticleBackground from "@/components/ParticleBackground";
import TextSplit from "@/components/TextSplit";
import { SUB_BRANDS } from "@/lib/brands";

const VALUES = [
   { title: "Show Up and Do the Work", body: "No outsourcing. No passing you around. We shoot, design, build, and deliver, every time." },
  { title: "Creativity Earns Real Money", body: "We don't work for exposure or vague promises. Real work gets real compensation. Period." },
  { title: "Fast, Never Sloppy", body: "Speed comes from knowing what we're doing, not from cutting corners. Nothing leaves our desk looking rushed." },
  { title: "Built by Artists, for Artists", body: "We've been in the basement shows, the DIY spaces, the early mornings. We build what we wish existed." },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);

  return (
    <main className="pt-0">
      {/* HERO */}
      <ScrollReveal animation="fadeUp">
        <section className="relative min-h-[75vh] py-24 sm:py-32 lg:py-40 bg-[#111] overflow-hidden hero-banner">
          <div className="absolute inset-0">
            <video autoPlay muted loop playsInline preload="metadata"
              className="w-full h-full object-cover opacity-25">
              <source src="/videos/hero-banners/about.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-[#111]/80 via-[#111]/60 to-[#111]" />
          </div>
          <ParticleBackground count={20} color="#DF3131" maxSize={2} speed={0.2} className="z-[1]" />
          {/* Crown logo marquee — interactive mouse reveal */}
          <div
            ref={heroRef}
            className="absolute inset-0 z-10 flex flex-col justify-center gap-4"
            onMouseMove={(e) => {
              const rect = heroRef.current?.getBoundingClientRect();
              if (!rect) return;
              setMousePos({
                x: (e.clientX - rect.left) / rect.width,
                y: (e.clientY - rect.top) / rect.height,
              });
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {[
              "animate-marquee-left",
              "animate-marquee-right",
              "animate-marquee-left-fast",
              "animate-marquee-right",
              "animate-marquee-left",
              "animate-marquee-right-fast",
              "animate-marquee-left",
              "animate-marquee-right",
            ].map((dir, row) => (
              <div key={row} className="overflow-hidden py-2">
                <div className={`flex whitespace-nowrap ${dir}`}>
                  {Array.from({ length: 24 }).map((_, i) => {
                    const logoX = i / 23;
                    const logoY = row / 7;
                    const dist = Math.sqrt(
                      Math.pow(logoX - mousePos.x, 2) +
                      Math.pow(logoY - mousePos.y, 2)
                    );
                    const proximity = isHovering ? Math.max(0, 1 - dist * 1.8) : 0;
                    const glow = proximity * 0.6;
                    return (
                      <div
                        key={i}
                        className="flex-none flex items-center px-6 transition-all duration-300"
                        style={{
                          opacity: isHovering ? 0.08 + proximity * 0.92 : 0.25,
                          filter: glow > 0 ? `drop-shadow(0 0 ${10 * glow}px #DF3131) brightness(${1 + glow * 0.5})` : undefined,
                          transform: isHovering && proximity > 0.3 ? `scale(${1 + proximity * 0.2})` : undefined,
                        }}
                      >
                        <Image src="/images/wyz-crown.png" alt="WYZ Design crown logo" width={48} height={48} className="w-12 h-12 flex-none object-contain" />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {/* 90% black overlay */}
          <div className="absolute inset-0 bg-black/90 z-[15] pointer-events-none" />
          <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
            <span className="text-[#DF3131] text-[11px] sm:text-[13px] font-heading font-bold tracking-[0.25em] uppercase block mb-2">About Us</span>
            <TextMaskReveal direction="up">
            <h1 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] font-heading font-black text-white tracking-[0.05em] uppercase mb-3 sm:mb-6" style={{ lineHeight: 0 }}>
              <TextSplit stagger={0.03} direction="up">WE MAKE WHAT</TextSplit> <span className="text-[#DF3131]"><TextSplit stagger={0.03} direction="up">WORKS</TextSplit></span>
            </h1>
            </TextMaskReveal>
            <p className="text-white/70 text-[16px] sm:text-lg leading-relaxed max-w-2xl mx-auto mb-3">
              WYZ Design is a creative growth studio for artists, brands, and culture. Built from scratch in Chicago. Scaling in Los Angeles.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* ═══ BRAND MARQUEE ═══ */}
      <EnhancedMarquee speed="slow" pauseOnHover gradientFade className="py-3 bg-white dark:bg-[#1C1C1E]">
        {(["WILD YET ZEALOUS","DYING BREED CREW","NOMADIC BREED","CHICAGO","LOS ANGELES"] as const).map((word, i) => {
          const M = ["text-[#DF3131]", "text-[#111] dark:text-white", "marquee-outline", "text-[#6E6E6E] dark:text-[#8F8F8F]"];
          return (
            <span key={i} className="inline-flex items-center">
              <span className={`inline-flex items-center text-[1.25rem] sm:text-[1.75rem] font-heading font-black tracking-[0.08em] uppercase px-4 sm:px-6 ${M[(i + 1) % 4]}`}>{word}</span>
              <span className="inline-flex items-center text-[1.25rem] sm:text-[1.75rem] font-heading font-black tracking-[0.08em] uppercase px-4 sm:px-6 opacity-50 text-[#111] dark:text-white">&bull;</span>
            </span>
          );
        })}
      </EnhancedMarquee>

      {/* MISSION */}
      <ScrollReveal animation="fadeUp">
        <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#1C1C1E]">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-[1.8rem] sm:text-[2.2rem] lg:text-[3rem] font-heading font-black text-[#333] dark:text-white tracking-[0.08em] uppercase text-center mb-4">
              OUR <span className="text-[#DF3131]">MISSION</span>
            </h2>
            <div className="max-w-3xl mx-auto text-center">
               <p className="text-[#666] dark:text-white/70 text-[16px] sm:text-[17px] leading-relaxed mb-6">
                  We believe every artist, brand, and creative deserves access to professional-grade design, photography, and creative strategy, no gatekeeping, no pretension, and no paying for work that looks like it came from a template.
              </p>
              <p className="text-[#666] dark:text-white/70 text-[16px] sm:text-[17px] leading-relaxed mb-6">
                  WYZ Design started in Chicago's DIY art and music scene, making flyers for friends, shooting shows in basements, and learning every part of the creative process by doing it. Founder <span className="text-[#DF3131] font-bold">Torreé Marcel Harris</span> built this from the ground up: 60+ events, 30+ clients, and a creative standard that doesn't drop based on who's paying.
              </p>
              <p className="text-[#666] dark:text-white/70 text-[16px] sm:text-[17px] leading-relaxed">
                  Now based in Los Angeles, we help artists, brands, studios, and anyone with a creative vision turn scattered ideas into work that looks and feels like them. We don't outsource or pass you around. We do the work ourselves, start to finish.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FOUNDER */}
      <ScrollReveal animation="fadeUp">
        <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F5F3] dark:bg-[#252528]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col items-center gap-12 text-center">
              <div className="w-full max-w-md">
                <div className="relative aspect-[3/4] max-w-sm mx-auto overflow-hidden">
                   <Image src="/images/torre-marcel.jpg" alt="Torreé Marcel Harris, Founder of WYZ Design" fill className="w-full h-full object-cover" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#DF3131]/10 via-transparent to-transparent" />
                </div>
              </div>
              <div className="w-full">
                <span className="text-[#DF3131] text-[11px] sm:text-[13px] font-heading font-bold tracking-[0.25em] uppercase block mb-2">The Founder</span>
                <h2 className="text-[2rem] sm:text-[2.5rem] lg:text-[3.2rem] font-heading font-black text-[#333] dark:text-white tracking-[0.06em] uppercase mb-4" style={{ lineHeight: 0 }}>
                  TORREÉ <span className="text-[#DF3131]">MARCEL</span> HARRIS
                </h2>
                <div className="space-y-4 text-[#666] dark:text-white/70 text-[15px] leading-relaxed max-w-2xl mx-auto">
                  <p>
                    Torreé Marcel Harris (Torreé Marcel, or Torre Harris) is a Chicago-born creative director, photographer, designer, and entrepreneur who built WYZ Design from a side hustle into a full-service creative studio. It started as flyers for local artists and grew into a brand serving 30+ clients with 60+ events produced.
                  </p>
                  <p>
                    With a background in graphic design, event production, and brand strategy, Torreé saw artists and small brands getting underserved by agencies that didn't get their vision or overcharged for work that didn't reflect who they were. WYZ Design was the answer.
                  </p>
                  <p>
                    Now in Los Angeles, Torreé continues to grow WYZ Design's reach while staying true to the values that built it: wild vision, zealous execution, and doing the work the right way, every time.
                  </p>
                </div>
                 <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <Link href="/services" className="inline-block px-8 py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.12em] uppercase text-[13px] hover:bg-[#B82020] transition-all">
                    SEE OUR SERVICES
                  </Link>
                  <Link href="/contact" className="inline-block px-8 py-4 bg-[#333] text-white dark:bg-white dark:text-[#111] border-2 border-[#333] dark:border-white font-heading font-bold tracking-[0.12em] uppercase text-[13px] hover:bg-[#DF3131] hover:text-white hover:border-[#DF3131] dark:hover:bg-[#DF3131] dark:hover:text-white dark:hover:border-[#DF3131] transition-all">
                    GET IN TOUCH
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* BRANDS UNDER WYZ */}
      <ScrollReveal animation="fadeUp">
        <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#1C1C1E]">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-[1.8rem] sm:text-[2.2rem] lg:text-[3rem] font-heading font-black text-[#333] dark:text-white tracking-[0.08em] uppercase text-center mb-4">
              THE <span className="text-[#DF3131]">BRANDS</span>
            </h2>
            <p className="text-[#666] dark:text-white/70 text-[15px] text-center mb-12 max-w-2xl mx-auto">
              Under the WYZ Design umbrella, three distinct brands serve different parts of the creative ecosystem.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SUB_BRANDS.map((brand, i) => (
                <div key={i} className="relative group">
                  <div className="p-8 bg-[#F5F5F3] dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] hover:border-transparent transition-all duration-500 h-full text-center">
                    <div className="w-12 h-1 mb-6 transition-all duration-500 group-hover:w-full mx-auto" style={{ background: brand.color }} />
                    <span className="text-[11px] font-heading font-bold tracking-[0.2em] uppercase mb-2" style={{ color: brand.color }}>{brand.tagline}</span>
                    <h3 className="font-heading font-black text-[#333] dark:text-white text-[18px] sm:text-[20px] tracking-[0.04em] uppercase mb-3">{brand.name}</h3>
                    <p className="text-[14px] text-[#666] dark:text-white/70 leading-relaxed">{brand.longDesc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* VALUES */}
      <ScrollReveal animation="fadeUp">
        <section className="py-16 sm:py-20 lg:py-24 bg-[#111]">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-[1.8rem] sm:text-[2.2rem] lg:text-[3rem] font-heading font-black text-white tracking-[0.08em] uppercase text-center mb-4">
              WHAT WE <span className="text-[#DF3131]">STAND FOR</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v, i) => (
                <div key={i} className="text-center p-6">
                  <div className="w-10 h-10 mx-auto mb-4 bg-[#DF3131] flex items-center justify-center">
                    <span className="text-white font-heading font-bold text-[16px]">{i + 1}</span>
                  </div>
                  <h3 className="font-heading font-bold text-white text-[14px] tracking-[0.06em] uppercase mb-3">{v.title}</h3>
                  <p className="text-white/60 text-[14px] leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* BY THE NUMBERS */}
      <ScrollReveal animation="fadeUp">
        <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#1C1C1E]">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-[1.8rem] sm:text-[2.2rem] lg:text-[3rem] font-heading font-black text-[#333] dark:text-white tracking-[0.08em] uppercase text-center mb-4">
              BY THE <span className="text-[#DF3131]">NUMBERS</span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { num: "60+", label: "Events Produced" },
                { num: "30+", label: "Clients Served" },
                { num: "1000+", label: "Photos Delivered" },
                { num: "6+", label: "Years Running" },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-[2.5rem] sm:text-[3rem] font-heading font-black text-[#DF3131] mb-1">{s.num}</p>
                  <p className="text-[#666] dark:text-white/60 text-[13px] font-heading font-bold tracking-[0.1em] uppercase mb-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal animation="fadeUp">
        <section className="py-16 sm:py-20 lg:py-24 bg-[#DF3131]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-[1.8rem] sm:text-[2.2rem] lg:text-[3rem] font-heading font-black text-white tracking-[0.08em] uppercase mb-4">
              READY TO BUILD?
            </h2>
            <p className="text-white/80 text-[16px] leading-relaxed mb-8 max-w-xl mx-auto">
               Whether you're an artist launching your brand, a business building your identity, or a studio scaling your presence, we're ready when you are.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/booking" className="inline-block px-10 py-4 bg-white text-[#111] font-heading font-bold tracking-[0.12em] uppercase text-[13px] hover:bg-[#DF3131] hover:text-white transition-all">
                BOOK A FREE CONSULTATION
              </Link>
              <Link href="/plans" className="inline-block px-10 py-4 bg-white text-[#111] border-2 border-white font-heading font-bold tracking-[0.12em] uppercase text-[13px] hover:bg-[#DF3131] hover:text-white hover:border-[#DF3131] transition-all">
                VIEW PLANS
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
