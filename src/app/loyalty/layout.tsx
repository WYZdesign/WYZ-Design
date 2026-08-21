import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loyalty Program | WYZ Design",
  description: "Join the WYZ Design loyalty program and earn points on every booking, referral, and review. Unlock discounts, priority booking, and exclusive perks.",
  keywords: ["WYZ Design loyalty", "creative agency rewards", "earn points", "member perks", "Los Angeles"],
  alternates: { canonical: "https://www.wyzdesign.com/loyalty" },
  openGraph: {
    title: "Loyalty Program | WYZ Design",
    description: "Earn points on every booking and unlock discounts, priority booking, and exclusive perks.",
    url: "https://www.wyzdesign.com/loyalty",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Loyalty Program | WYZ Design", description: "Earn points on every booking and unlock exclusive perks.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function LoyaltyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
