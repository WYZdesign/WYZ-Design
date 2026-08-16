"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Stats { totalForms: number; totalChats: number; chatSessions: number; totalUsers: number; adminCount: number; newsletterSubs: number; formTypes: Record<string,number>; submissionsByDay: [string,number][] }
interface FormEntry { id: string; formType: string; data: Record<string,unknown>; submittedAt: string; ip: string }
interface User { email: string; name: string; role: string; createdAt: string; provider: string }
interface Subscriber { email: string; subscribedAt: string }
interface Transaction { id: number; date: string; type: string; amount: number; client_name?: string; vendor: string; category_name?: string; channel: string; description: string; business_personal: string; created_at: string }
interface FinancialSummary { year: number; total_income: number; total_expenses: number; net_profit: number; income_by_client: { client: string; amount: number }[]; expenses_by_category: { category: string; schedule_c_line: string; amount: number }[]; income_by_channel: { channel: string; amount: number }[]; monthly_income: { month: string; amount: number }[]; monthly_expenses: { month: string; amount: number }[]; transaction_count: number }
interface AnalyticsSummary { period: string; total_pageviews: number; unique_visitors: number; unique_pages: number; avg_duration_ms: number; top_pages: { path: string; views: number; avg_duration: number }[]; top_referrers: { referrer: string; count: number }[]; top_utm_sources: { source: string; count: number }[]; device_breakdown: { device: string; count: number }[]; browser_breakdown: { browser: string; count: number }[]; daily_views: { date: string; views: number; unique: number }[]; bounce_rate: number; pages_per_session: number }
interface Category { id: number; name: string; schedule_c_line: string; type: string }
interface Client { id: number; name: string; email: string; notes: string }
interface ChatSession { sessionId: string; messages: number; lastMessage: string; preview: {role:string;content:string;timestamp:string}[] }

const NAV_SECTIONS: { label: string; items: { id: string; icon: string; label: string }[] }[] = [
  { label: "DASHBOARD", items: [{ id: "overview", icon: "\u25C8", label: "Overview" }] },
  { label: "MONEY", items: [
    { id: "bookkeeping", icon: "$", label: "Bookkeeping" },
    { id: "income", icon: "\u25B2", label: "Income" },
    { id: "expenses", icon: "\u25BC", label: "Expenses" },
    { id: "reports", icon: "\u25C7", label: "Reports" },
  ]},
  { label: "GROWTH", items: [
    { id: "analytics", icon: "\u25CE", label: "Analytics" },
    { id: "seo", icon: "\u25C9", label: "SEO" },
    { id: "traffic", icon: "\u25D0", label: "Traffic" },
  ]},
  { label: "MANAGE", items: [
    { id: "forms", icon: "\u25A1", label: "Forms" },
    { id: "users", icon: "\u25C6", label: "Users" },
    { id: "newsletter", icon: "\u25CF", label: "Newsletter" },
    { id: "chats", icon: "\u25D1", label: "Chats" },
  ]},
  { label: "SYSTEM", items: [
    { id: "health", icon: "\u25D2", label: "Health" },
    { id: "export", icon: "\u25D3", label: "Export" },
  ]},
];

type TabId = "overview" | "bookkeeping" | "income" | "expenses" | "reports" | "analytics" | "seo" | "traffic" | "forms" | "users" | "newsletter" | "chats" | "health" | "export";

