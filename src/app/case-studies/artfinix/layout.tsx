import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Study: Artfinix",
  description: "How WYZ Design helped Artfinix build a complete brand identity — logo to web to social.",
  alternates: { canonical: "https://www.wyzdesign.com/case-studies/artfinix" },
  openGraph: {
    title: "Case Study: Artfinix | WYZ Design",
    description: "Complete brand identity build for Artfinix.",
    url: "https://www.wyzdesign.com/case-studies/artfinix",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Case Study: Artfinix | WYZ Design", description: "Complete brand identity build.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function ArtfinixLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
