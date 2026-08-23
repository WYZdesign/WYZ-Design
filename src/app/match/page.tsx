"use client";
import Link from "next/link";
import { FiArrowRight, FiCheck } from "react-icons/fi";

const STEPS = [
  { num: "01", title: "Tell Us Your Style", desc: "Answer a few quick questions about your brand, aesthetic, and goals." },
  { num: "02", title: "Get Matched", desc: "Our system pairs you with the perfect service package based on your needs." },
  { num: "03", title: "Start Creating", desc: "Book your matched service and start bringing your vision to life." },
];

const INCLUDES = [
  "Personalized service recommendations",
  "Custom pricing based on your scope",
  "Style-matched photographer/designer pairing",
  "Free consultation to refine your match",
];

export default function MatchPage() {
  return (
    <main className="pb-16 bg-white dark:bg-[#232326]">
      <div className="max-w-5xl mx-auto px-6 pt-32 lg:pt-40">
        <div className="text-center mb-14">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-[#333] dark:text-white tracking-[0.15em] mb-6 sm:mb-8">M A T C H</h1>
          <p className="text-[#8F8F8F] dark:text-white/50 max-w-xl mx-auto">Not sure where to start? Let us match you with the perfect creative services for your brand.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {STEPS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-[#DF3131] text-white rounded-full flex items-center justify-center text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-heading font-black">{s.num}</div>
              <h3 className="font-heading font-bold text-[#333] dark:text-white tracking-[0.08em] mb-3">{s.title}</h3>
              <p className="text-[#8F8F8F] dark:text-white/50 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#444] rounded-2xl p-10 mb-12">
          <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold text-[#333] dark:text-white tracking-[0.1em] mb-4">What You Get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INCLUDES.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#DF3131]/10 rounded-full flex items-center justify-center shrink-0">
                  <FiCheck className="text-[#DF3131] w-3.5 h-3.5" />
                </div>
                <span className="text-[#555] dark:text-white/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/booking" className="inline-flex items-center gap-2 px-10 py-4 bg-[#DF3131] text-white font-semibold tracking-[0.15em] rounded-full hover:bg-[#B82020] transition-all hover:scale-105">
            Get Started <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}