"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiShare2, FiCopy, FiCheck, FiUsers, FiDollarSign, FiTrendingUp, FiAward, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

interface ReferralData {
  code: string;
  signups: number;
  purchases: number;
  totalCommission: number;
  paidCommission: number;
}

interface ConversionRow {
  id: string;
  event_type: string;
  commission: number | null;
  status: string;
  created_at: string;
}

interface LeaderEntry {
  name: string;
  conversions: number;
  earned: number;
}

export default function ReferralPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data ?? null;
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
  const [totalConversions, setTotalConversions] = useState(0);
  const [conversions, setConversions] = useState<ConversionRow[]>([]);

  useEffect(() => {
    fetch("/api/referral/leaderboard")
      .then((r) => r.json())
      .then((d) => {
        if (d?.leaders) {
          setLeaderboard(d.leaders);
          setTotalConversions(d.totals?.conversions || 0);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!session?.user?.email) { setLoading(false); return; }
    fetch("/api/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", email: session.user.email }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.code) {
          return Promise.all([
            fetch(`/api/referral?code=${d.code}`).then((r) => r.json()),
            fetch(`/api/referral/conversions?code=${d.code}`).then((r) => r.ok ? r.json() : { conversions: [] }).catch(() => ({ conversions: [] })),
          ]);
        }
      })
      .then((results) => {
        if (results && results[0]?.code) {
          setData(results[0]);
          if (results[1]?.conversions) setConversions(results[1].conversions);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session]);

  const copyCode = async () => {
    if (!data?.code) return;
    const url = `https://www.wyzdesign.com/plans?ref=${data.code}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const shareUrl = data ? `https://www.wyzdesign.com/plans?ref=${data.code}` : "";
  const shareText = "Check out WYZ Design for photography, design, and branding!";

  return (
    <main className="pb-16 bg-white dark:bg-[#1C1C1E]">
      <div className="max-w-5xl mx-auto px-6 pt-32 lg:pt-40">
        <div className="text-center mb-12">
          <p className="text-[#DF3131] text-[12px] font-heading font-bold tracking-[0.25em] uppercase mb-2">Earn Together</p>
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.15em] mb-6 sm:mb-8">
            REFER <span className="text-[#DF3131]">&</span> EARN
          </h1>
          <p className="text-[#666] dark:text-[#b0b0b0] max-w-xl mx-auto mb-3">
            Share your unique referral link. When someone signs up or purchases, you earn 10% commission. No limits, no caps.
          </p>
        </div>

        {!session && (
          <div className="text-center mb-10">
            <p className="text-[#666] dark:text-[#b0b0b0] mb-4">Sign in to get your referral code and track earnings.</p>
            <Link href="/account/my-account" className="inline-block px-8 py-3 bg-[#DF3131] text-white font-heading font-bold tracking-[0.1em] uppercase text-[14px] hover:bg-[#B82020] transition-all">
              Sign in
            </Link>
          </div>
        )}

        {session && loading && (
          <div className="text-center py-8 text-[#666]">Setting up your referral code...</div>
        )}

        {data && (
          <>
            <div className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] rounded-2xl p-8 mb-10">
              <div className="text-center mb-6">
                <p className="text-[13px] font-bold tracking-[0.15em] uppercase text-[#666] dark:text-white/50 mb-2">Your Referral Code</p>
                <p className="text-[2.5rem] font-heading font-black text-[#DF3131] tracking-[0.1em]">{data.code}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <button
                  onClick={copyCode}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#DF3131] text-white font-heading font-bold tracking-[0.1em] uppercase text-[13px] hover:bg-[#B82020] transition-all"
                >
                  {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Referral Link"}
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#333] dark:border-white text-[#333] dark:text-white font-heading font-bold tracking-[0.1em] uppercase text-[13px] hover:bg-[#333] hover:text-white transition-all"
                >
                  <FiShare2 className="w-4 h-4" /> Share on X
                </a>
              </div>

              <p className="text-center text-[13px] text-[#666] dark:text-white/50">
                Share this link anywhere. When someone clicks it and makes a purchase, you earn 10% commission.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] rounded-xl p-5 text-center">
                <FiUsers className="w-6 h-6 mx-auto text-[#DF3131] mb-2" />
                <p className="text-[2rem] font-heading font-black text-[#333] dark:text-white">{data.signups}</p>
                <p className="text-[11px] text-[#666] dark:text-white/50 uppercase tracking-wider">Signups</p>
              </div>
              <div className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] rounded-xl p-5 text-center">
                <FiTrendingUp className="w-6 h-6 mx-auto text-[#D49341] mb-2" />
                <p className="text-[2rem] font-heading font-black text-[#333] dark:text-white">{data.purchases}</p>
                <p className="text-[11px] text-[#666] dark:text-white/50 uppercase tracking-wider">Purchases</p>
              </div>
              <div className="bg-[#DF3131] rounded-xl p-5 text-center">
                <FiDollarSign className="w-6 h-6 mx-auto text-white mb-2" />
                <p className="text-[2rem] font-heading font-black text-white">${data.totalCommission.toFixed(2)}</p>
                <p className="text-[11px] text-white/70 uppercase tracking-wider">Total Earned</p>
              </div>
              <div className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] rounded-xl p-5 text-center">
                <FiDollarSign className="w-6 h-6 mx-auto text-green-600 mb-2" />
                <p className="text-[2rem] font-heading font-black text-green-600">${data.paidCommission.toFixed(2)}</p>
                <p className="text-[11px] text-[#666] dark:text-white/50 uppercase tracking-wider">Paid Out</p>
              </div>
            </div>

            <div className="bg-[#F5F5F3] dark:bg-[#252528] rounded-2xl p-8">
              <h2 className="font-heading font-bold text-[18px] tracking-[0.08em] uppercase text-[#333] dark:text-white mb-6 text-center">How It Works</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-[2rem] font-heading font-black text-[#DF3131] mb-2">01</p>
                  <p className="font-heading font-bold text-[14px] tracking-[0.05em] text-[#333] dark:text-white mb-2">Share Your Link</p>
                  <p className="text-[14px] text-[#666] dark:text-white/50">Send your unique referral link to friends, clients, or anyone who could use our services.</p>
                </div>
                <div className="text-center">
                  <p className="text-[2rem] font-heading font-black text-[#DF3131] mb-2">02</p>
                  <p className="font-heading font-bold text-[14px] tracking-[0.05em] text-[#333] dark:text-white mb-2">They Purchase</p>
                  <p className="text-[14px] text-[#666] dark:text-white/50">When someone uses your link to sign up or buy a service, we track the conversion.</p>
                </div>
                <div className="text-center">
                  <p className="text-[2rem] font-heading font-black text-[#DF3131] mb-2">03</p>
                  <p className="font-heading font-bold text-[14px] tracking-[0.05em] text-[#333] dark:text-white mb-2">Earn 10%</p>
                  <p className="text-[14px] text-[#666] dark:text-white/50">You earn 10% commission on every purchase. Payouts quarterly. No limits.</p>
                </div>
              </div>
            </div>

            {leaderboard.length > 0 && (
              <div className="mt-12 bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-heading font-black text-[1.5rem] tracking-[0.08em] uppercase text-[#333] dark:text-white">Top Referrers</h2>
                    <p className="text-[13px] text-[#666] dark:text-white/50 mt-1">{totalConversions} total conversions from all partners</p>
                  </div>
                  <FiAward className="w-8 h-8 text-[#DF3131]" />
                </div>
                <div className="space-y-3">
                  {leaderboard.map((leader, i) => (
                    <div key={leader.name} className={`flex items-center justify-between p-4 rounded-xl ${i === 0 ? "bg-[#DF3131]/10 border border-[#DF3131]/30" : "bg-[#F5F5F3] dark:bg-[#1C1C1E]"}`}>
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-black text-[14px] ${i === 0 ? "bg-[#DF3131] text-white" : i === 1 ? "bg-[#D49341] text-white" : i === 2 ? "bg-[#757575] text-white" : "bg-[#E2E2E2] dark:bg-[#444] text-[#666] dark:text-white/50"}`}>
                          {i + 1}
                        </span>
                        <span className="font-heading font-bold text-[#333] dark:text-white">{leader.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-heading font-black text-[#333] dark:text-white">{leader.conversions} conv{leader.conversions !== 1 ? "s" : ""}</span>
                        <span className="text-[#666] dark:text-white/50 text-[13px] ml-2">${leader.earned.toFixed(0)} earned</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {conversions.length > 0 && (
              <div className="mt-12 bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-heading font-black text-[1.5rem] tracking-[0.08em] uppercase text-[#333] dark:text-white">Your Conversions</h2>
                    <p className="text-[13px] text-[#666] dark:text-white/50 mt-1">Recent referral activity</p>
                  </div>
                  <FiClock className="w-6 h-6 text-[#666] dark:text-white/50" />
                </div>
                <div className="space-y-3">
                  {conversions.slice(0, 10).map((conv) => (
                    <div key={conv.id} className="flex items-center justify-between p-4 bg-[#F5F5F3] dark:bg-[#1C1C1E] rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${conv.event_type === "purchase" ? "bg-[#DF3131]/10" : "bg-[#D49341]/10"}`}>
                          {conv.event_type === "purchase" ? (
                            <FiDollarSign className="w-5 h-5 text-[#DF3131]" />
                          ) : (
                            <FiUsers className="w-5 h-5 text-[#D49341]" />
                          )}
                        </div>
                        <div>
                          <p className="font-heading font-bold text-[14px] text-[#333] dark:text-white capitalize">{conv.event_type}</p>
                          <p className="text-[12px] text-[#666] dark:text-white/50">Referral</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-heading font-bold text-[14px] ${conv.status === "paid" ? "text-green-600" : "text-[#DF3131]"}`}>
                          +${conv.commission?.toFixed(2) || "0.00"}
                        </span>
                        <p className="text-[11px] text-[#666] dark:text-white/30">{new Date(conv.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
