"use client";

// Video mute context + modal/carousel components extracted verbatim from
// src/app/events/page.tsx (oversized-file split, board S4 follow-up). No
// behavior change -- moved as-is.

import { useRef, useState, useEffect, useCallback, createContext, useContext } from "react";
import { FiChevronLeft, FiChevronRight, FiPlay, FiX } from "react-icons/fi";
import { useModalA11y } from "@/hooks/useModalA11y";
import { useZeal } from "@/components/ZealProvider";

function markRecapPlayed(earn: (action: string) => Promise<unknown>) {
  try {
    if (sessionStorage.getItem("zeal:recap")) return;
    sessionStorage.setItem("zeal:recap", "1");
  } catch {}
  void earn("watch-recap");
}

function videoThumb(videoPath: string): string {
 const name = videoPath.split("/").pop()?.replace(/\.mp4$/, "") || "";
 const safe = name.replace(/[^a-zA-Z0-9]/g, "_");
 return `/images/event-thumbnails/${safe}.jpg`;
}

/* ═══ GLOBAL VIDEO MUTE CONTEXT ═══ */
interface VideoMuteCtx {
 activeVideoId: string | null;
 toggleVideo: (id: string) => void;
 muteAll: () => void;
}
const VideoMuteContext = createContext<VideoMuteCtx>({ activeVideoId: null, toggleVideo: () => {}, muteAll: () => {} });

export function VideoMuteProvider({ children }: { children: React.ReactNode }) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
 const toggleVideo = useCallback((id: string) => {
  setActiveVideoId((prev) => (prev === id ? null : id));
 }, []);
 const muteAll = useCallback(() => { setActiveVideoId(null); }, []);
 return (
  <VideoMuteContext.Provider value={{ activeVideoId, toggleVideo, muteAll }}>
   {children}
  </VideoMuteContext.Provider>
 );
}

const SPEAKER_MUTED_SVG = (
 <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
 </svg>
);
const SPEAKER_ON_SVG = (
 <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
 </svg>
);

export function VideoModal({ video, title, onClose }: { video: string; title: string; onClose: () => void }) {
 const videoRef = useRef<HTMLVideoElement>(null);
 const { earn } = useZeal();
 const { activeVideoId, toggleVideo, muteAll } = useContext(VideoMuteContext);
 const isMuted = activeVideoId !== "modal";

 useEffect(() => { muteAll(); return () => muteAll(); }, [muteAll]);

 useModalA11y(onClose);

  useEffect(() => {
   const vid = videoRef.current;
   if (vid) { vid.muted = true; vid.play().catch(() => {}); }
   markRecapPlayed(earn);
   const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
  document.addEventListener("keydown", handleKey);
  document.body.style.overflow = "hidden";
  return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
 }, [onClose, earn]);

 useEffect(() => { const vid = videoRef.current; if (vid) vid.muted = isMuted; }, [isMuted]);

  return (
  <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4" onClick={onClose} style={{ animation: "wzFadeIn 0.2s ease-out both" }} role="dialog" aria-modal="true" aria-label="Video player">
  <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Close">
  <FiX className="w-5 h-5 text-white" />
  </button>
  <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()} style={{ animation: "wzScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
   <video ref={videoRef} src={video} controls autoPlay muted playsInline className="w-full h-auto max-h-[85vh] object-contain rounded-lg" />
  <button
   onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleVideo("modal"); }}
   className="absolute bottom-6 right-4 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-[#DF3131]/80 flex items-center justify-center transition-all duration-200"
   aria-label={isMuted ? "Unmute" : "Mute"}
  >
   {isMuted ? SPEAKER_MUTED_SVG : SPEAKER_ON_SVG}
  </button>
  <p className="text-white text-center font-heading font-bold text-sm tracking-wider mb-2">{title}</p>
  </div>
  </div>
  );
}

