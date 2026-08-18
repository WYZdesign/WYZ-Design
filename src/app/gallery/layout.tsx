import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse the WYZ Design gallery, featuring photography, design work, events, and creative projects.",
  keywords: ["creative gallery", "photography gallery", "design portfolio", "visual portfolio"],
  alternates: { canonical: "https://www.wyzdesign.com/gallery" },
  openGraph: {
    title: "Gallery | WYZ Design",
    description: "Photography, design work, events, and creative projects.",
    url: "https://www.wyzdesign.com/gallery",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Gallery | WYZ Design", description: "Photography, design work, events.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
