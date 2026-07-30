"use client";

import { useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import DynamicForm from "@/components/DynamicForm";
import type { FormField } from "@/components/DynamicForm";

const FEATURES: Record<string, string[]> = {
  "Starter Pack": [
    "(1) Two-Hour Photoshoot",
    "(1) Video Promo + Editing",
    "(1) Free Graphic Design",
    "Marketing/Branding Strategy Consultations",
    "Loyalty Rewards/Perks + Referral Discounts",
  ],
  "Business Boost": [
    "(3) Graphic Designs",
    "(2) Two-Hour Photoshoots",
    "(2) Promo Video Shoots",
    "Digital Printing Service (<$100)",
    "Marketing/Branding Strategy Consultations",
    "Loyalty Rewards/Perks + Referral Discounts",
  ],
  "Pro Plus": [
    "(3) Two-Hour Photoshoots",
    "(3) Graphic Designs",
    "(3) Promo Video Shoots",
    "Digital Printing Service (<$250)",
    "Marketing/Branding Strategy Consultations",
    "Loyalty Rewards/Perks + Referral Discounts",
  ],
  "Ultimate Suite": [
    "Professional Photoshoots (Unlimited)",
    "Graphic Designs (Unlimited)",
    "Video Promos + Editing (Unlimited)",
    "Digital Printing Service",
    "Web Design + Maintenance",
    "Marketing/Branding Strategy Consultations",
    "Event Planning Service",
    "Loyalty Rewards/Perks + Referral Discounts",
  ],
};

const PLANS = [
  { name: "Starter Pack", price: "$250", value: "$725 Value", popular: false },
  { name: "Business Boost", price: "$500", value: "$2,025 Value", popular: true },
  { name: "Pro Plus", price: "$750", value: "$1,425 Value", popular: false },
  { name: "Ultimate Suite", price: "$1,000", value: "$5,000+ Value", popular: false },
];

const WEB_ADDONS = [
  { name: "Startup", original: "$650/mo", discounted: "$500/mo", desc: "Launch your dream business with confidence. Our startup plan offers the essential tools and support you need to succeed." },
  { name: "Artist", original: "$400/mo", discounted: "$250/mo", desc: "Simplify your creative journey. Our subscription plan provides everything you need to succeed as an independent artist or brand." },
  { name: "Enterprise", original: "$900/mo", discounted: "$750/mo", desc: "Power up your business with our comprehensive plan. Designed to help you streamline operations, optimize resources, and drive growth." },
];

const PLAN_KEYS: Record<string, string> = {
  "Starter Pack": "starter",
  "Business Boost": "business",
  "Pro Plus": "pro",
  "Ultimate Suite": "ultimate",
};

const CUSTOM_PLAN_FIELDS: FormField[] = [
  { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "you@email.com" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "(555) 555-5555" },
  { name: "socialMedia", label: "Social Media", type: "text", placeholder: "@yourhandle" },
  { name: "services", label: "Services Needed", type: "checkbox" },
  { name: "services", label: "Photography", type: "checkbox" },
  { name: "services", label: "Graphic Design", type: "checkbox" },
  { name: "services", label: "Videography", type: "checkbox" },
  { name: "services", label: "Custom Printing", type: "checkbox" },
  { name: "services", label: "Web Design", type: "checkbox" },
  { name: "services", label: "Consultation", type: "checkbox" },
  { name: "planType", label: "Plan Type", type: "select", options: [
    { value: "one-time", label: "One-Time Fee" },
    { value: "recurring", label: "Recurring Plan" },
    { value: "contract", label: "Contract" },
  ]},
  { name: "startDate", label: "Start Date", type: "date" },
  { name: "additionalInfo", label: "Additional Info", type: "textarea", placeholder: "Tell us about your needs..." },
  { name: "newsletterOptIn", label: "I want to subscribe to the newsletter.", type: "checkbox" },
];

function PlanCard({ p, subscribe, loading }: { p: typeof PLANS[0]; subscribe: (name: string) => void; loading: string | null }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: "1200px", minHeight: "min(480px, 70vh)" }}
      role="button"
      tabIndex={0}
      aria-label={`${p.name} plan, ${p.price}/month. ${p.value}. Click to flip and subscribe.`}
      onClick={() => setFlipped(f => !f)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipped(f => !f); } }}
    >
      {/* Front */}
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out`} style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)" }}>
        <div className={`relative bg-white dark:bg-[#252528] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full ${
          p.popular
            ? "border-[4px] border-[#DF3131] shadow-lg shadow-[#DF3131]/20 scale-[1.03]"
            : "border border-[#E2E2E2] hover:border-[#DF3131]/50"
        }`}>
          {p.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#DF3131] text-white text-[13px] font-bold px-5 py-1.5 tracking-[0.08em] shadow-lg shadow-[#DF3131]/40 z-10">
              Most Popular
            </div>
          )}
          <div className="p-5 text-center border-b border-[#E2E2E2]">
            <h3 className="font-heading font-bold text-[#333333] dark:text-[#e0e0e0] text-center">{p.name}</h3>
            <div className="mt-2 text-center">
              <span className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black text-[#333333] dark:text-[#e0e0e0]">{p.price}</span>
              <span className="text-[#8F8F8F] text-sm">/month</span>
            </div>
            <span className="inline-block mt-1 text-[14px] text-[#DF3131] font-semibold text-center">{p.value}</span>
            <p className="text-[13px] text-[#8F8F8F] text-center">Valid for 3 months</p>
          </div>
          <div className="p-5">
            <ul className="space-y-2">
              {FEATURES[p.name].map((f) => (
                <li key={f} className="text-[16px] text-[#666666] flex items-start gap-2 text-center justify-center">
                  <span className="text-[#DF3131] mt-0.5">+</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Back */}
      <div
        className="absolute inset-0 transition-all duration-700 ease-in-out"
        style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(0deg)" : "rotateY(180deg)" }}
      >
        <div className={`w-full h-full bg-[#DF3131] text-white p-6 flex flex-col justify-between overflow-hidden relative ${
          p.popular ? "border-[4px] border-[#DF3131]" : ""
        }`}>
          <div className="relative z-10 text-center">
            <h3 className="font-heading font-black text-white text-[22px] tracking-[0.03em] mb-2">{p.name}</h3>
            <div className="mb-4">
              <span className="text-[36px] font-black text-white">{p.price}</span>
              <span className="text-white/60 text-sm">/mo</span>
            </div>
            <p className="text-white/80 text-[14px] mb-2">{p.value}</p>
            <p className="text-white/60 text-[12px] mb-4">Valid for 3 months</p>
            <ul className="space-y-1.5 text-left max-w-xs mx-auto">
              {FEATURES[p.name].map((f) => (
                <li key={f} className="text-[13px] text-white/90 flex items-start gap-2">
                  <span className="text-white mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative z-10">
            <button onClick={(e) => { e.stopPropagation(); subscribe(p.name); }} disabled={loading === p.name} className="block w-full text-center py-3 bg-white text-[#DF3131] text-[12px] sm:text-[14px] font-bold tracking-[0.08em] hover:bg-[#333] hover:text-white transition-all disabled:opacity-50">
              {loading === p.name ? "Loading..." : "SUBSCRIBE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WebAddonCard({ w, i }: { w: typeof WEB_ADDONS[0]; i: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: "1200px", minHeight: "min(440px, 65vh)" }}
      role="button"
      tabIndex={0}
      aria-label={`${w.name} web design add-on - ${w.discounted}/month. Click to flip for details.`}
      onClick={() => setFlipped(f => !f)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipped(f => !f); } }}
    >
      {/* Front */}
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out`} style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)" }}>
        <div className={`border p-5 bg-white dark:bg-[#252528] text-center transition-all hover:-translate-y-1 hover:shadow-lg h-full ${
          i === 0
            ? "border-[4px] border-[#DF3131] shadow-md shadow-[#DF3131]/20"
            : "border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131]/50"
        }`}>
          {i === 0 && (
            <span className="text-[13px] font-bold text-[#DF3131] tracking-[0.08em]">Recommended</span>
          )}
          <h3 className="font-heading font-bold text-[#333333] dark:text-[#e0e0e0] mt-1 text-center">{w.name}</h3>
          <div className="mt-2 text-center">
            <span className="text-xs text-[#8F8F8F] dark:text-white/40 line-through">{w.original}</span>{" "}
            <span className="text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-heading font-black text-[#333333] dark:text-white">{w.discounted}</span>
          </div>
          <p className="text-[16px] text-[#666666] dark:text-white/60 mt-2 text-center">{w.desc}</p>
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
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/70">Web Design Add-On</span>
            <h3 className="font-heading font-black text-white text-[20px] tracking-[0.03em] mt-1 mb-2">{w.name}</h3>
            <div className="mb-3">
              <span className="text-white/50 text-[12px] line-through mr-2">{w.original}</span>
              <span className="text-[28px] font-black text-white">{w.discounted}</span>
            </div>
            <p className="text-white/80 text-[13px] leading-relaxed mb-2">{w.desc}</p>
            <p className="text-white/60 text-[11px]">10% discount when added to any subscription plan</p>
          </div>
          <div className="relative z-10">
            <Link href="/web-design" className="block text-center py-2.5 bg-white text-[#DF3131] text-[13px] font-bold tracking-[0.08em] hover:bg-[#333] hover:text-white transition-all" onClick={(e) => e.stopPropagation()}>
              GET STARTED
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlansPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function subscribe(planName: string) {
    const key = PLAN_KEYS[planName];
    if (!key) return;
    setLoading(planName);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "subscription", plan: key }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout failed. Make sure Stripe is configured.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="pb-12 bg-white dark:bg-[#1C1C1E]">
      {/* ── Hero: Split Layout ── */}
      <ScrollReveal animation="fadeIn" duration={1.2}>
        <section className="relative min-h-[50vh] lg:min-h-[70vh] flex flex-col lg:flex-row">
          {/* Left: Text */}
  <div className="w-full lg:w-1/2 bg-white dark:bg-[#111] flex items-center justify-center px-4 sm:px-10 lg:px-16 py-12 lg:py-0 order-2 lg:order-1">
  <div className="text-center max-w-xl">
