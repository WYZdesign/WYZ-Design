"use client";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import SocialShare from "@/components/SocialShare";

export default function GftFoodsCaseStudy() {
  return (
    <main className="bg-white dark:bg-[#111] min-h-screen pb-20">
      <ScrollReveal animation="fadeUp">
        <section className="bg-[#1a2e1a] text-white py-24 px-6 text-center">
          <p className="text-[#6fcf6f] text-[13px] font-heading font-bold tracking-[0.2em] uppercase mb-2">Case Study</p>
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] font-heading font-black tracking-[0.05em] mb-6 sm:mb-8">
            GFT <span className="text-[#6fcf6f]">FOODS</span>
          </h1>
          <p className="text-white/60 text-[16px] sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Complete rebrand from local shop to national player: new logo, packaging system, e-commerce site, and social content. 3x inquiry rate in 30 days.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { label: "Client", value: "GFT Foods" },
              { label: "Scope", value: "Rebrand + Packaging + Digital Launch" },
              { label: "Focus", value: "Food + Consumer Branding" },
            ].map(s => (
              <div key={s.label} className="border border-[#E2E2E2] dark:border-[#444] p-6">
                <p className="text-[11px] font-heading font-bold tracking-[0.15em] uppercase text-[#666] dark:text-[#666] mb-2">{s.label}</p>
                <p className="text-[14px] text-[#333] dark:text-[#e0e0e0]">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <SocialShare title="GFT Foods Case Study" url="https://www.wyzdesign.com/case-studies/gft-foods" description="Rebrand, packaging, and digital launch for GFT Foods. 3x inquiry rate in 30 days." />
          </div>

          <div className="space-y-6 text-[15px] text-[#666] dark:text-[#666] leading-relaxed mb-12">
            <p>GFT Foods came to WYZ Design as a local shop with a loyal following but a look that didn&apos;t match its ambition. They needed a complete rebrand to compete on a national stage, starting with identity and packaging, then extending into e-commerce and social content.</p>
            <p>WYZ Design delivered a new logo system, a packaging refresh across the full product line, a Shopify storefront, and a social content rollout. Within 30 days of launch, inquiry volume tripled.</p>
          </div>

          <h2 className="font-heading font-black text-[1.5rem] text-[#333] dark:text-[#e0e0e0] tracking-[0.05em] mb-4">Strategy &amp; Deliverables</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {[
              "Logo & identity system",
              "Packaging design system",
              "E-commerce (Shopify) build",
              "Social content rollout",
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-3 border border-[#E2E2E2] dark:border-[#444] p-4">
                <span className="w-2 h-2 rounded-full" style={{ background: "#2E7D32" }} />
                <p className="text-[14px] text-[#333] dark:text-[#e0e0e0]">{d}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/case-studies" className="inline-block px-8 py-3 bg-[#333] text-white dark:bg-white dark:text-[#111] border-2 border-[#333] dark:border-white font-heading font-bold tracking-[0.12em] uppercase text-sm hover:bg-[#DF3131] hover:border-[#DF3131] hover:text-white dark:hover:bg-[#DF3131] dark:hover:text-white dark:hover:border-[#DF3131] transition-all">
              Back to Case Studies
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
