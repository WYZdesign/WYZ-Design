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
 const gyro = useRef({ x: .5, y: .5 });
 const gyroActive = useRef(false);

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

 // Mobile: never sit still waiting for a tilt permission the visitor may not
 // grant. On touch devices drive a slow autonomous orbit so every variant
 // animates continuously by itself; the first real device orientation takes
 // over (gyroActive) so tilt still influences it once available.
 useEffect(() => {
  const el = ref.current;
  if (!el) return;
  const touchPrimary = (typeof window !== "undefined") && (window.matchMedia("(hover: none), (pointer: coarse)").matches || "ontouchstart" in window);
  if (!touchPrimary) return;
  let raf = 0, t = Math.random() * 6.283;
  const tick = () => {
   if (!gyroActive.current) {
    t += 0.006;
    const r = el.getBoundingClientRect();
    const nx = 0.5 + 0.34 * Math.sin(t * 1.1) * Math.cos(t * 0.37);
    const ny = 0.5 + 0.28 * Math.sin(t * 0.73 + 1.7);
    p.current = { x: nx * r.width, y: ny * r.height, on: true };
   }
   raf = requestAnimationFrame(tick);
  };
  tick();
  return () => cancelAnimationFrame(raf);
 }, [ref]);

 const onGyroGranted = useCallback((setCleanup: (fn: () => void) => void) => {
  const handler = (e: DeviceOrientationEvent) => {
   if (e.gamma === null || e.beta === null || !ref.current) return;
   gyroActive.current = true;
   const r = ref.current.getBoundingClientRect();
   const nx = Math.max(0, Math.min(1, (e.gamma + 45) / 90));
   // beta is front-to-back tilt, 0deg = device lying flat. A phone actually
   // held up to look at it sits near beta=90deg, not 0deg, so centering the
   // range on 0 (the old code) pins this axis at one extreme the whole time
   // during normal handheld use and only the left-right axis ever visibly
   // moves. Center on 90deg instead, the natural "looking at it" angle.
   const ny = Math.max(0, Math.min(1, (e.beta - 45) / 90));
   // Physical sensors are noisy. Ease the raw reading before each splash
   // receives it, so a phone tilt feels direct without looking jittery.
   gyro.current.x += (nx - gyro.current.x) * .2;
   gyro.current.y += (ny - gyro.current.y) * .2;
   p.current = { x: gyro.current.x * r.width, y: gyro.current.y * r.height, on: true };
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
