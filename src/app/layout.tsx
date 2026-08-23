import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";
import { RouteBackground } from "@/components/RouteBackground";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GlobalImagePicker } from "@/components/ImagePicker";
import AuthProvider from "@/components/AuthProvider";
import ScrollProgress from "@/components/ScrollProgress";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";
import ThemeProvider from "@/components/ThemeProvider";
import ScrollAnimator from "@/components/ScrollAnimator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import ClientComponents from "@/components/ClientComponents";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-heading", weight: ["400","500","600","700","800","900"], display: "swap", preload: true });
const inter = Inter({ subsets: ["latin"], variable: "--font-body", weight: ["300","400","500","600","700"], display: "swap", preload: true });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wyzdesign.com"),
  verification: {
    google: "E11m1f4AC2Ms1nkaE55AmyJXbf0LkdnZE32Z5ImXQJY",
  },
  alternates: { canonical: "https://www.wyzdesign.com" },
  title: {
    default: "WYZ Design | Creative Direction & Production - Los Angeles",
    template: "%s | WYZ Design",
  },
  description: "WYZ Design is the creative problem you hire when your brand is tired of looking like it was designed by a committee. Photography, design, web, print, motion. Los Angeles. No fluff, no pretending exposure pays rent.",
  keywords: ["WYZ Design", "creative agency", "Los Angeles", "photography", "graphic design", "branding", "web design", "printing", "event production"],
  openGraph: {
    title: "WYZ Design | Creative Direction & Production",
    description: "Photography, design, web, print, motion. Los Angeles. Sharp creative work that does what it's supposed to do.",
    url: "https://wyzdesign.com",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WYZ Design | Creative Direction & Production",
    description: "Photography, design, web, print, motion. Los Angeles.",
    images: ["/wyz-og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WYZ Design",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#DF3131",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="WYZ Design" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#DF3131" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#232326" media="(prefers-color-scheme: dark)" />
        <style dangerouslySetInnerHTML={{ __html: `*,*::before,*::after{box-sizing:border-box}html,body{margin:0;padding:0;background:#fff;color:#111;font-family:'Inter',system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}html.dark,html.dark body{background:#232326;color:#f0eaff}a{text-decoration:none}img{max-width:100%;height:auto}` }} />
        <script dangerouslySetInnerHTML={{ __html: `
          (function () {
            try {
              var u = new URL(window.location.href);
              var force = u.searchParams.get("reset") === "1" || u.searchParams.get("clearcache") === "1" || u.searchParams.get("fresh") === "1";
              if (force) {
                var clean = function () {
                  try {
                    if ("caches" in window) {
                      caches.keys().then(function (keys) { keys.forEach(function (k) { caches.delete(k); }); });
                    }
                  } catch (e) {}
                  try { localStorage.clear(); } catch (e) {}
                  try { sessionStorage.clear(); } catch (e) {}
                  try {
                    document.cookie.split(";").forEach(function (c) {
                      var name = c.split("=")[0].trim();
                      if (name) document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                    });
                  } catch (e) {}
                  if ("serviceWorker" in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function (regs) { regs.forEach(function (r) { r.unregister(); }); });
                  }
                };
                clean();
                u.searchParams.delete("reset"); u.searchParams.delete("clearcache"); u.searchParams.delete("fresh");
                setTimeout(function () { window.location.replace(u.pathname + u.search); }, 60);
              }

              // Chunk-load error recovery: if a JS/CSS chunk fails to load
              // (usually after a fresh deploy while this device has the page open),
              // auto-reload once so the visitor never sees a broken/error page.
              var recovered = false;
              var reloadOnce = function () {
                if (recovered) return;
                recovered = true;
                try { sessionStorage.setItem("wyz_recovered", "1"); } catch (e) {}
                setTimeout(function () { window.location.reload(); }, 300);
              };
              window.addEventListener("error", function (e) {
                var m = (e && e.message) || "";
                if (m.indexOf("ChunkLoadError") !== -1 || m.indexOf("Loading chunk") !== -1 || m.indexOf("Failed to fetch dynamically imported module") !== -1 || m.indexOf("error loading dynamically imported module") !== -1) {
                  reloadOnce();
                }
              }, true);
              window.addEventListener("unhandledrejection", function (e) {
                var r = (e && e.reason) || {};
                var m = (r && r.message) || (r && r.toString) ? (r.toString()) : "";
                if (typeof m === "string" && (m.indexOf("ChunkLoadError") !== -1 || m.indexOf("Loading chunk") !== -1 || m.indexOf("Failed to fetch dynamically imported module") !== -1)) {
                  reloadOnce();
                }
              });
            } catch (e) {}
          })();
        `}} />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://www.wyzdesign.com/#organization",
              name: "WYZ Design",
              url: "https://www.wyzdesign.com",
              logo: "https://www.wyzdesign.com/wyz-crown-square.png",
              description: "Creative direction and production agency. Photography, graphic design, web design, videography, branding, and printing. Los Angeles + Chicago.",
              sameAs: [
                "https://instagram.com/wyzdesign",
                "https://twitter.com/WYZdesign",
                "https://facebook.com/wyzdesign",
                "https://tiktok.com/@wyzdesign",
                "https://youtube.com/channel/UCfd75GcUKsGqWo-sgSQjZBg",
                "https://www.linkedin.com/in/torre%C3%A9-harris-11180b89",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Los Angeles",
                addressRegion: "CA",
                addressCountry: "US",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-213-399-9610",
                contactType: "customer service",
                email: "info@wyzdesign.com",
              },
              areaServed: ["Los Angeles", "Chicago", "United States"],
              knowsAbout: ["Photography", "Graphic Design", "Web Design", "Videography", "Branding", "Printing", "Event Production"],
              founder: { "@id": "https://www.wyzdesign.com/#torree-marcel" },
              alternateName: ["WYZ", "WYZ Design LLC", "Wild Yet Zealous"],
              naics: "541430",
              slogan: "Wild vision. Zealous execution.",
              brand: [
                { "@id": "https://www.wyzdesign.com/#wild-yet-zealous" },
                { "@id": "https://www.wyzdesign.com/#dying-breed-crew" },
                { "@id": "https://www.wyzdesign.com/#nomadic-breed" },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://www.wyzdesign.com/#torree-marcel",
              name: "Torreé Marcel Harris",
              alternateName: ["Torreé Marcel", "Torre Harris", "Torree Marcel", "Torree Harris", "Torreé Harris", "Torre Marcel", "Torreé M. Harris"],
              url: "https://www.wyzdesign.com/about",
              image: "https://www.wyzdesign.com/images/torre-marcel.jpg",
              jobTitle: "Founder & Creative Director",
              description: "Chicago-born creative director, photographer, designer, and entrepreneur. Founder of WYZ Design, a full-service creative studio.",
              worksFor: { "@id": "https://www.wyzdesign.com/#organization" },
              knowsAbout: ["Photography", "Graphic Design", "Web Design", "Branding", "Event Production", "Creative Direction"],
              homeLocation: { "@type": "Place", name: "Los Angeles, CA" },
              sameAs: [
                "https://www.linkedin.com/in/torre%C3%A9-harris-11180b89",
                "https://instagram.com/wyzdesign",
                "https://twitter.com/WYZdesign",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Brand",
              "@id": "https://www.wyzdesign.com/#wild-yet-zealous",
              name: "Wild Yet Zealous",
              slogan: "Wild vision. Zealous execution.",
              description: "The creative philosophy and parent brand behind WYZ Design. Born in Chicago's DIY art and music scene.",
              url: "https://www.wyzdesign.com/about",
              parentOrganization: { "@id": "https://www.wyzdesign.com/#organization" },
              founder: { "@id": "https://www.wyzdesign.com/#torree-marcel" },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Brand",
              "@id": "https://www.wyzdesign.com/#dying-breed-crew",
              name: "Dying Breed Crew",
              alternateName: ["DBC", "Dying Breed"],
              description: "The community and clothing arm of WYZ Design. A collective of artists, musicians, models, and culture-makers.",
              url: "https://www.wyzdesign.com/merch",
              parentOrganization: { "@id": "https://www.wyzdesign.com/#organization" },
              founder: { "@id": "https://www.wyzdesign.com/#torree-marcel" },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Brand",
              "@id": "https://www.wyzdesign.com/#nomadic-breed",
              name: "Nomadic Breed",
              description: "The mobile arm of WYZ Design, built for pop-up shoots and touring event coverage.",
              url: "https://www.wyzdesign.com/events",
              parentOrganization: { "@id": "https://www.wyzdesign.com/#organization" },
              founder: { "@id": "https://www.wyzdesign.com/#torree-marcel" },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://www.wyzdesign.com/#website",
              name: "WYZ Design",
              url: "https://www.wyzdesign.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.wyzdesign.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://www.wyzdesign.com/#local-business",
              name: "WYZ Design",
              url: "https://www.wyzdesign.com",
              logo: "https://www.wyzdesign.com/wyz-crown-square.png",
              image: "https://www.wyzdesign.com/wyz-og-image.png",
              description: "Creative direction and production agency. Photography, graphic design, web design, videography, branding, and printing. Los Angeles + Chicago.",
              priceRange: "$$",
              telephone: "+1-213-399-9610",
              email: "info@wyzdesign.com",
              address: { "@type": "PostalAddress", addressLocality: "Los Angeles", addressRegion: "CA", addressCountry: "US" },
              areaServed: ["Los Angeles", "Chicago", "United States"],
              sameAs: [
                "https://instagram.com/wyzdesign",
                "https://twitter.com/WYZdesign",
                "https://facebook.com/wyzdesign",
                "https://tiktok.com/@wyzdesign",
                "https://youtube.com/channel/UCfd75GcUKsGqWo-sgSQjZBg",
                "https://www.linkedin.com/in/torre%C3%A9-harris-11180b89",
              ],
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "18:00",
              },
            }),
          }}
        />

      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-[#232326] text-[#333333] dark:text-[#e0e0e0] antialiased cursor-none lg:cursor-none max-lg:cursor-auto">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#DF3131] focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold">Skip to content</a>
        <ThemeProvider>
          <AuthProvider>
          <SmoothScrollProvider>
          <ScrollAnimator />
          <RouteBackground />
          <ScrollProgress />
        <AnalyticsTracker />
          <Navbar />
          <ErrorBoundary>
          <div id="main-content" className="flex-1 pt-20 lg:pt-24 bg-white dark:bg-[#232326]" tabIndex={-1}>
            <PageTransition>{children}</PageTransition>
          </div>
          <Footer />
          <ScrollToTop />
          </ErrorBoundary>
          </SmoothScrollProvider>
        </AuthProvider>
        </ThemeProvider>
        <GlobalImagePicker />
        <Analytics />
        <SpeedInsights />
        <ClientComponents />
        <AnalyticsProvider />
        <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: "#fff", color: "#333", fontSize: "14px" } }} />
        <script dangerouslySetInnerHTML={{ __html: `
          if (window.matchMedia('(display-mode: standalone)').matches) {
            document.documentElement.classList.add('is-standalone');
          }
          if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.remove('cursor-none');
          }
        `}} />
        {/* GTM noscript fallback */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
      </body>
    </html>
  );
}
