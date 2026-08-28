import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Consultation — Free 30-Minute Strategy Session",
  description: "Book a free 30-minute creative consultation with WYZ Design. Brand strategy, content planning, marketing advice. Pick your date and time.",
  keywords: ["free consultation", "creative strategy session", "brand consultation", "book consultation", "WYZ Design consultation"],
  openGraph: {
    title: "Book Consultation | WYZ Design",
    description: "Free 30-minute strategy session. Brand strategy, content planning, marketing advice.",
    url: "https://wyzdesign.com/booking-calendar/consultation",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/booking-calendar/consultation",
  },
};