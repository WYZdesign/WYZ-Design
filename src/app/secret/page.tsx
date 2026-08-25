"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useZeal } from "@/components/ZealProvider";

export default function SecretPage() {
  const { earn } = useZeal();

  useEffect(() => {
    void earn("hidden-page");
  }, [earn]);

  return (
    <main className="min-h-screen bg-[#111] text-white flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <p className="text-[#DF3131] font-heading font-bold tracking-[0.3em] uppercase text-[12px] mb-4">You found it</p>
        <h1 className="text-[2.5rem] sm:text-[3.5rem] font-heading font-black tracking-[0.05em] uppercase mb-6" style={{ lineHeight: 0.9 }}>
          THE <span className="text-[#DF3131]">HIDDEN</span> PAGE
        </h1>
        <p className="text-white/70 leading-relaxed mb-8">
          Most people scroll right past this. You didn't. That curiosity is exactly what we look for in the people we work with, so here's your reward: 100 Zeal, deposited quietly into your account.
        </p>
        <div className="border border-white/10 rounded-2xl p-6 mb-10 bg-white/5">
          <p className="text-[13px] text-white/50 uppercase tracking-[0.15em] font-bold mb-2">Insider tip</p>
          <p className="text-white/80 text-[14px] leading-relaxed">
            There are more secrets on this site. The logo has one, the code has another. Keep poking around.
          </p>
        </div>
        <Link href="/home" className="inline-block px-8 py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.12em] uppercase text-[13px] hover:bg-[#B82020] transition-all">
          Back to the surface
        </Link>
      </div>
    </main>
  );
}
