"use client";
import { useEffect, useRef, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const onScroll = () => {
      if (raf.current !== null) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        const h = document.documentElement;
        const max = Math.max(1, h.scrollHeight - h.clientHeight);
        setProgress(Math.min(100, (h.scrollTop / max) * 100));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent">
      <div
        className="h-full relative origin-left will-change-transform"
        style={{ transform: `scaleX(${progress / 100})`, transition: "transform 0.08s linear" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#DF3131] via-[#FFD700] to-[#DF3131] shadow-[0_0_12px_rgba(223,49,49,0.8),0_0_24px_rgba(255,215,0,0.4)]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
      </div>
    </div>
  );
}
