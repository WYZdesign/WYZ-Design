"use client";

import { useState, useEffect } from "react";
import { logger } from "@/lib/logger";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { FiUser, FiFileText, FiCamera, FiGift, FiCreditCard, FiStar, FiMessageCircle, FiMenu, FiLogOut, FiMail, FiCheck, FiChevronDown, FiChevronUp, FiAlertCircle } from "react-icons/fi";

const ADMIN_STYLES = `
.admin-scrollbar { scrollbar-width: thin; scrollbar-color: #3a3a3a #1a1a1a; }
.admin-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
.admin-scrollbar::-webkit-scrollbar-track { background: #1a1a1a; }
.admin-scrollbar::-webkit-scrollbar-thumb { background: #3a3a3a; border-radius: 4px; }
.admin-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
.admin-scrollbar::-webkit-scrollbar-corner { background: #1a1a1a; }
`;

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
interface OverviewData { stats: { totalForms: number; totalChats: number; totalUsers: number; newsletterSubs: number; adminCount: number; chatSessions: number; formTypes: Record<string, number>; recentForms: { form_type: string; created_at: string; data: Record<string, unknown> }[] } }
interface SeoData { checks: { name: string; status: "pass" | "warn" | "fail"; message: string; check: string; detail?: string }[]; checkedAt: string }
interface ChatsData { sessions: ChatSession[] }

const NAV_SECTIONS: { label: string; items: { id: string; icon: string; label: string }[] }[] = [
  { label: "DASHBOARD", items: [{ id: "overview", icon: "◉", label: "Overview" }] },
  { label: "MONEY", items: [
    { id: "bookkeeping", icon: "$", label: "Bookkeeping" },
    { id: "income", icon: "▲", label: "Income" },
    { id: "expenses", icon: "▼", label: "Expenses" },
    { id: "reports", icon: "◇", label: "Reports" },
  ]},
  { label: "GROWTH", items: [
    { id: "analytics", icon: "◎", label: "Analytics" },
    { id: "seo", icon: "●", label: "SEO" },
    { id: "traffic", icon: "⊙", label: "Traffic" },
  ]},
  { label: "MANAGE", items: [
    { id: "forms", icon: "□", label: "Forms" },
    { id: "users", icon: "◆", label: "Users" },
    { id: "newsletter", icon: "●", label: "Newsletter" },
    { id: "chats", icon: "○", label: "Chats" },
    { id: "nsfw", icon: "!", label: "Content" },
  ]},
  { label: "SYSTEM", items: [
    { id: "health", icon: "◎", label: "Health" },
    { id: "export", icon: "↓", label: "Export" },
  ]},
  { label: "PROFILE", items: [
    { id: "profile", icon: "○", label: "Profile" },
    { id: "bugs", icon: "■", label: "Bug Report" },
  ]},
];

type TabId = "overview" | "bookkeeping" | "income" | "expenses" | "reports" | "analytics" | "seo" | "traffic" | "forms" | "users" | "newsletter" | "chats" | "nsfw" | "health" | "export" | "profile" | "bugs";

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

  useEffect(() => { if (status === "authenticated") fetchTab(); }, [status, tab]);

  if (status === "loading") return <PageLoader />;
  if (!session) return <AccountAuth />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
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
            <h1 className="text-[15px] font-heading font-bold tracking-[0.12em] uppercase text-white/60 truncate">
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


