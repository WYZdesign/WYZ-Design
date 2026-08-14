"use client";

import { useState, useEffect, useRef } from "react";
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

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
    // Don't show on splash page (root) - let user enter the site first
    if (window.location.pathname === "/") {
      setShow(false);
    }
  }, []);

  // Focus trap: move focus into dialog on open, trap Tab/Shift+Tab, restore on close
  useEffect(() => {
    if (!show) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShow(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [show]);

  const saveConsent = (c: CookieConsent) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
    setShow(false);
  };

  const acceptAll = () => {
    const full: CookieConsent = { necessary: true, analytics: true, marketing: true };
    setConsent(full);
    saveConsent(full);
    enableAnalytics();
  };

  const acceptNecessary = () => {
    const minimal: CookieConsent = { necessary: true, analytics: false, marketing: false };
    setConsent(minimal);
    saveConsent(minimal);
  };

  const saveCustom = () => {
    saveConsent(consent);
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
      ref={dialogRef}
      className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-auto sm:right-6 sm:w-96 z-[60] sm:animate-slideUp"
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-[#232326] border-t-2 border-[#DF3131] sm:border-2 sm:border-[#E2E2E2] dark:border-[#444] sm:rounded-xl shadow-2xl sm:shadow-xl p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <FiGlobe className="w-6 h-6 text-[#DF3131] flex-shrink-0" />
            <div>
              <h3 className="font-heading font-bold text-[#333] dark:text-white text-lg">Cookie Preferences</h3>
              <p className="text-sm text-[#666] dark:text-white/70 mt-0.5">We use cookies to enhance your experience.</p>
            </div>
          </div>
          <button ref={closeBtnRef} onClick={() => saveConsent({ necessary: true, analytics: false, marketing: false })} className="text-[#888] hover:text-[#DF3131] transition-colors p-1" aria-label="Close">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent.necessary}
              disabled
              className="w-4 h-4 rounded border-[#DF3131] text-[#DF3131] focus:ring-[#DF3131] mt-0.5"
            />
            <div>
              <p className="font-medium text-[#333] dark:text-white">Necessary Cookies</p>
              <p className="text-sm text-[#666] dark:text-white/70">Required for the site to function. Cannot be disabled.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent.analytics}
              onChange={() => setConsent({ ...consent, analytics: !consent.analytics })}
              className="w-4 h-4 rounded border-[#DF3131] text-[#DF3131] focus:ring-[#DF3131] mt-0.5"
            />
            <div>
              <p className="font-medium text-[#333] dark:text-white">Analytics Cookies</p>
              <p className="text-sm text-[#666] dark:text-white/70">Help us understand how visitors interact with our site (Umami).</p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent.marketing}
              onChange={() => setConsent({ ...consent, marketing: !consent.marketing })}
              className="w-4 h-4 rounded border-[#DF3131] text-[#DF3131] focus:ring-[#DF3131] mt-0.5"
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
          <a href="/privacy-policy" className="text-[#DF3131] hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
