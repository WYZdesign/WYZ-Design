"use client";
import toast from "react-hot-toast";
import { logger } from "@/lib/logger";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiUser, FiEdit3, FiCalendar, FiMapPin, FiHeart, FiArrowRight, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ScrollReveal from "@/components/ScrollReveal";
import { useZeal } from "@/components/ZealProvider";

const WS = [
  { icon: <FiUser />, label: "WHO", value: "Donte \"Danny\" Davis", desc: "A multidisciplinary creative from the west side of Chicago, writer, painter, and visual storyteller." },
 { icon: <FiEdit3 />, label: "WHAT", value: "Visual Art & Writing", desc: "Original paintings, illustrations, and written works that explore color, emotion, and perspective." },
 { icon: <FiCalendar />, label: "WHEN", value: "Featured June 2026", desc: "Selected as this month's Featured Artist of the Month by WYZ Design curators." },
 { icon: <FiMapPin />, label: "WHERE", value: "Chicago, IL", desc: "Born and raised on the west side. Creating from the heart of the city." },
 { icon: <FiHeart />, label: "WHY", value: "Passion for Color", desc: "Danny uses his passion to show others how beautiful the world can be if you pay attention to the colors." },
];

const ARTIST_GALLERY = [
 { src: "/images/featured-artist/artwork_1.jpg", label: "Artwork" },
 { src: "/images/featured-artist/artwork_2.jpg", label: "Bodypaint" },
 { src: "/images/danny-davis.png", label: "Danny Davis" },
];

