import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as webhookPOST } from "@/app/api/webhook/route";
import { NextRequest } from "next/server";

describe("Webhook Route", () => {
  const mockEnv = {
    STRIPE_SECRET_KEY: "sk_test_123",
    STRIPE_WEBHOOK_SECRET: "whsec_test",
    NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "anon_key",
    SUPABASE_SECRET_KEY: "service_key",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...process.env, ...mockEnv };
  });

  it("returns 500 when STRIPE_WEBHOOK_SECRET is missing", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const req = new NextRequest("https://test.com/api/webhook", {
      method: "POST",
      body: JSON.stringify({ type: "checkout.session.completed" }),
      headers: { "stripe-signature": "sig_test" },
    });
    const res = await webhookPOST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Webhook not configured");
  });

  it("returns 400 for invalid signature", async () => {
    const req = new NextRequest("https://test.com/api/webhook", {
      method: "POST",
      body: JSON.stringify({ type: "checkout.session.completed" }),
      headers: { "stripe-signature": "invalid_sig" },
    });
    const res = await webhookPOST(req);
    expect(res.status).toBe(400);
  });
});

describe("Newsletter Route", () => {
  const mockEnv = {
    RESEND_API_KEY: "re_test",
    NEXTAUTH_SECRET: "secret",
    NEXT_PUBLIC_URL: "https://www.wyzdesign.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...process.env, ...mockEnv };
  });

  it("rejects subscription without email", async () => {
    const { POST } = await import("@/app/api/newsletter/route");
    const req = new NextRequest("https://test.com/api/newsletter", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects invalid email format", async () => {
    const { POST } = await import("@/app/api/newsletter/route");
    const req = new NextRequest("https://test.com/api/newsletter", {
      method: "POST",
      body: JSON.stringify({ email: "invalid" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("Checkout Route", () => {
  const mockEnv = {
    STRIPE_SECRET_KEY: "sk_test_123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...process.env, ...mockEnv };
  });

  it("rejects checkout without type", async () => {
    const { POST } = await import("@/app/api/checkout/route");
    const req = new NextRequest("https://test.com/api/checkout", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects unknown service type", async () => {
    const { POST } = await import("@/app/api/checkout/route");
    const req = new NextRequest("https://test.com/api/checkout", {
      method: "POST",
      body: JSON.stringify({ type: "unknown" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("errorResponse helper", () => {
  it("keeps error as a string for backward compat", async () => {
    const { errorResponse } = await import("@/lib/http");
    const res = errorResponse("Something went wrong", 400, { code: "BAD_REQUEST" });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(typeof data.error).toBe("string");
    expect(data.error).toBe("Something went wrong");
    expect(data.code).toBe("BAD_REQUEST");
    expect(data.timestamp).toBeDefined();
  });

  it("infers code from status when not provided", async () => {
    const { errorResponse } = await import("@/lib/http");
    const res = errorResponse("Too many requests", 429);
    const data = await res.json();
    expect(data.code).toBe("RATE_LIMITED");
  });

  it("sets Retry-After header when retryAfter is provided", async () => {
    const { errorResponse } = await import("@/lib/http");
    const res = errorResponse("Too many requests", 429, { code: "RATE_LIMITED", retryAfter: 30 });
    expect(res.headers.get("Retry-After")).toBe("30");
  });
});