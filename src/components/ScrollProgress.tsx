"use client";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setProgress(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent">
      <div
        className="h-full relative"
        style={{ width: `${progress}%`, transition: "width 0.08s linear" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#DF3131] via-[#FFD700] to-[#DF3131] shadow-[0_0_12px_rgba(223,49,49,0.8),0_0_24px_rgba(255,215,0,0.4)]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
      </div>
    </div>
  );
}
