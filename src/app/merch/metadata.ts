import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merch Store — Dying Breed Crew Apparel, Accessories & Prints",
  description: "Official Dying Breed Crew merch. Hoodies, tees, hats, stickers, mugs, tumblers, patches. Premium quality, crew-made designs. Print-on-demand via Printful. Shop the collection.",
  keywords: ["Dying Breed Crew merch", "WYZ Design merch", "hoodies", "graphic tees", "snapback hats", "vinyl stickers", "custom apparel", "print on demand"],
  openGraph: {
    title: "Merch Store | WYZ Design",
    description: "Official Dying Breed Crew merch. Hoodies, tees, hats, accessories.",
    url: "https://wyzdesign.com/merch",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/merch",
  },
};