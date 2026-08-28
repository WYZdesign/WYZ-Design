import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking — Schedule Your Creative Session",
  description: "Book WYZ Design services online. Photography, design, video, web, consultation. Select date, time, and service. Real-time availability.",
  keywords: ["book photography", "schedule design consultation", "book video shoot", "creative services booking", "WYZ Design booking"],
  openGraph: {
    title: "Booking | WYZ Design",
    description: "Schedule your creative session. Real-time availability.",
    url: "https://wyzdesign.com/booking",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/booking",
  },
};