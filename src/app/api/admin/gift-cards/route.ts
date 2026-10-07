import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getServiceClient } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import type { Session } from "next-auth";

function isAllowedEmail(email: string): boolean {
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (admins.length === 0) return false;
  return admins.includes(String(email).trim().toLowerCase());
}
function checkAdmin(session: Session | null): boolean {
  return isAllowedEmail(session?.user?.email || "");
}

/**
 * Admin gift-card support tool.
 *   GET  ?q=<email or last-4>  -> matching cards + their ledger
 *   POST { action: "void"|"refill", id, amountCents?, note? }
 * Gated by admin email. Full codes are shown here for support; never logged.
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!checkAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const q = (new URL(req.url).searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ cards: [] });

  const sb = getServiceClient();
  const { data: cards, error } = await sb
    .from("gift_cards")
    .select("id, code_last4, buyer_email, recipient_email, amount, balance_cents, currency, status, expires_at, created_at")
    .or(`buyer_email.ilike.%${q}%,code_last4.ilike.%${q}%`)
    .order("created_at", { ascending: false })
    .limit(25);
  if (error) {
    logger.error("admin:gift-cards:get", error.message);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }

  let ledger: Record<string, unknown>[] = [];
  if (cards?.length) {
    const { data: l } = await sb
      .from("gift_card_ledger")
      .select("gift_card_id, delta_cents, reason, actor, created_at")
      .in("gift_card_id", cards.map((c) => c.id))
      .order("created_at", { ascending: false })
      .limit(100);
    ledger = l || [];
  }
  return NextResponse.json({ cards: cards || [], ledger });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!checkAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { action, id, amountCents, note } = await req.json();
    if (!id || (action !== "void" && action !== "refill")) {
      return NextResponse.json({ error: "action must be void or refill, with a card id" }, { status: 400 });
    }
    const sb = getServiceClient();
    const actor = session?.user?.email || "admin";

    const { data: card, error: getErr } = await sb
      .from("gift_cards")
      .select("id, balance_cents, status")
      .eq("id", id)
      .maybeSingle();
    if (getErr || !card) return NextResponse.json({ error: "Card not found" }, { status: 404 });

    if (action === "void") {
      await sb.from("gift_cards").update({ status: "void" }).eq("id", id);
      await sb.from("gift_card_ledger").insert({ gift_card_id: id, delta_cents: 0, reason: note || "voided by admin", actor });
      return NextResponse.json({ ok: true, status: "void" });
    }

    const delta = Math.floor(Number(amountCents));
    if (!Number.isFinite(delta) || delta <= 0) {
      return NextResponse.json({ error: "amountCents must be a positive integer" }, { status: 400 });
    }
    const newBalance = (card.balance_cents || 0) + delta;
    await sb.from("gift_cards").update({ balance_cents: newBalance, status: "active" }).eq("id", id);
    await sb.from("gift_card_ledger").insert({ gift_card_id: id, delta_cents: delta, reason: note || "refill by admin", actor });
    return NextResponse.json({ ok: true, balanceCents: newBalance });
  } catch (e) {
    logger.error("admin:gift-cards:post", e instanceof Error ? e.message : String(e));
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
