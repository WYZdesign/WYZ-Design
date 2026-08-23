"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FiUser, FiSend, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ImageHoverReveal from "@/components/ImageHoverReveal";

const MODELS = [
 { name: "ADRIENNE", img: "/images/models/ADRIENNE.jpg" },
 { name: "AECH DOT", img: "/images/models/AECH_DOT.jpg" },
 { name: "AJA", img: "/images/models/AJA.jpg" },
 { name: "ALEXANDRIA", img: "/images/models/ALEXANDRIA.JPG" },
 { name: "ANGEL", img: "/images/models/ANGEL.JPG" },
 { name: "ANGELICA", img: "/images/models/ANGELICA.JPG" },
 { name: "ANTHONIA", img: "/images/models/ANTHONIA.JPG" },
 { name: "ARCANA", img: "/images/models/ARCANA.JPG" },
 { name: "ASH", img: "/images/models/ASH.jpg" },
 { name: "ASHONDI", img: "/images/models/ASHONDI.jpg" },
 { name: "AUDREY", img: "/images/models/AUDREY.jpg" },
 { name: "BRIAN", img: "/images/models/BRIAN.JPG" },
 { name: "BRIYANNA", img: "/images/models/BRIYANNA.JPG" },
 { name: "BROCK", img: "/images/models/BROCK.JPG" },
 { name: "BROOK", img: "/images/models/BROOK.jpg" },
 { name: "BROOKE", img: "/images/models/BROOKE.JPG" },
 { name: "BRYSON", img: "/images/models/BRYSON.jpg" },
 { name: "CAMILLE", img: "/images/models/CAMILLE.JPG" },
 { name: "CHER", img: "/images/models/CHER.jpg" },
 { name: "CHHAVI", img: "/images/models/CHHAVI.JPG" },
 { name: "CITLALI", img: "/images/models/CITLALI.JPG" },
 { name: "CLAIRE", img: "/images/models/CLAIRE.jpg" },
 { name: "CLAUDIA", img: "/images/models/CLAUDIA.jpg" },
 { name: "CORI", img: "/images/models/CORI.JPG" },
 { name: "CRISTINA", img: "/images/models/CRISTINA.JPG" },
 { name: "CRYSTAL", img: "/images/models/CRYSTAL.JPG" },
 { name: "DANIELLE", img: "/images/models/DANIELLE.JPG" },
 { name: "DARRYL", img: "/images/models/DARRYL.jpg" },
 { name: "DEKETRA", img: "/images/models/DEKETRA.jpg" },
 { name: "DOT", img: "/images/models/DOT.jpg" },
 { name: "DRAKE", img: "/images/models/DRAKE.JPG" },
 { name: "EBONIE", img: "/images/models/EBONIE.JPG" },
 { name: "EBONY", img: "/images/models/EBONY.JPG" },
 { name: "EDEN", img: "/images/models/EDEN.JPG" },
 { name: "FARREN", img: "/images/models/FARREN.jpg" },
 { name: "FLUFFY", img: "/images/models/FLUFFY.jpg" },
 { name: "GREYSON", img: "/images/models/GREYSON.jpg" },
 { name: "HANNAH", img: "/images/models/HANNAH.jpg" },
 { name: "HEADY", img: "/images/models/HEADY.jpg" },
 { name: "IVY", img: "/images/models/IVY.jpg" },
 { name: "J. RED", img: "/images/models/J.RED.JPG" },
 { name: "JANELLE", img: "/images/models/JANELLE.JPG" },
 { name: "JATOHN", img: "/images/models/JATOHN.jpg" },
 { name: "JEREMY", img: "/images/models/JEREMY.jpg" },
 { name: "JERMAINE", img: "/images/models/JERMAINE.jpg" },
 { name: "JIMMY", img: "/images/models/JIMMY.JPG" },
 { name: "JORDAN", img: "/images/models/JORDAN.JPG" },
 { name: "KATARA", img: "/images/models/KATARA.jpg" },
 { name: "KATHRYN", img: "/images/models/KATHRYN.jpg" },
 { name: "KAYLEN", img: "/images/models/KAYLEN.jpg" },
 { name: "KIDLYN", img: "/images/models/KIDLYN.JPG" },
 { name: "LAUREN", img: "/images/models/LAUREN.JPG" },
 { name: "LAUSHERN", img: "/images/models/LAUSHERN.JPG" },
 { name: "LORIE", img: "/images/models/LORIE.jpg" },
 { name: "MALIKA", img: "/images/models/MALIKA.jpg" },
 { name: "MARISSA", img: "/images/models/MARISSA.JPG" },
 { name: "MARSHAWNA", img: "/images/models/MARSHAWNA.JPG" },
 { name: "MAYA", img: "/images/models/MAYA.jpg" },
 { name: "MITRI", img: "/images/models/MITRI.jpg" },
 { name: "MONICA", img: "/images/models/MONICA.JPG" },
 { name: "NAKIA", img: "/images/models/NAKIA.jpg" },
 { name: "NIK", img: "/images/models/NIK.jpg" },
 { name: "NIYAH", img: "/images/models/NIYAH.JPG" },
 { name: "ODU", img: "/images/models/ODU.jpg" },
 { name: "PEYTON", img: "/images/models/PEYTON.JPG" },
 { name: "PRADIA", img: "/images/models/PRADIA.JPG" },
 { name: "QUANISHA", img: "/images/models/QUANISHA.JPG" },
 { name: "RANISHA", img: "/images/models/RANISHA.jpg" },
 { name: "REBECCA", img: "/images/models/REBECCA.JPG" },
 { name: "ROBERT", img: "/images/models/ROBERT.JPG" },
 { name: "ROY", img: "/images/models/ROY.jpg" },
 { name: "SIMONE", img: "/images/models/SIMONE.jpg" },
 { name: "STAR", img: "/images/models/STAR.jpg" },
 { name: "SYDNEY", img: "/images/models/SYDNEY.JPG" },
 { name: "SYETA", img: "/images/models/SYETA.JPG" },
 { name: "TE'JUAN", img: "/images/models/TE_JUAN.JPG" },
 { name: "TED + SYLVIA", img: "/images/models/TED___SYLVIA.jpg" },
 { name: "TEREZA", img: "/images/models/TEREZA.jpg" },
 { name: "TONI", img: "/images/models/TONI.jpg" },
 { name: "TORREE", img: "/images/models/TORREE.jpg" },
 { name: "TOSH", img: "/images/models/TOSH.jpg" },
 { name: "TYLIN", img: "/images/models/TYLIN.jpg" },
 { name: "VAHN", img: "/images/models/VAHN.JPG" },
 { name: "VERONICA", img: "/images/models/VERONICA.JPG" },
 { name: "WESLEY", img: "/images/models/WESLEY.jpg" },
 { name: "WOLF", img: "/images/models/WOLF.jpg" },
 { name: "XOCHI", img: "/images/models/XOCHI.JPG" },
];

