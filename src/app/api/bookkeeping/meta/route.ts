import { NextResponse } from "next/server";
import { getCategories, getClients } from "@/lib/bookkeeping";
import { auth } from "@/app/api/auth/[...nextauth]/route";

function isAdmin(session: any): boolean {
  const email = (session?.user?.email || "").toLowerCase();
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
  return admins.includes(email);
}

/**
 * GET /api/bookkeeping/meta — get categories and clients for form dropdowns
 */
export async function GET() {
  try {
    const session = await auth();
    if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const categories = await getCategories();
    const clients = await getClients();
    return NextResponse.json({ categories, clients });
  } catch (e: unknown) {
    return NextResponse.json({ error: "Failed to load metadata" }, { status: 500 });
  }
}
