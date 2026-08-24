import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { addNewsletterSubscriber, removeNewsletterSubscriber } from "@/lib/wyzmind";
import { createHmac } from "crypto";
import { validateCsrf } from "@/lib/csrf";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { getSiteUrl } from "@/lib/site-url";

let resend: Resend;
function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}
const BASE_URL = getSiteUrl();

function signToken(email: string, purpose: string): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET not configured");
  const timestamp = Date.now();
  const data = `${email.toLowerCase().trim()}.${purpose}.${timestamp}`;
  const hmac = createHmac("sha256", secret).update(data).digest("hex");
  return `${encodeURIComponent(email)}.${timestamp}.${purpose}.${hmac.slice(0, 32)}`;
}

function verifyToken(token: string, purpose: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const email = decodeURIComponent(parts[0]);
  const timestamp = parseInt(parts[1], 10);
  const tokenPurpose = parts[2];
  const hash = parts[3];
  if (tokenPurpose !== purpose) return null;
  if (Date.now() - timestamp > 30 * 24 * 60 * 60 * 1000) return null; // 30 day expiry
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return null;
  const expected = createHmac("sha256", secret).update(`${email.toLowerCase().trim()}.${purpose}.${timestamp}`).digest("hex").slice(0, 32);
  if (expected !== hash) return null;
  return email;
}

const welcomeHtml = (email: string) => {
  const token = signToken(email, "unsubscribe");
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
  <h1 style="font-size:24px;color:#111;margin-bottom:16px;">Welcome to WYZ Design</h1>
  <p style="font-size:16px;color:#444;line-height:1.6;">
    You're now part of the WYZ Design community. Expect exclusive updates, behind-the-scenes content, promotions, and early access to new services.
  </p>
  <div style="margin:32px 0;padding:24px;background:#F5F5F3;border-left:4px solid #DF3131;">
    <p style="font-size:14px;color:#333;margin:0;">
      <strong>What's next?</strong><br/>
      We'll send you occasional updates, no spam, no fluff. Just the good stuff.
    </p>
  </div>
  <p style="font-size:14px;color:#888;margin-top:32px;">
    - The WYZ Design Team<br/>
    <a href="https://www.wyzdesign.com" style="color:#DF3131;">wyzdesign.com</a>
  </p>
  <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;" />
  <p style="font-size:11px;color:#aaa;">
    <a href="${BASE_URL}/api/newsletter?unsubscribe=${token}" style="color:#aaa;">Unsubscribe</a> from these emails at any time.
  </p>
</div>`;
};

/**
 * Subscribes an email to the newsletter and sends a welcome email.
 * @method POST
 * @request Body `{ email: string }`
 * @response JSON with success status and confirmation message
 * @auth None
 */
export async function POST(req: NextRequest) {
  try {
    if (!validateCsrf(req)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await rateLimit(`newsletter:${ip}`, 5, 60_000);
    if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const { email } = await req.json();
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // Store as pending (not yet confirmed)
    try {
      await addNewsletterSubscriber(email, false);
    } catch (e) { logger.error("newsletter:store", e); }

    // Send double opt-in confirmation email
    const token = signToken(email, "confirm");
    const confirmUrl = `${BASE_URL}/api/newsletter?confirm=${token}`;
    try {
      await getResend().emails.send({
        from: "WYZ Design <newsletter@wyzdesign.com>",
        to: email,
        subject: "Confirm your subscription to WYZ Design",
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
  <h1 style="font-size:24px;color:#111;margin-bottom:16px;">Confirm Your Subscription</h1>
  <p style="font-size:16px;color:#444;line-height:1.6;">
    Click the button below to confirm your email and start receiving updates from WYZ Design.
  </p>
  <div style="margin:32px 0;text-align:center;">
    <a href="${confirmUrl}" style="display:inline-block;padding:14px 32px;background:#DF3131;color:#fff;font-weight:bold;text-decoration:none;font-size:14px;letter-spacing:0.05em;">CONFIRM MY EMAIL</a>
  </div>
  <p style="font-size:14px;color:#888;margin-top:32px;">
    - The WYZ Design Team<br/>
    <a href="https://www.wyzdesign.com" style="color:#DF3131;">wyzdesign.com</a>
  </p>
  <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;" />
  <p style="font-size:11px;color:#aaa;">
    If you did not request this, you can safely ignore this email.
  </p>
</div>`,
      });
    } catch (e) { logger.error("newsletter:send", e); }

    return NextResponse.json({ success: true, message: "Check your inbox to confirm your subscription." });
  } catch (e: unknown) {
    logger.error("newsletter:subscribe", e);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}

