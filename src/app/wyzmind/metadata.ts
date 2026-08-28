import { Metadata } from "next";

export const metadata: Metadata = {
  title: "WYZMIND — Creative Operations Platform",
  description: "WYZMIND is the operating system for creative studios. AI intake, strategy engine, client portals, booking automation, asset management. Built by WYZ Design for creative teams.",
  keywords: ["creative operations", "studio management", "AI intake", "client portal", "booking automation", "WYZMIND", "WYZ Design"],
  openGraph: {
    title: "WYZMIND | WYZ Design",
    description: "Creative operations platform for studios. AI intake, strategy, portals, booking.",
    url: "https://wyzdesign.com/wyzmind",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/wyzmind",
  },
};