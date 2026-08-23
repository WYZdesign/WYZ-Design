"use client";

import { useRef, useState, useEffect, useCallback, useMemo, createContext, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiPlay, FiX } from "react-icons/fi";
import { useSwipe } from "@/hooks/useSwipe";
import { useShuffle } from "@/hooks/useShuffle";
import ScrollReveal from "@/components/ScrollReveal";
import EnhancedMarquee from "@/components/EnhancedMarquee";
import TextSplit from "@/components/TextSplit";

const CLIENT_EVENTS_RAW = [
 { title: "Birthday Video", video: "/videos/client-events/Birthday Video.mp4" },
 { title: "Cooking Video", video: "/videos/client-events/Cooking Video (AI Voice).mp4" },
 { title: "Family and Friends Recap", video: "/videos/client-events/Family and Friends Recap.mp4" },
 { title: "Funeral Recap", video: "/videos/client-events/Funeral Recap.mp4" },
 { title: "GFT Mini Promo", video: "/videos/client-events/GFT Mini Promo.mp4" },
 { title: "GFT Mini Promo 2", video: "/videos/client-events/GFT Mini Promo 2.mp4" },
 { title: "Lyric Video (Martell)", video: "/videos/client-events/Lyric Video (Martell).mp4" },
];

const DIY_SHOWS_RAW = [
 { title: "Action Sack Vol. 5", video: "/videos/diy-shows/Action Sack Vol. 5.mp4" },
 { title: "Action Sack Vol. 6", video: "/videos/diy-shows/Action Sack Vol. 6.mp4" },
 { title: "C.O. Reloaded Vol. 1", video: "/videos/diy-shows/C.O. Reloaded Vol. 1 recap.mp4" },
 { title: "C.O. Reloaded Vol. 3", video: "/videos/diy-shows/C.O. Reloaded Vol. 3 recap.mp4" },
 { title: "Creative Cloud Vol. 1", video: "/videos/diy-shows/Creative Cloud Vol. 1.mp4" },
 { title: "Creative Cloud Vol. 2", video: "/videos/diy-shows/Creative Cloud Vol. 2.mp4" },
 { title: "Frequinox Vol. 1", video: "/videos/diy-shows/Frequinox Vol. 1.mp4" },
 { title: "Frequinox Vol. 3", video: "/videos/diy-shows/Frequinox Vol. 3.mp4" },
 { title: "Local Love Vol. 2", video: "/videos/diy-shows/Local Love Vol. 2.mp4" },
 { title: "Local Love Vol. 3", video: "/videos/diy-shows/Local Love Vol. 3.mp4" },
 { title: "Local Love Vol. 4", video: "/videos/diy-shows/Local Love Vol. 4.mp4" },
 { title: "Local Love Vol. 5", video: "/videos/diy-shows/Local Love Vol. 5.mp4" },
 { title: "Secret Stash Vol. 1", video: "/videos/diy-shows/Secret Stash Vol. 1.mp4" },
];

