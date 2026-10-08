"use client";
import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLenis } from "@/components/SmoothScrollProvider";

const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenis = useLenis();
  const isRoot = pathname === "/";
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || ("ontouchstart" in window && navigator.maxTouchPoints > 0));
  }, []);

  useEffect(() => { setIsFirstRender(false); }, []);
  // 2026-10-08 (Claude): keep Lenis's own internal scroll state in sync
  // with the manual reset -- otherwise Lenis's rAF loop can reapply its
  // own stale scroll position right after this runs and the page does not
  // actually stay at the top.
  useEffect(() => {
    if (!isFirstRender) {
      window.scrollTo(0, 0);
      lenis?.scrollTo(0, { immediate: true });
    }
  }, [pathname, isFirstRender, lenis]);

  useEffect(() => {
    if (isFirstRender) return;
    const timer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(".fixed.inset-0.z-\\[9998\\]").forEach((el) => {
        const t = el.style.transform || getComputedStyle(el).transform;
        if (t && t !== "none" && t !== "matrix(0, 0, 0, 1, 0, 0)") {
          el.style.setProperty("display", "none", "important");
        }
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, [pathname, isFirstRender]);

  if (isMobile) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key={pathname}
          initial={isRoot ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3, delay: isRoot ? 0 : 0.15 } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        <motion.div
          className="fixed inset-0 z-[9998] bg-[#DF3131] pointer-events-none origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 0 }}
          exit={{ scaleX: 1, transition: { duration: 0.4, ease: CURTAIN_EASE } }}
        />
        <motion.div
          className="fixed inset-0 z-[9998] bg-[#111] pointer-events-none origin-right"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0, transition: { duration: 0.4, ease: CURTAIN_EASE, delay: 0.05 } }}
          exit={{ scaleX: 0 }}
        />
        <motion.div
          initial={isRoot ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4, delay: isRoot ? 0 : 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
