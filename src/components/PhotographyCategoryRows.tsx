"use client";

import { useEffect, useRef } from "react";
import SafeImage from "@/components/SafeImage";
import NsfwImage from "@/components/NsfwImage";

type AutoScrollRowProps = {
  images: string[];
  label: string;
  speed: number;
  onImageClick: (src: string) => void;
  isNsfw?: boolean;
  canReveal?: boolean;
};

export function AutoScrollRow({ images, label, speed, onImageClick, isNsfw, canReveal }: AutoScrollRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const paused = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const element = trackRef.current;
    if (!element || images.length <= 4) return;
    let frame: number;
    const animate = () => {
      if (!paused.current) {
        offsetRef.current += speed;
        const third = element.scrollWidth / 3;
        if (offsetRef.current >= third) offsetRef.current -= third;
        element.style.transform = `translateX(${-offsetRef.current}px)`;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [images.length, speed]);

  const tripledImages = [...images, ...images, ...images];

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4 px-2">
        <span className="text-[13px] text-white/50 font-heading font-bold tracking-[0.15em] uppercase mb-2">{label}</span>
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[12px] text-white/25 font-mono">{images.length} photos</span>
      </div>
      <div className="overflow-hidden cursor-grab px-2">
        <div ref={trackRef} className="flex gap-3 will-change-transform">
          {tripledImages.map((src, index) => (
            <div
              key={index}
              className="flex-shrink-0 h-[258px] sm:h-[294px] md:h-[331px] overflow-hidden group rounded-sm"
              onClick={() => {
                paused.current = true;
                if (resumeTimer.current) clearTimeout(resumeTimer.current);
                onImageClick(src);
                resumeTimer.current = setTimeout(() => { paused.current = false; }, 2500);
              }}
              onMouseEnter={() => {
                paused.current = true;
                if (resumeTimer.current) clearTimeout(resumeTimer.current);
              }}
              onMouseLeave={() => { paused.current = false; }}
            >
              {isNsfw ? (
                <NsfwImage src={src} alt={label} className="h-full w-auto" canReveal={canReveal} loading="lazy" />
              ) : (
                <SafeImage src={src} alt={label} width={400} className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MarqueeTitle({ text }: { text: string }) {
  return (
    <div className="overflow-hidden whitespace-nowrap mb-6 border-b border-white/5 pb-6">
      <div className="inline-flex animate-marquee-infinite">
        {[...Array(8)].map((_, repeat) => (
          <span key={repeat} className="text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] font-heading font-black tracking-[0.08em] inline-flex">
            {text.split("").map((character, index) => {
              const wordColor = repeat % 2 === 0 ? "#DF3131" : "#FFFFFF";
              return <span key={index} style={{ color: wordColor }}>{character}</span>;
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
