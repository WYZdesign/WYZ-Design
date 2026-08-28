import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search — Find Services, Content & Resources",
  description: "Search WYZ Design. Find photography, designs, events, services, plans, merch, printing, web design, booking, FAQ, blog, gallery, rewards, featured artist, consultations.",
  keywords: ["search WYZ Design", "find services", "search photography", "search designs", "search events"],
  openGraph: {
    title: "Search | WYZ Design",
    description: "Search all WYZ Design services, content, and resources.",
    url: "https://wyzdesign.com/search",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/search",
  },
  robots: { index: false, follow: false },
};