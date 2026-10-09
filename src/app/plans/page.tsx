"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import DynamicForm from "@/components/DynamicForm";
import { trackMetaEvent } from "@/components/AnalyticsProvider";
import GyroTilt from "@/components/GyroTilt";
import PricingCalculator from "@/components/PricingCalculator";
import LeadMagnet from "@/components/LeadMagnet";
import type { FormField } from "@/components/DynamicForm";

const FEATURES: Record<string, string[]> = {
  "Starter Pack": [
    "(1) Two-Hour Photoshoot",
    "(1) Video Promo + Editing",
    "(1) Free Graphic Design",
    "Marketing/Branding Strategy Consultations",
    "Zeal Rewards/Perks + Referral Discounts",
  ],
  "Business Boost": [
    "(3) Graphic Designs",
    "(2) Two-Hour Photoshoots",
    "(2) Promo Video Shoots",
    "Digital Printing Service (<$100)",
    "Marketing/Branding Strategy Consultations",
    "Zeal Rewards/Perks + Referral Discounts",
  ],
  "Pro Plus": [
    "(3) Two-Hour Photoshoots",
    "(3) Graphic Designs",
    "(3) Promo Video Shoots",
    "Digital Printing Service (<$250)",
    "Marketing/Branding Strategy Consultations",
    "Zeal Rewards/Perks + Referral Discounts",
  ],
  "Ultimate Suite": [
    "Professional Photoshoots (Unlimited)",
    "Graphic Designs (Unlimited)",
    "Video Promos + Editing (Unlimited)",
    "Digital Printing Service",
    "Web Design + Maintenance",
    "Marketing/Branding Strategy Consultations",
    "Event Planning Service",
    "Zeal Rewards/Perks + Referral Discounts",
  ],
};

const PLANS = [
  { name: "Starter Pack", price: "$250", value: "$725 Value", popular: false, img: "/images/services/Photography.webp" },
  { name: "Business Boost", price: "$500", value: "$2,025 Value", popular: true, img: "/images/services/Logo Design.jpg" },
  { name: "Pro Plus", price: "$750", value: "$1,425 Value", popular: false, img: "/images/services/Video Shoot.jpg" },
  { name: "Ultimate Suite", price: "$1,000", value: "$5,000+ Value", popular: false, img: "/images/services/Website Design.jpg" },
];

const WEB_ADDONS = [
  { name: "Startup", original: "$650/mo", discounted: "$500/mo", desc: "Launch your dream business with confidence. Our startup plan offers the essential tools and support you need to succeed.", img: "/images/web-design/site_1.jpg" },
  { name: "Artist", original: "$400/mo", discounted: "$250/mo", desc: "Keep it simple. Our subscription plan gives independent artists and brands everything they need to succeed.", img: "/images/web-design/site_2.jpg" },
  { name: "Enterprise", original: "$900/mo", discounted: "$750/mo", desc: "Power up your business with a plan that does it all. Built to help you cut costs, work smarter, and grow.", img: "/images/web-design/site_3.jpg" },
];

const PLAN_KEYS: Record<string, string> = {
  "Starter Pack": "starter",
  "Business Boost": "business",
  "Pro Plus": "pro",
  "Ultimate Suite": "ultimate",
};

const CUSTOM_PLAN_FIELDS: FormField[] = [
  { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "Your name", page: 0 },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "you@email.com", page: 0 },
  { name: "phone", label: "Phone", type: "tel", placeholder: "(555) 555-5555", page: 0 },
  { name: "socialMedia", label: "Social Media", type: "text", placeholder: "@yourhandle", page: 0 },
  { name: "services_photography", label: "Photography", type: "checkbox", page: 1 },
  { name: "services_graphic", label: "Graphic Design", type: "checkbox", page: 1 },
  { name: "services_video", label: "Videography", type: "checkbox", page: 1 },
  { name: "services_printing", label: "Custom Printing", type: "checkbox", page: 1 },
  { name: "services_web", label: "Web Design", type: "checkbox", page: 1 },
  { name: "services_consultation", label: "Consultation", type: "checkbox", page: 1 },
  { name: "planType", label: "Plan Type", type: "select", options: [
    { value: "one-time", label: "One-Time Fee" },
    { value: "recurring", label: "Recurring Plan" },
    { value: "contract", label: "Contract" },
  ], page: 2 },
  { name: "startDate", label: "Start Date", type: "date", page: 2 },
  { name: "additionalInfo", label: "Additional Info", type: "textarea", placeholder: "Tell us about your needs...", page: 2 },
  { name: "keepUpdated", label: "Keep me updated on new services and promotions.", type: "checkbox", page: 2 },
];

