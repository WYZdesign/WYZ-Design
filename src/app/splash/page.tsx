"use client";

import { useEffect } from "react";
import { RandomSplash } from "@/components/SplashVariants";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);
  return (
    <div className="fixed inset-0 z-[9999]" style={{ backgroundColor: "#111" }}>
      <RandomSplash onEnter={() => { document.body.style.overflow = ""; router.push("/home"); }} />
    </div>
  );
}
