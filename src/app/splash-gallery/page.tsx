import type { Metadata } from "next";
import SplashGallery from "@/components/SplashVariants";

export const metadata: Metadata = {
  title: "Splash Gallery",
  description: "24 animated splash screen designs and motion graphics — WYZ Design",
};

export default function Page() {
  return <SplashGallery />;
}
