"use client";

import { useRef, ReactNode, useCallback, ElementType } from "react";

interface MagneticElementProps<T extends ElementType = "span"> {
  children: ReactNode;
  className?: string;
  strength?: number;
  tag?: T;
}

export default function MagneticElement<T extends ElementType = "span">({
  children,
  className = "",
  strength = 0.45,
  tag,
}: MagneticElementProps<T>) {
  const Tag = (tag || "span") as ElementType;
  const ref = useRef<HTMLElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${relX * strength}px, ${relY * strength}px) scale(1.08)`;
    el.style.transition = "transform 0.15s ease-out, box-shadow 0.3s ease";
    el.style.boxShadow = "0 0 20px rgba(223, 49, 49, 0.5), 0 0 40px rgba(223, 49, 49, 0.25)";
  }, [strength]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px) scale(1)";
    el.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease";
    el.style.boxShadow = "none";
  }, []);

  return (
    <Tag ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </Tag>
  );
}