export function VideoCarousel({ items, onPlay }: { items: { title: string; video: string }[]; onPlay?: (item: { title: string; video: string }) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const paused = useRef(false);
  const secRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const { activeVideoId, toggleVideo } = useContext(VideoMuteContext);

  const CAROUSEL_H = "h-[232px] sm:h-[338px] md:h-[423px]";

  useEffect(() => {
   const sec = secRef.current;
   if (!sec) return;
   const obs = new IntersectionObserver(([e]) => { paused.current = !e.isIntersecting; }, { threshold: 0 });
   obs.observe(sec);
   return () => obs.disconnect();
  }, []);

  useEffect(() => {
   const track = trackRef.current;
   if (!track) return;
   const videos = track.querySelectorAll<HTMLVideoElement>("video");
   videos.forEach((v) => {
    const id = v.getAttribute("data-video-id");
    v.muted = id ? id !== activeVideoId : true;
   });
  }, [activeVideoId]);

  useEffect(() => {
  const el = trackRef.current;
  if (!el) return;
  let raf: number;
  const tick = () => {
  if (!paused.current && el) {
  offsetRef.current -= 0.5;
   const full = el.scrollWidth;
   if (full > 0 && Math.abs(offsetRef.current) >= full) offsetRef.current += full;
  el.style.transform = `translateX(${offsetRef.current}px)`;
  }
  raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
  }, []);

  const scroll = useCallback((dir: number) => {
  offsetRef.current += dir * 340;
  if (trackRef.current) trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
  }, []);

  const [list, setList] = useState(items);

  // 2026-10-10 (Claude, board K10): the auto-scroll loop below resets the
  // track's translateX once it has scrolled past the track's own full
  // scrollWidth -- which only looks seamless if the track's rendered width
  // already comfortably exceeds the viewport. With the Client Events
  // carousel's 7 items (vs. DIY Shows' 11), the track ran out of real
  // content well before the reset point on most desktop viewports, leaving
  // a visible blank gap at the right edge for the remainder of each loop.
  // Fix: render the shuffled order tripled back-to-back (same technique
  // already used for the merch marquees) so the track is always wide
  // enough to stay full regardless of item count or viewport width. The
  // reset math itself (`full = el.scrollWidth`) is computed from whatever
  // is actually rendered, so tripling here needs no change to that logic --
  // unlike the merch CSS-keyframe bug, there's no hardcoded percentage to
  // keep in sync with the copy count.
  useEffect(() => {
    const d = [...items];
    for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
    setList([...d, ...d, ...d]);
  }, [items]);

  return (
  <div ref={secRef} className="relative group/carousel"
  onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }}
  onTouchStart={() => { paused.current = true; }} onTouchEnd={() => { setTimeout(() => { paused.current = false; }, 2000); }}>
<button onClick={() => scroll(1)}
  aria-label="Scroll previous videos"
  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/70 text-gray-600 hover:bg-[#DF3131] hover:text-white transition-all min-w-[44px] min-h-[44px]"
  style={{ backdropFilter: "blur(4px)" }}>
  <FiChevronLeft className="w-5 h-5" />
  </button>
  <button onClick={() => scroll(-1)}
  aria-label="Scroll next videos"
  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/70 text-gray-600 hover:bg-[#DF3131] hover:text-white transition-all min-w-[44px] min-h-[44px]"
  style={{ backdropFilter: "blur(4px)" }}>
  <FiChevronRight className="w-5 h-5" />
  </button>
  <div className="overflow-hidden pb-4"
  onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; paused.current = true; }}
  onTouchEnd={(e) => {
  if (touchStartX.current !== null) {
  const dx = e.changedTouches[0].clientX - touchStartX.current;
  if (Math.abs(dx) > 40) scroll(dx > 0 ? 1 : -1);
  }
  touchStartX.current = null;
  setTimeout(() => { paused.current = false; }, 2000);
  }}>
  <div ref={trackRef} className="flex gap-3 will-change-transform">
   {list.map((v, i) => (
   <div key={i} className={`flex-none w-[55.5vw] sm:w-[254px] md:w-[297px] ${CAROUSEL_H} aspect-video group cursor-pointer hover-lift`} onClick={() => onPlay?.(v)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPlay?.(v); } }} role="button" tabIndex={0} aria-label={`Play ${v.title}`}>
  <div className="relative overflow-hidden w-full h-full">
  <video
  src={v.video}
  poster={videoThumb(v.video)}
   muted
   preload="none"
   data-video-id={v.title}
   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
  ref={(el) => { if (el) { el.volume = 0.3; } }}
  onLoadedMetadata={(e) => { e.currentTarget.currentTime = 5; }}
  onMouseEnter={(e) => {
   const vid = e.target as HTMLVideoElement;
   if (vid.readyState >= 1) vid.currentTime = 5;
   vid.play().catch(() => {});
  }}
  onMouseLeave={(e) => { const vid = e.target as HTMLVideoElement; vid.pause(); }}
  />
  <button
  onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleVideo(v.title); }}
  onMouseEnter={(e) => e.stopPropagation()}
  className="absolute bottom-2 right-2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
  aria-label={activeVideoId !== v.title ? 'Unmute' : 'Mute'}
  >
  {activeVideoId !== v.title ? SPEAKER_MUTED_SVG : SPEAKER_ON_SVG}
  </button>
  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center pointer-events-none opacity-100 group-hover:opacity-0">
  <div className="w-10 h-10 rounded-full bg-[#DF3131]/80 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
  <FiPlay className="w-4 h-4 text-white ml-0.5" />
  </div>
  </div>
  </div>
  <div className="px-0.5 py-1.5">
   <h3 className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] carousel-video-title group-hover:text-[#DF3131] transition-colors leading-tight line-clamp-2 mb-3">{v.title}</h3>
  </div>
  </div>
  ))}
  </div>
  </div>
  </div>
  );
}