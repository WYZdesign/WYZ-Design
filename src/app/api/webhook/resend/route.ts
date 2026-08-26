import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { removeNewsletterSubscriber } from "@/lib/wyzmind";
import { logger } from "@/lib/logger";

const MAX_TIMESTAMP_AGE_SECONDS = 5 * 60;

/**
 * Verifies an Svix-signed webhook (as used by Resend).
 * Signature scheme: v1,<base64> entries in svix-signature, HMAC-SHA256 over
 * `{id}.{timestamp}.{payload}` keyed with the endpoint secret.
 */
function verifySvixSignature(
  secret: string,
  id: string,
  timestamp: string,
  payload: string,
  signatureHeader: string
): boolean {
  const key = secret.startsWith("whsec_")
    ? Buffer.from(secret.slice("whsec_".length), "base64")
    : Buffer.from(secret, "utf8");
  const expected = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${payload}`)
    .digest("base64");
  const expectedBuf = Buffer.from(expected, "utf8");
  return signatureHeader.split(" ").some((entry) => {
    const [scheme, signature] = entry.split(",");
    if (scheme !== "v1" || !signature) return false;
    const signatureBuf = Buffer.from(signature, "utf8");
    if (signatureBuf.length !== expectedBuf.length) return false;
    return timingSafeEqual(signatureBuf, expectedBuf);
  });
}

/**
 * Handles Resend email webhook events (bounce, complaint), verified against
 * Svix signatures using RESEND_WEBHOOK_SECRET.
 * POST /api/webhook/resend
 */
export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    logger.warn("webhook:resend", "RESEND_WEBHOOK_SECRET not set, rejecting delivery");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const id = req.headers.get("svix-id");
  const timestamp = req.headers.get("svix-timestamp");
  const signatureHeader = req.headers.get("svix-signature");
  if (!id || !timestamp || !signatureHeader) {
    logger.warn("webhook:resend", "Missing Svix signature headers");
    return NextResponse.json({ error: "Missing signature headers" }, { status: 400 });
  }

  const seconds = Number(timestamp);
  if (!Number.isFinite(seconds) || Date.now() / 1000 - seconds > MAX_TIMESTAMP_AGE_SECONDS) {
    logger.warn("webhook:resend", "Stale or invalid Svix timestamp");
    return NextResponse.json({ error: "Invalid timestamp" }, { status: 400 });
  }

  const payload = await req.text();
  if (!verifySvixSignature(secret, id, timestamp, payload, signatureHeader)) {
    logger.warn("webhook:resend", "Signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  try {
    const body = JSON.parse(payload) as { type?: string; data?: { from?: string; email?: string } };
    const type = typeof body.type === "string" ? body.type : "";

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
