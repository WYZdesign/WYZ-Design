"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import {
  FiUser, FiMail, FiEdit2, FiZap, FiGift, FiUsers, FiLogOut,
  FiCamera, FiMessageCircle, FiCreditCard, FiHeart, FiStar, FiHelpCircle,
} from "react-icons/fi";

interface ZealSummary {
  points?: number;
  tier?: string;
  tierColor?: string;
  visitStreak?: number;
  achievementsUnlocked?: string[];
  nextTier?: { name: string; min: number; color: string } | null;
}

interface ReferralSummary {
  code: string;
  signups: number;
  purchases: number;
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
}

interface ProfileData {
  name?: string;
  bio?: string;
  phone?: string;
  website?: string;
  avatarUrl?: string;
  instagram?: string;
  facebook?: string;
  provider?: string;
  createdAt?: string;
}

const QUICK_LINKS = [
  { href: "/booking-calendar/photoshoot", label: "Book a Shoot", icon: FiCamera },
  { href: "/loyalty", label: "Rewards", icon: FiStar },
  { href: "/gift-card", label: "Gift Cards", icon: FiGift },
  { href: "/referral", label: "Referral Program", icon: FiUsers },
  { href: "/community", label: "Community", icon: FiMessageCircle },
  { href: "/plans", label: "Plans & Pricing", icon: FiCreditCard },
  { href: "/faq", label: "FAQ", icon: FiHelpCircle },
  { href: "/merch", label: "Merch Store", icon: FiHeart },
];

