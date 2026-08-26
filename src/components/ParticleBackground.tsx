"use client";

import { useEffect, useRef, useCallback } from "react";
import { prefersReducedMotion } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  opacityDir: number;
}

interface ParticleBackgroundProps {
  count?: number;
  color?: string;
  maxSize?: number;
  speed?: number;
  className?: string;
  blendMode?: string;
  mouseReactive?: boolean;
}

export default function ParticleBackground({
  count = 60,
  color = "#DF3131",
  maxSize = 4,
  speed = 0.4,
  className = "",
  blendMode = "screen",
  mouseReactive = true,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  const init = useCallback((actualCount: number, actualMaxSize: number, actualSpeed: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const arr: Particle[] = [];
    for (let i = 0; i < actualCount; i++) {
      arr.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * actualSpeed,
        vy: (Math.random() - 0.5) * actualSpeed,
        size: Math.random() * actualMaxSize + 1,
        opacity: Math.random() * 0.7 + 0.1,
        opacityDir: Math.random() > 0.5 ? 1 : -1,
      });
    }
    particlesRef.current = arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = prefersReducedMotion();
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isMobile = window.innerWidth < 768;
    const actualCount = isMobile ? Math.min(count, 20) : count;
    const actualMaxSize = isMobile ? Math.min(maxSize, 2.5) : maxSize;
    const actualSpeed = isMobile ? speed * 0.6 : speed;
    const useMouse = mouseReactive && !isTouch;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      init(actualCount, actualMaxSize, actualSpeed);
    };

    const onResize = () => {
      resize();
      if (reduced) drawParticles();
    };
    resize();
    window.addEventListener("resize", onResize);

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    if (useMouse && !reduced) {
      canvas.addEventListener("mousemove", onMouse);
      canvas.style.pointerEvents = "auto";
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawParticles = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particlesRef.current.forEach((p) => {
        if (useMouse && mx > 0 && my > 0) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150 * 0.02;
            p.vx += dx * force;
            p.vy += dy * force;
          }
        }

        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        p.opacity += p.opacityDir * 0.005;
        if (p.opacity >= 0.8) p.opacityDir = -1;
        if (p.opacity <= 0.1) p.opacityDir = 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        if (!isMobile) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = p.opacity * 0.15;
          ctx.fill();
        }
      });

    };

    const animate = () => {
      drawParticles();
      rafRef.current = requestAnimationFrame(animate);
    };

    if (reduced) {
      drawParticles();
    } else {
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      if (useMouse) canvas.removeEventListener("mousemove", onMouse);
    };
  }, [color, blendMode, init, mouseReactive, count, maxSize, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
