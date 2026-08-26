"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/utils";

const INTERACTIVE_SEL = "a, button, [role=button], input, textarea, select, label, .cursor-pointer";

function getContrastColor(el: HTMLElement): string {
  const bg = window.getComputedStyle(el).backgroundColor;
  const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return "#FFD700";
  const r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3]);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.5 ? "#111111" : "#FFD700";
}

interface CursorState {
  color: string;
  size: number;
  border: number;
  opacity: number;
}

const DEFAULT_STATE: CursorState = { color: "#FFD700", size: 20, border: 2, opacity: 0.5 };

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });
  const isClicking = useRef(false);
  const currentStyle = useRef<CursorState>({ ...DEFAULT_STATE });
  const lastTarget = useRef<EventTarget | null>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    if (prefersReducedMotion()) {
      document.body.classList.remove("cursor-none");
      [cursorRef, trailRef, rippleRef].forEach((r) => {
        if (r.current) r.current.style.display = "none";
      });
      return;
    }

    const classifyTarget = (target: HTMLElement | null) => {
      if (!target || target === lastTarget.current) return;
      lastTarget.current = target;

      const interactive = target.closest(INTERACTIVE_SEL);
      const heading = target.closest("h1, h2, h3, h4, h5, h6, .font-heading");
      const image = target.closest("img, video, [data-cursor-view]");

      let next: CursorState;
      if (interactive) {
        next = { color: getContrastColor(target), size: 40, border: 2, opacity: 1 };
      } else if (image) {
        next = { color: "#FFD700", size: 50, border: 1.5, opacity: 0.9 };
      } else if (heading) {
        next = { color: "#FFD700", size: 28, border: 1.5, opacity: 0.8 };
      } else {
        next = { ...DEFAULT_STATE };
      }

      const c = currentStyle.current;
      if (next.color !== c.color || next.size !== c.size || next.border !== c.border || next.opacity !== c.opacity) {
        currentStyle.current = next;
      }
    };

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      classifyTarget(e.target as HTMLElement);
    };

    const onDown = () => {
      isClicking.current = true;
      if (rippleRef.current) {
        rippleRef.current.style.left = `${pos.current.x - 15}px`;
        rippleRef.current.style.top = `${pos.current.y - 15}px`;
        rippleRef.current.style.animation = "none";
        void rippleRef.current.offsetWidth;
        rippleRef.current.style.animation = "cursorRipple 0.4s ease-out forwards";
      }
    };
    const onUp = () => { isClicking.current = false; };

    let raf: number;
    let lastTime = performance.now();
    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.67, 3);
      lastTime = time;
      const p = pos.current;
      const c = cursorPos.current;
      const t = trailPos.current;

      const cursorLerp = 1 - Math.pow(1 - 0.15, dt);
      const trailLerp = 1 - Math.pow(1 - 0.08, dt);

      c.x += (p.x - c.x) * cursorLerp;
      c.y += (p.y - c.y) * cursorLerp;

      t.x += (p.x - t.x) * trailLerp;
      t.y += (p.y - t.y) * trailLerp;

      const s = currentStyle.current;
      const shrink = isClicking.current ? 0.8 : 1;
      const finalSize = s.size * shrink;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${c.x - finalSize / 2}px, ${c.y - finalSize / 2}px)`;
        cursorRef.current.style.width = `${finalSize}px`;
        cursorRef.current.style.height = `${finalSize}px`;
        cursorRef.current.style.borderWidth = `${s.border}px`;
        cursorRef.current.style.borderColor = s.color;
        cursorRef.current.style.opacity = `${s.opacity}`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${t.x - 4}px, ${t.y - 4}px)`;
        trailRef.current.style.backgroundColor = s.color;
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
  if (isTouch) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] hidden lg:block rounded-full"
        style={{
          width: 20, height: 20, borderWidth: 2, borderStyle: "solid",
          borderColor: "#FFD700", backgroundColor: "transparent",
          willChange: "transform", mixBlendMode: "difference",
        }}
      />
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[99998] hidden lg:block"
        style={{ backgroundColor: "#FFD700", opacity: 0.35, filter: "blur(0.5px)", willChange: "transform" }}
      />
      <div
        ref={rippleRef}
        className="fixed pointer-events-none z-[99997] hidden lg:block rounded-full border border-[#FFD700]"
        style={{ left: -100, top: -100, width: 30, height: 30, willChange: "transform" }}
      />
      <style>{`@keyframes cursorRipple { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(3); opacity: 0; } }`}</style>
    </>
  );
}
