"use client";

import { useEffect, useState } from "react";

interface NoiseOverlayProps {
  opacity?: number;
  className?: string;
}

export default function NoiseOverlay({ opacity = 0.045, className = "" }: NoiseOverlayProps) {
  // A fixed, full-viewport SVG feTurbulence filter composited with
  // mix-blend-mode is cheap on a desktop GPU but forces an expensive
  // recomposite of the ENTIRE page on every scroll/animation frame on
  // mobile GPUs -- a well-known battery/thermal drain pattern. The grain
  // texture is a subtle decorative touch, not core to the brand, so it is
  // skipped entirely on touch/mobile devices rather than just throttled.
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024 || ("ontouchstart" in window && navigator.maxTouchPoints > 0));
    setMounted(true);
  }, []);

  if (!mounted || isMobile) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[9990] ${className}`}
      style={{ opacity, mixBlendMode: "overlay" }}
      aria-hidden="true"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="wyz-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves={4}
            stitchTiles="stitch"
          >
            <animate attributeName="seed" from="0" to="100" dur="0.8s" repeatCount="indefinite" />
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#wyz-noise)" />
      </svg>
    </div>
  );
}
