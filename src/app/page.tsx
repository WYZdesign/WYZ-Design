"use client";

import { useEffect, useState } from "react";
import { RandomSplash } from "@/components/SplashVariants";
import { useSplashScrollLock } from "@/hooks/useSplashScrollLock";
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

  useSplashScrollLock(!entered);

  const handleEnter = () => {
    setEntered(true);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch {}
  };

  return (
    <>
      {!entered && (
        <div
          className="fixed inset-0 z-[9999]"
          style={{ backgroundColor: "#111" }}
          onClick={handleEnter}
        >
          <RandomSplash onEnter={handleEnter} />
        </div>
      )}
      <div
        aria-hidden={!entered}
        inert={!entered ? true : undefined}
        style={entered ? undefined : { opacity: 0, pointerEvents: "none" }}
      >
        <HomePage />
      </div>
    </>
  );
}
