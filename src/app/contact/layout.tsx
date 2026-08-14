import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with WYZ Design. Book a free consultation, ask about services, or start your next project. Los Angeles, serving nationwide.",
  keywords: ["contact WYZ Design", "book consultation", "creative agency contact", "Los Angeles design"],
  alternates: { canonical: "https://www.wyzdesign.com/contact" },
  openGraph: {
    title: "Contact | WYZ Design",
    description: "Get in touch. Book a free consultation. Los Angeles, serving nationwide.",
    url: "https://www.wyzdesign.com/contact",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Contact | WYZ Design", description: "Get in touch. Book a free consultation.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
