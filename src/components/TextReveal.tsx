"use client";
import { useEffect, useRef, useState } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function TextReveal({ text, className = "", delay = 0, speed = 40, tag: Tag = "h1" }: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Same gap as TextSplit/TextMaskReveal: a heading already on screen
    // at load shouldn't wait on an async IntersectionObserver callback
    // before it first becomes visible. Synchronous rect check at mount
    // time skips the wait when the element starts in (or near) view.
    const rect = el.getBoundingClientRect();
    const alreadyVisible =
      rect.top < window.innerHeight * 1.2 && rect.bottom > -window.innerHeight * 0.2;
    if (alreadyVisible) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1, rootMargin: "100px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    // @ts-expect-error Tag is a valid HTML element
    <Tag ref={ref} className={className}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(30px) rotateX(-40deg)",
            transition: `opacity 0.4s ease ${delay + i * speed}ms, transform 0.4s ease ${delay + i * speed}ms`,
            transformOrigin: "bottom center",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}
