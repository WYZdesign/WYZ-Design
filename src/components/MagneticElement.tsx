"use client";

import { useRef, ReactNode, useCallback } from "react";

interface MagneticElementProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  tag?: "span" | "div" | "button" | "a";
}

export default function MagneticElement({
  children,
  className = "",
  strength = 0.3,
  tag: Tag = "span",
}: MagneticElementProps) {
  const ref = useRef<HTMLElement>(null);
  const boundsRef = useRef({ cx: 0, cy: 0, w: 0, h: 0 });

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      boundsRef.current = {
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
        w: rect.width,
        h: rect.height,
      };
      const dx = e.clientX - boundsRef.current.cx;
      const dy = e.clientY - boundsRef.current.cy;
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      el.style.transition = "transform 0.15s ease-out";
    },
    [strength]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
    el.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
  }, []);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </Tag>
  );
}
