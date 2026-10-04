import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Founded by Torreé Marcel, WYZ Design is a creative agency built from Chicago's DIY art and music scene. Over 60 events produced, 30+ clients. Now in Los Angeles.",
  keywords: ["WYZ Design founder", "Torreé Marcel", "creative agency", "Los Angeles"],
  alternates: { canonical: "https://www.wyzdesign.com/about" },
  openGraph: {
    title: "About | WYZ Design",
    description: "Founded by Torreé Marcel. Over 60 events produced, 30+ clients supported. Los Angeles creative agency.",
    url: "https://www.wyzdesign.com/about",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "About | WYZ Design", description: "Founded by Torreé Marcel. Los Angeles creative agency.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
