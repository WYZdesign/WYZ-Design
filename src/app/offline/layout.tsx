import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline | WYZ Design",
  description: "You're offline. Reconnect to continue.",
  robots: { index: false, follow: false },
};

export default function OfflineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
