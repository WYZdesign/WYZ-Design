import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Details — WYZ Design Merch Store",
  description: "View product details, colors, sizes, materials, and reviews. Dying Breed Crew apparel, headwear, accessories. Print-on-demand via Printful.",
  keywords: ["product details", "merch product", "Dying Breed Crew", "apparel", "headwear", "accessories", "WYZ Design merch"],
  openGraph: {
    title: "Product | WYZ Design Merch",
    description: "View product details, colors, sizes, materials, and reviews.",
    url: "https://wyzdesign.com/merch",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/merch",
  },
};