"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCamera, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ScrollReveal from "@/components/ScrollReveal";
import { useSwipe } from "@/hooks/useSwipe";

function shuffleArray<T>(arr: T[]): T[] {
 const a = [...arr];
 for (let i = a.length - 1; i > 0; i--) {
 const j = Math.floor(Math.random() * (i + 1));
 [a[i], a[j]] = [a[j], a[i]];
 }
 return a;
}

const ALBUMS = ["Events", "Outdoors", "Studio", "Boudoir", "Bodypaint", "Urbex", "Products", "Conceptual"];
const ALBUM_DESC: Record<string, string> = {
 Events: "Live event coverage, concerts, showcases, and private functions.",
 Outdoors: "Natural light sessions in urban and rural environments.",
 Studio: "Controlled lighting for portraits, headshots, and creative work.",
 Boudoir: "Intimate, empowering portrait sessions.",
 Bodypaint: "Body art captured through the lens.",
 Urbex: "Exploring abandoned spaces through photography.",
 Products: "Professional product shots for brands and e-commerce.",
 Conceptual: "Art-driven editorial and conceptual photo work.",
};
const ALBUM_COVERS_STATIC: Record<string, string> = {
 Events: "/images/photography-categories/Events.jpg",
 Outdoors: "/images/photography-categories/Outdoors.jpg",
 Studio: "/images/photography-categories/Studio.JPG",
 Boudoir: "/images/photography-categories/Boudoir.jpg",
 Bodypaint: "/images/photography-categories/Bodypaint.jpg",
 Urbex: "/images/photography-categories/URBEX.jpg",
 Products: "/images/photography-categories/Products.jpg",
   Conceptual: "/images/photography-categories/Conceptual.JPG",
};

function useInView(threshold = 0.1) {
 const ref = useRef<HTMLDivElement>(null);
 const [vis, setVis] = useState(false);
 useEffect(() => {
 const el = ref.current;
 if (!el) return;
 const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect(); } }, { threshold });
 o.observe(el);
 return () => o.disconnect();
 }, [threshold]);
 return { ref, vis };
}

