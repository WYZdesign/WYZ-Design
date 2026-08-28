import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FD Studios — Los Angeles Creative Studio Rental",
  description: "FD Studios: Olympic, Hill, Yukon buildings. 30+ creative spaces for rent. Underwater studio, cyclorama walls, car turntable, jet interior, rain room, raw concrete gallery. Los Angeles.",
  keywords: ["studio rental Los Angeles", "creative studio space", "photo studio rental", "video studio LA", "FD Studios", "Olympic Studios", "Hill Studios", "Yukon Studios"],
  openGraph: {
    title: "FD Studios | WYZ Design",
    description: "30+ creative studio spaces. Underwater, cyclorama, car turntable, rain room.",
    url: "https://wyzdesign.com/fd",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/fd",
  },
  robots: { index: false, follow: false },
};