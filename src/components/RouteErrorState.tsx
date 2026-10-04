"use client";

import Link from "next/link";
import { useEffect } from "react";
import { trackError } from "@/lib/errorTracker";

export default function RouteErrorState({
  title,
  error,
  reset,
}: {
  title: string;
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    trackError(error, `route-error:${title}`);
  }, [error, title]);

  return (
    <main className="min-h-screen bg-white dark:bg-[#1C1C1E] pt-24 px-6 flex items-center justify-center">
      <div className="text-center max-w-md" role="alert">
        <p className="text-[#DF3131] text-[11px] font-heading font-bold tracking-[0.3em] uppercase mb-4">
          WYZ Design
        </p>
        <h1 className="text-[1.75rem] sm:text-[2.25rem] font-heading font-black text-[#333] dark:text-white tracking-[0.03em] uppercase leading-none mb-4">
          Couldn&apos;t load {title}
        </h1>
        <p className="text-[#666] dark:text-white text-[15px] leading-relaxed mb-8">
          Something went wrong loading this page. Try again, or head back home.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3.5 bg-[#DF3131] text-white font-heading font-bold text-[13px] tracking-[0.1em] uppercase rounded-lg hover:bg-[#B82020] transition-all"
          >
            Retry
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