function Lightbox({ images, index, onClose, onPrev, onNext, album }: {
 images: string[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void; album?: string;
}) {
 const swipe = useSwipe(onNext, onPrev);
 const hk = useCallback((e: KeyboardEvent) => {
 if (e.key === "Escape") onClose();
 if (e.key === "ArrowLeft") onPrev();
 if (e.key === "ArrowRight") onNext();
 }, [onClose, onPrev, onNext]);
 useEffect(() => {
 document.addEventListener("keydown", hk);
 document.body.style.overflow = "hidden";
 return () => { document.removeEventListener("keydown", hk); document.body.style.overflow = ""; };
 }, [hk]);
 if (!images.length) return null;
 return (
 <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center" onClick={onClose} {...swipe}>
 <button onClick={onClose} className="absolute top-4 right-4 z-[210] text-white/70 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><FiX className="w-8 h-8" /></button>
 <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-[210] w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors min-w-[44px] min-h-[44px]"><FiChevronLeft className="w-6 h-6" /></button>
 <div className="max-w-[90vw] max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
  <Image src={images[index]} alt={album ? `${album} photo` : "Gallery photo"} width={1200} height={800} className="max-w-full max-h-[85vh] object-contain select-none" loading="lazy" />
 </div>
 <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-[210] w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors min-w-[44px] min-h-[44px]"><FiChevronRight className="w-6 h-6" /></button>
 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-mono">{index + 1} / {images.length}</div>
 </div>
 );
}

function AlbumModal({ album, onClose }: { album: string; onClose: () => void }) {
 const [imgs, setImgs] = useState<string[]>([]);
 const [lIdx, setLIdx] = useState<number | null>(null);
 useEffect(() => { fetch(`/api/album-images?album=${encodeURIComponent(album)}`).then(r => r.json()).then(d => setImgs(d.images || [])).catch(() => {}); }, [album]);
 return (
 <>
 <div className="fixed inset-0 z-[150] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
 <div className="bg-white max-w-5xl w-full max-h-[85vh] overflow-y-auto rounded-lg" onClick={e => e.stopPropagation()}>
 <div className="sticky top-0 bg-white border-b border-[#E2E2E2] px-6 py-4 flex items-center justify-between z-10">
 <h3 className="font-heading font-bold text-[#333] text-lg tracking-[0.05em] uppercase">{album}</h3>
 <button onClick={onClose} className="text-[#8F8F8F] hover:text-[#333] transition-colors"><FiX className="w-6 h-6" /></button>
 </div>
 <div className="p-6">
 {imgs.length === 0 ? (
 <div className="text-center py-12"><FiCamera className="w-12 h-12 text-[#CBCBCA] mx-auto mb-4" /><p className="text-[#8F8F8F]">No images in this album yet.</p></div>
 ) : (
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
 {imgs.map((img, i) => (
 <button key={i} onClick={() => setLIdx(i)} className="aspect-square relative bg-gray-100 overflow-hidden hover:ring-2 hover:ring-[#DF3131] transition-all cursor-pointer group">
  <Image src={img} alt={`${album}`} fill className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" priority />
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

function AutoScrollRow({ items, speed = 0.8, className = "" }: { items: string[]; speed?: number; className?: string }) {
 const trackRef = useRef<HTMLDivElement>(null);
 const offsetRef = useRef(0);
 const paused = useRef(false);
 const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (typeof window !== 'undefined') {
        window.location.href = '/photography';
      }
    };

 return (
 <div className={`overflow-hidden ${className}`}>
 <div ref={trackRef} className="flex flex-nowrap gap-4 py-2 will-change-transform">
  {[...items, ...items].map((src, i) => (
  <div key={i} className="flex-none w-[28vw] sm:w-[200px] md:w-[280px] h-32 sm:h-48 md:h-64 relative overflow-hidden cursor-pointer group" onClick={handleClick}>
  <Image src={src} alt="Photography portfolio" fill className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" loading="lazy" />
  </div>
  ))}
 </div>
 </div>
 );
}

 function PhotoFlipCard({ s }: { s: { name: string; price: string; dur: string; cat: string; desc: string; bookLink: string; img: string } }) {
  const [flipped, setFlipped] = useState(false);

  return (
  <div className="group relative cursor-pointer" style={{ perspective: "1200px", minHeight: "480px" }}
  onClick={() => setFlipped(f => !f)}
  onMouseEnter={() => setFlipped(true)}
  onMouseLeave={() => setFlipped(false)}>
  {/* Front */}
  <div className="absolute inset-0 transition-all duration-700 ease-in-out" style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)" }}>
  <div className="bg-white dark:bg-[#252528] overflow-hidden border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#DF3131]/10 hover:-translate-y-1 h-full">
  <div className="aspect-[4/3] overflow-hidden relative">
  <Image src={s.img} alt={s.name} fill className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" priority />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
  <div className="absolute top-3 right-3 bg-[#DF3131] text-white px-3 py-1 text-[14px] font-bold tracking-wider">{s.price}</div>
  <div className="absolute bottom-3 left-3 text-white/90 text-[13px] font-mono bg-black/40 px-2 py-0.5 rounded">{s.dur}</div>
  </div>
  <div className="p-5">
  <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#DF3131]">{s.cat}</span>
  <h3 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[18px] tracking-[0.03em] mt-1 mb-2 group-hover:text-[#DF3131] transition-colors">{s.name}</h3>
  <p className="text-[15px] text-[#666] dark:text-white/60 leading-relaxed line-clamp-2">{s.desc}</p>
  </div>
  </div>
  </div>
  {/* Back */}
  <div
  className="absolute inset-0 transition-all duration-700 ease-in-out"
  style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(0deg)" : "rotateY(180deg)" }}
  >
  <div className="w-full h-full bg-[#DF3131] text-white p-6 flex flex-col justify-between overflow-hidden relative">
  <div className="absolute inset-0 opacity-10">
   <Image src={s.img} alt={s.name} fill className="w-full h-full object-cover" priority />
  </div>
  <div className="relative z-10">
  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/70">{s.cat}</span>
  <h3 className="font-heading font-black text-white text-[22px] tracking-[0.03em] mt-1 mb-3">{s.name}</h3>
  <p className="text-white/80 text-[15px] leading-relaxed mb-4">{s.desc}</p>
  <div className="flex items-center gap-3 mb-4">
  <span className="text-[28px] font-black">{s.price}</span>
  <span className="text-white/60 text-[14px]">· {s.dur}</span>
  </div>
  </div>
  <div className="relative z-10 flex gap-2">
  <Link href={s.bookLink} className="flex-1 text-center py-3 bg-white text-[#DF3131] text-[14px] font-bold tracking-[0.08em] hover:bg-[#333] hover:text-white transition-all" onClick={(e) => e.stopPropagation()}>
  BOOK NOW
  </Link>
  <Link href="/plans" className="flex-1 text-center py-3 border-2 border-white text-white text-[14px] font-bold tracking-[0.08em] hover:bg-white hover:text-[#DF3131] transition-all" onClick={(e) => e.stopPropagation()}>
  VIEW PLANS
  </Link>
  </div>
  </div>
  </div>
  </div>
  );
 }

 export default function PhotographyPage() {
 const [activeAlbum, setActiveAlbum] = useState<string | null>(null);
  const [showModelForm, setShowModelForm] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);


 const { ref: hVis, vis: heroVisibleRaw } = useInView(0.1);
 const [heroVisible, setHeroVisible] = useState(false);
 useEffect(() => { if (heroVisibleRaw) setHeroVisible(true); const t = setTimeout(() => setHeroVisible(true), 1000); return () => clearTimeout(t); }, [heroVisibleRaw]);

 const { ref: aVis, vis: archiveVisRaw } = useInView(0.1);
 const [archiveVis, setArchiveVis] = useState(false);
 useEffect(() => { if (archiveVisRaw) setArchiveVis(true); const t = setTimeout(() => setArchiveVis(true), 1200); return () => clearTimeout(t); }, [archiveVisRaw]);

 const { ref: bVis, vis: bookVisRaw } = useInView(0.1);
 const [bookVis, setBookVis] = useState(false);
 useEffect(() => { if (bookVisRaw) setBookVis(true); const t = setTimeout(() => setBookVis(true), 1200); return () => clearTimeout(t); }, [bookVisRaw]);

 // Dynamic model photos from GDrive, best image per model
  const [modelPhotos, setModelPhotos] = useState<Array<{ model: string; imageUrl: string }>>([]);
  // Dynamic GDrive photos, deduplicated across all sections
 const [albumCovers, setAlbumCovers] = useState<Record<string, string>>(ALBUM_COVERS_STATIC);
 const [carousel1, setCarousel1] = useState<string[]>([]);
 const [carousel2, setCarousel2] = useState<string[]>([]);
 const [carousel3, setCarousel3] = useState<string[]>([]);

 const FEATURED_MODELS = useMemo(() => shuffleArray([
 { name: "ADRIENNE", cover: "/images/photography/carousel_3/wix_0283.jpg", title: "Signed Model" },
 { name: "CAMILLE", cover: "/images/photography/carousel_3/wix_0285.jpg", title: "Professional" },
 { name: "CRISTINA", cover: "/images/photography/carousel_3/wix_0287.jpg", title: "Experienced" },
 { name: "DANIELLE", cover: "/images/photography/carousel_3/wix_0289.jpg", title: "Rising Star" },
 { name: "STAR", cover: "/images/photography/carousel_3/wix_0291.jpg", title: "Featured" },
 { name: "SYDNEY", cover: "/images/photography/carousel_3/wix_0296.jpg", title: "New Face" },
 { name: "WOLF", cover: "/images/photography/carousel_3/wix_0298.jpg", title: "Editorial" },
 ]), []);
 const [modelIdx, setModelIdx] = useState(0);
 const [modelAutoPlay, setModelAutoPlay] = useState(true);
 const [applicationSubmitted, setApplicationSubmitted] = useState(false);

 useEffect(() => {
 // Fetch model best-per-model photos for FEATURED_MODELS carousel
 fetch("/api/model-photos?mode=best-per-model")
 .then((r) => r.json())
 .then((d) => setModelPhotos(d.photos || []))
 .catch(() => {});
 }, []);

 useEffect(() => {
 // Fetch category photos for album covers + carousels
 const cats = ALBUMS;
 const used = new Set<string>();
 const allCovers: Record<string, string> = {};
 const allCarousel: string[] = [];

 Promise.all(
 cats.map((cat) =>
 fetch(`/api/gdrive-photos?category=${cat.toLowerCase()}&per_page=20`)
 .then((r) => r.json())
 .then((d) => ({ cat, images: d.images || [] }))
 .catch(() => ({ cat, images: [] as string[] }))
 )
 ).then((results) => {
 for (const { cat, images } of results) {
 const fresh = images.find((img: string) => !used.has(img));
 if (fresh) {
 allCovers[cat] = fresh;
 used.add(fresh);
 } else {
 allCovers[cat] = ALBUM_COVERS_STATIC[cat];
 }
 }
 for (const { images } of results) {
 for (const img of images) {
 if (!used.has(img)) {
 allCarousel.push(img);
 used.add(img);
 }
 }
 }
 for (let i = allCarousel.length - 1; i > 0; i--) {
 const j = Math.floor(Math.random() * (i + 1));
 [allCarousel[i], allCarousel[j]] = [allCarousel[j], allCarousel[i]];
 }
 const mid = Math.ceil(allCarousel.length / 2);
 setCarousel1(shuffleArray(allCarousel.slice(0, mid)));
 setCarousel2(shuffleArray(allCarousel.slice(mid)));
 setAlbumCovers(allCovers);
 });
 }, []);

 useEffect(() => {
 if (!modelAutoPlay) return;
 const t = setInterval(() => setModelIdx(i => (i + 1) % FEATURED_MODELS.length), 2500);
 return () => clearInterval(t);
 }, [modelAutoPlay]);

 const CAROUSEL_IMAGES_1 = carousel1.length > 0 ? carousel1 : [
 "/images/photography/carousel_1/wix_0216.jpg",
 "/images/photography/carousel_1/wix_0166.jpg",
 "/images/photography/carousel_1/wix_0168.jpg",
 "/images/photography/carousel_1/wix_0169.jpg",
 "/images/photography/carousel_1/wix_0174.jpg",
 "/images/photography/carousel_1/wix_0176.jpg",
 "/images/photography/carousel_1/wix_0181.jpg",
 "/images/photography/carousel_1/wix_0184.jpg",
 "/images/photography/carousel_1/wix_0188.jpg",
 "/images/photography/carousel_1/wix_0192.jpg",
 "/images/photography/carousel_1/wix_0195.jpg",
 "/images/photography/carousel_1/wix_0198.jpg",
 "/images/photography/carousel_1/wix_0199.jpg",
 "/images/photography/carousel_1/wix_0200.jpg",
 "/images/photography/carousel_1/wix_0201.jpg",
 "/images/photography/carousel_1/wix_0203.jpg",
 "/images/photography/carousel_1/wix_0207.jpg",
 "/images/photography/carousel_1/wix_0210.jpg",
 "/images/photography/carousel_1/wix_0212.jpg",
 "/images/photography/carousel_1/wix_0213.jpg",
 "/images/photography/carousel_1/wix_0429.jpg",
 "/images/photography/carousel_1/wix_0431.jpg",
 "/images/photography/carousel_1/wix_0432.jpg",
 "/images/photography/carousel_1/wix_0434.jpg",
 "/images/photography/carousel_1/wix_0438.jpg",
 "/images/photography/carousel_1/wix_0440.jpg",
 "/images/photography/carousel_1/wix_0444.jpg",
 "/images/photography/carousel_1/wix_0445.jpg",
 "/images/photography/carousel_1/wix_0446.jpg",
 ];

 const CAROUSEL_IMAGES_2 = carousel2.length > 0 ? carousel2 : [
 "/images/photography/carousel_2/wix_0281.jpg",
 "/images/photography/carousel_2/wix_0219.jpg",
 "/images/photography/carousel_2/wix_0222.jpg",
 "/images/photography/carousel_2/wix_0224.jpg",
 "/images/photography/carousel_2/wix_0225.jpg",
 "/images/photography/carousel_2/wix_0227.jpg",
 "/images/photography/carousel_2/wix_0231.jpg",
 "/images/photography/carousel_2/wix_0234.jpg",
 "/images/photography/carousel_2/wix_0235.jpg",
 "/images/photography/carousel_2/wix_0240.jpg",
 "/images/photography/carousel_2/wix_0242.jpg",
 "/images/photography/carousel_2/wix_0243.jpg",
 "/images/photography/carousel_2/wix_0245.jpg",
 "/images/photography/carousel_2/wix_0257.jpg",
 "/images/photography/carousel_2/wix_0259.jpg",
 "/images/photography/carousel_2/wix_0261.jpg",
 "/images/photography/carousel_2/wix_0264.jpg",
 "/images/photography/carousel_2/wix_0266.jpg",
 "/images/photography/carousel_2/wix_0273.jpg",
 "/images/photography/carousel_2/wix_0278.jpg",
 "/images/photography/carousel_2/wix_0447.jpg",
 "/images/photography/carousel_2/wix_0448.jpg",
 "/images/photography/carousel_2/wix_0331.jpg",
 "/images/photography/carousel_2/wix_0333.jpg",
 "/images/photography/carousel_2/wix_0334.jpg",
 "/images/photography/carousel_2/wix_0338.jpg",
 "/images/photography/carousel_2/wix_0341.jpg",
 "/images/photography/carousel_2/wix_0348.jpg",
 "/images/photography/carousel_2/wix_0350.jpg",
 ];

 const CAROUSEL_IMAGES_3 = useMemo(() => shuffleArray([
 "/images/photography/carousel_3/wix_0329.jpg",
 "/images/photography/carousel_3/wix_0283.jpg",
 "/images/photography/carousel_3/wix_0285.jpg",
 "/images/photography/carousel_3/wix_0287.jpg",
 "/images/photography/carousel_3/wix_0289.jpg",
 "/images/photography/carousel_3/wix_0291.jpg",
 "/images/photography/carousel_3/wix_0294.jpg",
 "/images/photography/carousel_3/wix_0296.jpg",
 "/images/photography/carousel_3/wix_0298.jpg",
 "/images/photography/carousel_3/wix_0299.jpg",
 "/images/photography/carousel_3/wix_0303.jpg",
 "/images/photography/carousel_3/wix_0305.jpg",
 "/images/photography/carousel_3/wix_0308.jpg",
 "/images/photography/carousel_3/wix_0309.jpg",
 "/images/photography/carousel_3/wix_0311.jpg",
 "/images/photography/carousel_3/wix_0319.jpg",
 "/images/photography/carousel_3/wix_0321.jpg",
 "/images/photography/carousel_3/wix_0324.jpg",
 "/images/photography/carousel_3/wix_0326.jpg",
 "/images/photography/carousel_3/wix_0328.jpg",
 "/images/photography/carousel_3/wix_0352.jpg",
 "/images/photography/carousel_3/wix_0353.jpg",
 "/images/photography/carousel_3/wix_0355.jpg",
 "/images/photography/carousel_3/wix_0356.jpg",
 "/images/photography/carousel_3/wix_0360.jpg",
 "/images/photography/carousel_3/wix_0361.jpg",
 "/images/photography/carousel_3/wix_0366.jpg",
 "/images/photography/carousel_3/wix_0369.jpg",
 "/images/photography/carousel_3/wix_0371.jpg",
 ]), []);

return (
  <main className="pb-0 bg-white dark:bg-[#111]">
  <style>{`
  @keyframes slideInLeft{from{opacity:0;transform:translateX(-80px)}to{opacity:1;transform:translateX(0)}}
  @keyframes slideInRight{from{opacity:0;transform:translateX(80px)}to{opacity:1;transform:translateX(0)}}
  .animate-slideInLeft{animation:slideInLeft .8s ease-out forwards}
  .animate-slideInRight{animation:slideInRight .8s ease-out forwards}
  .album-card { perspective: 1000px; }
   .album-card img {
   transition: transform 0.6s cubic-bezier(0.2, 0, 0.2, 1),
   filter 0.6s cubic-bezier(0.2, 0, 0.2, 1);
   filter: saturate(0.15);
   }
   .album-card:hover img {
   transform: scale(1.1);
   filter: saturate(1.2);
   }
  .hover-lift{transition:transform .3s ease,box-shadow .3s ease}
  .hover-lift:hover{transform:translateY(-8px);box-shadow:0 20px 40px rgba(0,0,0,.15)}
  .model-polaroid {
  transform-style: preserve-3d;
  }
  .model-polaroid:hover {
  transform: rotateY(-5deg) rotateX(3deg) translateY(-12px) scale(1.05);
  }
  @keyframes polaroidEntrance {
  0% { opacity: 0; transform: translateY(40px) rotate(0deg) scale(0.8); }
  60% { transform: translateY(-10px) rotate(var(--rot, 0deg)) scale(1.05); }
  100% { opacity: 1; transform: translateY(0) rotate(var(--rot, 0deg)) scale(1); }
  }
  `}</style>

 {/* HERO */}
   <section ref={heroRef} className="relative min-h-[70vh] sm:min-h-[75vh] lg:min-h-screen lg:max-h-[700px] overflow-hidden hero-banner">
   {/* Desktop split: video left, text right */}
   <div className="hidden md:grid md:grid-cols-2 md:h-full">
   <div className="relative h-full">
   <div ref={hVis} className={`absolute inset-0 z-0 bg-gradient-to-br from-[#1a1a1a] via-black to-[#DF3131]/20 ${heroVisible ? "opacity-100" : "opacity-0"}`} style={{ transition: "opacity 0.8s ease-out" }}>
    <video
     src="/videos/hero-banners/photography.mp4"
     autoPlay muted loop playsInline
     className="absolute inset-0 w-full h-full object-cover"
     style={{ filter: "saturate(1.2) contrast(1.1)" }}
     />
    </div>
    </div>
    <div className="relative z-10 bg-gradient-to-br from-[#e8e8e8] to-[#dadada] flex flex-col items-center justify-center text-center px-6 lg:px-12 py-12 min-h-[500px] h-full">
   <h1 className="text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-black tracking-[0.08em] mb-4" style={{ lineHeight: 1 }}>
     <span className="text-[#DF3131]">CAPTURING</span><br />MOMENTS<br />
     <span className="text-[#DF3131]">CREATING</span><br />
     MEMORIES
     </h1>
     <p className="text-black/70 text-[16px] sm:text-[17px] max-w-md leading-relaxed mb-6">
      Our custom photography services bring your vision to life. We specialize in creative, brand-focused images.
      </p>
      <Link href="/booking-calendar/photoshoot" className="inline-block px-8 sm:px-10 py-3 sm:py-4 border-2 border-black text-black text-[12px] font-bold tracking-[0.12em] text-center hover:bg-[#DF3131] hover:border-[#DF3131] hover:text-white transition-all">
       BOOK A SHOOT
       </Link>
   </div>
   </div>
   {/* Mobile merged */}
   <div className="md:hidden absolute inset-0 flex items-center justify-center">
   <div ref={hVis} className={`absolute inset-0 z-0 bg-gradient-to-br from-[#1a1a1a] via-black to-[#DF3131]/20 ${heroVisible ? "opacity-100" : "opacity-0"}`} style={{ transition: "opacity 0.8s ease-out" }}>
    <video
     src="/videos/hero-banners/photography.mp4"
     autoPlay muted loop playsInline
     className="absolute inset-0 w-full h-full object-cover"
     style={{ filter: "saturate(1.2) contrast(1.1)" }}
     />
    </div>
   <div className="absolute inset-0 bg-black/30 z-[1]" />
   <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-10 lg:px-16 py-16 sm:py-20">
   <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-white tracking-[0.08em] mb-4 sm:mb-6" style={{ lineHeight: 1 }}>
     <span className="text-[#DF3131]">CAPTURING</span><br />MOMENTS<br />
     <span className="text-[#DF3131]">CREATING</span><br />
     MEMORIES
     </h1>
     <p className="text-[16px] sm:text-[16px] text-white/70 max-w-md leading-relaxed mb-6 sm:mb-8 mx-auto">
      Our custom photography services bring your vision to life. We specialize in creative, brand-focused images.
      </p>
      <Link href="/booking-calendar/photoshoot" className="inline-block px-8 sm:px-10 py-3 sm:py-4 border-2 border-white text-white text-[12px] font-bold tracking-[0.12em] text-center hover:bg-white hover:text-[#111] transition-all">
       BOOK A SHOOT
       </Link>
</div>
    </div>
   </section>

  {/* IMAGE CAROUSEL 1 */}
 <section className="py-6">
  <AutoScrollRow items={CAROUSEL_IMAGES_1} />
 </section>

{/* MODEL ARCHIVE */}
  <ScrollReveal animation="fadeUp" delay={0.1}>
  <section className="py-12 lg:py-20 bg-[#F5F5F3] dark:bg-[#252528]">
  <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  {/* Left: Info + Buttons */}
  <div className={`flex flex-col items-center justify-center text-center h-full ${archiveVis ? "animate-slideInLeft" : "opacity-0"}`}>
  <h2 className="text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] xl:text-[4rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.08em] leading-tight mb-6">
  MODEL<br />ARCHIVE
  </h2>
  <p className="text-[16px] lg:text-[18px] text-[#666] dark:text-white/60 max-w-lg leading-relaxed mb-8 mx-auto">
  Our model archive is a curated collection of 78+ models and client albums. Explore our diverse range of talent, from inexperienced to professional.
  </p>
 <div className="flex flex-wrap gap-4 justify-center mb-8">
   <Link href="/model-archive" className="inline-block px-8 py-4 border-2 border-[#333] text-[#333] text-[12px] font-bold tracking-[0.12em] text-center hover:bg-[#333] hover:text-white transition-all hover:scale-105">
  ARCHIVE
  </Link>
 <button
   onClick={() => setShowModelForm(!showModelForm)}
   className={`inline-block px-8 py-4 text-[12px] font-bold tracking-[0.12em] text-center transition-all border-2 ${
  showModelForm 
  ? "bg-[#333] text-white border-[#333]" 
  : "bg-[#DF3131] text-white border-[#DF3131] hover:bg-[#B82020]"
  } hover:scale-105 hover:shadow-lg`}
 >
   {showModelForm ? "BACK" : "BECOME A MODEL"}
  </button>
 </div>
 {/* Model Count Stats */}
 <div className="flex gap-8 justify-center">
 <div className="text-center">
 <p className="text-[2rem] font-heading font-black text-[#DF3131]">78+</p>
 <p className="text-[12px] text-[#888] tracking-[0.1em] uppercase">Models</p>
 </div>
 <div className="text-center">
 <p className="text-[2rem] font-heading font-black text-[#DF3131]">8</p>
 <p className="text-[12px] text-[#888] tracking-[0.1em] uppercase">Albums</p>
 </div>
 <div className="text-center">
 <p className="text-[2rem] font-heading font-black text-[#DF3131]">500+</p>
 <p className="text-[12px] text-[#888] tracking-[0.1em] uppercase">Photos</p>
 </div>
 </div>
 </div>

 {/* Right: Interactive Content */}
 <div className={`relative ${archiveVis ? "animate-slideInRight" : "opacity-0"}`} style={{ transitionDelay: "0.3s" }}>
 {/* Card Carousel View */}
 {!showModelForm && (
 <div 
 className="relative h-[400px] lg:h-[480px] overflow-hidden rounded-lg"
 onMouseEnter={() => setModelAutoPlay(false)}
 onMouseLeave={() => setModelAutoPlay(true)}
 onTouchStart={() => setModelAutoPlay(false)}
 onTouchEnd={() => { setTimeout(() => setModelAutoPlay(true), 3000); }}
 >
 {/* Main Featured Card */}
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="relative w-64 h-80 lg:w-72 lg:h-96">
 {FEATURED_MODELS.map((m, i) => {
 const offset = (i - modelIdx + FEATURED_MODELS.length) % FEATURED_MODELS.length;
 const isActive = offset === 0;
 const isPrev = offset === FEATURED_MODELS.length - 1;
 const isNext = offset === 1;
 const isHidden = offset > 1 && offset < FEATURED_MODELS.length - 1;
 
 if (isHidden) return null;
 
 return (
 <div
 key={m.name}
 className="absolute inset-0 transition-all duration-700 ease-out cursor-pointer"
 style={{
 transform: `translateX(${isActive ? 0 : isPrev ? -120 : isNext ? 120 : 0}%) scale(${isActive ? 1 : 0.85}) rotate(${isActive ? 0 : isPrev ? -8 : 8}deg)`,
 opacity: isActive ? 1 : 0.6,
 zIndex: isActive ? 10 : isPrev ? 5 : 3,
 filter: isActive ? "none" : "blur(2px)",
 }}
 onClick={() => { if (isNext) setModelIdx((modelIdx + 1) % FEATURED_MODELS.length); if (isPrev) setModelIdx((modelIdx - 1 + FEATURED_MODELS.length) % FEATURED_MODELS.length); }}
 >
 <div className={`w-full h-full bg-white dark:bg-[#252528] rounded-lg overflow-hidden shadow-2xl ${isActive ? "ring-2 ring-[#DF3131] ring-offset-4 dark:ring-offset-[#252528]" : ""}`}>
 <div className="aspect-[3/4] overflow-hidden relative">
  <Image src={m.cover} alt={m.name} fill className="w-full h-full object-cover" priority />
 </div>
 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-12">
 <p className="text-white font-heading font-black text-lg tracking-[0.08em] uppercase">{m.name}</p>
 <p className="text-[#DF3131] text-[12px] tracking-[0.1em] uppercase mt-1">{m.title}</p>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 {/* Navigation Dots */}
 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
 {FEATURED_MODELS.map((_, i) => (
 <button
 key={i}
 onClick={() => setModelIdx(i)}
 className={`w-2 h-2 rounded-full transition-all duration-300 ${i === modelIdx ? "bg-[#DF3131] w-6" : "bg-[#333]/30 hover:bg-[#333]/50"}`}
 />
 ))}
 </div>
 {/* Nav Arrows */}
 <button onClick={() => setModelIdx((modelIdx - 1 + FEATURED_MODELS.length) % FEATURED_MODELS.length)} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg text-[#333] transition-all hover:scale-110">
 <FiChevronLeft className="w-5 h-5" />
 </button>
 <button onClick={() => setModelIdx((modelIdx + 1) % FEATURED_MODELS.length)} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg text-[#333] transition-all hover:scale-110">
 <FiChevronRight className="w-5 h-5" />
 </button>
 </div>
 )}

{/* Become A Model Form */}
  {showModelForm && (
  <div className="bg-white dark:bg-[#252528] p-6 lg:p-8 shadow-xl rounded-lg border border-[#E2E2E2] dark:border-[#444]">
  <h3 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-xl tracking-[0.05em] mb-6">APPLY TO BE A MODEL</h3>
  <form onSubmit={async (e) => { 
  e.preventDefault();
  const fd = new FormData(e.currentTarget as HTMLFormElement);
  const data = Object.fromEntries(fd.entries());
  try {
  await fetch("/api/forms", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ formType: "model-application", data }),
  });
  } catch { /* continue */ }
  setApplicationSubmitted(true);
  }} className="space-y-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <input name="fullName" placeholder="Full Name *" required className="px-4 py-3 bg-[#F5F5F3] dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] text-[14px] placeholder:text-[#888] dark:placeholder:text-white/40 focus:border-[#DF3131] outline-none transition-colors" />
  <input name="email" placeholder="Email *" type="email" required className="px-4 py-3 bg-[#F5F5F3] dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] text-[14px] placeholder:text-[#888] dark:placeholder:text-white/40 focus:border-[#DF3131] outline-none transition-colors" />
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <input name="phone" placeholder="Phone" type="tel" className="px-4 py-3 bg-[#F5F5F3] dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] text-[14px] placeholder:text-[#888] dark:placeholder:text-white/40 focus:border-[#DF3131] outline-none transition-colors" />
  <select name="experience" className="px-4 py-3 bg-[#F5F5F3] dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] text-[14px] text-[#888] dark:text-white/60 focus:border-[#DF3131] outline-none transition-colors">
  <option>Experience Level</option>
  <option>No Experience</option>
  <option>Beginner (1-2 shoots)</option>
  <option>Intermediate (3-10 shoots)</option>
  <option>Experienced (10+ shoots)</option>
  <option>Professional</option>
  </select>
  </div>
  <textarea name="about" placeholder="Tell us about yourself and your modeling goals..." rows={3} className="w-full px-4 py-3 bg-[#F5F5F3] dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] text-[14px] placeholder:text-[#888] dark:placeholder:text-white/40 focus:border-[#DF3131] outline-none resize-none transition-colors" />
   <button type="submit" className="w-full py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.12em] uppercase text-[14px] hover:bg-[#B82020] transition-all hover:shadow-lg text-center">
  {applicationSubmitted ? "SUBMITTED ✓" : "SUBMIT"}
  </button>
  </form>
  </div>
  )}
 </div>
 </div>
 </div>
 </section>
 </ScrollReveal>

 {/* ALBUM CATEGORIES */}
 <ScrollReveal animation="fadeUp" delay={0.05}>
 <section className="py-6 sm:py-8 lg:py-12">
 <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
 {ALBUMS.map((a, i) => (
 <Link key={a} href={`/photography/${encodeURIComponent(a)}`}
  className="album-card group relative overflow-hidden aspect-square cursor-pointer"
  style={{ opacity: archiveVis ? 1 : 0, transform: archiveVis ? "translateY(0)" : "translateY(20px)", transition: `all .5s ease ${i * 0.06}s` }}>
  <Image src="albumCovers[a]" alt="a" fill className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-110" priority />
   <div className="absolute inset-0 z-10 bg-black/30" />
   <div className="absolute inset-0 flex items-center justify-center z-20">
   <p className="text-white text-[17px] sm:text-[21px] md:text-[26px] lg:text-[33px] font-heading font-black tracking-[0.08em] uppercase drop-shadow-lg transition-all duration-500 group-hover:opacity-0">{a}</p>
  </div>
  </Link>
 ))}
 </div>
 </div>
 </section>
 </ScrollReveal>

 {/* BENEFITS CARDS */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <section className="py-6 sm:py-8 lg:py-12">
 <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
 {[
 { title: "FLAT-RATE\nPRICING", desc: "All pricing rates are fixed so you never pay more than you actually need.", icon: "$", bg: "#DF3131" },
 { title: "PROFESSIONAL\nEQUIPMENT", desc: "All equipment used has been tested and approved for top-tier performance every time.", icon: "\u25C6", bg: "#333" },
 { title: "TOP-QUALITY\nGUARANTEED", desc: "Satisfaction is 100% guaranteed no matter how big or small your project may be.", icon: "\u2605", bg: "#DF3131" },
 ].map((b, i) => (
 <div key={b.title} className={`p-10 text-center group ${i === 1 ? "bg-white dark:bg-[#252528]" : "bg-[#F5F5F3] dark:bg-[#DF3131]"}`}>
 <div className="w-16 h-16 mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4" style={{ backgroundColor: b.bg }}>
 {b.icon}
 </div>
 <h3 className="font-heading font-black text-[#333] dark:text-white text-[22px] tracking-[0.06em] mb-4 whitespace-pre-line leading-tight">{b.title}</h3>
   <p className="text-[15px] text-white/70 dark:text-[#aaa] leading-relaxed mb-4 text-center">{b.desc}</p>
   <Link href="/plans" className="inline-block text-[#DF3131] text-[17px] font-bold tracking-[0.08em] hover:underline border-b-2 border-[#DF3131] pb-0.5 hover:text-white transition-colors">READ MORE +</Link>
 </div>
 ))}
 </div>
 </div>
 </section>
 </ScrollReveal>

 {/* IMAGE CAROUSEL 2 */}
 <section className="py-6">
  <AutoScrollRow items={CAROUSEL_IMAGES_2} />
 </section>

 {/* BOOK TODAY */}
  <ScrollReveal animation="fadeUp" delay={0.1}>
 <section className="py-12 lg:py-20 bg-white">
 <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
 <h2 className="text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] xl:text-[3.5rem] font-heading font-black text-[#333] tracking-[0.1em] text-center mb-4">BOOK TODAY</h2>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 {[
 { name: "PHOTOSHOOT", price: "$100", dur: "1 HR", cat: "Photography", desc: "Capture authentic moments with sleek, professional photography.", bookLink: "/booking-calendar/photoshoot", img: "/images/photography/photoshoot_camera.jpg" },
 { name: "PHOTO RETOUCHING", price: "Varies", dur: "2 HR", cat: "Photography", desc: "Basic to advanced professional photo retouching.", bookLink: "/booking", img: "/images/photography/retouching_camera.jpg" },
 { name: "EVENT PHOTOGRAPHY", price: "$200", dur: "3 HR", cat: "Photography", desc: "Expertly capturing every moment, from public showcases to private events.", bookLink: "/booking-calendar/event-photography", img: "/images/events/event_0002.jpg" },
 ].map((s) => (
 <PhotoFlipCard key={s.name} s={s} />
 ))}
 </div>
 </div>
 </section>
 </ScrollReveal>

 {/* IMAGE CAROUSEL 3 — bottom above footer */}
 <section className="py-6">
  <AutoScrollRow items={CAROUSEL_IMAGES_3} />
 </section>

  {activeAlbum && <AlbumModal album={activeAlbum} onClose={() => setActiveAlbum(null)} />}
  </main>
 );
}
