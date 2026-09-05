import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Photoshoot | WYZ Design",
  description: "Book your photoshoot session with WYZ Design. Choose your date, time, and package. Professional photography starting at $100/hr. Secure your spot online.",
  keywords: ["book photoshoot", "photoshoot booking", "Los Angeles photographer", "portrait session", "WYZ Design"],
  alternates: { canonical: "https://www.wyzdesign.com/booking-calendar/photoshoot" },
  openGraph: {
title: "Book a Photoshoot",
    description: "Book your photoshoot session with WYZ Design. Professional photography starting at $100/hr.",
    url: "https://www.wyzdesign.com/booking-calendar/photoshoot",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Book a Photoshoot | WYZ Design", description: "Book your photoshoot session with WYZ Design.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function PhotoshootBookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
