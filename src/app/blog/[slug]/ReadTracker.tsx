"use client";

import { useEffect, useRef } from "react";
import { useZeal } from "@/components/ZealProvider";

export default function ReadTracker() {
  const { earn } = useZeal();
  const mountedAtRef = useRef(0);

  useEffect(() => {
    mountedAtRef.current = Date.now();
    void earn("read-blog-post");
    const thoroughTimer = setTimeout(() => {
      void earn("thorough-reader");
    }, 180000);
    return () => {
      clearTimeout(thoroughTimer);
      const elapsed = Date.now() - mountedAtRef.current;
      if (elapsed < 5000) {
        void earn("speed-reader");
      }
    };
  }, [earn]);

  return null;
}
