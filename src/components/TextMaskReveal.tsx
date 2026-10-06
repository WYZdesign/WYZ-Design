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

    // Same gap as TextSplit: content already on screen at load (a hero
    // heading) shouldn't have to wait on an async IntersectionObserver
    // callback before it ever becomes visible. Synchronous rect check at
    // mount time skips the wait when the element starts in (or near) view.
    const rect = el.getBoundingClientRect();
    const alreadyVisible =
      rect.top < window.innerHeight * 1.2 && rect.bottom > -window.innerHeight * 0.2;
    if (alreadyVisible) {
      setInView(true);
      return;
    }

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
