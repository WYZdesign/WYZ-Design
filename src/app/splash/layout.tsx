import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enter | WYZ Design",
  description: "Creative direction and production. Photography, graphic design, web design, videography, branding, and printing. Los Angeles + Chicago.",
  robots: { index: false, follow: true },
};

export default function SplashLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
