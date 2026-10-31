// Shared types + nav/tab config extracted from src/app/admin/page.tsx
// (oversized-file split, board S1). Pure types and data, no JSX.

export interface FormEntry { id: string; formType: string; data: Record<string,unknown>; submittedAt: string; ip: string }
export interface User { email: string; name: string; role: string; createdAt: string; provider: string }
export interface Subscriber { email: string; subscribedAt: string }
export interface Transaction { id: number; date: string; type: string; amount: number; client_name?: string; vendor: string; category_name?: string; channel: string; description: string; business_personal: string; created_at: string }
export interface FinancialSummary { year: number; total_income: number; total_expenses: number; net_profit: number; income_by_client: { client: string; amount: number }[]; expenses_by_category: { category: string; schedule_c_line: string; amount: number }[]; income_by_channel: { channel: string; amount: number }[]; monthly_income: { month: string; amount: number }[]; monthly_expenses: { month: string; amount: number }[]; transaction_count: number }
export interface AnalyticsSummary { period: string; total_pageviews: number; unique_visitors: number; unique_pages: number; avg_duration_ms: number; top_pages: { path: string; views: number; avg_duration: number }[]; top_referrers: { referrer: string; count: number }[]; top_utm_sources: { source: string; count: number }[]; device_breakdown: { device: string; count: number }[]; browser_breakdown: { browser: string; count: number }[]; daily_views: { date: string; views: number; unique: number }[]; bounce_rate: number; pages_per_session: number }
export interface Category { id: number; name: string; schedule_c_line: string; type: string }
export interface Client { id: number; name: string; email: string; notes: string }
export interface ChatSession { sessionId: string; messages: number; lastMessage: string; preview: {role:string;content:string;timestamp:string}[] }
export interface OverviewData { stats: { totalForms: number; totalChats: number; totalUsers: number; newsletterSubs: number; adminCount: number; chatSessions: number; formTypes: Record<string, number> }; recentForms: { formType: string; submittedAt: string; data: Record<string, unknown> }[] }
export interface SeoData { checks: { name: string; status: "pass" | "warn" | "fail"; message: string; check: string; detail?: string }[]; checkedAt: string }
export interface ChatsData { sessions: ChatSession[] }

export const NAV_SECTIONS: { label: string; items: { id: string; icon: string; label: string }[] }[] = [
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
    { id: "automations", icon: "⟳", label: "Automations" },
    { id: "export", icon: "↓", label: "Export" },
  ]},
  { label: "PROFILE", items: [
    { id: "profile", icon: "○", label: "Profile" },
    { id: "bugs", icon: "■", label: "Bug Report" },
  ]},
];

export type TabId = "overview" | "bookkeeping" | "income" | "expenses" | "reports" | "analytics" | "seo" | "traffic" | "forms" | "users" | "newsletter" | "chats" | "nsfw" | "health" | "automations" | "export" | "profile" | "bugs";

export interface NsfwAdminData {
  gatedCategories: string[];
  cachedEntries: { path: string; label: string; confidence: number; ts: number }[];
  verifiedUsers: { email: string; ts: number }[];
}

