import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Featured Artist of the Month",
  description: "WYZ Design spotlights emerging artists, musicians, and creatives. Get featured, submit your work.",
  keywords: ["featured artist", "emerging artist", "artist spotlight", "creative showcase"],
  alternates: { canonical: "https://www.wyzdesign.com/featured-artist" },
  openGraph: {
    title: "Featured Artist | WYZ Design",
    description: "Spotlighting emerging artists and creatives. Submit your work.",
    url: "https://www.wyzdesign.com/featured-artist",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Featured Artist | WYZ Design", description: "Spotlighting emerging artists.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function FeaturedArtistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
