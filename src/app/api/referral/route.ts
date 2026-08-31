import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { validateCsrf } from "@/lib/csrf";
import { rateLimit } from "@/lib/rate-limit";
import { recordReferralConversion } from "@/lib/referral";
import { logger } from "@/lib/logger";

function generateCode(email: string): string {
  const base = email.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}-${rand}`;
}

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/**
 * GET /api/referral — Look up a referral code's stats (own code only)
 * @query code — the referral code
 * @auth Required — session must match the code's owner
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const rl = await rateLimit(`referral-get:${getIp(req)}`, 30, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const sb = getServiceClient();
  try {
    const { data: codeRow } = await sb.from("referral_codes")
      .select("code, created_at")
      .eq("code", code.toUpperCase())
      .maybeSingle();
    if (!codeRow) return NextResponse.json({ error: "Invalid code" }, { status: 404 });

    // Verify the requesting user owns this code
    const { data: ownerRow } = await sb.from("referral_codes")
      .select("referrer_email")
      .eq("code", code.toUpperCase())
      .maybeSingle();

    if (ownerRow?.referrer_email !== session.user.email.toLowerCase()) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

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
 * Record conversion (server-to-server only): { action: "convert", code: string, email: string, eventType: "signup"|"purchase", amount?: number }
 *   Requires an x-convert-secret header matching REFERRAL_CONVERT_SECRET.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getIp(req);
    const rl = await rateLimit(`referral:${ip}`, 10, 60_000);
    if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const body = await req.json();
    const sb = getServiceClient();

    if (body.action === "convert") {
      // Server-only path: secret-gated instead of browser CSRF
      const expectedSecret = process.env.REFERRAL_CONVERT_SECRET;
      if (!expectedSecret) {
        return NextResponse.json({ error: "Not configured" }, { status: 503 });
      }
      if (req.headers.get("x-convert-secret") !== expectedSecret) {
        logger.warn("referral:convert", "Rejected request with invalid convert secret");
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      // Stricter budget for conversion writes
      const rlConvert = await rateLimit(`referral-convert:${ip}`, 10, 3_600_000);
      if (!rlConvert.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

      const { code, email, eventType, amount } = body;
      if (!code || !email || !eventType) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
      if (eventType !== "signup" && eventType !== "purchase") {
        return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
      }
      const amountProvided = amount !== undefined && amount !== null;
      if (amountProvided && (typeof amount !== "number" || !Number.isInteger(amount) || amount <= 0 || amount > 100000)) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
      }
      if (eventType === "purchase" && !amountProvided) {
        return NextResponse.json({ error: "Amount required for purchase conversions" }, { status: 400 });
      }

      const result = await recordReferralConversion({ code, email, eventType, amount });
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }
      return NextResponse.json({ success: true, commission: result.commission });
    }

    if (!validateCsrf(req)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }

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

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e) {
    logger.error("referral:post", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
