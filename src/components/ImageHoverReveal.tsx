"use client";

import { useRef, useState, useCallback, ReactNode, cloneElement, isValidElement } from "react";

interface ImageHoverRevealProps {
  children: ReactNode;
  className?: string;
  spotlightRadius?: number;
  glowRadius?: number;
}

export default function ImageHoverReveal({
  children,
  className = "",
  spotlightRadius = 400,
  glowRadius = 150,
}: ImageHoverRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const child = isValidElement(children) ? children as React.ReactElement<Record<string, unknown>> : null;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={onMove}
    >
      {child &&
        cloneElement(child, {
          className: `${child.props.className || ""} transition-transform duration-500`,
          style: {
            ...(child.props.style || {}),
            transform: hovering
              ? `scale(1.08) translate(${(50 - pos.x) * 0.02}px, ${(50 - pos.y) * 0.02}px)`
              : "scale(1)",
          },
        })}

      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{ opacity: hovering ? 1 : 0 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(${spotlightRadius}px circle at ${pos.x}% ${pos.y}%, rgba(223,49,49,0.12) 0%, transparent 60%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(${glowRadius}px circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
          }}
        />
      </div>
    </div>
  );
}
