import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Retouching Service",
  description: "Professional photo retouching, from basic cleanup to advanced editing. Fast turnaround. Starting at $50.",
  keywords: ["photo retouching", "image editing", "professional retouching"],
  alternates: { canonical: "https://www.wyzdesign.com/service-page/photo-retouching" },
  openGraph: {
    title: "Photo Retouching | WYZ Design",
    description: "Professional retouching starting at $50.",
    url: "https://www.wyzdesign.com/service-page/photo-retouching",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Photo Retouching | WYZ Design", description: "Professional retouching starting at $50.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function PhotoRetouchingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
