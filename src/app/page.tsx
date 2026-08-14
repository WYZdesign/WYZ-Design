"use client";

import { useState } from "react";
import { RandomSplash } from "@/components/SplashVariants";
import HomePage from "./home/page";

export default function Page() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      {!entered && (
        <div className="fixed inset-0 z-[9999]" style={{ backgroundColor: "#111" }}>
          <RandomSplash onEnter={() => setEntered(true)} />
        </div>
      )}
      <div style={entered ? undefined : { opacity: 0, pointerEvents: "none" }}>
        <HomePage />
      </div>
    </>
  );
}
