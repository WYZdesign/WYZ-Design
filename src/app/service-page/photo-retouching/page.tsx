"use client";

import Link from "next/link";

export default function PhotoRetouching() {
  return (
    <>
<main className="min-h-screen bg-white dark:bg-[#111] pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#DF3131] font-heading font-bold tracking-[0.15em] uppercase text-sm mb-2">Photography Service</p>
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-6 sm:mb-8">
            Photo Retouching
          </h1>
          <p className="text-lg text-[#666665] dark:text-white/60 mb-12">Professional retouching and editing to make every image look its best, skin smoothing, color correction, background removal, and more.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-4">Services</h2>
              <ul className="space-y-3 text-[#666665] dark:text-white/60">
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Skin smoothing &amp; blemish removal</li>
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Color correction &amp; grading</li>
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Background removal &amp; replacement</li>
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Object removal &amp; cleanup</li>
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Teeth whitening &amp; eye enhancement</li>
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Body contouring (subtle, natural)</li>
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Composite &amp; manipulation work</li>
              </ul>
            </div>
            <div className="bg-[#f5f5f5] dark:bg-[#252528] p-8">
              <h3 className="text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-3">Pricing</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-200 dark:border-[#444] pb-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">Basic Retouch</span>
                    <span className="text-[#DF3131] font-bold">$15/photo</span>
                  </div>
                  <p className="text-sm text-[#666665] dark:text-white/60 mt-1">Skin smoothing, blemish removal, color correction.</p>
                </div>
                <div className="border-b border-gray-200 dark:border-[#444] pb-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">Advanced Retouch</span>
                    <span className="text-[#DF3131] font-bold">$35/photo</span>
                  </div>
                  <p className="text-sm text-[#666665] dark:text-white/60 mt-1">Full retouching including background, objects, and body.</p>
                </div>
                <div className="border-b border-gray-200 dark:border-[#444] pb-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">Bulk (10+ photos)</span>
                    <span className="text-[#DF3131] font-bold">$12/photo</span>
                  </div>
                  <p className="text-sm text-[#666665] dark:text-white/60 mt-1">Basic retouch for 10 or more images.</p>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">Composite / Manipulation</span>
                    <span className="text-[#DF3131] font-bold">Custom Quote</span>
                  </div>
                  <p className="text-sm text-[#666665] dark:text-white/60 mt-1">Complex creative work, pricing depends on scope.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#333333] text-white p-12 text-center">
            <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold tracking-[0.15em] uppercase mb-4">Upload Your Photos</h2>
            <p className="mb-6">Send us your images and we will provide a free estimate before any work begins.</p>
            <Link href="/booking" className="bg-[#DF3131] text-white px-8 py-3 font-heading font-bold tracking-[0.15em] uppercase hover:bg-red-700 transition-colors inline-block">
              Get a Quote
            </Link>
          </div>
        </div>
      </main>
</>
  );
}
