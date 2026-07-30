"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const CARDS = [
  { title: "GRAPHIC DESIGNS", desc: "Elevate your brand with expert graphic design that captivates and sets you apart. Visit the graphic design page to browse our portfolio.", href: "/designs", cta: "View Gallery" },
  { title: "PHOTOGRAPHY", desc: "Engage and inspire with stunning photography that captures your brand\u2019s essence \u2014 from product shots to lifestyle imagery. Visit our photography page to view albums.", href: "/photography", cta: "View Albums" },
  { title: "EVENT RECAPS", desc: "Relive the magic with our captivating event recaps. We capture every moment to tell your story with power and authenticity. Visit our event recaps page to see the magic for yourself.", href: "/events", cta: "View Recaps" },
];

export default function CTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[115rem] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="border border-[#E2E2E2] bg-white p-6 hover:shadow-md transition-all flex flex-col">
              <div className="w-10 h-10 bg-[#DF3131]/10 flex items-center justify-center mb-4">
                <span className="text-[#DF3131] text-xl font-bold">{c.title[0]}</span>
              </div>
              <h3 className="text-lg font-heading font-bold text-[#333333] mb-2">{c.title}</h3>
              <p className="text-[13px] text-[#666665] leading-relaxed flex-1 mb-4">{c.desc}</p>
              <Link href={c.href} className="inline-flex items-center gap-2 text-[15px] font-semibold tracking-[0.08em] text-[#DF3131] hover:underline">
                {c.cta} <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
