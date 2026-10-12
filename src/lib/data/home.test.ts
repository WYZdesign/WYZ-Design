import { describe, it, expect } from "vitest";
import { HERO_IMAGES_RAW, CLIENT_LOGOS_RAW, DESIGN_SHOWCASE_RAW, MODELS_RAW_RECORDS, FAQ_ITEMS, SERVICE_LIST, PRICING_PLANS, QUICK_LINKS } from "@/lib/data/home";

describe("home data layer", () => {
  it("carousel arrays are non-empty arrays of image paths", () => {
    for (const arr of [HERO_IMAGES_RAW, DESIGN_SHOWCASE_RAW, MODELS_RAW_RECORDS]) {
      expect(Array.isArray(arr)).toBe(true);
      expect(arr.length).toBeGreaterThan(0);
      expect(arr.every((s) => typeof s === "string" && s.startsWith("/images/"))).toBe(true);
    }
  });

  it("client logos carry name + image", () => {
    expect(CLIENT_LOGOS_RAW.length).toBeGreaterThan(0);
    expect(CLIENT_LOGOS_RAW.every((l) => l.name && typeof l.img === "string")).toBe(true);
  });

  it("service list entries have price and category", () => {
    expect(SERVICE_LIST.length).toBeGreaterThan(0);
    expect(SERVICE_LIST.every((s) => s.cat && s.name && typeof s.price === "string")).toBe(true);
  });

  it("pricing plans are monthly and named", () => {
    expect(PRICING_PLANS.length).toBeGreaterThan(0);
    expect(PRICING_PLANS.every((p) => p.name && /month/i.test(p.valid))).toBe(true);
  });

  it("FAQ items all have a question and answer", () => {
    expect(FAQ_ITEMS.length).toBeGreaterThan(0);
    expect(FAQ_ITEMS.every((f) => f.q && f.a)).toBe(true);
  });

  it("quick links all point somewhere", () => {
    expect(QUICK_LINKS.every((q) => q.label && q.href?.startsWith("/"))).toBe(true);
  });
});
