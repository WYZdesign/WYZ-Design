import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  redisOk: vi.fn(),
  rateOk: vi.fn(),
  from: vi.fn(),
  maybeSingle: vi.fn(),
}));

vi.mock("@/lib/rate-limit-redis", () => ({ checkRedisHealth: mocks.redisOk }));
vi.mock("@/lib/rate-limit", () => ({ rateLimit: mocks.rateOk }));
vi.mock("@/lib/supabase", () => ({ getServiceClient: () => ({ from: mocks.from }) }));

function gcReq(body: unknown) {
  return new NextRequest("https://test.com/api/gift-card/validate", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "x-forwarded-for": "1.2.3.4" },
  });
}

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.redisOk.mockResolvedValue(true);
  });

  it("reports ok with redis up", async () => {
    const { GET } = await import("@/app/api/health/route");
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("ok");
    expect(typeof data.uptime).toBe("string");
    expect(data.redis).toBe("ok");
    expect(data.timestamp).toBeDefined();
  });

  it("reports redis down when the check fails", async () => {
    mocks.redisOk.mockResolvedValue(false);
    const { GET } = await import("@/app/api/health/route");
    const res = await GET();
    const data = await res.json();
    expect(data.redis).toBe("down");
  });
});

describe("POST /api/gift-card/validate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.rateOk.mockResolvedValue({ ok: true });
    mocks.from.mockReturnValue({
      select: () => ({ eq: () => ({ maybeSingle: mocks.maybeSingle }) }),
    });
  });

  async function post(body: unknown) {
    const { POST } = await import("@/app/api/gift-card/validate/route");
    const res = await POST(gcReq(body));
    return { res, data: await res.json() };
  }

  it("400 when no code is provided", async () => {
    const { res, data } = await post({});
    expect(res.status).toBe(400);
    expect(data.valid).toBe(false);
  });

  it("429 when rate limited", async () => {
    mocks.rateOk.mockResolvedValue({ ok: false });
    const { res } = await post({ code: "WYZ-ABCD-EFGH-2345-6789" });
    expect(res.status).toBe(429);
  });

  it("reports not found for an unknown code", async () => {
    mocks.maybeSingle.mockResolvedValue({ data: null, error: null });
    const { data } = await post({ code: "WYZ-ABCD-EFGH-2345-6789" });
    expect(data.valid).toBe(false);
    expect(data.message).toMatch(/not found/i);
  });

  it("reports inactive cards", async () => {
    mocks.maybeSingle.mockResolvedValue({ data: { status: "void", balance_cents: 500, expires_at: null }, error: null });
    const { data } = await post({ code: "WYZ-ABCD-EFGH-2345-6789" });
    expect(data.valid).toBe(false);
    expect(data.message).toMatch(/no longer active/i);
  });

  it("reports expired cards", async () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    mocks.maybeSingle.mockResolvedValue({ data: { status: "active", balance_cents: 500, expires_at: past }, error: null });
    const { data } = await post({ code: "WYZ-ABCD-EFGH-2345-6789" });
    expect(data.valid).toBe(false);
    expect(data.message).toMatch(/expired/i);
  });

  it("reports zero balance", async () => {
    mocks.maybeSingle.mockResolvedValue({ data: { status: "active", balance_cents: 0, expires_at: null }, error: null });
    const { data } = await post({ code: "WYZ-ABCD-EFGH-2345-6789" });
    expect(data.valid).toBe(false);
    expect(data.message).toMatch(/no balance/i);
  });

  it("returns the balance for a valid active card", async () => {
    mocks.maybeSingle.mockResolvedValue({ data: { status: "active", balance_cents: 2550, currency: "usd", expires_at: null }, error: null });
    const { res, data } = await post({ code: "WYZ-ABCD-EFGH-2345-6789" });
    expect(res.status).toBe(200);
    expect(data.valid).toBe(true);
    expect(data.balanceCents).toBe(2550);
    expect(data.currency).toBe("usd");
  });
});
