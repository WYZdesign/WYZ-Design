"use client";

import { useRouter } from "next/navigation";
import { RandomSplash } from "@/components/SplashVariants";

export default function SplashPage() {
  const router = useRouter();

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>
      <a
        href="/home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-black focus:font-semibold focus:text-sm"
      >
        Skip to main content
      </a>
      <RandomSplash onEnter={() => router.push("/home")} />
    </div>
  );
}
