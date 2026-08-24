import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { validateCsrf } from "@/lib/csrf";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

function generateCode(email: string): string {
  const base = email.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}-${rand}`;
}

/**
 * GET /api/referral — Look up a referral code's stats
 * @query code — the referral code
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const sb = getServiceClient();
  try {
    const { data: codeRow } = await sb.from("referral_codes")
      .select("code, referrer_email, created_at")
      .eq("code", code.toUpperCase())
      .maybeSingle();
    if (!codeRow) return NextResponse.json({ error: "Invalid code" }, { status: 404 });

    const { count: signups } = await sb.from("referral_conversions")
      .select("id", { count: "exact", head: true })
      .eq("referral_code", code)
      .eq("event_type", "signup");

    const { count: purchases } = await sb.from("referral_conversions")
      .select("id", { count: "exact", head: true })
      .eq("referral_code", code)
      .eq("event_type", "purchase");

    const { data: conversions } = await sb.from("referral_conversions")
      .select("commission, status")
      .eq("referral_code", code);

    const totalCommission = conversions?.reduce((sum, c) => sum + (c.commission || 0), 0) || 0;
    const paidCommission = conversions?.filter(c => c.status === "paid").reduce((sum, c) => sum + (c.commission || 0), 0) || 0;

    return NextResponse.json({
      code: codeRow.code,
      signups: signups || 0,
      purchases: purchases || 0,
      totalCommission,
      paidCommission,
      pendingCommission: totalCommission - paidCommission,
    });
  } catch (e) {
    logger.error("referral:get", e);
    return NextResponse.json({ error: "Failed to look up code" }, { status: 500 });
  }
}

/**
 * POST /api/referral — Create a new referral code or record a conversion
 *
 * Create code: { action: "create", email: string }
 * Record conversion: { action: "convert", code: string, email: string, eventType: "signup"|"purchase", amount?: number }
 */
export async function POST(req: NextRequest) {
  try {
    if (!validateCsrf(req)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await rateLimit(`referral:${ip}`, 10, 60_000);
    if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const body = await req.json();
    const sb = getServiceClient();

    if (body.action === "create") {
      const { email } = body;
      if (!email || typeof email !== "string") {
        return NextResponse.json({ error: "Valid email required" }, { status: 400 });
      }

      // Check if code already exists for this email
      const { data: existing } = await sb.from("referral_codes")
        .select("code")
        .eq("referrer_email", email.toLowerCase())
        .maybeSingle();
      if (existing) {
        return NextResponse.json({ code: existing.code });
      }

      // Generate unique code
      let code = generateCode(email);
      for (let i = 0; i < 5; i++) {
        const { data: dup } = await sb.from("referral_codes").select("code").eq("code", code).maybeSingle();
        if (!dup) break;
        code = generateCode(email);
      }

      const { error } = await sb.from("referral_codes").insert({ code, referrer_email: email.toLowerCase() });
      if (error) {
        logger.error("referral:create", error.message);
        return NextResponse.json({ error: "Failed to create code" }, { status: 500 });
      }
      return NextResponse.json({ code });
    }

    if (body.action === "convert") {
      const { code, email, eventType, amount } = body;
      if (!code || !email || !eventType) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      // Verify code exists
      const { data: codeRow } = await sb.from("referral_codes")
        .select("code")
        .eq("code", code.toUpperCase())
        .maybeSingle();
      if (!codeRow) return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });

      // Prevent self-referral
      const { data: referrer } = await sb.from("referral_codes")
        .select("referrer_email")
        .eq("code", code.toUpperCase())
        .maybeSingle();
      if (referrer?.referrer_email === email.toLowerCase()) {
        return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });
      }

      // Calculate commission (10% for purchases)
      const commission = eventType === "purchase" ? Math.floor((amount || 0) * 0.10) : 0;

      const { error } = await sb.from("referral_conversions").insert({
        referral_code: code.toUpperCase(),
        referred_email: email.toLowerCase(),
        event_type: eventType,
        amount: amount || 0,
        commission,
      });
      if (error) {
        logger.error("referral:convert", error.message);
        return NextResponse.json({ error: "Failed to record conversion" }, { status: 500 });
      }
      return NextResponse.json({ success: true, commission });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e) {
    logger.error("referral:post", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
