import { logger } from "@/lib/logger";

/**
 * Spec 22 (board task 22): delivery -> proof -> referral -> repeat work.
 *
 * Copy APPROVED by Torreé 2026-10-11 (Phase 3 ready). A send still requires ALL of:
 *  - WYZ_OUTREACH_ENABLED=1 (master switch),
 *  - that stage's flag=1 (WYZ_OUTREACH_STAGE1..4),
 *  - a populated delivery_events source.
 * Until all three are true the cron route only logs would-be sends.
 */

export const OUTREACH_PHASE = 3; // 1 schema+events, 2 dry-run staging, 3 live per-stage
export const CADENCE_MAX_DAYS = 14; // max 1 marketing message per client per 14 days

export type StageKey = "stage1" | "stage2" | "stage3" | "stage4";

export interface OutreachStage {
  key: StageKey;
  /** Days after delivered_at the stage becomes due. */
  days: number;
  /** Env flag that must be truthy before this stage may send. */
  flag: string;
  transactional: boolean; // stage 1 confirms delivery; 2-4 are marketing
  subject: string;
  body: string;
}

export const OUTREACH_STAGES: OutreachStage[] = [
  {
    key: "stage1",
    days: 0,
    flag: "WYZ_OUTREACH_STAGE1",
    transactional: true,
    subject: "Your {{service}} from WYZ Design is ready",
    body:
      "Hey {{name}},\n\n" +
      "Your {{service}} is ready. You can view and download the files in your account: " +
      "https://www.wyzdesign.com/account/my-account\n\n" +
      "Reply here if anything needs a tweak and we'll make it right.\n\n" +
      "- WYZ Design",
  },
  {
    key: "stage2",
    days: 7,
    flag: "WYZ_OUTREACH_STAGE2",
    transactional: false,
    subject: "Quick favor, {{name}}?",
    body:
      "Hey {{name}},\n\n" +
      "Hope you're enjoying the {{service}}. If you have a minute, a short review means a lot and helps the next person decide: " +
      "https://www.wyzdesign.com/contact\n\n" +
      "No pressure at all.\n\n" +
      "- WYZ Design\n\n" +
      "Unsubscribe: https://www.wyzdesign.com/loyalty#preferences",
  },
  {
    key: "stage3",
    days: 21,
    flag: "WYZ_OUTREACH_STAGE3",
    transactional: false,
    subject: "Know someone who needs {{service}}?",
    body:
      "Hey {{name}},\n\n" +
      "If a friend or collaborator needs work like this, our referral program pays you 10% on every booking they make: " +
      "https://www.wyzdesign.com/loyalty#referral\n\n" +
      "Thanks either way.\n\n" +
      "- WYZ Design\n\n" +
      "Unsubscribe: https://www.wyzdesign.com/loyalty#preferences",
  },
  {
    key: "stage4",
    days: 90,
    flag: "WYZ_OUTREACH_STAGE4",
    transactional: false,
    subject: "Been a minute, {{name}}",
    body:
      "Hey {{name}},\n\n" +
      "It's been a while since the {{service}}. If you have something coming up, we'd love to work together again: " +
      "https://www.wyzdesign.com/contact\n\n" +
      "No pressure.\n\n" +
      "- WYZ Design\n\n" +
      "Unsubscribe: https://www.wyzdesign.com/loyalty#preferences",
  },
];

export function stageByKey(key: StageKey): OutreachStage | undefined {
  return OUTREACH_STAGES.find((s) => s.key === key);
}

export interface StageClient {
  name?: string | null;
  serviceName?: string | null;
}

/** Renders a stage to a subject + body. Missing values fall back safely. */
export function renderStage(stage: OutreachStage, client: StageClient): { subject: string; body: string } {
  const name = (client.name || "").trim() || "there";
  const service = (client.serviceName || "").trim() || "project";
  const fill = (s: string) => s.replace(/\{\{\s*name\s*\}\}/g, name).replace(/\{\{\s*service\s*\}\}/g, service);
  return { subject: fill(stage.subject), body: fill(stage.body) };
}

export function flagEnabled(name: string): boolean {
  const v = (process.env[name] || "").toLowerCase();
  return v === "1" || v === "true" || v === "on" || v === "yes";
}

/**
 * Whether a stage may actually send. Hard false until Phase 3 AND the master
 * switch AND the per-stage flag are all on. Phase 1 always returns false.
 */
export function maySend(stage: OutreachStage): boolean {
  if (OUTREACH_PHASE < 3) return false;
  if (!flagEnabled("WYZ_OUTREACH_ENABLED")) return false;
  return flagEnabled(stage.flag);
}

/** Emits a would-be send to the log (never sends). Used by the dry-run cron. */
export function logPreview(stage: OutreachStage, to: string, subject: string): void {
  logger.info("outreach:preview", `[${stage.key}] would email ${to}: ${subject}`);
}
