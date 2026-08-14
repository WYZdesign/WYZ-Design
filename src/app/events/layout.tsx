import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Event Production",
  description: "Event production, concert photography, promotional content. From concept to curtains — flyers, social rollout, photo/video recap. Book your event.",
  keywords: ["event production", "concert photography", "event flyers", "Los Angeles events"],
  alternates: { canonical: "https://www.wyzdesign.com/events" },
  openGraph: {
    title: "Events | WYZ Design",
    description: "Event production, concert photography, promotional content. Book your event.",
    url: "https://www.wyzdesign.com/events",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Events | WYZ Design", description: "Event production, concert photography, promotional content.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
