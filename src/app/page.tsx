"use client";

import { useEffect, useState } from "react";
import { RandomSplash } from "@/components/SplashVariants";
import HomePage from "./home/page";

const SEEN_KEY = "wyz-splash-seen";

export default function Page() {
  const [entered, setEntered] = useState(false);

  // Show the splash once per browser session. Returning to "/" in the same
  // session skips straight to content; a new session gets the brand moment again.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY) === "1") setEntered(true);
    } catch {}
  }, []);

  const handleEnter = () => {
    setEntered(true);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
  };

  return (
    <>
      {!entered && (
        <div className="fixed inset-0 z-[9999]" style={{ backgroundColor: "#111" }}>
          <RandomSplash onEnter={handleEnter} />
        </div>
      )}
      <div style={entered ? undefined : { opacity: 0, pointerEvents: "none" }}>
        <HomePage />
      </div>
    </>
  );
}