const ALL_EVENT_IMAGES = [
 { title: "Action Sack Flyer (2)", img: "/images/event-flyers/Action%20Sack%20Flyer%20%282%29.jpg" },
 { title: "Action Sack Flyer", img: "/images/event-flyers/Action%20Sack%20Flyer.jpg" },
 { title: "Action Sack in the Trap", img: "/images/event-flyers/Action%20Sack%20in%20the%20Trap.jpg" },
 { title: "Action Sack Lineup", img: "/images/event-flyers/Action%20Sack%20Lineup.jpg" },
 { title: "Action Sack pt. 4 (artist cover flyer)", img: "/images/event-flyers/Action%20Sack%20pt.%204%20%28artist%20cover%20flyer%29.jpg" },
 { title: "Action Sack pt. 4 (artist flyer)", img: "/images/event-flyers/Action%20Sack%20pt.%204%20%28artist%20flyer%29.jpg" },
 { title: "Action Sack Vol 6 event banner (names)", img: "/images/event-flyers/Action%20Sack%20Vol%206%20event%20banner%20%28names%29.jpg" },
 { title: "Action Sack vol. 3", img: "/images/event-flyers/Action%20Sack%20vol.%203.jpg" },
 { title: "Action Sack vol. 7", img: "/images/event-flyers/Action%20Sack%20vol.%207.jpg" },
 { title: "Action Sack vol.2 artist flyer", img: "/images/event-flyers/Action%20Sack%20vol.2%20artist%20flyer.jpg" },
 { title: "B.Y.O.C. flyer 2", img: "/images/event-flyers/B.Y.O.C.%20flyer%202.jpg" },
 { title: "B.Y.O.C. flyer", img: "/images/event-flyers/B.Y.O.C.%20flyer.jpg" },
 { title: "BOW 3 FLyer (Square)", img: "/images/event-flyers/BOW%203%20FLyer%20%28Square%29.jpg" },
 { title: "BPRS Flyer (square)", img: "/images/event-flyers/BPRS%20Flyer%20%28square%29.jpg" },
 { title: "BPRS Flyer2 (square)", img: "/images/event-flyers/BPRS%20Flyer2%20%28square%29.jpg" },
 { title: "C.O. Reloaded Vol. 1 Flyer", img: "/images/event-flyers/C.O.%20Reloaded%20Vol.%201%20Flyer.jpg" },
 { title: "C.O. Reloaded Vol. 2 flyer", img: "/images/event-flyers/C.O.%20Reloaded%20Vol.%202%20flyer.jpg" },
 { title: "C.O. Reloaded Vol. 3 flyer", img: "/images/event-flyers/C.O.%20Reloaded%20Vol.%203%20flyer.jpg" },
 { title: "C.O. Reloaded Vol. 4 flyer", img: "/images/event-flyers/C.O.%20Reloaded%20Vol.%204%20flyer.jpg" },
 { title: "C.O. Reloaded Vol. 5 flyer copy", img: "/images/event-flyers/C.O.%20Reloaded%20Vol.%205%20flyer%20copy.jpg" },
 { title: "C.O. vol 4 (square)", img: "/images/event-flyers/C.O.%20vol%204%20%28square%29.jpg" },
 { title: "C.O. vol 5 (square)", img: "/images/event-flyers/C.O.%20vol%205%20%28square%29.jpg" },
 { title: "C.O. vol 6 (square)", img: "/images/event-flyers/C.O.%20vol%206%20%28square%29.jpg" },
 { title: "C.O. vol 7 (square) - Copy", img: "/images/event-flyers/C.O.%20vol%207%20%28square%29%20-%20Copy.jpg" },
 { title: "C.O. vol. 2 (S2)", img: "/images/event-flyers/C.O.%20vol.%202%20%28S2%29.jpg" },
 { title: "C.O. vol. 3 (S2)(flyer)", img: "/images/event-flyers/C.O.%20vol.%203%20%28S2%29%28flyer%29.jpg" },
 { title: "C.O. Vol. 6 IG flyer", img: "/images/event-flyers/C.O.%20Vol.%206%20IG%20flyer.jpg" },
 { title: "Chronotopia Flyer (January)", img: "/images/event-flyers/Chronotopia%20Flyer%20%28January%29.jpg" },
 { title: "Chronotopia Flyer (March)", img: "/images/event-flyers/Chronotopia%20Flyer%20%28March%29.jpg" },
 { title: "Chronotopia Flyer", img: "/images/event-flyers/Chronotopia%20Flyer.jpg" },
 { title: "Common Unity (reloaded) Vol. 2 Street flyer", img: "/images/event-flyers/Common%20Unity%20%28reloaded%29%20Vol.%202%20Street%20flyer.jpg" },
 { title: "Common Unity Flyer", img: "/images/event-flyers/Common%20Unity%20Flyer.jpg" },
 { title: "Common Unity Reloaded Vol. 1. (Facebook)", img: "/images/event-flyers/Common%20Unity%20Reloaded%20Vol.%201.%20%28Facebook%29.jpg" },
 { title: "Common Unity Vol. II Flyer", img: "/images/event-flyers/Common%20Unity%20Vol.%20II%20Flyer.jpg" },
 { title: "Creative Cloud Event Flyer", img: "/images/event-flyers/Creative%20Cloud%20Event%20Flyer.jpg" },
 { title: "Creative Cloud Event vol. 2 Flyer", img: "/images/event-flyers/Creative%20Cloud%20Event%20vol.%202%20Flyer.jpg" },
 { title: "Creative Cloud Flyer", img: "/images/event-flyers/Creative%20Cloud%20Flyer.jpg" },
 { title: "Creative Cloud Vol. 2 Flyer", img: "/images/event-flyers/Creative%20Cloud%20Vol.%202%20Flyer.jpg" },
 { title: "Creative Cloud Vol. 3 Flyer", img: "/images/event-flyers/Creative%20Cloud%20Vol.%203%20Flyer.jpg" },
 { title: "Creative Cloud Vol. 4 flyer 2", img: "/images/event-flyers/Creative%20Cloud%20Vol.%204%20flyer%202.jpg" },
 { title: "Creative Cloud Vol. 4 flyer", img: "/images/event-flyers/Creative%20Cloud%20Vol.%204%20flyer.jpg" },
 { title: "Creative Oasis flyer", img: "/images/event-flyers/Creative%20Oasis%20flyer.jpg" },
 { title: "D.I.Chi. Open Call Flyer", img: "/images/event-flyers/D.I.Chi.%20Open%20Call%20Flyer.jpg" },
 { title: "dark arts flyer", img: "/images/event-flyers/dark%20arts%20flyer.jpg" },
 { title: "First Friday (September)", img: "/images/event-flyers/First%20Friday%20%28September%29.jpg" },
 { title: "Frequinox Event Flyer", img: "/images/event-flyers/Frequinox%20Event%20Flyer.jpg" },
 { title: "Frequinox Flyer vol. 2", img: "/images/event-flyers/Frequinox%20Flyer%20vol.%202.jpg" },
 { title: "Frequinox Flyer vol. 3 flyer", img: "/images/event-flyers/Frequinox%20Flyer%20vol.%203%20flyer.jpg" },
 { title: "Frequinox Flyer vol. 4 flyer", img: "/images/event-flyers/Frequinox%20Flyer%20vol.%204%20flyer.jpg" },
 { title: "Frequinox Reloaded Vol. 1 flyer (square)", img: "/images/event-flyers/Frequinox%20Reloaded%20Vol.%201%20flyer%20%28square%29.jpg" },
 { title: "Local Love event flyer (facebook)", img: "/images/event-flyers/Local%20Love%20event%20flyer%20%28facebook%29.jpg" },
 { title: "Local Love event flyer (names)", img: "/images/event-flyers/Local%20Love%20event%20flyer%20%28names%29.jpg" },
 { title: "Local Love Reloaded (1)", img: "/images/event-flyers/Local%20Love%20Reloaded%20%281%29.jpg" },
 { title: "Local Love Vol. 2", img: "/images/event-flyers/Local%20Love%20Vol.%202.jpg" },
 { title: "Local Love Vol. 3", img: "/images/event-flyers/Local%20Love%20Vol.%203.jpg" },
 { title: "Local Love vol. 4", img: "/images/event-flyers/Local%20Love%20vol.%204.jpg" },
 { title: "Local Love Vol. 5", img: "/images/event-flyers/Local%20Love%20Vol.%205.jpg" },
 { title: "Local Love Vol. 6 flyer", img: "/images/event-flyers/Local%20Love%20Vol.%206%20flyer.jpg" },
 { title: "Secret Stash (Event)", img: "/images/event-flyers/Secret%20Stash%20%28Event%29.jpg" },
 { title: "SSTR1 Flyer", img: "/images/event-flyers/SSTR1%20Flyer.jpg" },
 { title: "Untitled-1", img: "/images/event-flyers/Untitled-1.jpg" },
 { title: "Vibrant Vibes Event Flyer", img: "/images/event-flyers/Vibrant%20Vibes%20Event%20Flyer.jpg" },
 { title: "Vibrant Vibes Reloaded (flyer)", img: "/images/event-flyers/Vibrant%20Vibes%20Reloaded%20%28flyer%29.jpg" },
 { title: "Vibrant Vibes Reloaded vol. 2(flyer)", img: "/images/event-flyers/Vibrant%20Vibes%20Reloaded%20vol.%202%28flyer%29.jpg" },
 { title: "Vibrant Vibes Reloaded vol. 2(square)", img: "/images/event-flyers/Vibrant%20Vibes%20Reloaded%20vol.%202%28square%29.jpg" },
 { title: "Vibrant Vibes Reloaded vol. 3 (flyer)", img: "/images/event-flyers/Vibrant%20Vibes%20Reloaded%20vol.%203%20%28flyer%29.jpg" },
 { title: "Vibrant Vibes Vol. 2", img: "/images/event-flyers/Vibrant%20Vibes%20Vol.%202.jpg" },
 { title: "Vibrant Vibes Vol. 3", img: "/images/event-flyers/Vibrant%20Vibes%20Vol.%203.jpg" },
];