// ─── SHARED COMPONENTS ───
function KpiCard({ label, value, color, icon, format }: { label: string; value: number; color: string; icon: string; format?: string }) {
  const display = format === "currency" ? `$${value.toLocaleString(undefined,{minimumFractionDigits:2})}` : value.toLocaleString();
  return (
    <div className="bg-white/5 border border-white/10 p-5 hover:border-white/20 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[14px]" style={{color}}>{icon}</span>
        <span className="text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">{label}</span>
      </div>
      <p className="text-[22px] font-heading font-bold" style={{color}}>{display}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[12px] font-heading font-bold tracking-[0.15em] uppercase text-white/60 mb-3 mt-6">{children}</h3>;
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-center py-16 text-white/40 text-[13px]">{children}</div>;
}

function Loader() {
  return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-white/20 border-t-[#DF3131] rounded-full animate-spin" /></div>;
}

function PageLoader() {
  return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-[#DF3131] rounded-full animate-spin" /></div>;
}

function AccountAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Enter your email and admin key."); return; }
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) setError("Invalid email or admin key.");
    } catch { setError("Network error. Try again."); }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-heading font-bold text-white">Sign In</h1>
          <p className="text-white/60 text-[14px] mt-2">Sign in to access your WYZ Design account and rewards.</p>
        </div>

        <button onClick={() => signIn("google", { callbackUrl: "/admin" })}
          className="w-full flex items-center justify-center gap-3 bg-white text-[#333] py-3 font-bold text-sm hover:bg-gray-200 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[12px] text-white/40 uppercase tracking-wider">or sign in with email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-[11px] font-heading font-bold tracking-[0.1em] uppercase text-white/60 mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@wyzdesign.com"
              className="w-full bg-white/5 border border-white/10 text-white text-[14px] px-4 py-3 focus:outline-none focus:border-[#DF3131]/50 transition-colors placeholder:text-white/30" />
          </div>
          <div>
            <label className="block text-[11px] font-heading font-bold tracking-[0.1em] uppercase text-white/60 mb-1">Admin Key</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 text-white text-[14px] px-4 py-3 focus:outline-none focus:border-[#DF3131]/50 transition-colors placeholder:text-white/30" />
          </div>
          {error && <p className="flex items-center gap-2 text-[#DF3131] text-sm justify-center"><FiAlertCircle className="w-4 h-4 shrink-0" />{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-[#DF3131] text-white py-3 font-heading font-bold tracking-[0.12em] uppercase text-sm hover:bg-[#c12a2a] transition-colors disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-[12px] text-white/40 mt-8">
          <Link href="/home" className="hover:text-white transition-colors">&larr; Back to site</Link>
        </p>
      </div>
    </main>
  );
}

function ProfileTab({ session, update, signOut }: { session: import("next-auth").Session; update: () => Promise<import("next-auth").Session | null>; signOut: (options?: { callbackUrl?: string }) => Promise<void> }) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: session?.user?.name || "",
    bio: "", phone: "", website: "", instagram: "", facebook: "", avatarUrl: session?.user?.image || "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(data => {
      if (data.user) setProfile(prev => ({
        ...prev,
        name: data.user.name || prev.name,
        bio: data.user.bio || "", phone: data.user.phone || "",
        website: data.user.website || "", instagram: data.user.instagram || "",
        facebook: data.user.facebook || "", avatarUrl: data.user.avatarUrl || prev.avatarUrl,
      }));
    }).catch(() => {});
  }, []);

  async function saveProfile() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
      if (res.ok) { setSaved(true); setEditMode(false); await update(); setTimeout(() => setSaved(false), 3000); }
    } catch (e) { logger.warn("admin-profile", `Save profile failed: ${e}`); }
    setSaving(false);
  }

  const inputClass = "w-full bg-white/5 border border-white/10 text-white text-[13px] px-4 py-2.5 focus:outline-none focus:border-[#DF3131]/50 transition-colors placeholder:text-white/40";

  return (
    <div className="max-w-2xl">
      <div className="bg-white/5 border border-white/10 p-6 mb-6">
        <div className="flex items-start gap-5 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-[#DF3131] flex-shrink-0 flex items-center justify-center">
            {session?.user?.image ? (
              <Image src={session.user.image} alt={`${session?.user?.name || "Member"} profile photo`} width={64} height={64} className="w-full h-full object-cover" />
            ) : (
              <FiUser className="w-7 h-7 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-white text-lg truncate">{session?.user?.name || "Member"}</p>
            <p className="text-white/50 text-sm truncate flex items-center gap-1.5"><FiMail className="w-3.5 h-3.5 shrink-0" />{session?.user?.email}</p>
            <p className="text-[12px] text-white/40 mt-1">Signed in via {session?.user?.provider || "email"}</p>
          </div>
          <button onClick={() => setEditMode(!editMode)} className="text-sm text-[#DF3131] hover:underline font-bold uppercase tracking-wider whitespace-nowrap">
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        {saved && <p className="text-[#34A853] text-sm mb-4 text-center font-bold">Profile saved!</p>}

        {editMode ? (
          <div className="space-y-4">
            <ProfileField label="Display Name" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} inputClass={inputClass} />
            <ProfileField label="Bio" value={profile.bio} onChange={v => setProfile(p => ({ ...p, bio: v }))} textarea inputClass={inputClass} />
            <ProfileField label="Phone" value={profile.phone} onChange={v => setProfile(p => ({ ...p, phone: v }))} inputClass={inputClass} />
            <ProfileField label="Website" value={profile.website} onChange={v => setProfile(p => ({ ...p, website: v }))} placeholder="https://" inputClass={inputClass} />
            <ProfileField label="Instagram" value={profile.instagram} onChange={v => setProfile(p => ({ ...p, instagram: v }))} placeholder="@username" inputClass={inputClass} />
            <ProfileField label="Facebook" value={profile.facebook} onChange={v => setProfile(p => ({ ...p, facebook: v }))} placeholder="Profile URL" inputClass={inputClass} />
            <ProfileField label="Avatar URL" value={profile.avatarUrl} onChange={v => setProfile(p => ({ ...p, avatarUrl: v }))} placeholder="https://..." inputClass={inputClass} />
            <button onClick={saveProfile} disabled={saving} className="w-full bg-[#DF3131] text-white py-3 font-heading font-bold tracking-[0.12em] uppercase text-sm hover:bg-[#c12a2a] transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {profile.bio && <ProfileInfoRow label="Bio" value={profile.bio} />}
            {profile.phone && <ProfileInfoRow label="Phone" value={profile.phone} />}
            {profile.website && <ProfileInfoRow label="Website" value={profile.website} link />}
            {profile.instagram && <ProfileInfoRow label="Instagram" value={profile.instagram} />}
            {profile.facebook && <ProfileInfoRow label="Facebook" value={profile.facebook} link />}
            {!profile.bio && !profile.phone && !profile.website && !profile.instagram && !profile.facebook && (
              <p className="text-white/40 text-sm text-center py-4">No profile info yet. Click Edit to get started.</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 p-6 mb-6">
        <h3 className="text-[12px] font-heading font-bold tracking-[0.15em] uppercase text-white/60 mb-4">Account Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <ProfileActionLink href="/plans" label="View Plans" icon={<FiFileText className="w-4 h-4" />} />
          <ProfileActionLink href="/booking-calendar/photoshoot" label="Book a Shoot" icon={<FiCamera className="w-4 h-4" />} />
          <ProfileActionLink href="/gift-card" label="Gift Cards" icon={<FiGift className="w-4 h-4" />} />
          <ProfileActionLink href={process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL || "/plans"} label="Billing Portal" icon={<FiCreditCard className="w-4 h-4" />} external />
          <ProfileActionLink href="/loyalty" label="Rewards" icon={<FiStar className="w-4 h-4" />} />
          <ProfileActionLink href="/community" label="Community" icon={<FiMessageCircle className="w-4 h-4" />} />
          <ProfileActionLink href="/model-archive" label="Model Archive" icon={<FiUser className="w-4 h-4" />} />
        </div>
      </div>

      <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full py-3 border border-white/20 text-white/70 font-heading font-bold tracking-[0.12em] uppercase text-sm hover:bg-white hover:text-[#111] transition-all flex items-center justify-center gap-2">
        <FiLogOut className="w-4 h-4" /> Sign Out
      </button>
    </div>
  );
}

function ProfileField({ label, value, onChange, textarea, placeholder, inputClass }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; placeholder?: string; inputClass: string }) {
  return (
    <div>
      <label className="block text-[11px] font-heading font-bold tracking-[0.08em] uppercase text-white/60 mb-1">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} placeholder={placeholder} className={`${inputClass} resize-none`} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
      )}
    </div>
  );
}

function ProfileInfoRow({ label, value, link }: { label: string; value: string; link?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[11px] font-heading font-bold tracking-[0.08em] uppercase text-white/40 w-20 flex-shrink-0 pt-0.5">{label}</span>
      {link ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#DF3131] hover:underline break-all">{value}</a>
      ) : (
        <span className="text-[13px] text-white/80 break-all">{value}</span>
      )}
    </div>
  );
}

