import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { earnZeal } from "@/lib/zeal";
import { logger } from "@/lib/logger";

/**
 * Awards Zeal points for a validated action.
 * @method POST
 * @request JSON { action: string, localHour?: number }
 * @response JSON { success, zeal, total, tier, tierUp, reason, achievement?, quest? }
 * @auth Required
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let body: { action?: unknown; localHour?: unknown; metaPath?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const action = typeof body.action === "string" ? body.action : "";
    if (!action) return NextResponse.json({ error: "Missing action" }, { status: 400 });

    const localHour = typeof body.localHour === "number" && body.localHour >= 0 && body.localHour <= 23
      ? Math.floor(body.localHour)
      : undefined;

    let metaPath: string | undefined;
    if (typeof body.metaPath === "string" && body.metaPath.startsWith("/") && body.metaPath.length <= 200) {
      metaPath = body.metaPath.slice(0, 200);
    }

    const result = await earnZeal(session.user.email, action, { localHour, metaPath });

    if (!result.success) {
      const status = result.cooldown ? 429 : result.error === "Rate limit exceeded" ? 429 : 400;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (e: unknown) {
    logger.error("zeal-earn:POST", e);
    // Surface a short signature on the response too: prod logging is
    // dev-gated, so without this a 500 here is completely undiagnosable
    // from server logs alone (exactly what the Vercel 5xx alert showed).
    const detail = e instanceof Error ? e.message.slice(0, 140) : "unknown";
    return NextResponse.json({ error: "Failed to award zeal", detail }, { status: 500 });
  }
}
