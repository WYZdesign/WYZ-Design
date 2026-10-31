"use client";

// Manage tab components (Forms/Users/Newsletter/Chats/Content)
// extracted from src/app/admin/page.tsx (oversized-file split, board
// S1). Moved verbatim, no behavior change.

import { useState } from "react";
import { logger } from "@/lib/logger";
import type { FormEntry, User, Subscriber, ChatsData, ChatSession, NsfwAdminData } from "@/lib/types/admin";
import { Empty } from "@/components/admin/AdminShared";

export function FormsTab({ data }: { data: FormEntry[] }) {
  // Hook must run before the early return below, or React throws
  // 'Rendered more hooks than during the previous render' the moment
  // this tab goes from empty data to populated data while mounted.
  const [filter, setFilter] = useState<string>("all");
  if (!data.length) return <Empty>No form submissions yet</Empty>;
  const types = [...new Set(data.map(f => f.formType))];
  const filtered = filter === "all" ? data : data.filter(f => f.formType === filter);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 text-[11px] font-heading font-bold tracking-[0.1em] uppercase border transition-all ${filter === "all" ? "bg-[#DF3131]/20 text-[#DF3131] border-[#DF3131]/30" : "bg-white/5 text-white/50 border-white/10 hover:text-white/60"}`}>All ({data.length})</button>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 text-[11px] font-heading font-bold tracking-[0.1em] uppercase border transition-all ${filter === t ? "bg-[#DF3131]/20 text-[#DF3131] border-[#DF3131]/30" : "bg-white/5 text-white/50 border-white/10 hover:text-white/60"}`}>{t.replace(/-/g," ")} ({data.filter(f => f.formType === t).length})</button>
        ))}
      </div>
      <div className="bg-white/5 border border-white/10 overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead><tr className="border-b border-white/10">
            <th className="px-5 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Type</th>
            <th className="px-5 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Data</th>
            <th className="px-5 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Date</th>
          </tr></thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="px-5 py-3"><span className="px-2 py-1 bg-[#DF3131]/10 text-[#DF3131] text-[10px] font-heading font-bold tracking-[0.05em] uppercase">{f.formType}</span></td>
                <td className="px-5 py-3 text-[12px] text-white/60 max-w-md truncate">{JSON.stringify(f.data).slice(0, 120)}</td>
                <td className="px-5 py-3 text-[12px] text-white/60 whitespace-nowrap">{new Date(f.submittedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── USERS TAB ───
export function UsersTab({ data }: { data: User[] }) {
  if (!data.length) return <Empty>No users found</Empty>;
  return (
    <div className="bg-white/5 border border-white/10 overflow-x-auto">
      <table className="w-full text-left min-w-[600px]">
        <thead><tr className="border-b border-white/10">
          <th className="px-5 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Email</th>
          <th className="px-5 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Name</th>
          <th className="px-5 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Role</th>
          <th className="px-5 py-3 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Provider</th>
        </tr></thead>
        <tbody>
          {data.map((u) => (
            <tr key={u.email} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
              <td className="px-5 py-3 text-[13px] text-white/70">{u.email}</td>
              <td className="px-5 py-3 text-[13px] text-white/50">{u.name || "-"}</td>
              <td className="px-5 py-3"><span className={`px-2 py-1 text-[10px] font-heading font-bold tracking-[0.05em] uppercase ${u.role === "admin" ? "bg-[#C00000]/10 text-[#C00000]" : "bg-white/5 text-white/50"}`}>{u.role}</span></td>
              <td className="px-5 py-3 text-[12px] text-white/60">{u.provider}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── NEWSLETTER TAB ───
export function NewsletterTab({ data }: { data: Subscriber[] }) {
  if (!data.length) return <Empty>No subscribers yet</Empty>;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-white/50">{data.length} subscriber{data.length !== 1 ? "s" : ""}</p>
        <a href="/api/admin?tab=newsletter&format=csv" className="px-4 py-2 bg-white/5 text-white/50 border border-white/10 text-[11px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-white/10 transition-all inline-block">↓ Export CSV</a>
      </div>
      <div className="bg-white/5 border border-white/10 overflow-hidden">
        {data.map((s, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0">
            <span className="text-[13px] text-white/70">{s.email}</span>
            <span className="text-[12px] text-white/50">{new Date(s.subscribedAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHATS TAB ───
export function ChatsTab({ data }: { data: ChatsData }) {
  const sessions: ChatSession[] = data?.sessions || [];
  if (!sessions.length) return <Empty>No chat sessions</Empty>;
  return (
    <div className="space-y-4">
      {sessions.map((s) => (
        <div key={s.sessionId} className="bg-white/5 border border-white/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] text-white/50 font-mono">{s.sessionId.slice(0, 12)}...</span>
            <span className="text-[11px] text-white/50">{s.messages} messages</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {s.preview?.map((m, i: number) => (
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

export function NsfwContentTab({ data, onRefresh }: { data: NsfwAdminData; onRefresh: () => void }) {
  const [clearing, setClearing] = useState(false);

  const handleClearCache = async (path: string) => {
    if (!confirm(`Clear scan cache for ${path}?`)) return;
    setClearing(true);
    try {
      await fetch(`/api/nsfw/admin`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: path }),
      });
      onRefresh();
    } catch (e) {
      logger.warn("nsfw-admin", `Clear failed: ${e}`);
    }
    setClearing(false);
  };

  const cachedEntries: { path: string; label: string; confidence: number; ts: number }[] = data?.cachedEntries || [];
  const verifiedUsers: { email: string; ts: number }[] = data?.verifiedUsers || [];
  const gatedCategories: string[] = data?.gatedCategories || [];

  return (
    <div className="space-y-8">
      {/* Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Gated Categories", value: gatedCategories.length },
          { label: "Scanned Images", value: cachedEntries.length },
          { label: "NSFW Detected", value: cachedEntries.filter(e => e.label !== "Neutral").length },
          { label: "Verified Users", value: verifiedUsers.length },
        ].map(s => (
          <div key={s.label} className="bg-white/5 border border-white/10 p-4">
            <p className="text-[10px] text-white/40 font-heading font-bold tracking-[0.1em] uppercase">{s.label}</p>
            <p className="text-[24px] font-heading font-bold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Gated Categories */}
      <div className="bg-white/5 border border-white/10 p-6">
        <h3 className="text-size-13 font-heading font-bold tracking-[0.1em] uppercase text-white/60 mb-4 text-left">Gated Categories</h3>
        <div className="flex flex-wrap gap-2">
          {gatedCategories.map(cat => (
            <span key={cat} className="px-3 py-1.5 bg-[#DF3131]/10 border border-[#DF3131]/30 text-[#DF3131] text-[11px] font-heading font-bold tracking-[0.05em] uppercase">
              {cat}
            </span>
          ))}
          {gatedCategories.length === 0 && (
            <p className="text-[12px] text-white/30">No gated categories configured.</p>
          )}
        </div>
        <p className="text-[11px] text-white/30 mt-3">NSFW categories are defined in <code className="text-white/50">src/lib/nsfw.ts</code> (NSFW_CATEGORIES).</p>
      </div>

      {/* Scan Results */}
      <div className="bg-white/5 border border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-size-13 font-heading font-bold tracking-[0.1em] uppercase text-white/60 text-left">Scan Results</h3>
          <button onClick={onRefresh} className="text-[11px] text-white/40 hover:text-white/60 transition-colors font-heading font-bold tracking-[0.05em] uppercase">
            Refresh
          </button>
        </div>
        {cachedEntries.length === 0 ? (
          <p className="text-[12px] text-white/30">No scan results cached yet. Images are scanned client-side when users view them.</p>
        ) : (
          <div className="bg-[#111] border border-white/10 overflow-x-auto max-h-96 overflow-y-auto admin-scrollbar">
            <table className="w-full text-left min-w-[600px]">
              <thead className="sticky top-0 bg-[#111]">
                <tr className="border-b border-white/10">
                  <th className="px-4 py-2.5 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Image</th>
                  <th className="px-4 py-2.5 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Label</th>
                  <th className="px-4 py-2.5 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Confidence</th>
                  <th className="px-4 py-2.5 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Scanned</th>
                  <th className="px-4 py-2.5 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cachedEntries.map((entry) => (
                  <tr key={entry.path} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-2.5 text-[11px] text-white/50 max-w-[250px] truncate font-mono">{entry.path}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 text-[10px] font-heading font-bold tracking-[0.05em] uppercase ${
                        entry.label === "Neutral" ? "bg-[#DF3131]/10 text-[#DF3131]" : "bg-[#C00000]/10 text-[#C00000]"
                      }`}>
                        {entry.label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-white/50">{(entry.confidence * 100).toFixed(1)}%</td>
                    <td className="px-4 py-2.5 text-[11px] text-white/40">{new Date(entry.ts).toLocaleDateString()}</td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => handleClearCache(entry.path)} disabled={clearing} className="text-[11px] text-[#C00000]/60 hover:text-[#C00000] transition-colors disabled:opacity-30">
                        Clear
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verified Users */}
      <div className="bg-white/5 border border-white/10 p-6">
        <h3 className="text-size-13 font-heading font-bold tracking-[0.1em] uppercase text-white/60 mb-4 text-left">Age-Verified Users</h3>
        {verifiedUsers.length === 0 ? (
          <p className="text-[12px] text-white/30">No users have verified age yet.</p>
        ) : (
          <div className="bg-[#111] border border-white/10 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-2.5 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Email</th>
                  <th className="px-4 py-2.5 text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">Verified</th>
                </tr>
              </thead>
              <tbody>
                {verifiedUsers.map(u => (
                  <tr key={u.email} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-2.5 text-[12px] text-white/60">{u.email}</td>
                    <td className="px-4 py-2.5 text-[11px] text-white/40">{new Date(u.ts).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