export default function ModelArchivePage() {
 const [search, setSearch] = useState("");
 const [showApply, setShowApply] = useState(false);
 const [formData, setFormData] = useState({ name: "", email: "", phone: "", experience: "", message: "" });
 const [submitted, setSubmitted] = useState(false);
 const [selectedModel, setSelectedModel] = useState<string | null>(null);
 const [albumImages, setAlbumImages] = useState<string[]>([]);
 const [albumLoading, setAlbumLoading] = useState(false);
 const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
 const filtered = MODELS.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

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
 body: JSON.stringify({ formType: "model-application", data: { ...data, submittedAt: new Date().toISOString() } }),
 });
 } catch (e) { console.warn("[model-archive-page] Application submit failed", e); }
 setSubmitted(true);
 };

 const loadAlbum = useCallback(async (modelName: string) => {
 setSelectedModel(modelName);
 setAlbumLoading(true);
 setAlbumImages([]);
 window.scrollTo({ top: 0, behavior: "smooth" });
 try {
 const res = await fetch(`/api/album-images?album=${encodeURIComponent(modelName)}`);
 const data = await res.json();
 setAlbumImages(data.images || []);
 } catch {
 setAlbumImages([]);
 } finally {
 setAlbumLoading(false);
 }
 }, []);

 const closeAlbum = useCallback(() => {
 setSelectedModel(null);
 setAlbumImages([]);
 setLightboxIdx(null);
 }, []);

 useEffect(() => {
 if (lightboxIdx === null) return;
 const handler = (e: KeyboardEvent) => {
 if (e.key === "Escape") setLightboxIdx(null);
 if (e.key === "ArrowRight" && lightboxIdx < albumImages.length - 1) setLightboxIdx(i => i! + 1);
 if (e.key === "ArrowLeft" && lightboxIdx > 0) setLightboxIdx(i => i! - 1);
 };
 window.addEventListener("keydown", handler);
 return () => window.removeEventListener("keydown", handler);
 }, [lightboxIdx, albumImages.length]);

 return (
 <main className="pb-16 bg-white dark:bg-[#111]">
 <div className="max-w-[115rem] mx-auto px-6 lg:px-12 pt-32 lg:pt-40">
 {/* Header */}
 <div className="mb-8 text-center">
 <h1 className="text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[4rem] font-heading font-black text-[#333] dark:text-white tracking-[0.08em] sm:tracking-[0.15em] mb-6 sm:mb-8" style={{ lineHeight: 1 }}>M O D E L . A R C H I V E</h1>
 <p className="text-[#666] dark:text-white/50 text-sm mt-2">Every talent who has graced our lens, {MODELS.length} models and counting</p>
 </div>

 {/* Toggle Buttons */}
 <div className="flex flex-wrap gap-3 mb-8 justify-center">
 <button
 onClick={() => { setShowApply(false); closeAlbum(); }}
 className={`px-8 py-4 text-[14px] font-bold tracking-[0.12em] transition-all border-2 ${
 !showApply 
 ? "bg-white text-[#111] border-white" 
 : "bg-transparent text-[#333] dark:text-white border-[#E2E2E2] dark:border-white/30 hover:border-[#333] dark:hover:border-white/60"
 }`}
 >
 VIEW MODELS
 </button>
 <button
 onClick={() => { setShowApply(true); closeAlbum(); }}
 className={`px-8 py-4 text-[14px] font-bold tracking-[0.12em] transition-all border-2 ${
 showApply 
 ? "bg-[#DF3131] text-white border-[#DF3131]" 
 : "bg-transparent text-[#333] dark:text-white border-[#E2E2E2] dark:border-white/30 hover:border-[#DF3131] hover:text-[#DF3131]"
 }`}
 >
 BECOME A MODEL
 </button>
 </div>

 {/* Model Grid */}
 {!showApply && !selectedModel && (
 <>
 <input type="text" placeholder="Search models..." value={search} onChange={e => setSearch(e.target.value)}
 className="w-full max-w-md px-5 py-3 bg-[#F5F5F3] dark:bg-white/10 border border-[#E2E2E2] dark:border-white/20 rounded-full text-[#333] dark:text-white placeholder-[#888] dark:placeholder-white/40 text-sm outline-none focus:border-[#DF3131] transition-colors mb-8" />
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
  {filtered.map((m, i) => (
  <ImageHoverReveal key={i}>
  <div onClick={() => loadAlbum(m.name)}
  className="group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer">
   <Image src={m.img} alt={m.name} fill className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" priority />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-opacity" />
  <div className="absolute bottom-0 left-0 right-0 p-3 sm:translate-y-full sm:group-hover:translate-y-0 translate-y-0 transition-transform">
  <p className="text-white text-xs font-bold tracking-[0.15em] mb-2">{m.name}</p>
  </div>
  </div>
  </ImageHoverReveal>
  ))}
 </div>
 {filtered.length === 0 && <p className="text-center text-[#888] dark:text-white/40 py-20">No models match your search.</p>}
 </>
 )}

 {/* Album View */}
 {!showApply && selectedModel && (
 <div>
 <button onClick={closeAlbum} className="flex items-center gap-2 text-[#666] dark:text-white/60 hover:text-[#333] dark:hover:text-white text-sm mb-6 transition-colors">
 <FiChevronLeft className="w-4 h-4" /> BACK TO ALL MODELS
 </button>
 <h2 className="text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] font-heading font-black text-[#333] dark:text-white tracking-[0.08em] mb-4">{selectedModel}</h2>
 <p className="text-[#666] dark:text-white/50 text-sm mb-8">{albumImages.length} photos</p>
 {albumLoading ? (
 <div className="flex items-center justify-center py-20">
 <div className="w-8 h-8 border-2 border-[#E2E2E2] dark:border-white/20 border-t-[#DF3131] rounded-full animate-spin" />
 </div>
 ) : albumImages.length === 0 ? (
 <p className="text-center text-[#888] dark:text-white/40 py-20">No images found in this model&apos;s album.</p>
 ) : (
 <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 space-y-3">
 {albumImages.map((src, i) => (
 <div key={i} onClick={() => setLightboxIdx(i)}
 className="break-inside-avoid cursor-pointer group">
  <Image src={src} alt={`${selectedModel}`} width={400} height={533} className="w-full object-cover rounded-sm group-hover:opacity-80 transition-opacity" priority />
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {/* Become A Model Form */}
 {showApply && (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
 {/* Left: Info */}
 <div className="text-[#333] dark:text-white">
 <h2 className="text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-heading font-black tracking-[0.08em] mb-4">
 JOIN OUR <span className="text-[#DF3131]">ROSTER</span>
 </h2>
 <p className="text-[#666] dark:text-white/70 text-[16px] leading-relaxed mb-8">
 WYZ Design is always looking for fresh talent. Whether you&apos;re an experienced professional or just starting out, we want to see what you&apos;ve got. Submit your info below and our team will review your submission.
 </p>
 <div className="space-y-6">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#DF3131] text-white text-xl font-bold">1</div>
 <div>
 <h3 className="font-heading font-bold text-[#333] dark:text-white text-lg tracking-[0.05em] mb-3">SUBMIT YOUR INFO</h3>
 <p className="text-[#666] dark:text-white/60 text-sm">Fill out the form with your details and a few photos.</p>
 </div>
 </div>
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#DF3131] text-white text-xl font-bold">2</div>
 <div>
 <h3 className="font-heading font-bold text-[#333] dark:text-white text-lg tracking-[0.05em] mb-3">REVIEW PROCESS</h3>
 <p className="text-[#666] dark:text-white/60 text-sm">Our team reviews every submission within 48 hours.</p>
 </div>
 </div>
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#DF3131] text-white text-xl font-bold">3</div>
 <div>
 <h3 className="font-heading font-bold text-[#333] dark:text-white text-lg tracking-[0.05em] mb-3">GET BOOKED</h3>
 <p className="text-[#666] dark:text-white/60 text-sm">Approved models get added to our roster and start receiving bookings.</p>
 </div>
 </div>
 </div>
 </div>

 {/* Right: Form */}
 <div className="bg-white dark:bg-white/5 border border-[#E2E2E2] dark:border-white/10 p-8">
 {submitted ? (
 <div className="text-center py-12">
 <div className="w-16 h-16 mx-auto flex items-center justify-center bg-green-500 text-white text-3xl font-bold mb-4">✓</div>
 <h3 className="font-heading font-bold text-[#333] dark:text-white text-xl tracking-[0.05em] mb-3">APPLICATION SUBMITTED</h3>
 <p className="text-[#666] dark:text-white/60 text-sm">We&apos;ll review your submission and get back to you within 48 hours.</p>
 <button onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", phone: "", experience: "", message: "" }); }} className="mt-6 px-6 py-3 border border-[#E2E2E2] dark:border-white/30 text-[#333] dark:text-white text-sm font-bold tracking-[0.1em] hover:bg-[#F5F5F3] dark:hover:bg-white/10 transition-colors">
 SUBMIT ANOTHER
 </button>
 </div>
 ) : (
 <form onSubmit={handleSubmit} className="space-y-4">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <input name="fullName" placeholder="Full Name *" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
 className="px-4 py-3 bg-[#F5F5F3] dark:bg-white/5 border border-[#E2E2E2] dark:border-white/20 text-[#333] dark:text-white placeholder-[#888] dark:placeholder-white/40 text-sm outline-none focus:border-[#DF3131] transition-colors" />
 <input name="email" placeholder="Email *" type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
 className="px-4 py-3 bg-[#F5F5F3] dark:bg-white/5 border border-[#E2E2E2] dark:border-white/20 text-[#333] dark:text-white placeholder-[#888] dark:placeholder-white/40 text-sm outline-none focus:border-[#DF3131] transition-colors" />
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <input name="phone" placeholder="Phone" type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
 className="px-4 py-3 bg-[#F5F5F3] dark:bg-white/5 border border-[#E2E2E2] dark:border-white/20 text-[#333] dark:text-white placeholder-[#888] dark:placeholder-white/40 text-sm outline-none focus:border-[#DF3131] transition-colors" />
 <select name="experience" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })}
 className="px-4 py-3 bg-[#F5F5F3] dark:bg-white/5 border border-[#E2E2E2] dark:border-white/20 text-[#333] dark:text-white/60 text-sm outline-none focus:border-[#DF3131] transition-colors">
 <option value="">Experience Level</option>
 <option value="none">No Experience</option>
 <option value="beginner">Beginner (1-2 shoots)</option>
 <option value="intermediate">Intermediate (3-10 shoots)</option>
 <option value="experienced">Experienced (10+ shoots)</option>
 <option value="professional">Professional</option>
 </select>
 </div>
 <textarea name="message" placeholder="Tell us about yourself and your modeling goals..." rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
 className="w-full px-4 py-3 bg-[#F5F5F3] dark:bg-white/5 border border-[#E2E2E2] dark:border-white/20 text-[#333] dark:text-white placeholder-[#888] dark:placeholder-white/40 text-sm outline-none focus:border-[#DF3131] transition-colors resize-none" />
 <button type="submit" className="w-full py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.12em] uppercase hover:bg-[#B82020] transition-colors flex items-center justify-center gap-2">
 <FiSend className="w-4 h-4" /> BE A MODEL
 </button>
 </form>
 )}
 </div>
 </div>
 )}
 </div>

 {/* Full-size Image Lightbox */}
 {lightboxIdx !== null && albumImages.length > 0 && (
 <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxIdx(null)}>
 <button onClick={() => setLightboxIdx(null)} className="absolute top-4 right-4 text-white/70 hover:text-white z-10">
 <FiX className="w-8 h-8" />
 </button>
 {lightboxIdx > 0 && (
 <button onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => i! - 1); }}
 className="absolute left-4 text-white/70 hover:text-white z-10">
 <FiChevronLeft className="w-10 h-10" />
 </button>
 )}
 {lightboxIdx < albumImages.length - 1 && (
 <button onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => i! + 1); }}
 className="absolute right-4 text-white/70 hover:text-white z-10">
 <FiChevronRight className="w-10 h-10" />
 </button>
 )}
 <img src={albumImages[lightboxIdx]} alt={`${selectedModel} ${lightboxIdx + 1}`}
 width={900} height={1200}
 className="max-h-[90vh] max-w-[90vw] object-contain" onClick={(e) => e.stopPropagation()} />
 <div className="absolute bottom-4 text-white/50 text-sm">{lightboxIdx + 1} / {albumImages.length}</div>
 </div>
 )}
 </main>
 );
}
