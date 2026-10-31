"use client";

// Small shared UI pieces extracted from src/app/admin/page.tsx
// (oversized-file split, board S1). Moved verbatim, no behavior change.

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";

export function KpiCard({ label, value, color, icon, format, hint }: { label: string; value: number; color: string; icon: string; format?: string; hint?: string }) {
  const display = format === "currency" ? `$${value.toLocaleString(undefined,{minimumFractionDigits:2})}` : value.toLocaleString();
  return (
    <div className="bg-white/5 border border-white/10 p-5 hover:border-white/20 transition-colors" title={hint}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[14px]" style={{color}}>{icon}</span>
        <span className="text-[10px] text-white/50 font-heading font-bold tracking-[0.1em] uppercase">{label}</span>
      </div>
      <p className="text-[22px] font-heading font-bold" style={{color}}>{display}</p>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-size-12 font-heading font-bold tracking-[0.15em] uppercase text-white/60 mb-3 mt-6 text-left">{children}</h3>;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-center py-16 text-white/40 text-[13px]">{children}</div>;
}

export function Loader() {
  return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-white/20 border-t-[#DF3131] rounded-full animate-spin" /></div>;
}

export function PageLoader() {
  return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-[#DF3131] rounded-full animate-spin" /></div>;
}

export function AccountAuth() {
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
    <main className="admin-shell min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-size-28 font-heading font-bold text-white">Sign In</h1>
          <p className="text-white/60 text-[14px] mt-2">Sign in to access your WYZ Design account and rewards.</p>
        </div>

        <button onClick={() => signIn("google", { callbackUrl: "/admin" })}
          className="w-full flex items-center justify-center gap-3 bg-white text-[#333] py-3 font-bold text-sm hover:bg-gray-200 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#DF3131" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#C9A227" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#C00000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
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


export function NotAuthorized() {
  return <div className="text-center py-20"><h2 className="text-size-24 font-heading font-bold text-[#C00000] mb-2">Access Denied</h2><p className="text-white/60 text-[13px]">Your account does not have admin privileges.</p></div>;
}

