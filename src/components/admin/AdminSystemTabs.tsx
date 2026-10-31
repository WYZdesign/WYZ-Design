"use client";

// System tabs (Health/Export) extracted from src/app/admin/page.tsx
// (oversized-file split, board S1). Moved verbatim, no behavior change.

import { useState, useEffect } from "react";
import { SectionTitle, Loader } from "@/components/admin/AdminShared";
import type { CronJobStatus, IntegrationStatus } from "@/lib/cron-heartbeat";

function ago(minutes: number | null): string {
  if (minutes === null) return "never";
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const h = Math.floor(minutes / 60);
  if (h < 48) return `${h}h ${minutes % 60}m ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function HealthTab() {
  const [health, setHealth] = useState<any>(null);
  const [automations, setAutomations] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    Promise.all([
      fetch("/api/health").then(r => r.json()).catch(() => ({ error: "unreachable" })),
      fetch("/api/admin?tab=automations").then(r => r.json()).catch(() => null),
    ]).then(([h, a]) => { setHealth(h); setAutomations(a); }).finally(() => setChecking(false));
  }, []);
  if (checking) return <Loader />;

  const jobs = (automations?.jobs || []) as CronJobStatus[];
  const failed = jobs.filter(j => j.status === "failed").length;
  const stale = jobs.filter(j => j.status === "stale" || j.status === "never").length;
  const autoOk = jobs.length > 0 && failed === 0 && stale === 0;
  const autoWarn = jobs.length > 0 && failed === 0 && stale > 0;
  const okCount = jobs.filter(j => j.status === "ok").length;

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 p-6">
        <SectionTitle>Site Health</SectionTitle>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 ${health?.status === "ok" ? "bg-[#DF3131]/20 text-[#DF3131]" : "bg-[#C00000]/20 text-[#C00000]"}`}>
              {health?.status === "ok" ? "\u2713" : "\u2717"}
            </div>
            <p className="text-[11px] text-white/60">API Status</p>
          </div>
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 ${health?.redis === "ok" ? "bg-[#DF3131]/20 text-[#DF3131]" : "bg-[#C00000]/20 text-[#C00000]"}`}>
              {health?.redis === "ok" ? "\u2713" : "\u2717"}
            </div>
            <p className="text-[11px] text-white/60">DB Connected</p>
          </div>
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 ${health?.redis === "ok" ? "bg-[#DF3131]/20 text-[#DF3131]" : "bg-[#C00000]/20 text-[#C00000]"}`}>
              {health?.redis === "ok" ? "\u2713" : "\u2717"}
            </div>
            <p className="text-[11px] text-white/60">Analytics Active</p>
          </div>
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 ${autoOk ? "bg-[#DF3131]/20 text-[#DF3131]" : autoWarn ? "bg-[#C9A227]/20 text-[#C9A227]" : "bg-[#C00000]/20 text-[#C00000]"}`}>
              {autoOk ? "\u2713" : autoWarn ? "\u26A0" : "\u2717"}
            </div>
            <p className="text-[11px] text-white/60">Automations{jobs.length ? ` ${okCount}/${jobs.length}` : ""}</p>
          </div>
        </div>
      </div>
      <div className="bg-white/5 border border-white/10 p-6">
        <SectionTitle>System Info</SectionTitle>
        <div className="grid grid-cols-2 gap-4 mt-4 text-[12px]">
          <div><span className="text-white/50">Uptime:</span> <span className="text-white/70">{health?.uptime || "unknown"}</span></div>
          <div><span className="text-white/50">Node:</span> <span className="text-white/70">{health?.node || "unknown"}</span></div>
          <div><span className="text-white/50">Environment:</span> <span className="text-white/70">{health?.env || "production"}</span></div>
          <div><span className="text-white/50">Version:</span> <span className="text-white/70">{health?.version || "1.0"}</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── AUTOMATIONS TAB ───
export function AutomationsTab({ data }: { data: any }) {
  if (!data?.jobs) return <Loader />;
  const jobs = data.jobs as CronJobStatus[];
  const integrations = (data.integrations || []) as IntegrationStatus[];

  const chip = (status: CronJobStatus["status"]) => {
    const map: Record<string, string> = {
      ok: "bg-[#DF3131]/15 text-[#DF3131] border-[#DF3131]/30",
      failed: "bg-[#C00000]/20 text-[#C00000] border-[#C00000]/40",
      stale: "bg-[#C9A227]/15 text-[#C9A227] border-[#C9A227]/30",
      never: "bg-white/5 text-white/40 border-white/10",
    };
    return map[status] || map.never;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 p-6">
        <SectionTitle>Scheduled Jobs</SectionTitle>
        <p className="text-[11px] text-white/40 mt-1">
          Runs on Vercel Cron (times are UTC). A job goes stale when it misses two expected runs.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-[12px]">
            <thead>
              <tr className="text-left text-white/40 text-[10px] uppercase tracking-[0.1em] border-b border-white/10">
                <th className="py-2 pr-4 font-bold">Job</th>
                <th className="py-2 pr-4 font-bold">Schedule</th>
                <th className="py-2 pr-4 font-bold">Last Run</th>
                <th className="py-2 pr-4 font-bold">Result</th>
                <th className="py-2 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-b border-white/5">
                  <td className="py-3 pr-4">
                    <p className="text-white/80">{j.label}</p>
                    <p className="text-[10px] text-white/35">{j.path}</p>
                  </td>
                  <td className="py-3 pr-4 text-white/60 whitespace-nowrap">{j.schedule}</td>
                  <td className="py-3 pr-4 text-white/60 whitespace-nowrap">{ago(j.ageMinutes)}</td>
                  <td className="py-3 pr-4 text-white/50 max-w-[220px] truncate" title={j.lastRun?.detail || ""}>
                    {j.lastRun?.detail || "-"}
                  </td>
                  <td className="py-3">
                    <span className={`inline-block px-2 py-0.5 border text-[10px] font-bold uppercase tracking-[0.08em] ${chip(j.status)}`}>
                      {j.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-6">
        <SectionTitle>Integrations</SectionTitle>
        <p className="text-[11px] text-white/40 mt-1">
          Configured means the key is present in this deployment. It is a presence check, not a live connection test.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {integrations.map((i) => (
            <div key={i.name} className="flex items-center gap-3 bg-black/20 border border-white/10 px-4 py-3">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${i.configured ? "bg-[#DF3131]" : "bg-white/20"}`} />
              <div className="min-w-0">
                <p className="text-[12px] text-white/80">{i.name}</p>
                <p className="text-[10px] text-white/40">{i.note}</p>
              </div>
              <span className={`ml-auto text-[10px] font-bold uppercase tracking-[0.08em] ${i.configured ? "text-[#DF3131]" : "text-white/30"}`}>
                {i.configured ? "on" : "off"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── EXPORT TAB ───
export function ExportTab() {
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
            <p className="text-[11px] text-white/50 mt-1">{item.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}



// ─── TRANSACTION FORM ───
