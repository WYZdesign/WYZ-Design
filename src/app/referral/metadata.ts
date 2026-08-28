import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referral Program — Earn 10% Commission on Every Referral",
  description: "Join the WYZ Design referral program. Earn 10% commission on every client you refer. Free to join, quarterly payouts, co-branded materials provided.",
  keywords: ["referral program", "earn commission", "affiliate program", "creative agency referral", "WYZ Design referral"],
  openGraph: {
    title: "Referral Program | WYZ Design",
    description: "Earn 10% on every referral. Free to join, quarterly payouts.",
    url: "https://wyzdesign.com/referral",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/referral",
  },
  robots: { index: false, follow: false },
};