"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function Hero() {
  const { scrollY } = useScroll();
  const parallax = useTransform(scrollY, [0, 500], [0, 150]);
  const fadeOut = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20">
      <div className="absolute inset-0 z-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, #DF3131 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ y: parallax, opacity: fadeOut }}>
        <div className="absolute top-[25%] right-[15%] w-80 h-80 bg-[#DF3131]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] left-[10%] w-64 h-64 bg-[#D49341]/8 rounded-full blur-[80px]" />
      </motion.div>

      <div className="max-w-[115rem] mx-auto px-6 lg:px-12 relative z-10 py-20 w-full">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-heading font-black text-[#333333] leading-[0.95] tracking-tight">
              YOUR ONE<br />
              <span className="text-[#DF3131]">STOP SHOP</span>
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-5 text-lg text-[#666665] max-w-lg leading-relaxed">
             WYZ Design™ (pronounced "wise") helps startups and established brands stand out with tailored creative services, including photography, videography, graphic and web design, custom printing, event planning, marketing consulting, and SEO audits.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex gap-3">
            <Link href="/3pointprogram" className="btn-primary inline-flex items-center gap-2">
              Unlock Potential <FiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
