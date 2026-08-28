import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Splash Gallery — Visual Experiments",
  description: "WYZ Design splash gallery. 10+ visual experiments: Abstract Flow, Neon Nights, Urban Pulse, Color Storm, Digital Dreams, Retro Wave, Minimal Edge, Bold Statement, Creative Fire, Fresh Cut.",
  keywords: ["splash gallery", "visual experiments", "creative gallery", "WYZ Design splash"],
  openGraph: {
    title: "Splash Gallery | WYZ Design",
    description: "10+ visual experiments and creative splashes.",
    url: "https://wyzdesign.com/splash-gallery",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/splash-gallery",
  },
};