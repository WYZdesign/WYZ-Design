"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const CONSENT_KEY = "wyz_cookie_consent";

function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (raw) return JSON.parse(raw).analytics === true;
  } catch {}
  return false;
}

let _sid = "";
function getSid() {
  if (_sid) return _sid;
  if (typeof window === "undefined") return "";
  try {
    _sid = sessionStorage.getItem("wyz-sid") || Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("wyz-sid", _sid);
  } catch {
    _sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  return _sid;
}

export function trackEvent(event_type: string, path?: string, label?: string, value?: number, metadata?: Record<string, unknown>) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_type,
      path: path || window.location.pathname,
      label: label || "",
      value: value || 0,
      metadata: metadata || {},
      session_id: getSid(),
    }),
  }).catch(() => {});
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const startRef = useRef<number>(Date.now());
  const sentRef = useRef(false);

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;
    sentRef.current = false;
    startRef.current = Date.now();

    const timer = setTimeout(() => {
      if (sentRef.current) return;
      sentRef.current = true;
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          referrer: document.referrer || "",
          session_id: getSid(),
          screen_width: window.innerWidth,
          duration_ms: Date.now() - startRef.current,
        }),
      }).catch(() => {});
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;
    const handler = () => {
      if (typeof navigator === "undefined" || !navigator.sendBeacon) return;
      const duration = Date.now() - startRef.current;
      const blob = new Blob([JSON.stringify({
        path: pathname,
        session_id: getSid(),
        duration_ms: duration,
      })], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [pathname]);

  return null;
}
