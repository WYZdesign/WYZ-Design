import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "See how WYZ Design has helped brands and artists transform their creative presence. Real results, real projects.",
  keywords: ["creative case studies", "design portfolio", "client results"],
  alternates: { canonical: "https://www.wyzdesign.com/case-studies" },
  openGraph: {
    title: "Case Studies | WYZ Design",
    description: "Real results, real projects, real impact.",
    url: "https://www.wyzdesign.com/case-studies",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Case Studies | WYZ Design", description: "Real results, real projects.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
