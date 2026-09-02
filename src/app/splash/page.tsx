"use client";

import { useEffect } from "react";
import { RandomSplash } from "@/components/SplashVariants";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.splashOpen = "true";
    return () => { document.body.style.overflow = prev; document.body.dataset.splashOpen = ""; };
  }, []);
  return (
    <div className="fixed inset-0 z-[9999]" style={{ backgroundColor: "#111" }}>
      <RandomSplash onEnter={() => { document.body.style.overflow = ""; document.body.dataset.splashOpen = ""; router.push("/home"); }} />
    </div>
  );
}
