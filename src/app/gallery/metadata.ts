import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery — Photography Portfolio & Image Archive",
  description: "Full photography gallery. Portraits, editorial, creative, bodypaint, lifestyle, fashion, concerts, street, urbex, outdoors. Browse the complete image archive.",
  keywords: ["photography gallery", "photo portfolio", "portrait photography", "editorial photography", "fashion photography", "WYZ Design gallery"],
  openGraph: {
    title: "Gallery | WYZ Design",
    description: "Complete photography portfolio. Portraits, editorial, fashion, lifestyle, concerts.",
    url: "https://wyzdesign.com/gallery",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/gallery",
  },
};