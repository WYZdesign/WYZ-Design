import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3-Point Program",
  description: "The WYZ Design 3-Point Program, a structured framework for creative growth and brand development.",
  keywords: ["creative growth", "brand development", "3-point program"],
  alternates: { canonical: "https://www.wyzdesign.com/3pointprogram" },
  openGraph: {
    title: "3-Point Program | WYZ Design",
    description: "Structured framework for creative growth.",
    url: "https://www.wyzdesign.com/3pointprogram",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "3-Point Program | WYZ Design", description: "Structured framework for creative growth.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function ThreePointLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
