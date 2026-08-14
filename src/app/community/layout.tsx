import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description: "Join the WYZ Design creative community. Connect with artists, designers, photographers, and brands.",
  keywords: ["creative community", "artist network", "design community Los Angeles"],
  alternates: { canonical: "https://www.wyzdesign.com/community" },
  openGraph: {
    title: "Community | WYZ Design",
    description: "Connect with artists, designers, photographers, and brands.",
    url: "https://www.wyzdesign.com/community",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Community | WYZ Design", description: "Connect with artists, designers, photographers.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
