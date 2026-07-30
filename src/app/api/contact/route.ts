import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { rateLimit } from "@/lib/rate-limit";

const DATA_DIR = process.env.VERCEL ? join(tmpdir(), "_data") : join(process.cwd(), "_data");
const FILE = join(DATA_DIR, "form-submissions.json");

function saveLocal(formType: string, data: Record<string, unknown>, ip: string) {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    const subs = existsSync(FILE) ? JSON.parse(readFileSync(FILE, "utf-8")) : [];
    subs.push({ id: Date.now().toString(36), formType, data, submittedAt: new Date().toISOString(), ip });
    writeFileSync(FILE, JSON.stringify(subs, null, 2), "utf-8");
  } catch (e) { console.error("[contact:saveLocal]", e); }
}

async function forwardToN8n(name: string, email: string, message: string) {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, message, timestamp: new Date().toISOString() }) });
  } catch (e) { console.error("[contact:forwardToN8n]", e); }
}

/**
 * Submits a contact form message and optionally forwards it to n8n.
 * @method POST
 * @request Body `{ name?: string, email: string, message: string }`
 * @response JSON with success status and confirmation message
 * @auth None
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { ok } = rateLimit(`contact:${ip}`, 5, 60_000);
    if (!ok) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const { name, email, message } = await req.json();
    if (!email || !message) {
      return NextResponse.json({ error: "Email and message required" }, { status: 400 });
    }

    saveLocal("contact", { name, email, message }, ip);
    forwardToN8n(name, email, message).catch(() => {});

    return NextResponse.json({ success: true, message: "Message sent. We'll get back to you within 24 hours." });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
