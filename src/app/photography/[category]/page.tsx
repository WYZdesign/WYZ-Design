"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import AgeGateModal from "@/components/AgeGateModal";
import { useNsfwSession } from "@/hooks/useNsfwSession";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FiChevronLeft, FiX, FiChevronRight } from "react-icons/fi";
import { NSFW_CATEGORIES } from "@/lib/nsfw-constants";
import { AutoScrollRow, MarqueeTitle } from "@/components/PhotographyCategoryRows";
const GATED_CATEGORIES = NSFW_CATEGORIES;

import { CATEGORY_ALBUMS, CATEGORY_META } from "@/lib/data/photography-category";


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
 const { status } = useSession();

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
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
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
  <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center" onClick={closeSlideshow} style={{ animation: "wzFadeIn 0.2s ease-out both" }} role="dialog" aria-modal="true" aria-label="Photography slideshow">
  <button aria-label="Close slideshow" className="absolute top-4 right-4 text-white/60 hover:text-white z-10" onClick={closeSlideshow}><FiX className="w-8 h-8" /></button>
  <button aria-label="Previous image" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-10 min-w-[44px] min-h-[44px]" onClick={(e) => { e.stopPropagation(); prevSlide(); }}><FiChevronLeft className="w-10 h-10" /></button>
   <Image src={allImages[slideshowIndex]} alt={`Slide ${slideshowIndex + 1} of ${allImages.length}`} width={1200} height={800} unoptimized className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} style={{ animation: "wzScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both" }} />
  <button aria-label="Next image" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-10 min-w-[44px] min-h-[44px]" onClick={(e) => { e.stopPropagation(); nextSlide(); }}><FiChevronRight className="w-10 h-10" /></button>
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
