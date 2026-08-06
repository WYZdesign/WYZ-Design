import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_URL || "https://www.wyzdesign.com";

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
