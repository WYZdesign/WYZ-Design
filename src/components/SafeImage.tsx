"use client";

import { useState, useEffect } from "react";

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

const IMAGE_BASE_PATH = "/images";

function getWebPSources(src: string): { webp: string; fallback: string } {
  if (src.startsWith("http")) {
    const url = new URL(src);
    url.pathname = url.pathname.replace(/\.(jpg|png|jpeg|JPG|PNG|JPEG)$/, ".webp");
    return { webp: src, fallback: src.replace(/\.webp$/, ".jpg") };
  }
  const baseName = src.replace(/\.(jpg|png|jpeg|JPG|PNG|JPEG)$/, "");
  const ext = src.match(/\.(jpg|png|jpeg)$/i)?.[1]?.toLowerCase() || "jpg";
  const webpPath = src.includes("/images/") ? src : `/images${src.substring(src.indexOf("images"))}`;
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
  const [blurDataURL, setBlurDataURL] = useState<string>("");

  const resolvedLoading = priority ? "eager" : (loading || "lazy");
  const isExternal = src.startsWith("http");

  useEffect(() => {
    if (!isExternal && priority) {
      const loaderImg = new Image();
      const basePath = src.replace(/\.(jpg|png|jpeg)$/i, ".webp");
      loaderImg.src = `${IMAGE_BASE_PATH}/blur${basePath.split("/").pop()}`;
      loaderImg.onload = () => setBlurDataURL(loaderImg.src);
    }
  }, [src, isExternal, priority]);

  const sources = getWebPSources(src);

  if (broken) {
    return (
      <div className={`bg-[#f5f5f5] flex items-center justify-center text-[#ccc] text-[11px] font-bold tracking-[0.1em] uppercase ${className}`} style={{ minHeight: 60 }}>
        {alt || "IMG"}
      </div>
    );
  }

  const baseStyle: React.CSSProperties = {
    transition: `background-image 0.5s ease`,
    backgroundImage: blurDataURL ? `url("${blurDataURL}")` : undefined,
    ...style
  };

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