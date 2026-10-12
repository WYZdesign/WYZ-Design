"use client";

// Profile + bug-report tab components extracted from src/app/admin/page.tsx
// (oversized-file split, board S1). Moved verbatim, no behavior change.

import { useState, useEffect } from "react";
import { logger } from "@/lib/logger";
import Image from "next/image";
import Link from "next/link";
import { FiUser, FiFileText, FiCamera, FiGift, FiCreditCard, FiStar, FiMessageCircle, FiLogOut, FiMail, FiCheck, FiChevronDown, FiChevronUp, FiAlertCircle } from "react-icons/fi";

export function ProfileTab({ session, update, signOut }: { session: import("next-auth").Session; update: () => Promise<import("next-auth").Session | null>; signOut: (options?: { callbackUrl?: string }) => Promise<void> }) {
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

        {saved && <p className="text-[#DF3131] text-sm mb-4 text-center font-bold">Profile saved!</p>}

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
        <h3 className="text-size-12 font-heading font-bold tracking-[0.15em] uppercase text-white/60 mb-4">Account Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <ProfileActionLink href="/services#plans" label="View Plans" icon={<FiFileText className="w-4 h-4" />} />
          <ProfileActionLink href="/booking-calendar/photoshoot" label="Book a Shoot" icon={<FiCamera className="w-4 h-4" />} />
          <ProfileActionLink href="/loyalty#gift-card" label="Gift Cards" icon={<FiGift className="w-4 h-4" />} />
          <ProfileActionLink href={process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL || "/services#plans"} label="Billing Portal" icon={<FiCreditCard className="w-4 h-4" />} external />
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

export function ProfileField({ label, value, onChange, textarea, placeholder, inputClass }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; placeholder?: string; inputClass: string }) {
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

export function ProfileInfoRow({ label, value, link }: { label: string; value: string; link?: boolean }) {
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

export function ProfileActionLink({ href, label, icon, external }: { href: string; label: string; icon: React.ReactNode; external?: boolean }) {
  const Comp = external ? "a" : Link;
  return (
    <Comp href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center gap-2 px-3 py-2.5 border border-white/10 text-[13px] font-bold tracking-[0.05em] text-white/70 hover:border-[#DF3131]/50 hover:text-[#DF3131] transition-all">
      <span>{icon}</span> {label}
    </Comp>
  );
}

export function BugReportTab({ session }: { session: import("next-auth").Session | null }) {
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
          <h3 className="flex items-center gap-2 text-size-13 font-heading font-bold tracking-[0.1em] uppercase text-white/80"><FiAlertCircle className="w-4 h-4 text-[#DF3131]" /> Report a Bug / Issue</h3>
          {open ? <FiChevronUp className="w-5 h-5 text-white/50" /> : <FiChevronDown className="w-5 h-5 text-white/50" />}
        </button>
        {open && (
          <div className="mt-5 space-y-4">
            {bugSent ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-[#DF3131]/20 text-[#DF3131] flex items-center justify-center mx-auto mb-3"><FiCheck className="w-6 h-6" /></div>
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

