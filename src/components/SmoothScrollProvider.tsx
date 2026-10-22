"use client";

import { useEffect, useRef, createContext, useContext, ReactNode } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/utils";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const lenis = new Lenis({
      // Snappier than the old 0.8/0.5s. Long durations make the whole site feel
      // like it is lagging behind the wheel.
      duration: isTouch ? 0.4 : 0.55,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: !isTouch,
      syncTouchLerp: isTouch ? 0.28 : 0.1,
      touchMultiplier: isTouch ? 1.1 : 1.5,
      wheelMultiplier: 1.15,
    });

    lenisRef.current = lenis;

    const onSplashLock = (event: Event) => {
      const locked = (event as CustomEvent<boolean>).detail;
      if (locked) {
        lenis.stop();
        lenis.scrollTo(0, { immediate: true });
        return;
      }
      lenis.start();
      lenis.scrollTo(0, { immediate: true });
    };
    window.addEventListener("wyz:splash-lock", onSplashLock);
    if (document.documentElement.dataset.splashLocked === "true") {
      lenis.stop();
      lenis.scrollTo(0, { immediate: true });
    }

    let raf: number;
    function tick(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    // Lenis caches the scrollable height when it starts. Lazy images below the
    // fold then grow the page, leaving that cached limit too short: scrolling
    // stops early and then rebounds upward, which is what /services was doing.
    // Keep the limit in sync with the real document height.
    let resizeRaf: number | null = null;
    const scheduleResize = () => {
      if (resizeRaf !== null) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null;
        lenis.resize();
      });
    };
    const ro = new ResizeObserver(scheduleResize);
    ro.observe(document.body);
    window.addEventListener("load", scheduleResize);
    window.addEventListener("resize", scheduleResize);
    document.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", scheduleResize, { once: true });
    });

    return () => {
      cancelAnimationFrame(raf);
      if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
      ro.disconnect();
      window.removeEventListener("load", scheduleResize);
      window.removeEventListener("resize", scheduleResize);
      window.removeEventListener("wyz:splash-lock", onSplashLock);
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
