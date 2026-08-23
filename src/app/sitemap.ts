import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site-url";

const BASE = getSiteUrl();

const PUBLIC_ROUTES: Array<{ path: string; priority?: number; changeFrequency?: "weekly" | "monthly" | "yearly" | "daily" }> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/home", priority: 0.9, changeFrequency: "weekly" },
  { path: "/photography", priority: 0.9, changeFrequency: "weekly" },
  { path: "/photography/portraits", priority: 0.7, changeFrequency: "monthly" },
  { path: "/photography/events", priority: 0.7, changeFrequency: "monthly" },
  { path: "/photography/editorial", priority: 0.7, changeFrequency: "monthly" },
  { path: "/photography/commercial", priority: 0.7, changeFrequency: "monthly" },
  { path: "/photography/urbex", priority: 0.6, changeFrequency: "monthly" },
  { path: "/photography/outdoors", priority: 0.6, changeFrequency: "monthly" },
  { path: "/photography/studio", priority: 0.6, changeFrequency: "monthly" },
  { path: "/photography/products", priority: 0.6, changeFrequency: "monthly" },
  { path: "/photography/conceptual", priority: 0.6, changeFrequency: "monthly" },
  { path: "/photography/concerts", priority: 0.6, changeFrequency: "monthly" },
  { path: "/photography/street", priority: 0.6, changeFrequency: "monthly" },
  { path: "/events", priority: 0.8, changeFrequency: "weekly" },
  { path: "/designs", priority: 0.8, changeFrequency: "weekly" },
  { path: "/web-design", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/printing", priority: 0.7, changeFrequency: "monthly" },
  { path: "/plans", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "yearly" },
  { path: "/brands", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/blog", priority: 0.7, changeFrequency: "daily" },
  { path: "/faq", priority: 0.5, changeFrequency: "yearly" },
  { path: "/gift-card", priority: 0.6, changeFrequency: "yearly" },
  { path: "/merch", priority: 0.6, changeFrequency: "monthly" },
  { path: "/wyzmind", priority: 0.7, changeFrequency: "monthly" },
  { path: "/case-studies", priority: 0.6, changeFrequency: "monthly" },
  { path: "/case-studies/artfinix", priority: 0.5, changeFrequency: "yearly" },
  { path: "/case-studies/kid-bode", priority: 0.5, changeFrequency: "yearly" },
  { path: "/case-studies/dawneeahs-glow", priority: 0.5, changeFrequency: "yearly" },
  { path: "/case-studies/gft-foods", priority: 0.5, changeFrequency: "yearly" },
  { path: "/featured-artist", priority: 0.7, changeFrequency: "weekly" },
  { path: "/gallery", priority: 0.6, changeFrequency: "weekly" },
  { path: "/community", priority: 0.5, changeFrequency: "weekly" },
  { path: "/3pointprogram", priority: 0.6, changeFrequency: "monthly" },
  { path: "/partnerships", priority: 0.5, changeFrequency: "monthly" },
  { path: "/model-archive", priority: 0.6, changeFrequency: "monthly" },
  { path: "/service-page/photoshoot", priority: 0.6, changeFrequency: "monthly" },
  { path: "/service-page/photo-retouching", priority: 0.6, changeFrequency: "monthly" },
  { path: "/service-page/event-photography", priority: 0.6, changeFrequency: "monthly" },
  { path: "/service-page/creative-consultation", priority: 0.6, changeFrequency: "monthly" },
  { path: "/booking-calendar/photoshoot", priority: 0.5, changeFrequency: "monthly" },
  { path: "/booking-calendar/consultation", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms-and-conditions", priority: 0.2, changeFrequency: "yearly" },
  { path: "/refund-return-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/shipping-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/copyright-notice", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = PUBLIC_ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency || "monthly",
    priority: r.priority || 0.5,
  }));
  const posts = getAllPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.dateISO),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));
  return [...routes, ...posts];
}
