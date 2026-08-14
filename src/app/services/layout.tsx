import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Professional photography, graphic design, videography, web design, branding, and consultation. Transparent pricing, fast turnaround. Book online.",
  keywords: ["creative services", "photography", "graphic design", "web design", "branding", "Los Angeles"],
  alternates: { canonical: "https://www.wyzdesign.com/services" },
  openGraph: {
    title: "Services | WYZ Design",
    description: "Photography, design, videography, web, branding, consultation. Transparent pricing. Book online.",
    url: "https://www.wyzdesign.com/services",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Services | WYZ Design", description: "Photography, design, videography, web, branding, consultation.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
