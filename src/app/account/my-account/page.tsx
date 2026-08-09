"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiFileText, FiCamera, FiGift, FiCreditCard, FiStar, FiMessageCircle, FiSettings, FiUser } from "react-icons/fi";
export default function MyAccountPage() {
 return (
 <Suspense fallback={<div className="min-h-screen bg-white dark:bg-[#1C1C1E] pb-20"><div className="max-w-md mx-auto px-6 text-center py-20"><p className="text-[#888] dark:text-white/50">Loading...</p></div></div>}>
 <MyAccount />
 </Suspense>
 );
}

function MyAccount() {
  const sessionResult = useSession();
  const session = sessionResult?.data ?? null;
  const status = sessionResult?.status ?? "loading";
  const update = sessionResult?.update;
 const searchParams = useSearchParams();
 const isVerify = searchParams.get("verify") === "1";
 const authError = searchParams.get("error");
 const [tab, setTab] = useState<"login" | "register">("login");
 const [email, setEmail] = useState("");
 const [name, setName] = useState("");
 const [password, setPassword] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 if (status === "loading") {
 return (
 <main className="min-h-screen bg-white dark:bg-[#1C1C1E] pb-20">
  <div className="max-w-md mx-auto px-6 text-center py-20">
  <p className="text-[#888] dark:text-white/50">Loading...</p>
  </div>
  </main>
 );
 }

 if (session) return <AuthenticatedDashboard session={session} update={update} signOut={signOut} />;

 if (isVerify || error === "check-email") {
 return (
 <main className="min-h-screen bg-white dark:bg-[#1C1C1E] pb-20">
  <div className="max-w-md mx-auto px-6 text-center py-20">
  <div className="w-16 h-16 bg-[#DF3131] rounded-full flex items-center justify-center mx-auto mb-6">
  <span className="text-white text-2xl">&#9993;</span>
  </div>
  <h1 className="text-2xl font-heading font-bold text-[#333] dark:text-white mb-4">Check Your Email</h1>
  <p className="text-[#666] dark:text-white/70 text-[15px] leading-relaxed">
 We sent a magic link to <strong>{email}</strong>. Click the link in the email to sign in.
 </p>
  <p className="text-[#888] dark:text-white/50 text-[13px] mt-4">The link expires in 10 minutes.</p>
 </div>
 </main>
 );
 }

 async function handleSignIn(e: React.FormEvent) {
 e.preventDefault();
 if (!email) return;
 setLoading(true);
 setError("");
 try {
 const result = await signIn("credentials", { email, password, redirect: false });
 if (result?.error) setError(result.error);
 } catch { setError("Network error. Try again."); }
 setLoading(false);
 }

 async function handleRegister(e: React.FormEvent) {
 e.preventDefault();
 if (!email || !name) return;
 setLoading(true);
 setError("");
 try {
 const result = await signIn("email", { email, redirect: false });
 if (result?.error) setError("Registration failed. Please try again.");
 else setError("check-email");
 } catch { setError("Network error. Try again."); }
 setLoading(false);
 }

 return (
 <main className="min-h-screen bg-white dark:bg-[#1C1C1E] pb-20">
  <div className="max-w-md mx-auto px-6">
  <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333] dark:text-white mb-8 text-center">
 My Account
 </h1>

 {/* Social Login */}
 <div className="space-y-3 mb-6">
 <button onClick={() => signIn("google", { callbackUrl: "/account/my-account" })}
 className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#252528] text-[#333] dark:text-white border-2 border-[#E2E2E2] dark:border-[#444] py-3 font-bold text-sm hover:border-[#333] dark:hover:border-white transition-colors">
 <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
 Continue with Google
 </button>
 </div>

 <div className="flex items-center gap-4 mb-6">
  <div className="flex-1 h-px bg-gray-200 dark:bg-[#444]" />
  <span className="text-[12px] text-[#aaa] dark:text-white/50 uppercase tracking-wider">or use email</span>
  <div className="flex-1 h-px bg-gray-200 dark:bg-[#444]" />
  </div>

  <div className="flex border-b border-gray-200 dark:border-[#444] mb-8">
  <button onClick={() => setTab("login")} className={`flex-1 py-3 font-heading font-bold tracking-[0.15em] uppercase text-sm transition-colors ${tab === "login" ? "text-[#DF3131] border-b-2 border-[#DF3131]" : "text-[#666] dark:text-white/70 hover:text-[#333] dark:hover:text-white"}`}>
  Sign In
  </button>
  <button onClick={() => setTab("register")} className={`flex-1 py-3 font-heading font-bold tracking-[0.15em] uppercase text-sm transition-colors ${tab === "register" ? "text-[#DF3131] border-b-2 border-[#DF3131]" : "text-[#666] dark:text-white/70 hover:text-[#333] dark:hover:text-white"}`}>
  Create Account
  </button>
  </div>

 {error && <p className="text-[#DF3131] text-sm text-center mb-4">{error}</p>}

 {tab === "login" ? (
 <form onSubmit={handleSignIn} className="space-y-4">
  <div>
  <label className="block text-sm font-heading font-bold tracking-[0.1em] uppercase text-[#333] dark:text-white mb-1">Email</label>
  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 dark:border-[#444] px-4 py-3 text-[#333] dark:text-white bg-white dark:bg-[#252528] focus:border-[#DF3131] focus:outline-none" placeholder="your@email.com" />
  </div>
  <div>
  <label className="block text-sm font-heading font-bold tracking-[0.1em] uppercase text-[#333] dark:text-white mb-1">Admin Key <span className="text-[#aaa] dark:text-white/50 font-normal">(optional)</span></label>
  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 dark:border-[#444] px-4 py-3 text-[#333] dark:text-white bg-white dark:bg-[#252528] focus:border-[#DF3131] focus:outline-none" placeholder="Leave blank for magic link" />
  </div>
 <button type="submit" disabled={loading} className="w-full bg-[#DF3131] text-white py-3 font-heading font-bold tracking-[0.15em] uppercase hover:bg-red-700 transition-colors disabled:opacity-50">
 {loading ? "Signing in..." : "Sign In"}
 </button>
  <p className="text-center text-[13px] text-[#888] dark:text-white/50">{password ? "Admin key provided - instant sign in" : "Leave admin key empty for magic link sign-in"}</p>
 </form>
 ) : (
 <form onSubmit={handleRegister} className="space-y-4">
  <div>
  <label className="block text-sm font-heading font-bold tracking-[0.1em] uppercase text-[#333] dark:text-white mb-1">Name</label>
  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 dark:border-[#444] px-4 py-3 text-[#333] dark:text-white bg-white dark:bg-[#252528] focus:border-[#DF3131] focus:outline-none" placeholder="Your name" />
  </div>
  <div>
  <label className="block text-sm font-heading font-bold tracking-[0.1em] uppercase text-[#333] dark:text-white mb-1">Email</label>
  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 dark:border-[#444] px-4 py-3 text-[#333] dark:text-white bg-white dark:bg-[#252528] focus:border-[#DF3131] focus:outline-none" placeholder="your@email.com" />
  </div>
 <button type="submit" disabled={loading} className="w-full bg-[#DF3131] text-white py-3 font-heading font-bold tracking-[0.15em] uppercase hover:bg-red-700 transition-colors disabled:opacity-50">
 {loading ? "Creating account..." : "Create Account"}
 </button>
  <p className="text-center text-[13px] text-[#888] dark:text-white/50">Enter your email to create an account. No password required.</p>
 </form>
 )}
 </div>
 </main>
 );
}

function AuthenticatedDashboard({ session, update, signOut }: any) {
 const [editMode, setEditMode] = useState(false);
 const [saving, setSaving] = useState(false);
 const [profile, setProfile] = useState({
 name: session.user?.name || "",
 bio: "",
 phone: "",
 website: "",
 instagram: "",
 facebook: "",
 avatarUrl: session.user?.image || "",
 });
 const [saved, setSaved] = useState(false);
 const [bugTab, setBugTab] = useState(false);
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

 useEffect(() => {
 fetch("/api/profile").then(r => r.json()).then(data => {
 if (data.user) setProfile(prev => ({
 ...prev,
 name: data.user.name || prev.name,
 bio: data.user.bio || "",
 phone: data.user.phone || "",
 website: data.user.website || "",
 instagram: data.user.instagram || "",
 facebook: data.user.facebook || "",
 avatarUrl: data.user.avatarUrl || prev.avatarUrl,
 }));
 }).catch(() => {});
 }, []);

 async function saveProfile() {
 setSaving(true);
 try {
 const res = await fetch("/api/profile", {
 method: "PUT",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(profile),
 });
 if (res.ok) {
 setSaved(true);
 setEditMode(false);
 await update();
 setTimeout(() => setSaved(false), 3000);
 }
 } catch (e) { console.warn("[my-account-page] Save profile failed", e); }
 setSaving(false);
 }

 return (
 <main className="min-h-screen bg-[#F5F5F3] dark:bg-[#252528] pb-20">
  <div className="max-w-2xl mx-auto px-6">
  <div className="flex items-center justify-between mb-8">
  <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-[0.15em] uppercase text-[#333] dark:text-white">My Account</h1>
 <Link href="/admin" className="text-xs text-[#DF3131] hover:underline uppercase tracking-wider font-bold">Admin →</Link>
 </div>

 {/* Profile Card */}
  <div className="bg-white dark:bg-[#252528] border border-gray-200 dark:border-[#444] p-8 mb-6">
 <div className="flex items-start gap-5 mb-6">
 <div className="w-16 h-16 rounded-full overflow-hidden bg-[#DF3131] flex-shrink-0 flex items-center justify-center">
 {session.user?.image ? (
  <Image src={session.user.image} alt={`${session.user?.name || "Member"} profile photo`} width={64} height={64} className="w-full h-full object-cover" priority />
 ) : (
 <span className="text-white text-2xl font-bold">{(session?.user?.name || session?.user?.email || "?")[0]?.toUpperCase()}</span>
 )}
 </div>
 <div className="flex-1">
  <p className="font-heading font-bold text-[#333] dark:text-white text-lg">{session.user?.name || "Member"}</p>
  <p className="text-[#888] dark:text-white/50 text-sm">{session.user?.email}</p>
  <p className="text-[12px] text-[#aaa] dark:text-white/50 mt-1">Signed in via {session.user?.provider || "email"}</p>
 </div>
 <button onClick={() => setEditMode(!editMode)} className="text-sm text-[#DF3131] hover:underline font-bold uppercase tracking-wider">
 {editMode ? "Cancel" : "Edit Profile"}
 </button>
 </div>

 {saved && <p className="text-green-600 text-sm mb-4 text-center font-bold">Profile saved!</p>}

 {editMode ? (
 <div className="space-y-4">
 <Field label="Display Name" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} />
 <Field label="Bio" value={profile.bio} onChange={v => setProfile(p => ({ ...p, bio: v }))} textarea />
 <Field label="Phone" value={profile.phone} onChange={v => setProfile(p => ({ ...p, phone: v }))} />
 <Field label="Website" value={profile.website} onChange={v => setProfile(p => ({ ...p, website: v }))} placeholder="https://" />
 <Field label="Instagram" value={profile.instagram} onChange={v => setProfile(p => ({ ...p, instagram: v }))} placeholder="@username" />
 <Field label="Facebook" value={profile.facebook} onChange={v => setProfile(p => ({ ...p, facebook: v }))} placeholder="Profile URL" />
 <Field label="Avatar URL" value={profile.avatarUrl} onChange={v => setProfile(p => ({ ...p, avatarUrl: v }))} placeholder="https://..." />
 <button onClick={saveProfile} disabled={saving}
 className="w-full bg-[#DF3131] text-white py-3 font-heading font-bold tracking-[0.12em] uppercase text-sm hover:bg-red-700 transition-colors disabled:opacity-50">
 {saving ? "Saving..." : "Save Profile"}
 </button>
 </div>
 ) : (
 <div className="space-y-3">
 {profile.bio && <InfoRow label="Bio" value={profile.bio} />}
 {profile.phone && <InfoRow label="Phone" value={profile.phone} />}
 {profile.website && <InfoRow label="Website" value={profile.website} link />}
 {profile.instagram && <InfoRow label="Instagram" value={profile.instagram} />}
 {profile.facebook && <InfoRow label="Facebook" value={profile.facebook} link />}
 {!profile.bio && !profile.phone && !profile.website && !profile.instagram && !profile.facebook && (
 <p className="text-[#aaa] text-sm text-center py-4">No profile info yet. Click Edit Profile to get started.</p>
 )}
 </div>
 )}
 </div>

 {/* Bug Report */}
  <div className="bg-white dark:bg-[#252528] border border-gray-200 dark:border-[#444] p-6 mb-6">
  <button onClick={() => setBugTab(!bugTab)} className="flex items-center justify-between w-full">
   <h3 className="text-[13px] font-heading font-bold tracking-[0.1em] uppercase text-[#333] dark:text-white">🐞 Report a Bug / Issue</h3>
   <span className="text-[#888] dark:text-white/50 text-lg">{bugTab ? "▲" : "▼"}</span>
 </button>
 {bugTab && (
 <div className="mt-5 space-y-4">
  {bugSent ? (
  <div className="text-center py-6">
  <p className="text-green-600 font-heading font-bold text-lg mb-2">✓ Submitted!</p>
  <p className="text-[#666] dark:text-white/70 text-sm">Thanks, we&apos;ll review it and fix the issue.</p>
  <button onClick={() => { setBugSent(false); setBugCat(""); setBugChecks([]); setBugDesc(""); }} className="mt-4 text-[13px] text-[#DF3131] font-bold underline">Report another</button>
  </div>
  ) : (
  <>
  <div>
  <label className="block text-[12px] font-heading font-bold tracking-[0.08em] uppercase text-[#666] dark:text-white/70 mb-2">Category</label>
  <select value={bugCat} onChange={e => { setBugCat(e.target.value); setBugChecks([]); }} className="w-full border border-gray-300 dark:border-[#444] px-4 py-2.5 text-[14px] text-[#333] dark:text-white bg-white dark:bg-[#252528] focus:border-[#DF3131] focus:outline-none">
  <option value="">- Select category -</option>
  {bugCategories.map(c => <option key={c} value={c}>{c}</option>)}
  </select>
  </div>
  {bugCat && (bugCheckboxes[bugCat]?.length || 0) > 0 && (
  <div>
  <label className="block text-[12px] font-heading font-bold tracking-[0.08em] uppercase text-[#666] dark:text-white/70 mb-2">Specific Issue</label>
  <div className="grid grid-cols-2 gap-2">
  {(bugCheckboxes[bugCat] || []).map(opt => (
  <label key={opt} className="flex items-center gap-2 text-[13px] text-[#333] dark:text-white cursor-pointer">
  <input type="checkbox" checked={bugChecks.includes(opt)} onChange={() => setBugChecks(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])} className="accent-[#DF3131]" />
  {opt}
  </label>
  ))}
  </div>
  </div>
  )}
  <div>
  <label className="block text-[12px] font-heading font-bold tracking-[0.08em] uppercase text-[#666] dark:text-white/70 mb-2">Describe the issue <span className="text-[#aaa] dark:text-white/50 font-normal">({bugDesc.length}/1250)</span></label>
  <textarea value={bugDesc} onChange={e => { if(e.target.value.length <= 1250) setBugDesc(e.target.value); }} rows={5} placeholder="What happened? What did you expect to happen? Which page were you on?"
  className="w-full border border-gray-300 dark:border-[#444] px-4 py-3 text-[14px] text-[#333] dark:text-white bg-white dark:bg-[#252528] focus:border-[#DF3131] focus:outline-none resize-none" />
  </div>
  <button onClick={async () => {
  if (!bugCat && !bugDesc) return;
  try { await fetch("/api/bugs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category: bugCat, issues: bugChecks, description: bugDesc, email: session.user?.email, page: typeof window !== "undefined" ? window.location.href : "" }) }); } catch (e) { console.warn("[my-account-page] Bug report submit failed", e); }
  setBugSent(true);
  }} disabled={!bugDesc.trim()} className="w-full bg-[#DF3131] text-white py-3 font-heading font-bold tracking-[0.12em] uppercase text-sm hover:bg-red-700 transition-colors disabled:opacity-40">
  Submit Report
  </button>
  </>
  )}
 </div>
 )}
 </div>
 <div className="bg-white dark:bg-[#252528] border border-gray-200 dark:border-[#444] p-6 mb-6">
  <h3 className="text-[13px] font-heading font-bold tracking-[0.1em] uppercase text-[#333] dark:text-white mb-4">Account Actions</h3>
 <div className="grid grid-cols-2 gap-3">
 <ActionLink href="/plans" label="View Plans" icon={<FiFileText />} />
 <ActionLink href="/booking-calendar/photoshoot" label="Book a Shoot" icon={<FiCamera />} />
 <ActionLink href="/gift-card" label="Gift Cards" icon={<FiGift />} />
 <ActionLink href={process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL || "/plans"} label="Billing Portal" icon={<FiCreditCard />} external />
 <ActionLink href="/loyalty" label="Loyalty Rewards" icon={<FiStar />} />
 <ActionLink href="/community" label="Community" icon={<FiMessageCircle />} />
 <ActionLink href="/admin" label="Admin" icon={<FiSettings />} />
 <ActionLink href="/model-archive" label="Model Archive" icon={<FiUser />} />
 </div>
 </div>

 <button onClick={() => signOut({ callbackUrl: "/" })}
  className="w-full py-3 border border-[#333] dark:border-white text-[#333] dark:text-white font-heading font-bold tracking-[0.12em] uppercase text-sm hover:bg-[#333] hover:text-white dark:hover:bg-white dark:hover:text-[#1C1C1E] transition-all">
 Sign Out
 </button>
 </div>
 </main>
 );
}

function Field({ label, value, onChange, textarea, placeholder }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; placeholder?: string }) {
 return (
 <div>
 <label className="block text-[13px] font-heading font-bold tracking-[0.08em] uppercase text-[#333] dark:text-white mb-1">{label}</label>
 {textarea ? (
 <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} placeholder={placeholder}
 className="w-full border border-gray-300 dark:border-[#444] px-4 py-3 text-[14px] text-[#333] dark:text-white bg-white dark:bg-[#252528] focus:border-[#DF3131] focus:outline-none resize-none" />
 ) : (
 <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
 className="w-full border border-gray-300 dark:border-[#444] px-4 py-3 text-[14px] text-[#333] dark:text-white bg-white dark:bg-[#252528] focus:border-[#DF3131] focus:outline-none" />
 )}
 </div>
 );
}

function InfoRow({ label, value, link }: { label: string; value: string; link?: boolean }) {
 return (
 <div className="flex items-start gap-3">
 <span className="text-[12px] font-heading font-bold tracking-[0.08em] uppercase text-[#888] dark:text-white/50 w-20 flex-shrink-0 pt-0.5">{label}</span>
 {link ? (
 <a href={value} target="_blank" rel="noopener noreferrer" className="text-[14px] text-[#DF3131] hover:underline break-all">{value}</a>
 ) : (
 <span className="text-[14px] text-[#333] dark:text-white break-all">{value}</span>
 )}
 </div>
 );
}

function ActionLink({ href, label, icon, external }: { href: string; label: string; icon: React.ReactNode; external?: boolean }) {
 const Comp = external ? "a" : Link;
 return (
 <Comp href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
 className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 dark:border-[#444] text-[13px] font-bold tracking-[0.05em] text-[#333] dark:text-white hover:border-[#DF3131] hover:text-[#DF3131] transition-all">
 <span>{icon}</span> {label}
 </Comp>
 );
}

