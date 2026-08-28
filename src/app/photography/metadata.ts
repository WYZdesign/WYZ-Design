import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photography — Portraits, Events, Editorial, Commercial",
  description: "Professional photography services in Los Angeles. Portraits, events, editorial, commercial, studio, urbex, outdoors, conceptual, concerts, street. Book online.",
  keywords: ["photography Los Angeles", "portrait photographer", "event photography", "commercial photography", "editorial photography", "WYZ Design"],
  openGraph: {
    title: "Photography | WYZ Design",
    description: "Professional photography services. Portraits, events, editorial, commercial.",
    url: "https://wyzdesign.com/photography",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/photography",
  },
};