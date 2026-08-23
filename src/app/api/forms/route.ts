import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { Resend } from "resend";
import { sendAdminAlert } from "@/lib/novu";
import { sendDiscordAlert } from "@/lib/discord";
import { rateLimit, sanitizeHtml } from "@/lib/rate-limit";
import { validateCsrf } from "@/lib/csrf";
import { logger } from "@/lib/logger";
import { auth } from "@/app/api/auth/[...nextauth]/route";

const VALID_FORM_TYPES = [
  "contact", "booking", "printing-quote", "custom-plan",
  "model-application", "featured-artist-application", "newsletter",
  "photoshoot-booking", "consultation-booking", "web-design-quote",
];

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatEntry(data: Record<string, unknown>): string {
  return Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([k, v]) => `${k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}: ${v}`)
    .join("\n");
}

async function sendAdminNotification(formType: string, data: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  try {
    const resend = new Resend(apiKey);
    const details = formatEntry(data);
    await resend.emails.send({
      from: "WYZ Design <notifications@wyzdesign.com>",
      to: process.env.ADMIN_EMAIL || "torree.marcel@gmail.com",
      subject: `New ${formType} Submission`,
      text: `New form submission received:\n\nType: ${formType}\n\n${details}\n\nView all: https://www.wyzdesign.com/admin`,
    });
  } catch (e) { logger.error("forms:sendAdminNotification", e); }
}

async function sendCustomerConfirmation(formType: string, data: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const email = String(data.email || "");
  if (!email.includes("@")) return;
  const bookingTypes = ["photoshoot-booking", "consultation-booking", "booking", "printing-quote", "contact"];
  if (!bookingTypes.includes(formType)) return;

  const name = escapeHtml(String(data.name || "there"));
  let subject = "We received your message - WYZ Design";
  let body = `<p>Hi ${name},</p><p>Thanks for reaching out! We've received your ${formType.replace(/-/g, " ")} and will get back to you within 24 hours.</p>`;
  if (formType === "photoshoot-booking") {
    subject = "Photoshoot Booking Confirmed - WYZ Design";
    body = `<p>Hi ${name},</p><p>Your photoshoot is scheduled for <strong>${escapeHtml(String(data.date || ""))}</strong> at <strong>${escapeHtml(String(data.time || ""))}</strong>.</p><p>Duration: ${escapeHtml(String(data.duration || ""))}</p><p>We'll send a reminder 24 hours before. Questions? Reply to this email.</p>`;
  } else if (formType === "consultation-booking") {
    subject = "Consultation Confirmed - WYZ Design";
    body = `<p>Hi ${name},</p><p>Your free consultation is scheduled for <strong>${escapeHtml(String(data.date || ""))}</strong> at <strong>${escapeHtml(String(data.time || ""))}</strong>.</p><p>Topic: ${escapeHtml(String(data.topic || ""))}</p><p>We'll reach out with a calendar invite shortly.</p>`;
  }
  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "WYZ Design <notifications@wyzdesign.com>",
      to: email,
      subject,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">${body}<hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;"><p style="font-size:14px;color:#888;">- The WYZ Design Team<br/><a href="https://www.wyzdesign.com" style="color:#DF3131;">wyzdesign.com</a></p></div>`,
    });
  } catch (e) { logger.error("forms:sendCustomerConfirmation", e); }
}

/**
 * Submits a form with email notifications. Persists to Supabase.
 */
export async function POST(req: NextRequest) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const { ok } = await rateLimit(`forms:${ip}`, 20, 60_000);
  if (!ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  try {
    const body = await req.json();
    const { formType, data } = body;

    if (!formType || !data) {
      return NextResponse.json({ error: "formType and data required" }, { status: 400 });
    }

    if (!VALID_FORM_TYPES.includes(formType)) {
      return NextResponse.json({ error: `Invalid formType: ${formType}` }, { status: 400 });
    }

    if (typeof data !== "object" || Array.isArray(data)) {
      return NextResponse.json({ error: "data must be an object" }, { status: 400 });
    }

    const email = String(data.email || "");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0 || entries.length > 50) {
      return NextResponse.json({ error: "Invalid number of form fields" }, { status: 400 });
    }

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const submittedAt = new Date().toISOString();

    // Persist to Supabase (best-effort — don't block on failure)
    const supabase = getServiceClient();
    try {
      const { error } = await supabase.from("form_submissions").insert({
        id, form_type: formType, data, submitted_at: submittedAt, ip,
      });
      if (error) logger.error("Supabase insert error:", error.message);
    } catch { /* best-effort */ }

    // Fire notifications in parallel
    sendAdminNotification(formType, data).catch(() => {});
    sendCustomerConfirmation(formType, data).catch(() => {});
    sendAdminAlert(`New ${formType}`, formatEntry(data)).catch(() => {});
    sendDiscordAlert(`New ${formType} Submission`, data as Record<string, string>).catch(() => {});

    return NextResponse.json({ success: true, id }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}

/**
 * Retrieves form submissions from Supabase.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
    if (adminEmails.length === 0 || !adminEmails.includes(session.user.email.toLowerCase())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formType = req.nextUrl.searchParams.get("formType");
    const supabase = getServiceClient();
    let query = supabase.from("form_submissions").select("*").order("submitted_at", { ascending: false }).limit(100);
    if (formType) query = query.eq("form_type", formType);
    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ submissions: [], error: error.message }, { status: 200 });
    }
    return NextResponse.json(data || []);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message, submissions: [] }, { status: 200 });
  }
}
