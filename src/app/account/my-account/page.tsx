"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyAccountPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin");
  }, [router]);
  return (
    <div className="min-h-screen bg-white dark:bg-[#232326] flex items-center justify-center">
      <p className="text-[#888] dark:text-white/50">Redirecting...</p>
    </div>
  );
}
