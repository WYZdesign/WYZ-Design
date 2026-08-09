"use client";

import { useState } from "react";
import { RandomSplash } from "@/components/SplashVariants";
import HomePage from "./home/page";

export default function Page() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      {!entered && (
        <div className="fixed inset-0 z-[9999] bg-[#111] transition-opacity duration-700">
          <RandomSplash onEnter={() => setEntered(true)} />
        </div>
      )}
      <div className={entered ? "block" : "opacity-0 pointer-events-none"}>
        <HomePage />
      </div>
    </>
  );
}
