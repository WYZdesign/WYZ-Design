"use client";

import { useState } from "react";
import Link from "next/link";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useCart } from "@/lib/cart";
import { SHIPPING_OPTIONS, shippingCentsFor, formatUSD } from "@/lib/merch";

export default function CartPage() {
  const { lines, subtotalCents, updateQuantity, removeLine, ready } = useCart();
  const [shipping, setShipping] = useState<string>("standard");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipCents = shippingCentsFor(subtotalCents, shipping);
  const totalCents = subtotalCents + shipCents;

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "merch",
          shipping,
          items: lines.map((l) => ({
            variantId: l.variantId,
            productId: l.productId,
            quantity: l.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  }

  if (!ready) {
    return <main className="min-h-[60vh] flex items-center justify-center text-[#666] dark:text-[#aaa]">Loading cart…</main>;
  }

  if (!lines.length) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-heading font-black text-2xl text-[#333] dark:text-white">Your cart is empty</h1>
        <Link href="/merch" className="px-8 py-3 bg-[#DF3131] text-white font-bold tracking-[0.12em] uppercase text-[13px] hover:bg-[#B82020]">
          Browse the store
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#333] dark:text-white mb-8">Your Cart</h1>

      <div className="grid gap-10 lg:grid-cols-[1.6fr,1fr]">
        <div className="space-y-5">
          {lines.map((l) => (
            <div key={l.variantId} className="flex gap-4 border-b border-[#E2E2E2] dark:border-[#333] pb-5">
              {l.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={l.image} alt={l.title} className="w-24 h-24 object-cover rounded border border-[#E2E2E2] dark:border-[#333]" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#333] dark:text-white">{l.title}</p>
                <p className="text-[13px] text-[#666] dark:text-[#aaa]">{[l.color, l.size].filter(Boolean).join(" / ") || l.variantName}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => updateQuantity(l.variantId, l.quantity - 1)} aria-label="Decrease quantity" className="p-1.5 border border-[#ccc] dark:border-[#444] rounded">
                    <FiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-[14px]">{l.quantity}</span>
                  <button onClick={() => updateQuantity(l.variantId, l.quantity + 1)} aria-label="Increase quantity" className="p-1.5 border border-[#ccc] dark:border-[#444] rounded">
                    <FiPlus className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => removeLine(l.variantId)} aria-label="Remove item" className="ml-2 inline-flex items-center gap-1 text-[12px] text-[#999] hover:text-[#DF3131]">
                    <FiTrash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
              <p className="font-bold text-[#333] dark:text-white whitespace-nowrap">{formatUSD(l.unitPriceCents * l.quantity)}</p>
            </div>
          ))}
        </div>

        <aside className="h-max border border-[#E2E2E2] dark:border-[#333] rounded-lg p-6 space-y-4 bg-[#fafafa] dark:bg-[#1a1a1c]">
          <h2 className="font-heading font-bold uppercase tracking-[0.08em] text-[#333] dark:text-white">Order Summary</h2>
          <div className="space-y-2 text-[14px] text-[#333] dark:text-[#ddd]">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatUSD(subtotalCents)}</span></div>
            <div className="space-y-1">
              {SHIPPING_OPTIONS.map((o) => {
                const cost = shippingCentsFor(subtotalCents, o.id);
                return (
                  <label key={o.id} className="flex items-center justify-between gap-3 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <input type="radio" name="shipping" value={o.id} checked={shipping === o.id} onChange={() => setShipping(o.id)} />
                      <span className="text-[13px]">{o.label}</span>
                    </span>
                    <span className="text-[13px]">{cost === 0 ? "Free" : formatUSD(cost)}</span>
                  </label>
                );
              })}
            </div>
            <div className="flex justify-between font-black text-[16px] pt-2 border-t border-[#E2E2E2] dark:border-[#333]">
              <span>Total</span><span>{formatUSD(totalCents)}</span>
            </div>
          </div>

          {error && <p role="alert" className="text-[13px] text-[#DF3131]">{error}</p>}

          <button
            onClick={checkout}
            disabled={busy}
            className="w-full py-4 bg-[#DF3131] text-white font-bold tracking-[0.12em] uppercase text-[14px] hover:bg-[#B82020] transition-colors disabled:opacity-60"
          >
            {busy ? "Starting checkout…" : "Checkout"}
          </button>
          <p className="text-[11px] text-[#777] dark:text-[#999] text-center">
            Secure payment via Stripe. Prices and availability confirmed on the server before you pay.
          </p>
        </aside>
      </div>
    </main>
  );
}
