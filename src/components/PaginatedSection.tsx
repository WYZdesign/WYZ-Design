"use client";

import { useEffect, useId, useMemo, useState } from "react";

type PaginatedSectionProps<T> = {
  items: readonly T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey: (item: T, index: number) => React.Key;
  label: string;
  itemsPerPage?: number;
  className?: string;
  listClassName?: string;
  emptyState?: React.ReactNode;
};

/**
 * Keeps long collections approachable on a phone without hiding content.
 * It is deliberately presentation-agnostic so portfolio, article, and card
 * layouts can share the same accessible paging controls.
 */
export default function PaginatedSection<T>({
  items,
  renderItem,
  getItemKey,
  label,
  itemsPerPage = 6,
  className = "",
  listClassName = "",
  emptyState = "Nothing to show yet.",
}: PaginatedSectionProps<T>) {
  const [page, setPage] = useState(1);
  const statusId = useId();
  const safeItemsPerPage = Math.max(1, Math.floor(itemsPerPage));
  const pageCount = Math.max(1, Math.ceil(items.length / safeItemsPerPage));

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, pageCount));
  }, [pageCount]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * safeItemsPerPage;
    return items.slice(start, start + safeItemsPerPage);
  }, [items, page, safeItemsPerPage]);

  if (items.length === 0) {
    return <div className={className}>{emptyState}</div>;
  }

  const firstItem = (page - 1) * safeItemsPerPage + 1;
  const lastItem = Math.min(page * safeItemsPerPage, items.length);

  return (
    <section className={className} aria-label={label}>
      <div className={listClassName}>
        {pageItems.map((item, index) => (
          <div key={getItemKey(item, (page - 1) * safeItemsPerPage + index)}>
            {renderItem(item, (page - 1) * safeItemsPerPage + index)}
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-3" aria-label={`${label} pages`}>
          <p id={statusId} className="sr-only" aria-live="polite">
            Showing {firstItem} through {lastItem} of {items.length}. Page {page} of {pageCount}.
          </p>
          <button
            type="button"
            onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            disabled={page === 1}
            className="min-h-11 min-w-11 border border-black bg-white px-4 text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-describedby={statusId}
          >
            Previous
          </button>
          <span aria-hidden="true" className="text-xs font-bold tracking-[0.14em]">
            {page} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((currentPage) => Math.min(pageCount, currentPage + 1))}
            disabled={page === pageCount}
            className="min-h-11 min-w-11 border border-black bg-white px-4 text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-describedby={statusId}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}
