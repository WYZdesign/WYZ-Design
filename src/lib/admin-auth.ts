import { auth } from "@/app/api/auth/[...nextauth]/route";

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin(): Promise<{ ok: true; email: string } | { ok: false; response: Response }> {
  const session = await auth();
  const email = (session?.user?.email || "").toLowerCase();
  const admins = getAdminEmails();
  if (!email || admins.length === 0 || !admins.includes(email)) {
    return { ok: false, response: new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } }) };
  }
  return { ok: true, email };
}
