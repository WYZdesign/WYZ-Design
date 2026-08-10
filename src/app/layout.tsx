import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";
import { RouteBackground } from "@/components/RouteBackground";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GlobalImagePicker } from "@/components/ImagePicker";
import ChatWidget from "@/components/ChatWidget";
import CookieBanner from "@/components/CookieBanner";
import AuthProvider from "@/components/AuthProvider";
import ScrollProgress from "@/components/ScrollProgress";
import CustomCursor from "@/components/CustomCursor";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";
import ThemeProvider from "@/components/ThemeProvider";
import ScrollAnimator from "@/components/ScrollAnimator";
import A11yAudit from "@/components/A11yAudit";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-heading", weight: ["400","500","600","700","800","900"], display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body", weight: ["300","400","500","600","700"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wyzdesign.com"),
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
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/wyz-icon-final.png", sizes: "any", type: "image/png" },
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="WYZ Design" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/favicon-512x512.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "WYZ Design",
              url: "https://wyzdesign.com",
              logo: "https://wyzdesign.com/wyz-crown-square.png",
              description: "Creative direction and production agency. Photography, graphic design, web design, videography, branding, and printing. Los Angeles + Chicago.",
              sameAs: [
                "https://instagram.com/wyzdesign",
                "https://facebook.com/wyzdesign",
                "https://tiktok.com/@wyzdesign",
                "https://youtube.com/channel/UCfd75GcUKsGqWo-sgSQjZBg",
                "https://linkedin.com/in/torre-harris",
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
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "WYZ Design",
              url: "https://wyzdesign.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://wyzdesign.com/search?q={search_term_string}",
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
                "https://facebook.com/wyzdesign",
                "https://tiktok.com/@wyzdesign",
                "https://youtube.com/channel/UCfd75GcUKsGqWo-sgSQjZBg",
                "https://linkedin.com/in/torre-harris",
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
      <body className="min-h-full flex flex-col bg-white dark:bg-[#1C1C1E] text-[#333333] dark:text-[#e0e0e0] antialiased cursor-none lg:cursor-none max-lg:cursor-auto">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#DF3131] focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold">Skip to content</a>
        <ThemeProvider>
          <AuthProvider>
          <ScrollAnimator />
          <RouteBackground />
          <ScrollProgress />
          <CustomCursor />
        <A11yAudit />
          <Navbar />
          <div id="main-content" className="flex-1 pt-20 lg:pt-24 bg-white dark:bg-[#1C1C1E]" tabIndex={-1}>
            <PageTransition>{children}</PageTransition>
          </div>
          <Footer />
          <ChatWidget />
          <ScrollToTop />
        </AuthProvider>
        </ThemeProvider>
        <GlobalImagePicker />
        <Script
          src={process.env.NEXT_PUBLIC_UMAMI_URL || "https://umami.wyzdesign.com/script.js"}
          strategy="afterInteractive"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID || "wyzdesign"}
        />
        <Analytics />
        <SpeedInsights />
        <CookieBanner />
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
