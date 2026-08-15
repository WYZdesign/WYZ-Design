"use client";

import Link from "next/link";

export default function Offline() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#111] px-6 text-center">
      <div className="max-w-md">
        <p className="text-[#DF3131] text-[11px] font-heading font-bold tracking-[0.3em] uppercase mb-4">You&apos;re offline</p>
        <h1 className="text-[2.5rem] font-heading font-black text-white tracking-[0.03em] leading-none mb-4">
          WYZ DESIGN
        </h1>
        <p className="text-white/60 text-[15px] leading-relaxed mb-8">
          Looks like you lost your connection. Reconnect and we&apos;ll get you right back in.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3.5 bg-[#DF3131] text-white font-heading font-bold text-[13px] tracking-[0.1em] uppercase rounded-lg hover:bg-[#B82020] transition-all"
        >
          Retry Connection
        </button>
        <div className="mt-6">
          <Link href="/home" className="text-[#DF3131] text-sm hover:underline">Try home</Link>
        </div>
      </div>
    </main>
  );
}
