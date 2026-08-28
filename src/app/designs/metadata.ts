import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Designs — Logos, Cover Art, Flyers & Brand Identity Gallery",
  description: "Browse WYZ Design portfolio. Logo design, cover art, flyers, brand identity, social media kits. Custom design work for artists, brands, and businesses.",
  keywords: ["logo design portfolio", "cover art design", "flyer design", "brand identity gallery", "custom design work", "WYZ Design portfolio"],
  openGraph: {
    title: "Designs | WYZ Design",
    description: "Logo design, cover art, flyers, brand identity portfolio.",
    url: "https://wyzdesign.com/designs",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/designs",
  },
};