import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Your Match",
  description: "Tell us your style and WYZ Design will match you with the perfect creative services.",
};

export default function MatchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
