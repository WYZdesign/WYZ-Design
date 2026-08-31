import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/**
 * GET /api/referral/conversions — Conversion history for the authenticated user's own code
 * @query code — the referral code (must belong to the authenticated user)
 * @auth Required — session must match the code's owner
 * Never returns raw email addresses — only anonymized initials + event data.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const rl = await rateLimit(`referral-conversions:${getIp(req)}`, 30, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const sb = getServiceClient();
  try {
    // Verify the requesting user owns this code
    const { data: ownerRow } = await sb.from("referral_codes")
      .select("referrer_email")
      .eq("code", code.toUpperCase())
      .maybeSingle();

    if (!ownerRow || ownerRow.referrer_email !== session.user.email.toLowerCase()) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { data: conversions } = await sb
      .from("referral_conversions")
      .select("id, event_type, commission, status, created_at")
      .eq("referral_code", code.toUpperCase())
      .order("created_at", { ascending: false })
      .limit(20);

    return NextResponse.json({ conversions: conversions || [] });
  } catch (e) {
    logger.error("referral:conversions", e);
    return NextResponse.json({ error: "Failed to fetch conversions" }, { status: 500 });
  }
}
