import { describe, it, expect } from "vitest";
import {
  GIFT_CARD_TTL_MONTHS,
  giftCardExpiry,
  giftCardExpiryLabel,
  generateGiftCardCode,
  normalizeGiftCardCode,
  hashGiftCardCode,
  last4,
  isGiftCardExpired,
} from "@/lib/gift-cards";

describe("gift card policy + code helpers", () => {
  it("TTL is 24 months and labeled correctly", () => {
    expect(GIFT_CARD_TTL_MONTHS).toBe(24);
    expect(giftCardExpiryLabel()).toBe("24 months from purchase");
  });

  it("giftCardExpiry adds 24 months in UTC", () => {
    const from = new Date(Date.UTC(2026, 0, 15)); // Jan 15 2026
    const exp = giftCardExpiry(from);
    expect(exp.getUTCFullYear()).toBe(2028);
    expect(exp.getUTCMonth()).toBe(0);
    expect(exp.getUTCDate()).toBe(15);
  });

  it("generated codes match WYZ-XXXX-XXXX-XXXX-XXXX and use the safe alphabet", () => {
    for (let i = 0; i < 25; i++) {
      const code = generateGiftCardCode();
      expect(code).toMatch(/^WYZ-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/);
      expect(code).not.toMatch(/[0O1IL]/);
    }
  });

  it("normalize strips separators and uppercases", () => {
    expect(normalizeGiftCardCode("wyz-abcd-efgh-2345-6789")).toBe("WYZABCDEFGH23456789");
    expect(normalizeGiftCardCode("  w y z  2 3 4 5 ")).toBe("WYZ2345");
    expect(normalizeGiftCardCode("")).toBe("");
  });

  it("hash is stable and format-insensitive", () => {
    const a = hashGiftCardCode("WYZ-ABCD-EFGH-2345-6789");
    const b = hashGiftCardCode("wyzabcdefgh23456789");
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });

  it("last4 returns the final four normalized chars", () => {
    expect(last4("WYZ-ABCD-EFGH-2345-6789")).toBe("6789");
  });

  it("isGiftCardExpired handles past, future, and null", () => {
    expect(isGiftCardExpired(null)).toBe(false);
    expect(isGiftCardExpired(undefined)).toBe(false);
    expect(isGiftCardExpired(new Date(Date.now() - 86400000).toISOString())).toBe(true);
    expect(isGiftCardExpired(new Date(Date.now() + 86400000).toISOString())).toBe(false);
  });
});
