"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { prefersReducedMotion } from "@/lib/utils";

interface Page {
  src: string;
  alt: string;
  pageNumber: number;
  width?: number;
  height?: number;
}

interface MagazineFlipbookProps {
  pages: Page[];
  initialPage?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  showControls?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function MagazineFlipbook({
  pages,
  initialPage = 1,
  onPageChange,
  className = "",
  showControls = true,
  autoPlay = false,
  autoPlayInterval = 5000,
}: MagazineFlipbookProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; page: number } | null>(null);
  const flipbookRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const totalPages = pages.length;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || isAnimating) return;
      setIsAnimating(true);
      setCurrentPage(page);
      onPageChange?.(page);
      setTimeout(() => setIsAnimating(false), 600);
    },
    [totalPages, isAnimating, onPageChange]
  );

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (isAnimating) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      setIsDragging(true);
      setDragStart({ x: clientX, page: currentPage });
    },
    [currentPage, isAnimating]
  );

  const handleDragMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging || !dragStart || isAnimating) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const delta = dragStart.x - clientX;
      const threshold = 50;

      if (Math.abs(delta) > threshold) {
        if (delta > 0 && dragStart.page < totalPages) {
          goToPage(dragStart.page + 1);
        } else if (delta < 0 && dragStart.page > 1) {
          goToPage(dragStart.page - 1);
        }
        setIsDragging(false);
        setDragStart(null);
      }
    },
    [isDragging, dragStart, totalPages, isAnimating, goToPage]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevPage();
      if (e.key === "ArrowRight") nextPage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevPage, nextPage]);

  useEffect(() => {
    if (autoPlay && !isAnimating) {
      autoPlayRef.current = setInterval(() => {
        if (currentPage < totalPages) {
          nextPage();
        } else {
          goToPage(1);
        }
      }, autoPlayInterval);
      return () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      };
    }
  }, [autoPlay, currentPage, totalPages, nextPage, goToPage, autoPlayInterval]);

  const reduceMotion = prefersReducedMotion();

  const currentPageData = pages.find((p) => p.pageNumber === currentPage);
  const nextPageData = pages.find((p) => p.pageNumber === currentPage + 1);
  const prevPageData = pages.find((p) => p.pageNumber === currentPage - 1);

  return (
    <div
      ref={flipbookRef}
      className={`magazine-flipbook relative w-full ${className}`}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      role="region"
      aria-label={`Nomadic Breed Magazine, page ${currentPage} of ${totalPages}`}
      aria-roledescription="flipbook"
    >
      <style jsx>{`
        .magazine-flipbook {
          aspect-ratio: 1 / 1.3;
          max-width: 800px;
          margin: 0 auto;
          perspective: 2000px;
        }
        .page-spread {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .page {
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          backface-visibility: hidden;
          transform-style: preserve-3d;
          border-radius: 0 8px 8px 0;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }
        .page-left {
          left: 0;
          border-radius: 8px 0 0 8px;
          transform-origin: left center;
        }
        .page-right {
          left: 50%;
          border-radius: 0 8px 8px 0;
          transform-origin: right center;
        }
        .page-content {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: inherit;
        }
        .page-shadow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 50%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .page:hover .page-shadow {
          opacity: 1;
        }
        .controls {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 16px;
          flex-wrap: wrap;
        }
        .control-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border: none;
          border-radius: 50%;
          background: #111;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .control-btn:hover {
          background: #DF3131;
          transform: scale(1.05);
        }
        .control-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .control-btn svg {
          width: 20px;
          height: 20px;
        }
        .page-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          font-size: 14px;
          color: #666;
          dark: color: #aaa;
        }
        .page-dots {
          display: flex;
          gap: 6px;
        }
        .page-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ddd;
          dark: background: #444;
          transition: all 0.2s;
        }
        .page-dot.active {
          background: #DF3131;
          transform: scale(1.2);
        }
        @media (prefers-color-scheme: dark) {
          .control-btn {
            background: #252528;
            color: #e0e0e0;
          }
          .control-btn:hover {
            background: #DF3131;
          }
          .page-dot {
            background: #444;
          }
          .page-dot.active {
            background: #DF3131;
          }
        }
        @media (max-width: 640px) {
          .magazine-flipbook {
            aspect-ratio: 3 / 4;
          }
        }
      `}</style>
      <div className="page-spread" style={{ transform: reduceMotion ? "none" : `rotateY(${currentPage % 2 === 0 ? 0 : -180}deg)` }}>
        {/* Left Page (even pages) */}
        {currentPage % 2 === 0 && prevPageData && (
          <div className="page page-left">
            <Image
              src={prevPageData.src}
              alt={prevPageData.alt}
              fill
              className="page-content"
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="page-shadow" />
          </div>
        )}

        {/* Right Page (odd pages) / Current Page */}
        <div className={`page ${currentPage % 2 === 0 ? "page-right" : "page-left"}`}>
          {currentPageData && (
            <Image
              src={currentPageData.src}
              alt={currentPageData.alt}
              fill
              className="page-content"
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          )}
          <div className="page-shadow" />
        </div>

        {/* Next Page (preview on right when odd) */}
        {currentPage % 2 === 1 && nextPageData && (
          <div className="page page-right">
            <Image
              src={nextPageData.src}
              alt={nextPageData.alt}
              fill
              className="page-content"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="page-shadow" />
          </div>
        )}
      </div>

      {showControls && (
        <div className="controls" role="navigation" aria-label="Magazine navigation">
          <button
            className="control-btn"
            onClick={prevPage}
            disabled={isFirstPage || isAnimating}
            aria-label="Previous page"
            aria-disabled={isFirstPage || isAnimating}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="page-indicator" aria-live="polite">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="page-dots" role="tablist" aria-label="Pages">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`page-dot ${i + 1 === currentPage ? "active" : ""}`}
                  onClick={() => goToPage(i + 1)}
                  disabled={isAnimating}
                  aria-label={`Go to page ${i + 1}`}
                  aria-selected={i + 1 === currentPage}
                  role="tab"
                />
              ))}
            </div>
          </div>
          <button
            className="control-btn"
            onClick={nextPage}
            disabled={isLastPage || isAnimating}
            aria-label="Next page"
            aria-disabled={isLastPage || isAnimating}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}