"use client";
import { useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiTarget, FiTrendingUp, FiUsers, FiCheck, FiCalendar } from "react-icons/fi";
import ScrollReveal from "@/components/ScrollReveal";

const PILLARS = [
  {
    icon: <FiTarget />,
    title: "1. Brand Identity",
    intro: "Define who you are, and make sure everyone else knows it too.",
    items: [
      "Custom logo and visual identity system (primary/secondary marks, color palette, typography)",
      "Brand voice and messaging guide, how you talk, what you say, where you say it",
      "Social media kit: branded templates, highlight covers, profile optimization",
      "Business card and collateral design for consistent touchpoints",
    ],
    outcome: "You walk away with a brand that looks professional, feels authentic, and actually represents you.",
    timeline: "2-4 weeks",
  },
  {
    icon: <FiTrendingUp />,
    title: "2. Growth Strategy",
    intro: "Know where you're going. Build the roadmap to get there.",
    items: [
      "Competitive landscape analysis, who's doing what in your space and where you fit",
      "Content strategy with monthly calendar: what to post, when to post, why it matters",
      "Paid media audit and recommendations, Google Ads, Meta, TikTok strategies",
      "SEO foundation: keyword research, on-page optimization, local search setup",
    ],
    outcome: "A clear, executable marketing plan that doesn't require a full-time team to maintain.",
    timeline: "3-6 weeks",
  },
  {
    icon: <FiUsers />,
    title: "3. Community Building",
    intro: "Build your tribe. Turn followers into a community that shows up.",
    items: [
      "Audience engagement strategy: how to actually interact with people (not just broadcast)",
      "Event planning and execution, from pop-up shops to gallery shows to live streams",
      "Email marketing setup with automated welcome sequences and segmented campaigns",
      "Partnership and collaboration roadmap, identify aligned creators and brands",
    ],
    outcome: "A community that engages, shares, and advocates for your brand, not just scrolls past.",
    timeline: "4-8 weeks",
  },
];

export default function ThreePointProgramPage() {
  const [activePillar, setActivePillar] = useState(0);

  return (
    <main className="pb-20 bg-white dark:bg-[#232326]">
      <ScrollReveal animation="fadeUp">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14 pt-12">
            <p className="text-[#DF3131] text-[13px] font-heading font-bold tracking-[0.2em] uppercase mb-2">Framework</p>
            <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.15em] mb-6 sm:mb-8" style={{ lineHeight: 1 }}>3-POINT PROGRAM</h1>
            <p className="text-[#666] dark:text-[#b0b0b0] max-w-xl mx-auto text-[16px] leading-relaxed">A structured framework for building your brand from the ground up. Three pillars, one unified vision. Built for creatives, artists, and small businesses who are tired of guessing.</p>
          </div>

          {/* Pillar tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {PILLARS.map((p, i) => (
              <button key={i} onClick={() => setActivePillar(i)}
                className={`px-6 py-3 rounded-full text-[12px] font-bold tracking-[0.1em] uppercase transition-all ${
                  activePillar === i ? "bg-[#DF3131] text-white shadow-lg shadow-[#DF3131]/30" : "bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#444] text-[#666] dark:text-white/70 hover:border-[#DF3131]"
                }`}>
                {p.title}
              </button>
            ))}
          </div>

          {/* Active pillar */}
          <div className="bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#444] p-8 sm:p-10 mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#DF3131]/10 flex items-center justify-center text-[#DF3131] text-2xl shrink-0">
                {PILLARS[activePillar].icon}
              </div>
              <div>
                <h2 className="text-[1.25rem] sm:text-[1.5rem] font-heading font-bold text-[#333] dark:text-[#e0e0e0] tracking-[0.05em] mb-4">{PILLARS[activePillar].title}</h2>
                <p className="text-[#8F8F8F] text-[13px] flex items-center gap-1.5"><FiCalendar className="w-3.5 h-3.5" /> {PILLARS[activePillar].timeline}</p>
              </div>
            </div>
            <p className="text-[#666] dark:text-[#b0b0b0] text-[16px] mb-6">{PILLARS[activePillar].intro}</p>
            <ul className="space-y-3 mb-6">
              {PILLARS[activePillar].items.map((item, j) => (
                <li key={j} className="flex gap-3 text-[16px] text-[#666] dark:text-[#b0b0b0] leading-relaxed">
                  <FiCheck className="w-4 h-4 text-[#DF3131] mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-[#f5f5f5] dark:bg-[#2b2b2e] p-4 rounded-lg border-l-4 border-[#DF3131]">
              <p className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#8F8F8F] dark:text-white/50 mb-2">OUTCOME</p>
              <p className="text-[16px] text-[#333] dark:text-[#e0e0e0] leading-relaxed">{PILLARS[activePillar].outcome}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-white dark:bg-[#111] p-10 text-center">
<h2 className="text-[1.5rem] sm:text-[1.75rem] font-heading font-bold text-[#333] dark:text-white tracking-[0.1em] mb-4">Ready to Build Your Brand?</h2>
 <p className="text-[#666] dark:text-white/50 text-[16px] mb-6 max-w-lg mx-auto">Start with a free consultation. We'll assess where you are and map out your 3-Point journey, no commitment, no pressure.</p>
            <Link href="/booking" className="inline-flex items-center gap-2 px-10 py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.1em] uppercase text-[14px] hover:bg-[#B82020] transition-colors">
              Book Free Consultation <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
