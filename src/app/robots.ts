import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/clear-cache", "/fd", "/search"],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
