import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search WYZ Design to find services, portfolio work, articles, and resources.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://www.wyzdesign.com/search" },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
