import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Model Archive",
  description: "Meet the models and talent behind WYZ Design's portfolio. Browse our roster for shoots and collaborations.",
  keywords: ["model portfolio", "talent roster", "model booking", "photography models"],
  alternates: { canonical: "https://www.wyzdesign.com/model-archive" },
  openGraph: {
    title: "Model Archive | WYZ Design",
    description: "Meet the models behind our portfolio.",
    url: "https://www.wyzdesign.com/model-archive",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Model Archive | WYZ Design", description: "Meet the models behind our portfolio.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function ModelArchiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
