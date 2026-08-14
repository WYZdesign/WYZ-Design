"use client";

import Link from "next/link";

export default function CreativeConsultation() {
  return (
    <>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Creative Consultation",
      description: "Free creative consultation to unleash your brand's potential.",
      provider: {
        "@type": "LocalBusiness",
        name: "WYZ Design",
        url: "https://www.wyzdesign.com",
      },
      areaServed: {
        "@type": "Country",
        name: "United States",
      },
      serviceType: "Consultation",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    }),
  }}
/>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.wyzdesign.com" },
        { "@type": "ListItem", position: 2, name: "Creative Consultation", item: "https://www.wyzdesign.com/service-page/creative-consultation" },
      ],
    }),
  }}
/>
<main className="min-h-screen bg-white dark:bg-[#111] pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#DF3131] font-heading font-bold tracking-[0.15em] uppercase text-sm mb-2">Free Service</p>
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-6 sm:mb-8">
            Creative Consultation
          </h1>
          <p className="text-lg text-[#666665] dark:text-white/60 mb-12">A free 30-minute session to explore your vision, define your brand, and map out a creative strategy, no strings attached.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-4">What to Expect</h2>
              <ul className="space-y-4 text-[#666665] dark:text-white/60">
                <li className="flex items-start gap-3">
                  <span className="text-[#DF3131] mt-1 text-xl">→</span>
                  <div>
                    <strong className="text-[#333333] dark:text-[#e0e0e0]">Brand Review</strong>
                    <p className="text-sm mt-1">We look at your current branding, assets, and online presence to identify strengths and gaps.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#DF3131] mt-1 text-xl">→</span>
                  <div>
                    <strong className="text-[#333333] dark:text-[#e0e0e0]">Project Scoping</strong>
                    <p className="text-sm mt-1">Define deliverables, timelines, and budget so you know exactly what to expect.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#DF3131] mt-1 text-xl">→</span>
                  <div>
                    <strong className="text-[#333333] dark:text-[#e0e0e0]">Creative Direction</strong>
                    <p className="text-sm mt-1">Get professional insight on what will work best for your audience and goals.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#DF3131] mt-1 text-xl">→</span>
                  <div>
                    <strong className="text-[#333333] dark:text-[#e0e0e0]">Action Plan</strong>
                    <p className="text-sm mt-1">Walk away with a clear next steps, whether you book with us or not.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-[#f5f5f5] dark:bg-[#2b2b2e] p-8">
              <h3 className="text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-3">Session Details</h3>
              <div className="space-y-3 text-[#666665] dark:text-white/60">
                <div className="flex justify-between border-b border-gray-200 dark:border-[#444] pb-3">
                  <span>Duration</span>
                  <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">30 minutes</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-[#444] pb-3">
                  <span>Format</span>
                  <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">Video call or phone</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-[#444] pb-3">
                  <span>Cost</span>
                  <span className="font-bold text-[#DF3131]">FREE</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-[#444] pb-3">
                  <span>Availability</span>
                  <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">Mon–Sat, 10AM–7PM PT</span>
                </div>
              </div>
              <Link href="/booking" className="mt-8 bg-[#DF3131] text-white px-8 py-3 font-heading font-bold tracking-[0.15em] uppercase hover:bg-red-700 transition-colors inline-block w-full text-center">
                Book Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </main>
</>
  );
}
