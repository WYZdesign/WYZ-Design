import { NextRequest, NextResponse } from "next/server";
import { removeNewsletterSubscriber } from "@/lib/wyzmind";
import { logger } from "@/lib/logger";

/**
 * Handles Resend email webhook events (bounce, complaint).
 * POST /api/webhook/resend
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type = body.type as string;

    if (type === "email.bounced" || type === "email.complained") {
      const email = body.data?.from || body.data?.email || "";
      if (email && typeof email === "string") {
        logger.warn("webhook:resend", `${type} for ${email}`);
        await removeNewsletterSubscriber(email);
        return NextResponse.json({ received: true });
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    logger.error("webhook:resend", (e as Error).message);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
