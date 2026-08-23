"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiStar, FiGift, FiZap, FiShield } from "react-icons/fi";

const TIERS = [
  { name: "Silver", points: "0 - 999", color: "#C0C0C0", perks: ["5% off all services", "Free social media graphics", "Birthday discount"] },
  { name: "Gold", points: "1,000 - 4,999", color: "#FFD700", perks: ["10% off all services", "Priority booking", "Free retouching on photoshoots", "Exclusive event invites"] },
  { name: "Diamond", points: "5,000+", color: "#00D4FF", perks: ["15% off all services", "Dedicated account manager", "Free monthly photoshoot", "VIP event access", "Custom merch drops"] },
];

const WAYS = [
  { icon: <FiStar />, title: "Book Services", desc: "Earn 1 point per dollar spent on any service" },
  { icon: <FiGift />, title: "Refer a Friend", desc: "Earn 500 bonus points for every referral" },
  { icon: <FiZap />, title: "Social Shares", desc: "Earn 50 points when you share our work and tag us" },
  { icon: <FiShield />, title: "Leave a Review", desc: "Earn 100 points for every honest review" },
];

interface LoyaltyData { points: number; tier: string; joined: string; history: { amount: number; reason: string; timestamp: string }[]; }

export default function LoyaltyPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data ?? null;
  const [data, setData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) { setLoading(false); return; }
    fetch("/api/loyalty").then(r => r.json()).then(d => { if (d.points !== undefined) setData(d); }).catch(() => {}).finally(() => setLoading(false));
  }, [session]);

  const tierIndex = data ? (data.points >= 5000 ? 2 : data.points >= 1000 ? 1 : 0) : 0;
  const nextTier = tierIndex < 2 ? TIERS[tierIndex + 1] : null;
  const pointsNeeded = tierIndex === 0 ? 1000 - (data?.points || 0) : tierIndex === 1 ? 5000 - (data?.points || 0) : 0;

  return (
  <main className="pb-16 bg-white dark:bg-[#232326]">
    <div className="max-w-5xl mx-auto px-6 pt-32 lg:pt-40">
        <div className="text-center mb-4">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.15em] mb-6 sm:mb-8">L O Y A L T Y</h1>
          <p className="text-[#8F8F8F] dark:text-[#b0b0b0] max-w-xl mx-auto mb-3">Join the WYZ Design loyalty program. Earn points with every interaction, score exclusive perks, and level up your creative partnership.</p>
        </div>

        {session && data ? (
          <div className="bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#444] rounded-2xl p-8 mb-10 text-center">
            <p className="text-[13px] font-bold tracking-[0.15em] uppercase text-[#888] dark:text-white/50 mb-2">Your Points</p>
            <p className="text-[3rem] font-heading font-black" style={{ color: TIERS[tierIndex].color }}>{data.points}</p>
            <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-2" style={{ color: TIERS[tierIndex].color }}>{TIERS[tierIndex].name} TIER</p>
            {nextTier && <p className="text-[13px] text-[#888] dark:text-white/50 mt-2">{pointsNeeded} more points to reach {nextTier.name}</p>}
            {!nextTier && <p className="text-[13px] text-[#888] dark:text-white/50 mt-2">Maximum tier reached, enjoy all perks!</p>}
            <div className="mt-6 h-3 bg-gray-100 dark:bg-[#444] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, ((data.points / (nextTier ? (tierIndex === 0 ? 1000 : 5000) : 5000)) * 100))}%`, background: TIERS[tierIndex].color }} />
            </div>
          </div>
        ) : session && loading ? (
          <div className="text-center py-8 text-[#888]">Loading your rewards...</div>
        ) : !session ? (
          <div className="text-center py-8">
            <Link href="/account/my-account" className="inline-block px-8 py-3 bg-[#DF3131] text-white font-heading font-bold tracking-[0.1em] uppercase text-[14px] hover:bg-[#B82020] transition-all">Sign in to view your rewards</Link>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-16">
          {TIERS.map((t, i) => (
            <div key={i} className="bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#444] rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: t.color }} />
              <h3 className="font-heading font-bold text-[20px] tracking-[0.06em] mb-3" style={{ color: t.color }}>{t.name}</h3>
              <p className="text-[13px] text-[#888] mb-4">{t.points} pts</p>
              <ul className="space-y-2 text-left">
                {t.perks.map((p, j) => <li key={j} className="text-[16px] text-[#666] dark:text-[#b0b0b0] flex items-start gap-2"><span className="text-[#DF3131] mt-0.5">✓</span> {p}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mb-6">
          <h2 className="font-heading font-bold text-[18px] tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-4">Ways to Earn</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {WAYS.map((w, i) => (
            <div key={i} className="bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#444] rounded-xl p-6 text-center hover:shadow-lg transition-all group">
              <div className="w-10 h-10 mx-auto flex items-center justify-center text-[#DF3131] group-hover:scale-110 transition-transform mb-3">{w.icon}</div>
              <h3 className="font-heading font-bold text-[14px] tracking-[0.05em] text-[#333] dark:text-[#e0e0e0] mb-3">{w.title}</h3>
              <p className="text-[16px] text-[#666] dark:text-[#b0b0b0]">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
