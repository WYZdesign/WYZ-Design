"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const consented = localStorage.getItem("cookie-consent");
    if (!consented) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-[#111] text-[#333] dark:text-white p-2 shadow-lg border-t border-[#E2E2E2] dark:border-white/10">
      <div className="max-w-[130rem] mx-auto px-4 flex flex-row items-center justify-between gap-4">
        <p className="text-[11px] text-[#666] dark:text-white/70 leading-tight">
          Cookies used. <Link href="/privacy-policy" className="text-[#DF3131] hover:underline whitespace-nowrap">Policy</Link>
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => { localStorage.setItem("cookie-consent", "declined"); setShow(false); }}
            className="px-3 py-1.5 text-[12px] text-[#666] dark:text-white/50 hover:text-[#333] dark:hover:text-white transition-colors">
            Decline
          </button>
          <button onClick={() => { localStorage.setItem("cookie-consent", "accepted"); setShow(false); }}
            className="px-4 py-1.5 bg-[#DF3131] text-white text-[12px] font-bold hover:bg-[#B82020] transition-colors">
            ACCEPT
          </button>
        </div>
      </div>
    </div>
  );
}
