import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Splash Showcase — Interactive Visual Gallery",
  description: "WYZ Design splash showcase. Interactive gallery with gyroscope-powered parallax effects. 10 visual experiments: Abstract Flow, Neon Nights, Urban Pulse, Color Storm, Digital Dreams, Retro Wave, Minimal Edge, Bold Statement, Creative Fire, Fresh Cut.",
  keywords: ["splash showcase", "interactive gallery", "gyroscope parallax", "creative showcase", "WYZ Design showcase"],
  openGraph: {
    title: "Splash Showcase | WYZ Design",
    description: "Interactive visual gallery with gyroscope parallax effects.",
    url: "https://wyzdesign.com/splash-showcase",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/splash-showcase",
  },
};