"use client";

// Lightbox/album-modal/auto-scroll components extracted verbatim from
// src/app/photography/page.tsx (oversized-file split, board S5 follow-up).
// No behavior change -- moved as-is.

import { useRef, useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { FiX, FiChevronLeft, FiChevronRight, FiCamera } from "react-icons/fi";
import { useSwipe } from "@/hooks/useSwipe";
import { useModalA11y } from "@/hooks/useModalA11y";

const CAROUSEL_H = "h-[232px] sm:h-[338px] md:h-[423px]";

export function Lightbox({ images, index, onClose, onPrev, onNext, album }: {
  images: string[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void; album?: string;
}) {
  const swipe = useSwipe(onNext, onPrev);
  useModalA11y(onClose, { lockScroll: true });
  const hk = useCallback((e: KeyboardEvent) => {
  if (e.key === "ArrowLeft") onPrev();
  if (e.key === "ArrowRight") onNext();
  }, [onPrev, onNext]);
  useEffect(() => {
  document.addEventListener("keydown", hk);
  return () => document.removeEventListener("keydown", hk);
  }, [hk]);
  if (!images.length) return null;
return (
  <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center" onClick={onClose} {...swipe} tabIndex={0} style={{ animation: "wzFadeIn 0.2s ease-out both" }} role="dialog" aria-modal="true" aria-label="Image gallery">
  <button onClick={onClose} className="absolute top-4 right-4 z-[210] text-white/70 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Close"><FiX className="w-8 h-8" /></button>
  <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-[210] w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors min-w-[44px] min-h-[44px]" aria-label="Previous image"><FiChevronLeft className="w-6 h-6" /></button>
  <div className="max-w-[90vw] max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()} style={{ animation: "wzScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
    <Image src={images[index]} alt={album ? `${album} photo` : "Gallery photo"} width={1200} height={800} className="max-w-full max-h-[85vh] object-contain select-none" loading="lazy" />
  </div>
  <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-[210] w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors min-w-[44px] min-h-[44px]" aria-label="Next image"><FiChevronRight className="w-6 h-6" /></button>
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-mono" aria-live="polite">{index + 1} / {images.length}</div>
  </div>
  );
}

export function AlbumModal({ album, onClose }: { album: string; onClose: () => void }) {
  const [imgs, setImgs] = useState<string[]>([]);
  const [lIdx, setLIdx] = useState<number | null>(null);
  useModalA11y(onClose, { lockScroll: true });
  useEffect(() => { fetch(`/api/album-images?album=${encodeURIComponent(album)}`).then(r => r.json()).then(d => setImgs(d.images || [])).catch(() => {}); }, [album]);
return (
  <>
  <div className="fixed inset-0 z-[150] bg-black/60 flex items-center justify-center p-4" onClick={onClose} style={{ animation: "wzFadeIn 0.2s ease-out both" }} role="dialog" aria-modal="true" aria-label={`Album ${album}`}>
  <div className="bg-white max-w-5xl w-full max-h-[85vh] overflow-y-auto rounded-lg" onClick={e => e.stopPropagation()} style={{ animation: "wzScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
  <div className="sticky top-0 bg-white border-b border-[#E2E2E2] px-6 py-4 flex items-center justify-between z-10">
  <h3 className="font-heading font-bold text-[#333] text-lg tracking-[0.05em] uppercase mb-3">{album}</h3>
   <button onClick={onClose} className="text-[#666] hover:text-[#333] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Close"><FiX className="w-6 h-6" /></button>
  </div>
  <div className="p-6">
  {imgs.length === 0 ? (
  <div className="text-center py-12"><FiCamera className="w-12 h-12 text-[#CBCBCA] mx-auto mb-4" /><p className="text-[#666]">No images in this album yet.</p></div>
  ) : (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
  {imgs.map((img, i) => (
  <button key={i} onClick={() => setLIdx(i)} className="aspect-square relative bg-gray-100 overflow-hidden hover:ring-2 hover:ring-[#DF3131] transition-all cursor-pointer group">
     <Image src={img} alt={`${album}`} fill sizes="(max-width:640px) 50vw, (max-width:768px) 33vw, 25vw" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
   </button>
  ))}
  </div>
  )}
  </div>
  </div>
  </div>
  {lIdx !== null && <Lightbox images={imgs} index={lIdx} album={album} onClose={() => setLIdx(null)} onPrev={() => setLIdx((lIdx - 1 + imgs.length) % imgs.length)} onNext={() => setLIdx((lIdx + 1) % imgs.length)} />}
  </>
  );
}

export function AutoScrollRow({ items, speed = 0.88, className = "" }: { items: string[]; speed?: number; className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const paused = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRefs = useRef<Map<number, HTMLImageElement>>(new Map());

  useEffect(() => {
  const el = trackRef.current;
  if (!el || items.length === 0) return;
  let raf: number;
  const tick = () => {
  if (!paused.current && el) {
  offsetRef.current += speed;
  const half = el.scrollWidth / 2;
  if (half > 0 && offsetRef.current >= half) offsetRef.current -= half;
  el.style.transform = `translateX(${-offsetRef.current}px)`;
  }
  raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
  }, [items, speed]);

  useEffect(() => {
  return () => { if (resumeTimer.current) clearTimeout(resumeTimer.current); };
  }, []);

  const handleClick = () => {
   paused.current = true;
   if (resumeTimer.current) clearTimeout(resumeTimer.current);
   resumeTimer.current = setTimeout(() => { paused.current = false; }, 3000);
  };

  const handleImgLoad = (idx: number) => (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    img.style.opacity = "1";
    imgRefs.current.set(idx, img);
  };

  return (
  <div className={`overflow-hidden ${className}`} onClick={handleClick}>
   <div ref={trackRef} className="flex flex-nowrap gap-4 py-2 will-change-transform">
    {[...Array.from(new Set(items)), ...Array.from(new Set(items))].map((src, i) => (
           <div key={i} className={`flex-none w-[52.9vw] sm:w-[370px] md:w-[503px] lg:w-[582px] ${CAROUSEL_H} relative overflow-hidden cursor-pointer group`}>
       <Image src={src} alt="Photography portfolio" fill sizes="(max-width:640px) 53vw, 582px" loading="eager" onLoad={handleImgLoad(i)} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:scale-105 transition-transform duration-300" />
    </div>
    ))}
   </div>
  </div>
  );
}