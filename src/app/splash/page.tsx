"use client";

import { RandomSplash } from "@/components/SplashVariants";
import { useRouter } from "next/navigation";
import { useSplashScrollLock } from "@/hooks/useSplashScrollLock";

export default function SplashPage() {
  const router = useRouter();
  useSplashScrollLock(true);
  return (
    <div className="fixed inset-0 z-[9999]" style={{ backgroundColor: "#111" }}>
      <RandomSplash onEnter={() => router.push("/home")} />
    </div>
  );
}
