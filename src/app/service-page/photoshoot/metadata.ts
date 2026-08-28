import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photoshoot — Professional Photography Sessions",
  description: "Professional photoshoot sessions including lighting, creative direction, and edited high-resolution images. Portraits, editorial, commercial, studio. $100/hr.",
  keywords: ["photoshoot", "professional photography", "portrait session", "editorial photography", "commercial photography", "studio photography", "WYZ Design photoshoot"],
  openGraph: {
    title: "Photoshoot | WYZ Design",
    description: "Professional photoshoot sessions. Portraits, editorial, commercial, studio. $100/hr.",
    url: "https://wyzdesign.com/service-page/photoshoot",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/service-page/photoshoot",
  },
};