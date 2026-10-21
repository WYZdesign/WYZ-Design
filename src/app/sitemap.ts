import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site-url";
import { listStoreProducts } from "@/lib/printful";
import { EVENT_GALLERIES, EVENT_KEYS } from "@/lib/data/event-galleries";
import { DESIGN_CATEGORY_KEYS } from "@/lib/data/design-galleries";
import MODEL_GALLERIES from "@/lib/data/model-galleries.json";

const BASE = getSiteUrl();

const PUBLIC_ROUTES: Array<{ path: string; priority?: number; changeFrequency?: "weekly" | "monthly" | "yearly" | "daily" }> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/photography", priority: 0.9, changeFrequency: "weekly" },
  { path: "/photography/events", priority: 0.7, changeFrequency: "monthly" },
  { path: "/photography/urbex", priority: 0.6, changeFrequency: "monthly" },
  { path: "/photography/outdoors", priority: 0.6, changeFrequency: "monthly" },
  { path: "/photography/studio", priority: 0.6, changeFrequency: "monthly" },
  { path: "/photography/products", priority: 0.6, changeFrequency: "monthly" },
  { path: "/photography/conceptual", priority: 0.6, changeFrequency: "monthly" },
  { path: "/events", priority: 0.8, changeFrequency: "weekly" },
  { path: "/events/gallery", priority: 0.7, changeFrequency: "weekly" },
  { path: "/designs", priority: 0.8, changeFrequency: "weekly" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/printing", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "yearly" },
  { path: "/brands", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/blog", priority: 0.7, changeFrequency: "daily" },
  { path: "/faq", priority: 0.5, changeFrequency: "yearly" },
  { path: "/merch", priority: 0.6, changeFrequency: "monthly" },
  { path: "/wyzmind", priority: 0.7, changeFrequency: "monthly" },
  { path: "/designs", priority: 0.6, changeFrequency: "monthly" },
  { path: "/designs/artfinix", priority: 0.5, changeFrequency: "yearly" },
  { path: "/designs/kid-bode", priority: 0.5, changeFrequency: "yearly" },
  { path: "/designs/dawneeahs-glow", priority: 0.5, changeFrequency: "yearly" },
  { path: "/designs/gft-foods", priority: 0.5, changeFrequency: "yearly" },
  { path: "/designs/gallery", priority: 0.7, changeFrequency: "monthly" },
  { path: "/featured-artist", priority: 0.7, changeFrequency: "weekly" },
  { path: "/gallery", priority: 0.6, changeFrequency: "weekly" },
  { path: "/community", priority: 0.5, changeFrequency: "weekly" },
  { path: "/loyalty", priority: 0.5, changeFrequency: "monthly" },
  { path: "/model-archive", priority: 0.6, changeFrequency: "monthly" },
  { path: "/model-archive/gallery", priority: 0.6, changeFrequency: "monthly" },
  { path: "/services/photoshoot", priority: 0.6, changeFrequency: "monthly" },
  { path: "/services/photo-retouching", priority: 0.6, changeFrequency: "monthly" },
  { path: "/services/event-photography", priority: 0.6, changeFrequency: "monthly" },
  { path: "/services/consultation", priority: 0.6, changeFrequency: "monthly" },
 { path: "/booking-calendar/photoshoot", priority: 0.5, changeFrequency: "monthly" },
 { path: "/booking-calendar/consultation", priority: 0.5, changeFrequency: "monthly" },
 { path: "/booking-calendar/event-photography", priority: 0.5, changeFrequency: "monthly" },
 { path: "/booking-calendar/photo-retouching", priority: 0.5, changeFrequency: "monthly" },
 { path: "/booking", priority: 0.8, changeFrequency: "monthly" },
 { path: "/merch/concepts", priority: 0.6, changeFrequency: "monthly" },
  { path: "/legal/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/legal/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/legal/refund", priority: 0.2, changeFrequency: "yearly" },
  { path: "/legal/shipping", priority: 0.2, changeFrequency: "yearly" },
  { path: "/legal/copyright", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
  // Merch detail pages are keyed by the live Printful sync product id.
  let merchProducts: MetadataRoute.Sitemap = [];
  try {
    const products = await listStoreProducts();
    merchProducts = products.map((p) => ({
      url: `${BASE}/merch/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    merchProducts = [];
  }

  const modelSlug = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const designPages: MetadataRoute.Sitemap = DESIGN_CATEGORY_KEYS.map((k) => ({
    url: `${BASE}/designs/gallery/${k}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const eventPages: MetadataRoute.Sitemap = EVENT_KEYS.map((k) => ({
    url: `${BASE}/events/gallery/${EVENT_GALLERIES[k].slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
  const modelPages: MetadataRoute.Sitemap = Object.keys(MODEL_GALLERIES).map((name) => ({
    url: `${BASE}/model-archive/gallery/${modelSlug(name)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [...routes, ...posts, ...merchProducts, ...designPages, ...eventPages, ...modelPages];
}
