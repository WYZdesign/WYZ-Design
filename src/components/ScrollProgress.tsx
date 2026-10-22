"use client";
import { useEffect, useRef } from "react";

/**
 * Top reading-progress bar.
 *
 * Previously this held progress in React state, so every scroll frame triggered
 * a component re-render. It now writes `transform: scaleX()` straight to the DOM
 * from inside the existing rAF, so scrolling never re-renders React. The 0.08s
 * CSS transition was also removed: the bar is already updated once per frame,
 * and the transition made it visibly trail the scroll.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const apply = () => {
      raf.current = null;
      const h = document.documentElement;
      const max = Math.max(1, h.scrollHeight - h.clientHeight);
      const p = Math.min(1, h.scrollTop / max);
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (raf.current === null) raf.current = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent">
      <div
        ref={barRef}
        className="h-full relative origin-left will-change-transform"
        style={{ transform: "scaleX(0)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#DF3131] via-[#FFD700] to-[#DF3131] shadow-[0_0_12px_rgba(223,49,49,0.8),0_0_24px_rgba(255,215,0,0.4)]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
      </div>
    </div>
  );
}
