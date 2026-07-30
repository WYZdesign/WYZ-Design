"use client";

export function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-[#E2E2E2] via-[#F0F0F0] to-[#E2E2E2] rounded ${className}`} />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white border border-[#E2E2E2] overflow-hidden ${className}`}>
      <div className="aspect-[4/3] bg-gradient-to-r from-[#E2E2E2] via-[#F0F0F0] to-[#E2E2E2]" />
      <div className="p-5 space-y-3">
        <SkeletonLine className="h-4 w-3/4" />
        <SkeletonLine className="h-3 w-full" />
        <SkeletonLine className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonHero({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-[#F0F0F0] dark:bg-[#111] flex items-center ${className}`}>
      <div className="px-10 lg:px-20 space-y-6 w-full max-w-xl mx-auto">
        <SkeletonLine className="h-12 w-3/4 bg-[#ddd] dark:bg-white/10" />
        <SkeletonLine className="h-12 w-1/2 bg-[#ddd] dark:bg-white/10" />
        <SkeletonLine className="h-5 w-full bg-[#e8e8e8] dark:bg-white/5" />
        <SkeletonLine className="h-5 w-3/4 bg-[#e8e8e8] dark:bg-white/5" />
        <div className="h-12 w-40 bg-[#ddd] dark:bg-white/10 rounded" />
      </div>
    </div>
  );
}
