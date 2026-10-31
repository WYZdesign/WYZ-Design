"use client";

// Growth tab components (Analytics/SEO/Traffic) extracted from
// src/app/admin/page.tsx (oversized-file split, board S1). Moved
// verbatim, no behavior change.

import type { AnalyticsSummary, SeoData } from "@/lib/types/admin";
import { KpiCard, SectionTitle, Empty } from "@/components/admin/AdminShared";

export function AnalyticsTab({ data }: { data: AnalyticsSummary }) {
  if (!data?.period) return <Empty>No analytics data yet. Traffic tracking starts once the AnalyticsTracker component is live.</Empty>;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Pageviews" value={data.total_pageviews} color="#DF3131" icon="◎" />
        <KpiCard label="Unique Visitors" value={data.unique_visitors} color="#C9A227" icon="◆" />
        <KpiCard label="Unique Pages" value={data.unique_pages} color="#DF3131" icon="□" />
        <KpiCard label="Bounce Rate" value={Math.round(data.bounce_rate)} color="#C00000" icon="○" hint="Share of visitors who left after viewing only one page" />
        <KpiCard label="Pages/Session" value={Math.round(data.pages_per_session * 10) / 10} color="#C9A227" icon="◇" hint="Average number of pages a visitor looks at before leaving" />
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
                    <span className="text-[8px] text-white/60 group-hover:text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">{d.views}</span>
                    <div className="w-full bg-[#DF3131]/40 group-hover:bg-[#DF3131] transition-colors rounded-t" style={{ height: `${h}%` }} />
                    <span className="text-[7px] text-white/40 truncate w-full text-center">{d.date.slice(5)}</span>
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
                  <span className="text-[12px] text-[#C9A227] font-heading font-bold">{r.count}</span>
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
                  <span className="text-[13px] text-[#C9A227] font-heading font-bold">{u.count}</span>
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
export function SeoTab({ data }: { data: SeoData }) {
  if (!data?.checks) return <Empty>No SEO data yet. Run an SEO check first.</Empty>;
  const passed = data.checks.filter((c) => c.status === "pass").length;
  const total = data.checks.length;
  const score = total > 0 ? Math.round((passed / total) * 100) : 0;
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center" style={{ borderColor: score >= 80 ? "#DF3131" : score >= 50 ? "#C9A227" : "#C00000" }}>
          <span className="text-[28px] font-heading font-bold" style={{ color: score >= 80 ? "#DF3131" : score >= 50 ? "#C9A227" : "#C00000" }}>{score}</span>
        </div>
        <div>
          <p className="text-[13px] text-white/50">{passed}/{total} checks passed</p>
          <p className="text-[11px] text-white/50 mt-1">Last checked: {data.checkedAt ? new Date(data.checkedAt).toLocaleString() : "unknown"}</p>
        </div>
      </div>
      <div className="bg-white/5 border border-white/10 overflow-hidden">
        {data.checks.map((c, i: number) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-0">
            <span className={`text-[14px] ${c.status === "pass" ? "text-[#DF3131]" : c.status === "warn" ? "text-[#C9A227]" : "text-[#C00000]"}`}>
              {c.status === "pass" ? "\u2713" : c.status === "warn" ? "\u26A0" : "\u2717"}
            </span>
            <div className="flex-1">
              <p className="text-[13px] text-white/70">{c.check}</p>
              {c.detail && <p className="text-[11px] text-white/50 mt-0.5">{c.detail}</p>}
            </div>
            <span className={`text-[10px] font-heading font-bold tracking-[0.1em] uppercase ${c.status === "pass" ? "text-[#DF3131]" : c.status === "warn" ? "text-[#C9A227]" : "text-[#C00000]"}`}>{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TRAFFIC TAB ───
export function TrafficTab({ data }: { data: AnalyticsSummary }) {
  if (!data?.period) return <Empty>No traffic data yet.</Empty>;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Views" value={data.total_pageviews} color="#DF3131" icon="◎" />
        <KpiCard label="Unique Visitors" value={data.unique_visitors} color="#C9A227" icon="◆" />
        <KpiCard label="Bounce Rate" value={Math.round(data.bounce_rate)} color="#C00000" icon="○" hint="Share of visitors who left after viewing only one page" />
        <KpiCard label="Avg Duration" value={Math.round(data.avg_duration_ms / 1000)} color="#DF3131" icon="⊙" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.top_pages?.length > 0 && (
          <div>
            <SectionTitle>Most Visited Pages</SectionTitle>
            <div className="bg-white/5 border border-white/10">
              {data.top_pages.slice(0, 15).map((p, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-0">
                  <span className="text-[11px] text-white/40 font-heading font-bold w-6">{i + 1}</span>
                  <span className="text-[12px] text-white/70 flex-1 truncate font-mono">{p.path}</span>
                  <span className="text-[12px] text-[#DF3131] font-heading font-bold">{p.views}</span>
                  <span className="text-[10px] text-white/50">{Math.round(p.avg_duration / 1000)}s avg</span>
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
                  <span className="text-[11px] text-white/40 font-heading font-bold w-6">{i + 1}</span>
                  <span className="text-[12px] text-white/70 flex-1 truncate">{r.referrer}</span>
                  <span className="text-[12px] text-[#C9A227] font-heading font-bold">{r.count}</span>
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
