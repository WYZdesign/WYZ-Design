"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "@/components/SmoothScrollProvider";

/**
 * 2026-10-08 (Claude): a raw window.scrollTo(0,0) can get fought by Lenis,
 * which keeps its own internal scroll-position state and reapplies it every
 * animation frame via lenis.raf(time). Calling the Lenis instance's own
 * scrollTo alongside the native one keeps both in sync so the page actually
 * lands and stays at the top on every route change.
 */
export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}
