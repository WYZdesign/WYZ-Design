import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gift Cards",
  description: "Give the gift of creative work. WYZ Design gift cards for photography, design, and branding. Digital delivery.",
  keywords: ["creative gift card", "photography gift card", "design gift card"],
  alternates: { canonical: "https://www.wyzdesign.com/gift-card" },
  openGraph: {
    title: "Gift Cards | WYZ Design",
    description: "Give the gift of creative work. Digital delivery.",
    url: "https://www.wyzdesign.com/gift-card",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Gift Cards | WYZ Design", description: "Give the gift of creative work.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function GiftCardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