const FLIP_SPEED = 450;

function videoThumb(videoPath: string): string {
 const name = videoPath.split("/").pop()?.replace(/\.mp4$/, "") || "";
 const safe = name.replace(/[^a-zA-Z0-9]/g, "_");
 return `/images/event-thumbnails/${safe}.jpg`;
}

function extractColor(canvas: HTMLCanvasElement, video: HTMLVideoElement): string {
 const ctx = canvas.getContext("2d");
 if (!ctx) return "#DF3131";
 canvas.width = 64;
 canvas.height = 36;
 ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
 const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
 let r = 0, g = 0, b = 0, count = 0;
 for (let i = 0; i < data.length; i += 16) {
 r += data[i];
 g += data[i + 1];
 b += data[i + 2];
 count++;
 }
 r = Math.round(r / count);
 g = Math.round(g / count);
 b = Math.round(b / count);
 return `rgb(${r},${g},${b})`;
}

/* ═══ GLOBAL VIDEO MUTE CONTEXT ═══ */
interface VideoMuteCtx {
 activeVideoId: string | null;
 toggleVideo: (id: string) => void;
 muteAll: () => void;
}
const VideoMuteContext = createContext<VideoMuteCtx>({ activeVideoId: null, toggleVideo: () => {}, muteAll: () => {} });

