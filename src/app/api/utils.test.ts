import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { hashIp } from "@/lib/api-utils";

describe("hashIp", () => {
  beforeEach(() => {
    process.env.IP_HASH_SALT = "test-salt-for-vitest";
  });

  it("returns a 16-char hex string", () => {
    const result = hashIp("1.2.3.4");
    expect(typeof result).toBe("string");
    expect(result).toMatch(/^[a-f0-9]{16}$/);
  });

  it("is consistent for the same IP", () => {
    expect(hashIp("1.2.3.4")).toBe(hashIp("1.2.3.4"));
  });

  it("different IPs produce different hashes", () => {
    expect(hashIp("1.2.3.4")).not.toBe(hashIp("5.6.7.8"));
  });
});