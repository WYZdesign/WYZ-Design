import type { Metadata } from "next";
import HomeEntry from "@/components/HomeEntry";

// 2026-10-27 (Claude): "/" was emitting NO <link rel="canonical"> and using
// the generic 62-char title / 214-char description from the root layout's
// defaults -- every other checked route has its own shorter title,
// description and canonical, but "/" never did. Root cause: this file
// (app/page.tsx) is a client component (it owns the splash/scroll-lock
// state), and Next.js metadata exports only work from server components --
// so there was nowhere in the "/" route segment that COULD declare its own
// metadata (a sibling src/app/home/metadata.ts was written with the right
// content, including the canonical, but nothing ever imported it -- app/
// has no special "metadata.ts" file convention, only layout.tsx/page.tsx
// exports are read -- so it was silently dead). Fixed by splitting the
// client-only splash logic out into components/HomeEntry.tsx and making
// this file a plain server component again, so it can export its own
// metadata the same way every other route's layout.tsx already does.
// Title/description below are the already-written home/metadata.ts
// content, shortened to fit the normal SEO limits (title <=60 chars,
// description 50-160 chars) while keeping the same voice.
export const metadata: Metadata = {
  title: "WYZ Design | Creative Direction & Production",
  description:
    "WYZ Design is the creative problem you hire when your brand is tired of looking like it was designed by a committee. Photography, design, web, print, motion.",
  keywords: ["WYZ Design", "creative agency", "Los Angeles", "photography", "graphic design", "branding", "web design", "printing", "event production"],
  openGraph: {
    title: "WYZ Design | Creative Direction & Production",
    description: "Photography, design, web, print, motion. Los Angeles. Sharp creative work that does what it's supposed to do.",
    url: "https://www.wyzdesign.com",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WYZ Design | Creative Direction & Production",
    description: "Photography, design, web, print, motion. Los Angeles.",
    images: ["/wyz-og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return <HomeEntry />;
}
