import { describe, it, expect } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  OUTREACH_STAGES,
  OUTREACH_PHASE,
  stageByKey,
  renderStage,
  flagEnabled,
  maySend,
  CADENCE_MAX_DAYS,
  stageSent,
  lastMarketingSentMs,
  cadenceBlocked,
  consentAllows,
  bodyToHtml,
  recordDelivery,
  type DeliveryRow,
} from "@/lib/delivery";

describe("delivery outreach lib", () => {
  it("defines the four stages in order", () => {
    expect(OUTREACH_STAGES.map((s) => s.key)).toEqual(["stage1", "stage2", "stage3", "stage4"]);
    expect(stageByKey("stage3")?.days).toBe(21);
    expect(stageByKey("stage1")?.transactional).toBe(true);
    expect(stageByKey("stage2")?.transactional).toBe(false);
  });

  it("renderStage fills name and service tokens", () => {
    const stage = { key: "stage1" as const, days: 0, flag: "X", transactional: true, subject: "Hi {{name}}", body: "Your {{service}} is ready" };
    const out = renderStage(stage, { name: "Sam", serviceName: "photoshoot" });
    expect(out.subject).toBe("Hi Sam");
    expect(out.body).toBe("Your photoshoot is ready");
  });

  it("renderStage falls back when name/service missing", () => {
    const stage = { key: "stage1" as const, days: 0, flag: "X", transactional: true, subject: "Hi {{name}}", body: "Your {{service}}" };
    const out = renderStage(stage, { name: null, serviceName: "" });
    expect(out.subject).toBe("Hi there");
    expect(out.body).toBe("Your project");
  });

  it("flagEnabled parses truthy env values", () => {
    process.env.WYZ_TEST_FLAG = "1";
    expect(flagEnabled("WYZ_TEST_FLAG")).toBe(true);
    process.env.WYZ_TEST_FLAG = "no";
    expect(flagEnabled("WYZ_TEST_FLAG")).toBe(false);
    delete process.env.WYZ_TEST_FLAG;
    expect(flagEnabled("WYZ_TEST_FLAG")).toBe(false);
  });

  it("maySend is false unless master + stage flags are on", () => {
    // Phase must be >= 3 for any send; stage flags default off regardless.
    expect(OUTREACH_PHASE).toBeGreaterThanOrEqual(1);
    if (OUTREACH_PHASE < 3) {
      expect(maySend(OUTREACH_STAGES[0])).toBe(false);
    } else {
      expect(maySend(OUTREACH_STAGES[0])).toBe(false); // flags unset in test env
    }
  });

  it("has a sane cadence cap", () => {
    expect(CADENCE_MAX_DAYS).toBeGreaterThan(0);
  });
});

const DAY = 86400000;
const NOW = Date.parse("2026-10-13T12:00:00Z");
const iso = (msAgo: number) => new Date(NOW - msAgo).toISOString();

function row(stamps: Partial<DeliveryRow> = {}): DeliveryRow {
  return { id: 1, email: "client@example.com", delivered_at: iso(30 * DAY), ...stamps };
}

describe("consentAllows", () => {
  it("allows when there is no preference record (default opt-in)", () => {
    expect(consentAllows(null)).toBe(true);
    expect(consentAllows(undefined)).toBe(true);
  });

  it("allows an explicit opt-in", () => {
    expect(consentAllows({ email: "a@b.com", email_opt_in: true })).toBe(true);
  });

  it("blocks an explicit opt-out flag", () => {
    expect(consentAllows({ email: "a@b.com", email_opt_in: false })).toBe(false);
  });

  it("blocks whenever opt_out_at is stamped, even if opt_in is true", () => {
    expect(consentAllows({ email: "a@b.com", email_opt_in: true, opt_out_at: iso(1000) })).toBe(false);
  });
});

