"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface TextSplitProps {
  children: string;
  className?: string;
  charClassName?: string;
  stagger?: number;
  direction?: "up" | "down" | "left" | "right";
}

export default function TextSplit({
  children,
  className = "",
  charClassName = "",
  stagger = 0.03,
  direction = "up",
}: TextSplitProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const getTransform = (visible: boolean) => {
    if (visible) return "translate(0,0) rotate(0deg)";
    switch (direction) {
      case "up": return "translate(0,100%) rotate(5deg)";
      case "down": return "translate(0,-100%) rotate(-5deg)";
      case "left": return "translate(100%,0) rotate(5deg)";
      case "right": return "translate(-100%,0) rotate(-5deg)";
    }
  };

  const visible = !hydrated || inView;

  const words = children.split(" ");
  let running = 0;

  return (
    <span ref={ref} className={`inline-block ${className}`} aria-label={children}>
      {words.map((word, wi) => {
        const chars = word.split("");
        const base = running;
        running += chars.length;
        return (
          <span key={wi}>
            {wi > 0 ? " " : null}
            <span className="inline-block whitespace-nowrap">
              {chars.map((char, ci) => (
                <span key={ci} className={`inline-block overflow-hidden ${charClassName}`}>
                  <span
                    className="inline-block"
                    style={{
                      transform: getTransform(visible),
                      opacity: visible ? 1 : 0,
                      transition: `transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${(base + ci) * stagger}s, opacity 0.4s ease ${(base + ci) * stagger}s`,
                    }}
                  >
                    {char}
                  </span>
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
