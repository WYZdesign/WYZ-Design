"use client";

import { useRef, useCallback } from "react";
import { prefersReducedMotion } from "@/lib/utils";
import { useGyroPermission } from "@/hooks/useGyroPermission";

interface GyroTiltProps {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
  enableOnDesktop?: boolean;
}

export default function GyroTilt({ children, intensity = 15, className = "", enableOnDesktop = false }: GyroTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;

  const onGranted = useCallback((setCleanup: (fn: () => void) => void) => {
    if (prefersReducedMotion()) return;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouch && !enableOnDesktop) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null && ref.current) {
        const x = Math.max(-intensityRef.current, Math.min(intensityRef.current, e.gamma / 45 * intensityRef.current));
        const y = Math.max(-intensityRef.current, Math.min(intensityRef.current, (e.beta - 45) / 45 * intensityRef.current));
        ref.current.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`;
      }
    };

    window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    setCleanup(() => window.removeEventListener("deviceorientation", handleOrientation));
  }, [enableOnDesktop]);

  useGyroPermission(onGranted);

  return (
    <div ref={ref} className={`will-change-transform ${className}`} style={{ transformStyle: "preserve-3d", transition: "transform 0.1s ease-out" }}>
      {children}
    </div>
  );
}
