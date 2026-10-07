import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/clear-cache", "/fd", "/search", "/account", "/cart", "/merch/order", "/secret", "/match", "/status", "/offline", "/view", "/3pointprogram", "/splash", "/splash-gallery", "/splash-showcase", "/mobile-splash"],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
