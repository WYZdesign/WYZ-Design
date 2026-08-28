import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Photoshoot — Professional Photography Sessions",
  description: "Book a professional photoshoot with WYZ Design. Portraits, events, editorial, commercial. 1hr, 2hr, 3hr sessions. Real-time calendar availability.",
  keywords: ["book photoshoot", "photography booking", "portrait session", "event photography booking", "WYZ Design photoshoot"],
  openGraph: {
    title: "Book Photoshoot | WYZ Design",
    description: "Professional photography sessions. Portraits, events, editorial, commercial.",
    url: "https://wyzdesign.com/booking-calendar/photoshoot",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/booking-calendar/photoshoot",
  },
};