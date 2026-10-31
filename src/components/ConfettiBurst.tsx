"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/utils";

/**
 * One-shot confetti burst for a completed action (booking submitted).
 * Purely decorative: fixed overlay, pointer-events none, aria-hidden, and a
 * complete no-op when the visitor prefers reduced motion.
 */
export default function ConfettiBurst({ run, pieces = 28 }: { run: boolean; pieces?: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 2600);
    return () => clearTimeout(t);
  }, [run]);

  if (!show) return null;

  const colors = ["#DF3131", "#C9A227", "#FFD700", "#FFFFFF"];

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
      {Array.from({ length: pieces }).map((_, i) => {
        const left = (i * 37 + 11) % 100;
        const delay = (i % 7) * 60;
        const dur = 1400 + (i % 5) * 180;
        const size = 6 + (i % 3) * 3;
        const color = colors[i % colors.length];
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: "-14px",
              width: size,
              height: Math.round(size * 1.6),
              background: color,
              borderRadius: 1,
              animation: `confettiFall ${dur}ms cubic-bezier(.2,.6,.4,1) ${delay}ms forwards`,
            }}
          />
        );
      })}
      <style>{`@keyframes confettiFall {
        0% { opacity: 0; transform: translateY(-20px) rotate(0deg); }
        12% { opacity: 1; }
        100% { opacity: 0; transform: translateY(105vh) rotate(720deg); }
      }`}</style>
    </div>
  );
}
