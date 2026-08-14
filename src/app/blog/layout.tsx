import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on creative direction, branding, photography, web design, and the business of making things that look good.",
  keywords: ["creative blog", "design tips", "branding advice", "photography tips", "web design trends"],
  alternates: { canonical: "https://www.wyzdesign.com/blog" },
  openGraph: {
    title: "Blog | WYZ Design",
    description: "Insights on creative direction, branding, photography, and design.",
    url: "https://www.wyzdesign.com/blog",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Blog | WYZ Design", description: "Insights on creative direction, branding, photography.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
