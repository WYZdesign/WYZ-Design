"use client";

import { useState, useEffect } from "react";
import { FiX, FiGlobe } from "react-icons/fi";

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CONSENT_KEY = "wyz_cookie_consent";

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConsent({ ...consent, ...parsed });
      } catch {}
    } else {
      setShow(true);
    }
  }, []);

  const acceptAll = () => {
    const full: CookieConsent = { necessary: true, analytics: true, marketing: true };
    setConsent(full);
    localStorage.setItem(CONSENT_KEY, JSON.stringify(full));
    setShow(false);
    enableAnalytics();
  };

  const acceptNecessary = () => {
    const minimal: CookieConsent = { necessary: true, analytics: false, marketing: false };
    setConsent(minimal);
    localStorage.setItem(CONSENT_KEY, JSON.stringify(minimal));
    setShow(false);
  };

  const saveCustom = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    setShow(false);
    if (consent.analytics) enableAnalytics();
  };

  const enableAnalytics = () => {
    if (typeof window !== "undefined" && (window as any).umami) {
      (window as any).umami.track("consent_analytics_accepted");
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-96 z-50 animate-slideUp"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="bg-white dark:bg-[#1C1C1E] border border-[#E2E2E2] dark:border-[#444] rounded-xl shadow-xl p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <FiGlobe className="w-6 h-6 text-[#DF3131]" />
            <div>
              <h3 className="font-heading font-bold text-[#333] dark:text-white text-lg">Cookie Preferences</h3>
              <p className="text-sm text-[#666] dark:text-white/70">We use cookies to enhance your experience.</p>
            </div>
          </div>
          <button onClick={() => setShow(false)} className="text-[#888] hover:text-[#DF3131] transition-colors p-1">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent.necessary}
              disabled
              className="w-4 h-4 rounded border-[#DF3131] text-[#DF3131] focus:ring-[#DF3131]"
            />
            <div>
              <p className="font-medium text-[#333] dark:text-white">Necessary Cookies</p>
              <p className="text-sm text-[#666] dark:text-white/70">Required for the site to function. Cannot be disabled.</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent.analytics}
              onChange={() => setConsent({ ...consent, analytics: !consent.analytics })}
              className="w-4 h-4 rounded border-[#DF3131] text-[#DF3131] focus:ring-[#DF3131]"
            />
            <div>
              <p className="font-medium text-[#333] dark:text-white">Analytics Cookies</p>
              <p className="text-sm text-[#666] dark:text-white/70">Help us understand how visitors interact with our site (Umami).</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent.marketing}
              onChange={() => setConsent({ ...consent, marketing: !consent.marketing })}
              className="w-4 h-4 rounded border-[#DF3131] text-[#DF3131] focus:ring-[#DF3131]"
            />
            <div>
              <p className="font-medium text-[#333] dark:text-white">Marketing Cookies</p>
              <p className="text-sm text-[#666] dark:text-white/70">Used to deliver personalized ads and measure campaign effectiveness.</p>
            </div>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={acceptNecessary}
            className="flex-1 px-4 py-3 border-2 border-[#E2E2E2] dark:border-[#444] text-[#666] dark:text-white font-bold tracking-[0.08em] uppercase text-sm rounded-lg hover:border-[#DF3131] hover:text-[#DF3131] transition-all"
          >
            Necessary Only
          </button>
          <button
            onClick={saveCustom}
            className="flex-1 px-4 py-3 bg-[#DF3131] text-white font-bold tracking-[0.08em] uppercase text-sm rounded-lg hover:bg-[#B82020] transition-all"
          >
            Save Preferences
          </button>
          <button
            onClick={acceptAll}
            className="flex-1 px-4 py-3 bg-[#333] dark:bg-white text-white dark:text-[#333] font-bold tracking-[0.08em] uppercase text-sm rounded-lg hover:bg-[#DF3131] hover:text-white transition-all"
          >
            Accept All
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-[#888] dark:text-white/50">
          You can change your preferences at any time from the footer.{" "}
          <a href="/privacy" className="text-[#DF3131] hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}