describe("stageSent / lastMarketingSentMs", () => {
  it("detects a stamped stage", () => {
    expect(stageSent(row(), "stage1")).toBe(false);
    expect(stageSent(row({ stage1_sent_at: iso(1000) }), "stage1")).toBe(true);
  });

  it("takes the newest marketing stamp and ignores stage1", () => {
    const r = row({ stage1_sent_at: iso(1 * DAY), stage2_sent_at: iso(5 * DAY), stage3_sent_at: iso(2 * DAY) });
    expect(lastMarketingSentMs(r)).toBe(NOW - 2 * DAY);
  });

  it("returns 0 when nothing marketing was sent", () => {
    expect(lastMarketingSentMs(row())).toBe(0);
    expect(lastMarketingSentMs(row({ stage1_sent_at: iso(1 * DAY) }))).toBe(0);
  });
});

describe("cadenceBlocked", () => {
  it("never blocks the transactional stage", () => {
    const r = row({ stage2_sent_at: iso(1 * DAY) });
    expect(cadenceBlocked(OUTREACH_STAGES[0], r, NOW)).toBe(false);
  });

  it("blocks a marketing stage when another marketing send landed inside the window", () => {
    const r = row({ stage2_sent_at: iso(5 * DAY) });
    expect(cadenceBlocked(OUTREACH_STAGES[2], r, NOW)).toBe(true);
  });

  it("allows a marketing stage once the window has passed", () => {
    const r = row({ stage2_sent_at: iso(20 * DAY) });
    expect(cadenceBlocked(OUTREACH_STAGES[2], r, NOW)).toBe(false);
  });

  it("allows when no marketing send has happened yet", () => {
    expect(cadenceBlocked(OUTREACH_STAGES[1], row(), NOW)).toBe(false);
  });
});

describe("bodyToHtml", () => {
  it("wraps the subject and escapes the body", () => {
    const html = bodyToHtml("Hello <b>there</b>", "Line one\nstill one\n\nLine two");
    expect(html).toContain("Hello &lt;b&gt;there&lt;/b&gt;");
    expect(html).toContain("<p");
    expect(html).toContain("Line one<br/>still one");
    expect(html).toContain("Line two");
    expect(html).not.toContain("<b>there</b>");
  });

  it("turns blank lines into separate paragraphs", () => {
    const html = bodyToHtml("s", "a\n\nb\n\nc");
    // 3 body paragraphs + the 1 footer paragraph
    expect(html.match(/<p /g)?.length).toBe(4);
  });
});

function fakeSb(opts: { dup?: unknown; insertId?: number; insertError?: string; dupError?: string } = {}): SupabaseClient {
  // recordDelivery chains .select().eq().eq().maybeSingle(), so eq must be re-callable.
  const sel: any = {
    eq: () => sel,
    maybeSingle: async () => ({
      data: opts.dup ?? null,
      error: opts.dupError ? { message: opts.dupError } : null,
    }),
  };
  const ins: any = {
    select: () => ({
      single: async () => ({
        data: { id: opts.insertId ?? 7 },
        error: opts.insertError ? { message: opts.insertError } : null,
      }),
    }),
  };
  return { from: () => ({ select: () => sel, insert: () => ins }) } as unknown as SupabaseClient;
}

describe("recordDelivery", () => {
  it("rejects a malformed email", async () => {
    const res = await recordDelivery(fakeSb(), { email: "not-an-email" });
    expect(res).toEqual({ ok: false, skipped: "invalid-email" });
  });

  it("normalizes and records a new delivery", async () => {
    const res = await recordDelivery(fakeSb({ insertId: 42 }), {
      email: "  Client@Example.COM ",
      clientName: "Client",
      serviceName: "Photoshoot",
    });
    expect(res).toEqual({ ok: true, id: 42 });
  });

  it("is idempotent on an already-recorded delivery", async () => {
    const res = await recordDelivery(fakeSb({ dup: { id: 9 } }), { email: "a@b.com" });
    expect(res).toEqual({ ok: true, id: 9, skipped: "already-recorded" });
  });

  it("surfaces insert failures without throwing", async () => {
    const res = await recordDelivery(fakeSb({ insertError: "boom" }), { email: "a@b.com" });
    expect(res.ok).toBe(false);
    expect(res.error).toBe("boom");
  });
});
