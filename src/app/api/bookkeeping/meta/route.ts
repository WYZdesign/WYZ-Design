import { NextResponse } from "next/server";
import { getCategories, getClients } from "@/lib/bookkeeping";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * GET /api/bookkeeping/meta — get categories and clients for form dropdowns
 */
export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin.ok) return admin.response;
    const categories = await getCategories();
    const clients = await getClients();
    return NextResponse.json({ categories, clients });
  } catch (e: unknown) {
    return NextResponse.json({ error: "Failed to load metadata" }, { status: 500 });
  }
}
