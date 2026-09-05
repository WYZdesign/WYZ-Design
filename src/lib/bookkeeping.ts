import { getServiceClient } from "@/lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

let _sb: SupabaseClient | null = null;
function getSb(): SupabaseClient {
  if (_sb) return _sb;
  _sb = getServiceClient();
  return _sb;
}

// ─── SCHEMA (run once via Supabase SQL editor or migration) ───
// The following DDL must be applied to your Supabase project before
// the bookkeeping feature works. Paste into Supabase SQL Editor:
/*
CREATE TABLE IF NOT EXISTS bk_clients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  email TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bk_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  schedule_c_line TEXT DEFAULT '',
  type TEXT DEFAULT 'expense'
);

CREATE TABLE IF NOT EXISTS bk_transactions (
  id BIGSERIAL PRIMARY KEY,
  date TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('income','expense')),
  amount NUMERIC NOT NULL,
  client_id BIGINT REFERENCES bk_clients(id),
  vendor TEXT DEFAULT '',
  category_id BIGINT REFERENCES bk_categories(id),
  channel TEXT DEFAULT '',
  description TEXT DEFAULT '',
  business_personal TEXT DEFAULT 'business' CHECK(business_personal IN ('business','personal')),
  receipt_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bk_tx_date ON bk_transactions(date);
CREATE INDEX IF NOT EXISTS idx_bk_tx_type ON bk_transactions(type);
CREATE INDEX IF NOT EXISTS idx_bk_tx_cat ON bk_transactions(category_id);
*/

async function seedDefaults(sb: SupabaseClient) {
  const { count } = await sb.from("bk_categories").select("id", { count: "exact", head: true }).single();
  if ((count || 0) > 0) return;

  const categories = [
    ["Advertising", "Line 8", "expense"], ["Car and Truck Expenses", "Line 9", "expense"],
    ["Commissions and Fees", "Line 10", "expense"], ["Contract Labor", "Line 11", "expense"],
    ["Depreciation", "Line 13", "expense"], ["Insurance", "Line 15", "expense"],
    ["Interest (Other)", "Line 16b", "expense"], ["Legal and Professional Services", "Line 17", "expense"],
    ["Office Expense", "Line 18", "expense"], ["Rent or Lease (Other)", "Line 20b", "expense"],
    ["Repairs and Maintenance", "Line 21", "expense"], ["Supplies", "Line 22", "expense"],
    ["Taxes and Licenses", "Line 23", "expense"], ["Travel", "Line 24a", "expense"],
    ["Meals", "Line 24b", "expense"], ["Utilities", "Line 25", "expense"],
    ["Wages", "Line 26", "expense"], ["Other Expenses", "Line 27", "expense"],
    ["Software / Subscriptions", "Line 27 (Other)", "expense"],
    ["AI Tools", "Line 27 (Other)", "expense"],
    ["Phone / Communications", "Line 25 (Utilities)", "expense"],
    ["Equipment", "Line 13 (Depreciation)", "expense"],
    ["Client Income", "", "income"], ["Wix Payments", "", "income"],
    ["Stripe Payments", "", "income"], ["Consultation Fees", "", "income"],
    ["Other Income", "", "income"],
  ];
  await sb.from("bk_categories").insert(categories.map(([name, line, type]) => ({ name, schedule_c_line: line, type })));

  const clients = [
    ["FD Photo Studio", "sk@fdphotostudio.com", "Primary client"],
    ["Dominique McGrier-Howard", "", ""], ["Anthony Hill", "", ""],
    ["Artfinix Studios", "", "Paid via Zelle"],
    ["Wix Payment Clients", "", "One-off via wyzdesign.com"],
    ["Stripe Payment Clients", "", "One-off via Stripe"],
  ];
  await sb.from("bk_clients").insert(clients.map(([name, email, notes]) => ({ name, email, notes })));
}

// ─── TRANSACTIONS ───

