import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Design",
  description: "Custom website design and development. No templates. Fast, responsive, SEO-optimized websites that convert. Starting at $500.",
  keywords: ["web design", "website development", "custom website", "responsive design", "SEO website", "Los Angeles web design"],
  alternates: { canonical: "https://www.wyzdesign.com/web-design" },
  openGraph: {
    title: "Web Design | WYZ Design",
    description: "Custom website design. No templates. Fast, responsive, SEO-optimized. Starting at $500.",
    url: "https://www.wyzdesign.com/web-design",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Web Design | WYZ Design", description: "Custom website design. No templates. Starting at $500.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function WebDesignLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
