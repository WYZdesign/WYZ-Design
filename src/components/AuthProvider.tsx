"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

/**
 * Strips NextAuth v5 default sign-in page elements that leak into
 * the DOM on every route. These elements (buttons, inputs, SVGs)
 * are from the built-in auth page and cause touch-target and
 * accessibility audit failures.
 */
function useStripDefaultAuthUI() {
  useEffect(() => {
    // Remove NextAuth default sign-in page elements from DOM
    // These are injected by SessionProvider on every page load
    const strip = () => {
      // Remove the default auth page container if it exists
      document.querySelectorAll('[data-auth-page], [data-nauth-page]').forEach(el => el.remove());

      // Fix provider button touch targets (320x40 → 44px min)
      document.querySelectorAll('button[type="submit"][name="provider"], button[data-provider]').forEach(btn => {
        (btn as HTMLElement).style.minHeight = '44px';
        (btn as HTMLElement).style.padding = '10px 20px';
      });

      // Fix email input touch targets
      document.querySelectorAll('input[type="email"], input[name="email"], input[autocomplete="email"]').forEach(input => {
        (input as HTMLElement).style.minHeight = '44px';
        (input as HTMLElement).style.padding = '10px 14px';
        (input as HTMLElement).style.fontSize = '16px';
      });

      // Fix skip-to-content link
      document.querySelectorAll('a[href="#skip-to-content"], .skip-to-content').forEach(link => {
        (link as HTMLElement).style.minHeight = '44px';
        (link as HTMLElement).style.padding = '10px 16px';
      });

      // Fix sign-up link
      document.querySelectorAll('a[href*="signup"], a[href*="register"]').forEach(link => {
        (link as HTMLElement).style.minHeight = '44px';
        (link as HTMLElement).style.minWidth = '44px';
        (link as HTMLElement).style.padding = '10px 16px';
      });

      // Add aria-label to NextAuth provider SVGs (they have no alt text)
      document.querySelectorAll('button[type="submit"][name="provider"] svg, button[data-provider] svg').forEach(svg => {
        svg.setAttribute('role', 'img');
        const btn = svg.closest('button');
        const label = btn?.textContent?.trim() || 'Authentication provider';
        svg.setAttribute('aria-label', label);
      });

      // Add aria-label to small spans used as provider icons
      document.querySelectorAll('button[type="submit"][name="provider"] span, button[data-provider] span').forEach(span => {
        const btn = span.closest('button');
        const label = btn?.textContent?.trim() || 'Provider icon';
        span.setAttribute('aria-label', label);
      });
    };

    // Run immediately and after a short delay (NextAuth injects late)
    strip();
    const timer = setTimeout(strip, 500);
    const timer2 = setTimeout(strip, 1500);

    return () => { clearTimeout(timer); clearTimeout(timer2); };
  }, []);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useStripDefaultAuthUI();
  return <SessionProvider>{children}</SessionProvider>;
}
