import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { cacheScanResult, getCachedScanResult } from "@/lib/nsfw";
import { logger } from "@/lib/logger";

/**
 * NSFW scan result caching endpoint.
 * GET - returns cached scan result for an image path.
 * POST - stores a scan result (admin or authenticated user only).
 *
 * @method GET, POST
 * @request POST body: `{ imagePath: string, label: string, confidence: number }`
 * @response `{ cached: boolean, result?: { label, confidence } }`
 */
export async function GET(req: NextRequest) {
  try {
    const imagePath = req.nextUrl.searchParams.get("path");
    if (!imagePath) {
      return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
    }
    const cached = await getCachedScanResult(imagePath);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { label: string; confidence: number };
        return NextResponse.json({ cached: true, result: parsed });
      } catch {
        return NextResponse.json({ cached: false });
      }
    }
    return NextResponse.json({ cached: false });
  } catch (e) {
    logger.error("nsfw:scan:GET", e);
    return NextResponse.json({ cached: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json() as { imagePath?: string; label?: string; confidence?: number };
    if (!body.imagePath || !body.label || typeof body.confidence !== "number") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await cacheScanResult(body.imagePath, body.label, body.confidence);
    return NextResponse.json({ success: true });
  } catch (e) {
    logger.error("nsfw:scan:POST", e);
    return NextResponse.json({ error: "Failed to cache scan result" }, { status: 500 });
  }
}