<h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-[#333] dark:text-white tracking-[0.12em] mb-2 lg:mb-6" style={{ lineHeight: 1 }}>
 CHOOSE YOUR <span className="text-[#DF3131]">PRICING</span> PLAN
 </h1>
 <p className="text-[#666] dark:text-white/70 text-[16px] sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-md mx-auto">
  Affordable plans for any budget. Find what works best for you and your brand.
  </p>
  <Link href="/services"
  className="inline-block border-2 border-[#333] dark:border-white text-[#333] dark:text-white px-6 sm:px-8 py-3 sm:py-4 font-heading font-bold tracking-[0.15em] uppercase text-[12px] sm:text-sm text-center hover:bg-[#333] dark:hover:bg-white hover:text-white dark:hover:text-[#111] transition-all">
  SERVICES
  </Link>
  </div>
  </div>
          {/* Right: Visual */}
          <div className="w-full lg:w-1/2 h-[40vh] lg:h-auto relative overflow-hidden bg-gradient-to-br from-[#DF3131] to-[#991B1B] order-1 lg:order-2 flex items-center justify-center">
            <style>{`
              @keyframes pD1{0%,100%{transform:translateY(0) rotate(0deg);opacity:.12}50%{transform:translateY(-20px) rotate(8deg);opacity:.35}}
              @keyframes pD2{0%,100%{transform:translateY(0) rotate(0deg);opacity:.08}50%{transform:translateY(16px) rotate(-10deg);opacity:.28}}
              @keyframes pD3{0%,100%{transform:translateY(0) scale(1);opacity:.15}50%{transform:translateY(-12px) scale(1.1);opacity:.4}}
              @keyframes pD4{0%,100%{transform:translate(0,0) rotate(0deg);opacity:.1}50%{transform:translate(8px,-14px) rotate(12deg);opacity:.32}}
              @keyframes pD5{0%,100%{transform:translate(0,0) rotate(0deg);opacity:.06}50%{transform:translate(-10px,10px) rotate(-6deg);opacity:.22}}
            `}</style>
            {/* Massive scattered dollar signs */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Row 1 — top scattered */}
              <span className="absolute text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-black text-white/10" style={{top:"5%",left:"5%",animation:"pD1 5s ease-in-out infinite"}}>$</span>
              <span className="absolute text-[3.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-white/20" style={{top:"3%",left:"28%",animation:"pD2 7s ease-in-out 0.3s infinite"}}>$</span>
              <span className="absolute text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] font-black text-white/8" style={{top:"8%",left:"52%",animation:"pD3 6s ease-in-out 1s infinite"}}>$</span>
              <span className="absolute text-[4rem] sm:text-[5rem] lg:text-[6rem] font-black text-white/15" style={{top:"2%",right:"22%",animation:"pD1 8s ease-in-out 0.5s infinite"}}>$</span>
              <span className="absolute text-[1.8rem] sm:text-[2.2rem] lg:text-[2.8rem] font-black text-white/10" style={{top:"6%",right:"5%",animation:"pD4 5.5s ease-in-out 2s infinite"}}>$</span>

              {/* Row 2 — upper mid */}
              <span className="absolute text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-black text-[#FFD700]/15" style={{top:"18%",left:"8%",animation:"pD3 6.5s ease-in-out 1.5s infinite"}}>$</span>
              <span className="absolute text-[5rem] sm:text-[6rem] lg:text-[7rem] font-black text-white/12" style={{top:"15%",left:"35%",animation:"pD5 9s ease-in-out 0.8s infinite"}}>$</span>
              <span className="absolute text-[1.5rem] sm:text-[1.8rem] lg:text-[2.2rem] font-black text-white/8" style={{top:"22%",left:"60%",animation:"pD2 5s ease-in-out 2.5s infinite"}}>$</span>
              <span className="absolute text-[3rem] sm:text-[3.5rem] lg:text-[4.5rem] font-black text-[#FFD700]/10" style={{top:"16%",right:"10%",animation:"pD1 7.5s ease-in-out 1.2s infinite"}}>$</span>
              <span className="absolute text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-black text-white/10" style={{top:"20%",right:"30%",animation:"pD4 6s ease-in-out 3s infinite"}}>$</span>

              {/* Row 3 — center scatter */}
              <span className="absolute text-[6rem] sm:text-[7rem] lg:text-[8rem] font-black text-white/8" style={{top:"32%",left:"3%",animation:"pD2 8.5s ease-in-out 0.2s infinite"}}>$</span>
              <span className="absolute text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-black text-white/15" style={{top:"38%",left:"22%",animation:"pD3 5.5s ease-in-out 1.8s infinite"}}>$</span>
              <span className="absolute text-[4.5rem] sm:text-[5rem] lg:text-[5.5rem] font-black text-[#FFD700]/12" style={{top:"34%",left:"48%",animation:"pD1 7s ease-in-out 0.7s infinite"}}>$</span>
              <span className="absolute text-[1.2rem] sm:text-[1.5rem] lg:text-[1.8rem] font-black text-white/10" style={{top:"40%",right:"18%",animation:"pD5 6s ease-in-out 2.2s infinite"}}>$</span>
              <span className="absolute text-[3.5rem] sm:text-[4rem] lg:text-[5rem] font-black text-white/10" style={{top:"36%",right:"3%",animation:"pD4 8s ease-in-out 1.4s infinite"}}>$</span>

              {/* Row 4 — lower mid */}
              <span className="absolute text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-black text-white/12" style={{top:"52%",left:"6%",animation:"pD1 6s ease-in-out 2.8s infinite"}}>$</span>
              <span className="absolute text-[5.5rem] sm:text-[6rem] lg:text-[6.5rem] font-black text-[#FFD700]/10" style={{top:"50%",left:"30%",animation:"pD3 9s ease-in-out 0.4s infinite"}}>$</span>
              <span className="absolute text-[1.8rem] sm:text-[2rem] lg:text-[2.5rem] font-black text-white/8" style={{top:"55%",left:"55%",animation:"pD2 5s ease-in-out 3.5s infinite"}}>$</span>
              <span className="absolute text-[3rem] sm:text-[3.5rem] lg:text-[4rem] font-black text-white/15" style={{top:"48%",right:"8%",animation:"pD5 7s ease-in-out 1.1s infinite"}}>$</span>
              <span className="absolute text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-black text-white/10" style={{top:"54%",right:"28%",animation:"pD4 6.5s ease-in-out 2.4s infinite"}}>$</span>

              {/* Row 5 — bottom scatter */}
              <span className="absolute text-[4rem] sm:text-[4.5rem] lg:text-[5.5rem] font-black text-white/10" style={{top:"68%",left:"4%",animation:"pD3 7.5s ease-in-out 0.6s infinite"}}>$</span>
              <span className="absolute text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] font-black text-[#FFD700]/12" style={{top:"72%",left:"25%",animation:"pD1 5.5s ease-in-out 1.9s infinite"}}>$</span>
              <span className="absolute text-[6rem] sm:text-[7rem] lg:text-[8rem] font-black text-white/8" style={{top:"66%",left:"45%",animation:"pD2 10s ease-in-out 0.1s infinite"}}>$</span>
              <span className="absolute text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-black text-white/12" style={{top:"74%",right:"15%",animation:"pD4 6s ease-in-out 3.2s infinite"}}>$</span>
              <span className="absolute text-[1.2rem] sm:text-[1.5rem] lg:text-[2rem] font-black text-white/8" style={{top:"70%",right:"35%",animation:"pD5 5s ease-in-out 2.6s infinite"}}>$</span>

              {/* Row 6 — very bottom */}
              <span className="absolute text-[3rem] sm:text-[3.5rem] lg:text-[4rem] font-black text-white/10" style={{top:"82%",left:"10%",animation:"pD1 6.5s ease-in-out 1.3s infinite"}}>$</span>
              <span className="absolute text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-black text-[#FFD700]/15" style={{top:"85%",left:"38%",animation:"pD3 7s ease-in-out 2.7s infinite"}}>$</span>
              <span className="absolute text-[4.5rem] sm:text-[5rem] lg:text-[6rem] font-black text-white/12" style={{top:"80%",right:"12%",animation:"pD2 8s ease-in-out 0.9s infinite"}}>$</span>
              <span className="absolute text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] font-black text-white/8" style={{top:"88%",right:"30%",animation:"pD4 5.5s ease-in-out 3.8s infinite"}}>$</span>
            </div>
            {/* Center dollar display */}
            <div className="relative z-10 text-center px-8">
              <div className="text-[6.5rem] sm:text-[9rem] lg:text-[11.5rem] font-black text-white leading-none" style={{textShadow:"0 4px 30px rgba(0,0,0,0.3)"}}>$$$</div>
              <div className="mt-4 text-white/90 text-sm sm:text-base tracking-[0.3em] uppercase font-heading">4 Plans Available</div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <div className="max-w-[115rem] mx-auto px-6 lg:px-12 pt-12">

        {/* Plan Cards */}
        <ScrollReveal animation="fadeUp" delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {PLANS.map((p) => (
            <PlanCard key={p.name} p={p} subscribe={subscribe} loading={loading} />
          ))}
        </div>
        </ScrollReveal>

        {/* Auto-renew disclaimer */}
        <p className="mt-8 text-[16px] text-[#8F8F8F] text-center max-w-3xl mx-auto leading-relaxed text-center">
          All subscription plans auto-renew monthly or quarterly. You can cancel at any time by contacting our
          customer support team or through your online account. If you cancel before the end of your current
          subscription period, your subscription will still be active until the end of the current period, and
          you will not receive a refund for any unused portion.
        </p>

        {/* Build Your Own Plan */}
        <div className="mt-10 border border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#252528] p-6">
          <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold text-[#333333] dark:text-[#e0e0e0] tracking-[0.1em] mb-4 text-center">BUILD YOUR OWN PLAN</h2>
          <DynamicForm
            fields={CUSTOM_PLAN_FIELDS}
            formType="custom-plan"
            submitLabel="SUBMIT"
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Web Design Add-Ons */}
        <div className="mt-10 pb-10">
          <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold text-[#333333] dark:text-[#e0e0e0] tracking-[0.1em] mb-8 text-center">Web Design</h2>
          <p className="text-[16px] text-[#666666] max-w-2xl mb-6 text-center mx-auto">
            Looking to elevate your online presence? Our Web Design service can help you create a stunning website
            that reflects your brand&apos;s unique identity. Receive a 10% discount by including it as an add-on to
            any subscription plan.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WEB_ADDONS.map((w, i) => (
              <WebAddonCard key={w.name} w={w} i={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
