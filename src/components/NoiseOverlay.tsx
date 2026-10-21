"use client";

import { useEffect, useState } from "react";

interface NoiseOverlayProps {
  opacity?: number;
  className?: string;
}

/**
 * Subtle film grain over the page.
 *
 * This used to be a fixed, full-viewport SVG `feTurbulence` filter with an
 * `<animate>` on its seed, which forces the browser to re-run a fractal-noise
 * filter for the whole screen several times a second and re-composite the
 * entire page. That is a well-known jank/thermal pattern, especially on
 * laptops and mobile GPUs. The grain is decorative, so it is now a small,
 * pre-baked tiled PNG: one cheap layer, no filter, no animation, no blend mode.
 * Still skipped on touch/mobile and for reduced-motion users.
 */
export default function NoiseOverlay({ opacity = 0.035, className = "" }: NoiseOverlayProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mobile =
      window.innerWidth < 1024 ||
      ("ontouchstart" in window && navigator.maxTouchPoints > 0);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setShow(!mobile && !reduced);
  }, []);

  if (!show) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[9990] ${className}`}
      style={{
        opacity,
        backgroundImage: "url(/images/noise.png)",
        backgroundRepeat: "repeat",
        backgroundSize: "160px 160px",
      }}
      aria-hidden="true"
    />
  );
}
