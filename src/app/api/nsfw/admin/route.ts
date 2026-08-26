import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { listAllScanResults, listAgeVerifiedUsers, clearScanResult } from "@/lib/nsfw";
import { NSFW_CATEGORIES } from "@/lib/nsfw";
import { logger } from "@/lib/logger";

/**
 * NSFW admin panel data endpoint.
 * GET — returns gated categories, scan results, verified users.
 * DELETE — clears a cached scan result for a specific image path.
 *
 * @method GET, DELETE
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [cachedEntries, verifiedUsers] = await Promise.all([
      listAllScanResults(),
      listAgeVerifiedUsers(),
    ]);

    return NextResponse.json({
      gatedCategories: NSFW_CATEGORIES,
      cachedEntries,
      verifiedUsers,
    });
  } catch (e) {
    logger.error("nsfw:admin:GET", e);
    return NextResponse.json({ gatedCategories: NSFW_CATEGORIES, cachedEntries: [], verifiedUsers: [] });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as { imagePath?: string };
    if (!body.imagePath) {
      return NextResponse.json({ error: "Missing imagePath" }, { status: 400 });
    }

    await clearScanResult(body.imagePath);
    return NextResponse.json({ success: true });
  } catch (e) {
    logger.error("nsfw:admin:DELETE", e);
    return NextResponse.json({ error: "Failed to clear scan result" }, { status: 500 });
  }
}
