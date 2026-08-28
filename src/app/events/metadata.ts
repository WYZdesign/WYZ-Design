import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events — Previous Events, Video Recaps & Photo Galleries",
  description: "Explore past WYZ Design events. Birthday videos, family recaps, music events, fashion shows. Watch video recaps and browse photo galleries.",
  keywords: ["event photography Los Angeles", "event recap videos", "WYZ Design events", "event highlights", "photo gallery"],
  openGraph: {
    title: "Events | WYZ Design",
    description: "Previous events with video recaps and photo galleries.",
    url: "https://wyzdesign.com/events",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/events",
  },
};