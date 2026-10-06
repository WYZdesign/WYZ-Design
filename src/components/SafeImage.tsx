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
  return { webp: src, fallback: src };
}

// Route local (same-origin) images through Next.js's built-in image
// optimizer so a thumbnail displayed at e.g. 150px doesn't force a
// mobile browser to download a full-resolution 150-250KB source file.
// Remote/already-optimized (CDN) sources are left untouched. A `width`
// prop (device px) is required to opt in -- callers that don't pass one
// keep the previous raw-<img> behavior.
function optimizedSrc(src: string, width?: number, quality = 80): string {
  if (!width || src.startsWith("http") || src.startsWith("data:") || src.startsWith("blob:")) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
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

  const widthProp = typeof imgProps.width === "number" ? imgProps.width : undefined;
  const optimizedBase = optimizedSrc(src, widthProp, quality);
  const sources = getWebPSources(optimizedBase);

  if (broken) {
    return (
      <div className={`bg-[#f5f5f5] flex items-center justify-center text-[#666] text-[11px] font-bold tracking-[0.1em] uppercase ${className}`} style={{ minHeight: 60 }}>
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