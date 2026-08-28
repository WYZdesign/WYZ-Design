import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plans — Monthly Creative Subscriptions & Custom Packages",
  description: "Creative subscription plans for ongoing work. Starter ($250/mo), Business Boost ($500/mo), Pro Plus ($750/mo), Ultimate ($1,000/mo). Custom packages available. Cancel anytime.",
  keywords: ["creative subscription", "monthly design plan", "creative retainer", "branding package", "ongoing creative work", "WYZ Design"],
  openGraph: {
    title: "Plans | WYZ Design",
    description: "Monthly creative subscriptions from $250/mo. Custom packages available.",
    url: "https://wyzdesign.com/plans",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/plans",
  },
};