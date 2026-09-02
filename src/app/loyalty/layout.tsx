import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rewards",
  description: "Earn Zeal for everything you do on the WYZ Design site. Daily visits, quests, achievements, and hidden secrets all stack up toward real perks.",
  keywords: ["WYZ Design rewards", "creative agency rewards", "earn zeal points", "member perks", "Los Angeles"],
  alternates: { canonical: "https://www.wyzdesign.com/loyalty" },
  openGraph: {
    title: "Rewards",
    description: "Earn Zeal for exploring the site. Climb from Recruit to Legend and unlock real perks.",
    url: "https://www.wyzdesign.com/loyalty",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Zeal Rewards", description: "Earn Zeal for exploring the site and unlock real perks.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function LoyaltyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
