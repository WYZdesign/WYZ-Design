import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getZealStatus, ZEAL_ACTIONS, ZEAL_ACHIEVEMENTS, ZEAL_QUESTS, ZEAL_TIERS } from "@/lib/zeal";
import { ensureNeo4jConstraints } from "@/lib/neo4j-setup";
import { isNeo4jReachable } from "@/lib/wyzmind";
import { logger } from "@/lib/logger";

/**
 * Full Zeal status for the authenticated user.
 * @method GET
 * @response JSON with points, tier, streaks, achievements, quests, catalog
 * @auth Required
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const reachable = await isNeo4jReachable();
    if (reachable) void ensureNeo4jConstraints();
    const status = await getZealStatus(session.user.email, reachable);
    return NextResponse.json({
      ...status,
      catalog: {
        actions: Object.entries(ZEAL_ACTIONS).map(([id, def]) => ({
          id,
          zeal: def.zeal,
          category: def.category,
          reason: def.reason,
          repeatable: def.cooldownMs > 0,
        })),
        achievements: Object.entries(ZEAL_ACHIEVEMENTS).map(([id, def]) => ({ id, ...def })),
        quests: Object.entries(ZEAL_QUESTS).map(([id, def]) => ({ id, ...def })),
        tiers: ZEAL_TIERS,
      },
    });
  } catch (e: unknown) {
    logger.error("zeal-status:GET", e);
    return NextResponse.json({ error: "Failed to load zeal status" }, { status: 500 });
  }
}
