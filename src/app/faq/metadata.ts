import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Common Questions About Services, Pricing & Process",
  description: "Frequently asked questions about WYZ Design services. Creative design, web, photography, printing, events, branding. Pricing, process, and how to get started.",
  keywords: ["FAQ", "frequently asked questions", "creative agency FAQ", "pricing questions", "process", "WYZ Design FAQ"],
  openGraph: {
    title: "FAQ | WYZ Design",
    description: "Common questions about services, pricing, and process.",
    url: "https://wyzdesign.com/faq",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/faq",
  },
};