function ProfileActionLink({ href, label, icon, external }: { href: string; label: string; icon: React.ReactNode; external?: boolean }) {
  const Comp = external ? "a" : Link;
  return (
    <Comp href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center gap-2 px-3 py-2.5 border border-white/10 text-[13px] font-bold tracking-[0.05em] text-white/70 hover:border-[#DF3131]/50 hover:text-[#DF3131] transition-all">
      <span>{icon}</span> {label}
    </Comp>
  );
}

function BugReportTab({ session }: { session: import("next-auth").Session | null }) {
  const [open, setOpen] = useState(true);
  const [bugCat, setBugCat] = useState("");
  const [bugChecks, setBugChecks] = useState<string[]>([]);
  const [bugDesc, setBugDesc] = useState("");
  const [bugSent, setBugSent] = useState(false);

  const bugCategories = ["Visual / Styling", "Performance / Loading", "Broken Link / 404", "Form / Input Issue", "Mobile / Responsive", "Dark Mode", "Feature Request", "Other"];
  const bugCheckboxes: Record<string, string[]> = {
    "Visual / Styling": ["Text color", "Background", "Image", "Spacing / Layout", "Animation", "Typography"],
    "Performance / Loading": ["Slow page load", "Image not loading", "Video issue", "Hangs / freezes"],
    "Broken Link / 404": ["Nav link", "Footer link", "Button link", "Image link"],
    "Form / Input Issue": ["Not submitting", "Validation wrong", "Missing field"],
    "Mobile / Responsive": ["Too small", "Overflow / scroll", "Touch target", "Menu broken"],
    "Dark Mode": ["Colors wrong", "Toggle broken", "Text invisible"],
    "Feature Request": ["New feature", "Improvement", "Integration"],
    "Other": [],
  };

  const submit = async () => {
    if (!bugCat && !bugDesc) return;
    try { await fetch("/api/bugs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category: bugCat, issues: bugChecks, description: bugDesc, email: session?.user?.email, page: typeof window !== "undefined" ? window.location.href : "" }) }); } catch (e) { logger.warn("admin-bugs", `Submit failed: ${e}`); }
    setBugSent(true);
  };

  const selectClass = "w-full bg-white/5 border border-white/10 text-white text-[13px] px-4 py-2.5 focus:outline-none focus:border-[#DF3131]/50 transition-colors";
  const inputClass = "w-full bg-white/5 border border-white/10 text-white text-[13px] px-4 py-2.5 focus:outline-none focus:border-[#DF3131]/50 transition-colors placeholder:text-white/40";

  return (
    <div className="max-w-2xl">
      <div className="bg-white/5 border border-white/10 p-6">
        <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full">
          <h3 className="flex items-center gap-2 text-[13px] font-heading font-bold tracking-[0.1em] uppercase text-white/80"><FiAlertCircle className="w-4 h-4 text-[#DF3131]" /> Report a Bug / Issue</h3>
          {open ? <FiChevronUp className="w-5 h-5 text-white/50" /> : <FiChevronDown className="w-5 h-5 text-white/50" />}
        </button>
        {open && (
          <div className="mt-5 space-y-4">
            {bugSent ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-[#34A853]/20 text-[#34A853] flex items-center justify-center mx-auto mb-3"><FiCheck className="w-6 h-6" /></div>
                <p className="text-white font-heading font-bold text-lg mb-1">Submitted!</p>
                <p className="text-white/50 text-sm">Thanks, we&apos;ll review it and fix the issue.</p>
                <button onClick={() => { setBugSent(false); setBugCat(""); setBugChecks([]); setBugDesc(""); }} className="mt-4 text-[13px] text-[#DF3131] font-bold underline">Report another</button>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-[11px] font-heading font-bold tracking-[0.08em] uppercase text-white/60 mb-2">Category</label>
                  <select value={bugCat} onChange={e => { setBugCat(e.target.value); setBugChecks([]); }} className={selectClass}>
                    <option value="">- Select category -</option>
                    {bugCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {bugCat && (bugCheckboxes[bugCat]?.length || 0) > 0 && (
                  <div>
                    <label className="block text-[11px] font-heading font-bold tracking-[0.08em] uppercase text-white/60 mb-2">Specific Issue</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(bugCheckboxes[bugCat] || []).map(opt => (
                        <label key={opt} className="flex items-center gap-2 text-[13px] text-white/80 cursor-pointer">
                          <input type="checkbox" checked={bugChecks.includes(opt)} onChange={() => setBugChecks(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])} className="accent-[#DF3131]" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-heading font-bold tracking-[0.08em] uppercase text-white/60 mb-2">Describe the issue <span className="text-white/40 font-normal">({bugDesc.length}/1250)</span></label>
                  <textarea value={bugDesc} onChange={e => { if (e.target.value.length <= 1250) setBugDesc(e.target.value); }} rows={5} placeholder="What happened? What did you expect to happen? Which page were you on?" className={`${inputClass} resize-none`} />
                </div>
                <button onClick={submit} disabled={!bugDesc.trim()} className="w-full bg-[#DF3131] text-white py-3 font-heading font-bold tracking-[0.12em] uppercase text-sm hover:bg-[#c12a2a] transition-colors disabled:opacity-40">
                  Submit Report
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function NotAuthorized() {
  return <div className="text-center py-20"><h2 className="text-[24px] font-heading font-bold text-[#EA4335] mb-2">Access Denied</h2><p className="text-white/60 text-[13px]">Your account does not have admin privileges.</p></div>;
}

// ─── OVERVIEW ───
function OverviewTab({ data }: { data: OverviewData }) {
  const s = data?.stats;
  if (!s) return <Empty>No data yet</Empty>;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard label="Forms" value={s.totalForms} color="#DF3131" icon="□" />
        <KpiCard label="Chats" value={s.totalChats} color="#5865F2" icon="○" />
        <KpiCard label="Users" value={s.totalUsers} color="#34A853" icon="◆" />
        <KpiCard label="Newsletter" value={s.newsletterSubs} color="#FBBC05" icon="●" />
        <KpiCard label="Admins" value={s.adminCount} color="#EA4335" icon="◉" />
        <KpiCard label="Sessions" value={s.chatSessions} color="#D49341" icon="◎" />
      </div>
      {Object.keys(s.formTypes || {}).length > 0 && (
        <div>
          <SectionTitle>Forms by Type</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(s.formTypes).sort((a,b) => (b[1] as number)-(a[1] as number)).map(([type, count]) => (
              <div key={type} className="bg-white/5 border border-white/10 p-4">
                <span className="text-[18px] font-heading font-bold text-[#DF3131]">{String(count)}</span>
                <p className="text-[11px] text-white/60 capitalize mt-1">{type.replace(/-/g," ")}</p>
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
        <KpiCard label="Transactions" value={data.transaction_count} color="#5865F2" icon="◇" />
      </div>
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setShowForm("income")} className="px-5 py-3 bg-[#34A853]/20 text-[#34A853] border border-[#34A853]/30 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-[#34A853]/30 transition-all">+ Log Income</button>
        <button onClick={() => setShowForm("expense")} className="px-5 py-3 bg-[#EA4335]/20 text-[#EA4335] border border-[#EA4335]/30 text-[12px] font-heading font-bold tracking-[0.1em] uppercase hover:bg-[#EA4335]/30 transition-all">+ Log Expense</button>
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
                  {c.schedule_c_line && <span className="text-[10px] text-white/50 ml-2">{c.schedule_c_line}</span>}
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
                    <span className="text-[10px] text-white/60 group-hover:text-white/80">${(m.amount/1000).toFixed(1)}k</span>
                    <div className="w-full bg-[#34A853]/40 group-hover:bg-[#34A853] transition-colors rounded-t" style={{ height: `${h}%` }} />
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



function RevenueByCategoryCard({ year }: { year: number }) {
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
                  <span className="text-[14px] font-heading font-bold text-[#34A853]">${r.amount.toLocaleString(undefined,{minimumFractionDigits:2})}</span>
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
function IncomeTab({ data, onRefresh }: { data: { transactions: Transaction[] }; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const txns = data?.transactions || [];
  const total = txns.reduce((a, t) => a + t.amount, 0);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-[24px] font-heading font-bold text-[#34A853]">${total.toLocaleString(undefined,{minimumFractionDigits:2})}</p>
          <p className="text-[11px] text-white/50">{txns.length} transactions</p>
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
          <p className="text-[11px] text-white/50">{txns.length} transactions</p>
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
        <KpiCard label="Transactions" value={data.transaction_count} color="#5865F2" icon="◇" />
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
        <KpiCard label="Pageviews" value={data.total_pageviews} color="#DF3131" icon="◎" />
        <KpiCard label="Unique Visitors" value={data.unique_visitors} color="#5865F2" icon="◆" />
        <KpiCard label="Unique Pages" value={data.unique_pages} color="#34A853" icon="□" />
        <KpiCard label="Bounce Rate" value={Math.round(data.bounce_rate)} color="#EA4335" icon="○" />
        <KpiCard label="Pages/Session" value={Math.round(data.pages_per_session * 10) / 10} color="#FBBC05" icon="◇" />
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
function SeoTab({ data }: { data: SeoData }) {
  if (!data?.checks) return <Empty>No SEO data yet. Run an SEO check first.</Empty>;
  const passed = data.checks.filter((c) => c.status === "pass").length;
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
          <p className="text-[11px] text-white/50 mt-1">Last checked: {data.checkedAt ? new Date(data.checkedAt).toLocaleString() : "unknown"}</p>
        </div>
      </div>
      <div className="bg-white/5 border border-white/10 overflow-hidden">
        {data.checks.map((c, i: number) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-0">
            <span className={`text-[14px] ${c.status === "pass" ? "text-[#34A853]" : c.status === "warn" ? "text-[#FBBC05]" : "text-[#EA4335]"}`}>
              {c.status === "pass" ? "\u2713" : c.status === "warn" ? "\u26A0" : "\u2717"}
            </span>
            <div className="flex-1">
              <p className="text-[13px] text-white/70">{c.check}</p>
              {c.detail && <p className="text-[11px] text-white/50 mt-0.5">{c.detail}</p>}
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
        <KpiCard label="Total Views" value={data.total_pageviews} color="#DF3131" icon="◎" />
        <KpiCard label="Unique Visitors" value={data.unique_visitors} color="#5865F2" icon="◆" />
        <KpiCard label="Bounce Rate" value={Math.round(data.bounce_rate)} color="#EA4335" icon="○" />
        <KpiCard label="Avg Duration" value={Math.round(data.avg_duration_ms / 1000)} color="#34A853" icon="⊙" />
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
function UsersTab({ data }: { data: User[] }) {
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
              <td className="px-5 py-3"><span className={`px-2 py-1 text-[10px] font-heading font-bold tracking-[0.05em] uppercase ${u.role === "admin" ? "bg-[#EA4335]/10 text-[#EA4335]" : "bg-white/5 text-white/50"}`}>{u.role}</span></td>
              <td className="px-5 py-3 text-[12px] text-white/60">{u.provider}</td>
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
            <span className="text-[12px] text-white/50">{new Date(s.subscribedAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHATS TAB ───
function ChatsTab({ data }: { data: ChatsData }) {
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
            <p className="text-[11px] text-white/60">API Status</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 bg-[#34A853]/20 text-[#34A853]">{"\u2713"}</div>
            <p className="text-[11px] text-white/60">DB Connected</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 bg-[#34A853]/20 text-[#34A853]">{"\u2713"}</div>
            <p className="text-[11px] text-white/60">Analytics Active</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 bg-[#FBBC05]/20 text-[#FBBC05]">{"\u26A0"}</div>
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
            <p className="text-[11px] text-white/50 mt-1">{item.desc}</p>
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

  const inputClass = "w-full bg-white/5 border border-white/10 text-white text-[13px] px-4 py-2.5 focus:outline-none focus:border-[#DF3131]/50 transition-colors placeholder:text-white/40";
  const filteredCategories = categories.filter(c => type === "income" ? c.type === "income" : c.type === "expense");

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-6 space-y-4">
      <h3 className="text-[13px] font-heading font-bold tracking-[0.1em] uppercase text-white/60">{type === "income" ? "Log Income" : "Log Expense"}</h3>
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
                <td className="px-4 py-3"><span className={`px-2 py-0.5 text-[10px] font-heading font-bold tracking-[0.05em] uppercase ${t.type === "income" ? "bg-[#34A853]/10 text-[#34A853]" : "bg-[#EA4335]/10 text-[#EA4335]"}`}>{t.type}</span></td>
                <td className="px-4 py-3 text-[13px] font-heading font-bold" style={{ color: t.type === "income" ? "#34A853" : "#EA4335" }}>${t.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td className="px-4 py-3 text-[12px] text-white/60">{t.client_name || t.vendor || "-"}</td>
                <td className="px-4 py-3 text-[12px] text-white/60">{t.category_name || "-"}</td>
                <td className="px-4 py-3 text-[12px] text-white/60 capitalize">{t.channel || "-"}</td>
                <td className="px-4 py-3 text-[12px] text-white/60 capitalize">{t.business_personal || "business"}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(t.id)} className="text-[11px] text-[#EA4335]/60 hover:text-[#EA4335] transition-colors">Delete</button>
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

function NsfwContentTab({ data, onRefresh }: { data: NsfwAdminData; onRefresh: () => void }) {
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
        <h3 className="text-[13px] font-heading font-bold tracking-[0.1em] uppercase text-white/60 mb-4">Gated Categories</h3>
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
          <h3 className="text-[13px] font-heading font-bold tracking-[0.1em] uppercase text-white/60">Scan Results</h3>
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
                        entry.label === "Neutral" ? "bg-[#34A853]/10 text-[#34A853]" : "bg-[#EA4335]/10 text-[#EA4335]"
                      }`}>
                        {entry.label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-white/50">{(entry.confidence * 100).toFixed(1)}%</td>
                    <td className="px-4 py-2.5 text-[11px] text-white/40">{new Date(entry.ts).toLocaleDateString()}</td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => handleClearCache(entry.path)} disabled={clearing} className="text-[11px] text-[#EA4335]/60 hover:text-[#EA4335] transition-colors disabled:opacity-30">
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
        <h3 className="text-[13px] font-heading font-bold tracking-[0.1em] uppercase text-white/60 mb-4">Age-Verified Users</h3>
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
