"use client";

import { RandomSplash } from "@/components/SplashVariants";
import { useRouter } from "next/navigation";
import { useSplashScrollLock } from "@/hooks/useSplashScrollLock";

export default function SplashPage() {
  const router = useRouter();
  useSplashScrollLock(true);
  const handleEnter = () => {
    try { sessionStorage.setItem("wyz-splash-seen", "1"); } catch {}
    router.push("/");
  };
  return (
    <div className="fixed inset-0 z-[9999]" style={{ backgroundColor: "#111" }}>
      <RandomSplash onEnter={handleEnter} />
    </div>
  );
}
