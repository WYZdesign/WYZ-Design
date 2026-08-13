"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
}

export default function ImageReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const clipPaths: Record<string, { hidden: string; visible: string }> = {
    left: { hidden: "inset(0 100% 0 0)", visible: "inset(0 0% 0 0)" },
    right: { hidden: "inset(0 0 0 100%)", visible: "inset(0 0 0 0%)" },
    up: { hidden: "inset(100% 0 0 0)", visible: "inset(0% 0 0 0)" },
    down: { hidden: "inset(0 0 100% 0)", visible: "inset(0 0 0% 0)" },
  };

  const clip = clipPaths[direction];

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        style={{
          clipPath: inView ? clip.visible : clip.hidden,
          transition: `clip-path 0.9s cubic-bezier(0.77, 0, 0.175, 1) ${delay}s`,
        }}
      >
        {children}
      </div>
      <div
        className="absolute inset-0 bg-[#DF3131] z-10"
        style={{
          clipPath: inView ? clip.hidden : clip.visible,
          transition: `clip-path 0.9s cubic-bezier(0.77, 0, 0.175, 1) ${delay}s`,
        }}
      />
    </div>
  );
}
