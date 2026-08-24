"use client";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import SocialShare from "@/components/SocialShare";

export default function KidBodeCaseStudy() {
  return (
    <main className="bg-white dark:bg-[#111] min-h-screen pb-20">
      <ScrollReveal animation="fadeUp">
        <section className="bg-white dark:bg-[#111] text-[#333] dark:text-white py-24 px-6 text-center">
          <p className="text-[#DF3131] text-[13px] font-heading font-bold tracking-[0.2em] uppercase mb-2">Case Study</p>
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] font-heading font-black tracking-[0.05em] mb-6 sm:mb-8">
            KID <span className="text-[#DF3131]">BODE</span>
          </h1>
          <p className="text-[#666] dark:text-white/60 text-[16px] sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Brand identity, photography, video content, and campaign strategy for an emerging music artist building their visual presence from scratch.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { label: "Client", value: "Kid Bode - Music Artist" },
              { label: "Scope", value: "Brand Identity + Content Production" },
              { label: "Result", value: "Complete visual ecosystem launch" },
            ].map(s => (
              <div key={s.label} className="border border-[#E2E2E2] dark:border-[#444] p-6">
                <p className="text-[11px] font-heading font-bold tracking-[0.15em] uppercase text-[#888] dark:text-[#666] mb-2">{s.label}</p>
                <p className="text-[14px] text-[#333] dark:text-[#e0e0e0]">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <SocialShare title="Kid Bode Case Study" url="https://www.wyzdesign.com/case-studies/kid-bode" description="Artist branding, content production, and visual identity for an emerging music artist." />
          </div>

          <div className="space-y-6 text-[15px] text-[#666] dark:text-[#888] leading-relaxed mb-12">
            <p>Kid Bode came to WYZ Design as an emerging artist needing more than a logo. They needed a visual world: press photos, cover art, social content, and a consistent brand language that translated across every platform and made them look like they belonged at the table.</p>
            <p>WYZ Design built the full brand ecosystem: photography sessions capturing the artist&apos;s energy, cover art and single artwork designs, short form video content for social rollout, and a consistent visual identity that tied everything together under one clear aesthetic.</p>
          </div>

          <h2 className="font-heading font-black text-[1.5rem] text-[#333] dark:text-[#e0e0e0] tracking-[0.05em] mb-4">Deliverables</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {[
              { title: "Press Photography", desc: "Full photoshoot capturing multiple looks and environments for press kit and social use." },
              { title: "Cover Art Design", desc: "Single and album artwork designed with consistent visual language across releases." },
              { title: "Social Content Kit", desc: "Short form video edits, static graphics, and story templates for Instagram and TikTok." },
              { title: "Brand Identity System", desc: "Logo refinement, color palette, typography system, and brand usage guidelines." },
              { title: "Release Strategy", desc: "Rollout planning for singles with coordinated visual content across platforms." },
              { title: "Artist EPK", desc: "Electronic press kit with bio, photos, music links, and booking contact information." },
            ].map(d => (
              <div key={d.title} className="bg-[#F5F5F3] dark:bg-[#2b2b2e] p-6">
                <h3 className="font-heading font-bold text-[15px] text-[#333] dark:text-[#e0e0e0] mb-3">{d.title}</h3>
                <p className="text-[14px] text-[#666] dark:text-[#888]">{d.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center bg-[#F5F5F3] dark:bg-[#2b2b2e] p-12">
            <p className="text-[#666] dark:text-[#888] text-[15px] italic mb-6 max-w-xl mx-auto leading-relaxed">
              Artists need more than talent. They need visual infrastructure that makes people take them seriously. This is what WYZ Design builds.
            </p>
            <Link href="/contact" className="inline-block border-2 border-[#DF3131] text-[#DF3131] px-8 py-4 font-heading font-bold tracking-[0.15em] uppercase text-[14px] hover:bg-[#DF3131] hover:text-white transition-all">
              Work With Us
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
