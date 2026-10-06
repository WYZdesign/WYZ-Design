"use client";

import Link from "next/link";
import { FiShoppingBag, FiX, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useCart } from "@/lib/cart";
import { formatUSD } from "@/lib/merch";

/**
 * Floating cart affordance. Appears once the cart has items so it does not
 * clutter the marketing pages. Opens a slide-in drawer; the full page lives at
 * /cart and both share the same CartProvider state.
 */
export default function CartButton() {
  const { lines, count, subtotalCents, open, setOpen, updateQuantity, removeLine } = useCart();

  if (!count) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
        className="fixed bottom-6 left-6 z-[100] flex items-center gap-2 rounded-full bg-[#111] text-white pl-4 pr-5 py-3 shadow-2xl hover:bg-[#DF3131] transition-colors"
      >
        <FiShoppingBag className="w-5 h-5" />
        <span className="text-[13px] font-bold tracking-[0.08em]">{count}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping cart">
          <button
            aria-label="Close cart"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md h-full bg-white dark:bg-[#1a1a1c] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E2E2] dark:border-[#333]">
              <h2 className="font-heading font-bold tracking-[0.08em] uppercase text-[#333] dark:text-white">
                Cart ({count})
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="p-2 text-[#666] dark:text-[#bbb] hover:text-[#DF3131]">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {lines.map((l) => (
                <div key={l.variantId} className="flex gap-3">
                  {l.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.image} alt={l.title} className="w-16 h-16 object-cover rounded border border-[#E2E2E2] dark:border-[#333]" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#333] dark:text-white truncate">{l.title}</p>
                    <p className="text-[12px] text-[#666] dark:text-[#aaa] truncate">
                      {[l.color, l.size].filter(Boolean).join(" / ") || l.variantName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQuantity(l.variantId, l.quantity - 1)} aria-label="Decrease quantity" className="p-1 border border-[#ccc] dark:border-[#444] rounded">
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="text-[13px] w-6 text-center">{l.quantity}</span>
                      <button onClick={() => updateQuantity(l.variantId, l.quantity + 1)} aria-label="Increase quantity" className="p-1 border border-[#ccc] dark:border-[#444] rounded">
                        <FiPlus className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeLine(l.variantId)} aria-label="Remove item" className="ml-1 p-1 text-[#999] hover:text-[#DF3131]">
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[13px] font-bold text-[#333] dark:text-white whitespace-nowrap">
                    {formatUSD(l.unitPriceCents * l.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E2E2E2] dark:border-[#333] px-5 py-4 space-y-3">
              <div className="flex justify-between text-[14px] font-bold text-[#333] dark:text-white">
                <span>Subtotal</span>
                <span>{formatUSD(subtotalCents)}</span>
              </div>
              <p className="text-[11px] text-[#777] dark:text-[#999]">Shipping calculated at checkout.</p>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="block w-full text-center py-3 bg-[#DF3131] text-white font-bold tracking-[0.1em] uppercase text-[13px] hover:bg-[#B82020] transition-colors"
              >
                View cart &amp; checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
