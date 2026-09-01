"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import SafeImage from "@/components/SafeImage";
import NsfwImage from "@/components/NsfwImage";
import AgeGateModal from "@/components/AgeGateModal";
import { useNsfwSession } from "@/hooks/useNsfwSession";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FiChevronLeft, FiX, FiChevronRight, FiLock } from "react-icons/fi";
import { NSFW_CATEGORIES } from "@/lib/nsfw-constants";
const GATED_CATEGORIES = NSFW_CATEGORIES;

const CATEGORY_META: Record<string, { label: string; desc: string }> = {
  Events: { label: "Events", desc: "Live shows, mixers, workshops, and community gatherings." },
  Outdoors: { label: "Outdoors", desc: "Natural light, urban landscapes, and open air portraits." },
  Studio: { label: "Studio", desc: "Controlled lighting, headshots, and creative studio work." },
  Boudoir: { label: "Boudoir", desc: "Intimate, editorial, and personal portrait sessions." },
  Bodypaint: { label: "Bodypaint", desc: "Body as canvas. Art, paint, texture, and expression." },
  Urbex: { label: "Urbex", desc: "Abandoned spaces, urban decay, and industrial textures." },
  Products: { label: "Products", desc: "Commercial product photography, mockups, and branding shots." },
  Conceptual: { label: "Conceptual", desc: "Idea driven work. Abstract, surreal, and experimental imagery." },
  Portraits: { label: "Portraits", desc: "Expressive portrait sessions capturing personality and emotion." },
  Concerts: { label: "Concerts", desc: "Live music performances, venue shoots, and artist coverage." },
  Street: { label: "Street", desc: "Urban storytelling through candid street photography." },
  Editorial: { label: "Editorial", desc: "Magazine-style shoots, fashion editorials, and styled storytelling." },
  Commercial: { label: "Commercial", desc: "Brand campaigns, product launches, and commercial advertising work." },
};

