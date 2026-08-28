import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creative Consultation — Free 30-Minute Strategy Session",
  description: "Free creative consultation to unleash your brand's potential. Brand strategy, content planning, marketing advice, project scoping. No pressure, just clarity.",
  keywords: ["free consultation", "creative strategy", "brand consultation", "marketing advice", "project scoping", "WYZ Design consultation"],
  openGraph: {
    title: "Creative Consultation | WYZ Design",
    description: "Free 30-minute strategy session. Brand strategy, content planning, marketing advice.",
    url: "https://wyzdesign.com/service-page/creative-consultation",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/service-page/creative-consultation",
  },
};