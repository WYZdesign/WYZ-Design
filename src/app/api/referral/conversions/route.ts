import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const rl = await rateLimit(`referral-conversions:${getIp(req)}`, 30, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const sb = getServiceClient();
  try {
    const { data: conversions } = await sb
      .from("referral_conversions")
      .select("id, event_type, commission, status, created_at, referred_email")
      .eq("referral_code", code.toUpperCase())
      .order("created_at", { ascending: false })
      .limit(20);

    return NextResponse.json({ conversions: conversions || [] });
  } catch (e) {
    logger.error("referral:conversions", e);
    return NextResponse.json({ error: "Failed to fetch conversions" }, { status: 500 });
  }
}
