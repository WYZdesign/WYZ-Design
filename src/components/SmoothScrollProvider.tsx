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
      duration: isTouch ? 0.5 : 0.8,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: !isTouch,
      syncTouchLerp: isTouch ? 0.15 : 0.1,
      touchMultiplier: isTouch ? 1 : 1.5,
      wheelMultiplier: 1.3,
    });

    lenisRef.current = lenis;

    let raf: number;
    function tick(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
