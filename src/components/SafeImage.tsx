"use client";

import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  onLoad?: () => void;
  priority?: boolean;
  style?: React.CSSProperties;
  quality?: number;
  blurWidth?: number;
}

function getWebPSources(src: string): { webp: string; fallback: string } {
  if (src.startsWith("http")) {
    return { webp: src, fallback: src.replace(/\.webp$/, ".jpg") };
  }
  return {
    webp: src.replace(/\.(jpg|png|jpeg)$/i, ".webp"),
    fallback: src
  };
}

export default function SafeImage({
  src,
  alt,
  className = "",
  loading,
  decoding = "async",
  onLoad,
  priority,
  style,
  quality = 80,
  blurWidth = 8,
  ...imgProps
}: SafeImageProps & React.ImgHTMLAttributes<HTMLImageElement>) {
  const [broken, setBroken] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const resolvedLoading = priority ? "eager" : (loading || "lazy");

  const sources = getWebPSources(src);

  if (broken) {
    return (
      <div className={`bg-[#f5f5f5] flex items-center justify-center text-[#ccc] text-[11px] font-bold tracking-[0.1em] uppercase ${className}`} style={{ minHeight: 60 }}>
        {alt || "IMG"}
      </div>
    );
  }

  const baseStyle: React.CSSProperties = { ...style };

  if (imgProps.fill) {
    return (
      <picture>
        <source srcSet={sources.webp} type="image/webp" />
        <img
          src={sources.fallback}
          alt={alt}
          className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
          loading={resolvedLoading}
          decoding={decoding}
          onLoad={() => { setLoaded(true); onLoad?.(); }}
          onError={() => setBroken(true)}
          style={baseStyle}
          {...imgProps}
        />
      </picture>
    );
  }

  return (
    <picture>
      <source srcSet={sources.webp} type="image/webp" />
      <img
        src={sources.fallback}
        alt={alt}
        className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        loading={resolvedLoading}
        decoding={decoding}
        onLoad={() => { setLoaded(true); onLoad?.(); }}
        onError={() => setBroken(true)}
        style={baseStyle}
        {...imgProps}
      />
    </picture>
  );
}