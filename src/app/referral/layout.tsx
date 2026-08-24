import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referral Program",
  description: "Earn 10% commission for every referral. Share your link, friends purchase, you get paid. No limits.",
  keywords: ["referral program", "earn money", "affiliate", "commission"],
  alternates: { canonical: "https://www.wyzdesign.com/referral" },
  openGraph: {
    title: "Referral Program | WYZ Design",
    description: "Earn 10% commission for every referral. Share your link, friends purchase, you get paid.",
    url: "https://www.wyzdesign.com/referral",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Referral Program | WYZ Design", description: "Earn 10% commission for every referral.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function ReferralLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
