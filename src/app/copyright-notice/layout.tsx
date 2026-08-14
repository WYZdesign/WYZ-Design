import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Copyright Notice",
  description: "Copyright information for WYZ Design. All rights reserved.",
  alternates: { canonical: "https://www.wyzdesign.com/copyright-notice" },
  openGraph: {
    title: "Copyright Notice | WYZ Design",
    description: "All rights reserved.",
    url: "https://www.wyzdesign.com/copyright-notice",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Copyright Notice | WYZ Design", description: "All rights reserved.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function CopyrightLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
