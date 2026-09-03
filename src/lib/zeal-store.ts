import { getServiceClient } from "@/lib/supabase";
import { logger } from "@/lib/logger";

/**
 * Supabase-backed persistence for the Zeal engine.
 *
 * Replaces the Neo4j User node + EARNED_POINTS edges, which could never be
 * reached from Vercel serverless (localhost + Bolt TCP both blocked). Every
 * user's full Zeal state lives in a single `zeal_users` row; point awards
 * are appended as immutable `loyalty_transactions` rows.
 */

export interface ZealStateRow {
  email: string;
  points: number;
  tier: string;
  actions: string[];
  achievements: string[];
  quests_completed: string[];
  counters: Record<string, number>;
  visit_streak: number;
  longest_streak: number;
  last_visit_day: string | null;
}

const DEFAULT_ROW: Omit<ZealStateRow, "email" | "points" | "tier"> = {
  actions: [],
  achievements: [],
  quests_completed: [],
  counters: {},
  visit_streak: 0,
  longest_streak: 0,
  last_visit_day: null,
};

/** Loads (creating if absent) the Zeal state row for a user. Never throws. */
export async function loadZealState(email: string): Promise<ZealStateRow> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("zeal_users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    logger.error("zeal-store:load", error.message);
    throw error;
  }

  if (data) {
    return {
      email,
      points: data.points ?? 0,
      tier: data.tier ?? "recruit",
      actions: data.actions ?? [],
      achievements: data.achievements ?? [],
      quests_completed: data.quests_completed ?? [],
      counters: data.counters ?? {},
      visit_streak: data.visit_streak ?? 0,
      longest_streak: data.longest_streak ?? 0,
      last_visit_day: data.last_visit_day ?? null,
    };
  }

  // Create the row on first load (idempotent upsert).
  const row: Omit<ZealStateRow, "email"> & { email: string } = {
    email,
    points: 0,
    tier: "recruit",
    ...DEFAULT_ROW,
  };
  const { error: insErr } = await sb.from("zeal_users").upsert(row, { onConflict: "email" });
  if (insErr) {
    logger.error("zeal-store:create", insErr.message);
    throw insErr;
  }
  return row as ZealStateRow;
}

/** Persists the full "profile-ish" Zeal state row for a user. Never throws.
 *
 * Deliberately does NOT write `points`/`tier`: those are owned exclusively by
 * `addLoyaltyPoints`, which derives them from the immutable
 * `loyalty_transactions` log. Callers load their `state` via `loadUserState`
 * *before* any `addLoyaltyPoints` call in the same request, so
 * `state.points`/`state.tier` are stale by the time this runs — writing them
 * here would clobber the correct value `addLoyaltyPoints` just computed.
 * Omitting the columns means the ON CONFLICT UPDATE only touches the fields
 * listed below, leaving points/tier alone. */
export async function saveZealState(email: string, state: ZealStateRow): Promise<void> {
  const sb = getServiceClient();
  const { error } = await sb
    .from("zeal_users")
    .upsert(
      {
        email,
        actions: state.actions,
        achievements: state.achievements,
        quests_completed: state.quests_completed,
        counters: state.counters,
        visit_streak: state.visit_streak,
        longest_streak: state.longest_streak,
        last_visit_day: state.last_visit_day,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );
  if (error) {
    logger.error("zeal-store:save", error.message);
    throw error;
  }
}

/**
 * Adds a loyalty transaction and applies the delta to the user's points +
 * tier in a single upsert. Mirrors the old Neo4j MERGE-on-EARNED_POINTS
 * atomicity: the transaction row is inserted, then the user's points/tier
 * are recomputed from the summed transaction amount.
 */
export async function addLoyaltyPoints(
  email: string,
  amount: number,
  reason: string
): Promise<{ points: number; tier: string }> {
  const sb = getServiceClient();

  const { error: txErr } = await sb.from("loyalty_transactions").insert({
    email,
    amount,
    reason,
  });
  if (txErr) {
    logger.error("zeal-store:tx", txErr.message);
    throw txErr;
  }

  // Recompute points from the full transaction history, then derive tier.
  const { data: sum } = await sb
    .from("loyalty_transactions")
    .select("amount")
    .eq("email", email);
  const points = (sum ?? []).reduce((acc, row) => acc + (Number(row.amount) || 0), 0);

  const tier =
    points >= 5000 ? "legend" : points >= 2000 ? "champion" : points >= 500 ? "zealot" : "recruit";

  const { error: upErr } = await sb
    .from("zeal_users")
    .upsert(
      { email, points, tier, updated_at: new Date().toISOString() },
      { onConflict: "email" }
    );
  if (upErr) {
    logger.error("zeal-store:points", upErr.message);
    throw upErr;
  }

  return { points, tier };
}

/** Returns the last N transactions for a user, newest first. */
export async function getLoyaltyHistory(email: string, limit = 50) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("loyalty_transactions")
    .select("amount, reason, created_at")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    logger.error("zeal-store:history", error.message);
    return [];
  }
  return (data ?? []).map((row) => ({
    amount: Number(row.amount) || 0,
    reason: row.reason ?? "",
    timestamp: row.created_at,
  }));
}