export interface Transaction {
  id: number;
  date: string;
  type: "income" | "expense";
  amount: number;
  client_id: number | null;
  client_name?: string;
  vendor: string;
  category_id: number | null;
  category_name?: string;
  channel: string;
  description: string;
  business_personal: "business" | "personal";
  receipt_url: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionInput {
  date: string;
  type: "income" | "expense";
  amount: number;
  client_id?: number | null;
  vendor?: string;
  category_id?: number | null;
  channel?: string;
  description?: string;
  business_personal?: "business" | "personal";
  receipt_url?: string;
}

export async function getTransactions(filters?: {
  type?: string; client_id?: number; category_id?: number;
  from?: string; to?: string; business_personal?: string;
  limit?: number; offset?: number;
}): Promise<Transaction[]> {
  try {
    const sb = getSb();
    await seedDefaults(sb);
    let q = sb.from("bk_transactions").select("*, bk_clients(name), bk_categories(name)").order("date", { ascending: false });
    if (filters?.type) q = q.eq("type", filters.type);
    if (filters?.client_id) q = q.eq("client_id", filters.client_id);
    if (filters?.category_id) q = q.eq("category_id", filters.category_id);
    if (filters?.from) q = q.gte("date", filters.from);
    if (filters?.to) q = q.lte("date", filters.to);
    if (filters?.business_personal) q = q.eq("business_personal", filters.business_personal);
    q = q.range(filters?.offset || 0, (filters?.offset || 0) + (filters?.limit || 100) - 1);
    const { data, error } = await q;
    if (error) throw error;
    return (data || []).map((r: any) => ({
      ...r,
      client_name: r.bk_clients?.name || null,
      category_name: r.bk_categories?.name || null,
      bk_clients: undefined, bk_categories: undefined,
    }));
  } catch { return []; }
}

export async function getTransactionById(id: number): Promise<Transaction | null> {
  try {
    const sb = getSb();
    const { data, error } = await sb.from("bk_transactions").select("*, bk_clients(name), bk_categories(name)").eq("id", id).single();
    if (error || !data) return null;
    return {
      ...data,
      client_name: (data as any).bk_clients?.name || null,
      category_name: (data as any).bk_categories?.name || null,
      bk_clients: undefined, bk_categories: undefined,
    };
  } catch { return null; }
}

export async function createTransaction(input: TransactionInput): Promise<Transaction> {
  const sb = getSb();
  await seedDefaults(sb);
  const { data, error } = await sb.from("bk_transactions").insert({
    date: input.date, type: input.type, amount: input.amount,
    client_id: input.client_id ?? null, vendor: input.vendor || "",
    category_id: input.category_id ?? null, channel: input.channel || "",
    description: input.description || "", business_personal: input.business_personal || "business",
    receipt_url: input.receipt_url || "",
  }).select().single();
  if (error) throw error;
  const tx = await getTransactionById(data.id);
  if (!tx) throw new Error("Created transaction not found");
  return tx;
}

export async function updateTransaction(id: number, input: Partial<TransactionInput>): Promise<Transaction | null> {
  const sb = getSb();
  const existing = await getTransactionById(id);
  if (!existing) return null;
  const updates: Record<string, any> = { updated_at: new Date().toISOString() };
  for (const [k, v] of Object.entries(input)) {
    if (v !== undefined) updates[k] = v;
  }
  const { error } = await sb.from("bk_transactions").update(updates).eq("id", id);
  if (error) return null;
  return getTransactionById(id);
}

export async function deleteTransaction(id: number): Promise<boolean> {
  const sb = getSb();
  const { error } = await sb.from("bk_transactions").delete().eq("id", id);
  return !error;
}

// ─── CLIENTS ───

export interface Client { id: number; name: string; email: string; notes: string; created_at: string; }

export async function getClients(): Promise<Client[]> {
  try {
    const sb = getSb();
    await seedDefaults(sb);
    const { data } = await sb.from("bk_clients").select("*").order("name");
    return data || [];
  } catch { return []; }
}

export async function createClient(name: string, email = "", notes = ""): Promise<Client> {
  const sb = getSb();
  const { data, error } = await sb.from("bk_clients").insert({ name, email, notes }).select().single();
  if (error) throw error;
  return data;
}

// ─── CATEGORIES ───

export interface Category { id: number; name: string; schedule_c_line: string; type: string; }

export async function getCategories(type?: string): Promise<Category[]> {
  try {
    const sb = getSb();
    await seedDefaults(sb);
    let q = sb.from("bk_categories").select("*").order("name");
    if (type) q = q.eq("type", type);
    const { data } = await q;
    return data || [];
  } catch { return []; }
}

// ─── SUMMARY / SCHEDULE C ───

export interface FinancialSummary {
  year: number; total_income: number; total_expenses: number; net_profit: number;
  income_by_client: { client: string; amount: number }[];
  expenses_by_category: { category: string; schedule_c_line: string; amount: number }[];
  income_by_channel: { channel: string; amount: number }[];
  monthly_income: { month: string; amount: number }[];
  monthly_expenses: { month: string; amount: number }[];
  transaction_count: number;
}

const EMPTY_SUMMARY = (year: number): FinancialSummary => ({
  year, total_income: 0, total_expenses: 0, net_profit: 0,
  income_by_client: [], expenses_by_category: [], income_by_channel: [],
  monthly_income: [], monthly_expenses: [], transaction_count: 0,
});

export async function getFinancialSummary(year: number): Promise<FinancialSummary> {
  try {
    const sb = getSb();
    await seedDefaults(sb);
    const from = `${year}-01-01`;
    const to = `${year}-12-31`;

    // Get all business transactions for the year
    const { data: txns } = await sb.from("bk_transactions")
      .select("type, amount, date, channel, client_id, category_id, bk_clients(name), bk_categories(name, schedule_c_line)")
      .gte("date", from).lte("date", to).eq("business_personal", "business");

    if (!txns?.length) return EMPTY_SUMMARY(year);

    let total_income = 0, total_expenses = 0;
    const byClient: Record<string, number> = {};
    const byCategory: Record<string, { amount: number; line: string }> = {};
    const byChannel: Record<string, number> = {};
    const monthlyInc: Record<string, number> = {};
    const monthlyExp: Record<string, number> = {};

    for (const t of txns as any[]) {
      const amtCents = Math.round(Number(t.amount) * 100);
      const month = t.date?.slice(0, 7) || "";
      if (t.type === "income") {
        total_income += amtCents;
        const client = t.bk_clients?.name || "Unknown";
        byClient[client] = (byClient[client] || 0) + amtCents;
        const ch = t.channel || "Unknown";
        byChannel[ch] = (byChannel[ch] || 0) + amtCents;
        monthlyInc[month] = (monthlyInc[month] || 0) + amtCents;
      } else {
        total_expenses += amtCents;
        const cat = t.bk_categories?.name || "Uncategorized";
        const line = t.bk_categories?.schedule_c_line || "";
        byCategory[cat] = { amount: (byCategory[cat]?.amount || 0) + amtCents, line };
        monthlyExp[month] = (monthlyExp[month] || 0) + amtCents;
      }
    }

    const toDollars = (cents: number) => Math.round(cents) / 100;

    return {
      year, total_income: toDollars(total_income), total_expenses: toDollars(total_expenses),
      net_profit: toDollars(total_income - total_expenses),
      income_by_client: Object.entries(byClient).map(([client, cents]) => ({ client, amount: toDollars(cents) })).sort((a, b) => b.amount - a.amount),
      expenses_by_category: Object.entries(byCategory).map(([category, v]) => ({ category, schedule_c_line: v.line, amount: toDollars(v.amount) })).sort((a, b) => b.amount - a.amount),
      income_by_channel: Object.entries(byChannel).map(([channel, cents]) => ({ channel, amount: toDollars(cents) })).sort((a, b) => b.amount - a.amount),
      monthly_income: Object.entries(monthlyInc).sort().map(([month, cents]) => ({ month, amount: toDollars(cents) })),
      monthly_expenses: Object.entries(monthlyExp).sort().map(([month, cents]) => ({ month, amount: toDollars(cents) })),
      transaction_count: txns.length,
    };
  } catch { return EMPTY_SUMMARY(year); }
}

// ─── CSV EXPORT ───

export async function exportTransactionsCSV(filters?: {
  type?: string; from?: string; to?: string; business_personal?: string;
}): Promise<string> {
  const txns = await getTransactions({ ...filters, limit: 10000 });
  const headers = ["Date", "Type", "Amount", "Client", "Vendor", "Category", "Schedule C Line", "Channel", "Description", "Business/Personal"];
  const rows = [headers.join(",")];
  for (const t of txns) {
    rows.push([
      t.date, t.type, (Number(t.amount) / 100).toFixed(2),
      t.client_name || "", t.vendor || "", t.category_name || "", "",
      t.channel || "", t.description || "", t.business_personal,
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
  }
  return rows.join("\n");
}

export async function exportScheduleC(year: number): Promise<string> {
  const summary = await getFinancialSummary(year);
  const lines = [
    `Schedule C Summary: ${year}`, `WYZ DESIGN LLC (EIN: 87-4602681)`, ``,
    `GROSS RECEIPTS (Line 1)`, `  Total Income: $${summary.total_income.toFixed(2)}`, ``, `EXPENSES`,
  ];
  for (const e of summary.expenses_by_category) {
    lines.push(`  ${e.schedule_c_line ? e.schedule_c_line + " " : ""}${e.category}: $${e.amount.toFixed(2)}`);
  }
  lines.push(`  TOTAL EXPENSES: $${summary.total_expenses.toFixed(2)}`, ``, `NET PROFIT (Line 31): $${summary.net_profit.toFixed(2)}`, ``, `INCOME BY CLIENT`);
  for (const i of summary.income_by_client) lines.push(`  ${i.client}: $${i.amount.toFixed(2)}`);
  lines.push(``, `INCOME BY CHANNEL`);
  for (const i of summary.income_by_channel) lines.push(`  ${i.channel}: $${i.amount.toFixed(2)}`);
  return lines.join("\n");
}
