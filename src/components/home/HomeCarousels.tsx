"use client";

// Carousel/playlist components extracted verbatim from src/app/home/page.tsx
// (oversized-file split, board S9 follow-up). No behavior change.

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";

const CAROUSEL_H = "h-[232px] sm:h-[338px] md:h-[423px]";

export function SmoothCarousel({ items, className = "", speed = 0.5, direction = "left" }: { items: string[]; className?: string; speed?: number; direction?: "left" | "right" }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const paused = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const dirRef = useRef(direction === "right" ? -1 : 1);
  const imgRefs = useRef<Map<number, HTMLImageElement>>(new Map());

  useEffect(() => { dirRef.current = direction === "right" ? -1 : 1; }, [direction]);

  useEffect(() => {
  const sec = sectionRef.current;
  if (!sec) return;
  const obs = new IntersectionObserver(([e]) => { paused.current = !e.isIntersecting; }, { threshold: 0 });
  obs.observe(sec);
  return () => obs.disconnect();
  }, []);

  useEffect(() => {
  const el = trackRef.current;
  if (!el) return;
  let raf: number;
  const tick = () => {
  if (!paused.current && el) {
  offsetRef.current -= speed * dirRef.current;
  const half = el.scrollWidth / 2;
  // 2026-10-29 (Claude): offsetRef drifts negative for direction="left"
  // (dirRef=1) but positive for direction="right" (dirRef=-1) -- the old
  // single-branch `+= half` only wrapped the negative case back toward 0;
  // for direction="right" it pushed the offset even further positive
  // instead of wrapping, so it grew unbounded and eventually scrolled the
  // whole track out of view (same bug confirmed live on the designs page's
  // Flyers carousel, the only one there using direction="right" -- this
  // component's hero image-gallery-strip instance uses it too). Wrap both
  // directions back toward [-half, half) explicitly.
  if (offsetRef.current <= -half) offsetRef.current += half;
  else if (offsetRef.current >= half) offsetRef.current -= half;
  el.style.transform = `translateX(${offsetRef.current}px)`;
  }
  raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
  }, [speed]);

  const handleClick = () => {
  paused.current = true;
  if (clickTimer.current) clearTimeout(clickTimer.current);
  clickTimer.current = setTimeout(() => { paused.current = false; }, 3000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
  touchStartX.current = e.touches[0].clientX;
  paused.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
  if (touchStartX.current !== null) {
  const dx = e.changedTouches[0].clientX - touchStartX.current;
  offsetRef.current += dx * 2;
  if (trackRef.current) trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
  }
  touchStartX.current = null;
  if (clickTimer.current) clearTimeout(clickTimer.current);
  clickTimer.current = setTimeout(() => { paused.current = false; }, 3000);
  };

  const handleImgLoad = (idx: number) => (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    img.style.opacity = "1";
    imgRefs.current.set(idx, img);
  };

  const unique = Array.from(new Set(items));
  const doubled = [...unique, ...unique];

  return (
    <div ref={sectionRef} aria-hidden="true" className={`overflow-hidden ${className}`} onClick={handleClick} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
         <div ref={trackRef} className="flex flex-nowrap items-start gap-4 py-2 will-change-transform cursor-pointer" aria-hidden="true">
       {doubled.map((src, i) => (
           <div key={i} className={`group flex-none w-[42.32vw] sm:w-[305px] md:w-[423px] ${CAROUSEL_H} relative overflow-hidden rounded-sm`}>
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width:640px) 42vw, 423px"
          loading="eager"
          decoding="async"
          onLoad={handleImgLoad(i)}
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:scale-[1.035]"
        />
      </div>
      ))}
   </div>
   </div>
  );
}

export function LogoCarousel({ items, speed = 0.5 }: { items: { name: string; img: string }[]; speed?: number }) {
 const trackRef = useRef<HTMLDivElement>(null);
 const offsetRef = useRef(0);
 const paused = useRef(false);
 const sectionRef = useRef<HTMLDivElement>(null);
 const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
 const touchStartX = useRef<number | null>(null);

 useEffect(() => {
 const sec = sectionRef.current;
 if (!sec) return;
 const obs = new IntersectionObserver(([e]) => { paused.current = !e.isIntersecting; }, { threshold: 0 });
 obs.observe(sec);
 return () => obs.disconnect();
 }, []);

 useEffect(() => {
 const el = trackRef.current;
 if (!el) return;
 let raf: number;
 const tick = () => {
 if (!paused.current && el) {
 offsetRef.current += speed;
 const half = el.scrollWidth / 2;
 if (offsetRef.current >= half) offsetRef.current -= half;
 el.style.transform = `translateX(${-offsetRef.current}px)`;
 }
 raf = requestAnimationFrame(tick);
 };
 raf = requestAnimationFrame(tick);
 return () => cancelAnimationFrame(raf);
 }, [speed]);

 const handleClick = () => {
 paused.current = true;
 if (clickTimer.current) clearTimeout(clickTimer.current);
 clickTimer.current = setTimeout(() => { paused.current = false; }, 3000);
 };

 const handleTouchStart = (e: React.TouchEvent) => {
 touchStartX.current = e.touches[0].clientX;
 paused.current = true;
 };

 const handleTouchEnd = (e: React.TouchEvent) => {
 if (touchStartX.current !== null) {
 const dx = e.changedTouches[0].clientX - touchStartX.current;
 offsetRef.current -= dx * 2;
 if (trackRef.current) trackRef.current.style.transform = `translateX(${-offsetRef.current}px)`;
 }
 touchStartX.current = null;
 if (clickTimer.current) clearTimeout(clickTimer.current);
 clickTimer.current = setTimeout(() => { paused.current = false; }, 3000);
 };

 const uniqueLogos = Array.from(new Map(items.map((l) => [l.img, l])).values());
 const tripled = [...uniqueLogos, ...uniqueLogos, ...uniqueLogos];

 return (
 <div ref={sectionRef} className="overflow-hidden" onClick={handleClick} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
  <div ref={trackRef} className="flex gap-8 sm:gap-12 lg:gap-16 items-center py-3 will-change-transform cursor-pointer">
  {tripled.map((logo, i) => (
  <div key={i} className="flex-none flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110">
    {/* 2026-10-30 (Claude): grayscale-by-default, full color on hover -- a
       small, common agency-site touch that makes an otherwise-static logo
       strip feel alive without adding any new motion for folks with
       prefers-reduced-motion (the color transition still respects that,
       since it's just a filter/opacity tween, not movement). */}
    <Image src={logo.img} alt={logo.name} width={96} height={96} className="h-10 sm:h-12 max-w-[110px] sm:max-w-[150px] w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
 </div>
 ))}
 </div>
 </div>
 );
}

export function VideoPlaylist({ videos }: { videos: string[] }) {
 const videoRef = useRef<HTMLVideoElement>(null);
 const idxRef = useRef(0);
 const wrapRef = useRef<HTMLDivElement>(null);

 const advance = useCallback(() => {
 idxRef.current = (idxRef.current + 1) % videos.length;
 const el = videoRef.current;
 if (el) {
 el.src = videos[idxRef.current];
 el.load();
 el.play().catch(() => {});
 }
 }, [videos]);

 useEffect(() => {
 idxRef.current = 0;
 const el = videoRef.current;
 if (el && videos.length > 0) {
 el.src = videos[0];
 el.load();
 el.play().catch(() => {});
 }
  }, [videos]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const el = videoRef.current;
    if (!wrap || !el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.play().catch(() => {}); }
      else { el.pause(); }
    }, { threshold: 0.1 });
    obs.observe(wrap);
    return () => obs.disconnect();
  }, []);

  return (
  <div ref={wrapRef} className="h-full w-full bg-black relative overflow-hidden flex items-center justify-center">
  <video
  ref={videoRef}
  className="absolute inset-0 w-full h-full object-cover"
  style={{ transform: "scale(1.10)" }}
  muted
  playsInline
  aria-hidden="true"
  tabIndex={-1}
  onEnded={advance}
  preload="metadata"
  />
 </div>
 );
}