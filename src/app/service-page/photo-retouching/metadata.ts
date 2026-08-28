import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Retouching — Basic to Advanced Professional Editing",
  description: "Professional photo retouching from basic cleanup to advanced editing. Skin smoothing, color correction, background removal, composite work. $50/session.",
  keywords: ["photo retouching", "photo editing", "image retouching", "skin smoothing", "color correction", "background removal", "WYZ Design retouching"],
  openGraph: {
    title: "Photo Retouching | WYZ Design",
    description: "Professional photo retouching from basic cleanup to advanced editing. $50/session.",
    url: "https://wyzdesign.com/service-page/photo-retouching",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/service-page/photo-retouching",
  },
};