import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Return Policy",
  description: "WYZ Design's refund and return policy for services and merchandise.",
  alternates: { canonical: "https://www.wyzdesign.com/refund-return-policy" },
  openGraph: {
    title: "Refund & Return Policy | WYZ Design",
    description: "Refund and return policy.",
    url: "https://www.wyzdesign.com/refund-return-policy",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Refund & Return Policy | WYZ Design", description: "Refund and return policy.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
