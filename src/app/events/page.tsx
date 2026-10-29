"use client";
import ServiceForm from "@/components/ServiceForm";
import HeroDots from "@/components/HeroDots";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShuffle } from "@/hooks/useShuffle";
import ScrollReveal from "@/components/ScrollReveal";
import EnhancedMarquee from "@/components/EnhancedMarquee";
import TextSplit from "@/components/TextSplit";
import AnimatedCounter from "@/components/AnimatedCounter";
import { getSiteUrl } from "@/lib/site-url";
import { VideoMuteProvider, VideoCarousel, VideoModal } from "@/components/events/EventsVideo";

import { ALL_EVENT_IMAGES, CLIENT_EVENTS_RAW, DIY_SHOWS_RAW } from "@/lib/data/events";

const ITEMS_PER_PAGE = 24;

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

  const LogoItem = ({ color, col, row }: { color: string; col: number; row: number }) => {
    // col/row map this logo's actual on-screen grid position (0-1 in each axis) so the
    // spotlight proximity is measured against where the item really sits, not a flattened
    // index that ignored which of the 8 marquee rows it was in.
    const dist = Math.sqrt(
      Math.pow((col % 8) / 7 - mousePos.x, 2) +
      Math.pow(row / 7 - mousePos.y, 2)
    );
    const proximity = isHovering ? Math.max(0, 1 - dist * 1.5) : 0;

    return (
      <div
        className="flex-none flex items-center gap-2 px-6 py-3 transition-all duration-300"
        style={{
          opacity: isHovering ? 0.2 + proximity * 0.8 : undefined,
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
  {/* 2026-10-10 (Claude, board K11): the dark overlay below was already
      unconditional (good, keep it always on). The red radial-gradient
      "spotlight" right after it was NOT gated on isHovering at all -- it
      always rendered, centered at the default mousePos (0.5, 0.5) whenever
      the cursor wasn't actively over the section, so a faint glow sat
      visible at rest instead of appearing only on hover. Fixed by fading
      it in/out with isHovering, same transition duration as the per-logo
      hover effects elsewhere in this component. */}
  <div className="absolute inset-0 z-0 bg-black/65" />
  <div
    className="absolute inset-0 z-[5] pointer-events-none transition-opacity duration-300"
    style={{
      opacity: isHovering ? 1 : 0,
      background: `radial-gradient(circle 280px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,0,0,0.18), transparent 70%)`,
    }}
  />

  <div className="absolute inset-0 z-10 flex flex-col justify-between gap-6 py-8 opacity-40">
  <div className="overflow-hidden py-3">
    <div className="flex whitespace-nowrap animate-marquee-left">
      {buildRow(ytRows, 8).map((logo, i) => (<LogoItem key={`r1-${i}`} color={logo.color} col={i} row={0} />))}
    </div>
  </div>
  <div className="overflow-hidden py-3">
    <div className="flex whitespace-nowrap animate-marquee-right">
      {buildRow([...ytRows].reverse(), 8).map((logo, i) => (<LogoItem key={`r2-${i}`} color={logo.color} col={i} row={1} />))}
    </div>
  </div>
  <div className="overflow-hidden py-3">
    <div className="flex whitespace-nowrap animate-marquee-left-fast">
      {buildRow(ytRows, 8).map((logo, i) => (<LogoItem key={`r3-${i}`} color={logo.color} col={i} row={2} />))}
    </div>
  </div>
  <div className="overflow-hidden py-3">
    <div className="flex whitespace-nowrap animate-marquee-right">
      {buildRow([...ytRows].reverse(), 8).map((logo, i) => (<LogoItem key={`r4-${i}`} color={logo.color} col={i} row={3} />))}
    </div>
  </div>
  <div className="overflow-hidden py-3">
    <div className="flex whitespace-nowrap animate-marquee-left">
      {buildRow(ytRows, 8).map((logo, i) => (<LogoItem key={`r5-${i}`} color={logo.color} col={i} row={4} />))}
    </div>
  </div>
  <div className="overflow-hidden py-3">
    <div className="flex whitespace-nowrap animate-marquee-right-fast">
      {buildRow([...ytRows].reverse(), 8).map((logo, i) => (<LogoItem key={`r6-${i}`} color={logo.color} col={i} row={5} />))}
    </div>
  </div>
  <div className="overflow-hidden py-3">
    <div className="flex whitespace-nowrap animate-marquee-left">
      {buildRow(ytRows, 8).map((logo, i) => (<LogoItem key={`r7-${i}`} color={logo.color} col={i} row={6} />))}
    </div>
  </div>
  <div className="overflow-hidden py-3">
    <div className="flex whitespace-nowrap animate-marquee-right">
      {buildRow([...ytRows].reverse(), 8).map((logo, i) => (<LogoItem key={`r8-${i}`} color={logo.color} col={i} row={7} />))}
    </div>
  </div>
  </div>

 <div className="relative z-20 flex flex-col items-center justify-center py-20 sm:py-28 px-6 text-center">
 <div className="yt-float mb-8">
 <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FF0000] flex items-center justify-center yt-pulse shadow-lg shadow-[#FF0000]/40">
 <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d={ytPath}/></svg>
 </div>
 </div>
 <h2 className="text-[2.25rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3.5rem] font-heading font-black text-white tracking-[0.08em] leading-tight mb-4">
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
<a href="https://www.youtube.com/@wyzdesign" target="_blank" rel="noopener noreferrer"
className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 bg-white text-[#111] border-2 border-white font-heading font-bold tracking-[0.12em] text-[12px] sm:text-[15px] text-center hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-all hover:scale-105">
VISIT CHANNEL
</a>
 </div>
  <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-12 mt-10 pt-8 border-t border-white/25">
 <AnimatedCounter end={90} suffix="+" label="Client Events" className="text-[2.1rem] sm:text-[2.8rem] font-heading font-black text-[#FF0000]" labelClassName="text-[11px] sm:text-[12px] text-white/40 tracking-[0.15em] uppercase" />
 <AnimatedCounter end={12} suffix="+" label="DIY Shows" className="text-[2.1rem] sm:text-[2.8rem] font-heading font-black text-[#FF0000]" labelClassName="text-[11px] sm:text-[12px] text-white/40 tracking-[0.15em] uppercase" />
 <AnimatedCounter end={600} suffix="+" label="Live Shows" className="text-[2.1rem] sm:text-[2.8rem] font-heading font-black text-[#FF0000]" labelClassName="text-[11px] sm:text-[12px] text-white/40 tracking-[0.15em] uppercase" />
 </div>
 </div>
 </div>
 );
}

export default function EventsPage() {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [modalVideo, setModalVideo] = useState<{ video: string; title: string } | null>(null);
  const [shuffled, setShuffled] = useState(ALL_EVENT_IMAGES);
  const [heroVideo, setHeroVideo] = useState("/videos/diy-shows/Action Sack Vol. 6.mp4");
 const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    setShuffled([...ALL_EVENT_IMAGES].sort(() => Math.random() - 0.5));
    const vids = DIY_SHOWS_RAW.filter(v => v.title !== "C.O. Reloaded Vol. 1");
    setHeroVideo(vids[Math.floor(Math.random() * vids.length)].video);
  }, []);
 const visibleEvents = shuffled.slice(0, visibleCount);
 const hasMore = visibleCount < shuffled.length;

 const shuffledClientEvents = useShuffle(CLIENT_EVENTS_RAW);
 const shuffledDiYShows = useShuffle(DIY_SHOWS_RAW);

 return (
  <VideoMuteProvider>
  <main className="pb-12 bg-white dark:bg-[#1C1C1E]">
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "WYZ Design Events",
        description: "DIY music shows, art shows, live event coverage, and creative meetups hosted by WYZ Design.",
        itemListElement: [
          ...DIY_SHOWS_RAW.slice(0, 5).map((event, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Event",
              name: event.title,
              organizer: { "@type": "Organization", name: "WYZ Design", url: getSiteUrl() },
              location: { "@type": "Place", name: "Chicago, IL" },
              eventStatus: "https://schema.org/EventCompleted",
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            },
          })),
          ...CLIENT_EVENTS_RAW.slice(0, 3).map((event, i) => ({
            "@type": "ListItem",
            position: DIY_SHOWS_RAW.length + i + 1,
            item: {
              "@type": "Event",
              name: event.title,
              organizer: { "@type": "Organization", name: "WYZ Design", url: getSiteUrl() },
              location: { "@type": "Place", name: "Chicago, IL" },
              eventStatus: "https://schema.org/EventCompleted",
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            },
          })),
        ],
      }),
    }}
  />
  <style>{`
 .hover-lift{transition:transform .3s ease,box-shadow .3s ease}
 .hover-lift:hover{transform:translateY(-4px);box-shadow:0 12px 24px rgba(0,0,0,.1)}
 .dark .hover-lift:hover{box-shadow:0 12px 24px rgba(0,0,0,.45)}
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
   <section className="relative -mt-20 lg:-mt-24 pt-20 lg:pt-24 min-h-screen overflow-hidden hero-banner">
      <HeroDots variant={3} />
{/* Single hero video - desktop and mobile previously rendered two separate
    <video autoPlay> elements of the same file (one hidden via `hidden md:block`,
    the other via `md:hidden`); both still downloaded/buffered regardless of
    which was visible, doubling the bandwidth cost of every hero load. The only
    real difference between them was the saturate/contrast filter, which now
    applies at the md breakpoint via a plain CSS class instead of a second
    element. */}
    <div className="absolute inset-0 z-0">
     <video
      key={heroVideo}
      src={heroVideo}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      style={{ opacity: heroReady ? 1 : 0, transition: "opacity 0.7s ease-in" }}
      className="absolute inset-0 w-full h-full object-cover md:[filter:saturate(1.2)_contrast(1.1)]"
      onCanPlay={(e) => { const v = e.currentTarget; if (v.currentTime < 4.5) v.currentTime = 5; void v.play().catch(() => {}); setHeroReady(true); }}
      onTimeUpdate={(e) => {
        // `loop` restarts silently at 0 without firing `ended`, so re-apply the
        // 5s start point whenever a loop cycle brings it back near the top.
        const vid = e.currentTarget;
        if (vid.currentTime < 0.5 && vid.dataset.wzLooped !== "pending") {
          vid.dataset.wzLooped = "pending";
          vid.currentTime = 5;
        } else if (vid.currentTime > 1) {
          vid.dataset.wzLooped = "";
        }
      }}
     />
     <div className="absolute inset-0 bg-black z-0" />
     <div className="absolute inset-0 bg-black/65 z-[1]" />
    </div>
{/* Text overlay */}
<div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 sm:px-10 lg:px-16 text-center">
    <div className="relative z-10">
      <h1 className="wz-stack text-[1.75rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-white tracking-[0.08em] mb-6 sm:mb-10 max-w-lg mx-auto" style={{ lineHeight: 0.9 }}>
     <span className="text-[#DF3131]"><TextSplit stagger={0.03} direction="up">SIMPLIFY</TextSplit></span> <TextSplit stagger={0.03} direction="up">YOUR</TextSplit><br />
     <TextSplit stagger={0.03} direction="up">EVENT</TextSplit> <span className="text-[#DF3131]"><TextSplit stagger={0.03} direction="up">PLANNING</TextSplit></span>
    </h1>
   <p className="text-[16px] sm:text-[16px] lg:text-[17px] text-white/70 max-w-[calc(100vw-3rem)] sm:max-w-sm leading-relaxed mb-8 sm:mb-10 mx-auto">
   Let our team handle the planning, from the first idea to the final encore. You&apos;ll get an event that&apos;s easy, stress-free, and unforgettable.
   </p>
   <Link href="/booking" className="inline-block px-6 sm:px-10 py-3 sm:py-4 bg-white text-[#111] border-2 border-white text-[12px] sm:text-[15px] font-bold tracking-[0.12em] text-center hover:bg-[#DF3131] hover:text-white hover:border-[#DF3131] transition-all mt-2 sm:mt-4">
   BOOK NOW
    </Link>
   <Link href="/events/gallery" className="inline-block px-6 sm:px-10 py-3 sm:py-4 bg-transparent text-white border-2 border-white/60 text-[12px] sm:text-[15px] font-bold tracking-[0.12em] text-center hover:bg-white hover:text-[#111] transition-all mt-3 sm:mt-4 sm:ml-4">
   PHOTO GALLERIES
    </Link>
    </div>
   </div>
   </section>
  </ScrollReveal>

{/* ═══ EVENTS MARQUEE ═══ */}
  <section className="py-3 sm:py-6">
  <EnhancedMarquee speed="semislow" pauseOnHover gradientFade className="bg-white dark:bg-[#1C1C1E]">
    {(["CONCERTS","DIY SHOWS","MIXERS","ART SHOWS","RECAPS","LIVE COVERAGE"] as const).map((word, i) => {
      const M = ["text-[#DF3131]", "text-[#111] dark:text-white", "marquee-outline", "text-[#6E6E6E] dark:text-[#666]"];
      return (
        <span key={i} className="inline-flex items-center">
          <span className={`inline-flex items-center text-[1.25rem] sm:text-[1.75rem] font-heading font-black tracking-[0.08em] uppercase px-4 sm:px-6 ${M[(i + 1) % 4]}`}>{word}</span>
          <span className="inline-flex items-center text-[1.25rem] sm:text-[1.75rem] font-heading font-black tracking-[0.08em] uppercase px-4 sm:px-6 opacity-50 text-[#111] dark:text-white">&bull;</span>
        </span>
      );
    })}
  </EnhancedMarquee>
  </section>

{/* ═══ 2. Sign-Up ═══ */}
 <ScrollReveal animation="foldDown" duration={1.0}>
 <div className="relative overflow-hidden bg-black">
   <Image src="/concert-crowd.jpg" alt="Concert Crowd" fill sizes="100vw" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.7 }} priority />
   <div className="absolute inset-0 bg-black/30 z-[1]" />
  <div className="relative z-10 flex flex-col items-center justify-center py-12 sm:py-16 px-6 text-center">
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
  <h2 className="text-[1.05rem] sm:text-[1.225rem] md:text-[1.4rem] lg:text-[1.75rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.08em] mb-4">PREVIOUS EVENTS</h2>
  <p className="text-[14px] text-[#666] dark:text-[#b0b0b0] mt-2 tracking-wider">ALL FLYERS/EVENTS DESIGNED BY WYZ DESIGN</p>
 </div>
  <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2">
  {visibleEvents.map((e) => (
  <div key={e.title} className="group cursor-pointer relative overflow-hidden bg-[#f5f5f5] dark:bg-[#252528] mb-2 break-inside-avoid">
  <Image src={e.img} alt={e.title} width={400} height={300} className="w-full h-full object-cover group-hover:scale-95 transition-transform duration-500" loading="lazy"
  onError={(ev) => { (ev.target as HTMLImageElement).style.display = 'none'; }} />
  <div className="absolute inset-0 bg-black/50 pointer-events-none" />
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.28), rgba(0,0,0,0) 62%)" }} />
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
 <ServiceForm
  services={["Event Coverage", "Event Photography", "Recap Video", "Full Event Production", "Artist Coordination"]}
  formType="booking"
  title="Book Event Coverage"
  subtitle="Tell us the event, the date, and what you need covered."
  submitLabel="REQUEST COVERAGE"
 />
 </main>
 </VideoMuteProvider>
 );
}