// ── Local album definitions per category ──
// Each category has named albums, each album has image paths
const CATEGORY_ALBUMS: Record<string, Array<{ name: string; images: string[] }>> = {
 Events: [
 { name: "Live Events", images: [
 "/images/events/event_0002.jpg", "/images/events/event_0003.jpg", "/images/events/event_0004.jpg",
 "/images/events/event_0005.jpg", "/images/events/event_0006.png", "/images/events/event_0007.jpg",
 "/images/events/event_1.jpg", "/images/events/event_2.jpg", "/images/events/event_3.jpg",
 "/images/events/event_4.JPG", "/images/events/event_5.jpg",
 ]},
 { name: "Event Coverage", images: [
 "/images/events/event_page_1.jpg", "/images/events/event_page_2.jpg", "/images/events/event_page_3.jpg",
 "/images/events/event_page_4.jpg", "/images/events/event_page_5.jpg", "/images/events/event_page_6.jpg",
 "/images/events/event_page_7.jpg", "/images/events/event_page_8.jpg", "/images/events/event_page_9.jpg",
 "/images/events/event_page_10.jpg", "/images/events/event_page_11.jpg", "/images/events/event_page_12.jpg",
 "/images/events/event_page_13.jpg", "/images/events/event_page_14.jpg", "/images/events/event_page_15.jpg",
 "/images/events/event_page_16.jpg", "/images/events/event_page_17.jpg", "/images/events/event_page_18.jpg",
 ]},
 { name: "Full Gallery", images: [
 "/images/events_full/AMFM_Event__Slump__6.jpg", "/images/events_full/AMFM_Event__Slump__7.jpg",
 "/images/events_full/AMFM_Event__Slump__8.jpg", "/images/events_full/BoW_3_10.jpg",
 "/images/events_full/BoW_3_9.jpg",
 ]},
 ],
 Outdoors: [
 { name: "Urban Sessions", images: [
 "/images/photography/carousel_1/wix_0216.jpg", "/images/photography/carousel_1/wix_0166.jpg",
 "/images/photography/carousel_1/wix_0168.jpg", "/images/photography/carousel_1/wix_0169.jpg",
 "/images/photography/carousel_1/wix_0174.jpg", "/images/photography/carousel_1/wix_0176.jpg",
 "/images/photography/carousel_1/wix_0181.jpg", "/images/photography/carousel_1/wix_0184.jpg",
 "/images/photography/carousel_1/wix_0188.jpg", "/images/photography/carousel_1/wix_0192.jpg",
 "/images/photography/carousel_1/wix_0195.jpg", "/images/photography/carousel_1/wix_0198.jpg",
 ]},
 { name: "Open Air", images: [
 "/images/photography/carousel_1/wix_0199.jpg", "/images/photography/carousel_1/wix_0200.jpg",
 "/images/photography/carousel_1/wix_0201.jpg", "/images/photography/carousel_1/wix_0203.jpg",
 "/images/photography/carousel_1/wix_0207.jpg", "/images/photography/carousel_1/wix_0210.jpg",
 "/images/photography/carousel_1/wix_0212.jpg", "/images/photography/carousel_1/wix_0213.jpg",
 "/images/photography/carousel_1/wix_0429.jpg", "/images/photography/carousel_1/wix_0431.jpg",
 "/images/photography/carousel_1/wix_0432.jpg", "/images/photography/carousel_1/wix_0434.jpg",
 ]},
 ],
 Studio: [
 { name: "Studio Portraits", images: [
 "/images/photography/carousel_2/wix_0281.jpg", "/images/photography/carousel_2/wix_0219.jpg",
 "/images/photography/carousel_2/wix_0222.jpg", "/images/photography/carousel_2/wix_0224.jpg",
 "/images/photography/carousel_2/wix_0225.jpg", "/images/photography/carousel_2/wix_0227.jpg",
 "/images/photography/carousel_2/wix_0231.jpg", "/images/photography/carousel_2/wix_0234.jpg",
 "/images/photography/carousel_2/wix_0235.jpg", "/images/photography/carousel_2/wix_0240.jpg",
 "/images/photography/carousel_2/wix_0242.jpg", "/images/photography/carousel_2/wix_0243.jpg",
 ]},
 { name: "Creative Work", images: [
 "/images/photography/carousel_2/wix_0245.jpg", "/images/photography/carousel_2/wix_0257.jpg",
 "/images/photography/carousel_2/wix_0259.jpg", "/images/photography/carousel_2/wix_0261.jpg",
 "/images/photography/carousel_2/wix_0264.jpg", "/images/photography/carousel_2/wix_0266.jpg",
 "/images/photography/carousel_2/wix_0273.jpg", "/images/photography/carousel_2/wix_0278.jpg",
 "/images/photography/carousel_2/wix_0447.jpg", "/images/photography/carousel_2/wix_0448.jpg",
 "/images/photography/carousel_2/wix_0331.jpg", "/images/photography/carousel_2/wix_0333.jpg",
 ]},
 ],
 Boudoir: [
 { name: "Intimate Sessions", images: [
 "/images/photography/carousel_3/wix_0329.jpg", "/images/photography/carousel_3/wix_0283.jpg",
 "/images/photography/carousel_3/wix_0285.jpg", "/images/photography/carousel_3/wix_0287.jpg",
 "/images/photography/carousel_3/wix_0289.jpg", "/images/photography/carousel_3/wix_0291.jpg",
 "/images/photography/carousel_3/wix_0294.jpg", "/images/photography/carousel_3/wix_0296.jpg",
 "/images/photography/carousel_3/wix_0298.jpg", "/images/photography/carousel_3/wix_0299.jpg",
 ]},
 { name: "Editorial", images: [
 "/images/photography/carousel_3/wix_0303.jpg", "/images/photography/carousel_3/wix_0305.jpg",
 "/images/photography/carousel_3/wix_0308.jpg", "/images/photography/carousel_3/wix_0309.jpg",
 "/images/photography/carousel_3/wix_0311.jpg", "/images/photography/carousel_3/wix_0319.jpg",
 "/images/photography/carousel_3/wix_0321.jpg", "/images/photography/carousel_3/wix_0324.jpg",
 "/images/photography/carousel_3/wix_0326.jpg", "/images/photography/carousel_3/wix_0328.jpg",
 ]},
 ],
 Bodypaint: [
 { name: "Action Sack Vol. 4", images: [
 "/images/events_full/Action_Sack_vol__4__bodypaint__0.jpg",
 "/images/events_full/Action_Sack_vol__4__bodypaint__1.jpg",
 "/images/events_full/Action_Sack_vol__4__bodypaint__2.jpg",
 ]},
 { name: "Action Sack Vol. 5", images: [
 "/images/events_full/Action_Sack_vol__5__bodypaint__3.jpg",
 "/images/events_full/Action_Sack_vol__5__bodypaint__4.jpg",
 "/images/events_full/Action_Sack_vol__5__bodypaint__5.jpg",
 ]},
 { name: "Farren Bodypaint", images: [
 "/images/models/FARREN/Bodypaint-37.jpg",
 "/images/models/FARREN/Bodypaint-133.jpg",
 "/images/models/FARREN/Bodypaint-135.jpg",
 "/images/models/FARREN_BODYPAINT/Bodypaint-37.jpg",
 "/images/models/FARREN_BODYPAINT/Bodypaint-133.jpg",
 "/images/models/FARREN_BODYPAINT/Bodypaint-135.jpg",
 ]},
 { name: "Arcana Bodypaint", images: [
 "/images/models/ARCANA/Bodypaint-262.JPG",
 "/images/models/ARCANA/Bodypaint-263.JPG",
 "/images/models/ARCANA/Bodypaint-266.JPG",
 ]},
 { name: "Citlali Bodypaint", images: [
 "/images/models/CITLALI/Bodypaint-73.JPG",
 "/images/models/CITLALI/Bodypaint-89.JPG",
 "/images/models/CITLALI/Bodypaint-126.JPG",
 ]},
 { name: "Jordan Bodypaint", images: [
 "/images/models/JORDAN/Bodypaint-42.JPG",
 "/images/models/JORDAN/Bodypaint-89.JPG",
 "/images/models/JORDAN/Bodypaint-119.JPG",
 ]},
 ],
 Urbex: (() => {
 const all = Array.from({ length: 85 }, (_, i) => `/images/photography/urbex/urbex_${String(i).padStart(3, "0")}.jpg`);
 return [
 { name: "Abandoned Spaces", images: all.slice(0, 20) },
 { name: "Urban Decay", images: all.slice(20, 45) },
 { name: "Industrial Textures", images: all.slice(45, 70) },
 { name: "Final explorations", images: all.slice(70) },
 ];
 })(),
 Products: [
 { name: "Product Shots", images: [
 "/images/photography/carousel_2/wix_0334.jpg", "/images/photography/carousel_2/wix_0338.jpg",
 "/images/photography/carousel_2/wix_0341.jpg", "/images/photography/carousel_2/wix_0348.jpg",
 "/images/photography/carousel_2/wix_0350.jpg",
 "/images/photography/carousel_1/wix_0438.jpg", "/images/photography/carousel_1/wix_0440.jpg",
 "/images/photography/carousel_1/wix_0444.jpg", "/images/photography/carousel_1/wix_0445.jpg",
 "/images/photography/carousel_1/wix_0446.jpg",
 ]},
 ],
 Conceptual: [
 { name: "Conceptual Work", images: [
 "/images/photography/carousel_3/wix_0329.jpg", "/images/photography/carousel_1/wix_0429.jpg",
 "/images/photography/carousel_1/wix_0431.jpg", "/images/photography/carousel_1/wix_0432.jpg",
 "/images/photography/carousel_2/wix_0447.jpg", "/images/photography/carousel_2/wix_0448.jpg",
 "/images/photography/carousel_3/wix_0352.jpg", "/images/photography/carousel_3/wix_0353.jpg",
 "/images/photography/carousel_3/wix_0355.jpg", "/images/photography/carousel_3/wix_0356.jpg",
 ]}],
 Portraits: [
 { name: "Studio Portraits", images: [
 "/images/photography/carousel_2/wix_0281.jpg", "/images/photography/carousel_2/wix_0219.jpg",
 "/images/photography/carousel_2/wix_0222.jpg", "/images/photography/carousel_2/wix_0224.jpg",
 "/images/photography/carousel_2/wix_0225.jpg", "/images/photography/carousel_2/wix_0227.jpg",
 "/images/photography/carousel_2/wix_0231.jpg", "/images/photography/carousel_2/wix_0234.jpg",
 ]},
 { name: "Outdoor Portraits", images: [
 "/images/photography/carousel_1/wix_0216.jpg", "/images/photography/carousel_1/wix_0166.jpg",
 "/images/photography/carousel_1/wix_0168.jpg", "/images/photography/carousel_1/wix_0169.jpg",
 "/images/photography/carousel_1/wix_0174.jpg", "/images/photography/carousel_1/wix_0176.jpg",
 ]},
 ],
 Concerts: [
 { name: "Live Performances", images: [
 "/images/events/event_0002.jpg", "/images/events/event_0003.jpg", "/images/events/event_0004.jpg",
 "/images/events/event_0005.jpg", "/images/events/event_0006.png", "/images/events/event_0007.jpg",
 "/images/events/event_1.jpg", "/images/events/event_2.jpg", "/images/events/event_3.jpg",
 ]},
 { name: "Event Coverage", images: [
 "/images/events/event_page_1.jpg", "/images/events/event_page_2.jpg", "/images/events/event_page_3.jpg",
 "/images/events/event_page_4.jpg", "/images/events/event_page_5.jpg", "/images/events/event_page_6.jpg",
 ]},
 ],
 Street: [
 { name: "Urban Exploration", images: [
 "/images/photography/carousel_1/wix_0199.jpg", "/images/photography/carousel_1/wix_0200.jpg",
 "/images/photography/carousel_1/wix_0201.jpg", "/images/photography/carousel_1/wix_0203.jpg",
 "/images/photography/carousel_1/wix_0207.jpg", "/images/photography/carousel_1/wix_0210.jpg",
 "/images/photography/carousel_1/wix_0212.jpg", "/images/photography/carousel_1/wix_0213.jpg",
 ]},
  { name: "Street Stories", images: [
  "/images/photography/carousel_1/wix_0429.jpg", "/images/photography/carousel_1/wix_0431.jpg",
  "/images/photography/carousel_1/wix_0432.jpg", "/images/photography/carousel_1/wix_0434.jpg",
  ]},
  ],
  Editorial: [
  { name: "Fashion Editorials", images: [
  "/images/photography/carousel_3/wix_0303.jpg", "/images/photography/carousel_3/wix_0305.jpg",
  "/images/photography/carousel_3/wix_0308.jpg", "/images/photography/carousel_3/wix_0309.jpg",
  "/images/photography/carousel_3/wix_0311.jpg", "/images/photography/carousel_3/wix_0319.jpg",
  "/images/photography/carousel_3/wix_0321.jpg", "/images/photography/carousel_3/wix_0324.jpg",
  "/images/photography/carousel_3/wix_0326.jpg", "/images/photography/carousel_3/wix_0328.jpg",
  ]},
  { name: "Styled Shoots", images: [
  "/images/photography/carousel_2/wix_0245.jpg", "/images/photography/carousel_2/wix_0257.jpg",
  "/images/photography/carousel_2/wix_0259.jpg", "/images/photography/carousel_2/wix_0261.jpg",
  "/images/photography/carousel_2/wix_0264.jpg", "/images/photography/carousel_2/wix_0266.jpg",
  ]},
  ],
  Commercial: [
  { name: "Brand Campaigns", images: [
  "/images/photography/carousel_2/wix_0334.jpg", "/images/photography/carousel_2/wix_0338.jpg",
  "/images/photography/carousel_2/wix_0341.jpg", "/images/photography/carousel_2/wix_0348.jpg",
  "/images/photography/carousel_2/wix_0350.jpg",
  "/images/photography/carousel_1/wix_0438.jpg", "/images/photography/carousel_1/wix_0440.jpg",
  "/images/photography/carousel_1/wix_0444.jpg", "/images/photography/carousel_1/wix_0445.jpg",
  "/images/photography/carousel_1/wix_0446.jpg",
  ]},
  { name: "Product Shots", images: [
  "/images/photography/carousel_2/wix_0334.jpg", "/images/photography/carousel_2/wix_0338.jpg",
  "/images/photography/carousel_2/wix_0341.jpg",
  ]},
  ],
};

