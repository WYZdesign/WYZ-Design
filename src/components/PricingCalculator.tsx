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

const FAQ_ITEMS = [
  {
    q: "Do you offer custom packages?",
    a: "Absolutely. Every brand is different. If you need something specific not listed here, reach out and we'll build a custom plan that fits your needs and budget."
  },
  {
    q: "What's included in the hourly rate?",
    a: "All time quoted is billable time — shooting, editing, revisions, and delivery. We don't pad hours. You'll always know exactly what you're getting."
  },
  {
    q: "How fast can you turn a project around?",
    a: "Standard turnaround is 3-5 business days for most services. Rush delivery is available for an additional fee. Ask us before booking if timing is critical."
  },
  {
    q: "Do you offer refunds?",
    a: "We require a 50% deposit to book any service. Deposits are non-refundable within 48 hours of the scheduled session. Finished deliverables (designs, photos, videos) are non-refundable once delivered."
  },
  {
    q: "Can I cancel or reschedule?",
    a: "You can reschedule with 48+ hours notice at no charge. Cancellations within 48 hours forfeit the deposit. We understand things come up — just give us as much notice as possible."
  },
  {
    q: "Do you work with brands outside Los Angeles?",
    a: "Yes. We're based in LA and Chicago but work with clients nationwide. Remote sessions, video calls, and digital deliverables are our bread and butter."
  },
];

function FAQAccordion({ items }: { items: typeof FAQ_ITEMS }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="divide-y divide-[#E2E2E2] dark:divide-[#444]">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 py-4 text-left hover:bg-[#f9f9f9] dark:hover:bg-[#1a1a1a] transition-colors px-2"
          >
            <span className="font-heading font-bold text-[14px] text-[#333] dark:text-[#e0e0e0] tracking-[0.02em]">{item.q}</span>
            <svg
              className={`w-5 h-5 text-[#DF3131] flex-shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""}`}
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          {openIndex === i && (
            <div className="px-2 pb-4 animate-fadeIn">
              <p className="text-[13px] text-[#666] dark:text-[#aaa] leading-relaxed pl-2 border-l-2 border-[#DF3131] animate-wzFadeIn">
                {item.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PricingCalculator() {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [showFAQ, setShowFAQ] = useState(false);

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
    <div>
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

      {/* FAQ Section */}
      <div className="mt-8 bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#E2E2E2] dark:border-[#444]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-[18px] text-[#333] dark:text-[#e0e0e0] tracking-[0.05em]">FREQUENTLY ASKED</h3>
              <p className="text-[12px] text-[#666] dark:text-[#aaa] mt-1">Common questions about pricing and services</p>
            </div>
            <button
              onClick={() => setShowFAQ(!showFAQ)}
              className={`px-4 py-2 text-[12px] font-bold tracking-[0.1em] uppercase border-2 transition-all ${
                showFAQ
                  ? "bg-[#DF3131] text-white border-[#DF3131]"
                  : "border-[#DF3131] text-[#DF3131] hover:bg-[#DF3131] hover:text-white"
              }`}
            >
              {showFAQ ? "Hide FAQ" : "Show FAQ"}
            </button>
          </div>
        </div>
        {showFAQ && (
          <div className="p-4 sm:p-6">
            <FAQAccordion items={FAQ_ITEMS} />
            <div className="mt-6 pt-4 border-t border-[#E2E2E2] dark:border-[#444] text-center">
              <p className="text-[13px] text-[#666] dark:text-[#aaa] mb-3">Still have questions?</p>
              <Link href="/contact" className="inline-block px-6 py-2.5 bg-[#333] dark:bg-[#111] text-white text-[12px] font-bold tracking-[0.1em] uppercase hover:bg-[#DF3131] transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