function PlanCard({ p, subscribe, loading }: { p: typeof PLANS[0]; subscribe: (name: string) => void; loading: string | null }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <GyroTilt intensity={5} enableOnDesktop>
    <div
      className="relative cursor-pointer"
      style={{ perspective: "1200px", minHeight: "min(550px, 85vh)" }}
      tabIndex={0}
      onFocus={() => setFlipped(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFlipped(false); }}
      onClick={() => setFlipped(f => !f)}
    >
      {/* Front */}
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out`} style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)" }}>
        <div className="relative w-full h-full overflow-hidden border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#DF3131]/10">
          <Image src={p.img} alt={p.name} fill sizes="(max-width:640px) 100vw, 25vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 flex items-center justify-center z-10 px-6 text-center">
            <h3 className="font-heading font-black text-white text-[26px] tracking-[0.06em] text-center drop-shadow-lg uppercase">{p.name}</h3>
          </div>
        </div>
      </div>
      {/* Back */}
      <div
        className="absolute inset-0 transition-all duration-700 ease-in-out"
        style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(0deg)" : "rotateY(180deg)" }}
      >
        <div className={`w-full h-full bg-[#DF3131] text-white p-7 flex flex-col justify-between overflow-hidden relative ${
          p.popular ? "border-[4px] border-[#DF3131]" : ""
        }`}>
          <div className="relative z-10 text-center">
            {p.popular && (
              <div className="inline-block bg-white text-[#DF3131] text-[12px] font-bold px-4 py-1 tracking-[0.08em] mb-3">★ MOST POPULAR</div>
            )}
            <h3 className="font-heading font-black text-white text-[22px] tracking-[0.03em] mb-3">{p.name}</h3>
            <div className="mb-4">
              <span className="text-[40px] font-black text-white">{p.price}</span>
              <span className="text-white text-sm">/mo</span>
            </div>
            <p className="text-white text-[14px] mb-2">{p.value}</p>
            <p className="text-white text-[12px] mb-4">Billed monthly, cancel anytime</p>
            <ul className="space-y-2 text-left max-w-xs mx-auto">
              {FEATURES[p.name].map((f) => (
                <li key={f} className="text-[17px] text-white flex items-start gap-2">
                  <span className="text-white mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative z-10">
            <button onClick={(e) => { e.stopPropagation(); subscribe(p.name); }} disabled={loading === p.name} className="block w-full text-center py-3 bg-white text-[#111] text-[12px] sm:text-[14px] font-bold tracking-[0.08em] hover:bg-[#DF3131] hover:text-white transition-all disabled:opacity-50">
              {loading === p.name ? "Loading..." : "SUBSCRIBE"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </GyroTilt>
  );
}

function WebAddonCard({ w, i }: { w: typeof WEB_ADDONS[0]; i: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <GyroTilt intensity={5} enableOnDesktop>
    <div
      className="relative cursor-pointer"
      style={{ perspective: "1200px", minHeight: "min(440px, 65vh)" }}
      tabIndex={0}
      onFocus={() => setFlipped(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFlipped(false); }}
      onClick={() => setFlipped(f => !f)}
    >
      {/* Front */}
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out`} style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)" }}>
        <div className="relative w-full h-full overflow-hidden border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#DF3131]/10">
          <Image src={w.img} alt={w.name} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 flex items-center justify-center z-10 px-6 text-center">
            <h3 className="font-heading font-black text-white text-[24px] tracking-[0.06em] text-center drop-shadow-lg uppercase">{w.name}</h3>
          </div>
        </div>
      </div>
      {/* Back */}
      <div
        className="absolute inset-0 transition-all duration-700 ease-in-out"
        style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(0deg)" : "rotateY(180deg)" }}
      >
        <div className={`w-full h-full bg-[#DF3131] text-white p-5 flex flex-col justify-between overflow-hidden relative ${
          i === 0 ? "border-[4px] border-[#DF3131]" : ""
        }`}>
          <div className="relative z-10 text-center">
            {i === 0 && (
              <div className="inline-block bg-white text-[#DF3131] text-[11px] font-bold px-3 py-1 tracking-[0.1em] mb-2">★ RECOMMENDED</div>
            )}
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white mb-2">Web Design Add-On</span>
            <h3 className="font-heading font-black text-white text-[20px] tracking-[0.03em] mb-3">{w.name}</h3>
            <div className="mb-3">
              <span className="text-white text-[12px] line-through mr-2">{w.original}</span>
              <span className="text-[28px] font-black text-white">{w.discounted}</span>
            </div>
            <p className="text-white text-[13px] leading-relaxed mb-2">{w.desc}</p>
            <p className="text-white text-[11px]">10% discount when added to any subscription plan</p>
          </div>
          <div className="relative z-10">
            <Link href="/web-design" className="block text-center py-2.5 bg-white text-[#111] text-[13px] font-bold tracking-[0.08em] hover:bg-[#DF3131] hover:text-white transition-all" onClick={(e) => e.stopPropagation()}>
              GET STARTED
            </Link>
          </div>
        </div>
      </div>
    </div>
    </GyroTilt>
  );
}

