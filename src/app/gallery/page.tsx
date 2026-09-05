"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSwipe } from "@/hooks/useSwipe";
import { useModalA11y } from "@/hooks/useModalA11y";
import ImageHoverReveal from "@/components/ImageHoverReveal";
import { useZeal } from "@/components/ZealProvider";

const IMAGES = [
 { src: "/images/gallery/gallery_1.jpg", cat: "Portraits" },
 { src: "/images/gallery/gallery_2.jpg", cat: "Portraits" },
 { src: "/images/gallery/gallery_3.jpg", cat: "Editorial" },
 { src: "/images/gallery/gallery_4.jpg", cat: "Editorial" },
 { src: "/images/gallery/gallery_5.jpg", cat: "Creative" },
 { src: "/images/gallery/gallery_6.jpg", cat: "Bodypaint" },
 { src: "/images/gallery/gallery_7.jpg", cat: "Lifestyle" },
 { src: "/images/gallery/gallery_8.jpg", cat: "Lifestyle" },
 { src: "/images/gallery/gallery_9.jpg", cat: "Fashion" },
 { src: "/images/gallery/gallery_10.jpg", cat: "Fashion" },
 { src: "/images/gallery/gallery_11.jpg", cat: "Commercial" },
 { src: "/images/gallery/gallery_12.jpg", cat: "Commercial" },
 { src: "/images/gallery/gallery_13.jpg", cat: "Fine Art" },
 { src: "/images/gallery/gallery_14.jpg", cat: "Fine Art" },
 { src: "/images/gallery/gallery_15.jpg", cat: "Events" },
];

const CATS = ["All", "Portraits", "Editorial", "Creative", "Bodypaint", "Lifestyle", "Fashion", "Commercial", "Fine Art", "Events"];

function GalleryLightbox({ images, index, onClose, onPrev, onNext, onImageTap }: {
 images: { src: string; cat: string }[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void; onImageTap: () => void;
}) {
 const swipe = useSwipe(onNext, onPrev);
 useModalA11y(onClose);
 useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
 return (
 <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={onClose} {...swipe} style={{ animation: "wzFadeIn 0.2s ease-out both" }}>
 <button className="absolute top-6 right-6 text-white/70 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center" onClick={onClose} aria-label="Close"><FiX className="w-8 h-8" /></button>
 <button className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center" onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Previous image"><FiChevronLeft className="w-10 h-10" /></button>
 <Image src={images[index].src} alt={images[index].cat} width={900} height={600} unoptimized className="max-h-[85vh] max-w-[90vw] object-contain select-none" draggable={false} onClick={(e) => { e.stopPropagation(); onImageTap(); }} style={{ animation: "wzScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both" }} />
 <button className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next image"><FiChevronRight className="w-10 h-10" /></button>
 <div className="absolute bottom-6 text-white/50 text-sm">{index + 1} / {images.length}</div>
 </div>
 );
}

export default function GalleryPage() {
 const [cat, setCat] = useState("All");
 const [lightbox, setLightbox] = useState<number | null>(null);
 const filtered = cat === "All" ? IMAGES : IMAGES.filter(i => i.cat === cat);
 const { earn } = useZeal();
 const viewCountRef = useRef(0);
 const browseRewardEarnedRef = useRef(false);
 const lastTapRef = useRef(0);
 const doubleTapEarnedRef = useRef(false);

 useEffect(() => {
  try {
   const stored = parseInt(sessionStorage.getItem("zeal-gallery-view-count") || "", 10);
   if (!Number.isNaN(stored)) viewCountRef.current = stored;
  } catch { /* storage unavailable */ }
 }, []);

 const registerImageView = useCallback(() => {
  if (browseRewardEarnedRef.current) return;
  viewCountRef.current += 1;
  try { sessionStorage.setItem("zeal-gallery-view-count", String(viewCountRef.current)); } catch { /* storage unavailable */ }
  if (viewCountRef.current >= 10) {
   browseRewardEarnedRef.current = true;
   void earn("browse-gallery-10");
  }
 }, [earn]);

 const registerTap = () => {
  const now = Date.now();
  if (now - lastTapRef.current < 350) {
   lastTapRef.current = 0;
   if (!doubleTapEarnedRef.current) {
    doubleTapEarnedRef.current = true;
    void earn("double-tap");
   }
  } else {
   lastTapRef.current = now;
  }
 };

 const handleImageOpen = (i: number) => {
  registerTap();
  setLightbox(i);
  registerImageView();
 };

 const nav = (dir: number) => {
 if (lightbox === null) return;
 const next = lightbox + dir;
 if (next < 0) setLightbox(filtered.length - 1);
 else if (next >= filtered.length) setLightbox(0);
 else setLightbox(next);
 };

 useEffect(() => {
 const h = (e: KeyboardEvent) => {
 if (lightbox === null) return;
 if (e.key === "Escape") setLightbox(null);
 if (e.key === "ArrowLeft") nav(-1);
 if (e.key === "ArrowRight") nav(1);
 };
 window.addEventListener("keydown", h);
 return () => window.removeEventListener("keydown", h);
 }, [lightbox]);

 return (
  <main className="pb-16 bg-white dark:bg-[#1C1C1E]">
 <div className="max-w-[115rem] mx-auto px-6 lg:px-12 pt-32 lg:pt-40">
 <div className="mb-8 text-center">
  <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.15em] mb-6 sm:mb-8">G{"\u00a0"}A{"\u00a0"}L{"\u00a0"}L{"\u00a0"}E{"\u00a0"}R{"\u00a0"}Y</h1>
  <p className="text-[#666] dark:text-[#b0b0b0] text-sm mt-2">Our complete portfolio of work</p>
 </div>
 <div className="flex gap-3 mb-8 flex-wrap justify-center">
 {CATS.map(c => {
  const isActive = cat === c;
  return (
   <button key={c} onClick={() => setCat(c)} className={`px-5 py-2.5 text-sm font-semibold tracking-[0.1em] rounded-full border transition-all ${
    isActive
     ? "bg-[#DF3131] text-white border-[#DF3131] shadow-lg shadow-[#DF3131]/30"
     : "border-[#E2E2E2] dark:border-[#444] text-[#333] dark:text-[#e0e0e0] hover:border-[#DF3131] hover:text-[#DF3131]"
    }`} aria-pressed={isActive}>{c}</button>
  );
 })}
 </div>
 <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
  {filtered.map((img, i) => (
  <div key={i} className="break-inside-avoid cursor-pointer group" onClick={() => handleImageOpen(i)}>
  <ImageHoverReveal>
   <div className="relative overflow-hidden rounded-lg aspect-[3/4]">
    <Image src={img.src} alt={img.cat} fill sizes="(max-width:768px) 50vw, 33vw" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-end p-3">
  <span className="text-white text-xs font-semibold bg-[#DF3131] px-2 py-1 rounded-full">{img.cat}</span>
  </div>
  </div>
  </ImageHoverReveal>
  </div>
  ))}
 </div>
 {filtered.length === 0 && <p className="text-center text-[#666] py-20">No images in this category.</p>}
 </div>

 {lightbox !== null && (
  <GalleryLightbox images={filtered} index={lightbox} onClose={() => setLightbox(null)} onPrev={() => nav(-1)} onNext={() => nav(1)} onImageTap={registerTap} />
 )}
 </main>
 );
}