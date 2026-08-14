import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How WYZ Design collects, uses, and protects your personal information. GDPR-compliant privacy policy.",
  alternates: { canonical: "https://www.wyzdesign.com/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | WYZ Design",
    description: "GDPR-compliant privacy policy.",
    url: "https://www.wyzdesign.com/privacy-policy",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Privacy Policy | WYZ Design", description: "GDPR-compliant privacy policy.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
