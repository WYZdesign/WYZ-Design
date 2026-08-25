"use client";

import { useState } from "react";
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

export default function GiftCardPage() {
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function buyGiftCard(amount: number) {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "giftcard", amount, email: email || undefined }),
      });
      const data = await res.json();
      if (data.url) {
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
    <main className="min-h-screen bg-white dark:bg-[#1C1C1E] pb-20">
 <div className="max-w-4xl mx-auto px-6 pt-8">
 <p className="text-[#DF3131] font-heading font-bold tracking-[0.15em] uppercase text-sm text-center mb-2">Give the Gift of Creative</p>
 <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] text-center mb-6 sm:mb-8">
 Gift Cards
 </h1>
 <p className="text-lg text-[#666666] dark:text-[#b0b0b0] mb-6 text-center">The perfect gift for anyone who needs design, photography, or creative services. Redeemable for any WYZ Design service or merch.</p>

        <div className="max-w-md mx-auto mb-12 text-center">
          <label className="block text-sm font-heading font-bold tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-1 text-center">Your Email (for receipt)</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full border border-gray-300 dark:border-[#555] px-4 py-3 min-h-[44px] text-[#333] dark:text-white dark:bg-[#252528] focus:border-[#DF3131] focus:outline-none" />
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

        <div className="bg-[#f5f5f5] dark:bg-[#252528] p-8 mb-16">
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
              <p className="text-sm text-[#666666] dark:text-[#b0b0b0]">Apply to any service or merch order. No expiration.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[#666666] dark:text-[#b0b0b0] mb-4">Need a custom amount or have questions?</p>
          <Link href="/booking" className="bg-[#DF3131] text-white px-8 py-3 min-h-[44px] font-heading font-bold tracking-[0.15em] uppercase hover:bg-red-700 transition-colors inline-flex items-center justify-center">
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
