import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Start a Project, Ask a Question, Say Hello",
  description: "Get in touch with WYZ Design. Los Angeles + Chicago. info@wyzdesign.com • (213) 399-9610. We respond within 24 hours.",
  keywords: ["contact WYZ Design", "creative agency contact", "start a project", "Los Angeles creative studio"],
  openGraph: {
    title: "Contact | WYZ Design",
    description: "Start a project. info@wyzdesign.com • (213) 399-9610",
    url: "https://wyzdesign.com/contact",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/contact",
  },
};