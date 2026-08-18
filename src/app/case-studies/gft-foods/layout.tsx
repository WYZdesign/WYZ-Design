import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Study: GFT Foods",
  description: "How WYZ Design rebranded GFT Foods from local shop to national player, with a new logo, packaging, e-commerce, and social content.",
  alternates: { canonical: "https://www.wyzdesign.com/case-studies/gft-foods" },
  openGraph: {
    title: "Case Study: GFT Foods | WYZ Design",
    description: "Complete rebrand: logo, packaging, e-commerce, and social content.",
    url: "https://www.wyzdesign.com/case-studies/gft-foods",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Case Study: GFT Foods | WYZ Design", description: "Complete rebrand and digital launch.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function GftFoodsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
