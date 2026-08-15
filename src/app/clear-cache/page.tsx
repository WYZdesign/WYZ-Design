"use client";

import { useState } from "react";

export default function ClearCachePage() {
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState("");

  const runClean = async () => {
    setStatus("Cleaning...");
    try {
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch {}
    try {
      localStorage.clear();
    } catch {}
    try {
      sessionStorage.clear();
    } catch {}
    try {
      document.cookie.split(";").forEach((c) => {
        const name = c.split("=")[0].trim();
        if (name) document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
    } catch {}
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
    } catch {}

    setDone(true);
    setStatus("Done! Redirecting you home…");
    setTimeout(() => {
      try {
        window.location.replace("/home?t=" + Date.now());
      } catch {
        window.location.href = "/home";
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-3xl font-black tracking-wide mb-4">Clear Cache &amp; Cookies</h1>
        <p className="text-white/60 mb-8 leading-relaxed">
          If the site looks unstyled, broken, or won&apos;t load properly on this device, tap the button below.
          It wipes all cached files, cookies, local storage, and service workers in one go.
        </p>
        <button
          onClick={runClean}
          className="px-10 py-4 bg-[#DF3131] text-white font-bold tracking-widest uppercase rounded-lg hover:bg-[#b82020] transition-all"
        >
          {done ? "Done ✓" : "Clear Everything"}
        </button>
        {status && <p className="mt-6 text-sm text-[#ff8a80]">{status}</p>}
        <p className="mt-8 text-xs text-white/40">
          You can also visit any page with <code className="bg-white/10 px-1 rounded">?reset=1</code> to auto-clean on load.
        </p>
      </div>
    </div>
  );
}
