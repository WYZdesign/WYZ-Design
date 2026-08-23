"use client";

import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  onLoad?: () => void;
  priority?: boolean;
}

export default function SafeImage({ src, alt, className = "", loading, decoding = "async", onLoad, priority, ...imgProps }: SafeImageProps & React.ImgHTMLAttributes<HTMLImageElement>) {
  const [broken, setBroken] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const resolvedLoading = priority ? "eager" : (loading || "lazy");

  if (broken) {
    return (
      <div className={`bg-[#f5f5f5] flex items-center justify-center text-[#ccc] text-[11px] font-bold tracking-[0.1em] uppercase ${className}`} style={{ minHeight: 60 }}>
        {alt || "IMG"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
      loading={resolvedLoading}
      decoding={decoding}
      onLoad={() => { setLoaded(true); onLoad?.(); }}
      onError={() => setBroken(true)}
      {...imgProps}
    />
  );
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
