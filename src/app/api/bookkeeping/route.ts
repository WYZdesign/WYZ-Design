import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import {
  getTransactions, createTransaction, updateTransaction, deleteTransaction,
  getFinancialSummary, exportTransactionsCSV, exportScheduleC,
  getTransactionById, getCategories, getClients,
} from "@/lib/bookkeeping";

function isAdmin(session: any): boolean {
  const email = (session?.user?.email || "").toLowerCase();
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
  return admins.includes(email);
}

/**
 * GET /api/bookkeeping — list transactions, summary, or export CSV/Schedule C
 * @query tab — transactions | summary | csv | schedule-c
 * @query type — income | expense (filter for transactions)
 * @query from, to — date range
 * @query client_id, category_id — filters
 * @query year — for summary/schedule-c (default current year)
 * @query business_personal — business | personal
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const tab = req.nextUrl.searchParams.get("tab") || "transactions";
    const sp = req.nextUrl.searchParams;

    if (tab === "summary") {
      const year = parseInt(sp.get("year") || String(new Date().getFullYear()));
      return NextResponse.json(getFinancialSummary(year));
    }

    if (tab === "csv") {
      const csv = exportTransactionsCSV({
        type: sp.get("type") || undefined,
        from: sp.get("from") || undefined,
        to: sp.get("to") || undefined,
        business_personal: sp.get("business_personal") || undefined,
      });
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=wyz-transactions-${Date.now()}.csv`,
        },
      });
    }

    if (tab === "schedule-c") {
      const year = parseInt(sp.get("year") || String(new Date().getFullYear()));
      const csv = exportScheduleC(year);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/plain",
          "Content-Disposition": `attachment; filename=schedule-c-${year}.txt`,
        },
      });
    }

    // Default: transactions list
    const transactions = getTransactions({
      type: sp.get("type") || undefined,
      client_id: sp.get("client_id") ? parseInt(sp.get("client_id")!) : undefined,
      category_id: sp.get("category_id") ? parseInt(sp.get("category_id")!) : undefined,
      from: sp.get("from") || undefined,
      to: sp.get("to") || undefined,
      business_personal: sp.get("business_personal") || undefined,
      limit: parseInt(sp.get("limit") || "100"),
      offset: parseInt(sp.get("offset") || "0"),
    });
    return NextResponse.json({ transactions });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/**
 * POST /api/bookkeeping — create a transaction
 * Body: { date, type, amount, client_id?, vendor?, category_id?, channel?, description?, business_personal? }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    if (!body.date || !body.type || body.amount === undefined) {
      return NextResponse.json({ error: "date, type, and amount are required" }, { status: 400 });
    }

    // Resolve client_name → client_id
    let client_id = body.client_id || null;
    if (!client_id && body.client_name) {
      const clients = getClients();
      const match = clients.find(c => c.name.toLowerCase() === body.client_name.toLowerCase());
      if (match) client_id = match.id;
    }

    // Resolve category name → category_id
    let category_id = body.category_id || null;
    if (!category_id && body.category) {
      const categories = getCategories();
      const match = categories.find(c => c.name.toLowerCase() === body.category.toLowerCase());
      if (match) category_id = match.id;
    }

    const tx = createTransaction({
      date: body.date,
      type: body.type,
      amount: parseFloat(body.amount),
      client_id: client_id,
      vendor: body.vendor || "",
      category_id: category_id,
      channel: body.channel || "",
      description: body.description || "",
      business_personal: body.business_personal || "business",
      receipt_url: body.receipt_url || "",
    });

    return NextResponse.json(tx, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/**
 * PUT /api/bookkeeping?id=123 — update a transaction
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const id = parseInt(req.nextUrl.searchParams.get("id") || "0");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const body = await req.json();
    const tx = updateTransaction(id, body);
    if (!tx) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(tx);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/**
 * DELETE /api/bookkeeping?id=123 — delete a transaction
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const id = parseInt(req.nextUrl.searchParams.get("id") || "0");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const deleted = deleteTransaction(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
