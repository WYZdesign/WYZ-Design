import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans",
  description: "Flexible monthly plans for brands, studios, and businesses. From $250/mo for design, strategy, content, and event support. Cancel anytime.",
  keywords: ["creative agency pricing", "monthly retainer", "branding plan", "design subscription"],
  alternates: { canonical: "https://www.wyzdesign.com/plans" },
  openGraph: {
    title: "Pricing Plans | WYZ Design",
    description: "Flexible monthly plans from $250/mo. Design, strategy, content. Cancel anytime.",
    url: "https://www.wyzdesign.com/plans",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Pricing Plans | WYZ Design", description: "Flexible monthly plans from $250/mo.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