export default function AdminDashboard() {
  const sessionResult = useSession();
  const session = sessionResult?.data ?? null;
  const status = sessionResult?.status ?? "loading";
  const [tab, setTab] = useState<TabId>("overview");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchTab = async () => {
    setLoading(true);
    try {
      const email = session?.user?.email ? `&email=${encodeURIComponent(session.user.email)}` : "";
      const analyticsTabs = ["analytics", "seo", "traffic"];
      const bookkeepingTabs = ["bookkeeping", "income", "expenses", "reports"];
      let url: string;
      if (analyticsTabs.includes(tab)) {
        url = `/api/analytics?tab=${tab === "traffic" ? "summary" : tab}${tab === "analytics" ? "&days=30" : ""}`;
      } else if (bookkeepingTabs.includes(tab)) {
        url = `/api/bookkeeping?tab=${tab === "reports" ? "summary" : tab === "income" ? "transactions&type=income" : tab === "expenses" ? "transactions&type=expense" : "summary"}&year=2026`;
      } else {
        url = `/api/admin?tab=${tab === "export" ? "overview" : tab}${email}`;
      }
      const r = await fetch(url);
      if (r.status === 403) { setData({ forbidden: true }); return; }
      setData(await r.json());
    } catch (e) { console.warn("[admin] fetch failed", e); }
    setLoading(false);
  };

  useEffect(() => { if (status === "authenticated") fetchTab(); }, [status, tab]);

  if (status === "loading") return <PageLoader />;
  if (!session) return <NeedSignIn />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      <aside className={`fixed inset-y-0 left-0 z-40 bg-[#111] border-r border-white/10 transition-all duration-300 ${sidebarOpen ? "w-60" : "w-16"} flex flex-col`}>
        <div className="h-16 flex items-center px-4 border-b border-white/10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors">
            {sidebarOpen ? "\u25C1" : "\u25B7"}
          </button>
          {sidebarOpen && <span className="ml-3 text-[13px] font-heading font-bold tracking-[0.15em] uppercase">WYZ Admin</span>}
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {NAV_SECTIONS.map(section => (
            <div key={section.label} className="mb-4">
              {sidebarOpen && <p className="px-4 text-[9px] text-white/20 font-bold tracking-[0.2em] uppercase mb-2">{section.label}</p>}
              {section.items.map(item => (
                <button key={item.id} onClick={() => setTab(item.id as TabId)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all ${tab === item.id ? "text-[#DF3131] bg-[#DF3131]/10 border-r-2 border-[#DF3131]" : "text-white/40 hover:text-white/70 hover:bg-white/5"} ${!sidebarOpen ? "justify-center px-0" : ""}`}>
                  <span className="text-[14px] w-5 text-center">{item.icon}</span>
                  {sidebarOpen && <span className="font-heading font-bold tracking-[0.05em] uppercase text-[11px]">{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        {sidebarOpen && <div className="p-4 border-t border-white/10"><p className="text-[10px] text-white/30 truncate">{session.user?.email}</p></div>}
      </aside>

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-16"}`}>
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-30">
          <h1 className="text-[15px] font-heading font-bold tracking-[0.12em] uppercase text-white/60">
            {NAV_SECTIONS.flatMap(s => s.items).find(i => i.id === tab)?.label || tab}
          </h1>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-[#DF3131]/20 text-[#DF3131] text-[10px] font-bold tracking-[0.1em] uppercase border border-[#DF3131]/30">ADMIN</span>
            <Link href="/home" className="text-[12px] text-white/30 hover:text-white transition-colors">\u2190 Site</Link>
          </div>
        </header>
        <div className="p-8">
          {loading ? <Loader /> : data?.forbidden ? <NotAuthorized /> : (
            <>
              {tab === "overview" && <OverviewTab data={data} />}
              {tab === "bookkeeping" && <BookkeepingDashboard data={data} onRefresh={fetchTab} />}
              {tab === "income" && <IncomeTab data={data} onRefresh={fetchTab} />}
              {tab === "expenses" && <ExpensesTab data={data} onRefresh={fetchTab} />}
              {tab === "reports" && <ReportsTab data={data} />}
              {tab === "analytics" && <AnalyticsTab data={data} />}
              {tab === "seo" && <SeoTab data={data} />}
              {tab === "traffic" && <TrafficTab data={data} />}
              {tab === "forms" && <FormsTab data={data?.submissions || []} />}
              {tab === "users" && <UsersTab data={data?.users || []} />}
              {tab === "newsletter" && <NewsletterTab data={data?.subscribers || []} />}
              {tab === "chats" && <ChatsTab data={data} />}
              {tab === "health" && <HealthTab />}
              {tab === "export" && <ExportTab />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}


// ─── SHARED COMPONENTS ───
function KpiCard({ label, value, color, icon, format }: { label: string; value: number; color: string; icon: string; format?: string }) {
  const display = format === "currency" ? `$${value.toLocaleString(undefined,{minimumFractionDigits:2})}` : value.toLocaleString();
  return (
    <div className="bg-white/5 border border-white/10 p-5 hover:border-white/20 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[14px]" style={{color}}>{icon}</span>
        <span className="text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">{label}</span>
      </div>
      <p className="text-[22px] font-heading font-bold" style={{color}}>{display}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[12px] font-heading font-bold tracking-[0.15em] uppercase text-white/40 mb-3 mt-6">{children}</h3>;
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-center py-16 text-white/20 text-[13px]">{children}</div>;
}

function Loader() {
  return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-white/20 border-t-[#DF3131] rounded-full animate-spin" /></div>;
}

function PageLoader() {
  return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-[#DF3131] rounded-full animate-spin" /></div>;
}

function NeedSignIn() {
  return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-center px-6"><div><h1 className="text-[28px] font-heading font-bold text-white mb-3">Admin Access</h1><p className="text-white/40 text-[14px] mb-6">Sign in with your admin account.</p><Link href="/api/auth/signin" className="inline-block px-8 py-3 bg-[#DF3131] text-white text-[13px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-[#c12a2a] transition-colors">Sign In</Link></div></div>;
}

function NotAuthorized() {
  return <div className="text-center py-20"><h2 className="text-[24px] font-heading font-bold text-[#EA4335] mb-2">Access Denied</h2><p className="text-white/40 text-[13px]">Your account does not have admin privileges.</p></div>;
}

// ─── OVERVIEW ───
function OverviewTab({ data }: { data: any }) {
  const s = data?.stats;
  if (!s) return <Empty>No data yet</Empty>;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard label="Forms" value={s.totalForms} color="#DF3131" icon="\u25A1" />
        <KpiCard label="Chats" value={s.totalChats} color="#5865F2" icon="\u25D1" />
        <KpiCard label="Users" value={s.totalUsers} color="#34A853" icon="\u25C6" />
        <KpiCard label="Newsletter" value={s.newsletterSubs} color="#FBBC05" icon="\u25CF" />
        <KpiCard label="Admins" value={s.adminCount} color="#EA4335" icon="\u25C8" />
        <KpiCard label="Sessions" value={s.chatSessions} color="#D49341" icon="\u25D1" />
      </div>
      {Object.keys(s.formTypes || {}).length > 0 && (
        <div>
          <SectionTitle>Forms by Type</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(s.formTypes).sort((a,b) => (b[1] as number)-(a[1] as number)).map(([type, count]) => (
              <div key={type} className="bg-white/5 border border-white/10 p-4">
                <span className="text-[18px] font-heading font-bold text-[#DF3131]">{String(count)}</span>
                <p className="text-[11px] text-white/40 capitalize mt-1">{type.replace(/-/g," ")}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BOOKKEEPING DASHBOARD ───
function BookkeepingDashboard({ data, onRefresh }: { data: FinancialSummary; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState<"income" | "expense" | null>(null);
  if (!data?.year) return <Empty>Loading bookkeeping...</Empty>;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Gross Income" value={data.total_income} color="#34A853" icon="$" format="currency" />
        <KpiCard label="Total Expenses" value={data.total_expenses} color="#EA4335" icon="$" format="currency" />
        <KpiCard label="Net Profit" value={data.net_profit} color="#D49341" icon="$" format="currency" />
        <KpiCard label="Transactions" value={data.transaction_count} color="#5865F2" icon="\u25C7" />
      </div>
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setShowForm("income")} className="px-5 py-3 bg-[#34A853]/20 text-[#34A853] border border-[#34A853]/30 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-[#34A853]/30 transition-all">+ Log Income</button>
        <button onClick={() => setShowForm("expense")} className="px-5 py-3 bg-[#EA4335]/20 text-[#EA4335] border border-[#EA4335]/30 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-[#EA4335]/30 transition-all">+ Log Expense</button>
        <a href="/api/bookkeeping?tab=csv&type=business" className="px-5 py-3 bg-white/5 text-white/50 border border-white/10 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-white/10 transition-all inline-block">\u2193 Export CSV</a>
        <a href="/api/bookkeeping?tab=schedule-c" className="px-5 py-3 bg-white/5 text-white/50 border border-white/10 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-white/10 transition-all inline-block">\u2193 Schedule C</a>
      </div>
      {showForm && <TransactionForm type={showForm} onClose={() => { setShowForm(null); onRefresh(); }} />}
      {data.income_by_client?.length > 0 && (
        <div>
          <SectionTitle>Income by Client</SectionTitle>
          <div className="bg-white/5 border border-white/10 overflow-hidden">
            {data.income_by_client.map((c, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0">
                <span className="text-[13px] text-white/70">{c.client}</span>
                <span className="text-[14px] font-heading font-bold text-[#34A853]">${c.amount.toLocaleString(undefined,{minimumFractionDigits:2})}</span>
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
                  {c.schedule_c_line && <span className="text-[10px] text-white/30 ml-2">{c.schedule_c_line}</span>}
                </div>
                <span className="text-[14px] font-heading font-bold text-[#EA4335]">${c.amount.toLocaleString(undefined,{minimumFractionDigits:2})}</span>
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
                    <span className="text-[10px] text-white/40 group-hover:text-white/80">${(m.amount/1000).toFixed(1)}k</span>
                    <div className="w-full bg-[#34A853]/40 group-hover:bg-[#34A853] transition-colors rounded-t" style={{ height: `${h}%` }} />
                    <span className="text-[9px] text-white/30">{m.month.slice(5)}</span>
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



// ─── INCOME TAB ───
function IncomeTab({ data, onRefresh }: { data: { transactions: Transaction[] }; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const txns = data?.transactions || [];
  const total = txns.reduce((a, t) => a + t.amount, 0);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-[24px] font-heading font-bold text-[#34A853]">${total.toLocaleString(undefined,{minimumFractionDigits:2})}</p>
          <p className="text-[11px] text-white/30">{txns.length} transactions</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowForm(!showForm)} className="px-5 py-3 bg-[#34A853]/20 text-[#34A853] border border-[#34A853]/30 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-[#34A853]/30 transition-all">+ Log Income</button>
          <a href="/api/bookkeeping?tab=csv&type=income" className="px-5 py-3 bg-white/5 text-white/50 border border-white/10 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-white/10 transition-all inline-block">\u2193 CSV</a>
        </div>
      </div>
      {showForm && <TransactionForm type="income" onClose={() => { setShowForm(false); onRefresh(); }} />}
      <TransactionTable transactions={txns} onRefresh={onRefresh} />
    </div>
  );
}

// ─── EXPENSES TAB ───
function ExpensesTab({ data, onRefresh }: { data: { transactions: Transaction[] }; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const txns = data?.transactions || [];
  const total = txns.reduce((a, t) => a + t.amount, 0);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-[24px] font-heading font-bold text-[#EA4335]">${total.toLocaleString(undefined,{minimumFractionDigits:2})}</p>
          <p className="text-[11px] text-white/30">{txns.length} transactions</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowForm(!showForm)} className="px-5 py-3 bg-[#EA4335]/20 text-[#EA4335] border border-[#EA4335]/30 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-[#EA4335]/30 transition-all">+ Log Expense</button>
          <a href="/api/bookkeeping?tab=csv&type=expense" className="px-5 py-3 bg-white/5 text-white/50 border border-white/10 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-white/10 transition-all inline-block">\u2193 CSV</a>
        </div>
      </div>
      {showForm && <TransactionForm type="expense" onClose={() => { setShowForm(false); onRefresh(); }} />}
      <TransactionTable transactions={txns} onRefresh={onRefresh} />
    </div>
  );
}

// ─── REPORTS TAB ───
function ReportsTab({ data }: { data: FinancialSummary }) {
  if (!data?.year) return <Empty>No data</Empty>;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Gross Income" value={data.total_income} color="#34A853" icon="$" format="currency" />
        <KpiCard label="Total Expenses" value={data.total_expenses} color="#EA4335" icon="$" format="currency" />
        <KpiCard label="Net Profit" value={data.net_profit} color="#D49341" icon="$" format="currency" />
        <KpiCard label="Transactions" value={data.transaction_count} color="#5865F2" icon="\u25C7" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.income_by_channel?.length > 0 && (
          <div>
            <SectionTitle>Income by Channel</SectionTitle>
            <div className="bg-white/5 border border-white/10 overflow-hidden">
              {data.income_by_channel.map((c, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0">
                  <span className="text-[13px] text-white/70 capitalize">{c.channel}</span>
                  <span className="text-[14px] font-heading font-bold text-[#34A853]">${c.amount.toLocaleString(undefined,{minimumFractionDigits:2})}</span>
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
                  <span className="text-[14px] font-heading font-bold text-[#34A853]">${c.amount.toLocaleString(undefined,{minimumFractionDigits:2})}</span>
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
                <th className="px-5 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">Month</th>
                <th className="px-5 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase text-right">Income</th>
                <th className="px-5 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase text-right">Expenses</th>
              </tr></thead>
              <tbody>
                {data.monthly_income.map((m) => {
                  const exp = data.monthly_expenses?.find(e => e.month === m.month)?.amount || 0;
                  return (
                    <tr key={m.month} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3 text-[13px] text-white/70">{m.month}</td>
                      <td className="px-5 py-3 text-[13px] text-[#34A853] text-right font-heading font-bold">${m.amount.toLocaleString(undefined,{minimumFractionDigits:2})}</td>
                      <td className="px-5 py-3 text-[13px] text-[#EA4335] text-right font-heading font-bold">${exp.toLocaleString(undefined,{minimumFractionDigits:2})}</td>
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
        <a href="/api/bookkeeping?tab=schedule-c" className="px-5 py-3 bg-[#D49341]/20 text-[#D49341] border border-[#D49341]/30 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-[#D49341]/30 transition-all inline-block">\u2193 Schedule C Export</a>
      </div>
    </div>
  );
}



// ─── ANALYTICS TAB ───
function AnalyticsTab({ data }: { data: AnalyticsSummary }) {
  if (!data?.period) return <Empty>No analytics data yet. Traffic tracking starts once the AnalyticsTracker component is live.</Empty>;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Pageviews" value={data.total_pageviews} color="#DF3131" icon="\u25CE" />
        <KpiCard label="Unique Visitors" value={data.unique_visitors} color="#5865F2" icon="\u25C6" />
        <KpiCard label="Unique Pages" value={data.unique_pages} color="#34A853" icon="\u25A1" />
        <KpiCard label="Bounce Rate" value={Math.round(data.bounce_rate)} color="#EA4335" icon="\u25CB" />
        <KpiCard label="Pages/Session" value={Math.round(data.pages_per_session * 10) / 10} color="#FBBC05" icon="\u25C7" />
      </div>

      {data.daily_views?.length > 0 && (
        <div>
          <SectionTitle>Daily Views (Last 30 Days)</SectionTitle>
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="flex items-end gap-1 h-32">
              {data.daily_views.map((d) => {
                const max = Math.max(...data.daily_views.map(x => x.views), 1);
                const h = (d.views / max) * 100;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5 group min-w-0">
                    <span className="text-[8px] text-white/40 group-hover:text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">{d.views}</span>
                    <div className="w-full bg-[#DF3131]/40 group-hover:bg-[#DF3131] transition-colors rounded-t" style={{ height: `${h}%` }} />
                    <span className="text-[7px] text-white/20 truncate w-full text-center">{d.date.slice(5)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.top_pages?.length > 0 && (
          <div>
            <SectionTitle>Top Pages</SectionTitle>
            <div className="bg-white/5 border border-white/10 overflow-hidden">
              {data.top_pages.slice(0, 10).map((p, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-2.5 border-b border-white/5 last:border-0">
                  <span className="text-[12px] text-white/70 truncate mr-4 font-mono">{p.path}</span>
                  <span className="text-[12px] text-[#DF3131] font-heading font-bold">{p.views}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.top_referrers?.length > 0 && (
          <div>
            <SectionTitle>Top Referrers</SectionTitle>
            <div className="bg-white/5 border border-white/10 overflow-hidden">
              {data.top_referrers.slice(0, 10).map((r, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-2.5 border-b border-white/5 last:border-0">
                  <span className="text-[12px] text-white/70 truncate mr-4">{r.referrer}</span>
                  <span className="text-[12px] text-[#5865F2] font-heading font-bold">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {data.device_breakdown?.length > 0 && (
          <div>
            <SectionTitle>Devices</SectionTitle>
            <div className="bg-white/5 border border-white/10 overflow-hidden">
              {data.device_breakdown.map((d, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-2.5 border-b border-white/5 last:border-0">
                  <span className="text-[13px] text-white/70 capitalize">{d.device}</span>
                  <span className="text-[13px] text-white/50 font-heading font-bold">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.browser_breakdown?.length > 0 && (
          <div>
            <SectionTitle>Browsers</SectionTitle>
            <div className="bg-white/5 border border-white/10 overflow-hidden">
              {data.browser_breakdown.map((b, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-2.5 border-b border-white/5 last:border-0">
                  <span className="text-[13px] text-white/70">{b.browser}</span>
                  <span className="text-[13px] text-white/50 font-heading font-bold">{b.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.top_utm_sources?.length > 0 && (
          <div>
            <SectionTitle>UTM Sources</SectionTitle>
            <div className="bg-white/5 border border-white/10 overflow-hidden">
              {data.top_utm_sources.map((u, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-2.5 border-b border-white/5 last:border-0">
                  <span className="text-[13px] text-white/70">{u.source}</span>
                  <span className="text-[13px] text-[#FBBC05] font-heading font-bold">{u.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SEO TAB ───
function SeoTab({ data }: { data: any }) {
  if (!data?.checks) return <Empty>No SEO data yet. Run an SEO check first.</Empty>;
  const passed = data.checks.filter((c: any) => c.status === "pass").length;
  const total = data.checks.length;
  const score = total > 0 ? Math.round((passed / total) * 100) : 0;
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center" style={{ borderColor: score >= 80 ? "#34A853" : score >= 50 ? "#FBBC05" : "#EA4335" }}>
          <span className="text-[28px] font-heading font-bold" style={{ color: score >= 80 ? "#34A853" : score >= 50 ? "#FBBC05" : "#EA4335" }}>{score}</span>
        </div>
        <div>
          <p className="text-[13px] text-white/50">{passed}/{total} checks passed</p>
          <p className="text-[11px] text-white/30 mt-1">Last checked: {data.checkedAt ? new Date(data.checkedAt).toLocaleString() : "unknown"}</p>
        </div>
      </div>
      <div className="bg-white/5 border border-white/10 overflow-hidden">
        {data.checks.map((c: any, i: number) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-0">
            <span className={`text-[14px] ${c.status === "pass" ? "text-[#34A853]" : c.status === "warn" ? "text-[#FBBC05]" : "text-[#EA4335]"}`}>
              {c.status === "pass" ? "\u2713" : c.status === "warn" ? "\u26A0" : "\u2717"}
            </span>
            <div className="flex-1">
              <p className="text-[13px] text-white/70">{c.check}</p>
              {c.detail && <p className="text-[11px] text-white/30 mt-0.5">{c.detail}</p>}
            </div>
            <span className={`text-[10px] font-heading font-bold tracking-[0.1em] uppercase ${c.status === "pass" ? "text-[#34A853]" : c.status === "warn" ? "text-[#FBBC05]" : "text-[#EA4335]"}`}>{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TRAFFIC TAB ───
function TrafficTab({ data }: { data: AnalyticsSummary }) {
  if (!data?.period) return <Empty>No traffic data yet.</Empty>;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Views" value={data.total_pageviews} color="#DF3131" icon="\u25CE" />
        <KpiCard label="Unique Visitors" value={data.unique_visitors} color="#5865F2" icon="\u25C6" />
        <KpiCard label="Bounce Rate" value={Math.round(data.bounce_rate)} color="#EA4335" icon="\u25CB" />
        <KpiCard label="Avg Duration" value={Math.round(data.avg_duration_ms / 1000)} color="#34A853" icon="\u25D0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.top_pages?.length > 0 && (
          <div>
            <SectionTitle>Most Visited Pages</SectionTitle>
            <div className="bg-white/5 border border-white/10">
              {data.top_pages.slice(0, 15).map((p, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-0">
                  <span className="text-[11px] text-white/20 font-heading font-bold w-6">{i + 1}</span>
                  <span className="text-[12px] text-white/70 flex-1 truncate font-mono">{p.path}</span>
                  <span className="text-[12px] text-[#DF3131] font-heading font-bold">{p.views}</span>
                  <span className="text-[10px] text-white/30">{Math.round(p.avg_duration / 1000)}s avg</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.top_referrers?.length > 0 && (
          <div>
            <SectionTitle>Traffic Sources</SectionTitle>
            <div className="bg-white/5 border border-white/10">
              {data.top_referrers.map((r, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-0">
                  <span className="text-[11px] text-white/20 font-heading font-bold w-6">{i + 1}</span>
                  <span className="text-[12px] text-white/70 flex-1 truncate">{r.referrer}</span>
                  <span className="text-[12px] text-[#5865F2] font-heading font-bold">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



// ─── FORMS TAB ───
function FormsTab({ data }: { data: FormEntry[] }) {
  if (!data.length) return <Empty>No form submissions yet</Empty>;
  const types = [...new Set(data.map(f => f.formType))];
  const [filter, setFilter] = useState<string>("all");
  const filtered = filter === "all" ? data : data.filter(f => f.formType === filter);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 text-[11px] font-heading font-bold tracking-[0.1em] uppercase border transition-all ${filter === "all" ? "bg-[#DF3131]/20 text-[#DF3131] border-[#DF3131]/30" : "bg-white/5 text-white/30 border-white/10 hover:text-white/60"}`}>All ({data.length})</button>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 text-[11px] font-heading font-bold tracking-[0.1em] uppercase border transition-all ${filter === t ? "bg-[#DF3131]/20 text-[#DF3131] border-[#DF3131]/30" : "bg-white/5 text-white/30 border-white/10 hover:text-white/60"}`}>{t.replace(/-/g," ")} ({data.filter(f => f.formType === t).length})</button>
        ))}
      </div>
      <div className="bg-white/5 border border-white/10 overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead><tr className="border-b border-white/10">
            <th className="px-5 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">Type</th>
            <th className="px-5 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">Data</th>
            <th className="px-5 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">Date</th>
          </tr></thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="px-5 py-3"><span className="px-2 py-1 bg-[#DF3131]/10 text-[#DF3131] text-[10px] font-heading font-bold tracking-[0.05em] uppercase">{f.formType}</span></td>
                <td className="px-5 py-3 text-[12px] text-white/60 max-w-md truncate">{JSON.stringify(f.data).slice(0, 120)}</td>
                <td className="px-5 py-3 text-[12px] text-white/40 whitespace-nowrap">{new Date(f.submittedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── USERS TAB ───
function UsersTab({ data }: { data: User[] }) {
  if (!data.length) return <Empty>No users found</Empty>;
  return (
    <div className="bg-white/5 border border-white/10 overflow-x-auto">
      <table className="w-full text-left min-w-[600px]">
        <thead><tr className="border-b border-white/10">
          <th className="px-5 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">Email</th>
          <th className="px-5 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">Name</th>
          <th className="px-5 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">Role</th>
          <th className="px-5 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">Provider</th>
        </tr></thead>
        <tbody>
          {data.map((u) => (
            <tr key={u.email} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
              <td className="px-5 py-3 text-[13px] text-white/70">{u.email}</td>
              <td className="px-5 py-3 text-[13px] text-white/50">{u.name || "-"}</td>
              <td className="px-5 py-3"><span className={`px-2 py-1 text-[10px] font-heading font-bold tracking-[0.05em] uppercase ${u.role === "admin" ? "bg-[#EA4335]/10 text-[#EA4335]" : "bg-white/5 text-white/30"}`}>{u.role}</span></td>
              <td className="px-5 py-3 text-[12px] text-white/40">{u.provider}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── NEWSLETTER TAB ───
function NewsletterTab({ data }: { data: Subscriber[] }) {
  if (!data.length) return <Empty>No subscribers yet</Empty>;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-white/50">{data.length} subscriber{data.length !== 1 ? "s" : ""}</p>
        <a href="/api/admin?tab=newsletter&format=csv" className="px-4 py-2 bg-white/5 text-white/50 border border-white/10 text-[11px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-white/10 transition-all inline-block">\u2193 Export CSV</a>
      </div>
      <div className="bg-white/5 border border-white/10 overflow-hidden">
        {data.map((s, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0">
            <span className="text-[13px] text-white/70">{s.email}</span>
            <span className="text-[12px] text-white/30">{new Date(s.subscribedAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHATS TAB ───
function ChatsTab({ data }: { data: any }) {
  const sessions: ChatSession[] = data?.sessions || [];
  if (!sessions.length) return <Empty>No chat sessions</Empty>;
  return (
    <div className="space-y-4">
      {sessions.map((s) => (
        <div key={s.sessionId} className="bg-white/5 border border-white/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] text-white/50 font-mono">{s.sessionId.slice(0, 12)}...</span>
            <span className="text-[11px] text-white/30">{s.messages} messages</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {s.preview?.map((m: any, i: number) => (
              <div key={i} className={`text-[12px] px-3 py-2 ${m.role === "user" ? "bg-white/5 text-white/60 ml-8" : "bg-[#DF3131]/10 text-white/80 mr-8"}`}>
                <span className="text-[10px] font-heading font-bold uppercase mr-2 opacity-50">{m.role}</span>
                {m.content?.slice(0, 200)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── HEALTH TAB ───
function HealthTab() {
  const [health, setHealth] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    fetch("/api/health").then(r => r.json()).then(setHealth).catch(() => setHealth({ error: "unreachable" })).finally(() => setChecking(false));
  }, []);
  if (checking) return <Loader />;
  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 p-6">
        <SectionTitle>Site Health</SectionTitle>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 ${health?.status === "ok" ? "bg-[#34A853]/20 text-[#34A853]" : "bg-[#EA4335]/20 text-[#EA4335]"}`}>
              {health?.status === "ok" ? "\u2713" : "\u2717"}
            </div>
            <p className="text-[11px] text-white/40">API Status</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 bg-[#34A853]/20 text-[#34A853]">{"\u2713"}</div>
            <p className="text-[11px] text-white/40">DB Connected</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 bg-[#34A853]/20 text-[#34A853]">{"\u2713"}</div>
            <p className="text-[11px] text-white/40">Analytics Active</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 bg-[#FBBC05]/20 text-[#FBBC05]">{"\u26A0"}</div>
            <p className="text-[11px] text-white/40">Vault Locked</p>
          </div>
        </div>
      </div>
      <div className="bg-white/5 border border-white/10 p-6">
        <SectionTitle>System Info</SectionTitle>
        <div className="grid grid-cols-2 gap-4 mt-4 text-[12px]">
          <div><span className="text-white/30">Uptime:</span> <span className="text-white/70">{health?.uptime || "unknown"}</span></div>
          <div><span className="text-white/30">Node:</span> <span className="text-white/70">{health?.node || "unknown"}</span></div>
          <div><span className="text-white/30">Environment:</span> <span className="text-white/70">{health?.env || "production"}</span></div>
          <div><span className="text-white/30">Version:</span> <span className="text-white/70">{health?.version || "1.0"}</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── EXPORT TAB ───
function ExportTab() {
  return (
    <div className="space-y-6">
      <SectionTitle>Data Export</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Bookkeeping (CSV)", href: "/api/bookkeeping?tab=csv", desc: "All transactions" },
          { label: "Bookkeeping (Business)", href: "/api/bookkeeping?tab=csv&type=business", desc: "Business only" },
          { label: "Schedule C", href: "/api/bookkeeping?tab=schedule-c", desc: "Tax-ready export" },
          { label: "Newsletter Subs", href: "/api/admin?tab=newsletter&format=csv", desc: "Email list" },
          { label: "All Forms", href: "/api/admin?tab=forms&format=csv", desc: "Form submissions" },
          { label: "Analytics", href: "/api/analytics?tab=summary&format=csv", desc: "Traffic data" },
        ].map((item) => (
          <a key={item.href} href={item.href} className="block bg-white/5 border border-white/10 p-5 hover:border-[#DF3131]/30 transition-all group">
            <p className="text-[13px] text-white/70 group-hover:text-[#DF3131] transition-colors font-heading font-bold">{item.label}</p>
            <p className="text-[11px] text-white/30 mt-1">{item.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}



// ─── TRANSACTION FORM ───
function TransactionForm({ type, onClose }: { type: "income" | "expense"; onClose: () => void }) {
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

  const inputClass = "w-full bg-white/5 border border-white/10 text-white text-[13px] px-4 py-2.5 focus:outline-none focus:border-[#DF3131]/50 transition-colors placeholder:text-white/20";
  const filteredCategories = categories.filter(c => type === "income" ? c.type === "income" : c.type === "expense");

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-6 space-y-4">
      <h3 className="text-[13px] font-heading font-bold tracking-[0.1em] uppercase text-white/60">{type === "income" ? "Log Income" : "Log Expense"}</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase mb-1 block">Date</label>
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className={inputClass} required />
        </div>
        <div>
          <label className="text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase mb-1 block">Amount ($)</label>
          <input type="number" step="0.01" min="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className={inputClass} required />
        </div>
        {type === "income" ? (
          <div>
            <label className="text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase mb-1 block">Client</label>
            <select value={form.client_name} onChange={e => setForm({...form, client_name: e.target.value})} className={inputClass}>
              <option value="">Select client...</option>
              {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        ) : (
          <div>
            <label className="text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase mb-1 block">Vendor</label>
            <input type="text" placeholder="Vendor name" value={form.vendor} onChange={e => setForm({...form, vendor: e.target.value})} className={inputClass} />
          </div>
        )}
        <div>
          <label className="text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase mb-1 block">Category</label>
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={inputClass}>
            <option value="">Select category...</option>
            {filteredCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase mb-1 block">Channel</label>
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
          <label className="text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase mb-1 block">Description</label>
          <input type="text" placeholder="Brief description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputClass} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#DF3131] text-white text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-[#c12a2a] disabled:opacity-40 transition-all">{saving ? "Saving..." : "Save"}</button>
        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-white/5 text-white/40 border border-white/10 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:text-white/70 transition-all">Cancel</button>
      </div>
    </form>
  );
}

// ─── TRANSACTION TABLE ───
function TransactionTable({ transactions, onRefresh }: { transactions: Transaction[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<number | null>(null);
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
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-[10px] font-heading font-bold tracking-[0.1em] uppercase border transition-all ${filter === f ? "bg-[#DF3131]/20 text-[#DF3131] border-[#DF3131]/30" : "bg-white/5 text-white/30 border-white/10 hover:text-white/60"}`}>
            {f} {f !== "all" ? `(${transactions.filter(t => t.type === f).length})` : `(${transactions.length})`}
          </button>
        ))}
        <span className="ml-auto text-[13px] font-heading font-bold text-white/50">{filtered.length} items &middot; ${total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
      </div>
      <div className="bg-white/5 border border-white/10 overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead><tr className="border-b border-white/10">
            <th className="px-4 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">Date</th>
            <th className="px-4 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">Type</th>
            <th className="px-4 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">Amount</th>
            <th className="px-4 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">Client/Vendor</th>
            <th className="px-4 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">Category</th>
            <th className="px-4 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">Channel</th>
            <th className="px-4 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">P/B</th>
            <th className="px-4 py-3 text-[10px] text-white/30 font-heading font-bold tracking-[0.1em] uppercase">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-[12px] text-white/60 whitespace-nowrap">{t.date}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 text-[10px] font-heading font-bold tracking-[0.05em] uppercase ${t.type === "income" ? "bg-[#34A853]/10 text-[#34A853]" : "bg-[#EA4335]/10 text-[#EA4335]"}`}>{t.type}</span></td>
                <td className="px-4 py-3 text-[13px] font-heading font-bold" style={{ color: t.type === "income" ? "#34A853" : "#EA4335" }}>${t.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td className="px-4 py-3 text-[12px] text-white/60">{t.client_name || t.vendor || "-"}</td>
                <td className="px-4 py-3 text-[12px] text-white/40">{t.category_name || "-"}</td>
                <td className="px-4 py-3 text-[12px] text-white/40 capitalize">{t.channel || "-"}</td>
                <td className="px-4 py-3 text-[12px] text-white/40 capitalize">{t.business_personal || "business"}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(t.id)} className="text-[11px] text-[#EA4335]/60 hover:text-[#EA4335] transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-[13px] text-white/20">No transactions yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
