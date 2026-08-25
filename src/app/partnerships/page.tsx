"use client";
import Link from "next/link";
import { FiArrowRight, FiUsers, FiTarget, FiTrendingUp } from "react-icons/fi";
import { SUB_BRANDS } from "@/lib/brands";

const TIERS = [
  {
    name: "Creative Partner",
    price: "Custom",
    desc: "For brands and studios looking for ongoing creative support.",
    perks: [
      "Dedicated creative direction",
      "Monthly content production",
      "Brand strategy sessions",
      "Priority booking and turnaround",
      "Co-branded marketing opportunities",
    ],
  },
  {
    name: "Event Partner",
    price: "Custom",
    desc: "For venues, promoters, and event organizers.",
    perks: [
      "Full event production support",
      "Photo/video coverage",
      "Promotional asset creation",
      "Social media rollout",
      "Recap content delivery",
    ],
  },
  {
    name: "Referral Partner",
    price: "Free",
    desc: "For anyone who wants to earn by sending clients our way.",
    perks: [
      "10% commission on referred clients",
      "No limits on referrals",
      "Quarterly payouts",
      "Co-branded referral materials",
      "Priority support for referred clients",
    ],
  },
];

export default function PartnershipsPage() {
  return (
    <main className="pb-16 bg-white dark:bg-[#232326]">
      {/* Hero */}
      <section className="relative min-h-[75vh] py-20 sm:py-28 lg:py-36 bg-[#111] overflow-hidden hero-banner">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#1a1a1a] to-[#DF3131]/20" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-32 lg:pt-40">
          <p className="text-[#DF3131] text-[12px] font-heading font-bold tracking-[0.25em] uppercase mb-2">Collaborate With Us</p>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] font-heading font-black text-white tracking-[0.08em] mb-6 sm:mb-8" style={{ lineHeight: 0 }}>
            PARTNERS<span className="text-[#DF3131]">HIPS</span>
          </h1>
          <p className="text-white/60 text-[16px] sm:text-lg max-w-2xl mx-auto leading-relaxed">
            WYZ Design partners with artists, brands, studios, and communities to produce creative work that moves culture. We are always looking for the right people to build with.
          </p>
        </div>
      </section>

      {/* Our Brands */}
      <section className="py-16 sm:py-20 bg-white dark:bg-[#232326]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] font-heading font-black text-[#333] dark:text-white tracking-[0.08em] mb-4">
              THE <span className="text-[#DF3131]">BRANDS</span>
            </h2>
            <p className="text-[#666] dark:text-white/60 text-[15px] max-w-xl mx-auto">Under the WYZ Design umbrella, three distinct brands serve different parts of the creative ecosystem.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUB_BRANDS.map((p) => (
              <div key={p.name} className="bg-[#F5F5F3] dark:bg-[#2b2b2e] rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: p.color }} />
                <p className="text-[11px] font-heading font-bold tracking-[0.2em] uppercase mb-2" style={{ color: p.color }}>{p.tagline}</p>
                <h3 className="font-heading font-bold text-[20px] tracking-[0.06em] text-[#333] dark:text-white uppercase mb-3">{p.name}</h3>
                <p className="text-[15px] text-[#666] dark:text-white/60 leading-relaxed">{p.longDesc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-16 sm:py-20 bg-[#F5F5F3] dark:bg-[#2b2b2e]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] font-heading font-black text-[#333] dark:text-white tracking-[0.08em] mb-4">
              WHY <span className="text-[#DF3131]">PARTNER</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-[#DF3131]/10 flex items-center justify-center rounded-xl">
                <FiUsers className="w-7 h-7 text-[#DF3131]" />
              </div>
              <h3 className="font-heading font-bold text-[16px] tracking-[0.05em] text-[#333] dark:text-white uppercase mb-3">Expand Your Reach</h3>
              <p className="text-[15px] text-[#666] dark:text-white/60">Tap into our network of artists, brands, and creative communities across Chicago and Los Angeles.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-[#DF3131]/10 flex items-center justify-center rounded-xl">
                <FiTarget className="w-7 h-7 text-[#DF3131]" />
              </div>
              <h3 className="font-heading font-bold text-[16px] tracking-[0.05em] text-[#333] dark:text-white uppercase mb-3">Professional Execution</h3>
              <p className="text-[15px] text-[#666] dark:text-white/60">Every project gets the full WYZ Design treatment, bold creative direction, professional production, zero shortcuts.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-[#DF3131]/10 flex items-center justify-center rounded-xl">
                <FiTrendingUp className="w-7 h-7 text-[#DF3131]" />
              </div>
              <h3 className="font-heading font-bold text-[16px] tracking-[0.05em] text-[#333] dark:text-white uppercase mb-3">Mutual Growth</h3>
              <p className="text-[15px] text-[#666] dark:text-white/60">Partnerships are built on shared success. We invest in relationships that create real value for both sides.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Tiers */}
      <section className="py-16 sm:py-20 bg-white dark:bg-[#232326]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] font-heading font-black text-[#333] dark:text-white tracking-[0.08em] mb-4">
              PARTNERSHIP <span className="text-[#DF3131]">TIERS</span>
            </h2>
            <p className="text-[#666] dark:text-white/60 text-[15px] max-w-xl mx-auto">Choose the partnership model that fits your goals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TIERS.map((tier) => (
              <div key={tier.name} className="border border-[#E2E2E2] dark:border-[#444] rounded-2xl p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <h3 className="font-heading font-bold text-[18px] tracking-[0.06em] text-[#333] dark:text-white uppercase mb-3">{tier.name}</h3>
                <p className="text-[#DF3131] font-heading font-bold text-[14px] tracking-[0.1em] mb-2">{tier.price}</p>
                <p className="text-[15px] text-[#666] dark:text-white/60 mb-6">{tier.desc}</p>
                <ul className="space-y-3">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-[14px] text-[#555] dark:text-white/50">
                      <span className="text-[#DF3131] mt-0.5 shrink-0">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-[#DF3131]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] font-heading font-black text-white tracking-[0.08em] mb-4">
            READY TO BUILD?
          </h2>
          <p className="text-white/80 text-[16px] max-w-xl mx-auto mb-8">
            Whether you are an artist, brand, studio, or community, we are ready to partner with you. Let us talk about what we can create together.
          </p>
          <div className="flex flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-block px-8 py-3 bg-white text-[#111] font-heading font-bold tracking-[0.12em] uppercase text-[14px] hover:bg-[#DF3131] hover:text-white transition-all">
              Get In Touch
            </Link>
            <Link href="/services" className="inline-block px-8 py-3 bg-white text-[#111] border-2 border-white font-heading font-bold tracking-[0.12em] uppercase text-[14px] hover:bg-[#DF3131] hover:text-white hover:border-[#DF3131] transition-all">
              View Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
