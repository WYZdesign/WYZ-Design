import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Printing",
  description: "Professional digital printing — stickers, flyers, prints, posters. Premium paper stocks, vibrant colors, fast turnaround. Order online.",
  keywords: ["digital printing", "sticker printing", "flyer printing", "poster printing", "print shop Los Angeles"],
  alternates: { canonical: "https://www.wyzdesign.com/printing" },
  openGraph: {
    title: "Digital Printing | WYZ Design",
    description: "Stickers, flyers, prints, posters. Premium quality. Fast turnaround.",
    url: "https://www.wyzdesign.com/printing",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Digital Printing | WYZ Design", description: "Stickers, flyers, prints, posters. Premium quality.", images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
};

export default function PrintingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
