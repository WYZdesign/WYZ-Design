import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Design and photography, side by side. One studio, two ways to see the work WYZ Design does.",
  keywords: ["WYZ Design portfolio", "design and photography", "Los Angeles creative agency"],
  alternates: { canonical: "https://www.wyzdesign.com/work" },
  openGraph: {
    title: "Our Work | WYZ Design",
    description: "Design and photography, side by side. One studio, two ways to see the work.",
    url: "https://www.wyzdesign.com/work",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Our Work | WYZ Design", description: "Design and photography, side by side.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
