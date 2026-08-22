"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";

const FAQS = [
  { q: "What services does WYZ Design offer?", a: "WYZ Design offers photography, graphic design, videography, web design, digital printing, and marketing/branding consultations." },
  { q: "How much does a photoshoot session with WYZ Design cost?", a: "Our photoshoot sessions start at $100 per hour, including free basic retouching and a 24-hour turnaround." },
  { q: "Can WYZ Design help with website design and development?", a: "Yes, we offer professional website design services starting at a flat rate of $500 for a website consisting of up to 5 pages." },
  { q: "Does WYZ Design provide printing services for business materials?", a: "Absolutely! We offer digital printing for various materials such as stickers, flyers, prints, and posters on different paper types." },
  { q: "Do you offer assistance with marketing and branding strategies?", a: "Yes, we offer marketing and branding strategy consultations at $50 per hour, providing expert advice and actionable steps to ensure your success." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-3xl font-heading font-bold text-[#333333] tracking-[0.1em]">Services</h2>
          <h3 className="text-2xl font-heading font-bold text-[#333333] mt-2 tracking-[0.05em]">FAQ</h3>
        </motion.div>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <div key={i} className="border border-[#E2E2E2] bg-white">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors whitespace-normal">
                <span className="text-[14px] font-semibold text-[#333333] pr-4">{f.q}</span>
                {open === i ? <FiMinus className="w-4 h-4 text-[#DF3131] shrink-0" /> : <FiPlus className="w-4 h-4 text-[#8F8F8F] shrink-0" />}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="px-5 pb-4 text-[13px] text-[#666665] leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
