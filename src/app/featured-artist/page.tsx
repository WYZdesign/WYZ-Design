"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiUser, FiEdit3, FiCalendar, FiMapPin, FiHeart, FiArrowRight, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ScrollReveal from "@/components/ScrollReveal";

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
  <Image src={item.src} alt={item.label} fill className="w-full h-full object-cover" priority />
 ) : (
 <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#DF3131]/5 to-[#D49341]/5">
 <span className="text-[#DF3131]/30 text-[13px] font-bold tracking-[0.1em] uppercase">{item.label}</span>
 </div>
 )
 )}
 <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
 <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
 <span className="text-white text-[12px] font-bold tracking-[0.15em] uppercase drop-shadow-md">{item.label}</span>
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
 const [showForm, setShowForm] = useState(false);
 const [formData, setFormData] = useState({ fullName: "", artistName: "", email: "", socialMedia: "", bio: "" });
 const [submitted, setSubmitted] = useState(false);
 const formRef = useRef<HTMLDivElement>(null);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
 setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 const form = e.target as HTMLFormElement;
 const fd = new FormData(form);
 const data: Record<string, string> = {};
 fd.forEach((v, k) => { data[k] = v as string; });
 try {
 await fetch("/api/forms", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ formType: "featured-artist-application", data: { ...data, submittedAt: new Date().toISOString() } }),
 });
 } catch (e) { console.warn("[featured-artist-page] Application submit failed", e); }
 setSubmitted(true);
 };

 return (
 <main className="pt-0 pb-0 bg-white">
 {/* ═══ HERO — Full biography split ═══ */}
 <section className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden">
 {/* Left: Image */}
 <div className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-screen bg-white dark:bg-[#111] flex items-center justify-center overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-br from-[#DF3131]/20 via-[#FFFFFF] dark:via-[#111] to-[#DF3131]/10" />
 <Image src="/images/danny-davis.png" alt="Donte 'Danny' Davis" width={800} height={1067} className="relative z-10 w-full lg:w-[85%] aspect-[3/4] max-w-full lg:max-w-lg object-cover object-top border border-[#E2E2E2] dark:border-white/10 shadow-2xl shadow-black/50" priority />
 <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] dark:from-[#111]/80 via-transparent to-[#FFFFFF]/30 dark:to-[#111]/30 z-20" />
 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#FFFFFF] dark:to-[#111] hidden lg:block z-20" />
 <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#FFFFFF] dark:from-[#111] to-transparent lg:hidden z-20" />
 </div>

 {/* Right: Biography text on dark bg */}
 <div className="w-full lg:w-1/2 flex items-center bg-white dark:bg-[#111] px-10 lg:px-16 xl:px-24 py-16 lg:py-0 relative z-10">
  <div className="max-w-xl text-center lg:text-center">
  <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#DF3131] mb-4 block">FEATURED ARTIST OF THE MONTH</span>
  <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] max-sm:text-[2.8rem] font-heading font-black text-[#333] dark:text-white tracking-[0.04em] mb-6" style={{ lineHeight: 1 }}>DONTE<br />&quot;DANNY&quot;<br />DAVIS</h1>
 <div className="w-16 h-[3px] bg-[#DF3131] mb-6 mx-auto lg:mx-0" />
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
  <Link href="" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#E2E2E2] dark:border-white/30 text-[#333] dark:text-white font-heading font-bold tracking-[0.12em] uppercase text-[14px] hover:border-[#333] dark:hover:border-white/60 hover:text-[#333] dark:hover:text-white transition-all">
  TUNE IN
  </Link>
  </div>
  <div className="flex gap-5 justify-center mt-6">
  <a href="#" className="text-[#333] dark:text-white hover:text-[#DF3131] dark:hover:text-[#DF3131] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
  <a href="#" className="text-[#333] dark:text-white hover:text-[#DF3131] dark:hover:text-[#DF3131] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
  <a href="#" className="text-[#333] dark:text-white hover:text-[#DF3131] dark:hover:text-[#DF3131] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.43v-7.15a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-4.86-4.86h4.86z"/></svg></a>
  <a href="#" className="text-[#333] dark:text-white hover:text-[#DF3131] dark:hover:text-[#DF3131] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L8.32 13.617l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/></svg></a>
  <a href="#" className="text-[#333] dark:text-white hover:text-[#DF3131] dark:hover:text-[#DF3131] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg></a>
  </div>
 </div>
 </div>
 </section>

 {/* ═══ 5 Ws — Biography-style flow ═══ */}
 <ScrollReveal animation="fadeUp">
 <section className="py-16 bg-white">
 <div className="max-w-[80rem] mx-auto px-6 lg:px-12">
 <div className="text-center mb-12">
 <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#DF3131] mb-3 block">THE BASICS</span>
 <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase text-[#333]">GET TO KNOW THE ARTIST</h2>
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
 <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#DF3131]">{w.label}</span>
 </div>
 <div className="flex-1">
 <h3 className="font-heading font-bold text-[#333] text-[16px] tracking-[0.03em] mb-1">{w.value}</h3>
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
 <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#DF3131] mb-3 block">SUPPORT THE ARTIST</span>
 <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase text-white mb-3">ART STORE</h2>
 <p className="text-white/60 text-[15px] leading-relaxed mb-6">
 Support this month&apos;s featured artist by browsing and purchasing original artwork, prints, and custom pieces. Every purchase directly supports the artist.
 </p>
 <div className="flex flex-wrap gap-4 justify-center">
 <Link href="/merch" className="inline-flex items-center gap-2 px-8 py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.12em] uppercase text-[14px] hover:bg-[#B82020] transition-all hover:shadow-lg hover:shadow-[#DF3131]/30">
 BROWSE SHOP <FiArrowRight className="w-4 h-4" />
 </Link>
 <Link href="/designs" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-heading font-bold tracking-[0.12em] uppercase text-[14px] hover:bg-white hover:text-[#111] transition-all">
 CUSTOM ORDERS
 </Link>
 </div>
 </div>
 {/* Art preview grid */}
 <div className="grid grid-cols-2 gap-3">
 <Link href="/merch" className="aspect-square bg-[#1a1a1a] border border-white/10 hover:border-[#DF3131] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden cursor-pointer group">
 <Image src="/images/faotm_1.jpg" alt="Featured artwork" fill className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" priority />
 </Link>
 <Link href="/merch" className="aspect-square bg-[#1a1a1a] border border-white/10 hover:border-[#DF3131] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden cursor-pointer group">
 <Image src="/images/faotm_2.jpg" alt="Featured artwork" fill className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" priority />
 </Link>
 <Link href="/merch" className="aspect-square bg-[#1a1a1a] border border-white/10 hover:border-[#DF3131] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden cursor-pointer group">
 <Image src="/images/faotm_3.jpg" alt="Featured artwork" fill className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" priority />
 </Link>
 <Link href="/merch" className="aspect-square bg-[#1a1a1a] border border-white/10 hover:border-[#DF3131] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden cursor-pointer group">
 <Image src="/images/danny-davis.png" alt="Danny Davis portrait" fill className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" priority />
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
 <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#DF3131] mb-3 block">WHAT IS FAOTM?</span>
 <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase text-[#333] dark:text-white">FEATURED ARTIST OF THE MONTH</h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <div className="p-8 bg-white dark:bg-white/5 border border-[#E2E2E2] dark:border-white/10 hover:border-[#DF3131]/50 transition-all duration-300 text-center">
  <span className="text-[#DF3131] font-heading font-bold text-[13px] tracking-[0.15em] uppercase mb-3 block">What It Does</span>
  <h3 className="font-heading font-bold text-[#333] dark:text-white text-[18px] tracking-[0.04em] mb-3">Spotlight Creators</h3>
   <p className="text-[#666] dark:text-white/50 text-[14px] leading-relaxed">Every month, WYZ Design selects one artist to feature across our platform, giving them visibility, a dedicated page, and access to our audience.</p>
  </div>
  <div className="p-8 bg-white dark:bg-white/5 border border-[#E2E2E2] dark:border-white/10 hover:border-[#DF3131]/50 transition-all duration-300 text-center">
  <span className="text-[#DF3131] font-heading font-bold text-[13px] tracking-[0.15em] uppercase mb-3 block">Why It Exists</span>
  <h3 className="font-heading font-bold text-[#333] dark:text-white text-[18px] tracking-[0.04em] mb-3">Elevate Talent</h3>
  <p className="text-[#666] dark:text-white/50 text-[14px] leading-relaxed">Artists deserve a stage. FAOTM exists to bridge the gap between talented creators and the communities that need to see their work.</p>
  </div>
  <div className="p-8 bg-white dark:bg-white/5 border border-[#E2E2E2] dark:border-white/10 hover:border-[#DF3131]/50 transition-all duration-300 text-center">
  <span className="text-[#DF3131] font-heading font-bold text-[13px] tracking-[0.15em] uppercase mb-3 block">How To Be Involved</span>
  <h3 className="font-heading font-bold text-[#333] dark:text-white text-[18px] tracking-[0.04em] mb-3">Apply Now</h3>
  <p className="text-[#666] dark:text-white/50 text-[14px] leading-relaxed">Submit your portfolio and bio below. Our team reviews every application and selects one artist each month to feature.</p>
  </div>
 </div>
  <div className="text-center mt-10">
  <Link href="" className="inline-flex items-center gap-2 px-10 py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.12em] uppercase text-[15px] hover:bg-[#B82020] transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#DF3131]/30">
  TUNE IN <FiArrowRight className="w-5 h-5" />
  </Link>
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
 <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#DF3131] mb-3 block">APPLY NOW</span>
 <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase text-[#333]">FEATURED ARTIST APPLICATION</h2>
 </div>
 {submitted ? (
 <div className="text-center py-12">
 <div className="w-16 h-16 bg-[#DF3131] rounded-full flex items-center justify-center mx-auto mb-4">
 <span className="text-white text-2xl">✓</span>
 </div>
 <p className="font-heading font-bold text-[18px] tracking-[0.1em] uppercase text-[#333] mb-2">Application Submitted</p>
 <p className="text-[14px] text-[#888]">We&apos;ll review your submission and reach out within 48 hours.</p>
 </div>
 ) : (
 <form onSubmit={handleSubmit} className="space-y-4">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <input name="fullName" placeholder="Full Name *" required value={formData.fullName} onChange={handleChange}
 className="px-4 py-3 border border-[#E2E2E2] text-[14px] placeholder:text-[#888] focus:border-[#DF3131] focus:ring-2 focus:ring-[#DF3131]/20 outline-none transition-all" />
 <input name="artistName" placeholder="Artist / Stage Name" value={formData.artistName} onChange={handleChange}
 className="px-4 py-3 border border-[#E2E2E2] text-[14px] placeholder:text-[#888] focus:border-[#DF3131] focus:ring-2 focus:ring-[#DF3131]/20 outline-none transition-all" />
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <input name="email" placeholder="Email *" type="email" required value={formData.email} onChange={handleChange}
 className="px-4 py-3 border border-[#E2E2E2] text-[14px] placeholder:text-[#888] focus:border-[#DF3131] focus:ring-2 focus:ring-[#DF3131]/20 outline-none transition-all" />
 <input name="socialMedia" placeholder="Social Media / Portfolio Link" value={formData.socialMedia} onChange={handleChange}
 className="px-4 py-3 border border-[#E2E2E2] text-[14px] placeholder:text-[#888] focus:border-[#DF3131] focus:ring-2 focus:ring-[#DF3131]/20 outline-none transition-all" />
 </div>
 <textarea name="bio" placeholder="Tell us about yourself and your art *" required value={formData.bio} onChange={handleChange}
 className="w-full px-4 py-3 border border-[#E2E2E2] text-[14px] placeholder:text-[#888] focus:border-[#DF3131] focus:ring-2 focus:ring-[#DF3131]/20 outline-none transition-all h-32 resize-none" />
 <div className="flex flex-wrap gap-4">
 <button type="submit" className="px-8 py-4 bg-[#DF3131] text-white text-[14px] font-bold tracking-[0.08em] hover:bg-[#B82020] transition-all">
 SUBMIT APPLICATION
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
