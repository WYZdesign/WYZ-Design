import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photoshoot Service",
  description: "Professional photoshoot sessions starting at $100/hr. Lighting, creative direction, 20+ edited high-res images. Book now.",
  keywords: ["photoshoot booking", "professional photoshoot", "portrait session", "Los Angeles photoshoot"],
  alternates: { canonical: "https://www.wyzdesign.com/service-page/photoshoot" },
  openGraph: {
    title: "Photoshoot Service | WYZ Design",
    description: "Professional photoshoots starting at $100/hr.",
    url: "https://www.wyzdesign.com/service-page/photoshoot",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Photoshoot Service | WYZ Design", description: "Professional photoshoots starting at $100/hr.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function PhotoshootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
