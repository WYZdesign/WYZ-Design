"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-[#1C1C1E] px-6">
      <div className="text-center max-w-md">
        <p className="text-[#DF3131] text-[11px] font-heading font-bold tracking-[0.3em] uppercase mb-4">WYZ Design</p>
        <h1 className="text-[2rem] sm:text-[2.5rem] font-heading font-black text-[#333] dark:text-white tracking-[0.03em] leading-none mb-4">
          PAGE NOT FOUND
        </h1>
        <p className="text-[#666] dark:text-white text-[15px] leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/home"
            className="px-8 py-3.5 bg-[#DF3131] text-white font-heading font-bold text-[13px] tracking-[0.1em] uppercase rounded-lg hover:bg-[#B82020] transition-all"
          >
            Go Home
          </Link>
          <Link
            href="/"
            className="px-8 py-3.5 border-2 border-[#333] dark:border-white text-[#333] dark:text-white font-heading font-bold text-[13px] tracking-[0.1em] uppercase rounded-lg hover:bg-[#DF3131] hover:text-white hover:border-[#DF3131] transition-all"
          >
            Splash
          </Link>
        </div>
      </div>
    </main>
  );
}
