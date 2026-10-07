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

// Local (same-origin) images were routed through Next's built-in image
// optimizer here so a thumbnail displayed at e.g. 150px wouldn't force a
// mobile browser to download a full-resolution 150-250KB source file.
// TEMPORARILY DISABLED (verified live 2026-10-06): /_next/image?url=...
// returns 400 INVALID_IMAGE_OPTIMIZE_REQUEST for every file under
// /images/** on this deployment, at every width in next.config.ts's
// deviceSizes/imageSizes -- only the root-level /wyz-crown-square.png
// works. next.config.ts itself has no images.localPatterns restriction,
// so this needs infra-side root cause (Vercel Image Optimization
// rejecting the nested path for some other reason). Until fixed, local
// images route straight to the raw file so real photos render instead of
// SafeImage's broken-image placeholder. width/quality are kept as params
// (unused for now) so call sites don't need to change; re-enable by
// restoring the `/_next/image?url=...` return once a nested /images/**
// path is confirmed returning 200 in production.
function optimizedSrc(src: string, _width?: number, _quality = 80): string {
  return src;
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