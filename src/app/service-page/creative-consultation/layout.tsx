import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creative Consultation",
  description: "Free creative consultation to unleash your brand's potential. Expert strategy sessions with actionable steps.",
  keywords: ["creative consultation", "brand strategy", "free consultation"],
  alternates: { canonical: "https://www.wyzdesign.com/service-page/creative-consultation" },
  openGraph: {
    title: "Creative Consultation | WYZ Design",
    description: "Free creative consultation. Expert strategy sessions.",
    url: "https://www.wyzdesign.com/service-page/creative-consultation",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Creative Consultation | WYZ Design", description: "Free creative consultation.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
