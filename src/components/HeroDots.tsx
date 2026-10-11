"use client";

import { useMemo } from "react";

type Variant = 1 | 2 | 3 | 4 | 5;

const ANIM: Record<Variant, string> = {
  1: "wzDotFloat",
  2: "wzDotDrift",
  3: "wzDotRise",
  4: "wzDotOrbit",
  5: "wzDotPulse",
};

/**
 * Floating hero dots. Equal counts of brand-red and gray/white dots (the
 * owner asked for more of both, in equal number), with the motion style
 * chosen per page via `variant` so every hero feels distinct. Purely
 * decorative: pointer-events-none, aria-hidden, deterministic positions
 * (no hydration mismatch), and disabled under prefers-reduced-motion.
 */
export default function HeroDots({
  variant = 1,
  count = 24,
  className = "",
}: {
  variant?: Variant;
  count?: number;
  className?: string;
}) {
  const dots = useMemo(() => {
    const half = Math.max(1, Math.floor(count / 2));
    const out: { red: boolean; left: number; top: number; size: number; delay: number; dur: number }[] = [];
    for (let i = 0; i < half * 2; i++) {
      const red = i % 2 === 0;
      const seed = i * 37 + (red ? 0 : 11);
      out.push({
        red,
        left: (seed * 7) % 100,
        top: (seed * 13) % 100,
        size: 4 + (i % 4) * 3,
        delay: (i % 9) * 0.45,
        dur: 5 + (i % 6),
      });
    }
    return out;
  }, [count]);

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 z-[1] overflow-hidden ${className}`}>
      {dots.map((d, i) => (
        <span
          key={i}
          className="wz-dot absolute rounded-full"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            background: d.red ? "#DF3131" : "rgba(255,255,255,0.55)",
            boxShadow: d.red ? "0 0 8px rgba(223,49,49,0.6)" : "0 0 6px rgba(255,255,255,0.35)",
            animation: `${ANIM[variant]} ${d.dur}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
