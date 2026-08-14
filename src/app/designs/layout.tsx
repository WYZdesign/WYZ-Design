import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design Portfolio",
  description: "Logo design, branding, flyers, album covers, graphic design portfolio. See our latest work for artists, brands, and businesses.",
  keywords: ["graphic design portfolio", "logo design", "branding", "flyer design", "album cover"],
  alternates: { canonical: "https://www.wyzdesign.com/designs" },
  openGraph: {
    title: "Design Portfolio | WYZ Design",
    description: "Logo design, branding, flyers, album covers. See our latest work.",
    url: "https://www.wyzdesign.com/designs",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Design Portfolio | WYZ Design", description: "Logo design, branding, flyers, album covers.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function DesignsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
