"use client";

// System tabs (Health/Export) extracted from src/app/admin/page.tsx
// (oversized-file split, board S1). Moved verbatim, no behavior change.

import { useState, useEffect } from "react";
import { SectionTitle, Loader } from "@/components/admin/AdminShared";

export function HealthTab() {
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
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 ${health?.status === "ok" ? "bg-[#DF3131]/20 text-[#DF3131]" : "bg-[#C00000]/20 text-[#C00000]"}`}>
              {health?.status === "ok" ? "\u2713" : "\u2717"}
            </div>
            <p className="text-[11px] text-white/60">API Status</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 bg-[#DF3131]/20 text-[#DF3131]">{"\u2713"}</div>
            <p className="text-[11px] text-white/60">DB Connected</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 bg-[#DF3131]/20 text-[#DF3131]">{"\u2713"}</div>
            <p className="text-[11px] text-white/60">Analytics Active</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 bg-[#C9A227]/20 text-[#C9A227]">{"\u26A0"}</div>
            <p className="text-[11px] text-white/60">Vault Locked</p>
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
