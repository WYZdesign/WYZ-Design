"use client";

interface NoiseOverlayProps {
  opacity?: number;
  className?: string;
}

export default function NoiseOverlay({ opacity = 0.045, className = "" }: NoiseOverlayProps) {
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
            numOctaves="4"
            stitchTiles="stitch"
            seed={Math.floor(Math.random() * 100)}
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
