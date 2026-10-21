"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { MarqueeTitle } from "@/components/PhotographyCategoryRows";

export type GalleryItem = { src: string; title: string; sub: string };
export type GallerySibling = { href: string; label: string };

type Props = {
  label: string;
  desc?: string;
  items: GalleryItem[];
  backHref: string;
  backLabel: string;
  siblings?: GallerySibling[];
  showFilters?: boolean;
};

export default function GalleryView({
  label,
  desc,
  items: source,
  backHref,
  backLabel,
  siblings = [],
  showFilters = true,
}: Props) {
  const [sub, setSub] = useState("All");
  const [idx, setIdx] = useState<number | null>(null);

  useEffect(() => {
    setSub("All");
    setIdx(null);
  }, [label]);

  const subs = useMemo(() => {
    const m = new Map<string, number>();
    for (const it of source) m.set(it.sub, (m.get(it.sub) || 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [source]);

  const items = useMemo(
    () => (showFilters && sub !== "All" ? source.filter((it) => it.sub === sub) : source),
    [source, sub, showFilters]
  );

  const open = (src: string) => {
    const i = items.findIndex((it) => it.src === src);
    setIdx(i >= 0 ? i : 0);
  };

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowLeft") setIdx((i) => (i === null ? 0 : (i - 1 + items.length) % items.length));
      if (e.key === "ArrowRight") setIdx((i) => (i === null ? 0 : (i + 1) % items.length));
    };
    addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [idx, items.length]);

  const active = idx !== null ? items[idx] : null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-28">
      <div className="pt-28">
        <h1><MarqueeTitle text={label.toUpperCase()} /></h1>
        <p className="text-white/50 text-[16px] text-center max-w-2xl mx-auto mb-8 px-6">
          {desc ? `${desc} - ` : ""}{items.length} pieces
        </p>

        <div className="px-6 sm:px-10 lg:px-16 max-w-[120rem] mx-auto">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-white/40 hover:text-[#DF3131] text-[13px] mb-8 transition-colors"
          >
            <FiChevronLeft /> {backLabel}
          </Link>

          {showFilters && subs.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              <button
                onClick={() => setSub("All")}
                className={`px-5 py-2.5 rounded-full text-[12px] font-bold tracking-[0.08em] uppercase transition-colors ${sub === "All" ? "bg-[#DF3131] text-white" : "bg-white/5 text-white/60 hover:text-white"}`}
              >
                All <span className="opacity-60">{source.length}</span>
              </button>
              {subs.map(([name, count]) => (
                <button
                  key={name}
                  onClick={() => setSub(name)}
                  className={`px-5 py-2.5 rounded-full text-[12px] font-bold tracking-[0.08em] uppercase transition-colors ${sub === name ? "bg-[#DF3131] text-white" : "bg-white/5 text-white/60 hover:text-white"}`}
                >
                  {name} <span className="opacity-60">{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-center text-white/30 py-24">Nothing in this filter yet.</p>
        ) : (
          <div className="columns-1 xs:columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-5 sm:gap-6 lg:gap-8 px-6 sm:px-10 lg:px-16 max-w-[120rem] mx-auto">
            {items.map((it) => (
              <button
                key={it.src}
                onClick={() => open(it.src)}
                className="group mb-5 sm:mb-6 lg:mb-8 block w-full break-inside-avoid overflow-hidden rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#DF3131] transition-colors text-left"
              >
                <Image
                  src={it.src}
                  alt={it.title}
                  width={900}
                  height={900}
                  unoptimized
                  loading="lazy"
                  className="w-full h-auto object-contain"
                />
                <span className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-white/70 text-[12px] truncate">{it.title}</span>
                  <span className="text-[9px] uppercase tracking-[0.12em] text-white/30 shrink-0">{it.sub}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {siblings.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-16 px-6">
            {siblings.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="px-6 py-3 border border-white/15 text-white/70 hover:text-white hover:border-[#DF3131] text-[12px] font-bold tracking-[0.1em] uppercase transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={() => setIdx(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${label} image viewer`}
        >
          <button aria-label="Close viewer" className="absolute top-4 right-4 text-white/60 hover:text-white z-10 min-w-[44px] min-h-[44px]" onClick={() => setIdx(null)}>
            <FiX className="w-8 h-8" />
          </button>
          <button
            aria-label="Previous image"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-10 min-w-[44px] min-h-[44px]"
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i === null ? 0 : (i - 1 + items.length) % items.length)); }}
          >
            <FiChevronLeft className="w-10 h-10" />
          </button>
          <div className="flex flex-col items-center gap-4 px-12 sm:px-16 max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={active.src}
              alt={active.title}
              width={1400}
              height={1400}
              unoptimized
              className="max-h-[76vh] w-auto object-contain"
            />
            <div className="text-center">
              <p className="text-white text-sm">{active.title}</p>
              <p className="text-white/40 text-xs mt-1">{active.sub} - {idx! + 1} / {items.length}</p>
            </div>
          </div>
          <button
            aria-label="Next image"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-10 min-w-[44px] min-h-[44px]"
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i === null ? 0 : (i + 1) % items.length)); }}
          >
            <FiChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </div>
  );
}
