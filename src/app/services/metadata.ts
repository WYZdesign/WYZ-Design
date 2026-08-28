import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Photography, Design, Video, Web & Consultation",
  description: "27 creative services across 6 categories. Photography, branding design, videography, consultation, web design. Transparent pricing. Book online or get a custom quote.",
  keywords: ["creative services", "photography services", "graphic design", "branding", "videography", "web design", "Los Angeles", "WYZ Design"],
  openGraph: {
    title: "Services | WYZ Design",
    description: "27 creative services across 6 categories. Transparent pricing, book online.",
    url: "https://wyzdesign.com/services",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/services",
  },
};