function VideoMuteProvider({ children }: { children: React.ReactNode }) {
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

function VideoModal({ video, title, onClose }: { video: string; title: string; onClose: () => void }) {
 const videoRef = useRef<HTMLVideoElement>(null);
 const { activeVideoId, toggleVideo, muteAll } = useContext(VideoMuteContext);
 const isMuted = activeVideoId !== "modal";

 useEffect(() => { muteAll(); return () => muteAll(); }, [muteAll]);

  useEffect(() => {
   const vid = videoRef.current;
   if (vid) { vid.muted = true; vid.play().catch(() => {}); }
   const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
  document.addEventListener("keydown", handleKey);
  document.body.style.overflow = "hidden";
  return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
 }, [onClose]);

 useEffect(() => { const vid = videoRef.current; if (vid) vid.muted = isMuted; }, [isMuted]);

 return (
 <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
 <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Close">
 <FiX className="w-5 h-5 text-white" />
 </button>
 <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
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

function ColorAuraVideo({ items, onPlay }: { items: { title: string; video: string }[]; onPlay?: (item: { title: string; video: string }) => void }) {
  const [current, setCurrent] = useState(() => Math.floor(Math.random() * items.length));
 const [flipping, setFlipping] = useState(false);
 const [direction, setDirection] = useState(0);
 const [auraColor, setAuraColor] = useState("#DF3131");
 const videoRef = useRef<HTMLVideoElement>(null);
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const colorSampleRef = useRef<NodeJS.Timeout | null>(null);
 const { activeVideoId, toggleVideo } = useContext(VideoMuteContext);
 const isMuted = activeVideoId !== "aura";

 const flip = useCallback((dir: 1 | -1) => {
 if (flipping) return;
 setDirection(dir);
 setFlipping(true);
 setTimeout(() => {
 setCurrent((prev) => (prev + dir + items.length) % items.length);
 setFlipping(false);
 }, FLIP_SPEED / 2);
 }, [flipping, items.length]);

 const swipe = useSwipe(() => flip(1), () => flip(-1));

 useEffect(() => {
 const vid = videoRef.current;
 if (vid && !flipping) {
 vid.load();
 vid.muted = isMuted;
 vid.volume = 0;
 vid.play().then(() => {
 if (!isMuted) {
 let v = 0;
 const ramp = setInterval(() => {
 v = Math.min(v + 0.1, 0.3);
 if (videoRef.current) videoRef.current.volume = v;
 if (v >= 1) clearInterval(ramp);
 }, 75);
 }
 }).catch(() => {});
 }
 }, [current, flipping]);

  useEffect(() => {
  const vid = videoRef.current;
  if (!vid) return;
  vid.muted = isMuted;
  if (!isMuted) {
   let v = 0;
   vid.volume = 0;
   if (vid.paused) vid.play().catch(() => {});
   const ramp = setInterval(() => {
    v = Math.min(v + 0.1, 0.3);
    if (videoRef.current) videoRef.current.volume = v;
    if (v >= 0.3) clearInterval(ramp);
   }, 75);
  }
  }, [isMuted]);

 useEffect(() => {
 const vid = videoRef.current;
 const canvas = canvasRef.current;
 if (!vid || !canvas) return;
 const sample = () => {
 if (vid.readyState >= 2) {
 setAuraColor(extractColor(canvas, vid));
 }
 };
 vid.addEventListener("loadeddata", sample);
 colorSampleRef.current = setInterval(sample, 2000);
 return () => {
 vid.removeEventListener("loadeddata", sample);
 if (colorSampleRef.current) clearInterval(colorSampleRef.current);
 };
 }, [current]);

 const rotateY = flipping ? (direction === 1 ? -90 : 90) : 0;

 return (
 <div className="relative max-w-4xl mx-auto">
 <canvas ref={canvasRef} className="hidden" />
 <div className="relative mx-auto" style={{ perspective: "1200px" }}>
 <div
 className="relative w-full aspect-video bg-[#1a1a1a] dark:bg-[#111] overflow-hidden cursor-pointer rounded-lg"
 style={{
 transform: `rotateY(${rotateY}deg)`,
 transition: flipping ? `transform ${FLIP_SPEED / 2}ms ease-in` : `transform ${FLIP_SPEED / 2}ms ease-out`,
 transformStyle: "preserve-3d",
 boxShadow: `0 0 60px 20px ${auraColor}44, 0 0 120px 40px ${auraColor}22`,
 background: `linear-gradient(135deg, ${auraColor}22 0%, #1a1a1a 100%)`,
 }}
 onClick={() => onPlay ? onPlay(items[current]) : flip(1)}
 {...swipe}
 >
 {!flipping && (
 <video
 ref={videoRef}
 src={items[current].video}
 poster={videoThumb(items[current].video)}
 muted={isMuted}
 playsInline
 preload="metadata"
 className="w-full h-full object-cover"
 onEnded={() => { if (!flipping) flip(1); }}
 />
 )}
 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
 <button
 onClick={(e) => { e.stopPropagation(); toggleVideo("aura"); }}
 className="absolute bottom-4 right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-all duration-200"
 aria-label={isMuted ? 'Unmute' : 'Mute'}
 >
 {isMuted ? SPEAKER_MUTED_SVG : SPEAKER_ON_SVG}
 </button>
 <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
 <h3 className="font-heading font-bold text-white text-lg sm:text-2xl tracking-[0.05em] mb-3">
 {items[current].title}
 </h3>
 <p className="text-white/60 text-sm mt-1">{current + 1} / {items.length}</p>
 </div>
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
 {!flipping && (
 <div className="w-16 h-16 rounded-full bg-[#DF3131]/70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
 <FiPlay className="w-7 h-7 text-white ml-1" />
 </div>
 )}
 </div>
 </div>
 </div>
 <button
 onClick={() => flip(-1)}
 className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-4 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/80 text-[#333] hover:bg-[#DF3131] hover:text-white transition-all shadow-lg rounded-full"
 >
 <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
 </button>
 <button
 onClick={() => flip(1)}
 className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-4 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/80 text-[#333] hover:bg-[#DF3131] hover:text-white transition-all shadow-lg rounded-full"
 >
 <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
 </button>
 </div>
 );
}

const ITEMS_PER_PAGE = 24;

function VideoCarousel({ items, onPlay }: { items: { title: string; video: string }[]; onPlay?: (item: { title: string; video: string }) => void }) {
 const trackRef = useRef<HTMLDivElement>(null);
 const offsetRef = useRef(0);
 const paused = useRef(false);
 const secRef = useRef<HTMLDivElement>(null);
 const touchStartX = useRef<number | null>(null);
 const { activeVideoId, toggleVideo } = useContext(VideoMuteContext);

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
 const half = el.scrollWidth / 2;
 if (Math.abs(offsetRef.current) >= half) offsetRef.current += half;
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

  const [doubled, setDoubled] = useState(() => [...items, ...items]);

  useEffect(() => {
    const d = [...items, ...items];
    for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
    setDoubled(d);
  }, [items]);

 return (
 <div ref={secRef} className="relative group/carousel"
 onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }}
 onTouchStart={() => { paused.current = true; }} onTouchEnd={() => { setTimeout(() => { paused.current = false; }, 2000); }}>
 <button onClick={() => scroll(1)}
 className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/70 text-gray-600 hover:bg-[#DF3131] hover:text-white transition-all min-w-[44px] min-h-[44px]"
 style={{ backdropFilter: "blur(4px)" }}>
 <FiChevronLeft className="w-5 h-5" />
 </button>
 <button onClick={() => scroll(-1)}
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
  {doubled.map((v, i) => (
  <div key={i} className="flex-none w-[42vw] sm:w-48 md:w-56 group cursor-pointer hover-lift" onClick={() => onPlay?.(v)}>
 <div className="relative overflow-hidden aspect-[4/3] bg-[#1a1a1a]">
 <video
 src={v.video}
 poster={videoThumb(v.video)}
 muted
 preload="metadata"
 data-video-id={v.title}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
 ref={(el) => { if (el) { el.volume = 0.3; } }}
 onMouseEnter={(e) => { const vid = e.target as HTMLVideoElement; vid.play().catch(() => {}); }}
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

 function YouTubeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);

  const ytPath = "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z";

  const ytRows = [
    { color: "#FF0000" },
    { color: "#FFFFFF" },
    { color: "#FF1A1A" },
    { color: "#CC0000" },
    { color: "#FF4D4D" },
    { color: "#FF8080" },
  ];

  const LogoItem = ({ color, idx }: { color: string; idx: number }) => {
    const dist = Math.sqrt(
      Math.pow((idx % 8) / 7 - mousePos.x, 2) +
      Math.pow(Math.floor(idx / 8) / 5 - mousePos.y, 2)
    );
    const proximity = isHovering ? Math.max(0, 1 - dist * 1.5) : 0;
    const glow = proximity * 0.6;

    return (
      <div
        className="flex-none flex items-center gap-2 px-6 py-3 transition-all duration-300"
        style={{
          opacity: isHovering ? 0.2 + proximity * 0.8 : undefined,
          filter: glow > 0 ? `drop-shadow(0 0 ${8 * glow}px ${color}) brightness(${1 + glow * 0.5})` : undefined,
          transform: isHovering && proximity > 0.3 ? `scale(${1 + proximity * 0.15})` : undefined,
        }}
      >
        <svg className="w-10 h-10 sm:w-12 sm:h-12" fill={color} viewBox="0 0 24 24"><path d={ytPath}/></svg>
      </div>
    );
  };

  const buildRow = (arr: typeof ytRows, times: number) => Array.from({ length: times }, () => arr).flat();

  return (
  <div
    ref={sectionRef}
    className="relative overflow-hidden bg-[#0a0a0a]"
    onMouseMove={(e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    }}
    onMouseEnter={() => setIsHovering(true)}
    onMouseLeave={() => setIsHovering(false)}
  >
  <div className="absolute inset-0 z-0">
  <div className="absolute top-0 left-0 w-full h-full bg-black/90" />
  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF0000]/15 via-transparent to-[#DF3131]/10" />
  <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#FF0000]/8 rounded-full blur-[100px]" />
  <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#DF3131]/8 rounded-full blur-[80px]" />
  </div>

  <div className="absolute inset-0 z-10 flex flex-col justify-center gap-6 opacity-40">
  <div className="overflow-hidden py-3">
    <div className="flex whitespace-nowrap animate-marquee-left">
      {buildRow(ytRows, 8).map((logo, i) => (<LogoItem key={`r1-${i}`} color={logo.color} idx={i} />))}
    </div>
  </div>
  <div className="overflow-hidden py-3">
    <div className="flex whitespace-nowrap animate-marquee-right">
      {buildRow([...ytRows].reverse(), 8).map((logo, i) => (<LogoItem key={`r2-${i}`} color={logo.color} idx={i + 48} />))}
    </div>
  </div>
  <div className="overflow-hidden py-3">
    <div className="flex whitespace-nowrap animate-marquee-left-fast">
      {buildRow(ytRows, 8).map((logo, i) => (<LogoItem key={`r3-${i}`} color={logo.color} idx={i + 96} />))}
    </div>
  </div>
  <div className="overflow-hidden py-3">
    <div className="flex whitespace-nowrap animate-marquee-right">
      {buildRow([...ytRows].reverse(), 8).map((logo, i) => (<LogoItem key={`r4-${i}`} color={logo.color} idx={i + 144} />))}
    </div>
  </div>
  <div className="overflow-hidden py-3">
    <div className="flex whitespace-nowrap animate-marquee-left">
      {buildRow(ytRows, 8).map((logo, i) => (<LogoItem key={`r5-${i}`} color={logo.color} idx={i + 192} />))}
    </div>
  </div>
  <div className="overflow-hidden py-3">
    <div className="flex whitespace-nowrap animate-marquee-right-fast">
      {buildRow([...ytRows].reverse(), 8).map((logo, i) => (<LogoItem key={`r6-${i}`} color={logo.color} idx={i + 240} />))}
    </div>
  </div>
  <div className="overflow-hidden py-3">
    <div className="flex whitespace-nowrap animate-marquee-left">
      {buildRow(ytRows, 8).map((logo, i) => (<LogoItem key={`r7-${i}`} color={logo.color} idx={i + 288} />))}
    </div>
  </div>
  <div className="overflow-hidden py-3">
    <div className="flex whitespace-nowrap animate-marquee-right">
      {buildRow([...ytRows].reverse(), 8).map((logo, i) => (<LogoItem key={`r8-${i}`} color={logo.color} idx={i + 336} />))}
    </div>
  </div>
  </div>

  <div className="absolute inset-0 bg-black/30 z-[15] pointer-events-none" />

 <div className="relative z-20 flex flex-col items-center justify-center py-20 sm:py-28 px-6 text-center">
 <div className="yt-float mb-8">
 <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FF0000] flex items-center justify-center yt-pulse shadow-lg shadow-[#FF0000]/40">
 <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d={ytPath}/></svg>
 </div>
 </div>
 <h2 className="text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3.5rem] font-heading font-black text-white tracking-[0.08em] leading-tight mb-4">
 SUBSCRIBE TO OUR<br />
 <span className="text-[#FF0000]">YOUTUBE</span>
 </h2>
  <p className="text-white/60 text-[16px] sm:text-[17px] max-w-lg leading-relaxed mb-8">
 Watch full event recaps, behind-the-scenes footage, live performances, and exclusive content from every WYZ Design event.
 </p>
  <div className="flex flex-row flex-wrap gap-4 items-center justify-center">
  <a href="https://www.youtube.com/@wyzdesign?sub_confirmation=1" target="_blank" rel="noopener noreferrer"
  className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 bg-[#FF0000] text-white font-heading font-bold tracking-[0.12em] text-[12px] sm:text-[15px] text-center hover:bg-[#CC0000] transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#FF0000]/30">
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49.1 3.59.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>
  SUBSCRIBE
  </a>
  <a href="https://www.youtube.com/playlist?list=PLJ_paMo7iTXEkVi_UWaIdeUzF0Ag-oURT" target="_blank" rel="noopener noreferrer"
  className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 bg-white text-[#111] border-2 border-white font-heading font-bold tracking-[0.12em] text-[12px] sm:text-[15px] text-center hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-all hover:scale-105">
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d={ytPath}/></svg>
  WATCH RECAPS
  </a>
  <a href="https://www.youtube.com/@wyzdesign" target="_blank" rel="noopener noreferrer"
  className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 bg-white text-[#111] border-2 border-white font-heading font-bold tracking-[0.12em] text-[12px] sm:text-[15px] text-center hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-all hover:scale-105">
  VISIT CHANNEL
  </a>
 </div>
 <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-12 mt-10 pt-8 border-t border-white/10">
 <div className="text-center">
 <p className="text-[1.5rem] sm:text-[2rem] font-heading font-black text-[#FF0000]">{CLIENT_EVENTS_RAW.length}+</p>
 <p className="text-[11px] sm:text-[12px] text-white/40 tracking-[0.15em] uppercase">Client Events</p>
 </div>
 <div className="text-center">
 <p className="text-[1.5rem] sm:text-[2rem] font-heading font-black text-[#FF0000]">{DIY_SHOWS_RAW.length}+</p>
 <p className="text-[11px] sm:text-[12px] text-white/40 tracking-[0.15em] uppercase">DIY Shows</p>
 </div>
 <div className="text-center">
 <p className="text-[1.5rem] sm:text-[2rem] font-heading font-black text-[#FF0000]">50+</p>
 <p className="text-[11px] sm:text-[12px] text-white/40 tracking-[0.15em] uppercase">Live Shows</p>
 </div>
 </div>
 </div>
 </div>
 );
}


export default function EventsPage() {
 const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
 const [modalVideo, setModalVideo] = useState<{ video: string; title: string } | null>(null);
 const shuffled = useMemo(() => [...ALL_EVENT_IMAGES].sort(() => Math.random() - 0.5), []);
 const visibleEvents = shuffled.slice(0, visibleCount);
 const hasMore = visibleCount < shuffled.length;

 const shuffledClientEvents = useShuffle(CLIENT_EVENTS_RAW);
 const shuffledDiYShows = useShuffle(DIY_SHOWS_RAW);

 return (
  <VideoMuteProvider>
  <main className="pb-12 bg-white dark:bg-[#232326]">
 <style>{`
 .hover-lift{transition:transform .3s ease,box-shadow .3s ease}
 .hover-lift:hover{transform:translateY(-4px);box-shadow:0 12px 24px rgba(0,0,0,.1)}
 @keyframes ytPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,0,0,.4)}50%{box-shadow:0 0 0 20px rgba(255,0,0,0)}}
 .yt-pulse{animation:ytPulse 2s infinite}
 @keyframes ytFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
 .yt-float{animation:ytFloat 4s ease-in-out infinite}
 .ev-section{contain:layout style}
 .ev-video-card{contain:layout style paint}
 .ev-canvas-wrap{contain:layout size style}
 `}</style>

{/* ═══ 1. HERO ═══ */}
  <ScrollReveal animation="fadeIn" duration={1.2}>
  <div className="relative overflow-hidden mx-0 hero-banner">
  <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[75vh]">
  <div className="relative overflow-hidden bg-white dark:bg-[#111]">
  <Image src="/images/events/hero_bg.jpg" alt="Events" fill className="w-full h-full object-cover opacity-80" priority />
  <div className="absolute inset-0 bg-black/30" />
    </div>
    <div className="relative flex flex-col items-center justify-center h-full px-4 sm:px-10 lg:px-16 text-center py-10 lg:pt-32 lg:pb-0 overflow-hidden">
    <div className="absolute inset-0 hero-grad-events z-0" />
    <div className="absolute inset-0 bg-black/20 z-[1]" />
    <div className="relative z-10">
     <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-white tracking-[0.08em] mb-3 sm:mb-6" style={{ lineHeight: 1 }}>
   <span><TextSplit stagger={0.03} direction="up">SIMPLIFY YOUR</TextSplit></span> <span className="text-[#DF3131]"><TextSplit stagger={0.03} direction="up">EVENT</TextSplit></span> <span><TextSplit stagger={0.03} direction="up">PLANNING</TextSplit></span>
  </h1>
  <p className="text-[16px] sm:text-[16px] lg:text-[17px] text-white/70 max-w-md leading-relaxed mb-3 sm:mb-3 mx-auto">
  Let our team handle the planning, from the first idea to the final encore. You&apos;ll get an event that&apos;s easy, stress-free, and unforgettable.
  </p>
  <Link href="/booking" className="inline-block px-6 sm:px-10 py-3 sm:py-4 bg-white text-[#111] border-2 border-white text-[12px] sm:text-[15px] font-bold tracking-[0.12em] text-center hover:bg-[#DF3131] hover:text-white hover:border-[#DF3131] transition-all">
  BOOK NOW
  </Link>
  </div>
  </div>
  </div>
  </div>
  </ScrollReveal>

{/* ═══ EVENTS MARQUEE ═══ */}
  <EnhancedMarquee speed="normal" pauseOnHover gradientFade className="py-3 bg-white dark:bg-[#232326]">
    {(["CONCERTS","DIY SHOWS","MIXERS","ART SHOWS","RECAPS","LIVE COVERAGE"] as const).map((word, i) => {
      const M = ["text-[#DF3131]", "text-[#111] dark:text-white", "marquee-outline", "text-[#6E6E6E] dark:text-[#8F8F8F]"];
      return (
        <>
          <span key={`w-${i}`} className={`inline-flex items-center text-[1.25rem] sm:text-[1.75rem] font-heading font-black tracking-[0.08em] uppercase px-4 sm:px-6 ${M[(i + 1) % 4]}`}>{word}</span>
          <span key={`b-${i}`} className="inline-flex items-center text-[1.25rem] sm:text-[1.75rem] font-heading font-black tracking-[0.08em] uppercase px-4 sm:px-6 opacity-50 text-[#111] dark:text-white">&bull;</span>
        </>
      );
    })}
  </EnhancedMarquee>

{/* ═══ 2. Sign-Up ═══ */}
 <ScrollReveal animation="foldDown" duration={1.0}>
 <div className="relative overflow-hidden bg-black">
   <Image src="/concert-crowd.jpg" alt="Concert Crowd" fill className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.7 }} priority />
   <div className="absolute inset-0 bg-black/30 z-[1]" />
 <div className="relative z-10 flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6 text-center">
 <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[3rem] xl:text-[4rem] font-heading font-black text-white tracking-[0.08em] leading-tight mb-4">
 SIGN-UP FOR<br />
 <span className="text-[#DF3131]">FUTURE</span> EVENTS
 </h2>
 <p className="text-white/80 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed mb-4">
 Stay up to date with all our future DIY music events and art shows.
 </p>
 <Link href="/booking" className="inline-block px-8 sm:px-14 py-3 sm:py-5 bg-[#DF3131] text-white text-base sm:text-xl font-bold tracking-[0.12em] hover:bg-white hover:text-[#111] transition-all">
 STAY IN THE LOOP
 </Link>
 </div>
 </div>
 </ScrollReveal>

 {/* ═══ 3. DIY Shows Carousel ═══ */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <div className="mt-12 mb-6 max-w-[130rem] mx-auto px-6 lg:px-12">
 <div className="text-center mb-4">
  <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.08em] mb-4">DIY SHOWS</h2>
 </div>
 </div>
 <VideoCarousel items={shuffledDiYShows} onPlay={(v) => setModalVideo(v)} />
 </ScrollReveal>

  {/* ═══ 4. Autoplay Video Playlist (between recaps & clients) ═══ */}
  <ScrollReveal animation="fadeUp" delay={0.1}>
  <div className="mb-12 max-w-[130rem] mx-auto px-6 lg:px-12">
  <ColorAuraVideo items={shuffledDiYShows} onPlay={(v) => setModalVideo(v)} />
  </div>
  </ScrollReveal>

  {/* ═══ 5. Client Events Carousel ═══ */}
  <ScrollReveal animation="fadeUp" delay={0.1}>
  <div className="mb-12 max-w-[130rem] mx-auto px-6 lg:px-12">
  <div className="text-center mb-4">
   <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.08em] mb-4">CLIENT EVENTS</h2>
  </div>
  </div>
  <VideoCarousel items={shuffledClientEvents} onPlay={(v) => setModalVideo(v)} />
  </ScrollReveal>

  {/* ═══ 6. YouTube Section ═══ */}
  <ScrollReveal animation="fadeUp" delay={0.1}>
  <div className="mb-12">
  <YouTubeSection />
  </div>
  </ScrollReveal>

 <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
 {/* ═══ 7. Previous Events ═══ */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <div>
 <div className="text-center mb-4">
  <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.08em] mb-4">PREVIOUS EVENTS</h2>
  <p className="text-[16px] text-[#8F8F8F] dark:text-[#b0b0b0] mt-2 tracking-wider">ALL FLYERS/EVENTS DESIGNED BY WYZ DESIGN</p>
 </div>
 <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2">
 {visibleEvents.map((e) => (
  <div key={e.title} className="group cursor-pointer relative overflow-hidden bg-[#f5f5f5] dark:bg-[#2b2b2e] mb-2 break-inside-avoid">
  <Image src={e.img} alt={e.title} width={400} height={300} className="w-full h-full object-cover group-hover:scale-95 transition-transform duration-500" loading="lazy"
  onError={(ev) => { (ev.target as HTMLImageElement).style.display = 'none'; }} />
 </div>
 ))}
 </div>
 {hasMore && (
 <div className="text-center mt-8">
 <button
 onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
  className="px-6 py-3 bg-[#333] text-white dark:bg-white dark:text-[#111] border-2 border-[#333] dark:border-white text-[16px] font-bold tracking-[0.12em] hover:bg-[#DF3131] hover:text-white hover:border-[#DF3131] dark:hover:bg-[#DF3131] dark:hover:text-white dark:hover:border-[#DF3131] transition-all"
 >
  LOAD MORE +{shuffled.length - visibleCount}
 </button>
 </div>
 )}
 </div>
 </ScrollReveal>
 </div>
 {modalVideo && <VideoModal video={modalVideo.video} title={modalVideo.title} onClose={() => setModalVideo(null)} />}
 </main>
 </VideoMuteProvider>
 );
}
