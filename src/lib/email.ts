import { logger } from "@/lib/logger";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "WYZ Design <orders@wyzdesign.com>";
const ADMIN_EMAIL = "info@wyzdesign.com";

interface BookingConfirmation {
  email: string;
  customerName?: string;
  serviceType: string;
  serviceName: string;
  amount: number;
  orderId?: string;
}

interface BookingConfirmationWhatsNext {
  email: string;
  customerName?: string;
  serviceType: string;
  serviceName: string;
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    logger.warn("email:send", `RESEND_API_KEY not set, skipping email to ${to}`);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      logger.error("email:send", `Resend error ${res.status}: ${body}`);
      return false;
    }

    return true;
  } catch (e) {
    logger.error("email:send", (e as Error).message);
    return false;
  }
}

export async function sendBookingConfirmation(data: BookingConfirmation): Promise<boolean> {
  const { email, customerName, serviceType, serviceName, amount, orderId } = data;
  const name = customerName || "there";

  const subject = `Your WYZ Design ${serviceName} is confirmed ✦`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Georgia,serif">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#111;padding:32px 40px;text-align:center">
      <p style="color:#DF3131;font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px">WYZ Design</p>
      <h1 style="color:#fff;font-size:24px;font-weight:900;margin:0;letter-spacing:0.05em;text-transform:uppercase">Order Confirmed</h1>
    </div>
    <div style="padding:40px">
      <p style="font-size:16px;color:#333;line-height:1.6;margin:0 0 24px">
        Hey ${name},
      </p>
      <p style="font-size:16px;color:#333;line-height:1.6;margin:0 0 24px">
        Your <strong>${serviceName}</strong> is confirmed. We received your payment of <strong>$${amount.toFixed(2)}</strong>${orderId ? ` (Order #${orderId})` : ""}.
      </p>
      <div style="background:#f9f9f9;border-left:4px solid #DF3131;padding:16px 20px;margin:24px 0;border-radius:0 4px 4px 0">
        <p style="font-size:14px;color:#333;margin:0;line-height:1.6">
          <strong>What's next?</strong><br>
          We'll reach out within 24 hours to confirm your session details, answer any questions, and get you ready to shoot.
        </p>
      </div>
      <p style="font-size:14px;color:#666;line-height:1.6;margin:0 0 24px">
        Need to reach us sooner? Reply to this email or text/call us directly.
      </p>
      <p style="font-size:14px;color:#666;line-height:1.6;margin:0">
        — WYZ Design<br>
        <a href="mailto:info@wyzdesign.com" style="color:#DF3131">info@wyzdesign.com</a>
      </p>
    </div>
    <div style="background:#f0f0f0;padding:20px 40px;text-align:center">
      <p style="font-size:11px;color:#999;margin:0">
        © ${new Date().getFullYear()} WYZ Design LLC · Los Angeles, CA · 
        <a href="https://www.wyzdesign.com/privacy-policy" style="color:#999">Privacy</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return await sendEmail(email, subject, html);
}

export async function sendBookingWhatsNext(data: BookingConfirmationWhatsNext): Promise<boolean> {
  const { email, customerName, serviceType, serviceName } = data;
  const name = customerName || "there";

  const subject = `Getting ready for your ${serviceName} at WYZ Design ✦`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Georgia,serif">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#111;padding:32px 40px;text-align:center">
      <p style="color:#DF3131;font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px">WYZ Design</p>
      <h1 style="color:#fff;font-size:24px;font-weight:900;margin:0;letter-spacing:0.05em;text-transform:uppercase">What to Expect</h1>
    </div>
    <div style="padding:40px">
      <p style="font-size:16px;color:#333;line-height:1.6;margin:0 0 24px">
        Hey ${name},
      </p>
      <p style="font-size:16px;color:#333;line-height:1.6;margin:0 0 24px">
        Your <strong>${serviceName}</strong> is coming up. Here's how to get the most out of it:
      </p>
      <div style="margin:24px 0">
        <div style="margin:16px 0;padding:16px;background:#f9f9f9;border-radius:6px">
          <p style="font-size:14px;color:#333;margin:0 0 8px"><strong>Quick tip:</strong></p>
          <p style="font-size:14px;color:#666;margin:0">The best shots come from clients who come ready to have fun. We handle the rest.</p>
        </div>
      </div>
      <p style="font-size:14px;color:#666;line-height:1.6;margin:0 0 24px">
        Questions? Just reply to this email. We're here before, during, and after.
      </p>
      <p style="font-size:14px;color:#666;line-height:1.6;margin:0">
        — WYZ Design<br>
        <a href="mailto:info@wyzdesign.com" style="color:#DF3131">info@wyzdesign.com</a>
      </p>
    </div>
    <div style="background:#f0f0f0;padding:20px 40px;text-align:center">
      <p style="font-size:11px;color:#999;margin:0">
        © ${new Date().getFullYear()} WYZ Design LLC · Los Angeles, CA · 
        <a href="https://www.wyzdesign.com/privacy-policy" style="color:#999">Privacy</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return await sendEmail(email, subject, html);
}

export async function sendBookingDelivered(data: { email: string; customerName?: string; serviceName: string; deliveryNotes?: string }): Promise<boolean> {
  const { email, customerName, serviceName, deliveryNotes } = data;
  const name = customerName || "there";

  const subject = `Your ${serviceName} from WYZ Design is ready ✦`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Georgia,serif">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#111;padding:32px 40px;text-align:center">
      <p style="color:#DF3131;font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px">WYZ Design</p>
      <h1 style="color:#fff;font-size:24px;font-weight:900;margin:0;letter-spacing:0.05em;text-transform:uppercase">Work Delivered</h1>
    </div>
    <div style="padding:40px">
      <p style="font-size:16px;color:#333;line-height:1.6;margin:0 0 24px">
        Hey ${name},
      </p>
      <p style="font-size:16px;color:#333;line-height:1.6;margin:0 0 24px">
        Your <strong>${serviceName}</strong> is ready. Log in to your account to view and download your files.
      </p>
      ${deliveryNotes ? `<div style="background:#f9f9f9;border-left:4px solid #D49341;padding:16px 20px;margin:24px 0;border-radius:0 4px 4px 0"><p style="font-size:14px;color:#333;margin:0"><strong>Notes from us:</strong> ${deliveryNotes}</p></div>` : ""}
      <a href="https://www.wyzdesign.com/account/my-account" style="display:inline-block;background:#DF3131;color:#fff;font-size:14px;font-weight:700;letter-spacing:0.08em;text-decoration:none;padding:14px 28px;border-radius:4px;margin:24px 0">
        View My Files
      </a>
      <p style="font-size:14px;color:#666;line-height:1.6;margin:24px 0 0">
        Need revisions? Let us know within 7 days and we'll make it right.
      </p>
      <p style="font-size:14px;color:#666;line-height:1.6;margin:24px 0 0">
        — WYZ Design<br>
        <a href="mailto:info@wyzdesign.com" style="color:#DF3131">info@wyzdesign.com</a>
      </p>
    </div>
    <div style="background:#f0f0f0;padding:20px 40px;text-align:center">
      <p style="font-size:11px;color:#999;margin:0">
        © ${new Date().getFullYear()} WYZ Design LLC · Los Angeles, CA · 
        <a href="https://www.wyzdesign.com/privacy-policy" style="color:#999">Privacy</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return await sendEmail(email, subject, html);
}
