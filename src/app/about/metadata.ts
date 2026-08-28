import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — WYZ Design",
  description: "WYZ Design is a creative studio built by artists, for artists. Photography, design, video, web. Los Angeles + Chicago. No outsourcing, no cutting corners.",
  keywords: ["about WYZ Design", "creative studio Los Angeles", "artist-led agency", "creative team"],
  openGraph: {
    title: "About | WYZ Design",
    description: "Creative studio built by artists, for artists. Los Angeles + Chicago.",
    url: "https://wyzdesign.com/about",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/about",
  },
};