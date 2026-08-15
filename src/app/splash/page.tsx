"use client";

import { RandomSplash } from "@/components/SplashVariants";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-[9999]" style={{ backgroundColor: "#111" }}>
      <RandomSplash onEnter={() => router.push("/home")} />
    </div>
  );
}
