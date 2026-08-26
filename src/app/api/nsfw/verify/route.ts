import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { isAgeVerified, markAgeVerified } from "@/lib/nsfw";
import { logger } from "@/lib/logger";

/**
 * NSFW age verification endpoint.
 * GET - returns whether the current user is age-verified.
 * POST - marks the current user as age-verified (requires authentication).
 *
 * @method GET, POST
 * @response `{ verified: boolean }` or 401
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ verified: false });
    }
    const verified = await isAgeVerified(session.user.email);
    return NextResponse.json({ verified });
  } catch (e) {
    logger.error("nsfw:verify:GET", e);
    return NextResponse.json({ verified: false });
  }
}

export async function POST(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    await markAgeVerified(session.user.email);
    return NextResponse.json({ verified: true });
  } catch (e) {
    logger.error("nsfw:verify:POST", e);
    return NextResponse.json({ error: "Failed to verify age" }, { status: 500 });
  }
}
