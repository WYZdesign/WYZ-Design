import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redeemZeal, ZEAL_REWARDS } from "@/lib/zeal";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

/**
 * Spends Zeal on a reward and returns a redemption code.
 * @method POST
 * @request JSON { rewardId: string }
 * @response JSON { success, code, title, remaining }
 * @auth Required
 */
export async function GET() {
  return NextResponse.json({ rewards: ZEAL_REWARDS });
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await rateLimit(`zeal-redeem:${ip}`, 10, 3600000);
    if (!rl.ok) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });

    let body: { rewardId?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (typeof body.rewardId !== "string") {
      return NextResponse.json({ error: "Missing rewardId" }, { status: 400 });
    }

    const result = await redeemZeal(session.user.email, body.rewardId);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (e: unknown) {
    logger.error("zeal-redeem:POST", e);
    return NextResponse.json({ error: "Redemption failed" }, { status: 500 });
  }
}
