import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping rates, delivery times, and policies for WYZ Design merchandise orders.",
  alternates: { canonical: "https://www.wyzdesign.com/shipping-policy" },
  openGraph: {
    title: "Shipping Policy | WYZ Design",
    description: "Shipping rates and delivery times.",
    url: "https://www.wyzdesign.com/shipping-policy",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Shipping Policy | WYZ Design", description: "Shipping rates and delivery times.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
