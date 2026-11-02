"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiSearch, FiGrid } from "react-icons/fi";
import { useState } from "react";

export interface Cover {
  issue: number;
  volume: string;
  title: string;
  image: string;
  alt: string;
  publishDate: string;
  featured?: boolean;
}

interface CoverGalleryProps {
  covers: Array<{
    issue: number;
    volume: string;
    title: string;
    image: string;
    alt: string;
    publishDate: string;
    featured?: boolean;
  }>;
  className?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
}

export default function CoverGallery({
  covers,
  className = "",
  showViewAll = true,
  viewAllHref = "/nomadic-breed",
}: CoverGalleryProps) {
  const [view, setView] = useState<"grid" | "carousel">("grid");

  if (covers.length === 0) {
    return (
      <section className={`cover-gallery ${className}`}>
        <div className="text-center py-12">
          <p className="text-[#666] dark:text-[#aaa]">No covers available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`cover-gallery ${className}`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[1.5rem] lg:text-[2rem] tracking-[0.04em] mb-2">
            Covers Archive
          </h2>
          <p className="text-[#666] dark:text-[#aaa] text-[14px]">
            Every cover tells a story. From the first hand-painted title to the latest neon noir.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-1.5 text-[12px] font-bold tracking-[0.08em] uppercase rounded-lg transition-all ${
              view === "grid"
                ? "bg-[#DF3131] text-white"
                : "bg-white dark:bg-[#252528] text-[#666] dark:text-[#aaa] border border-[#E2E2E2] dark:border-[#333]"
            }`}
            aria-label="Grid view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            onClick={() => setView("carousel")}
            className={`px-3 py-1.5 text-[12px] font-bold tracking-[0.08em] uppercase rounded-lg transition-all ${
              view === "carousel"
                ? "bg-[#DF3131] text-white"
                : "bg-white dark:bg-[#252528] text-[#666] dark:text-[#aaa] border border-[#E2E2E2] dark:border-[#333]"
            }`}
            aria-label="Carousel view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h16" />
              <path d="M12 4v16" />
            </svg>
          </button>
        </div>
      </div>

      {covers.length > 0 && (
        <div
          className={`${
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          }`}
        >
          {covers.map((cover) => (
            <Link
              key={cover.issue}
              href={`/nomadic-breed/issue-${cover.issue.toString().padStart(3, "0")}`}
              className={`group block ${
                view === "carousel" ? "flex-none w-[280px] sm:w-[320px] snap-start" : ""
              }`}
            >
              <article className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] rounded-2xl overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <Image
                    src={cover.image}
                    alt={cover.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  {cover.featured && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-1 bg-[#DF3131] text-white text-[10px] font-bold tracking-[0.1em] uppercase rounded">
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between z-10">
                    <span className="px-2 py-1 bg-black/70 text-white text-[10px] font-bold tracking-[0.1em] uppercase rounded">
                      {cover.volume} · Issue {cover.issue.toString().padStart(3, "0")}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#6E6E6E] dark:text-[#888] mb-2">
                    Vol. {cover.volume.split(" ")[1]} · Issue {cover.issue.toString().padStart(3, "0")}
                  </p>
                  <h3 className="font-heading font-black text-[#333] dark:text-white text-[1.1rem] tracking-[0.03em] mb-2 leading-tight group-hover:text-[#DF3131] transition-colors">
                    {cover.title}
                  </h3>
                  <p className="text-[#666] dark:text-[#aaa] text-[12px] mt-2 line-clamp-2">
                    Published {new Date(cover.publishDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <Link
          href="/nomadic-breed"
          className="inline-flex items-center gap-2 text-[#666] dark:text-[#666] text-[14px] hover:text-[#DF3131] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="12 19 5 12 12 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          View All Covers
        </Link>
      </div>
    </section>
  );
}

export interface Cover {
  issue: number;
  volume: string;
  title: string;
  image: string;
  alt: string;
  publishDate: string;
  featured?: boolean;
}

// Sample covers data - in production, fetch from CMS
export const COVERS_DATA = [
  {
    issue: 1,
    volume: "Vol. 1",
    title: "Nomadic Breed Issue 001",
    image: "/images/nomadic-breed/issue-001/cover.jpg",
    alt: "Cover - Hand-painted red NOMADIC BREED title, gritty back-alley aesthetic with red neon",
    publishDate: "2026-01-15",
    featured: true,
  },
];