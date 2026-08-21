import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Consultation | WYZ Design",
  description: "Schedule a free creative consultation with WYZ Design. Pick a time that works for you and get a clear game plan for your brand or project.",
  keywords: ["book consultation", "free creative consultation", "brand strategy", "Los Angeles creative agency", "WYZ Design"],
  alternates: { canonical: "https://www.wyzdesign.com/booking-calendar/consultation" },
  openGraph: {
    title: "Book a Consultation | WYZ Design",
    description: "Schedule a free creative consultation with WYZ Design.",
    url: "https://www.wyzdesign.com/booking-calendar/consultation",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Book a Consultation | WYZ Design", description: "Schedule a free creative consultation with WYZ Design.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function ConsultationBookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
