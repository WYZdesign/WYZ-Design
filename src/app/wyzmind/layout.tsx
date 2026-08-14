import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WYZMiND Systems",
  description: "AI-powered creative infrastructure — intake bots, client portals, booking automation, workflow intelligence.",
  keywords: ["AI creative tools", "client portal", "booking automation", "workflow intelligence"],
  alternates: { canonical: "https://www.wyzdesign.com/wyzmind" },
  openGraph: {
    title: "WYZMiND Systems | WYZ Design",
    description: "AI-powered creative infrastructure that scales your business.",
    url: "https://www.wyzdesign.com/wyzmind",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "WYZMiND Systems | WYZ Design", description: "AI-powered creative infrastructure.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function WyzmindLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
