import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Model Archive — Portfolio, Booking & Model Directory",
  description: "Browse WYZ Design model directory. 50+ models available for bookings. Filter by category, view portfolios, book directly. Los Angeles + Chicago based.",
  keywords: ["model directory", "model booking", "model portfolio", "Los Angeles models", "Chicago models", "photography models", "WYZ Design models"],
  openGraph: {
    title: "Model Archive | WYZ Design",
    description: "50+ models for booking. Portraits, fashion, editorial, commercial.",
    url: "https://wyzdesign.com/model-archive",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/model-archive",
  },
};