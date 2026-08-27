"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiStar, FiGift, FiZap, FiShield, FiTarget, FiAward, FiRefreshCw } from "react-icons/fi";

interface CatalogAction { id: string; zeal: number; category: string; reason: string; repeatable: boolean }
interface AchievementDef { id: string; zeal: number; title: string; description: string }
interface QuestDef { id: string; title: string; description: string; steps: string[]; bonusZeal: number }
interface ZealReward { id: string; title: string; cost: number; note: string }

interface ZealStatus {
  points: number;
  tier: string;
  tierColor: string;
  tierIndex: number;
  nextTier: { name: string; min: number; color: string } | null;
  visitStreak: number;
  longestStreak: number;
  achievementsUnlocked: string[];
  questsCompleted: string[];
  actionsEarned: string[];
  history: { amount: number; reason: string; timestamp: string }[];
  catalog: {
    actions: CatalogAction[];
    achievements: AchievementDef[];
    quests: QuestDef[];
    tiers: { name: string; min: number; color: string }[];
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  daily: "Every Day",
  weekly: "Regular Play",
  milestone: "Big Moves",
  easter: "Secrets",
};

export default function LoyaltyPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data ?? null;
  const [data, setData] = useState<ZealStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const REWARDS: ZealReward[] = [
    { id: "discount-25",      title: "$25 off any service",           cost: 500,  note: "Discount code honored on any booking" },
    { id: "free-retouch",     title: "Free photo retouching session", cost: 750,  note: "$50 value, one session" },
    { id: "merch-item",       title: "Any merch item under $40",      cost: 1000, note: "Applied at fulfillment" },
    { id: "shoot-extra-hour", title: "Extra hour on any photoshoot",  cost: 1200, note: "$100 value, mention when booking" },
    { id: "discount-100",     title: "$100 off any booking",          cost: 1750, note: "Best value per Zeal" },
  ];

  const redeem = async (rewardId: string) => {
    if (claimingId) return;
    setClaimingId(rewardId);
    try {
      const res = await fetch("/api/zeal/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        toast.success(`Code ${result.code} is yours. ${result.title}`, { duration: 8000 });
        load();
      } else {
        toast.error(result.error || "Redemption failed. Try again.");
      }
    } catch {
      toast.error("Redemption failed. Check your connection.");
    } finally {
      setClaimingId(null);
    }
  };

  const load = () => {
    fetch("/api/zeal/status")
      .then(r => (r.ok ? r.json() : Promise.reject(new Error("unauthorized"))))
      .then(d => { if (d.points !== undefined) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!session) { setLoading(false); return; }
    load();
  }, [session]);

  const actionLabel = (id: string): string =>
    data?.catalog.actions.find(a => a.id === id)?.reason ?? id;

  return (
    <main className="pb-16 bg-white dark:bg-[#1C1C1E]">
      <div className="max-w-5xl mx-auto px-6 pt-32 lg:pt-40">
        <div className="text-center mb-4">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.15em] mb-6 sm:mb-8">EARN ZEAL</h1>
          <p className="text-[#666] dark:text-[#b0b0b0] max-w-xl mx-auto mb-3">The WYZ Design rewards program. Earn Zeal for everything you do here, from showing up daily to uncovering secrets nobody told you about. Climb the tiers, unlock real perks. Sign in to start earning. Everything you do on this site counts once you&apos;re in.</p>
        </div>

        {session && data ? (
          <>
            <div className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] rounded-2xl p-8 mb-10 text-center">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-bold tracking-[0.15em] uppercase text-[#666] dark:text-white/50 flex items-center gap-2">
                  <FiZap className="text-[#DF3131]" /> {data.visitStreak} day streak
                </span>
                <button onClick={() => { load(); toast.success("Zeal refreshed"); }} aria-label="Refresh zeal balance" className="text-[#666] dark:text-white/50 hover:text-[#DF3131] transition-colors">
                  <FiRefreshCw className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[13px] font-bold tracking-[0.15em] uppercase text-[#666] dark:text-white/50 mb-2">Your Zeal</p>
              <p className="text-[3rem] font-heading font-black" style={{ color: data.tierColor }}>{data.points}</p>
              <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-2" style={{ color: data.tierColor }}>{data.tier} TIER</p>
              {data.nextTier && (
                <p className="text-[13px] text-[#666] dark:text-white/50 mt-2">{data.nextTier.min - data.points} more Zeal to reach {data.nextTier.name}</p>
              )}
              {!data.nextTier && <p className="text-[13px] text-[#666] dark:text-white/50 mt-2">Maximum tier reached. You are a Legend.</p>}
              <div className="mt-6 h-3 bg-gray-100 dark:bg-[#444] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{
                  width: data.nextTier
                    ? `${Math.min(100, Math.round((data.points / data.nextTier.min) * 100))}%`
                    : "100%",
                  background: data.tierColor,
                }} />
              </div>
            </div>

