"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Stats { totalForms: number; totalChats: number; chatSessions: number; totalUsers: number; adminCount: number; newsletterSubs: number; formTypes: Record<string,number>; submissionsByDay: [string,number][] }
interface FormEntry { id: string; formType: string; data: Record<string,unknown>; submittedAt: string; ip: string }
interface User { email: string; name: string; role: string; createdAt: string; provider: string }
interface ChatSession { sessionId: string; messages: number; lastMessage: string; preview: {role:string;content:string;timestamp:string}[] }
interface Subscriber { email: string; subscribedAt: string }

const TABS = ["overview","forms","users","chats","newsletter","export"] as const;

export default function AdminDashboard() {
  const sessionResult = useSession();
  const session = sessionResult?.data ?? null;
  const status = sessionResult?.status ?? "loading";
  const [tab, setTab] = useState<typeof TABS[number]>("overview");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (status === "authenticated") fetchTab(); }, [status, tab]);

  async function fetchTab() {
    setLoading(true);
    try {
      const email = session?.user?.email ? `&email=${encodeURIComponent(session.user.email)}` : "";
      const r = await fetch(`/api/admin?tab=${tab === "export" ? "overview" : tab}${email}`);
      if (r.status === 403) { setData({ forbidden: true }); return; }
      setData(await r.json());
    } catch (e) { console.warn("[admin-page] Failed to fetch admin data", e); }
    setLoading(false);
  }

  if (status === "loading") return <PageLoader />;
  if (!session) return <NeedSignIn />;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      <div className="max-w-[140rem] mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between py-6 border-b border-white/10 mb-6">
          <div>
            <h1 className="text-[20px] font-heading font-bold tracking-[0.15em] uppercase mb-6 sm:mb-8">WYZ Admin</h1>
            <p className="text-[13px] text-white/40">{session.user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-[#DF3131]/20 text-[#DF3131] text-[11px] font-bold tracking-[0.1em] uppercase border border-[#DF3131]/30 mb-2">ADMIN</span>
            <Link href="/account/my-account" className="text-[13px] text-white/50 hover:text-white transition-colors">My Account</Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8 gap-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-3 text-[12px] font-heading font-bold tracking-[0.12em] uppercase transition-all ${tab === t ? "text-[#DF3131] border-b-2 border-[#DF3131] bg-[#DF3131]/5" : "text-white/40 hover:text-white/70"}`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? <Loader /> : data?.forbidden ? <NotAuthorized /> : (
          <>
            {tab === "overview" && <OverviewTab data={data as {stats:Stats;recentForms:FormEntry[]}} />}
            {tab === "forms" && <FormsTab data={(data as {submissions:FormEntry[]})?.submissions || []} />}
            {tab === "users" && <UsersTab data={(data as {users:User[]})?.users || []} />}
            {tab === "chats" && <ChatsTab data={data} />}
            {tab === "newsletter" && <NewsletterTab data={(data as {subscribers:Subscriber[]})?.subscribers || []} />}
            {tab === "export" && <ExportTab />}

          </>
        )}
      </div>
    </main>
  );
}

function OverviewTab({ data }: { data: { stats: Stats; recentForms: FormEntry[] } }) {
  const s = data?.stats;
  if (!s) return <Empty>No data yet</Empty>;

  const formTotal = Object.values(s.formTypes || {}).reduce((a,b) => a+b, 0);

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Form Submissions" value={s.totalForms} color="#DF3131" />
        <StatCard label="Chat Messages" value={s.totalChats} color="#5865F2" />
        <StatCard label="Chat Sessions" value={s.chatSessions} color="#D49341" />
        <StatCard label="Registered Users" value={s.totalUsers} color="#34A853" />
        <StatCard label="Newsletter Subs" value={s.newsletterSubs} color="#FBBC05" />
        <StatCard label="Admins" value={s.adminCount} color="#EA4335" />
      </div>

      {/* Form Type Breakdown */}
      {Object.keys(s.formTypes || {}).length > 0 && (
        <div>
          <h3 className="font-heading font-bold text-[13px] tracking-[0.1em] uppercase text-white/60 mb-3">Form Submissions by Type</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(s.formTypes).sort((a,b) => b[1]-a[1]).map(([type, count]) => (
              <div key={type} className="bg-white/5 border border-white/10 p-4 flex items-center justify-between">
                <span className="text-[13px] text-white/70 capitalize">{type.replace(/-/g," ")}</span>
                <span className="text-[18px] font-heading font-bold text-[#DF3131]">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submissions chart */}
      {s.submissionsByDay?.length > 0 && (
        <div>
          <h3 className="font-heading font-bold text-[13px] tracking-[0.1em] uppercase text-white/60 mb-3">Submissions Over Time</h3>
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="flex items-end gap-1 h-32">
              {s.submissionsByDay.map(([day, count]) => {
                const max = Math.max(...(s.submissionsByDay.map(([,c]) => c)));
                const h = max > 0 ? (count/max)*100+10 : 10;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[10px] text-white/40 group-hover:text-white/80 transition-colors">{count}</span>
                    <div className="w-full bg-[#DF3131]/40 group-hover:bg-[#DF3131] transition-colors rounded-t" style={{ height: `${h}%` }} />
                    <span className="text-[9px] text-white/30 whitespace-nowrap -rotate-45 origin-top-left mt-1 hidden sm:block">{day.slice(5)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recent Forms */}
      {data?.recentForms?.length > 0 && (
        <div>
          <h3 className="font-heading font-bold text-[13px] tracking-[0.1em] uppercase text-white/60 mb-3">Recent Submissions</h3>
          <div className="bg-white/5 border border-white/10 overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-4 py-3 text-white/40 font-heading font-bold tracking-[0.08em] uppercase">Type</th>
                  <th className="px-4 py-3 text-white/40 font-heading font-bold tracking-[0.08em] uppercase">Name/Email</th>
                  <th className="px-4 py-3 text-white/40 font-heading font-bold tracking-[0.08em] uppercase">Date</th>
                  <th className="px-4 py-3 text-white/40 font-heading font-bold tracking-[0.08em] uppercase">IP</th>
                </tr>
              </thead>
              <tbody>
                {data.recentForms.map((f: FormEntry) => (
                  <tr key={f.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-2.5"><FormTypeBadge type={f.formType} /></td>
                    <td className="px-4 py-2.5 text-white/70">{String(f.data?.name || f.data?.email || "—")}</td>
                    <td className="px-4 py-2.5 text-white/40">{f.submittedAt ? new Date(f.submittedAt).toLocaleString() : "—"}</td>
                    <td className="px-4 py-2.5 text-white/30 text-[11px]">{f.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function FormsTab({ data }: { data: FormEntry[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const types = useMemo(() => [...new Set(data.map(f => f.formType))], [data]);
  const filtered = useMemo(() => data.filter(f => {
    if (typeFilter && f.formType !== typeFilter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return JSON.stringify(f.data).toLowerCase().includes(s) || f.formType.toLowerCase().includes(s) || f.ip.toLowerCase().includes(s);
  }), [data, search, typeFilter]);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search submissions..." className="px-4 py-2 bg-white/5 border border-white/20 text-white text-[13px] placeholder-white/30 outline-none focus:border-[#DF3131] w-64" />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2 bg-white/5 border border-white/20 text-white/70 text-[13px] outline-none focus:border-[#DF3131]">
          <option value="">All Types ({data.length})</option>
          {types.map(t => <option key={t} value={t}>{t} ({data.filter(f => f.formType === t).length})</option>)}
        </select>
      </div>
      {filtered.length === 0 ? <Empty>No submissions found</Empty> : (
        <div className="space-y-2">
          {filtered.map(f => (
            <div key={f.id} className="bg-white/5 border border-white/10">
              <button onClick={() => setExpanded(expanded === f.id ? null : f.id)}
                className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <FormTypeBadge type={f.formType} />
                  <span className="text-white/40 text-[12px]">{f.submittedAt ? new Date(f.submittedAt).toLocaleString() : ""}</span>
                </div>
                <span className="text-white/30 text-[11px]">▼</span>
              </button>
              {expanded === f.id && (
                <div className="px-5 py-4 border-t border-white/10 bg-white/[0.02]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(f.data).filter(([,v]) => v !== undefined && v !== null && String(v).trim()).map(([k,v]) => (
                      <div key={k}>
                        <span className="text-[11px] text-white/30 uppercase tracking-[0.05em]">{k.replace(/([A-Z])/g," $1").replace(/^./,s => s.toUpperCase())}</span>
                        <p className="text-[14px] text-white/80 mt-0.5">{String(v)}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/20 mt-4">ID: {f.id} | IP: {f.ip}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UsersTab({ data }: { data: User[] }) {
  return (
    <div className="bg-white/5 border border-white/10 overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead><tr className="border-b border-white/10 text-left">
          <th className="px-4 py-3 text-white/40 font-heading font-bold tracking-[0.08em] uppercase">Email</th>
          <th className="px-4 py-3 text-white/40 font-heading font-bold tracking-[0.08em] uppercase">Name</th>
          <th className="px-4 py-3 text-white/40 font-heading font-bold tracking-[0.08em] uppercase">Role</th>
          <th className="px-4 py-3 text-white/40 font-heading font-bold tracking-[0.08em] uppercase">Provider</th>
          <th className="px-4 py-3 text-white/40 font-heading font-bold tracking-[0.08em] uppercase">Joined</th>
        </tr></thead>
        <tbody>{data.map((u,i) => (
          <tr key={i} className="border-b border-white/5 hover:bg-white/5">
            <td className="px-4 py-2.5 text-white/70">{u.email}</td>
            <td className="px-4 py-2.5 text-white/50">{u.name || "—"}</td>
            <td className="px-4 py-2.5"><span className={`px-2 py-0.5 text-[11px] font-bold uppercase ${u.role==="admin"?"bg-[#DF3131]/20 text-[#DF3131]":"bg-white/10 text-white/50"}`}>{u.role||"user"}</span></td>
            <td className="px-4 py-2.5 text-white/40">{u.provider||"email"}</td>
            <td className="px-4 py-2.5 text-white/40">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
          </tr>
        ))}</tbody>
      </table>
      {data.length === 0 && <Empty>No users yet (Neo4j may be offline)</Empty>}
    </div>
  );
}

function ChatsTab({ data }: { data: { totalMessages: number; totalSessions: number; sessions: ChatSession[] } }) {
  if (!data?.sessions?.length) return <Empty>No chat sessions yet</Empty>;
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard label="Total Messages" value={data.totalMessages} color="#5865F2" />
        <StatCard label="Total Sessions" value={data.totalSessions} color="#D49341" />
      </div>
      <div className="space-y-3">
        {data.sessions.map(s => (
          <div key={s.sessionId} className="bg-white/5 border border-white/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-white/40 font-mono">{s.sessionId}</span>
              <span className="text-[12px] text-white/30">{s.messages} messages</span>
            </div>
            {s.preview?.map((m,i) => (
              <p key={i} className={`text-[13px] ${m.role==="user"?"text-white/60":"text-[#5865F2]/70"} mb-1`}>
                <span className="text-[10px] uppercase tracking-[0.05em] mr-2">{m.role}</span>
                {m.content?.slice(0, 200)}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsletterTab({ data }: { data: Subscriber[] }) {
  return (
    <div>
      <StatCard label="Total Subscribers" value={data.length} color="#FBBC05" />
      <div className="mt-6 bg-white/5 border border-white/10 overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead><tr className="border-b border-white/10 text-left">
            <th className="px-4 py-3 text-white/40 font-heading font-bold tracking-[0.08em] uppercase">Email</th>
            <th className="px-4 py-3 text-white/40 font-heading font-bold tracking-[0.08em] uppercase">Subscribed</th>
            <th className="px-4 py-3 text-white/40 font-heading font-bold tracking-[0.08em] uppercase">Status</th>
          </tr></thead>
          <tbody>{data.map((s,i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
              <td className="px-4 py-2.5 text-white/70">{s.email}</td>
              <td className="px-4 py-2.5 text-white/40">{s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString() : "—"}</td>
              <td className="px-4 py-2.5"><span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[11px] font-bold">ACTIVE</span></td>
            </tr>
          ))}</tbody>
        </table>
        {data.length === 0 && <Empty>No subscribers (Neo4j may be offline)</Empty>}
      </div>
    </div>
  );
}

function ExportTab() {
  const { data: session } = useSession();
  const email = session?.user?.email ? `&email=${encodeURIComponent(session.user.email)}` : "";
  return (
    <div className="text-center py-12">
      <h2 className="font-heading font-bold text-[18px] mb-4">Export Data</h2>
      <p className="text-white/50 text-[14px] mb-8">Download all form submissions as CSV</p>
      <a href={`/api/admin?tab=export${email}`} className="inline-block px-8 py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.12em] uppercase text-[14px] hover:bg-[#B82020] transition-all">
        Download CSV
      </a>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6">
      <p className="text-[28px] font-heading font-bold" style={{ color }}>{value.toLocaleString()}</p>
      <p className="text-[11px] text-white/40 font-heading font-bold tracking-[0.1em] uppercase mb-2">{label}</p>
    </div>
  );
}

function FormTypeBadge({ type }: { type: string }) {
  const colors: Record<string,string> = { "contact":"#5865F2","photoshoot-booking":"#34A853","consultation-booking":"#D49341","custom-plan":"#EA4335","featured-artist-application":"#FFD700","model-application":"#00D4FF" };
  return <span className="px-2 py-0.5 text-[11px] font-bold uppercase whitespace-nowrap mb-2" style={{ background: `${colors[type] || "#DF3131"}20`, color: colors[type] || "#DF3131" }}>{type.replace(/-/g," ")}</span>;
}

function Empty({ children }: { children: string }) {
  return <p className="text-center text-white/30 py-12">{children}</p>;
}

function Loader() {
  return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-white/10 border-t-[#DF3131] rounded-full animate-spin" /></div>;
}


function PageLoader() {
  return <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><Loader /></main>;
}

function NeedSignIn() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-[24px] font-heading font-bold text-white tracking-[0.1em] mb-6 sm:mb-8">Admin Access Required</h1>
        <p className="text-white/50 mb-6">Sign in with an admin account to continue.</p>
        <Link href="/account/my-account" className="inline-block px-8 py-3 bg-[#DF3131] text-white font-heading font-bold tracking-[0.1em] uppercase text-[14px] hover:bg-[#B82020] transition-all">Sign In</Link>
      </div>
    </main>
  );
}

function NotAuthorized() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-[24px] font-heading font-bold text-white tracking-[0.1em] mb-6 sm:mb-8">Access Denied</h1>
        <p className="text-white/50 mb-6">Your account is not authorized to view the admin panel.</p>
        <Link href="/account/my-account" className="inline-block px-8 py-3 bg-[#DF3131] text-white font-heading font-bold tracking-[0.1em] uppercase text-[14px] hover:bg-[#B82020] transition-all">My Account</Link>
      </div>
    </main>
  );
}
