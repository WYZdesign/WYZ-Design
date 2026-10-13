"use client";

// Admin dashboard shell. Tab content split into src/components/admin/*
// and src/lib/types/admin.ts (oversized-file split, board S1).

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { logger } from "@/lib/logger";
import { NAV_SECTIONS, type TabId } from "@/lib/types/admin";
import { Loader, PageLoader, AccountAuth, NotAuthorized } from "@/components/admin/AdminShared";
import { ProfileTab, BugReportTab } from "@/components/admin/AdminProfileTab";
import { OverviewTab } from "@/components/admin/AdminOverviewTab";
import { BookkeepingDashboard, IncomeTab, ExpensesTab, ReportsTab } from "@/components/admin/AdminFinanceTabs";
import { AnalyticsTab, SeoTab, TrafficTab } from "@/components/admin/AdminGrowthTabs";
import { FormsTab, UsersTab, NewsletterTab, ChatsTab, NsfwContentTab } from "@/components/admin/AdminManageTabs";
import { HealthTab, ExportTab } from "@/components/admin/AdminSystemTabs";

const ADMIN_STYLES = `
.admin-scrollbar { scrollbar-width: thin; scrollbar-color: #3a3a3a #1a1a1a; }
.admin-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
.admin-scrollbar::-webkit-scrollbar-track { background: #1a1a1a; }
.admin-scrollbar::-webkit-scrollbar-thumb { background: #3a3a3a; border-radius: 4px; }
.admin-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
.admin-scrollbar::-webkit-scrollbar-corner { background: #1a1a1a; }
`;

export default function AdminDashboard() {
  const sessionResult = useSession();
  const session = sessionResult?.data ?? null;
  const status = sessionResult?.status ?? "loading";
  const update = sessionResult?.update;
  const [tab, setTab] = useState<TabId>("overview");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handler = () => setSidebarOpen(!mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const fetchTab = async () => {
    if (tab === "profile" || tab === "bugs") { setLoading(false); return; }
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
      } else if (tab === "nsfw") {
        url = `/api/nsfw/admin`;
      } else {
        url = `/api/admin?tab=${tab === "export" ? "overview" : tab}${email}`;
      }
      const r = await fetch(url);
      if (r.status === 403) { setData({ forbidden: true }); return; }
      setData(await r.json());
    } catch (e) { logger.warn("admin", `Fetch failed: ${e}`); }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: effect keyed to the deps shown; adding the flagged value would re-run it unnecessarily
  useEffect(() => { if (status === "authenticated") fetchTab(); }, [status, tab]);

  if (status === "loading") return <PageLoader />;
  if (!session) return <AccountAuth />;

  return (
    <div className="admin-shell min-h-screen bg-[#0a0a0a] text-white flex">
      <style>{ADMIN_STYLES}</style>
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 bg-[#111] border-r border-white/10 transition-all duration-300 flex flex-col w-72 -translate-x-full lg:translate-x-0 lg:w-16 ${sidebarOpen ? "translate-x-0 lg:w-72" : ""}`}>
        <div className="h-16 flex items-center px-4 border-b border-white/10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors" aria-label="Toggle sidebar">
            {sidebarOpen ? "\u25C1" : "\u25B7"}
          </button>
          {sidebarOpen && <span className="ml-3 text-[13px] font-heading font-bold tracking-[0.15em] uppercase">WYZ Admin</span>}
        </div>
         <nav className="flex-1 overflow-y-auto admin-scrollbar py-4">
          {NAV_SECTIONS.map(section => (
            <div key={section.label} className="mb-4">
              {sidebarOpen && <p className="px-4 text-[9px] text-white/40 font-bold tracking-[0.2em] uppercase mb-2">{section.label}</p>}
              {section.items.map(item => (
                <button key={item.id} onClick={() => { setTab(item.id as TabId); if (window.matchMedia("(max-width: 1023px)").matches) setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all ${tab === item.id ? "text-[#DF3131] bg-[#DF3131]/10 border-r-2 border-[#DF3131]" : "text-white/60 hover:text-white/70 hover:bg-white/5"} ${!sidebarOpen ? "justify-center px-0" : ""}`}>
                  <span className="text-[14px] w-5 text-center">{item.icon}</span>
                  {sidebarOpen && <span className="font-heading font-bold tracking-[0.05em] uppercase text-[11px]">{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        {sidebarOpen && (
          <div className="p-4 border-t border-white/10 space-y-3">
            <p className="text-[10px] text-white/50 truncate">{session.user?.email}</p>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 text-[11px] text-white/50 hover:text-white transition-colors font-heading font-bold tracking-[0.05em] uppercase">
              <FiLogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        )}
      </aside>

      <main className={`flex-1 min-w-0 max-w-full overflow-x-hidden transition-all duration-300 admin-scrollbar lg:ml-16 ${sidebarOpen ? "lg:ml-72" : ""}`}>
        <header className="h-16 flex items-center justify-between gap-3 px-4 sm:px-8 border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button className="lg:hidden w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors shrink-0" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              <FiMenu className="w-5 h-5" />
            </button>
            <h1 className="text-size-15 font-heading font-bold tracking-[0.12em] uppercase text-white/60 truncate">
              {NAV_SECTIONS.flatMap(s => s.items).find(i => i.id === tab)?.label || tab}
            </h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3 py-1 bg-[#DF3131]/20 text-[#DF3131] text-[10px] font-bold tracking-[0.1em] uppercase border border-[#DF3131]/30 whitespace-nowrap">ADMIN</span>
            <Link href="/home" className="text-[12px] text-white/50 hover:text-white transition-colors whitespace-nowrap">\u2190 Site</Link>
          </div>
        </header>
        <div className="p-4 sm:p-8 max-w-full">
          {tab === "profile" ? <ProfileTab session={session} update={update} signOut={signOut} /> :
           tab === "bugs" ? <BugReportTab session={session} /> :
           loading ? <Loader /> : data?.forbidden ? <NotAuthorized /> : (
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
              {tab === "nsfw" && <NsfwContentTab data={data} onRefresh={fetchTab} />}
              {tab === "health" && <HealthTab />}
              {tab === "export" && <ExportTab />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
