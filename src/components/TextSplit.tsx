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

    // SSR renders the text fully visible (no flash-of-unstyled-content on
    // first paint). On hydration it immediately snaps to its hidden,
    // pre-animation state and waits for an IntersectionObserver callback
    // to reveal it -- fine for a heading further down the page the user
    // scrolls to, but for a hero H1 that is ALREADY on screen at load
    // this created a real flash of invisible text: the headline would
    // disappear right after hydration and only reappear once the
    // (async, main-thread-contention-prone) observer callback fired,
    // sometimes a couple of seconds later on a loaded mobile device.
    // A synchronous rect check at mount time -- the same pattern already
    // used in ChatWidget's clearZone fix -- closes that gap by skipping
    // the hide step entirely when the element starts in (or near) view.
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
                      willChange: visible ? "transform, opacity" : "transform",
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
