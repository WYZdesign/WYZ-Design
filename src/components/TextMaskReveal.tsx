"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface TextMaskRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down";
}

export default function TextMaskReveal({
  children,
  className = "",
  direction = "up",
}: TextMaskRevealProps) {
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

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        className="transition-transform duration-700 ease-out"
        style={{
          transform: inView
            ? "translateY(0)"
            : `translateY(${direction === "up" ? "105%" : "-105%"})`,
          transitionDelay: "0.05s",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
