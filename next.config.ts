import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: false },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "images.printful.com" },
    ],
  },

  compress: true,

  experimental: {
    optimizePackageImports: ["react-icons", "framer-motion"],
  },

  webpack: (config) => {
    return config;
  },

  async headers() {
    return [
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, must-revalidate" },
        ],
      },
      {
        source: "/:path*\\.(jpg|jpeg|png|gif|webp|svg|ico|avif)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*\\.(mp4|webm)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*\\.(js|css)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, must-revalidate" },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600" },
          { key: "Content-Type", value: "application/manifest+json" },
        ],
      },
      {
        source: "/icons/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/splash/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Content-Security-Policy", value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://js.stripe.com https://www.googletagmanager.com https://connect.facebook.net https://www.clarity.ms https://analytics.tiktok.com https://app.cal.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://res.cloudinary.com https://lh3.googleusercontent.com https://*.googleusercontent.com https://images.unsplash.com https://images.printful.com",
            "connect-src 'self' https://api.resend.com https://api.stripe.com https://*.supabase.co wss://*.supabase.co https://o11y.sentry.io https://www.facebook.com https://analytics.tiktok.com https://www.clarity.ms https://app.cal.com",
            "frame-src https://js.stripe.com https://hooks.stripe.com https://www.googletagmanager.com https://app.cal.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "media-src 'self' https://*.supabase.co blob:",
            "object-src 'none'",
            "upgrade-insecure-requests",
            "report-to csp-endpoint",
          ].join("; ") },
          { key: "Content-Security-Policy-Report-Only", value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://js.stripe.com https://www.googletagmanager.com https://connect.facebook.net https://www.clarity.ms https://analytics.tiktok.com https://app.cal.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://res.cloudinary.com https://lh3.googleusercontent.com https://*.googleusercontent.com https://images.unsplash.com https://images.printful.com",
            "connect-src 'self' https://api.resend.com https://api.stripe.com https://*.supabase.co wss://*.supabase.co https://o11y.sentry.io https://www.facebook.com https://analytics.tiktok.com https://www.clarity.ms https://app.cal.com",
            "frame-src https://js.stripe.com https://hooks.stripe.com https://www.googletagmanager.com https://app.cal.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "media-src 'self' https://*.supabase.co blob:",
            "object-src 'none'",
            "upgrade-insecure-requests",
            "report-to csp-endpoint",
          ].join("; ") },
          { key: "Report-To", value: JSON.stringify({ group: "csp-endpoint", max_age: 86400, endpoints: [{ url: "/api/csp-report" }] }) },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), gyroscope=(self)" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/booking-events", destination: "/booking-calendar/event-photography", permanent: true },
      { source: "/booking-photoshoot", destination: "/booking-calendar/photoshoot", permanent: true },
      { source: "/booking-retouching", destination: "/booking-calendar/photo-retouching", permanent: true },
      { source: "/service-consultation", destination: "/service-page/creative-consultation", permanent: true },
      { source: "/service-events", destination: "/service-page/event-photography", permanent: true },
      { source: "/service-photoshoot", destination: "/booking-calendar/photoshoot", permanent: true },
      { source: "/service-retouching", destination: "/booking-calendar/photo-retouching", permanent: true },
      { source: "/plans-pricing", destination: "/plans", permanent: true },
      { source: "/my-profile", destination: "/account/my-account", permanent: true },
    ];
  },

  turbopack: {},
};

export default nextConfig;