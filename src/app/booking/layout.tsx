import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Service",
  description: "Book photography, retouching, event coverage, or consultation services online. Secure your spot.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://www.wyzdesign.com/booking" },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
