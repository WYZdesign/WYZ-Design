"use client";

import Link from "next/link";

export default function EventPhotography() {
  return (
    <>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Event Photography",
      description: "Expert event photography for concerts, showcases, and private events.",
      url: "https://www.wyzdesign.com/service-page/event-photography",
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
      serviceType: "Event Photography",
      offers: {
        "@type": "Offer",
        price: "200",
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
        { "@type": "ListItem", position: 2, name: "Event Photography", item: "https://www.wyzdesign.com/service-page/event-photography" },
      ],
    }),
  }}
/>
<main className="min-h-screen bg-white dark:bg-[#111] pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#DF3131] font-heading font-bold tracking-[0.15em] uppercase text-sm mb-2">Photography Service</p>
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-6 sm:mb-8">
            Event Photography
          </h1>
          <p className="text-lg text-[#666665] dark:text-white/60 mb-12">Capture every moment of your event, conferences, parties, launches, mixers, and live performances.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-4">Event Types</h2>
              <ul className="space-y-3 text-[#666665] dark:text-white/60">
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Corporate events &amp; conferences</li>
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Parties &amp; celebrations</li>
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Product launches &amp; brand activations</li>
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Concerts &amp; live performances</li>
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Networking mixers &amp; community events</li>
                <li className="flex items-start gap-3"><span className="text-[#DF3131] mt-1">→</span> Private functions &amp; intimate gatherings</li>
              </ul>
            </div>
            <div className="bg-[#333333] text-white p-8">
              <h3 className="text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-heading font-bold tracking-[0.15em] uppercase mb-3">Pricing</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-600 pb-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Standard Event</span>
                    <span className="text-[#DF3131] font-bold">$200/event</span>
                  </div>
                  <p className="text-sm text-[#999] mt-1">Up to 4 hours. Includes 50+ edited photos.</p>
                </div>
                <div className="border-b border-gray-600 pb-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Extended Event</span>
                    <span className="text-[#DF3131] font-bold">$350/event</span>
                  </div>
                  <p className="text-sm text-[#999] mt-1">4–8 hours. Includes 100+ edited photos.</p>
                </div>
                <div className="border-b border-gray-600 pb-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Multi-Day Event</span>
                    <span className="text-[#DF3131] font-bold">Custom Quote</span>
                  </div>
                  <p className="text-sm text-[#999] mt-1">Pricing based on scope and days.</p>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Add-On: Second Shooter</span>
                    <span className="text-[#DF3131] font-bold">+$150</span>
                  </div>
                  <p className="text-sm text-[#999] mt-1">Additional photographer for full coverage.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f5f5f5] dark:bg-[#252528] p-8 mb-16">
            <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-4">What You Get</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#DF3131] mb-2">48hr</p>
                <p className="text-sm text-[#666665] dark:text-white/60">Sneak peek preview delivery</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#DF3131] mb-2">5 Days</p>
                <p className="text-sm text-[#666665] dark:text-white/60">Full gallery delivery</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#DF3131] mb-2">Online</p>
                <p className="text-sm text-[#666665] dark:text-white/60">Shareable gallery with downloads</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/booking-calendar/event-photography" className="bg-[#DF3131] text-white px-8 py-3 font-heading font-bold tracking-[0.15em] uppercase hover:bg-red-700 transition-colors inline-block">
              Book Event Photography
            </Link>
          </div>
        </div>
      </main>
</>
  );
}
