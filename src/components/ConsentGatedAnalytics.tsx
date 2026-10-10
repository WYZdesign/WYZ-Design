"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const CONSENT_KEY = "wyz_cookie_consent";

export default function ConsentGatedAnalytics() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (raw) {
        const c = JSON.parse(raw);
        setConsent(c.analytics === true);
      }
    } catch {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY && e.newValue) {
        try {
          const c = JSON.parse(e.newValue);
          setConsent(c.analytics === true);
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    // Same-tab updates: the storage event never fires in the tab that made the
    // change, so the banner dispatches this event when the user saves a choice.
    const handleLocal = () => {
      try {
        const raw = localStorage.getItem(CONSENT_KEY);
        if (raw) setConsent(JSON.parse(raw).analytics === true);
      } catch {}
    };
    window.addEventListener("wyz:consent-changed", handleLocal);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("wyz:consent-changed", handleLocal);
    };
  }, []);

  if (!consent) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
