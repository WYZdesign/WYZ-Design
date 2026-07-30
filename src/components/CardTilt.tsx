"use client";
import { useRef, useEffect, ReactNode, useCallback } from "react";
import { useGyroPermission } from "@/hooks/useGyroPermission";

interface CardTiltProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function CardTilt({ children, className = "", intensity = 15 }: CardTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const gyroRef = useRef(false);
  const rafRef = useRef(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;

  const startGyro = useCallback((setCleanup: (fn: () => void) => void) => {
    let visible = true;
    const animate = () => {
      if (visible && ref.current) {
        const t = 0.12;
        const iv = intensityRef.current;
        currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, t);
        currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, t);
        const x = currentRef.current.x * iv;
        const y = currentRef.current.y * iv;
        const el = ref.current;
        if (el) {
          el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) scale3d(1.02,1.02,1.02)`;
          el.style.transition = "none";
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    const handler = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      gyroRef.current = true;
      targetRef.current.x = Math.max(-1, Math.min(1, (e.gamma || 0) / 45));
      targetRef.current.y = Math.max(-1, Math.min(1, ((e.beta || -45) + 45) / 90) - 0.5);
    };

    const el = ref.current;
    const obs = el ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }) : null;
    if (el && obs) obs.observe(el);

    window.addEventListener("deviceorientation", handler, { passive: true });
    rafRef.current = requestAnimationFrame(animate);
    setCleanup(() => {
      window.removeEventListener("deviceorientation", handler);
      cancelAnimationFrame(rafRef.current);
      if (obs) obs.disconnect();
    });
  }, []);

  useGyroPermission(startGyro);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (gyroRef.current) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const iv = intensityRef.current;
      el.style.transform = `perspective(800px) rotateY(${x * iv}deg) rotateX(${-y * iv}deg) scale3d(1.02,1.02,1.02)`;
      el.style.transition = "transform 0.1s ease-out";
    },
    []
  );

  const onLeave = useCallback(() => {
    if (gyroRef.current) return;
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
    el.style.transition = "transform 0.4s ease-out";
  }, []);

  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}