export default function MyAccountPage() {
  const { status, data: session } = useSession();
  const [zeal, setZeal] = useState<ZealSummary | null>(null);
  const [referral, setReferral] = useState<ReferralSummary | null>(null);
  const [profile, setProfile] = useState<ProfileData>({});
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", phone: "", website: "", instagram: "", facebook: "", avatarUrl: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/zeal/status")
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d && typeof d.points === "number") setZeal(d); })
      .catch(() => {});

    fetch("/api/profile")
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (d?.user) {
          setProfile(d.user);
          setForm({
            name: d.user.name || session?.user?.name || "",
            bio: d.user.bio || "",
            phone: d.user.phone || "",
            website: d.user.website || "",
            instagram: d.user.instagram || "",
            facebook: d.user.facebook || "",
            avatarUrl: d.user.avatarUrl || session?.user?.image || "",
          });
        }
        setProfileLoaded(true);
      })
      .catch(() => setProfileLoaded(true));

    // Referral code lookup — create-or-fetch the user's own code, then load its stats
    if (session?.user?.email) {
      fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", email: session.user.email }),
      })
        .then(r => (r.ok ? r.json() : null))
        .then(d => {
          if (d?.code) {
            fetch("/api/referral?code=" + encodeURIComponent(d.code))
              .then(r => (r.ok ? r.json() : null))
              .then(rd => { if (rd) setReferral(rd); })
              .catch(() => {});
          }
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.email]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) setProfile(data.user);
        if (data.unlockedAchievements?.length) {
          toast.success(`Achievement unlocked: profile updated! +Zeal`, { duration: 5000 });
        } else {
          toast.success("Profile saved");
        }
        setEditMode(false);
      } else {
        toast.error("Couldn't save your profile. Try again.");
      }
    } catch {
      toast.error("Couldn't save your profile. Check your connection.");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-[#1C1C1E] flex items-center justify-center">
        <p className="text-[#666] dark:text-white/50">Loading your account...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1C1C1E] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-[2rem] sm:text-[2.5rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.08em] uppercase mb-4" style={{ lineHeight: 0.9 }}>
            Your <span className="text-[#DF3131]">Account</span>
          </h1>
          <p className="text-[#666] dark:text-white/60 mb-8">
            Sign in to see your Zeal balance, tier, and booking perks. Signing in takes you through the same door the team uses.
          </p>
          <Link href="/admin" className="inline-block px-8 py-3 bg-[#DF3131] text-white font-heading font-bold tracking-[0.1em] uppercase text-[14px] hover:bg-[#B82020] transition-all">
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  const name = profile.name || session?.user?.name || "Member";
  const firstName = name.split(" ")[0];
  // Rendered via next/image, which only allow-lists a handful of remote
  // hosts (see next.config.ts) — stick to the OAuth-provided avatar here
  // rather than the free-text avatarUrl field, which could point anywhere.
  const avatarSrc = session?.user?.image || "";
  const hasProfileDetails = !!(profile.bio || profile.phone || profile.website || profile.instagram || profile.facebook);

  const cardClass = "border border-[#E2E2E2] dark:border-[#444] rounded-2xl p-6 bg-white dark:bg-[#252528]";
  const inputClass = "w-full bg-white dark:bg-[#1C1C1E] border border-[#E2E2E2] dark:border-[#444] text-[#333] dark:text-[#e0e0e0] text-[13px] px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#DF3131] transition-colors placeholder:text-[#999] dark:placeholder:text-white/30";
  const labelClass = "block text-[11px] font-heading font-bold tracking-[0.08em] uppercase text-[#666] dark:text-white/50 mb-1";

  return (
    <main className="min-h-screen bg-white dark:bg-[#1C1C1E] px-6 pt-32 pb-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-[12px] font-bold tracking-[0.25em] uppercase text-[#DF3131] mb-2">Welcome back</p>
        <h1 className="text-[2rem] sm:text-[2.75rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.06em] uppercase mb-10" style={{ lineHeight: 0.9 }}>
          Hey {firstName}
        </h1>

        {/* Profile */}
        <section className={`${cardClass} mb-6`}>
          <div className="flex items-start gap-4 mb-5">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#DF3131] flex-shrink-0 flex items-center justify-center">
              {avatarSrc ? (
                <Image src={avatarSrc} alt={`${name} profile photo`} width={64} height={64} className="w-full h-full object-cover" />
              ) : (
                <FiUser className="w-7 h-7 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-[18px] text-[#333] dark:text-[#e0e0e0] truncate">{name}</p>
              <p className="text-[13px] text-[#666] dark:text-white/50 truncate flex items-center gap-1.5 mt-0.5">
                <FiMail className="w-3.5 h-3.5 shrink-0" /> {session?.user?.email}
              </p>
              <p className="text-[11px] text-[#999] dark:text-white/30 mt-1 uppercase tracking-[0.08em]">
                Signed in via {profile.provider || (session?.user as { provider?: string } | undefined)?.provider || "email"}
              </p>
            </div>
            <button
              onClick={() => setEditMode(v => !v)}
              className="text-[12px] font-heading font-bold tracking-[0.1em] uppercase text-[#DF3131] hover:underline whitespace-nowrap flex items-center gap-1.5"
            >
              <FiEdit2 className="w-3.5 h-3.5" /> {editMode ? "Cancel" : "Edit"}
            </button>
          </div>

          {editMode ? (
            <div className="space-y-4 pt-4 border-t border-[#E2E2E2] dark:border-[#444]">
              <div>
                <label className={labelClass}>Display Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Bio</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} className={`${inputClass} resize-none`} placeholder="A little about you" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputClass} placeholder="(555) 555-5555" />
                </div>
                <div>
                  <label className={labelClass}>Website</label>
                  <input type="text" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className={inputClass} placeholder="https://" />
                </div>
                <div>
                  <label className={labelClass}>Instagram</label>
                  <input type="text" value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} className={inputClass} placeholder="@username" />
                </div>
                <div>
                  <label className={labelClass}>Facebook</label>
                  <input type="text" value={form.facebook} onChange={e => setForm(f => ({ ...f, facebook: e.target.value }))} className={inputClass} placeholder="Profile URL" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Avatar URL</label>
                <input type="text" value={form.avatarUrl} onChange={e => setForm(f => ({ ...f, avatarUrl: e.target.value }))} className={inputClass} placeholder="https://..." />
              </div>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="w-full py-3 bg-[#DF3131] text-white font-heading font-bold tracking-[0.1em] uppercase text-[13px] hover:bg-[#B82020] transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          ) : profileLoaded ? (
            hasProfileDetails ? (
              <div className="pt-4 border-t border-[#E2E2E2] dark:border-[#444] space-y-2">
                {profile.bio && <p className="text-[13px] text-[#333] dark:text-white/80">{profile.bio}</p>}
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-[#666] dark:text-white/50">
                  {profile.phone && <span>{profile.phone}</span>}
                  {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-[#DF3131] hover:underline">{profile.website}</a>}
                  {profile.instagram && <span>IG: {profile.instagram}</span>}
                  {profile.facebook && <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="text-[#DF3131] hover:underline">Facebook</a>}
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-[#666] dark:text-white/50 pt-4 border-t border-[#E2E2E2] dark:border-[#444]">
                No profile details yet. Add a bio, phone, or social links so the team knows a little more about you.
              </p>
            )
          ) : null}
        </section>

        {/* Zeal / Rewards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Link href="/loyalty" className="group border border-[#E2E2E2] dark:border-[#444] rounded-2xl p-6 hover:border-[#DF3131] transition-all bg-white dark:bg-[#252528]">
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#666] dark:text-white/50 mb-2">Zeal Balance</p>
            {zeal ? (
              <>
                <p className="text-[2.5rem] font-heading font-black leading-none mb-1" style={{ color: zeal.tierColor || "#DF3131" }}>{zeal.points}</p>
                <p className="text-[12px] font-bold tracking-[0.1em] uppercase" style={{ color: zeal.tierColor || "#DF3131" }}>{zeal.tier} tier</p>
                {typeof zeal.visitStreak === "number" && zeal.visitStreak > 0 && (
                  <p className="text-[11px] text-[#666] dark:text-white/40 mt-2 flex items-center gap-1"><FiZap className="w-3 h-3 text-[#DF3131]" /> {zeal.visitStreak} day streak</p>
                )}
                {zeal.nextTier && (
                  <p className="text-[11px] text-[#666] dark:text-white/40 mt-1">{zeal.nextTier.min - (zeal.points || 0)} more to {zeal.nextTier.name}</p>
                )}
              </>
            ) : (
              <p className="text-[2.5rem] font-heading font-black text-[#DF3131] leading-none">--</p>
            )}
          </Link>

          <Link href="/loyalty" className="border border-[#E2E2E2] dark:border-[#444] rounded-2xl p-6 hover:border-[#DF3131] transition-all bg-white dark:bg-[#252528] flex flex-col justify-between">
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#666] dark:text-white/50 mb-2">Rewards</p>
            <p className="text-[16px] text-[#333] dark:text-[#e0e0e0] leading-snug">
              {zeal?.achievementsUnlocked?.length
                ? `${zeal.achievementsUnlocked.length} achievement${zeal.achievementsUnlocked.length === 1 ? "" : "s"} unlocked. Spend your Zeal on discounts, retouching, and merch.`
                : "Spend your Zeal on discounts, retouching, and merch."}
            </p>
          </Link>
        </div>

        {/* Referral program */}
        <section className={`${cardClass} mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-[15px] tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] flex items-center gap-2">
              <FiUsers className="text-[#DF3131]" /> Referral Program
            </h2>
            <Link href="/referral" className="text-[12px] font-bold tracking-[0.08em] uppercase text-[#DF3131] hover:underline">Details</Link>
          </div>
          {referral ? (
            <>
              <p className="text-[12px] text-[#666] dark:text-white/50 mb-4">
                Your code: <span className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] tracking-[0.05em]">{referral.code}</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-[1.5rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] leading-none">{referral.signups}</p>
                  <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#666] dark:text-white/40 mt-1">Signups</p>
                </div>
                <div>
                  <p className="text-[1.5rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] leading-none">{referral.purchases}</p>
                  <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#666] dark:text-white/40 mt-1">Purchases</p>
                </div>
                <div>
                  <p className="text-[1.5rem] font-heading font-black text-[#DF3131] leading-none">${referral.pendingCommission.toFixed(0)}</p>
                  <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#666] dark:text-white/40 mt-1">Pending</p>
                </div>
                <div>
                  <p className="text-[1.5rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] leading-none">${referral.paidCommission.toFixed(0)}</p>
                  <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#666] dark:text-white/40 mt-1">Paid Out</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-[13px] text-[#666] dark:text-white/50">
              No referral activity yet. Head to your{" "}
              <Link href="/referral" className="text-[#DF3131] hover:underline">referral page</Link> to grab your code and start earning commission.
            </p>
          )}
        </section>

        {/* Quick links */}
        <section className="mb-8">
          <h2 className="font-heading font-bold text-[15px] tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center gap-2 text-center px-3 py-4 border border-[#E2E2E2] dark:border-[#444] rounded-xl bg-white dark:bg-[#252528] hover:border-[#DF3131] transition-all"
              >
                <Icon className="w-5 h-5 text-[#DF3131]" />
                <span className="text-[11px] font-heading font-bold tracking-[0.04em] uppercase text-[#333] dark:text-white/70">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Account actions */}
        <div className="flex flex-wrap gap-4 items-center">
          <Link href="/booking-calendar/photoshoot" className="px-6 py-3 bg-[#DF3131] text-white font-heading font-bold tracking-[0.1em] uppercase text-[13px] hover:bg-[#B82020] transition-all">
            Book a shoot
          </Link>
          <Link href="/contact" className="px-6 py-3 border-2 border-[#333] dark:border-white text-[#333] dark:text-white font-heading font-bold tracking-[0.1em] uppercase text-[13px] hover:bg-[#DF3131] hover:border-[#DF3131] hover:text-white transition-all">
            Contact the team
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="ml-auto px-6 py-3 border border-[#E2E2E2] dark:border-[#444] text-[#666] dark:text-white/60 font-heading font-bold tracking-[0.1em] uppercase text-[13px] hover:border-[#DF3131] hover:text-[#DF3131] transition-all flex items-center gap-2"
          >
            <FiLogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    </main>
  );
}