            <h2 className="font-heading font-bold text-[18px] tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-4 flex items-center gap-2"><FiGift className="text-[#DF3131]" /> Redeem Zeal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {REWARDS.map(r => {
                const affordable = data.points >= r.cost;
                const claiming = claimingId === r.id;
                return (
                  <div key={r.id} className={`rounded-xl p-5 border transition-all flex flex-col ${affordable ? "border-[#DF3131]/50 bg-white dark:bg-[#252528]" : "border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#252528] opacity-70"}`}>
                    <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#DF3131] mb-1">{r.cost} Zeal</p>
                    <h3 className="font-heading font-bold text-[14px] text-[#333] dark:text-[#e0e0e0] mb-1">{r.title}</h3>
                    <p className="text-[12px] text-[#666] dark:text-white/50 leading-snug mb-4 flex-1">{r.note}</p>
                    <button
                      onClick={() => redeem(r.id)}
                      disabled={!affordable || claiming}
                      className={`w-full py-2.5 text-[12px] font-heading font-bold tracking-[0.1em] uppercase transition-all ${affordable && !claiming ? "bg-[#DF3131] text-white hover:bg-[#B82020]" : "bg-gray-100 dark:bg-[#444] text-[#666] dark:text-white/40 cursor-not-allowed"}`}
                    >
                      {claiming ? "Redeeming..." : affordable ? "Redeem" : `Need ${r.cost - data.points} more`}
                    </button>
                  </div>
                );
              })}
            </div>

