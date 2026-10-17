import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Splash Preview",
  robots: { index: false, follow: false },
};

export default function MobileSplashLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
