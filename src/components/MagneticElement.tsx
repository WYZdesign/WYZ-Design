"use client";

import { useRef, ReactNode, useCallback, ComponentPropsWithRef, ElementType } from "react";

interface MagneticElementProps<T extends ElementType = "span"> {
  children: ReactNode;
  className?: string;
  strength?: number;
  tag?: T;
}

export default function MagneticElement<T extends ElementType = "span">({
  children,
  className = "",
  strength = 0.3,
  tag,
}: MagneticElementProps<T>) {
  const Tag = (tag || "span") as ElementType;
  const ref = useRef<HTMLElement>(null);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
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
    <Tag ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </Tag>
  );
}
