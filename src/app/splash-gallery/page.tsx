import type { Metadata } from "next";
import SplashGallery, { VARIANT_COUNT } from "@/components/SplashVariants";

export const metadata: Metadata = {
  title: "Splash Gallery",
  description: `${VARIANT_COUNT} animated splash screen designs and motion graphics - WYZ Design`,
};

export default function Page() {
  return <SplashGallery />;
}
