"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxVideoProps {
  src: string;
  className?: string;
  containerClassName?: string;
  speed?: number;
  opacity?: number;
  overlayOpacity?: number;
  playbackRate?: number;
  poster?: string;
}

export default function ParallaxVideo({
  src,
  className = "",
  containerClassName = "",
  speed = 0.4,
  opacity = 1,
  overlayOpacity,
  playbackRate = 1,
  poster,
}: ParallaxVideoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = reducedMotion ? "0%" : useTransform(scrollYProgress, [0, 1], [`-${20 * speed}%`, `${20 * speed}%`]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0 }
    );
    obs.observe(video);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video && playbackRate !== 1) {
      video.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${containerClassName}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#DF3131]/30 via-[#B82020]/20 to-[#1a1a1a]/40 pointer-events-none z-[1]">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#DF3131]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-[#B82020]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#FF6B6B]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      <motion.div className="w-[125%] h-[125%] -ml-[12.5%] -mt-[12.5%]" style={{ y }}>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className={`w-full h-full object-cover ${className}`}
            style={{ opacity }}
          />
      </motion.div>
      {overlayOpacity !== undefined && (
        <div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: overlayOpacity }} />
      )}
    </div>
  );
}
