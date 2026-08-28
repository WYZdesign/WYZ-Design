import { Metadata } from "next";

export const metadata: Metadata = {
  title: "WYZ Design | Creative Direction & Production — Los Angeles",
  description: "WYZ Design is the creative problem you hire when your brand is tired of looking like it was designed by a committee. Photography, design, web, print, motion. Los Angeles. Sharp creative work that does what it's supposed to do.",
  keywords: ["WYZ Design", "creative agency", "Los Angeles", "photography", "graphic design", "branding", "web design", "printing", "event production"],
  openGraph: {
    title: "WYZ Design | Creative Direction & Production",
    description: "Photography, design, web, print, motion. Los Angeles. Sharp creative work that does what it's supposed to do.",
    url: "https://wyzdesign.com",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WYZ Design | Creative Direction & Production",
    description: "Photography, design, web, print, motion. Los Angeles.",
    images: ["/wyz-og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};