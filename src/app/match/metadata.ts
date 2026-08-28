import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Match — Find Your Perfect Creative Services",
  description: "Not sure where to start? WYZ Design matches you with the perfect creative services for your brand. Personalized recommendations, custom pricing, style-matched creatives.",
  keywords: ["service matching", "creative services finder", "personalized recommendations", "WYZ Design match"],
  openGraph: {
    title: "Match | WYZ Design",
    description: "Find your perfect creative services. Personalized matching based on your brand and goals.",
    url: "https://wyzdesign.com/match",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/match",
  },
};