/**
 * Unsubscribes an email from the newsletter via a one-click link.
 * @method GET
 * @request Query param `unsubscribe` (required) — email to remove
 * @response HTML confirmation page
 * @auth None
 */
export async function GET(req: NextRequest) {
  // Double opt-in confirmation
  const confirmToken = req.nextUrl.searchParams.get("confirm");
  if (confirmToken) {
    const email = verifyToken(confirmToken, "confirm");
    if (!email) {
      return new NextResponse(
        `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invalid Link</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:Arial,sans-serif;text-align:center;padding:80px 20px;background:#FEFEFD;"><h1 style="color:#333;">Invalid or expired confirmation link.</h1><p style="color:#666;">Please try subscribing again.</p><p><a href="${BASE_URL}" style="color:#DF3131;">Back to wyzdesign.com</a></p></body></html>`,
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }
    try {
      await addNewsletterSubscriber(email);
      const escapedEmail = email.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      // Send welcome email after confirmation
      try {
        await getResend().emails.send({
          from: "WYZ Design <newsletter@wyzdesign.com>",
          to: email,
          subject: "Welcome to WYZ Design, You're In",
          html: welcomeHtml(email),
        });
      } catch (e) { logger.error("newsletter:welcome", e); }
      return new NextResponse(
        `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Confirmed</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:Arial,sans-serif;text-align:center;padding:80px 20px;background:#FEFEFD;"><h1 style="color:#333;">You're confirmed!</h1><p style="color:#666;font-size:16px;">${escapedEmail} is now subscribed to the WYZ Design newsletter.</p><p><a href="${BASE_URL}" style="color:#DF3131;">Back to wyzdesign.com</a></p></body></html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    } catch {
      return new NextResponse(
        `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Error</title></head><body style="font-family:Arial,sans-serif;text-align:center;padding:80px 20px;"><h1>Something went wrong.</h1><p><a href="${BASE_URL}" style="color:#DF3131;">Back to wyzdesign.com</a></p></body></html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }
  }

  // Unsubscribe
  const token = req.nextUrl.searchParams.get("unsubscribe");
  if (!token) return NextResponse.json({ error: "Missing unsubscribe token" }, { status: 400 });

  const email = verifyToken(token, "unsubscribe");
  if (!email) {
    return new NextResponse(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invalid Link</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:Arial,sans-serif;text-align:center;padding:80px 20px;background:#FEFEFD;"><h1 style="color:#333;">Invalid or expired unsubscribe link.</h1><p style="color:#666;">Please check your email for the correct link or contact us.</p><p><a href="${BASE_URL}" style="color:#DF3131;">Back to wyzdesign.com</a></p></body></html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  const escapedEmail = email.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  try {
    await removeNewsletterSubscriber(email);
    return new NextResponse(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Unsubscribed</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:Arial,sans-serif;text-align:center;padding:80px 20px;background:#FEFEFD;"><h1 style="color:#333;">You've been unsubscribed.</h1><p style="color:#666;font-size:16px;">${escapedEmail} has been removed from our mailing list.</p><p><a href="${BASE_URL}" style="color:#DF3131;">Back to wyzdesign.com</a></p></body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch {
    return new NextResponse(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Error</title></head><body style="font-family:Arial,sans-serif;text-align:center;padding:80px 20px;"><h1>Something went wrong.</h1><p><a href="${BASE_URL}" style="color:#DF3131;">Back to wyzdesign.com</a></p></body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}
