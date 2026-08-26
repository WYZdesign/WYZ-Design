"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const SERVICES = [
  { name: "Photoshoot", price: 100, unit: "hr", cat: "Photography" },
  { name: "Photo Retouching", price: 50, unit: "session", cat: "Photography" },
  { name: "Event Photography", price: 200, unit: "3hr", cat: "Photography" },
  { name: "Graphic Design", price: 150, unit: "3hr", cat: "Design" },
  { name: "Logo Design", price: 100, unit: "3hr", cat: "Design" },
  { name: "Brand Identity Package", price: 300, unit: "6hr", cat: "Design" },
  { name: "Video Shoot", price: 200, unit: "3hr", cat: "Video" },
  { name: "Video Editing", price: 200, unit: "4hr", cat: "Video" },
  { name: "Motion Graphics", price: 150, unit: "2hr", cat: "Video" },
  { name: "Website Design", price: 500, unit: "3hr", cat: "Web" },
  { name: "SEO Audit", price: 50, unit: "session", cat: "Web" },
  { name: "Marketing Consultation", price: 50, unit: "1hr", cat: "Consultation" },
];

const PLANS = [
  { name: "Starter Pack", price: 250, value: 725 },
  { name: "Business Boost", price: 500, value: 2025 },
  { name: "Pro Plus", price: 750, value: 1425 },
  { name: "Ultimate Suite", price: 1000, value: 5000 },
];

export default function PricingCalculator() {
  const [selected, setSelected] = useState<Record<string, number>>({});

  const toggle = (name: string) => {
    setSelected(prev => ({
      ...prev,
      [name]: prev[name] ? 0 : 1,
    }));
  };

  const updateQty = (name: string, delta: number) => {
    setSelected(prev => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) + delta),
    }));
  };

  const total = useMemo(() => {
    return Object.entries(selected).reduce((sum, [name, qty]) => {
      const service = SERVICES.find(s => s.name === name);
      return sum + (service ? service.price * qty : 0);
    }, 0);
  }, [selected]);

  const comparison = useMemo(() => {
    if (total === 0) return null;
    // Priciest plan still under their estimate = max coverage within budget
    const under = PLANS.filter(p => p.price <= total).sort((a, b) => b.price - a.price);
    if (under.length > 0) {
      const plan = under[0];
      return {
        plan,
        beats: true,
        headline: `${plan.name} is $${plan.price}/mo`,
        body: `Your estimate runs $${total.toLocaleString()} for one month of this workload. ${plan.name} includes $${plan.value.toLocaleString()} in services monthly, so you'd come out ahead and keep the rest of your budget.`,
      };
    }
    const closest = PLANS.reduce((best, p) =>
      Math.abs(p.price - total) < Math.abs(best.price - total) ? p : best
    , PLANS[0]);
    return {
      plan: closest,
      beats: false,
      headline: `Need work like this every month? ${closest.name} runs $${closest.price}/mo`,
      body: `It covers $${closest.value.toLocaleString()} in services per month. One-off projects like this estimate are fine too, no pressure.`,
    };
  }, [total]);

  const activeCount = Object.values(selected).filter(q => q > 0).length;

  return (
    <div className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] rounded-2xl overflow-hidden">
      {/* Service Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px bg-[#E2E2E2] dark:bg-[#444]">
        {SERVICES.map(service => {
          const qty = selected[service.name] || 0;
          const isActive = qty > 0;
          return (
            <div key={service.name}
              className={`p-4 bg-white dark:bg-[#252528] transition-all ${isActive ? "ring-2 ring-[#DF3131] ring-inset" : ""}`}>
              <button onClick={() => toggle(service.name)}
                className={`w-full text-left mb-2 transition-colors ${isActive ? "text-[#DF3131]" : "text-[#333] dark:text-[#e0e0e0] hover:text-[#DF3131]"}`}>
                <p className="font-heading font-bold text-[13px] tracking-[0.02em]">{service.name}</p>
                <p className="text-[12px] text-[#666] dark:text-[#aaa]">${service.price}/{service.unit}</p>
              </button>
              {isActive && (
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQty(service.name, -1)}
                    className="w-7 h-7 border border-[#E2E2E2] dark:border-[#444] rounded flex items-center justify-center text-[#333] dark:text-[#e0e0e0] hover:border-[#DF3131] transition-colors text-sm">
                    -
                  </button>
                  <span className="text-[13px] font-bold text-[#333] dark:text-[#e0e0e0] w-6 text-center">{qty}</span>
                  <button onClick={() => updateQty(service.name, 1)}
                    className="w-7 h-7 border border-[#E2E2E2] dark:border-[#444] rounded flex items-center justify-center text-[#333] dark:text-[#e0e0e0] hover:border-[#DF3131] transition-colors text-sm">
                    +
                  </button>
                  <span className="text-[11px] text-[#666] dark:text-[#aaa] ml-auto">${(service.price * qty).toLocaleString()}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="p-6 bg-[#f9f9f9] dark:bg-[#1a1a1a] border-t border-[#E2E2E2] dark:border-[#444]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#666] dark:text-[#aaa]">Estimated Total</p>
            <p className="text-[2rem] font-heading font-black text-[#DF3131]">${total.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-[#666] dark:text-[#aaa]">{activeCount} service{activeCount !== 1 ? "s" : ""} selected</p>
          </div>
        </div>

        {comparison && (
          <div className="p-4 bg-[#DF3131]/5 dark:bg-[#DF3131]/10 border border-[#DF3131]/20 rounded-lg">
            <p className="text-[14px] font-heading font-bold tracking-[0.03em] text-[#333] dark:text-[#e0e0e0] mb-1">{comparison.headline}</p>
            <p className="text-[13px] text-[#666] dark:text-[#aaa] leading-relaxed mb-3">{comparison.body}</p>
            <div className="flex items-center gap-4">
              <Link href="/plans" className="inline-block px-5 py-2 bg-[#DF3131] text-white text-[12px] font-bold tracking-[0.1em] uppercase hover:bg-[#B82020] transition-all">
                Compare plans
              </Link>
              {comparison.beats && (
                <span className="text-[12px] text-[#666] dark:text-[#aaa]">Cancel anytime, no lock-in</span>
              )}
            </div>
          </div>
        )}

        {total === 0 && (
          <p className="text-[13px] text-[#666] dark:text-[#aaa] text-center">Tap services above to estimate your cost</p>
        )}
      </div>
    </div>
  );
}
