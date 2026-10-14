import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";
import { recordDelivery, type DeliveryInput } from "@/lib/delivery";
import { logger } from "@/lib/logger";

/**
 * Spec 22 delivery-event emitter. There is no automated delivery flow yet
 * (orders table is unused), so a delivery is recorded here by hand or by a
 * future fulfillment hook. Every one of the four outreach stages keys off
 * the rows this creates.
 *   GET   -> recent delivery events with their stage stamps
 *   POST  { email, clientName?, serviceName?, orderId?, deliveredAt?, notes? }
 * Idempotent on (email, delivered_at): re-posting the same delivery is a no-op.
 * @auth admin email (ADMIN_EMAILS)
 */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const sb = getServiceClient();
  const { data, error } = await sb
    .from("delivery_events")
    .select("*")
    .order("delivered_at", { ascending: false })
    .limit(100);
  if (error) {
    logger.error("admin:delivery-events:get", error.message);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
  return NextResponse.json({ events: data || [] });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const body = await req.json().catch(() => ({}));
    const input: DeliveryInput = {
      email: typeof body?.email === "string" ? body.email : "",
      clientName: typeof body?.clientName === "string" ? body.clientName : null,
      serviceName: typeof body?.serviceName === "string" ? body.serviceName : null,
      orderId: typeof body?.orderId === "string" ? body.orderId : null,
      deliveredAt: typeof body?.deliveredAt === "string" ? body.deliveredAt : null,
      notes: typeof body?.notes === "string" ? body.notes : null,
    };

    const result = await recordDelivery(getServiceClient(), input);
    if (!result.ok && !result.skipped) {
      logger.error("admin:delivery-events:post", result.error || "insert failed");
      return NextResponse.json({ ok: false, error: result.error || "Insert failed" }, { status: 500 });
    }
    if (result.skipped === "invalid-email") {
      return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (e) {
    logger.error("admin:delivery-events:post", e instanceof Error ? e.message : String(e));
    return NextResponse.json({ error: "Recording failed" }, { status: 500 });
  }
}
