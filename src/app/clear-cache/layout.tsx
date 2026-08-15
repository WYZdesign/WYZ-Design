import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clear Cache",
  description: "Clear cached files, cookies, and service workers for the WYZ Design site.",
  robots: { index: false, follow: false },
};

export default function ClearCacheLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
