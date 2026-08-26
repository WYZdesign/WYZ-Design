import Database from "better-sqlite3";
import { mkdirSync, existsSync } from "fs";
import { join } from "path";

let _db: any = null;
let _dbAvailable: boolean | null = null;

function getDb(): any {
  if (_dbAvailable === false) return null;
  if (_db) return _db;
  try {
    const dbPath = join(process.cwd(), "data", "bookkeeping.db");
    const dir = join(process.cwd(), "data");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    _db = new Database(dbPath);
    _db.pragma("journal_mode = WAL");
    initSchema(_db);
    _dbAvailable = true;
    return _db;
  } catch {
    _dbAvailable = false;
    return null;
  }
}

function initSchema(db: any) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      email TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      schedule_c_line TEXT DEFAULT '',
      type TEXT DEFAULT 'expense'
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income','expense')),
      amount REAL NOT NULL,
      client_id INTEGER REFERENCES clients(id),
      vendor TEXT DEFAULT '',
      category_id INTEGER REFERENCES categories(id),
      channel TEXT DEFAULT '',
      description TEXT DEFAULT '',
      business_personal TEXT DEFAULT 'business' CHECK(business_personal IN ('business','personal')),
      receipt_url TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
    CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
    CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
  `);

  // Seed default categories if empty
  const count = db.prepare("SELECT COUNT(*) as c FROM categories").get() as { c: number };
  if (count.c === 0) {
    const cats = [
      ["Advertising", "Line 8", "expense"],
      ["Car and Truck Expenses", "Line 9", "expense"],
      ["Commissions and Fees", "Line 10", "expense"],
      ["Contract Labor", "Line 11", "expense"],
      ["Depletion", "Line 12", "expense"],
      ["Depreciation", "Line 13", "expense"],
      ["Employee Benefits", "Line 14", "expense"],
      ["Insurance", "Line 15", "expense"],
      ["Interest (Mortgage)", "Line 16a", "expense"],
      ["Interest (Other)", "Line 16b", "expense"],
      ["Legal and Professional Services", "Line 17", "expense"],
      ["Office Expense", "Line 18", "expense"],
      ["Pension and Profit-Sharing", "Line 19", "expense"],
      ["Rent or Lease (Vehicles/Equipment)", "Line 20a", "expense"],
      ["Rent or Lease (Other)", "Line 20b", "expense"],
      ["Repairs and Maintenance", "Line 21", "expense"],
      ["Supplies", "Line 22", "expense"],
      ["Taxes and Licenses", "Line 23", "expense"],
      ["Travel", "Line 24a", "expense"],
      ["Meals", "Line 24b", "expense"],
      ["Utilities", "Line 25", "expense"],
      ["Wages", "Line 26", "expense"],
      ["Other Expenses", "Line 27", "expense"],
      ["Cost of Goods Sold", "Line 38", "expense"],
      ["Software / Subscriptions", "Line 27 (Other)", "expense"],
      ["AI Tools", "Line 27 (Other)", "expense"],
      ["Phone / Communications", "Line 25 (Utilities)", "expense"],
      ["Storage", "Line 20b (Rent)", "expense"],
      ["Equipment", "Line 13 (Depreciation)", "expense"],
      ["Client Income", "", "income"],
      ["Wix Payments", "", "income"],
      ["Stripe Payments", "", "income"],
      ["Consultation Fees", "", "income"],
      ["Other Income", "", "income"],
    ];
    const insert = db.prepare("INSERT INTO categories (name, schedule_c_line, type) VALUES (?, ?, ?)");
    for (const c of cats) insert.run(...c);
  }

  // Seed default clients if empty
  const clientCount = db.prepare("SELECT COUNT(*) as c FROM clients").get() as { c: number };
  if (clientCount.c === 0) {
    const clients = [
      ["FD Photo Studio", "sk@fdphotostudio.com", "Primary client — Sergey Kostikov"],
      ["Dominique McGrier-Howard", "", ""],
      ["Anthony Hill", "", ""],
      ["Willie Pole", "", ""],
      ["Artfinix Studios", "", "Paid via Zelle"],
      ["Wix Payment Clients", "", "One-off clients via wyzdesign.com"],
      ["Stripe Payment Clients", "", "One-off clients via Stripe"],
    ];
    const insert = db.prepare("INSERT INTO clients (name, email, notes) VALUES (?, ?, ?)");
    for (const c of clients) insert.run(...c);
  }
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

export function getTransactions(filters?: {
  type?: string;
  client_id?: number;
  category_id?: number;
  from?: string;
  to?: string;
  business_personal?: string;
  limit?: number;
  offset?: number;
}): Transaction[] {
  const db = getDb();
  if (!db) return [];
  let where = "WHERE 1=1";
  const params: any[] = [];

  if (filters?.type) { where += " AND t.type = ?"; params.push(filters.type); }
  if (filters?.client_id) { where += " AND t.client_id = ?"; params.push(filters.client_id); }
  if (filters?.category_id) { where += " AND t.category_id = ?"; params.push(filters.category_id); }
  if (filters?.from) { where += " AND t.date >= ?"; params.push(filters.from); }
  if (filters?.to) { where += " AND t.date <= ?"; params.push(filters.to); }
  if (filters?.business_personal) { where += " AND t.business_personal = ?"; params.push(filters.business_personal); }

  const limit = filters?.limit || 100;
  const offset = filters?.offset || 0;

  const rows = db.prepare(`
    SELECT t.*, c.name as client_name, cat.name as category_name
    FROM transactions t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN categories cat ON t.category_id = cat.id
    ${where}
    ORDER BY t.date DESC, t.id DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset) as Transaction[];

  return rows;
}

