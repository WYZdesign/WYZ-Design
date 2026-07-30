import { MetadataRoute } from "next";

const BASE = "https://wyzdesign.com";

const PAGES = [
  { path: "", priority: 1.0, freq: "weekly" as const },
  { path: "home", priority: 0.9, freq: "weekly" as const },
  { path: "services", priority: 0.9, freq: "weekly" as const },
  { path: "designs", priority: 0.9, freq: "weekly" as const },
  { path: "events", priority: 0.9, freq: "weekly" as const },
  { path: "photography", priority: 0.9, freq: "weekly" as const },
  { path: "merch", priority: 0.9, freq: "weekly" as const },
  { path: "plans", priority: 0.8, freq: "weekly" as const },
  { path: "booking", priority: 0.8, freq: "weekly" as const },
  { path: "contact", priority: 0.8, freq: "monthly" as const },
  { path: "community", priority: 0.8, freq: "weekly" as const },
  { path: "wyzmind", priority: 0.7, freq: "monthly" as const },
  { path: "featured-artist", priority: 0.8, freq: "monthly" as const },
  { path: "web-design", priority: 0.8, freq: "monthly" as const },
  { path: "printing", priority: 0.8, freq: "monthly" as const },
  { path: "faq", priority: 0.7, freq: "monthly" as const },
  { path: "blog", priority: 0.8, freq: "weekly" as const },
  { path: "model-archive", priority: 0.7, freq: "monthly" as const },
  { path: "3pointprogram", priority: 0.7, freq: "monthly" as const },
  { path: "gift-card", priority: 0.7, freq: "monthly" as const },
  { path: "loyalty", priority: 0.8, freq: "monthly" as const },
  { path: "gallery", priority: 0.7, freq: "monthly" as const },
  { path: "splash-gallery", priority: 0.6, freq: "monthly" as const },
  { path: "search", priority: 0.5, freq: "monthly" as const },
  { path: "case-studies", priority: 0.8, freq: "monthly" as const },
  { path: "case-studies/artfinix", priority: 0.7, freq: "yearly" as const },
  { path: "case-studies/kid-bode", priority: 0.7, freq: "yearly" as const },
  { path: "service-page/photoshoot", priority: 0.8, freq: "monthly" as const },
  { path: "service-page/photo-retouching", priority: 0.7, freq: "monthly" as const },
  { path: "service-page/event-photography", priority: 0.8, freq: "monthly" as const },
  { path: "service-page/creative-consultation", priority: 0.7, freq: "monthly" as const },
  { path: "booking-calendar/photoshoot", priority: 0.8, freq: "monthly" as const },
  { path: "booking-calendar/consultation", priority: 0.7, freq: "monthly" as const },
  { path: "booking-calendar/event-photography", priority: 0.7, freq: "monthly" as const },
  { path: "booking-calendar/photo-retouching", priority: 0.6, freq: "monthly" as const },
  { path: "privacy-policy", priority: 0.5, freq: "yearly" as const },
  { path: "terms-and-conditions", priority: 0.5, freq: "yearly" as const },
  { path: "refund-return-policy", priority: 0.5, freq: "yearly" as const },
  { path: "shipping-policy", priority: 0.5, freq: "yearly" as const },
  { path: "copyright-notice", priority: 0.5, freq: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: p.path ? `${BASE}/${p.path}` : BASE,
    lastModified: new Date(),
    changeFrequency: p.freq,
    priority: p.priority,
  }));
}
