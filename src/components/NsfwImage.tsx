"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { logger } from "@/lib/logger";

interface NsfwImageProps {
  src: string;
  alt: string;
  className?: string;
  alwaysBlurred?: boolean;
  onNsfwDetected?: (src: string, label: string, confidence: number) => void;
  canReveal?: boolean;
  onReveal?: () => void;
  loading?: "lazy" | "eager";
  sizes?: string;
}

interface NsfwPrediction {
  className: string;
  probability: number;
}

/**
 * Image wrapper that runs nsfwjs classification client-side on load,
 * applies blur to NSFW-detected images, shows tap-to-reveal for
 * age-verified users, and caches results in localStorage.
 */
export default function NsfwImage({
  src,
  alt,
  className = "",
  alwaysBlurred = false,
  onNsfwDetected,
  canReveal = false,
  onReveal,
  loading = "lazy",
  sizes,
}: NsfwImageProps) {
  const [isNsfw, setIsNsfw] = useState(alwaysBlurred);
  const [revealed, setRevealed] = useState(false);
  const [scanning, setScanning] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const scannedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cacheKey = `nsfw:${src}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { label: string; nsfw: boolean; ts: number };
        if (Date.now() - parsed.ts < 7 * 24 * 60 * 60 * 1000) {
          if (parsed.nsfw) {
            setIsNsfw(true);
            onNsfwDetected?.(src, parsed.label, 1);
          }
          scannedRef.current = true;
          return;
        }
      } catch { /* skip malformed cache */ }
    }
  }, [src, onNsfwDetected]);

  const scanImage = useCallback(async (img: HTMLImageElement) => {
    if (scannedRef.current || alwaysBlurred) return;
    scannedRef.current = true;
    setScanning(true);

    try {
      const nsfwjs = await import("nsfwjs");

      if (!img.complete) {
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      }

      const model = await nsfwjs.load();
      const predictions: NsfwPrediction[] = await model.classify(img);

      const nsfwPreds = predictions.filter(
        (p) => (p.className === "Porn" || p.className === "Sexy") && p.probability > 0.3
      );

      const totalNsfwConfidence = nsfwPreds.reduce((sum, p) => sum + p.probability, 0);
      const topNsfw = nsfwPreds.sort((a, b) => b.probability - a.probability)[0];

      if (totalNsfwConfidence > 0.65 && topNsfw) {
        setIsNsfw(true);
        onNsfwDetected?.(src, topNsfw.className, totalNsfwConfidence);
        localStorage.setItem(
          `nsfw:${src}`,
          JSON.stringify({ label: topNsfw.className, nsfw: true, confidence: totalNsfwConfidence, ts: Date.now() })
        );
      } else {
        localStorage.setItem(
          `nsfw:${src}`,
          JSON.stringify({ label: "Neutral", nsfw: false, ts: Date.now() })
        );
      }
    } catch (e) {
      logger.warn("nsfw-image", `Scan failed for ${src}: ${(e as Error).message}`);
    } finally {
      setScanning(false);
      try {
        const tf = await import("@tensorflow/tfjs");
        tf.disposeVariables();
      } catch { /* best effort */ }
    }
  }, [src, alwaysBlurred, onNsfwDetected]);

  const handleReveal = useCallback(() => {
    setRevealed(true);
    onReveal?.();
  }, [onReveal]);

  const showBlur = (isNsfw || alwaysBlurred) && !revealed;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        sizes={sizes}
        className={`w-full h-full object-cover transition-all duration-500 ${
          showBlur ? "blur-xl scale-110" : ""
        }`}
        onLoad={() => {
          if (imgRef.current) {
            void scanImage(imgRef.current);
          }
        }}
      />

      {scanning && (
        <div className="absolute top-2 right-2 bg-black/60 text-[10px] text-white/60 px-2 py-1 font-mono z-10">
          SCANNING
        </div>
      )}

      {showBlur && canReveal && (
        <button
          onClick={handleReveal}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer group"
          aria-label="Tap to reveal content"
        >
          <div className="bg-[#DF3131]/90 text-white px-4 py-2 text-[12px] font-heading font-bold tracking-[0.1em] uppercase group-hover:bg-[#DF3131] transition-colors">
            TAP TO REVEAL
          </div>
        </button>
      )}

      {showBlur && !canReveal && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
          <div className="bg-black/70 text-white/70 px-4 py-2 text-[11px] font-heading font-bold tracking-[0.1em] uppercase">
            18+ CONTENT
          </div>
        </div>
      )}
    </div>
  );
}
