"use client";

import { useEffect, useState } from "react";

interface NoiseOverlayProps {
  opacity?: number;
  className?: string;
}

export default function NoiseOverlay({ opacity = 0.045, className = "" }: NoiseOverlayProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || ("ontouchstart" in window && navigator.maxTouchPoints > 0));
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[9990] ${className}`}
      style={{ opacity: isMobile ? opacity * 0.6 : opacity, mixBlendMode: "overlay" }}
      aria-hidden="true"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="wyz-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves={isMobile ? 2 : 4}
            stitchTiles="stitch"
          >
            {!isMobile && <animate attributeName="seed" from="0" to="100" dur="0.8s" repeatCount="indefinite" />}
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#wyz-noise)" />
      </svg>
    </div>
  );
}
