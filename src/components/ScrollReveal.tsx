"use client";
import { useEffect, useRef, useState, ReactNode } from "react";

type AnimationType = "fadeUp" | "fadeLeft" | "fadeRight" | "fadeIn" | "scaleIn" | "bounceIn" | "foldDown";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

const animationStyles: Record<AnimationType, string> = {
  fadeUp:    "translateY(40px)",
  fadeLeft:  "translateX(-60px)",
  fadeRight: "translateX(60px)",
  fadeIn:    "none",
  scaleIn:   "scale(0.9)",
  bounceIn:  "translateY(30px) scale(0.95)",
  foldDown:  "perspective(800px) rotateX(-90deg)",
};

export default function ScrollReveal({
  children,
  animation = "fadeUp",
  delay = 0,
  duration = 0.8,
  className = "",
  threshold = 0.12,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
          if (el) el.style.willChange = "opacity, transform";
        }
      },
      { threshold, rootMargin: "200px 0px" }
    );
    obs.observe(el);
    const t = setTimeout(() => {
      setVisible(true);
      if (el) el.style.willChange = "opacity, transform";
    }, 800);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, [threshold]);

  const from = animationStyles[animation];
  const show = !hydrated || visible;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transformOrigin: animation === "foldDown" ? "top center" : undefined,
        opacity: show ? 1 : 0,
        transform: show ? "none" : from,
        transition: hydrated ? `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s` : undefined,
      }}
      onTransitionEnd={(e) => {
        if (e.target === ref.current && e.propertyName === "transform") {
          e.currentTarget.style.willChange = "auto";
        }
      }}
    >
      {children}
    </div>
  );
}
