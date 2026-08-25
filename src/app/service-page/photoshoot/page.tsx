"use client";

import Link from "next/link";

export default function Photoshoot() {
  return (
    <>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Photoshoot",
      description: "Professional photoshoot sessions including lighting, creative direction, and edited high-resolution images.",
      url: "https://www.wyzdesign.com/service-page/photoshoot",
      image: "https://www.wyzdesign.com/wyz-og-image.png",
      provider: {
        "@type": "LocalBusiness",
        name: "WYZ Design",
        url: "https://www.wyzdesign.com",
      },
      areaServed: {
        "@type": "Country",
        name: "United States",
      },
      serviceType: "Photography",
      offers: {
        "@type": "Offer",
        price: "100",
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
        { "@type": "ListItem", position: 2, name: "Photoshoot", item: "https://www.wyzdesign.com/service-page/photoshoot" },
      ],
    }),
  }}
/>
<main className="min-h-screen bg-white dark:bg-[#111] pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#DF3131] font-heading font-bold tracking-[0.15em] uppercase text-sm mb-2">Photography Service</p>
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-6 sm:mb-8">
            Photoshoot
          </h1>
          <p className="text-lg text-[#666665] dark:text-white/60 mb-12">Professional studio and on-location photography, portraits, products, editorial, and lifestyle.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-4">What&apos;s Included</h2>
              <ul className="space-y-3 text-[#666665] dark:text-white/60">
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Professional photographer with premium gear</li>
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Pre-shoot creative consultation</li>
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Direction on posing, styling, and setup</li>
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Professional color grading and retouching</li>
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> High-res digital delivery within 5 business days</li>
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Online gallery for viewing and downloads</li>
              </ul>
            </div>
            <div className="bg-[#333333] dark:bg-[#252528] text-white p-8">
              <h3 className="text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-heading font-bold tracking-[0.15em] uppercase mb-3">Pricing</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-600 pb-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Standard Session</span>
                    <span className="text-[#DF3131] font-bold">$100/hr</span>
                  </div>
                  <p className="text-sm text-[#666] mt-1">1-hour minimum. Includes 20 edited photos.</p>
                </div>
                <div className="border-b border-gray-600 pb-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Half Day (4hrs)</span>
                    <span className="text-[#DF3131] font-bold">$350</span>
                  </div>
                  <p className="text-sm text-[#666] mt-1">Includes 60 edited photos.</p>
                </div>
                <div className="border-b border-gray-600 pb-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Full Day (8hrs)</span>
                    <span className="text-[#DF3131] font-bold">$600</span>
                  </div>
                  <p className="text-sm text-[#666] mt-1">Includes 120+ edited photos.</p>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Add-On: Rush Delivery</span>
                    <span className="text-[#DF3131] font-bold">+$75</span>
                  </div>
                  <p className="text-sm text-[#666] mt-1">Delivery within 24 hours.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/booking-calendar/photoshoot" className="bg-[#DF3131] text-white px-8 py-3 font-heading font-bold tracking-[0.15em] uppercase hover:bg-red-700 transition-colors inline-block">
              Book a Photoshoot
            </Link>
          </div>
        </div>
      </main>
</>
  );
}
