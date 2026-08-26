"use client";
import { useEffect, useRef, useCallback } from "react";
import { useGyroPermission } from "@/hooks/useGyroPermission";
import { prefersReducedMotion } from "@/lib/utils";

export function MouseGlow({ color = "#DF3131", children }: { color?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const gyroGate = useRef(false);

  const startGyro = useCallback((setCleanup: (fn: () => void) => void) => {
    if (prefersReducedMotion()) return;
    const handler = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      const el = ref.current;
      if (!el) return;
      const x = Math.max(0, Math.min(100, ((e.gamma || 0) + 90) / 1.8));
      const y = Math.max(0, Math.min(100, ((e.beta || 0) + 90) / 1.8));
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
      gyroGate.current = true;
    };
    window.addEventListener("deviceorientation", handler, { passive: true });
    setCleanup(() => window.removeEventListener("deviceorientation", handler));
  }, []);

  useGyroPermission(startGyro);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const mouseHandler = (e: MouseEvent) => {
      if (gyroGate.current) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };

    el.addEventListener("mousemove", mouseHandler);
    return () => el.removeEventListener("mousemove", mouseHandler);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background: `radial-gradient(circle at var(--mx, 50%) var(--my, 50%), ${color}09 0%, ${color}03 40%, transparent 70%)`,
        transition: "background 0.3s ease",
      }}
    >
      {children}
    </div>
  );
}
