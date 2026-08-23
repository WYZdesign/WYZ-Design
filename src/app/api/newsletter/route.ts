import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { addNewsletterSubscriber, removeNewsletterSubscriber } from "@/lib/wyzmind";
import { createHmac } from "crypto";
import { validateCsrf } from "@/lib/csrf";
import { logger } from "@/lib/logger";

let resend: Resend;
function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}
const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://www.wyzdesign.com";

function signUnsubscribe(email: string): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET not configured");
  const hmac = createHmac("sha256", secret).update(email.toLowerCase().trim()).digest("hex");
  return `${encodeURIComponent(email)}.${hmac.slice(0, 16)}`;
}

function verifyUnsubscribe(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const email = decodeURIComponent(parts[0]);
  const expected = signUnsubscribe(email);
  const expectedHash = expected.split(".")[1];
  if (expectedHash !== parts[1]) return null;
  return email;
}

const welcomeHtml = (email: string) => {
  const token = signUnsubscribe(email);
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
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    await addNewsletterSubscriber(email).catch(() => {});

    try {
      await getResend().emails.send({
        from: "WYZ Design <newsletter@wyzdesign.com>",
        to: email,
        subject: "Welcome to WYZ Design, You're In",
        html: welcomeHtml(email),
      });
    } catch (e) { logger.error("newsletter:send", e); }

    return NextResponse.json({ success: true, message: "Subscribed! Check your inbox for a welcome email." });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message || "Failed to subscribe" }, { status: 500 });
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
  const token = req.nextUrl.searchParams.get("unsubscribe");
  if (!token) return NextResponse.json({ error: "Missing unsubscribe token" }, { status: 400 });

  const email = verifyUnsubscribe(token);
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
