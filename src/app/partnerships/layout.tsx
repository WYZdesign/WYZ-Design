import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partnerships",
  description: "Partner with WYZ Design for brand collaborations, creative campaigns, and strategic alliances.",
  keywords: ["brand partnership", "creative collaboration", "business partnership"],
  alternates: { canonical: "https://www.wyzdesign.com/partnerships" },
  openGraph: {
    title: "Partnerships | WYZ Design",
    description: "Brand collaborations, creative campaigns, strategic alliances.",
    url: "https://www.wyzdesign.com/partnerships",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Partnerships | WYZ Design", description: "Brand collaborations, creative campaigns.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function PartnershipsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
