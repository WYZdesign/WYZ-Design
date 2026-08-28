import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gift Cards — Give the Gift of Creative Work",
  description: "WYZ Design gift cards from $25–$250. Redeemable for photography, design, printing, merch, or web services. Digital delivery, never expire.",
  keywords: ["gift cards", "creative gift card", "photography gift", "design gift card", "digital gift card", "WYZ Design gift card"],
  openGraph: {
    title: "Gift Cards | WYZ Design",
    description: "Gift cards from $25–$250. Photography, design, printing, merch, web.",
    url: "https://wyzdesign.com/gift-card",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/gift-card",
  },
};