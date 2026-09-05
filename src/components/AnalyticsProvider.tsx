"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const CONSENT_KEY = "wyz_cookie_consent";

interface Consent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

function getConsent(): Consent {
  if (typeof window === "undefined") return { necessary: true, analytics: false, marketing: false };
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { necessary: true, analytics: false, marketing: false };
}

export default function AnalyticsProvider() {
  const [consent, setConsent] = useState<Consent>({ necessary: true, analytics: false, marketing: false });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setConsent(getConsent());
    setLoaded(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY && e.newValue) {
        try { setConsent(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (!loaded) return null;

  return (
    <>
      {/* ── Google Tag Manager ── */}
      {consent.analytics && process.env.NEXT_PUBLIC_GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
          `}
        </Script>
      )}

      {/* ── Meta / Facebook Pixel ── */}
      {consent.marketing && process.env.NEXT_PUBLIC_META_PIXEL_ID && (
        <>
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt="Tracking pixel for analytics"
            />
          </noscript>
        </>
      )}

      {/* ── Microsoft Clarity (free heatmaps + session recordings) ── */}
      {consent.analytics && process.env.NEXT_PUBLIC_CLARITY_ID && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
          `}
        </Script>
      )}

      {/* ── TikTok Pixel ── */}
      {consent.marketing && process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID && (
        <Script id="tiktok-pixel-init" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e+""]=+new Date,ttq._o=ttq._o||{},ttq._o[e+""]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)};
              ttq.load('${process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}

      {/* ── Google Tag Manager (noscript fallback — consent-gated) ── */}
      {consent.analytics && process.env.NEXT_PUBLIC_GTM_ID && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}

      {/* ── Google Search Console verification (only if not using DNS method) ── */}
      {/* Add this meta tag to layout.tsx <head> if needed:
          <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" /> */}
    </>
  );
}

// Helper: track Meta pixel events on key actions
export function trackMetaEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const consent = getConsent();
  if (!consent.marketing) return;
  const fbq = (window as any).fbq;
  if (fbq) {
    if (params) fbq("track", eventName, params);
    else fbq("track", eventName);
  }
}

// Helper: track TikTok events
export function trackTikTokEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const consent = getConsent();
  if (!consent.marketing) return;
  const ttq = (window as any).ttq;
  if (ttq) ttq.track(eventName, params);
}
