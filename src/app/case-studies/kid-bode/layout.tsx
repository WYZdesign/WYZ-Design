import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Study: Kid Bode",
  description: "How WYZ Design partnered with Kid Bode for event production and brand growth.",
  alternates: { canonical: "https://www.wyzdesign.com/case-studies/kid-bode" },
  openGraph: {
    title: "Case Study: Kid Bode | WYZ Design",
    description: "Event production and brand growth partnership.",
    url: "https://www.wyzdesign.com/case-studies/kid-bode",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Case Study: Kid Bode | WYZ Design", description: "Event production and brand growth.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function KidBodeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
