"use client";

import { useRef, useEffect, useCallback } from "react";

interface VideoScrubProps {
  src: string;
  className?: string;
  containerClassName?: string;
  overlayOpacity?: number;
  fallbackPoster?: string;
}

export default function VideoScrub({
  src,
  className = "",
  containerClassName = "",
  overlayOpacity = 0.4,
  fallbackPoster,
}: VideoScrubProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameCount = useRef(0);

  const setVideoTime = useCallback(() => {
    const video = videoRef.current;
    if (!video || !containerRef.current || !video.duration) return;

    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = -rect.top;
    const maxScroll = rect.height - window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));

    const targetFrame = progress * Math.max(1, video.duration - 0.1);
    const diff = Math.abs(video.currentTime - targetFrame);

    if (diff > 0.05) {
      video.currentTime = targetFrame;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      frameCount.current = Math.floor(video.duration * 30);
      video.pause();
      setVideoTime();
    };

    video.addEventListener("loadedmetadata", onLoaded);
    if (video.readyState >= 1) onLoaded();

    let raf: number;
    const tick = () => {
      setVideoTime();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [setVideoTime]);

  return (
    <div
      ref={containerRef}
      className={`relative ${containerClassName}`}
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          poster={fallbackPoster}
          className={`w-full h-full object-cover ${className}`}
        />
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />
      </div>
    </div>
  );
}
