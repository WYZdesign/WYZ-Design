"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

/**
 * Persistent cross-switch bar for /designs and /photography (board #47,
 * "Design + Photography duality"). Both portfolios stay separate and full;
 * this is just a quiet, always-visible way to jump to the other one, plus
 * the shared /work gateway. Same component on both pages so the pattern
 * reads as one studio with two lenses, not two unrelated sites.
 */
export default function WorkCrossSwitch({ current }: { current: "design" | "photography" }) {
  const other = current === "design"
    ? { href: "/photography", label: "See the photography work" }
    : { href: "/designs", label: "See the design work" };

  return (
    <div className="border-y border-black/10 dark:border-white/10 bg-[#FAFAFA] dark:bg-[#161616]">
      <div className="max-w-[130rem] mx-auto px-6 lg:px-12 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
        <span className="text-[11px] sm:text-[12px] tracking-[0.2em] uppercase text-[#6E6E6E] dark:text-[#999]">Two sides, one studio</span>
        <Link
          href={other.href}
          className="group inline-flex items-center gap-2 text-[13px] sm:text-[14px] font-bold tracking-[0.05em] text-[#111] dark:text-white hover:text-[#DF3131] dark:hover:text-[#DF3131] transition-colors"
        >
          {other.label}
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link
          href="/work"
          className="text-[12px] sm:text-[13px] text-[#999] hover:text-[#DF3131] underline underline-offset-4 transition-colors"
        >
          Or see both side by side
        </Link>
      </div>
    </div>
  );
}
