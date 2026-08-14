import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Study: Dawneeah's Glow",
  description: "How WYZ Design built the full brand identity, photography, and Shopify store for Dawneeah's Glow — $180K revenue in 90 days.",
  alternates: { canonical: "https://www.wyzdesign.com/case-studies/dawneeahs-glow" },
  openGraph: {
    title: "Case Study: Dawneeah's Glow | WYZ Design",
    description: "Brand identity, product photography, and e-commerce build.",
    url: "https://www.wyzdesign.com/case-studies/dawneeahs-glow",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Case Study: Dawneeah's Glow | WYZ Design", description: "Brand identity and e-commerce build.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function DawneeahsGlowLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
