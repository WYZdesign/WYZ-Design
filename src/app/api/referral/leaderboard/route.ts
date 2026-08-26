import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

interface ConversionRow {
  referral_code: string;
  commission: number | null;
}

interface CodeRow {
  code: string;
  referrer_email: string;
}

interface LeaderEntry {
  name: string;
  conversions: number;
  earned: number;
}

const EMPTY_RESPONSE = { leaders: [] as LeaderEntry[], totals: { conversions: 0, paid: 0 } };

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/**
 * Builds an anonymized display name from an email address.
 * "torree.harper@gmail.com" becomes "Torree H."
 */
function anonymize(email: string): string {
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._\-+]/).filter(Boolean);
  if (parts.length === 0) return "Partner";
  const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  if (parts.length === 1) return first;
  const lastInitial = `${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
  return `${first} ${lastInitial}`;
}

/**
 * GET /api/referral/leaderboard — Public top-5 referral partners plus all-time totals
 */
export async function GET(req: NextRequest) {
  const rl = await rateLimit(`referral-leaderboard:${getIp(req)}`, 10, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  try {
    const sb = getServiceClient();

    const { data: conversions, error } = await sb.from("referral_conversions")
      .select("referral_code, commission");
    if (error) {
      logger.error("referral:leaderboard", error.message);
      return NextResponse.json(EMPTY_RESPONSE);
    }
    const rows = (conversions ?? []) as ConversionRow[];
    if (rows.length === 0) return NextResponse.json(EMPTY_RESPONSE);

    // Map referral codes back to referrer emails so conversions can be grouped
    const { data: codes } = await sb.from("referral_codes").select("code, referrer_email");
    const codeToEmail = new Map<string, string>();
    for (const c of (codes ?? []) as CodeRow[]) {
      codeToEmail.set(c.code, c.referrer_email);
    }

    const byReferrer = new Map<string, LeaderEntry>();
    let paid = 0;
    for (const row of rows) {
      const email = codeToEmail.get(row.referral_code);
      if (!email) continue;
      const entry = byReferrer.get(email) ?? { name: anonymize(email), conversions: 0, earned: 0 };
      entry.conversions += 1;
      entry.earned += row.commission || 0;
      paid += row.commission || 0;
      byReferrer.set(email, entry);
    }

    const leaders = [...byReferrer.values()]
      .sort((a, b) => b.conversions - a.conversions || b.earned - a.earned)
      .slice(0, 5);

    return NextResponse.json({ leaders, totals: { conversions: rows.length, paid } });
  } catch (e) {
    logger.error("referral:leaderboard", e);
    return NextResponse.json(EMPTY_RESPONSE);
  }
}
