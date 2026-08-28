import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zeal Rewards — Earn Points, Unlock Perks, Get Free Work",
  description: "Earn Zeal points for bookings, referrals, and engagement. Redeem for discounts, free services, merch, and exclusive access. Loyalty program for WYZ Design clients.",
  keywords: ["loyalty program", "rewards program", "creative agency rewards", "zeal points", "referral discounts", "client rewards"],
  openGraph: {
    title: "Zeal Rewards | WYZ Design",
    description: "Earn points for bookings and referrals. Redeem for free services and merch.",
    url: "https://wyzdesign.com/loyalty",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/loyalty",
  },
};