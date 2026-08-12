"use client";

interface NoiseOverlayProps {
  opacity?: number;
  className?: string;
}

export default function NoiseOverlay({ opacity = 0.03, className = "" }: NoiseOverlayProps) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[9990] ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="wyz-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#wyz-noise)" />
      </svg>
    </div>
  );
}
