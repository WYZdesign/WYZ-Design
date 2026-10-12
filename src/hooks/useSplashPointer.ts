"use client";

// Pointer/tilt tracking extracted from src/components/SplashVariants.tsx
// (oversized-file split, board S6). Pure logic, no JSX -- every splash
// variant reads this one shared pointer ref, written by mouse movement on
// desktop and by device tilt on phones. See SplashVariants.tsx for the
// full rationale comment this was originally attached to.

import { useEffect, useRef, useCallback } from "react";
import { useGyroPermission } from "@/hooks/useGyroPermission";

export function usePointerField(ref: React.RefObject<HTMLDivElement | null>) {
 const p = useRef({ x: -999, y: -999, on: false });

 useEffect(() => {
  const el = ref.current;
  if (!el) return;
  // Touch devices fire synthetic mouse events on tap/swipe; ignore those so the
  // splash is driven only by real mouse movement, or by device motion/tilt.
  const touchPrimary = (typeof window !== "undefined") && (window.matchMedia("(hover: none), (pointer: coarse)").matches || "ontouchstart" in window);
  if (touchPrimary) return;
  const onMove = (e: MouseEvent) => {
   const sc = (e as MouseEvent & { sourceCapabilities?: { firesTouchEvents?: boolean } }).sourceCapabilities;
   if (sc && sc.firesTouchEvents) return;
   const r = el.getBoundingClientRect(); p.current = { x: e.clientX - r.left, y: e.clientY - r.top, on: true };
  };
  const onLeave = () => { p.current.on = false; };
  el.addEventListener("mousemove", onMove, { passive: true });
  el.addEventListener("mouseleave", onLeave, { passive: true });
  return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
 }, [ref]);

 const onGyroGranted = useCallback((setCleanup: (fn: () => void) => void) => {
  const handler = (e: DeviceOrientationEvent) => {
   if (e.gamma === null || e.beta === null || !ref.current) return;
   const r = ref.current.getBoundingClientRect();
   const nx = Math.max(0, Math.min(1, (e.gamma + 45) / 90));
   const ny = Math.max(0, Math.min(1, (e.beta + 45) / 90));
   p.current = { x: nx * r.width, y: ny * r.height, on: true };
  };
  window.addEventListener("deviceorientation", handler, { passive: true });
  setCleanup(() => window.removeEventListener("deviceorientation", handler));
 }, [ref]);
 useGyroPermission(onGyroGranted);

 return p;
}

export function useStage() {
 const ref = useRef<HTMLDivElement>(null);
 const mouse = usePointerField(ref);
 return { ref, mouse, onMove: () => {}, onLeave: () => {} };
}

export function fit(c: HTMLCanvasElement) { const p = c.parentElement!; c.width = p.clientWidth; c.height = p.clientHeight; return { W: c.width, H: c.height }; }