function ArtistGallery() {
 const [current, setCurrent] = useState(0);
 const [flipping, setFlipping] = useState(false);
 const [dir, setDir] = useState(0);
 const [lbIdx, setLbIdx] = useState<number | null>(null);

 const flip = (d: 1 | -1) => {
 if (flipping) return;
 setDir(d);
 setFlipping(true);
 setTimeout(() => {
 setCurrent((prev) => (prev + d + ARTIST_GALLERY.length) % ARTIST_GALLERY.length);
 setFlipping(false);
 }, 350);
 };

 const rotateY = flipping ? (dir === 1 ? -90 : 90) : 0;
 const item = ARTIST_GALLERY[current];

 const openLb = useCallback((idx: number) => { setLbIdx(idx); }, []);

 useEffect(() => {
 if (lbIdx === null) return;
 const handler = (e: KeyboardEvent) => {
 if (e.key === "Escape") setLbIdx(null);
 if (e.key === "ArrowRight" && lbIdx < ARTIST_GALLERY.length - 1) setLbIdx(i => i! + 1);
 if (e.key === "ArrowLeft" && lbIdx > 0) setLbIdx(i => i! - 1);
 };
 window.addEventListener("keydown", handler);
 return () => window.removeEventListener("keydown", handler);
 }, [lbIdx]);

 return (
 <div className="sticky top-28">
 <div className="relative" style={{ perspective: "1200px" }}>
 <div
 className="relative w-full aspect-[3/4] overflow-hidden bg-[#f5f5f5] cursor-pointer"
 style={{
 transform: `rotateY(${rotateY}deg)`,
 transition: flipping ? "transform 350ms ease-in" : "transform 350ms ease-out",
 transformStyle: "preserve-3d",
 }}
 onClick={() => openLb(current)}
 >
 {!flipping && (
 item.src ? (
    <Image src={item.src} alt={item.label} fill sizes="(max-width:640px) 50vw, 33vw" className="w-full h-full object-cover" />
 ) : (
 <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#DF3131]/5 to-[#D49341]/5">
 <span className="text-[#DF3131]/30 text-[13px] font-bold tracking-[0.1em] uppercase mb-2">{item.label}</span>
 </div>
 )
 )}
 <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
 <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
 <span className="text-white text-[12px] font-bold tracking-[0.15em] uppercase drop-shadow-md mb-2">{item.label}</span>
 <span className="text-white/60 text-[11px] font-mono">{current + 1}/{ARTIST_GALLERY.length}</span>
 </div>
 </div>
 </div>
 <button onClick={() => flip(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white/80 text-[#333] hover:bg-[#DF3131] hover:text-white transition-all shadow-lg rounded-full text-sm">{"‹"}</button>
 <button onClick={() => flip(1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white/80 text-[#333] hover:bg-[#DF3131] hover:text-white transition-all shadow-lg rounded-full text-sm">{"›"}</button>
 <div className="mt-3 flex gap-2 justify-center">
 {ARTIST_GALLERY.map((g, i) => (
 <button key={i} onClick={() => { setDir(i > current ? 1 : -1); setFlipping(true); setTimeout(() => { setCurrent(i); setFlipping(false); }, 350); }}
 className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-[#DF3131] scale-125" : "bg-gray-300 hover:bg-gray-400"}`} />
 ))}
 </div>
 {lbIdx !== null && ARTIST_GALLERY[lbIdx].src && (
 <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLbIdx(null)}>
 <button onClick={() => setLbIdx(null)} className="absolute top-4 right-4 text-white/70 hover:text-white z-10"><FiX className="w-8 h-8" /></button>
 {lbIdx > 0 && (
 <button onClick={(e) => { e.stopPropagation(); setLbIdx(i => i! - 1); }} className="absolute left-4 text-white/70 hover:text-white z-10">
 <FiChevronLeft className="w-10 h-10" />
 </button>
 )}
 {lbIdx < ARTIST_GALLERY.length - 1 && (
 <button onClick={(e) => { e.stopPropagation(); setLbIdx(i => i! + 1); }} className="absolute right-4 text-white/70 hover:text-white z-10">
 <FiChevronRight className="w-10 h-10" />
 </button>
 )}
 <img src={ARTIST_GALLERY[lbIdx].src} alt={ARTIST_GALLERY[lbIdx].label}
 width={900} height={1200}
 className="max-h-[90vh] max-w-[90vw] object-contain" onClick={(e) => e.stopPropagation()} />
 <div className="absolute bottom-4 text-white/50 text-sm">{lbIdx + 1} / {ARTIST_GALLERY.length}</div>
 </div>
 )}
 </div>
 );
}

export default function FeaturedArtistPage() {
  const { earn } = useZeal();
  const [showForm, setShowForm] = useState(false);
 const [formData, setFormData] = useState({ fullName: "", artistName: "", email: "", socialMedia: "", bio: "" });
 const [submitted, setSubmitted] = useState(false);
 const [submitting, setSubmitting] = useState(false);
 const formRef = useRef<HTMLDivElement>(null);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
 setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (submitting) return;
 const form = e.target as HTMLFormElement;
 const fd = new FormData(form);
 const data: Record<string, string> = {};
 fd.forEach((v, k) => { data[k] = v as string; });
 setSubmitting(true);
 try {
 const res = await fetch("/api/forms", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ formType: "featured-artist-application", data: { ...data, submittedAt: new Date().toISOString() } }),
 });
 const result = await res.json();
 if (!res.ok || !result.success) {
 logger.warn("featured-artist-page", `Application submit failed: ${result.error || res.status}`);
 toast.error(result.error || "Submission failed. Please try again.");
 return;
 }
 void earn("submit-featured-artist");
 setSubmitted(true);
 } catch (e) { logger.warn("featured-artist-page", `Application submit failed: ${e}`); toast.error("Submission failed. Please try again."); }
 finally { setSubmitting(false); }
 };

 return (
 <main className="pt-0 pb-0 bg-white">
 {/* ═══ HERO — Full biography split ═══ */}
 <section className="relative -mt-20 lg:-mt-24 min-h-screen flex flex-col lg:flex-row overflow-hidden">
 {/* Left: Image */}
 <div className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-screen bg-white dark:bg-[#111] flex items-center justify-center overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-br from-[#DF3131]/20 via-[#FFFFFF] dark:via-[#111] to-[#DF3131]/10 blur-[70%]" />
 <Image src="/images/danny-davis.png" alt="Donte 'Danny' Davis" width={800} height={1067} className="relative z-10 w-full lg:w-[85%] aspect-[3/4] max-w-full lg:max-w-lg object-cover object-top border border-[#E2E2E2] dark:border-white/10 shadow-2xl shadow-black/50" priority />
 <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] dark:from-[#111]/80 via-transparent to-[#FFFFFF]/30 dark:to-[#111]/30 z-20" />
 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#FFFFFF] dark:to-[#111] hidden lg:block z-20" />
 <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#FFFFFF] dark:from-[#111] to-transparent lg:hidden z-20" />
 </div>

 {/* Right: Biography text on dark bg */}
 <div className="w-full lg:w-1/2 flex items-center bg-white dark:bg-[#111] px-10 lg:px-16 xl:px-24 pt-28 pb-16 lg:py-0 relative z-10">
  <div className="max-w-xl text-center lg:text-center">
  <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#DF3131] block mb-2">FEATURED ARTIST OF THE MONTH</span>
  <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] max-sm:text-[2.8rem] font-heading font-black text-[#333] dark:text-white tracking-[0.04em] mb-6 sm:mb-8" style={{ lineHeight: 0.9 }}>DONTE<br />&quot;DANNY&quot;<br />DAVIS</h1>
 <div className="w-16 h-[3px] bg-[#DF3131] mb-6 mx-auto" />
 <p className="text-[#666] dark:text-white/70 text-[16px] leading-relaxed mb-4">
  From the west side of Chicago, born and raised! A guy known to some as &quot;Danny&quot; is a creative in every sense of the word. From writing to painting, with a palette of many other talents and abilities.
 </p>
 <p className="text-[#666] dark:text-white/50 text-[15px] leading-relaxed mb-8">
 Danny uses his passion to show others how beautiful the world can be if you stop looking at things as simply black and white, but really pay attention to the colors.
 </p>
   <div className="flex flex-wrap gap-4 justify-center">
   <Link href="/merch" className="inline-flex items-center gap-2 px-8 py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.12em] uppercase text-[14px] hover:bg-[#B82020] transition-all hover:shadow-lg hover:shadow-[#DF3131]/30">
   SHOP ARTWORK <FiArrowRight className="w-4 h-4" />
   </Link>
   </div>
 </div>
 </div>
 </section>

 {/* ═══ 5 Ws — Biography-style flow ═══ */}
 <ScrollReveal animation="fadeUp">
 <section className="py-16 bg-white">
 <div className="max-w-[80rem] mx-auto px-6 lg:px-12">
 <div className="text-center mb-12">
 <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#DF3131] block mb-2">THE BASICS</span>
 <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase text-[#333] mb-4">GET TO KNOW THE ARTIST</h2>
 </div>
 <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 items-start">
 {/* Flipcard gallery — visible on all screens, sticky on desktop */}
 <div className="block">
 <ArtistGallery />
 </div>
 {/* 5 Ws list — text left-aligned on all screens */}
 <div className="space-y-0 text-left">
 {WS.map((w, i) => (
 <div key={w.label} className={`group flex flex-col sm:flex-row items-start gap-5 sm:gap-8 py-7 ${i < WS.length - 1 ? "border-b border-[#E2E2E2]" : ""} hover:bg-[#FAFAF8] transition-colors duration-300 px-4 sm:px-6 text-left`}>
 <div className="flex items-center gap-3 flex-shrink-0 min-w-[100px]">
 <div className="w-10 h-10 flex items-center justify-center bg-[#DF3131]/10 text-[#DF3131] group-hover:bg-[#DF3131] group-hover:text-white transition-all duration-300 rounded-full">
 {w.icon}
 </div>
 <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#DF3131] mb-2">{w.label}</span>
 </div>
 <div className="flex-1">
 <h3 className="font-heading font-bold text-[#333] text-[16px] tracking-[0.03em] mb-3">{w.value}</h3>
 <p className="text-[14px] text-[#666] leading-relaxed">{w.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>
 </ScrollReveal>

 {/* ═══ ART STORE ═══ */}
 <ScrollReveal animation="fadeUp">
 <section className="py-16 bg-[#111]">
 <div className="max-w-[115rem] mx-auto px-6 lg:px-12">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div className="text-center lg:text-center">
 <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#DF3131] block mb-2">SUPPORT THE ARTIST</span>
 <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase text-white mb-4">ART STORE</h2>
 <p className="text-white/60 text-[15px] leading-relaxed mb-6">
 Support this month&apos;s featured artist by browsing and purchasing original artwork, prints, and custom pieces. Every purchase directly supports the artist.
 </p>
 <div className="flex flex-wrap gap-4 justify-center">
 <Link href="/merch" className="inline-flex items-center gap-2 px-8 py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.12em] uppercase text-[14px] hover:bg-[#B82020] transition-all hover:shadow-lg hover:shadow-[#DF3131]/30">
 BROWSE SHOP <FiArrowRight className="w-4 h-4" />
 </Link>
  <Link href="/designs" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#111] border-2 border-white font-heading font-bold tracking-[0.12em] uppercase text-[14px] hover:bg-[#DF3131] hover:text-white hover:border-[#DF3131] transition-all">
 CUSTOM ORDERS
 </Link>
 </div>
 </div>
  {/* Art preview grid */}
  <div className="grid grid-cols-2 gap-3">
  <Link href="/merch" className="relative aspect-square bg-[#1a1a1a] border border-white/10 hover:border-[#DF3131] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden cursor-pointer group block">
   <Image src="/images/faotm_1.jpg" alt="Featured artwork" fill sizes="50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
   </Link>
   <Link href="/merch" className="relative aspect-square bg-[#1a1a1a] border border-white/10 hover:border-[#DF3131] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden cursor-pointer group block">
    <Image src="/images/faotm_2.jpg" alt="Featured artwork" fill sizes="50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
   </Link>
   <Link href="/merch" className="relative aspect-square bg-[#1a1a1a] border border-white/10 hover:border-[#DF3131] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden cursor-pointer group block">
   <Image src="/images/faotm_3.jpg" alt="Featured artwork" fill sizes="50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
   </Link>
   <Link href="/merch" className="relative aspect-square bg-[#1a1a1a] border border-white/10 hover:border-[#DF3131] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden cursor-pointer group block">
     <Image src="/images/danny-davis.png" alt="Danny Davis portrait" fill sizes="50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
   </Link>
   </div>
 </div>
 </div>
 </section>
 </ScrollReveal>

 {/* ═══ ABOUT FAOTM ═══ */}
 <ScrollReveal animation="fadeUp">
 <section className="py-16 bg-white dark:bg-[#111]">
 <div className="max-w-[115rem] mx-auto px-6 lg:px-12">
 <div className="text-center mb-12">
 <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#DF3131] block mb-2">WHAT IS FAOTM?</span>
 <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase text-[#333] dark:text-white mb-4">FEATURED ARTIST OF THE MONTH</h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <div className="p-8 bg-white dark:bg-white/5 border border-[#E2E2E2] dark:border-white/10 hover:border-[#DF3131]/50 transition-all duration-300 text-center">
  <span className="text-[#DF3131] font-heading font-bold text-[13px] tracking-[0.15em] uppercase block mb-2">What It Does</span>
  <h3 className="font-heading font-bold text-[#333] dark:text-white text-[18px] tracking-[0.04em] mb-3">Spotlight Creators</h3>
   <p className="text-[#666] dark:text-white/50 text-[14px] leading-relaxed">Every month, WYZ Design selects one artist to feature across our platform, giving them visibility, a dedicated page, and access to our audience.</p>
  </div>
  <div className="p-8 bg-white dark:bg-white/5 border border-[#E2E2E2] dark:border-white/10 hover:border-[#DF3131]/50 transition-all duration-300 text-center">
  <span className="text-[#DF3131] font-heading font-bold text-[13px] tracking-[0.15em] uppercase block mb-2">Why It Exists</span>
  <h3 className="font-heading font-bold text-[#333] dark:text-white text-[18px] tracking-[0.04em] mb-3">Lift Up Talent</h3>
  <p className="text-[#666] dark:text-white/50 text-[14px] leading-relaxed">Artists deserve a stage. FAOTM exists to bridge the gap between talented creators and the communities that need to see their work.</p>
  </div>
  <div className="p-8 bg-white dark:bg-white/5 border border-[#E2E2E2] dark:border-white/10 hover:border-[#DF3131]/50 transition-all duration-300 text-center">
  <span className="text-[#DF3131] font-heading font-bold text-[13px] tracking-[0.15em] uppercase block mb-2">How To Be Involved</span>
  <h3 className="font-heading font-bold text-[#333] dark:text-white text-[18px] tracking-[0.04em] mb-3">Apply Now</h3>
  <p className="text-[#666] dark:text-white/50 text-[14px] leading-relaxed">Submit your portfolio and bio below. Our team reviews every application and selects one artist each month to feature.</p>
  </div>
 </div>
  <div className="text-center mt-10">
  <button onClick={() => { setShowForm(true); setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100); }} className="inline-flex items-center gap-2 px-10 py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.12em] uppercase text-[15px] hover:bg-[#B82020] transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#DF3131]/30 cursor-pointer">
   TUNE IN <FiArrowRight className="w-5 h-5" />
   </button>
  </div>
 </div>
 </section>
 </ScrollReveal>

 {/* ═══ APPLICATION FORM (toggle) ═══ */}
 {showForm && (
 <ScrollReveal animation="fadeUp">
 <section ref={formRef} className="py-16 bg-white border-t border-[#E2E2E2]">
 <div className="max-w-2xl mx-auto px-6">
 <div className="text-center mb-8">
 <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#DF3131] block mb-2">APPLY NOW</span>
 <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase text-[#333] mb-4">FEATURED ARTIST APPLICATION</h2>
 </div>
 {submitted ? (
 <div className="text-center py-12">
 <div className="w-16 h-16 bg-[#DF3131] rounded-full flex items-center justify-center mx-auto mb-4">
 <span className="text-white text-2xl">✓</span>
 </div>
 <p className="font-heading font-bold text-[18px] tracking-[0.1em] uppercase text-[#333] mb-2">Application Submitted</p>
 <p className="text-[14px] text-[#666]">We&apos;ll review your submission and reach out within 48 hours.</p>
 </div>
 ) : (
 <form onSubmit={handleSubmit} className="space-y-4">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <input name="fullName" placeholder="Full Name *" aria-label="Full name" required value={formData.fullName} onChange={handleChange}
 className="px-4 py-3 border border-[#E2E2E2] text-[14px] placeholder:text-[#888] focus:border-[#DF3131] focus:ring-2 focus:ring-[#DF3131]/20 outline-none transition-all" />
 <input name="artistName" placeholder="Artist / Stage Name" aria-label="Artist or stage name" value={formData.artistName} onChange={handleChange}
 className="px-4 py-3 border border-[#E2E2E2] text-[14px] placeholder:text-[#888] focus:border-[#DF3131] focus:ring-2 focus:ring-[#DF3131]/20 outline-none transition-all" />
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <input name="email" placeholder="Email *" type="email" aria-label="Email address" required value={formData.email} onChange={handleChange}
 className="px-4 py-3 border border-[#E2E2E2] text-[14px] placeholder:text-[#888] focus:border-[#DF3131] focus:ring-2 focus:ring-[#DF3131]/20 outline-none transition-all" />
 <input name="socialMedia" placeholder="Social Media / Portfolio Link" aria-label="Social media or portfolio link" value={formData.socialMedia} onChange={handleChange}
 className="px-4 py-3 border border-[#E2E2E2] text-[14px] placeholder:text-[#888] focus:border-[#DF3131] focus:ring-2 focus:ring-[#DF3131]/20 outline-none transition-all" />
 </div>
 <textarea name="bio" placeholder="Tell us about yourself and your art *" aria-label="About your art" required value={formData.bio} onChange={handleChange}
 className="w-full px-4 py-3 border border-[#E2E2E2] text-[14px] placeholder:text-[#888] focus:border-[#DF3131] focus:ring-2 focus:ring-[#DF3131]/20 outline-none transition-all h-32 resize-none" />
 <div className="flex flex-wrap gap-4">
 <button type="submit" disabled={submitting} className="px-8 py-4 bg-[#DF3131] text-white text-[14px] font-bold tracking-[0.08em] hover:bg-[#B82020] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
 {submitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
 </button>
 <button type="button" onClick={() => setShowForm(false)} className="px-8 py-4 border-2 border-[#333] text-[#333] text-[14px] font-bold tracking-[0.08em] hover:bg-[#333] hover:text-white transition-all">
 CANCEL
 </button>
 </div>
 </form>
 )}
 </div>
 </section>
 </ScrollReveal>
 )}
 </main>
 );
}
