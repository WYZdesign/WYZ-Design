import { describe, it, expect } from "vitest";
import { OUTREACH_STAGES, OUTREACH_PHASE, stageByKey, renderStage, flagEnabled, maySend, CADENCE_MAX_DAYS } from "@/lib/delivery";

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
