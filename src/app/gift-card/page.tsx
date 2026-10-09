"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { trackMetaEvent } from "@/components/AnalyticsProvider";

const CARDS = [
  { amount: 25, label: "Small", desc: "A sticker pack, small merch item, or partial service credit." },
  { amount: 50, label: "Medium", desc: "A photo retouch session or a merch bundle." },
  { amount: 100, label: "Large", desc: "A full hour of photography or a design session." },
  { amount: 150, label: "Premium", desc: "Half-day photoshoot or multi-piece design package." },
  { amount: 250, label: "VIP", desc: "Full creative package, design, photo, or web." },
];

interface Purchased {
  last4: string;
  amount: number;
  expires_at?: string;
}

export default function GiftCardPage() {
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState<Purchased | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") !== "true") return;
    const sessionId = params.get("session_id");
    if (!sessionId) return;
    setChecking(true);
    let tries = 0;
    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/gift-card/lookup?session_id=${encodeURIComponent(sessionId)}`);
        if (res.status === 202) {
          if (tries++ < 8) { setTimeout(poll, 1500); return; }
          setChecking(false);
          return;
        }
        if (res.ok) {
          const d = await res.json();
          setPurchased({ last4: d.code_last4, amount: d.amount, expires_at: d.expires_at });
        }
      } catch { /* ignore */ }
      setChecking(false);
    };
    poll();
    return () => { cancelled = true; };
  }, []);

  async function buyGiftCard(amount: number) {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "giftcard",
          amount,
          email: email || undefined,
          recipientEmail: recipientEmail || undefined,
        }),
      });
      const data = await res.json().catch((): { url?: string; error?: string } => ({}));
      if (res.ok && data.url) {
        trackMetaEvent("InitiateCheckout", { value: amount, content_type: "gift_card" });
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Checkout failed. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function buyCustom() {
    const amt = parseInt(customAmount);
    if (!amt || amt < 5) { toast.error("Enter an amount of $5 or more."); return; }
    await buyGiftCard(amt);
  }

  return (
    <section className="min-h-screen bg-white dark:bg-[#1C1C1E] pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-8">
        {checking && !purchased && (
          <div className="bg-[#f5f5f5] dark:bg-[#252528] p-6 mb-12 text-center text-[#666] dark:text-[#b0b0b0]">
            Finalizing your gift card…
          </div>
        )}

        {purchased && (
          <div className="bg-[#f5f5f5] dark:bg-[#252528] p-8 mb-12 text-center border border-[#DF3131]/30">
            <h2 className="font-heading font-bold tracking-[0.12em] uppercase text-[#333] dark:text-[#e0e0e0] mb-3">Your Gift Card</h2>
            <p className="text-[#666] dark:text-[#b0b0b0] mb-4">We emailed the full code to you. For security it is not shown here.</p>
            <p className="text-2xl sm:text-3xl font-black tracking-[0.15em] text-[#DF3131] bg-white dark:bg-[#1a1a1c] inline-block px-6 py-4 rounded border border-[#E2E2E2] dark:border-[#333]">
              •••• {purchased.last4}
            </p>
            <p className="text-[#666] dark:text-[#b0b0b0] mt-4">
              ${Number(purchased.amount).toFixed(2)} value. Apply it at checkout on any service or merch order.
            </p>
          </div>
        )}

        <div className="bg-[#f5f5f5] dark:bg-[#252528] p-8 mb-12">
          <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333] dark:text-[#e0e0e0] text-center mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#DF3131] mb-2">01</p>
              <p className="font-heading font-bold tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-2">Choose Amount</p>
              <p className="text-sm text-[#666666] dark:text-[#b0b0b0]">Pick a preset or custom value.</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#DF3131] mb-2">02</p>
              <p className="font-heading font-bold tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-2">Pay via Stripe</p>
              <p className="text-sm text-[#666666] dark:text-[#b0b0b0]">Secure checkout, credit card, Apple Pay, Google Pay.</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#DF3131] mb-2">03</p>
              <p className="font-heading font-bold tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-2">Redeem</p>
              <p className="text-sm text-[#666666] dark:text-[#b0b0b0]">Apply to any service or merch order. Valid for 24 months from purchase.</p>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto mb-16 space-y-4">
          <div>
            <label htmlFor="gift-card-email" className="block text-sm font-heading font-bold tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-1 text-center">Your Email (receipt + code)</label>
            <input id="gift-card-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" autoComplete="email" className="w-full border border-gray-300 dark:border-[#555] px-4 py-3 min-h-[44px] text-[#333] dark:text-white dark:bg-[#252528] focus:border-[#DF3131] focus:outline-none" />
          </div>
          <div>
            <label htmlFor="gift-card-recipient" className="block text-sm font-heading font-bold tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-1 text-center">Recipient Email (optional)</label>
            <input id="gift-card-recipient" type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} placeholder="them@email.com" autoComplete="off" className="w-full border border-gray-300 dark:border-[#555] px-4 py-3 min-h-[44px] text-[#333] dark:text-white dark:bg-[#252528] focus:border-[#DF3131] focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          {CARDS.map((card) => (
            <div key={card.label} className="border border-gray-200 dark:border-[#333] p-6 text-center hover:border-[#DF3131] transition-colors group bg-white dark:bg-[#252528]">
              <p className="text-3xl font-bold text-[#DF3131] mb-1">${card.amount}</p>
              <p className="text-sm font-heading font-bold tracking-[0.15em] uppercase text-[#333] dark:text-[#e0e0e0] mb-2">{card.label}</p>
              <p className="text-sm text-[#666666] dark:text-[#b0b0b0] mb-4">{card.desc}</p>
              <button onClick={() => buyGiftCard(card.amount)} disabled={loading} className="bg-[#333] text-white px-6 py-3 min-h-[44px] font-heading font-bold tracking-[0.15em] uppercase text-sm group-hover:bg-[#DF3131] transition-colors disabled:opacity-50">
                {loading ? "Loading..." : "Buy Now"}
              </button>
            </div>
          ))}
          <div className="border border-dashed border-gray-300 dark:border-[#555] p-6 text-center hover:border-[#DF3131] transition-colors bg-white dark:bg-[#252528]">
            <p className="text-3xl font-bold text-[#333] dark:text-[#e0e0e0] mb-1">Custom</p>
            <p className="text-sm font-heading font-bold tracking-[0.15em] uppercase text-[#333] dark:text-[#e0e0e0] mb-2">Any Amount</p>
            <input type="number" min="5" value={customAmount} onChange={e => setCustomAmount(e.target.value)} placeholder="$ Amount" aria-label="Custom gift card amount" className="w-full border border-gray-300 dark:border-[#555] px-3 py-3 min-h-[44px] text-center text-[#333] dark:text-white dark:bg-[#252528] focus:border-[#DF3131] focus:outline-none mb-3" />
            <button onClick={buyCustom} disabled={loading} className="bg-[#DF3131] text-white px-6 py-3 min-h-[44px] font-heading font-bold tracking-[0.15em] uppercase text-sm hover:bg-red-700 transition-colors disabled:opacity-50">
              {loading ? "Loading..." : "Buy Now"}
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[#666666] dark:text-[#b0b0b0] mb-4">Need a custom amount or have questions?</p>
          <Link href="/booking" className="bg-[#DF3131] text-white px-8 py-3 min-h-[44px] font-heading font-bold tracking-[0.15em] uppercase hover:bg-red-700 transition-colors inline-flex items-center justify-center">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
