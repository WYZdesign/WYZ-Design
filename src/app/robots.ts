import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const BASE = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/account/",
          "/fd",
          "/match",
          "/model-archive",
          "/view",
          "/splash-gallery",
          "/splash-showcase",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
