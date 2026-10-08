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

// Local (same-origin) images route through Next's built-in image optimizer so a
// thumbnail shown at e.g. 150px doesn't force a mobile browser to download the
// full-res source. Re-enabled 2026-10-07 after root cause: Next only accepts a
// `w` from its configured sizes and a `q` from `images.qualities`, so the width
// is snapped to the nearest allowed size and quality is pinned to 75. Remote
// and already-optimized (CDN) sources are left untouched.
//
// Filename handling (2026-10-08): paths arrive two ways (raw and pre-percent-
// encoded), and some names contain `&`, spaces, parens, apostrophes. The
// optimizer 400s on `&`/`?`/`#`/`'` and the static handler 404s a raw `&`/`'`,
// so we (1) normalize any existing encoding back to the true path, then
// (2) strictly percent-encode it. Paths with the optimizer-hostile characters
// skip the optimizer and are served directly (encoded); the rest are optimized.
const ALLOWED_WIDTHS = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920];
const ALLOWED_QUALITIES = [75];
const OPTIMIZER_UNSAFE = /[&?#']/;

function encodePath(p: string): string {
  // The static handler wants spaces/&/+ percent-encoded but parens and
  // apostrophes LITERAL (`%28` -> 404, `(` -> 200). encodeURIComponent does
  // exactly that (encodes space/&/+; leaves !'()* alone).
  return p.split("/").map(encodeURIComponent).join("/");
}
function normalizePath(src: string): string {
  try { return decodeURIComponent(src); } catch { return src; }
}
function optimizedSrc(src: string, width?: number, quality = 75): string {
  if (!src.startsWith("/")) return src; // remote / data: / blob: untouched
  const path = normalizePath(src);
  if (!width || OPTIMIZER_UNSAFE.test(path)) return encodePath(path);
  const w = ALLOWED_WIDTHS.reduce((best, cur) => Math.abs(cur - width) < Math.abs(best - width) ? cur : best, ALLOWED_WIDTHS[0]);
  const q = ALLOWED_QUALITIES.includes(quality) ? quality : ALLOWED_QUALITIES[0];
  return `/_next/image?url=${encodeURIComponent(path)}&w=${w}&q=${q}`;
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
  quality = 75,
  blurWidth = 8,
  ...imgProps
}: SafeImageProps & React.ImgHTMLAttributes<HTMLImageElement>) {
  const [broken, setBroken] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const resolvedLoading = priority ? "eager" : (loading || "lazy");

  const widthProp = typeof imgProps.width === "number" ? imgProps.width : undefined;
  const optimizedBase = optimizedSrc(src, widthProp, quality);
  const sources = getWebPSources(optimizedBase);
  const isLocal = src.startsWith("/");
  const bypassed = isLocal && !optimizedBase.startsWith("/_next/image");

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
        {!bypassed && <source srcSet={sources.webp} type="image/webp" />}
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
      {!bypassed && <source srcSet={sources.webp} type="image/webp" />}
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