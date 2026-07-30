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
