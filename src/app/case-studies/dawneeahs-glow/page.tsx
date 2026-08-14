"use client";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";

export default function DawneeahsGlowCaseStudy() {
  return (
    <main className="bg-white dark:bg-[#111] min-h-screen pb-20">
      <ScrollReveal animation="fadeUp">
        <section className="bg-[#1e1a2e] text-white py-24 px-6 text-center">
          <p className="text-[#b39dfb] text-[13px] font-heading font-bold tracking-[0.2em] uppercase mb-2">Case Study</p>
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] font-heading font-black tracking-[0.05em] mb-6 sm:mb-8">
            DAWNEEAH&apos;S <span className="text-[#b39dfb]">GLOW</span>
          </h1>
          <p className="text-white/60 text-[16px] sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Full brand identity, product photography, Shopify build, and social strategy for skincare founder. $180K revenue in first 90 days.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { label: "Client", value: "Dawneeah's Glow" },
              { label: "Scope", value: "Brand Identity + Photography + E-Commerce" },
              { label: "Focus", value: "Skincare + Beauty" },
            ].map(s => (
              <div key={s.label} className="border border-[#E2E2E2] dark:border-[#444] p-6">
                <p className="text-[11px] font-heading font-bold tracking-[0.15em] uppercase text-[#888] dark:text-[#666] mb-2">{s.label}</p>
                <p className="text-[14px] text-[#333] dark:text-[#e0e0e0]">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6 text-[15px] text-[#666] dark:text-[#888] leading-relaxed mb-12">
            <p>Dawneeah&apos;s Glow is a skincare brand built by a founder with a clear vision but no visual system to match it. WYZ Design built the full identity — logo, color, typography, and photography direction — then carried it into a Shopify storefront and social strategy.</p>
            <p>The result: a cohesive brand that converted browsers into buyers. The brand hit $180K in revenue within the first 90 days of launch.</p>
          </div>

          <h2 className="font-heading font-black text-[1.5rem] text-[#333] dark:text-[#e0e0e0] tracking-[0.05em] mb-4">Strategy &amp; Deliverables</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {[
              "Logo & identity system",
              "Product photography",
              "Shopify storefront build",
              "Social media strategy",
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-3 border border-[#E2E2E2] dark:border-[#444] p-4">
                <span className="w-2 h-2 rounded-full" style={{ background: "#7C4DFF" }} />
                <p className="text-[14px] text-[#333] dark:text-[#e0e0e0]">{d}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/case-studies" className="inline-block px-8 py-3 border-2 border-[#333] dark:border-white text-[#333] dark:text-white font-heading font-bold tracking-[0.12em] uppercase text-sm hover:bg-[#DF3131] hover:border-[#DF3131] hover:text-white transition-all">
              Back to Case Studies
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