function AutoScrollRow({ images, label, speed, onImageClick, isNsfw, canReveal }: { images: string[]; label: string; speed: number; onImageClick: (src: string) => void; isNsfw?: boolean; canReveal?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const paused = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || images.length <= 4) return;
    let frame: number;
    const animate = () => {
      if (!paused.current && el) {
        offsetRef.current += speed;
        const half = el.scrollWidth / 3;
        if (offsetRef.current >= half) offsetRef.current -= half;
        el.style.transform = `translateX(${-offsetRef.current}px)`;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); if (resumeTimer.current) clearTimeout(resumeTimer.current); };
  }, [images.length, speed]);

  const pausedTripled = [...images, ...images, ...images];

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4 px-2">
        <span className="text-[13px] text-white/50 font-heading font-bold tracking-[0.15em] uppercase mb-2">{label}</span>
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[12px] text-white/25 font-mono">{images.length} photos</span>
      </div>
      <div className="overflow-hidden cursor-grab px-2">
        <div ref={trackRef} className="flex gap-3 will-change-transform">
          {pausedTripled.map((src, j) => (
            <div key={j} className="flex-shrink-0 h-56 sm:h-64 md:h-72 overflow-hidden group rounded-sm"
              onClick={() => {
                paused.current = true;
                if (resumeTimer.current) clearTimeout(resumeTimer.current);
                onImageClick(src);
                resumeTimer.current = setTimeout(() => { paused.current = false; }, 2500);
              }}
              onMouseEnter={() => { paused.current = true; if (resumeTimer.current) clearTimeout(resumeTimer.current); }}
              onMouseLeave={() => { paused.current = false; }}>
               {isNsfw ? (
                 <NsfwImage src={src} alt={label} className="h-full w-auto" canReveal={canReveal} loading="lazy" />
               ) : (
                 <SafeImage src={src} alt={label} className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
               )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarqueeTitle({ text }: { text: string }) {
 return (
 <div className="overflow-hidden whitespace-nowrap mb-6 border-b border-white/5 pb-6">
 <div className="inline-flex animate-marquee-infinite">
 {[...Array(8)].map((_, r) => (
 <span key={r} className="text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] font-heading font-black tracking-[0.08em] inline-flex">
 {text.split("").map((c, i) => {
 const wordColor = r % 2 === 0 ? "#DF3131" : "#FFFFFF";
 return (<span key={i} style={{ color: wordColor }}>{c}</span>);
 })}
 <span className="w-12 inline-block" />
 </span>
 ))}
 </div>
 <style>{`
 @keyframes marqueeInfinite { from { transform: translateX(0); } to { transform: translateX(-50%); } }
 .animate-marquee-infinite { animation: marqueeInfinite 30s linear infinite; }
 .scrollbar-hide::-webkit-scrollbar { display: none; }
 .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
 `}</style>
 </div>
 );
}

export default function CategoryPage() {
 const params = useParams();
 const category = decodeURIComponent(params.category as string);
 const [slideshowIndex, setSlideshowIndex] = useState<number | null>(null);
 const [allImages, setAllImages] = useState<string[]>([]);
 const nsfwSession = useNsfwSession();

  // Case-insensitive lookup: URL slugs are lowercase, keys are capitalized
  const metaKey = Object.keys(CATEGORY_META).find(k => k.toLowerCase() === category.toLowerCase()) || category;
  const meta = CATEGORY_META[metaKey] || { label: category, desc: "" };
  const categoryKey = Object.keys(CATEGORY_ALBUMS).find(k => k.toLowerCase() === category.toLowerCase()) || category;
  const albums = CATEGORY_ALBUMS[categoryKey] || [];
  const isGated = GATED_CATEGORIES.some(g => g.toLowerCase() === category.toLowerCase());
 const { data: session, status } = useSession();

  // Auto-show age gate for NSFW categories when not verified
  useEffect(() => {
    if (isGated && !nsfwSession.loading && !nsfwSession.ageVerified && status !== "loading") {
      nsfwSession.requestVerification();
    }
  }, [isGated, nsfwSession.loading, nsfwSession.ageVerified, status]);

 useEffect(() => {
 const imgs: string[] = [];
 for (const album of albums) imgs.push(...album.images);
 setAllImages(imgs);
 }, [category]);

 const openSlideshow = (src: string) => {
 const idx = allImages.indexOf(src);
 setSlideshowIndex(idx >= 0 ? idx : 0);
 };

  const closeSlideshow = () => setSlideshowIndex(null);
  const prevSlide = () => setSlideshowIndex(s => (s !== null ? (s - 1 + allImages.length) % allImages.length : 0));
  const nextSlide = () => setSlideshowIndex(s => (s !== null ? (s + 1) % allImages.length : 0));

  useEffect(() => {
    if (slideshowIndex === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSlideshow();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [slideshowIndex]);

 return (
  <div className="min-h-screen bg-[#0A0A0A] pb-20">
 <div className="pt-24">
 <h1><MarqueeTitle text={meta.label.toUpperCase()} /></h1>
 <p className="text-white/50 text-[16px] text-center max-w-xl mx-auto mb-8 px-6">{meta.desc} {allImages.length > 0 && ` - ${allImages.length} images across ${albums.length} albums`}</p>

  <div className="max-w-[140rem] mx-auto">
  <div className="px-6">
  <Link href="/photography" className="inline-flex items-center gap-2 text-white/40 hover:text-[#DF3131] text-[13px] mb-4 transition-colors">
  <FiChevronLeft /> Back to Photography
  </Link>
  </div>

  {albums.length === 0 ? (
  <div className="text-center py-20">
  <p className="text-white/30">No images found for this category.</p>
  <Link href="/photography" className="text-[#DF3131] text-[14px] mt-4 inline-block hover:underline">Browse all categories</Link>
  </div>
  ) : (
  <div>
  {albums.map((album, i) => (
  <AutoScrollRow
  key={i}
  images={album.images}
  label={album.name}
  speed={0.33 + (i % 3) * 0.165}
  onImageClick={openSlideshow}
  isNsfw={isGated}
  canReveal={nsfwSession.ageVerified}
  />
   ))}
   </div>
   )}
   </div>
   </div>

  {slideshowIndex !== null && (
  <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center" onClick={closeSlideshow} style={{ animation: "wzFadeIn 0.2s ease-out both" }}>
  <button aria-label="Close slideshow" className="absolute top-4 right-4 text-white/60 hover:text-white z-10" onClick={closeSlideshow}><FiX className="w-8 h-8" /></button>
  <button aria-label="Previous image" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-10" onClick={(e) => { e.stopPropagation(); prevSlide(); }}><FiChevronLeft className="w-10 h-10" /></button>
   <Image src={allImages[slideshowIndex]} alt={`Slide ${slideshowIndex + 1} of ${allImages.length}`} width={1200} height={800} unoptimized className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} style={{ animation: "wzScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both" }} />
  <button aria-label="Next image" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-10" onClick={(e) => { e.stopPropagation(); nextSlide(); }}><FiChevronRight className="w-10 h-10" /></button>
  <div className="absolute bottom-6 text-white/40 text-sm">{slideshowIndex + 1} / {allImages.length}</div>
  </div>
  )}

  <AgeGateModal
    open={nsfwSession.showModal}
    onClose={nsfwSession.closeModal}
    onVerified={nsfwSession.onVerified}
    categoryLabel={isGated ? meta.label : undefined}
  />
  </div>
  );
}
