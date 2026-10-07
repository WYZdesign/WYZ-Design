import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms of service for using WYZ Design's website and services.",
  alternates: { canonical: "https://www.wyzdesign.com/legal/terms" },
  openGraph: {
    title: "Terms & Conditions | WYZ Design",
    description: "Terms of service.",
    url: "https://www.wyzdesign.com/legal/terms",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Terms & Conditions | WYZ Design", description: "Terms of service.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
