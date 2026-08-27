import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your WYZ Design account, view your Zeal rewards, and track your projects.",
};

export default function MyAccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
