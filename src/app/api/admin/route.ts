import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getAllUsers, getDashboardStats, getNewsletterSubscribers } from "@/lib/wyzmind";
import { getServiceClient } from "@/lib/supabase";
import { ensureNeo4jConstraints } from "@/lib/neo4j-setup";
import type { Session } from "next-auth";
import { logger } from "@/lib/logger";

interface FormSubmission {
  id: string;
  formType: string;
  submittedAt: string;
  ip?: string;
  data?: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    [key: string]: unknown;
  };
}

async function getFormSubmissions(): Promise<FormSubmission[]> {
  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("form_submissions")
      .select("*")
      .order("submitted_at", { ascending: false })
      .limit(500);
    if (error) { logger.error("admin:getFormSubmissions", error.message); return []; }
    // Map snake_case Supabase columns to camelCase for the admin UI
    return (data || []).map((r: any) => ({
      id: r.id,
      formType: r.form_type,
      submittedAt: r.submitted_at,
      ip: r.ip,
      data: r.data,
    }));
  } catch (e) { logger.error("admin:getFormSubmissions", e); return []; }
}

function getAllowedEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
}

function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = getAllowedEmails();
  // Fail closed: no allowlist configured means deny everyone.
  if (admins.length === 0) return false;
  return admins.includes(String(email).trim().toLowerCase());
}

function checkAdmin(session: Session | null): boolean {
  const candidate = (session?.user?.email || "").toLowerCase();
  return isAllowedEmail(candidate);
}

/**
 * Returns admin dashboard data (analytics, users, newsletter, forms, chats, or CSV export).
 * @method GET
 * @request Query param `tab` — one of: overview, analytics, users, newsletter, forms, chats, export
 * @response JSON with tab-specific data, or CSV for export tab
 * @auth Required — admin email must be in ADMIN_EMAILS env var
 */
export async function GET(req: NextRequest) {
  try {
    void ensureNeo4jConstraints();
    const session = await auth();
    if (!checkAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const tab = req.nextUrl.searchParams.get("tab") || "overview";

    // Overview analytics
    if (tab === "overview" || tab === "analytics") {
      const forms = await getFormSubmissions();

      // Form analytics
      const formCounts: Record<string, number> = {};
      const last7Days: Record<string, number> = {};
      forms.forEach((f: FormSubmission) => {
        formCounts[f.formType] = (formCounts[f.formType] || 0) + 1;
        const day = f.submittedAt?.split("T")[0];
        if (day) last7Days[day] = (last7Days[day] || 0) + 1;
      });

      // Neo4j stats (safe fallback)
      let neo4jStats = { totalUsers: 0, adminCount: 0, newsletterSubs: 0 };
      try { neo4jStats = await getDashboardStats(); } catch (e) { logger.error("admin:neo4jStats", e); }

      return NextResponse.json({
        stats: {
          totalForms: forms.length,
          totalChats: 0,
          chatSessions: 0,
          formTypes: formCounts,
          submissionsByDay: Object.entries(last7Days).sort().slice(-14),
          ...neo4jStats,
        },
        // forms is already newest-first (query orders by submitted_at desc),
        // so the "recent" 10 are the first 10, not the last 10 of the batch.
        recentForms: forms.slice(0, 10),
      });
    }

    // Users tab
    if (tab === "users") {
      try { return NextResponse.json({ users: await getAllUsers() }); }
      catch { return NextResponse.json({ users: [], note: "Neo4j offline" }); }
    }

    // Newsletter tab
    if (tab === "newsletter") {
      try { return NextResponse.json({ subscribers: await getNewsletterSubscribers() }); }
      catch { return NextResponse.json({ subscribers: [], note: "Neo4j offline" }); }
    }

    // Forms tab
    if (tab === "forms") {
      return NextResponse.json({ submissions: await getFormSubmissions() });
    }

    // Chat tab — chats are not currently persisted (stateless /api/chat)
    if (tab === "chats") {
      return NextResponse.json({
        totalMessages: 0,
        totalSessions: 0,
        sessions: [],
        note: "Chat history is not currently persisted",
      });
    }

    // Export CSV
    if (tab === "export") {
      const forms = await getFormSubmissions();
      const headers = ["id", "formType", "submittedAt", "ip", "name", "email", "phone", "message"];
      const rows = [headers.join(",")];
      forms.forEach((f: FormSubmission) => {
        const row = [f.id, f.formType, f.submittedAt, f.ip, f.data?.name, f.data?.email, f.data?.phone, f.data?.message]
          .map(v => `"${String(v || "").replace(/"/g, '""')}"`);
        rows.push(row.join(","));
      });
      return new NextResponse(rows.join("\n"), {
        headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=wyz-forms.csv" },
      });
    }

    return NextResponse.json({ error: "Unknown tab" }, { status: 400 });
  } catch (e: unknown) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Performs admin actions such as adding loyalty points or validating redemption codes.
 * @method POST
 * @request Body `{ action: "add-points", email, amount, reason }` or `{ action: "validate-redemption", code }`
 * @response `{ success: true }` on success; redemption lookup returns the stored record
 * @auth Required — admin email must be in ADMIN_EMAILS env var
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({}));
    if (!checkAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (body.action === "add-points") {
      const { addLoyaltyPoints } = await import("@/lib/wyzmind");
      const email = typeof body.email === "string" && body.email.includes("@") ? body.email : null;
      const amount = typeof body.amount === "number" && body.amount > 0 && body.amount <= 10000 ? body.amount : null;
      const reason = typeof body.reason === "string" && body.reason.length > 0 ? body.reason.slice(0, 200) : null;
      if (!email || !amount || !reason) {
        return NextResponse.json({ error: "Invalid input: valid email, positive amount (max 10000), and reason required" }, { status: 400 });
      }
      await addLoyaltyPoints(email, amount, reason);
      return NextResponse.json({ success: true });
    }
    if (body.action === "validate-redemption") {
      const code = typeof body.code === "string" ? body.code.trim().toUpperCase().slice(0, 20) : "";
      if (!/^WYZ-[A-Z0-9]{6}$/.test(code)) {
        return NextResponse.json({ error: "Invalid code format. Expected WYZ-XXXXXX" }, { status: 400 });
      }
      const { getRedis } = await import("@/lib/wyzmind");
      const raw = await getRedis().get(`zeal:redemption:${code}`);
      if (!raw) {
        return NextResponse.json({ valid: false, code });
      }
      const record = JSON.parse(raw) as { email: string; rewardId: string; title: string; code: string; timestamp: number };
      return NextResponse.json({ valid: true, ...record });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
