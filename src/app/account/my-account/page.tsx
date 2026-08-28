"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface ZealSummary {
  points?: number;
  tier?: string;
  tierColor?: string;
}

interface ReferralSummary {
  code: string;
  signups: number;
  purchases: number;
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
}

export default function MyAccountPage() {
  const { status, data: session } = useSession();
  const [zeal, setZeal] = useState<ZealSummary | null>(null);
  const [referral, setReferral] = useState<ReferralSummary | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/zeal/status")
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d && typeof d.points === "number") setZeal(d); })
      .catch(() => {});
    // Fetch referral data by creating/looking up code
    if (session?.user?.email) {
      fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", email: session.user.email })
      })
        .then(r => (r.ok ? r.json() : null))
        .then(d => { if (d?.code) {
            fetch("/api/referral?code=" + encodeURIComponent(d.code))
              .then(r => r.ok ? r.json() : null)
              .then(rd => { if (rd) setReferral(rd); })
              .catch(() => {});
          } })
        .catch(() => {});
    }
  }, [status, session?.user?.email]);

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

  const name = session?.user?.name || "Member";
  const firstName = name.split(" ")[0];

  return (
    <main className="min-h-screen bg-white dark:bg-[#1C1C1E] px-6 pt-32 pb-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-[12px] font-bold tracking-[0.25em] uppercase text-[#DF3131] mb-2">Welcome back</p>
        <h1 className="text-[2rem] sm:text-[2.75rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.06em] uppercase mb-10" style={{ lineHeight: 0.9 }}>
          Hey {firstName}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/loyalty" className="group border border-[#E2E2E2] dark:border-[#444] rounded-2xl p-6 hover:border-[#DF3131] transition-all bg-white dark:bg-[#252528]">
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#666] dark:text-white/50 mb-2">Zeal Balance</p>
            {zeal ? (
              <>
                <p className="text-[2.5rem] font-heading font-black leading-none mb-1" style={{ color: zeal.tierColor || "#DF3131" }}>{zeal.points}</p>
                <p className="text-[12px] font-bold tracking-[0.1em] uppercase" style={{ color: zeal.tierColor || "#DF3131" }}>{zeal.tier} tier</p>
              </>
            ) : (
              <p className="text-[2.5rem] font-heading font-black text-[#DF3131] leading-none">--</p>
            )}
          </Link>

          <Link href="/loyalty" className="border border-[#E2E2E2] dark:border-[#444] rounded-2xl p-6 hover:border-[#DF3131] transition-all bg-white dark:bg-[#252528] flex flex-col justify-between">
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#666] dark:text-white/50 mb-2">Rewards</p>
            <p className="text-[16px] text-[#333] dark:text-[#e0e0e0] leading-snug">Spend your Zeal on discounts, retouching, and merch.</p>
          </Link>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/booking-calendar/photoshoot" className="px-6 py-3 bg-[#DF3131] text-white font-heading font-bold tracking-[0.1em] uppercase text-[13px] hover:bg-[#B82020] transition-all">
            Book a shoot
          </Link>
          <Link href="/contact" className="px-6 py-3 border-2 border-[#333] dark:border-white text-[#333] dark:text-white font-heading font-bold tracking-[0.1em] uppercase text-[13px] hover:bg-[#DF3131] hover:border-[#DF3131] hover:text-white transition-all">
            Contact the team
          </Link>
        </div>
      </div>
    </main>
  );
}
