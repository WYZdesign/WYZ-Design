import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Photography Service",
  description: "Expert event photography for concerts, showcases, and private events. Starting at $200 for 3 hours.",
  keywords: ["event photography", "concert photography", "event documentation"],
  alternates: { canonical: "https://www.wyzdesign.com/service-page/event-photography" },
  openGraph: {
    title: "Event Photography | WYZ Design",
    description: "Expert event photography starting at $200.",
    url: "https://www.wyzdesign.com/service-page/event-photography",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Event Photography | WYZ Design", description: "Expert event photography starting at $200.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function EventPhotographyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
