import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("next/server", () => ({
  NextRequest: class {
    constructor(public url: string, public init?: RequestInit) {}
    headers = new Headers(this.init?.headers);
    async json() { return JSON.parse(this.init?.body as string || "{}"); }
    async text() { return this.init?.body as string || ""; }
    get nextUrl() { return new URL(this.url); }
  },
  NextResponse: {
    json: (data: any, init?: ResponseInit) => new Response(JSON.stringify(data), { ...init, headers: { "Content-Type": "application/json" } }),
  },
}));

vi.mock("@/lib/supabase", () => ({
  getServiceClient: () => ({
    from: () => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
  }),
}));

vi.mock("@/lib/wyzmind", () => ({
  addNewsletterSubscriber: vi.fn().mockResolvedValue({}),
  removeNewsletterSubscriber: vi.fn().mockResolvedValue({}),
  getAllUsers: vi.fn().mockResolvedValue([]),
  getDashboardStats: vi.fn().mockResolvedValue({}),
  getNewsletterSubscribers: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    checkout: { sessions: { create: vi.fn().mockResolvedValue({ url: "https://checkout.stripe.com/test" }) } },
    webhooks: { constructEvent: vi.fn().mockImplementation((_body: string, sig: string) => { if (sig === "invalid_sig") throw new Error("Invalid signature"); return { type: "checkout.session.completed", data: { object: { metadata: {}, customer: "cus_test", customer_details: { email: "test@test.com" } } } }; }) },
  }),
  createCheckoutSession: vi.fn().mockResolvedValue({ url: "https://checkout.stripe.com/test" }),
  createServiceCheckout: vi.fn().mockResolvedValue({ url: "https://checkout.stripe.com/test" }),
  createGiftCardCheckout: vi.fn().mockResolvedValue({ url: "https://checkout.stripe.com/test" }),
}));

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockResolvedValue({ ok: true, remaining: 9 }),
  sanitizeHtml: (html: string) => html.replace(/<script/gi, ""),
}));

vi.mock("@/lib/csrf", () => ({
  validateCsrf: vi.fn().mockReturnValue(true),
}));

vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

vi.mock("next-auth", () => ({
  getServerSession: vi.fn().mockResolvedValue({ user: { email: "admin@test.com" } }),
}));

vi.mock("@/app/api/auth/[...nextauth]/route", () => ({
  auth: vi.fn().mockResolvedValue({ user: { email: "admin@test.com" } }),
  handlers: { GET: vi.fn(), POST: vi.fn() },
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

Object.defineProperty(global, "Request", { value: class { constructor(public url: string, public init?: RequestInit) {} } });
Object.defineProperty(global, "Response", { value: class { body: any; status: number; ok: boolean; headers: Headers; constructor(body?: any, init?: ResponseInit) { this.body = body; this.status = init?.status ?? 200; this.ok = this.status >= 200 && this.status < 300; this.headers = new Headers(init?.headers); } async json() { return JSON.parse(this.body as string || "{}"); } static json(d: any, i?: ResponseInit) { return new Response(JSON.stringify(d), { ...i, headers: { "Content-Type": "application/json", ...(i?.headers as Record<string, string>) } }); } } });
Object.defineProperty(global, "Headers", { value: class { constructor(init?: Record<string, string>) { this.map = new Map(Object.entries(init || {})); } map: Map<string, string>; get(k: string) { return this.map.get(k.toLowerCase()) || null; } set(k: string, v: string) { this.map.set(k.toLowerCase(), v); } has(k: string) { return this.map.has(k.toLowerCase()); } } });