export default function PlansPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function subscribe(planName: string) {
    const key = PLAN_KEYS[planName];
    if (!key) return;
    setLoading(planName);
    try {
      // Referral attribution from share links (/plans?ref=CODE)
      const ref = new URLSearchParams(window.location.search).get("ref") || undefined;
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "subscription", plan: key, ref }),
      });
      const data = await res.json();
      if (data.url) {
        trackMetaEvent("InitiateCheckout", { value: planName });
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Checkout failed. Make sure Stripe is configured.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="pb-12 bg-white dark:bg-[#1C1C1E]">
      <div className="max-w-[115rem] mx-auto px-6 lg:px-12 pt-12">

        {/* Plan Cards */}
        <ScrollReveal animation="fadeUp" delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {PLANS.map((p) => (
            <PlanCard key={p.name} p={p} subscribe={subscribe} loading={loading} />
          ))}
        </div>
        </ScrollReveal>


        {/* Auto-renew disclaimer */}
        <p className="mt-8 text-[16px] text-[#666] text-center max-w-3xl mx-auto leading-relaxed text-center">
          All subscription plans auto-renew monthly. You can cancel at any time by contacting our
          customer support team or through your online account. If you cancel before the end of your current
          subscription period, your subscription will still be active until the end of the current period, and
          you won&apos;t receive a refund for any unused portion.
        </p>

        {/* Interactive Pricing Calculator */}
        <ScrollReveal animation="fadeUp" delay={0.1}>
          <section className="section-gap border-t border-[#E2E2E2] dark:border-[#444]">
            <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-8">
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#DF3131] block mb-2">ESTIMATE YOUR COST</span>
                <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase text-[#333] dark:text-[#e0e0e0] mb-2">PRICING CALCULATOR</h2>
                <p className="text-[#666] dark:text-[#aaa] text-[14px]">Pick what you need. See what it costs. No surprises.</p>
              </div>
              <PricingCalculator />
            </div>
          </section>
        </ScrollReveal>

        {/* Build Your Own Plan */}
        <div className="mt-10 border border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#252528] p-6">
          <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold text-[#333333] dark:text-[#e0e0e0] tracking-[0.1em] text-center mb-4">BUILD YOUR OWN PLAN</h2>
          <DynamicForm
            fields={CUSTOM_PLAN_FIELDS}
            formType="custom-plan"
            submitLabel="SUBMIT"
            className="max-w-2xl mx-auto"
            paginated
          />
        </div>

        {/* Web Design Add-Ons */}
        <div className="mt-10 pb-10">
          <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold text-[#333333] dark:text-[#e0e0e0] tracking-[0.1em] text-center mb-4">Web Design</h2>
          <p className="text-[16px] text-[#666666] max-w-2xl mb-6 text-center mx-auto">
            Want to look your best online? Our Web Design service can help you build a website
            that reflects your brand&apos;s unique identity. Add it to any subscription plan and
            you&apos;ll save 10%.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
{WEB_ADDONS.map((w, i) => (
            <WebAddonCard key={w.name} w={w} i={i} />
          ))}
          </div>
        </div>

        <LeadMagnet />
      </div>
    </section>
  );
}
