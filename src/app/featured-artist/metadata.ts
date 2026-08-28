import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Featured Artist of the Month — FAOTM Gallery",
  description: "Monthly featured artist showcase. Original artwork, prints, merchandise. Current artist: Donte \"Danny\" Davis. New artist every month. Shop the collection.",
  keywords: ["featured artist", "artist of the month", "art gallery", "original artwork", "artist prints", "WYZ Design FAOTM"],
  openGraph: {
    title: "Featured Artist | WYZ Design",
    description: "Monthly featured artist showcase. Original artwork and prints.",
    url: "https://wyzdesign.com/featured-artist",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/featured-artist",
  },
};