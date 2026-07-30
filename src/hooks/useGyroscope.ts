"use client";
import { useEffect, useState, useCallback } from "react";

interface GyroValues {
  x: number; // -50 to 50 (percentage across element)
  y: number; // -50 to 50 (percentage across element)
}

/**
 * Hybrid gyroscope + mouse hook.
 * On mobile (DeviceOrientation): uses phone tilt for parallax.
 * On desktop: falls back to mouse position.
 *
 * iPhone 13 (390x844) and similar devices supported.
 * Requires permission on iOS 13+ (requested automatically).
 */
export function useGyroscope() {
  const [values, setValues] = useState<GyroValues>({ x: 0, y: 0 });
  const [hasGyro, setHasGyro] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Request DeviceOrientation permission (iOS 13+ requirement)
  useEffect(() => {
    const requestPermission = async () => {
      try {
        if (
          typeof DeviceOrientationEvent !== "undefined" &&
          typeof (DeviceOrientationEvent as any).requestPermission === "function"
        ) {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          setPermissionGranted(permission === "granted");
        } else {
          // Android or older iOS — no permission needed
          setPermissionGranted(true);
        }
      } catch {
        setPermissionGranted(false);
      }
    };
    requestPermission();
  }, []);

  // Gyroscope listener (mobile)
  useEffect(() => {
    if (!permissionGranted) return;

    const handler = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      // beta: front/back tilt (-180 to 180), gamma: left/right tilt (-90 to 90)
      const x = Math.max(-50, Math.min(50, (e.gamma || 0) * 1.1));
      const y = Math.max(-50, Math.min(50, ((e.beta || 0) - 45) * 1.1));
      setValues({ x, y });
      setHasGyro(true);
    };

    window.addEventListener("deviceorientation", handler, true);
    return () => window.removeEventListener("deviceorientation", handler, true);
  }, [permissionGranted]);

  // Mouse fallback (desktop)
  const mouseHandler = useCallback((e: React.MouseEvent, el: HTMLElement) => {
    if (hasGyro) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100;
    setValues({ x, y });
  }, [hasGyro]);

  // For component-level use: attach to onMouseMove
  const getMouseHandlers = useCallback(
    () => ({
      onMouseMove: (e: React.MouseEvent<HTMLElement>) => {
        mouseHandler(e, e.currentTarget);
      },
      onMouseLeave: () => {
        if (!hasGyro) setValues({ x: 0, y: 0 });
      },
    }),
    [mouseHandler, hasGyro]
  );

  // Derived position: 0-100% for radial gradients etc
  const percentX = values.x + 50;
  const percentY = values.y + 50;

  return { values, percentX, percentY, isMobile: hasGyro, getMouseHandlers };
}

/**
 * Simple gyroscope-driven transform style for tilt effects.
 * Returns CSS transform string suitable for perspective-based cards.
 */
export function useGyroTilt(intensity = 15) {
  const { values, isMobile } = useGyroscope();
  const rotateY = (values.x / 50) * intensity;
  const rotateX = (-values.y / 50) * intensity;
  return {
    transform: `perspective(800px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale3d(1.02,1.02,1.02)`,
    transition: "transform 0.1s ease-out",
    isActive: isMobile || Math.abs(values.x) > 0.5 || Math.abs(values.y) > 0.5,
  };
}
