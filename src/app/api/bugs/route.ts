import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { rateLimit } from "@/lib/rate-limit";
import { validateCsrf } from "@/lib/csrf";
import { requireAdmin } from "@/lib/admin-auth";
import { getServiceClient } from "@/lib/supabase";
import { getClientIp, hashIp } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = process.env.VERCEL ? "/tmp/_data" : join(process.cwd(), "_data");
const BUGS_FILE = join(DATA_DIR, "bug-reports.json");
const MAX_TITLE = 200;
const MAX_DESC = 5000;

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(BUGS_FILE)) writeFileSync(BUGS_FILE, "[]", "utf-8");
}

export async function POST(req: NextRequest) {
  try {
    if (!validateCsrf(req)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { ok, remaining } = await rateLimit(`bugs:${ip}`, 5, 60_000);
    if (!ok) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const title = String(body.title || "").trim().slice(0, MAX_TITLE);
    const description = String(body.description || "").trim().slice(0, MAX_DESC);
    const severity = ["low", "medium", "high", "critical"].includes(body.severity) ? body.severity : "medium";

    if (!title || !description) {
      return NextResponse.json({ error: "title and description required" }, { status: 400 });
    }

    const report = { title, description, severity, id: Date.now(), createdAt: new Date().toISOString(), ip: hashIp(ip) };

    if (IS_VERCEL) {
      const sb = getServiceClient();
      const { error } = await sb.from("bug_reports").insert(report);
      if (error) throw error;
    } else {
      ensureDir();
      const bugs = JSON.parse(readFileSync(BUGS_FILE, "utf-8"));
      bugs.push(report);
      writeFileSync(BUGS_FILE, JSON.stringify(bugs, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true, remaining });
  } catch (e: unknown) {
    logger.error("bugs:POST", e);
    return NextResponse.json({ error: "Failed to submit bug report" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin.ok) return admin.response;

    if (IS_VERCEL) {
      const sb = getServiceClient();
      const { data } = await sb.from("bug_reports").select("*").order("createdAt", { ascending: false }).limit(100);
      return NextResponse.json({ bugs: data || [] });
    }

    ensureDir();
    const bugs = JSON.parse(readFileSync(BUGS_FILE, "utf-8"));
    return NextResponse.json({ bugs });
  } catch (e: unknown) {
    logger.error("bugs:GET", e);
    return NextResponse.json({ bugs: [] });
  }
}
