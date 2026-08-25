"use client";

import { useEffect, useRef, useState } from "react";

interface GyroTiltProps {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
  enableOnDesktop?: boolean;
}

export default function GyroTilt({ children, intensity = 15, className = "", enableOnDesktop = false }: GyroTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hasGyro, setHasGyro] = useState(false);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouch && !enableOnDesktop) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        setHasGyro(true);
        const x = Math.max(-intensity, Math.min(intensity, e.gamma / 45 * intensity));
        const y = Math.max(-intensity, Math.min(intensity, (e.beta - 45) / 45 * intensity));
        setTilt({ x, y });
      }
    };

    type DeviceOrientationEventWithPermission = DeviceOrientationEvent & {
      requestPermission?: () => Promise<string>;
    };
    const DOE = DeviceOrientationEvent as unknown as DeviceOrientationEventWithPermission;
    let disposed = false;

    if (typeof DOE !== "undefined" && typeof DOE.requestPermission === "function") {
      DOE.requestPermission()!
        .then((state) => {
          if (!disposed && state === "granted") {
            window.addEventListener("deviceorientation", handleOrientation, { passive: true });
          }
        })
        .catch(() => {});
    } else {
      window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    }

    return () => {
      disposed = true;
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [intensity, enableOnDesktop]);

  useEffect(() => {
    if (!hasGyro) return;
    let raf: number;
    let currentX = 0;
    let currentY = 0;
    const animate = () => {
      currentX += (tilt.x - currentX) * 0.1;
      currentY += (tilt.y - currentY) * 0.1;
      if (ref.current) {
        ref.current.style.transform = `perspective(800px) rotateY(${currentX}deg) rotateX(${-currentY}deg)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [tilt, hasGyro]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}
