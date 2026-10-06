"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatUSD } from "@/lib/merch";

interface OrderItem {
  name: string | null;
  variant_name: string | null;
  quantity: number;
  unit_price_cents: number;
  image: string | null;
}
interface Order {
  email: string | null;
  status: string;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  shipping_name: string | null;
}

export default function MerchOrderPage() {
  const [state, setState] = useState<"loading" | "pending" | "ready" | "error">("loading");
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const sessionId = new URL(window.location.href).searchParams.get("session_id");
    if (!sessionId) {
      setState("error");
      return;
    }
    const sid: string = sessionId;
    let tries = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    async function poll() {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/order-summary?session_id=${encodeURIComponent(sid)}`);
        if (cancelled) return;
        if (res.status === 202) {
          if (tries++ < 8) timer = setTimeout(poll, 1500);
          else setState("pending");
          return;
        }
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        setOrder(data.order);
        setItems(data.items || []);
        setState("ready");
      } catch {
        if (tries++ < 3) timer = setTimeout(poll, 1500);
        else setState("error");
      }
    }
    poll();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {state === "loading" && <p className="text-center text-[#666] dark:text-[#aaa]">Finalizing your order…</p>}

      {state === "pending" && (
        <div className="text-center space-y-4">
          <h1 className="font-heading font-black text-2xl text-[#333] dark:text-white">Payment received</h1>
          <p className="text-[#666] dark:text-[#aaa]">We are still confirming your order. It will appear in your receipt email shortly. If you need help, contact info@wyzdesign.com.</p>
          <Link href="/merch" className="inline-block px-8 py-3 bg-[#DF3131] text-white font-bold uppercase text-[13px]">Back to store</Link>
        </div>
      )}

      {state === "error" && (
        <div className="text-center space-y-4">
          <h1 className="font-heading font-black text-2xl text-[#333] dark:text-white">We could not load that order</h1>
          <p className="text-[#666] dark:text-[#aaa]">If you were charged, your receipt email is on its way. Questions: info@wyzdesign.com</p>
          <Link href="/merch" className="inline-block px-8 py-3 bg-[#DF3131] text-white font-bold uppercase text-[13px]">Back to store</Link>
        </div>
      )}

      {state === "ready" && order && (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="font-heading font-black text-3xl text-[#333] dark:text-white">Thank you</h1>
            <p className="text-[#666] dark:text-[#aaa]">
              Your order is confirmed{order.email ? ` and a receipt was sent to ${order.email}` : ""}.
            </p>
          </div>

          <div className="border border-[#E2E2E2] dark:border-[#333] rounded-lg divide-y divide-[#E2E2E2] dark:divide-[#333]">
            {items.map((it, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                {it.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.image} alt={it.name || "Merch"} className="w-16 h-16 object-cover rounded border border-[#E2E2E2] dark:border-[#333]" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#333] dark:text-white truncate">{it.name}</p>
                  <p className="text-[12px] text-[#666] dark:text-[#aaa]">{it.variant_name}</p>
                </div>
                <p className="text-[13px] text-[#666] dark:text-[#aaa]">x{it.quantity}</p>
                <p className="font-bold text-[#333] dark:text-white">{formatUSD(it.unit_price_cents * it.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-[14px] text-[#333] dark:text-[#ddd]">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatUSD(order.subtotal_cents)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{order.shipping_cents === 0 ? "Free" : formatUSD(order.shipping_cents)}</span></div>
            <div className="flex justify-between font-black text-[16px] pt-2 border-t border-[#E2E2E2] dark:border-[#333]">
              <span>Total</span><span>{formatUSD(order.total_cents)}</span>
            </div>
          </div>

          <div className="text-center">
            <Link href="/merch" className="inline-block px-8 py-3 bg-[#DF3131] text-white font-bold uppercase text-[13px]">Keep shopping</Link>
          </div>
        </div>
      )}
    </main>
  );
}
