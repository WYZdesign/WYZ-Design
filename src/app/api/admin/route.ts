import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { isAdmin, getAllUsers, getDashboardStats, getNewsletterSubscribers } from "@/lib/wyzmind";
import { readFileSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
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

interface ChatMessage {
  sessionId?: string;
  role?: string;
  content?: string;
  timestamp?: string;
  [key: string]: unknown;
}

function getFormSubmissions(): FormSubmission[] {
  const dir = process.env.VERCEL ? join(tmpdir(), "_data") : join(process.cwd(), "_data");
  const file = join(dir, "form-submissions.json");
  if (!existsSync(file)) return [];
  try { return JSON.parse(readFileSync(file, "utf-8")); } catch (e) { logger.error("admin:getFormSubmissions", e); return []; }
}

function getChatHistory(): ChatMessage[] {
  const dir = process.env.VERCEL ? join(tmpdir(), "_data") : join(process.cwd(), "_data");
  const file = join(dir, "chat-history.json");
  if (!existsSync(file)) return [];
  try { return JSON.parse(readFileSync(file, "utf-8")); } catch (e) { logger.error("admin:getChatHistory", e); return []; }
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
    const session = await auth();
    if (!checkAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const tab = req.nextUrl.searchParams.get("tab") || "overview";

    // Overview analytics
    if (tab === "overview" || tab === "analytics") {
      const forms = getFormSubmissions();
      const chats = getChatHistory();

      // Form analytics
      const formCounts: Record<string, number> = {};
      const last7Days: Record<string, number> = {};
      forms.forEach((f: FormSubmission) => {
        formCounts[f.formType] = (formCounts[f.formType] || 0) + 1;
        const day = f.submittedAt?.split("T")[0];
        if (day) last7Days[day] = (last7Days[day] || 0) + 1;
      });

      // Chat analytics
      const chatSessions = new Set(chats.map((c: ChatMessage) => c.sessionId)).size;

      // Neo4j stats (safe fallback)
      let neo4jStats = { totalUsers: 0, adminCount: 0, newsletterSubs: 0 };
      try { neo4jStats = await getDashboardStats(); } catch (e) { logger.error("admin:neo4jStats", e); }

      return NextResponse.json({
        stats: {
          totalForms: forms.length,
          totalChats: chats.length,
          chatSessions,
          formTypes: formCounts,
          submissionsByDay: Object.entries(last7Days).sort().slice(-14),
          ...neo4jStats,
        },
        recentForms: forms.slice(-10).reverse(),
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
      return NextResponse.json({ submissions: getFormSubmissions().reverse() });
    }

    // Chat tab
    if (tab === "chats") {
      const chats = getChatHistory();
      const sessions = new Map<string, ChatMessage[]>();
      chats.forEach((c: ChatMessage) => {
        const sid = c.sessionId || "unknown";
        if (!sessions.has(sid)) sessions.set(sid, []);
        sessions.get(sid)!.push(c);
      });
      return NextResponse.json({ 
        totalMessages: chats.length,
        totalSessions: sessions.size,
        sessions: Array.from(sessions.entries()).map(([id, msgs]) => ({
          sessionId: id,
          messages: msgs.length,
          lastMessage: msgs[msgs.length - 1]?.timestamp,
          preview: msgs.slice(-3),
        }))
      });
    }

    // Export CSV
    if (tab === "export") {
      const forms = getFormSubmissions();
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
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

/**
 * Performs admin actions such as adding loyalty points to a user.
 * @method POST
 * @request Body `{ action: "add-points", email: string, amount: number, reason: string }`
 * @response `{ success: true }` on success
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
      await addLoyaltyPoints(body.email, body.amount, body.reason);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
