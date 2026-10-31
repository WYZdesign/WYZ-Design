"use client";

// Overview tab extracted from src/app/admin/page.tsx (oversized-file
// split, board S1). Moved verbatim, no behavior change.

import type { OverviewData } from "@/lib/types/admin";
import { KpiCard, SectionTitle, Empty } from "@/components/admin/AdminShared";

export function OverviewTab({ data }: { data: OverviewData }) {
  const s = data?.stats;
  if (!s) return <Empty>No data yet</Empty>;
  const total = s.totalForms + s.totalChats + s.newsletterSubs;
  const recentForms = data?.recentForms || [];
  return (
    <div className="space-y-8">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard label="Forms" value={s.totalForms} color="#DF3131" icon="□" />
        <KpiCard label="Chats" value={s.totalChats} color="#C9A227" icon="○" />
        <KpiCard label="Users" value={s.totalUsers} color="#DF3131" icon="◆" />
        <KpiCard label="Newsletter" value={s.newsletterSubs} color="#C9A227" icon="●" />
        <KpiCard label="Admins" value={s.adminCount} color="#C00000" icon="◉" />
        <KpiCard label="Sessions" value={s.chatSessions} color="#C9A227" icon="◎" />
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Engagements", value: total, color: "#6E6E6E" },
          { label: "Form Rate", value: total > 0 ? `${Math.round((s.totalForms / total) * 100)}%` : "0%", color: "#DF3131" },
          { label: "Newsletter Rate", value: total > 0 ? `${Math.round((s.newsletterSubs / Math.max(total, 1)) * 100)}%` : "0%", color: "#C9A227" },
          { label: "Active Users", value: s.totalUsers, color: "#DF3131" },
        ].map((m) => (
          <div key={m.label} className="bg-white/5 border border-white/10 p-4">
            <p className="text-[10px] text-white/50 font-bold tracking-[0.1em] uppercase mb-1">{m.label}</p>
            <p className="text-[24px] font-heading font-bold" style={{ color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Form Types Bar Chart */}
      <div className="bg-white/5 border border-white/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle>Form Submissions by Type</SectionTitle>
          <span className="text-[11px] text-white/40">Total: {Object.values(s.formTypes || {}).reduce((a: number, b: unknown) => a + (b as number), 0)}</span>
        </div>
        {Object.entries(s.formTypes).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(s.formTypes).sort((a,b) => b[1]-a[1]).map(([type, count], i) => {
              const colors = ["#DF3131","#DF3131","#C9A227","#C9A227","#C9A227","#C00000","#6E6E6E","#8C6A1D"];
              const maxCount = Math.max(...Object.values(s.formTypes));
              const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <div key={type} className="flex items-center gap-3">
                  <span className="text-[11px] text-white/70 w-28 truncate text-right">{type.replace(/-/g, " ")}</span>
                  <div className="flex-1 h-6 bg-white/5 overflow-hidden relative">
                    <div className="h-full transition-all duration-1000 ease-out flex items-center pl-3"
                      style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                  </div>
                  <span className="text-[13px] font-heading font-bold w-8 text-right" style={{ color: colors[i % colors.length] }}>{count}</span>
                </div>
              );
            })}
          </div>
        ) : <Empty>No form submissions yet</Empty>}
      </div>

      {/* Recent Forms */}
      <div>
        <SectionTitle>Recent Submissions</SectionTitle>
        <div className="bg-white/5 border border-white/10">
          {recentForms && recentForms.length > 0 ? (
            <div className="overflow-x-auto admin-scrollbar max-h-64">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="text-white/40 border-b border-white/10 sticky top-0 bg-[#0a0a0a]">
                    <th className="px-5 py-3 font-heading font-bold tracking-[0.1em] uppercase text-[11px]">Date</th>
                    <th className="px-5 py-3 font-heading font-bold tracking-[0.1em] uppercase text-[11px]">Type</th>
                    <th className="px-5 py-3 font-heading font-bold tracking-[0.1em] uppercase text-[11px]">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {recentForms.slice(0, 15).map((f: { formType: string; submittedAt: string; data: Record<string, unknown> }, i: number) => (
                    <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                      <td className="px-5 py-3 text-white/60">{f.submittedAt ? new Date(f.submittedAt).toLocaleDateString() : "-"}</td>
                      <td className="px-5 py-3"><span className="px-2 py-0.5 bg-[#DF3131]/20 text-[#DF3131] text-[10px] font-bold uppercase">{f.formType}</span></td>
                      <td className="px-5 py-3 text-white/50 text-[12px]">
                        {Object.entries(f.data || {}).slice(0, 2).map(([k,v]) => <span key={k} className="mr-3">{k}: <span className="text-white/80">{String(v).slice(0,30)}</span></span>)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <Empty>No recent submissions</Empty>}
        </div>
      </div>
    </div>
  );
}

// ─── BOOKKEEPING DASHBOARD ───
