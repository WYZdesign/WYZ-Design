"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiCheck } from "react-icons/fi";

const PLANS = [
  {
    name: "Starter Pack", price: "$250", period: "Every month", value: "$725 Value", popular: true,
    features: ["(1) Two-Hour Photoshoot", "(1) Video Promo + Editing", "(1) Free Graphic Design (Logo, Cover Art, Flyer, Etc.)", "Marketing/Branding Strategy Consultations", "Loyalty Rewards/Perks + Referral Discounts"],
  },
  {
    name: "Business Boost", price: "$500", period: "Every month", value: "$2,025 Value",
    features: ["(3) Graphic Designs (Logos, Flyer, Cover Art, Etc.)", "(2) Two-Hour Photoshoots", "(2) Promo Video Shoots (Up to 1 min.)", "Digital Printing Service (<$100)", "Marketing/Branding Strategy Consultations", "Loyalty Rewards/Perks + Referral Discounts"],
  },
  {
    name: "Pro Plus", price: "$750", period: "Every month", value: "$1,425 Value",
    features: ["(3) Two-Hour Photoshoots", "(3) Graphic Designs (Logos, Flyer, Cover Art, Etc.)", "(3) Promo Video Shoots (Up to 1 min.)", "Digital Printing Service (<$250)", "Marketing/Branding Strategy Consultations", "Loyalty Rewards/Perks + Referral Discounts"],
  },
  {
    name: "Ultimate Suite", price: "$1,000", period: "Every month", value: "$5,000+ Value",
    features: ["Professional Photoshoots (Unlimited)", "Graphic Designs (Unlimited)", "Video Promos + Editing (Unlimited)", "Digital Printing Service", "Web Design + Maintenance", "Marketing/Branding Strategy Consultations", "Event Planning Service (Optional)", "Loyalty Rewards/Perks + Referral Discounts"],
  },
];

export default function Pricing() {
  return (
    <section className="py-20 bg-white dark:bg-[#1C1C1E]">
      <div className="max-w-[115rem] mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#333333] dark:text-white tracking-[0.1em]">Pricing Plans</h2>
          <p className="text-[#666665] dark:text-white/70 mt-2 text-[15px]">Affordable Plans for Any Budget</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {PLANS.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`relative border bg-white dark:bg-[#252528] flex flex-col ${p.popular ? "border-[#DF3131] shadow-md" : "border-[#E2E2E2] dark:border-[#444]"}`}>
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#DF3131] text-white text-[14px] font-bold px-3 py-1 tracking-[0.05em]">Most Popular</span>}
              <div className="p-6 text-center border-b border-[#E2E2E2] dark:border-[#444]">
                <h3 className="text-lg font-heading font-bold text-[#333333] dark:text-white">{p.name}</h3>
                <div className="mt-3 text-[#333333] dark:text-white"><span className="text-3xl font-heading font-black">{p.price}</span><span className="text-[#666] dark:text-white/70 text-sm">/{p.period.toLowerCase().replace("every ","")}</span></div>
                <span className="inline-block mt-2 text-[14px] text-[#DF3131] font-semibold bg-[#DF3131]/5 px-2 py-0.5">{p.value}</span>
                <p className="text-[14px] text-[#666] mt-1">Valid for 3 months</p>
              </div>
              <div className="p-6 flex-1">
                <ul className="space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-[#666665] dark:text-white/70"><FiCheck className="w-4 h-4 text-[#DF3131] mt-0.5 shrink-0" />{f}</li>
                  ))}
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Link href="/plans" className="block text-center py-2.5 bg-[#333333] text-white text-[15px] font-bold tracking-[0.1em] hover:bg-[#DF3131] dark:border dark:border-white dark:bg-white dark:text-[#111] dark:hover:bg-[#DF3131] dark:hover:text-white transition-all">Subscribe</Link>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-[15px] text-[#666] dark:text-white/70 text-center max-w-3xl mx-auto leading-relaxed">
          All our subscription plans are set to auto-renew on a monthly or quarterly basis, depending on the plan. We will automatically charge the payment method on file for the renewal period, unless you cancel the subscription before the renewal date. You can cancel your subscription at any time by contacting our customer support team or through your online account. If you cancel before the end of your current subscription period, your subscription will still be active until the end of the current period, and you will not receive a refund for any unused portion of the subscription.
        </p>
      </div>
    </section>
  );
}
