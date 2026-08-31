import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";
import { sendBookingWhatsNext, sendBookingDelivered, sendBookingConfirmation } from "@/lib/email";
import { logger } from "@/lib/logger";

interface TriggerBody {
  action: "confirm" | "what-to-expect" | "delivered";
  email: string;
  serviceName: string;
  customerName?: string;
  amount?: number;
  notes?: string;
}

/**
 * POST /api/booking/email — Manually trigger post-booking emails
 *
 * @auth Admin only
 * @body { action: "confirm" | "what-to-expect" | "delivered", email, serviceName, customerName?, amount?, notes? }
 *
 * Use cases:
 * - Resend a confirmation email if Resend webhook showed bounce
 * - Send "what to expect" email on the day before a session
 * - Send "delivered" email when staff marks work complete in admin
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body: TriggerBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.email || !body.serviceName || !body.action) {
    return NextResponse.json({ error: "Missing required fields: action, email, serviceName" }, { status: 400 });
  }

  if (!["confirm", "what-to-expect", "delivered"].includes(body.action)) {
    return NextResponse.json({ error: "Invalid action. Must be: confirm | what-to-expect | delivered" }, { status: 400 });
  }

  let success = false;
  let message = "";

  try {
    if (body.action === "confirm") {
      success = await sendBookingConfirmation({
        email: body.email,
        customerName: body.customerName,
        serviceType: body.serviceName,
        serviceName: body.serviceName,
        amount: body.amount || 0,
      });
      message = "Confirmation email sent";
    } else if (body.action === "what-to-expect") {
      success = await sendBookingWhatsNext({
        email: body.email,
        customerName: body.customerName,
        serviceType: body.serviceName,
        serviceName: body.serviceName,
      });
      message = "What-to-expect email sent";
    } else if (body.action === "delivered") {
      success = await sendBookingDelivered({
        email: body.email,
        customerName: body.customerName,
        serviceName: body.serviceName,
        deliveryNotes: body.notes,
      });
      message = "Delivery email sent";
    }

    if (success) {
      const sb = getServiceClient();
      try {
        await sb.from("email_log").insert({
          to_email: body.email,
          action: body.action,
          service_name: body.serviceName,
          sent_by: auth.email,
          sent_at: new Date().toISOString(),
        });
      } catch {
        // email_log table may not exist yet — best-effort
      }
      return NextResponse.json({ success: true, message });
    } else {
      return NextResponse.json({ success: false, error: "Email send failed (check Resend API key)" }, { status: 502 });
    }
  } catch (e) {
    logger.error("booking-email:trigger", (e as Error).message);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
