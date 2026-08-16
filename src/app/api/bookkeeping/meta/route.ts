import { NextRequest, NextResponse } from "next/server";
import { getCategories, getClients } from "@/lib/bookkeeping";

/**
 * GET /api/bookkeeping/meta — get categories and clients for form dropdowns
 */
export async function GET() {
  try {
    const categories = getCategories();
    const clients = getClients();
    return NextResponse.json({ categories, clients });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
