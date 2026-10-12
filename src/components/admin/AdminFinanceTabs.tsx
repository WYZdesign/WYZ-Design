"use client";

// Bookkeeping/finance tab components extracted from src/app/admin/page.tsx
// (oversized-file split, board S1). Moved verbatim, no behavior change.

import { useState, useEffect } from "react";
import { logger } from "@/lib/logger";
import type { Transaction, FinancialSummary, Category, Client } from "@/lib/types/admin";
import { KpiCard, SectionTitle, Empty } from "@/components/admin/AdminShared";

export function BookkeepingDashboard({ data, onRefresh }: { data: FinancialSummary; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState<"income" | "expense" | null>(null);
  if (!data?.year) return <Empty>Loading bookkeeping...</Empty>;
return (
     <div className="space-y-8">
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <KpiCard label="Gross Income" value={data.total_income} color="#DF3131" icon="$" format="currency" />
         <KpiCard label="Total Expenses" value={data.total_expenses} color="#C00000" icon="$" format="currency" />
         <KpiCard label="Net Profit" value={data.net_profit} color="#C9A227" icon="$" format="currency" />
         <KpiCard label="Transactions" value={data.transaction_count} color="#C9A227" icon="◇" />
       </div>

       {/* Monthly Income vs Expenses Bar Chart */}
       {data.monthly_income?.length > 0 && (
         <div className="bg-white/5 border border-white/10 p-6">
           <SectionTitle>Monthly Income vs Expenses</SectionTitle>
           <div className="flex items-end gap-2 h-48 mt-4">
             {data.monthly_income.map((m) => {
               const exp = data.monthly_expenses?.find(e => e.month === m.month)?.amount || 0;
               const maxVal = Math.max(...data.monthly_income.map(x => x.amount), ...data.monthly_expenses.map(x => x.amount), 1);
               const incH = (m.amount / maxVal) * 100;
               const expH = (exp / maxVal) * 100;
               return (
                 <div key={m.month} className="flex flex-col items-center gap-1 flex-1 group">
                   <div className="flex gap-0.5 h-full">
                     <div className="w-4 bg-[#DF3131] rounded-t transition-all duration-500 group-hover:bg-[#DF3131]/70" style={{ height: `${incH}%` }} />
                     <div className="w-4 bg-[#C00000] rounded-t transition-all duration-500 group-hover:bg-[#C00000]/70" style={{ height: `${expH}%` }} />
                   </div>
                   <span className="text-[8px] text-white/60 text-center">{m.month.slice(5)}</span>
                 </div>
               );
             })}
           </div>
         </div>
       )}
       <div className="flex gap-3 flex-wrap">
        <button onClick={() => setShowForm("income")} className="px-5 py-3 bg-[#DF3131]/20 text-[#DF3131] border border-[#DF3131]/30 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-[#DF3131]/30 transition-all">+ Log Income</button>
        <button onClick={() => setShowForm("expense")} className="px-5 py-3 bg-[#C00000]/20 text-[#C00000] border border-[#C00000]/30 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-[#C00000]/30 transition-all">+ Log Expense</button>
        <a href="/api/bookkeeping?tab=csv&type=business" className="px-5 py-3 bg-white/5 text-white/50 border border-white/10 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-white/10 transition-all inline-block">\u2193 Export CSV</a>
        <a href="/api/bookkeeping?tab=schedule-c" className="px-5 py-3 bg-white/5 text-white/50 border border-white/10 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-white/10 transition-all inline-block">\u2193 Schedule C</a>
      </div>
      {showForm && <TransactionForm type={showForm} onClose={() => { setShowForm(null); onRefresh(); }} />}
      <RevenueByCategoryCard year={data.year} />
      {data.income_by_client?.length > 0 && (
        <div>
          <SectionTitle>Income by Client</SectionTitle>
          <div className="bg-white/5 border border-white/10 overflow-hidden">
            {data.income_by_client.map((c, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0">
                <span className="text-[13px] text-white/70">{c.client}</span>
                <span className="text-[14px] font-heading font-bold text-[#DF3131]">${c.amount.toLocaleString(undefined,{minimumFractionDigits:2})}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.expenses_by_category?.length > 0 && (
        <div>
          <SectionTitle>Expenses by Category</SectionTitle>
          <div className="bg-white/5 border border-white/10 overflow-hidden">
            {data.expenses_by_category.map((c, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0">
                <div>
                  <span className="text-[13px] text-white/70">{c.category}</span>
                  {c.schedule_c_line && <span className="text-[10px] text-white/50 ml-2">{c.schedule_c_line}</span>}
                </div>
                <span className="text-[14px] font-heading font-bold text-[#C00000]">${c.amount.toLocaleString(undefined,{minimumFractionDigits:2})}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.monthly_income?.length > 0 && (
        <div>
          <SectionTitle>Monthly Revenue</SectionTitle>
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="flex items-end gap-2 h-40">
              {data.monthly_income.map((m) => {
                const max = Math.max(...data.monthly_income.map(x => x.amount));
                const h = max > 0 ? (m.amount / max) * 100 : 10;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[10px] text-white/60 group-hover:text-white/80">${(m.amount/1000).toFixed(1)}k</span>
                    <div className="w-full bg-[#DF3131]/40 group-hover:bg-[#DF3131] transition-colors rounded-t" style={{ height: `${h}%` }} />
                    <span className="text-[9px] text-white/50">{m.month.slice(5)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



export function RevenueByCategoryCard({ year }: { year: number }) {
  const [rows, setRows] = useState<{ category: string; amount: number }[] | null>(null);

  useEffect(() => {
    fetch("/api/bookkeeping?tab=transactions&type=income&limit=10000")
      .then(r => r.json())
      .then((d: { transactions?: Pick<Transaction, "date" | "amount" | "category_name">[] }) => {
        const byCategory: Record<string, number> = {};
        for (const t of d.transactions || []) {
          if (String(t.date || "").slice(0, 4) !== String(year)) continue;
          const cat = t.category_name || "Uncategorized";
          byCategory[cat] = (byCategory[cat] || 0) + Number(t.amount);
        }
        setRows(Object.entries(byCategory).map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount));
      })
      .catch(e => { logger.warn("admin-bookkeeping", `Revenue fetch failed: ${e}`); setRows([]); });
  }, [year]);

  if (!rows) return null;
  return (
    <div>
      <SectionTitle>Revenue by Category</SectionTitle>
      {rows.length === 0 ? (
        <Empty>No transactions yet</Empty>
      ) : (
        <div className="bg-white/5 border border-white/10 p-6 space-y-4">
          {(() => {
            const max = Math.max(...rows.map(r => r.amount));
            return rows.map(r => (
              <div key={r.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] text-white/70">{r.category}</span>
                  <span className="text-[14px] font-heading font-bold text-[#DF3131]">${r.amount.toLocaleString(undefined,{minimumFractionDigits:2})}</span>
                </div>
                <div className="h-2 w-full rounded overflow-hidden bg-gray-100 dark:bg-[#444]">
                  <div className="h-full rounded" style={{ width: `${max > 0 ? Math.max((r.amount / max) * 100, 2) : 100}%`, backgroundColor: "#DF3131" }} />
                </div>
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  );
}

// ─── INCOME TAB ───
export function IncomeTab({ data, onRefresh }: { data: { transactions: Transaction[] }; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const txns = data?.transactions || [];
  const total = txns.reduce((a, t) => a + t.amount, 0);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-[24px] font-heading font-bold text-[#DF3131]">${total.toLocaleString(undefined,{minimumFractionDigits:2})}</p>
          <p className="text-[11px] text-white/50">{txns.length} transactions</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowForm(!showForm)} className="px-5 py-3 bg-[#DF3131]/20 text-[#DF3131] border border-[#DF3131]/30 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-[#DF3131]/30 transition-all">+ Log Income</button>
          <a href="/api/bookkeeping?tab=csv&type=income" className="px-5 py-3 bg-white/5 text-white/50 border border-white/10 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-white/10 transition-all inline-block">\u2193 CSV</a>
        </div>
      </div>
      {showForm && <TransactionForm type="income" onClose={() => { setShowForm(false); onRefresh(); }} />}
      <TransactionTable transactions={txns} onRefresh={onRefresh} />
    </div>
  );
}

// ─── EXPENSES TAB ───
export function ExpensesTab({ data, onRefresh }: { data: { transactions: Transaction[] }; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const txns = data?.transactions || [];
  const total = txns.reduce((a, t) => a + t.amount, 0);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-[24px] font-heading font-bold text-[#C00000]">${total.toLocaleString(undefined,{minimumFractionDigits:2})}</p>
          <p className="text-[11px] text-white/50">{txns.length} transactions</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowForm(!showForm)} className="px-5 py-3 bg-[#C00000]/20 text-[#C00000] border border-[#C00000]/30 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-[#C00000]/30 transition-all">+ Log Expense</button>
          <a href="/api/bookkeeping?tab=csv&type=expense" className="px-5 py-3 bg-white/5 text-white/50 border border-white/10 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-white/10 transition-all inline-block">\u2193 CSV</a>
        </div>
      </div>
      {showForm && <TransactionForm type="expense" onClose={() => { setShowForm(false); onRefresh(); }} />}
      <TransactionTable transactions={txns} onRefresh={onRefresh} />
    </div>
  );
}

// ─── REPORTS TAB ───
export function ReportsTab({ data }: { data: FinancialSummary }) {
  if (!data?.year) return <Empty>No data</Empty>;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Gross Income" value={data.total_income} color="#DF3131" icon="$" format="currency" />
        <KpiCard label="Total Expenses" value={data.total_expenses} color="#C00000" icon="$" format="currency" />
        <KpiCard label="Net Profit" value={data.net_profit} color="#C9A227" icon="$" format="currency" />
        <KpiCard label="Transactions" value={data.transaction_count} color="#C9A227" icon="◇" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.income_by_channel?.length > 0 && (
          <div>
            <SectionTitle>Income by Channel</SectionTitle>
            <div className="bg-white/5 border border-white/10 overflow-hidden">
              {data.income_by_channel.map((c, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0">
                  <span className="text-[13px] text-white/70 capitalize">{c.channel}</span>
                  <span className="text-[14px] font-heading font-bold text-[#DF3131]">${c.amount.toLocaleString(undefined,{minimumFractionDigits:2})}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.income_by_client?.length > 0 && (
          <div>
            <SectionTitle>Income by Client</SectionTitle>
            <div className="bg-white/5 border border-white/10 overflow-hidden">
              {data.income_by_client.map((c, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0">
                  <span className="text-[13px] text-white/70">{c.client}</span>
                  <span className="text-[14px] font-heading font-bold text-[#DF3131]">${c.amount.toLocaleString(undefined,{minimumFractionDigits:2})}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {data.monthly_income?.length > 0 && (
        <div>
          <SectionTitle>Monthly Breakdown</SectionTitle>
          <div className="bg-white/5 border border-white/10 overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-white/10">
                <th className="px-5 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Month</th>
                <th className="px-5 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase text-right">Income</th>
                <th className="px-5 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase text-right">Expenses</th>
              </tr></thead>
              <tbody>
                {data.monthly_income.map((m) => {
                  const exp = data.monthly_expenses?.find(e => e.month === m.month)?.amount || 0;
                  return (
                    <tr key={m.month} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3 text-[13px] text-white/70">{m.month}</td>
                      <td className="px-5 py-3 text-[13px] text-[#DF3131] text-right font-heading font-bold">${m.amount.toLocaleString(undefined,{minimumFractionDigits:2})}</td>
                      <td className="px-5 py-3 text-[13px] text-[#C00000] text-right font-heading font-bold">${exp.toLocaleString(undefined,{minimumFractionDigits:2})}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="flex gap-3">
        <a href="/api/bookkeeping?tab=csv&type=business" className="px-5 py-3 bg-white/5 text-white/50 border border-white/10 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-white/10 transition-all inline-block">\u2193 Export CSV (Business Only)</a>
        <a href="/api/bookkeeping?tab=csv" className="px-5 py-3 bg-white/5 text-white/50 border border-white/10 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-white/10 transition-all inline-block">\u2193 Export CSV (All)</a>
        <a href="/api/bookkeeping?tab=schedule-c" className="px-5 py-3 bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/30 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-[#C9A227]/30 transition-all inline-block">\u2193 Schedule C Export</a>
      </div>
    </div>
  );
}



// ─── ANALYTICS TAB ───

export function TransactionForm({ type, onClose }: { type: "income" | "expense"; onClose: () => void }) {
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], amount: "", client_name: "", vendor: "", category: "", channel: "", description: "", business_personal: "business" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/bookkeeping/meta").then(r => r.json()).then(d => { setCategories(d.categories || []); setClients(d.clients || []); });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) return;
    setSaving(true);
    await fetch("/api/bookkeeping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amount: parseFloat(form.amount), type }),
    });
    setSaving(false);
    onClose();
  };

  const inputClass = "w-full bg-white/5 border border-white/10 text-white text-[13px] px-4 py-2.5 focus:outline-none focus:border-[#DF3131]/50 transition-colors placeholder:text-white/40";
  const filteredCategories = categories.filter(c => type === "income" ? c.type === "income" : c.type === "expense");

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-6 space-y-4">
      <h3 className="text-size-13 font-heading font-bold tracking-[0.1em] uppercase text-white/60">{type === "income" ? "Log Income" : "Log Expense"}</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase mb-1 block">Date</label>
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className={inputClass} required />
        </div>
        <div>
          <label className="text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase mb-1 block">Amount ($)</label>
          <input type="number" step="0.01" min="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className={inputClass} required />
        </div>
        {type === "income" ? (
          <div>
            <label className="text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase mb-1 block">Client</label>
            <select value={form.client_name} onChange={e => setForm({...form, client_name: e.target.value})} className={inputClass}>
              <option value="">Select client...</option>
              {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        ) : (
          <div>
            <label className="text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase mb-1 block">Vendor</label>
            <input type="text" placeholder="Vendor name" value={form.vendor} onChange={e => setForm({...form, vendor: e.target.value})} className={inputClass} />
          </div>
        )}
        <div>
          <label className="text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase mb-1 block">Category</label>
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={inputClass}>
            <option value="">Select category...</option>
            {filteredCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase mb-1 block">Channel</label>
          <select value={form.channel} onChange={e => setForm({...form, channel: e.target.value})} className={inputClass}>
            <option value="">Select channel...</option>
            <option value="cashapp">Cash App</option>
            <option value="venmo">Venmo</option>
            <option value="chime">Chime</option>
            <option value="bluevine">Bluevine</option>
            <option value="ramp">Ramp</option>
            <option value="zelle">Zelle</option>
            <option value="stripe">Stripe</option>
            <option value="wix">Wix Payments</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase mb-1 block">Description</label>
          <input type="text" placeholder="Brief description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputClass} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#DF3131] text-white text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-[#c12a2a] disabled:opacity-40 transition-all">{saving ? "Saving..." : "Save"}</button>
        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-white/5 text-white/60 border border-white/10 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:text-white/70 transition-all">Cancel</button>
      </div>
    </form>
  );
}

// ─── TRANSACTION TABLE ───
export function TransactionTable({ transactions, onRefresh }: { transactions: Transaction[]; onRefresh: () => void }) {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const filtered = filter === "all" ? transactions : transactions.filter(t => t.type === filter);
  const total = filtered.reduce((a, t) => a + t.amount, 0);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this transaction?")) return;
    await fetch(`/api/bookkeeping?id=${id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {(["all", "income", "expense"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-[10px] font-heading font-bold tracking-[0.1em] uppercase border transition-all ${filter === f ? "bg-[#DF3131]/20 text-[#DF3131] border-[#DF3131]/30" : "bg-white/5 text-white/50 border-white/10 hover:text-white/60"}`}>
            {f} {f !== "all" ? `(${transactions.filter(t => t.type === f).length})` : `(${transactions.length})`}
          </button>
        ))}
        <span className="ml-auto text-[13px] font-heading font-bold text-white/50">{filtered.length} items &middot; ${total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
      </div>
      <div className="bg-white/5 border border-white/10 overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead><tr className="border-b border-white/10">
            <th className="px-4 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Date</th>
            <th className="px-4 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Type</th>
            <th className="px-4 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Amount</th>
            <th className="px-4 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Client/Vendor</th>
            <th className="px-4 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Category</th>
            <th className="px-4 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Channel</th>
            <th className="px-4 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">P/B</th>
            <th className="px-4 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-[12px] text-white/60 whitespace-nowrap">{t.date}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 text-[10px] font-heading font-bold tracking-[0.05em] uppercase ${t.type === "income" ? "bg-[#DF3131]/10 text-[#DF3131]" : "bg-[#C00000]/10 text-[#C00000]"}`}>{t.type}</span></td>
                <td className="px-4 py-3 text-[13px] font-heading font-bold" style={{ color: t.type === "income" ? "#DF3131" : "#C00000" }}>${t.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td className="px-4 py-3 text-[12px] text-white/60">{t.client_name || t.vendor || "-"}</td>
                <td className="px-4 py-3 text-[12px] text-white/60">{t.category_name || "-"}</td>
                <td className="px-4 py-3 text-[12px] text-white/60 capitalize">{t.channel || "-"}</td>
                <td className="px-4 py-3 text-[12px] text-white/60 capitalize">{t.business_personal || "business"}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(t.id)} className="text-[11px] text-[#C00000]/60 hover:text-[#C00000] transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-[13px] text-white/40">No transactions yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface NsfwAdminData {
  gatedCategories: string[];
  cachedEntries: { path: string; label: string; confidence: number; ts: number }[];
  verifiedUsers: { email: string; ts: number }[];
}

