"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function RouteBackground() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/splash-gallery") {
      const prevOverflow = document.body.style.overflow;
      document.documentElement.style.background = "#111";
      document.body.style.background = "#111";
      document.body.style.backgroundColor = "#111";
      document.body.style.overflow = "hidden";
      return () => {
        document.documentElement.style.background = "";
        document.body.style.background = "";
        document.body.style.backgroundColor = "";
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [pathname]);

  return null;
}
