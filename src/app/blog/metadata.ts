import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Creative Insights, Case Studies & Industry News",
  description: "WYZ Design blog covering photography tips, design trends, branding insights, web design guides, and creative business advice. Written by working artists.",
  keywords: ["creative blog", "photography tips", "design trends", "branding advice", "web design guide", "WYZ Design"],
  openGraph: {
    title: "Blog | WYZ Design",
    description: "Creative insights, case studies, and industry news from working artists.",
    url: "https://wyzdesign.com/blog",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/blog",
  },
};