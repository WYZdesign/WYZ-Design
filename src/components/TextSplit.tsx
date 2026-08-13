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

  return (
    <span ref={ref} className={`inline-block ${className}`} aria-label={children}>
      {children.split("").map((char, i) => (
        <span
          key={i}
          className={`inline-block overflow-hidden ${charClassName}`}
          style={{ minWidth: char === " " ? "0.3em" : undefined }}
        >
          <span
            className="inline-block"
            style={{
              transform: getTransform(inView),
              opacity: inView ? 1 : 0,
              transition: `transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * stagger}s, opacity 0.4s ease ${i * stagger}s`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}
