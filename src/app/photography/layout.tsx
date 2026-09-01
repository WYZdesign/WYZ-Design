import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photography",
  description: "Professional photography for portraits, events, editorial, and commercial. High-resolution images with 24-hour turnaround. Book your session.",
  keywords: ["professional photography", "portrait photography", "event photography", "Los Angeles photographer"],
  alternates: { canonical: "https://www.wyzdesign.com/photography" },
  openGraph: {
    title: "Photography | WYZ Design",
    description: "Professional photography for portraits, events, editorial. 24-hour turnaround.",
    url: "https://www.wyzdesign.com/photography",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Photography | WYZ Design", description: "Professional photography for portraits, events, editorial.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function PhotographyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Photography",
            serviceType: "Professional Photography",
            description: "Professional photography for portraits, events, editorial, and commercial. High-resolution images with 24-hour turnaround.",
            provider: { "@id": "https://www.wyzdesign.com/#organization" },
            areaServed: ["Los Angeles", "Chicago", "United States"],
            url: "https://www.wyzdesign.com/photography",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Photography Services",
              itemListElement: [
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Photoshoot", description: "Professional photoshoot sessions" }, price: "100", priceCurrency: "USD" },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Event Photography", description: "Live event coverage and documentation" }, price: "200", priceCurrency: "USD" },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Photo Retouching", description: "Professional photo retouching services" } },
              ],
            },
          }),
        }}
      />
      {children}
    </>
  );
}
