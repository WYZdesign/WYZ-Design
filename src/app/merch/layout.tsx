import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merch Store",
  description: "Official WYZ Design merchandise — hoodies, tees, accessories. Premium quality streetwear inspired by the creative community.",
  keywords: ["WYZ Design merch", "streetwear", "creative agency merchandise", "designer clothing"],
  alternates: { canonical: "https://www.wyzdesign.com/merch" },
  openGraph: {
    title: "Merch Store | WYZ Design",
    description: "Official WYZ Design merch — hoodies, tees, accessories.",
    url: "https://www.wyzdesign.com/merch",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Merch Store | WYZ Design", description: "Official WYZ Design merch.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function MerchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