export function getTransactionById(id: number): Transaction | null {
  const db = getDb();
  if (!db) return null;
  const row = db.prepare(`
    SELECT t.*, c.name as client_name, cat.name as category_name
    FROM transactions t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN categories cat ON t.category_id = cat.id
    WHERE t.id = ?
  `).get(id) as Transaction | undefined;
  return row || null;
}

export function createTransaction(input: TransactionInput): Transaction {
  const db = getDb();
  if (!db) throw new Error("Database unavailable");
  const result = db.prepare(`
    INSERT INTO transactions (date, type, amount, client_id, vendor, category_id, channel, description, business_personal, receipt_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.date, input.type, input.amount,
    input.client_id ?? null, input.vendor || "",
    input.category_id ?? null, input.channel || "",
    input.description || "", input.business_personal || "business",
    input.receipt_url || ""
  );
  return getTransactionById(Number(result.lastInsertRowid))!;
}

export function updateTransaction(id: number, input: Partial<TransactionInput>): Transaction | null {
  const db = getDb();
  if (!db) return null;
  const existing = getTransactionById(id);
  if (!existing) return null;

  const fields: string[] = [];
  const params: any[] = [];

  if (input.date !== undefined) { fields.push("date = ?"); params.push(input.date); }
  if (input.type !== undefined) { fields.push("type = ?"); params.push(input.type); }
  if (input.amount !== undefined) { fields.push("amount = ?"); params.push(input.amount); }
  if (input.client_id !== undefined) { fields.push("client_id = ?"); params.push(input.client_id ?? null); }
  if (input.vendor !== undefined) { fields.push("vendor = ?"); params.push(input.vendor); }
  if (input.category_id !== undefined) { fields.push("category_id = ?"); params.push(input.category_id ?? null); }
  if (input.channel !== undefined) { fields.push("channel = ?"); params.push(input.channel); }
  if (input.description !== undefined) { fields.push("description = ?"); params.push(input.description); }
  if (input.business_personal !== undefined) { fields.push("business_personal = ?"); params.push(input.business_personal); }
  if (input.receipt_url !== undefined) { fields.push("receipt_url = ?"); params.push(input.receipt_url); }

  if (fields.length === 0) return existing;

  fields.push("updated_at = datetime('now')");
  params.push(id);

  db.prepare(`UPDATE transactions SET ${fields.join(", ")} WHERE id = ?`).run(...params);
  return getTransactionById(id);
}

export function deleteTransaction(id: number): boolean {
  const db = getDb();
  if (!db) return false;
  const result = db.prepare("DELETE FROM transactions WHERE id = ?").run(id);
  return result.changes > 0;
}

// ─── CLIENTS ───

export interface Client {
  id: number;
  name: string;
  email: string;
  notes: string;
  created_at: string;
}

export function getClients(): Client[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT * FROM clients ORDER BY name").all() as Client[];
}

export function createClient(name: string, email = "", notes = ""): Client {
  const db = getDb();
  if (!db) throw new Error("Database unavailable");
  const result = db.prepare("INSERT INTO clients (name, email, notes) VALUES (?, ?, ?)").run(name, email, notes);
  return db.prepare("SELECT * FROM clients WHERE id = ?").get(result.lastInsertRowid) as Client;
}

// ─── CATEGORIES ───

export interface Category {
  id: number;
  name: string;
  schedule_c_line: string;
  type: string;
}

export function getCategories(type?: string): Category[] {
  const db = getDb();
  if (!db) return [];
  if (type) return db.prepare("SELECT * FROM categories WHERE type = ? ORDER BY name").all(type) as Category[];
  return db.prepare("SELECT * FROM categories ORDER BY type, name").all() as Category[];
}

// ─── SUMMARY / SCHEDULE C ───

export interface FinancialSummary {
  year: number;
  total_income: number;
  total_expenses: number;
  net_profit: number;
  income_by_client: { client: string; amount: number }[];
  expenses_by_category: { category: string; schedule_c_line: string; amount: number }[];
  income_by_channel: { channel: string; amount: number }[];
  monthly_income: { month: string; amount: number }[];
  monthly_expenses: { month: string; amount: number }[];
  transaction_count: number;
}

export function getFinancialSummary(year: number): FinancialSummary {
  const db = getDb();
  if (!db) return { year, total_income: 0, total_expenses: 0, net_profit: 0, income_by_client: [], expenses_by_category: [], income_by_channel: [], monthly_income: [], monthly_expenses: [], transaction_count: 0 };
  const from = `${year}-01-01`;
  const to = `${year}-12-31`;

  const totals = db.prepare(`
    SELECT type, SUM(amount) as total
    FROM transactions
    WHERE date >= ? AND date <= ? AND business_personal = 'business'
    GROUP BY type
  `).all(from, to) as { type: string; total: number }[];

  const income = totals.find(t => t.type === "income")?.total || 0;
  const expenses = totals.find(t => t.type === "expense")?.total || 0;

  const income_by_client = db.prepare(`
    SELECT COALESCE(c.name, 'Unknown') as client, SUM(t.amount) as amount
    FROM transactions t
    LEFT JOIN clients c ON t.client_id = c.id
    WHERE t.type = 'income' AND t.date >= ? AND t.date <= ? AND t.business_personal = 'business'
    GROUP BY c.name
    ORDER BY amount DESC
  `).all(from, to) as { client: string; amount: number }[];

  const expenses_by_category = db.prepare(`
    SELECT COALESCE(cat.name, 'Uncategorized') as category, COALESCE(cat.schedule_c_line, '') as schedule_c_line, SUM(t.amount) as amount
    FROM transactions t
    LEFT JOIN categories cat ON t.category_id = cat.id
    WHERE t.type = 'expense' AND t.date >= ? AND t.date <= ? AND t.business_personal = 'business'
    GROUP BY cat.name
    ORDER BY amount DESC
  `).all(from, to) as { category: string; schedule_c_line: string; amount: number }[];

  const income_by_channel = db.prepare(`
    SELECT COALESCE(channel, 'Unknown') as channel, SUM(amount) as amount
    FROM transactions
    WHERE type = 'income' AND date >= ? AND date <= ? AND business_personal = 'business'
    GROUP BY channel
    ORDER BY amount DESC
  `).all(from, to) as { channel: string; amount: number }[];

  const monthly_income = db.prepare(`
    SELECT substr(date, 1, 7) as month, SUM(amount) as amount
    FROM transactions
    WHERE type = 'income' AND date >= ? AND date <= ? AND business_personal = 'business'
    GROUP BY month ORDER BY month
  `).all(from, to) as { month: string; amount: number }[];

  const monthly_expenses = db.prepare(`
    SELECT substr(date, 1, 7) as month, SUM(amount) as amount
    FROM transactions
    WHERE type = 'expense' AND date >= ? AND date <= ? AND business_personal = 'business'
    GROUP BY month ORDER BY month
  `).all(from, to) as { month: string; amount: number }[];

  const txCount = db.prepare(`
    SELECT COUNT(*) as c FROM transactions
    WHERE date >= ? AND date <= ? AND business_personal = 'business'
  `).get(from, to) as { c: number };

  return {
    year,
    total_income: income,
    total_expenses: expenses,
    net_profit: income - expenses,
    income_by_client,
    expenses_by_category,
    income_by_channel,
    monthly_income,
    monthly_expenses,
    transaction_count: txCount.c,
  };
}

// ─── CSV EXPORT ───

export function exportTransactionsCSV(filters?: {
  type?: string;
  from?: string;
  to?: string;
  business_personal?: string;
}): string {
  const txns = getTransactions({ ...filters, limit: 10000 });
  const headers = ["Date", "Type", "Amount", "Client", "Vendor", "Category", "Schedule C Line", "Channel", "Description", "Business/Personal"];
  const rows = [headers.join(",")];
  for (const t of txns) {
    rows.push([
      t.date, t.type, t.amount.toFixed(2),
      t.client_name || "", t.vendor || "",
      t.category_name || "", "",
      t.channel || "", t.description || "",
      t.business_personal,
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
  }
  return rows.join("\n");
}

export function exportScheduleC(year: number): string {
  const summary = getFinancialSummary(year);
  const lines = [
    `Schedule C Summary — ${year}`,
    `WYZ DESIGN LLC (EIN: 87-4602681)`,
    ``,
    `GROSS RECEIPTS (Line 1)`,
    `  Total Income: $${summary.total_income.toFixed(2)}`,
    ``,
    `EXPENSES`,
  ];
  for (const e of summary.expenses_by_category) {
    lines.push(`  ${e.schedule_c_line ? e.schedule_c_line + " " : ""}${e.category}: $${e.amount.toFixed(2)}`);
  }
  lines.push(`  TOTAL EXPENSES: $${summary.total_expenses.toFixed(2)}`);
  lines.push(``);
  lines.push(`NET PROFIT (Line 31): $${summary.net_profit.toFixed(2)}`);
  lines.push(``);
  lines.push(`INCOME BY CLIENT`);
  for (const i of summary.income_by_client) {
    lines.push(`  ${i.client}: $${i.amount.toFixed(2)}`);
  }
  lines.push(``);
  lines.push(`INCOME BY CHANNEL`);
  for (const i of summary.income_by_channel) {
    lines.push(`  ${i.channel}: $${i.amount.toFixed(2)}`);
  }
  return lines.join("\n");
}
