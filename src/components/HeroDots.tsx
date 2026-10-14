"use client";

import { useId, useMemo } from "react";
import type { CSSProperties } from "react";

type Variant = 1 | 2 | 3 | 4 | 5;
type DotStyle = CSSProperties & Record<"--wz-dot-x1" | "--wz-dot-y1" | "--wz-dot-x2" | "--wz-dot-y2", string>;

/**
 * Floating hero dots. Equal counts of brand-red and gray/white dots (the
 * owner asked for more of both, in equal number), with the motion style
 * chosen per page via `variant` so every hero feels distinct. Purely
 * decorative: pointer-events-none, aria-hidden, unique seeded positions for
 * every mounted hero (no hydration mismatch), and disabled under
 * prefers-reduced-motion.
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
  const instanceId = useId();
  const dots = useMemo(() => {
    // useId is stable between the server and client. Hashing it gives each
    // page's hero its own repeatable random field without a hydration jump.
    let state = Array.from(instanceId).reduce((total, char) => (total * 31 + char.charCodeAt(0)) >>> 0, variant * 997 + count);
    const next = () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };
    const half = Math.max(1, Math.floor(count / 2));
    const out: { red: boolean; left: number; top: number; size: number; delay: number; dur: number; x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < half * 2; i++) {
      const red = i % 2 === 0;
      out.push({
        red,
        left: next() * 96 + 2,
        top: next() * 92 + 4,
        size: 4 + Math.round(next() * 9),
        delay: -next() * 9,
        dur: 6 + next() * 8 + variant,
        x1: Math.round((next() - 0.5) * 52),
        y1: Math.round((next() - 0.5) * 52),
        x2: Math.round((next() - 0.5) * 52),
        y2: Math.round((next() - 0.5) * 52),
      });
    }
    return out;
  }, [count, instanceId, variant]);

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
            animation: `wzDotWander ${d.dur}s cubic-bezier(.45,0,.55,1) ${d.delay}s infinite`,
            "--wz-dot-x1": `${d.x1}px`,
            "--wz-dot-y1": `${d.y1}px`,
            "--wz-dot-x2": `${d.x2}px`,
            "--wz-dot-y2": `${d.y2}px`,
          } as DotStyle}
        />
      ))}
    </div>
  );
}
