import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photography",
  description: "Professional photography for portraits, events, editorial, and commercial. High-resolution images with 24-hour turnaround. Book your session.",
  keywords: ["professional photography", "portrait photography", "event photography", "Los Angeles photographer"],
  alternates: { canonical: "https://www.wyzdesign.com/photography" },
  openGraph: {
    title: "Photography | WYZ Design",
    description: "Professional photography for portraits, events, editorial. 24-hour turnaround.",
    url: "https://www.wyzdesign.com/photography",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Photography | WYZ Design", description: "Professional photography for portraits, events, editorial.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function PhotographyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
