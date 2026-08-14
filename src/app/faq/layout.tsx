import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about WYZ Design services, pricing, turnaround times, booking, and more.",
  keywords: ["WYZ Design FAQ", "creative services questions", "photography pricing", "web design cost"],
  alternates: { canonical: "https://www.wyzdesign.com/faq" },
  openGraph: {
    title: "FAQ | WYZ Design",
    description: "Frequently asked questions about services, pricing, booking.",
    url: "https://www.wyzdesign.com/faq",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "FAQ | WYZ Design", description: "Frequently asked questions about services, pricing.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