            <h2 className="font-heading font-bold text-[18px] tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-4 flex items-center gap-2"><FiTarget className="text-[#DF3131]" /> Quests</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {data.catalog.quests.map(q => {
                const done = data.questsCompleted.includes(q.id);
                return (
                  <div key={q.id} className={`rounded-xl p-6 border transition-all ${done ? "border-[#DF3131] bg-[#DF3131]/5 dark:bg-[#DF3131]/10" : "border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#252528]"}`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-heading font-bold text-[15px] tracking-[0.04em] text-[#333] dark:text-[#e0e0e0]">{q.title}</h3>
                      <span className={`text-[11px] font-bold tracking-[0.1em] uppercase whitespace-nowrap ${done ? "text-[#DF3131]" : "text-[#666] dark:text-white/50"}`}>{done ? "Complete" : `+${q.bonusZeal} bonus`}</span>
                    </div>
                    <p className="text-[13px] text-[#666] dark:text-white/60 leading-relaxed mb-3">{q.description}</p>
                    <ul className="space-y-1">
                      {q.steps.map(s => {
                        const stepDone = data.actionsEarned.includes(s);
                        return (
                          <li key={s} className={`text-[13px] flex items-start gap-2 ${stepDone ? "text-[#333] dark:text-white/80" : "text-[#666] dark:text-white/50"}`}>
                            <span className={stepDone ? "text-[#DF3131]" : "text-[#666] dark:text-white/40"}>{stepDone ? "✓" : "○"}</span> {actionLabel(s)}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>

            <h2 className="font-heading font-bold text-[18px] tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-4 flex items-center gap-2"><FiAward className="text-[#DF3131]" /> Achievements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-12">
              {data.catalog.achievements.map(a => {
                const unlocked = data.achievementsUnlocked.includes(a.id);
                return (
                  <div key={a.id} className={`rounded-xl p-4 border text-center transition-all ${unlocked ? "border-[#DF3131] bg-[#DF3131]/5 dark:bg-[#DF3131]/10" : "border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#252528] opacity-60"}`}>
                    <p className={`font-heading font-bold text-[13px] tracking-[0.05em] uppercase mb-1 ${unlocked ? "text-[#DF3131]" : "text-[#666] dark:text-white/50"}`}>{a.title}</p>
                    <p className="text-[12px] text-[#666] dark:text-white/50 leading-snug mb-2">{a.description}</p>
                    <p className={`text-[11px] font-bold ${unlocked ? "text-[#DF3131]" : "text-[#666] dark:text-white/40"}`}>{unlocked ? `+${a.zeal} earned` : `+${a.zeal} Zeal`}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] rounded-2xl p-6 mb-12">
              <h2 className="font-heading font-bold text-[15px] tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-4">Recent Activity</h2>
              {data.history.length === 0 ? (
                <p className="text-[14px] text-[#666] dark:text-white/50">No activity yet. Go earn some Zeal.</p>
              ) : (
                <ul className="divide-y divide-[#E2E2E2] dark:divide-[#444]">
                  {data.history.map((h, i) => (
                    <li key={i} className="py-3 flex items-center justify-between gap-4">
                      <span className="text-[14px] text-[#333] dark:text-white/80">{h.reason}</span>
                      <span className="text-[14px] font-heading font-bold text-[#DF3131] whitespace-nowrap">+{h.amount}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : session && loading ? (
          <div className="text-center py-8 text-[#666] dark:text-white/50">Loading your Zeal...</div>
        ) : session && !data ? (
          <div className="text-center py-8 text-[#666] dark:text-white/50 mb-10">Couldn't load your Zeal right now. Refresh the page in a moment.</div>
        ) : null}

        {!session && (
          <div className="text-center mb-10">
            <p className="text-[#666] dark:text-[#b0b0b0] mb-4">Sign in to start earning. Everything you do on this site counts once you're in:</p>
            <Link href="/account/my-account" className="inline-block px-8 py-3 bg-[#DF3131] text-white font-heading font-bold tracking-[0.1em] uppercase text-[14px] hover:bg-[#B82020] transition-all">Sign in to join</Link>
          </div>
        )}

        <div className="text-center mb-6">
          <h2 className="font-heading font-bold text-[18px] tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-4 flex items-center justify-center gap-2"><FiStar className="text-[#DF3131]" /> Ways to Earn</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {(["daily", "weekly", "milestone", "easter"] as const).map(cat => {
            const items = (data?.catalog.actions ?? []).filter(a => a.category === cat);
            if (items.length === 0 && !data) return (
              <div key={cat} className="text-center">
                <h3 className="font-heading font-bold text-[13px] tracking-[0.15em] uppercase text-[#DF3131] mb-3">{CATEGORY_LABELS[cat]}</h3>
                <p className="text-[13px] text-[#666] dark:text-white/50">Sign in to see every way to earn in this category.</p>
              </div>
            );
            return (
              <div key={cat}>
                <h3 className="font-heading font-bold text-[13px] tracking-[0.15em] uppercase text-[#DF3131] mb-3 text-center">{CATEGORY_LABELS[cat]}</h3>
                <ul className="space-y-2">
                  {items.map(a => (
                    <li key={a.id} className="flex items-center justify-center gap-3 border border-[#E2E2E2] dark:border-[#444] rounded-lg px-4 py-2.5 bg-white dark:bg-[#252528] text-center">
                      <span className="text-[13px] text-[#333] dark:text-white/80">{a.reason}</span>
                      <span className="text-[13px] font-heading font-bold text-[#DF3131] whitespace-nowrap">+{a.zeal}{a.repeatable ? "" : " once"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="text-center mb-6">
          <h2 className="font-heading font-bold text-[18px] tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-4 flex items-center justify-center gap-2"><FiGift className="text-[#DF3131]" /> Tiers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
          {(data?.catalog.tiers ?? [
            { name: "Recruit", min: 0, color: "#8F8F8F" },
            { name: "Zealot", min: 500, color: "#DF3131" },
            { name: "Champion", min: 2000, color: "#FFD700" },
            { name: "Legend", min: 5000, color: "#00D4FF" },
          ]).map((t, i) => (
            <div key={t.name} className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: t.color }} />
              <h3 className="font-heading font-bold text-[18px] tracking-[0.06em] mb-2" style={{ color: t.color }}>{t.name}</h3>
              <p className="text-[13px] text-[#666] dark:text-white/50 mb-3">{t.min === 0 ? "Start here" : `${t.min.toLocaleString()}+ Zeal`}</p>
              <p className="text-[13px] text-[#666] dark:text-[#b0b0b0] leading-relaxed">
                {["Base access to the program", "5% off services, free social graphics, birthday discount", "10% off, priority booking, free retouching, event invites", "15% off, dedicated rep, free monthly shoot, VIP access, custom merch"][i]}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <p className="text-[13px] text-[#666] dark:text-white/50 flex items-center justify-center gap-2"><FiShield className="text-[#DF3131]" /> Earn honestly. Abuse gets zeroed out.</p>
          <p className="text-[13px] text-[#666] dark:text-white/50 mt-2 flex items-center justify-center gap-2"><FiZap className="text-[#DF3131]" /> Purchases still earn 1 Zeal per dollar, automatically.</p>
        </div>
      </div>
    </main>
  );
}
