"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { trackError } from "@/lib/errorTracker";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Auto-reset exactly once. An unconditional timer here turned a persistent
  // render error into an infinite error->reset loop (spinner flash every
  // 1.2s, analytics spam) - after one failed recovery the user gets the
  // manual buttons instead.
  const autoResetUsed = useRef(false);

  useEffect(() => {
    trackError(error, "app/error-boundary");
  }, [error]);

  useEffect(() => {
    if (autoResetUsed.current) return;
    autoResetUsed.current = true;
    const t = setTimeout(() => reset(), 1200);
    return () => clearTimeout(t);
  }, [reset]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-[#1C1C1E] px-6">
      <div className="text-center max-w-md">
        <p className="text-[#DF3131] text-[11px] font-heading font-bold tracking-[0.3em] uppercase mb-4">WYZ Design</p>
        <h1 className="text-[2rem] sm:text-[2.5rem] font-heading font-black text-[#333] dark:text-white tracking-[0.03em] leading-none mb-4">
          LET&apos;S GET YOU BACK ON TRACK
        </h1>
        <p className="text-[#666] dark:text-white text-[15px] leading-relaxed mb-8">
          Refreshing automatically, and if nothing happens, tap a button below.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3.5 bg-[#DF3131] text-white font-heading font-bold text-[13px] tracking-[0.1em] uppercase rounded-lg hover:bg-[#B82020] transition-all"
          >
            Refresh
          </button>
          <Link
            href="/home"
            className="px-8 py-3.5 border-2 border-[#333] dark:border-white text-[#333] dark:text-white font-heading font-bold text-[13px] tracking-[0.1em] uppercase rounded-lg hover:bg-[#DF3131] hover:text-white hover:border-[#DF3131] transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
