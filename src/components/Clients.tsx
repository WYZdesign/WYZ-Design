"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { prefersReducedMotion } from "@/lib/utils";

function ClientsCarousel() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  return (
      <section className="py-16 bg-white dark:bg-[#1C1C1E] overflow-hidden">
      <div className="max-w-[115rem] mx-auto px-6 lg:px-12">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-2xl font-heading font-bold text-[#333333] dark:text-white text-center mb-10 tracking-[0.1em]">Clients</motion.h2>
        <div className="relative overflow-hidden">
          <motion.div
            animate={reduced ? { x: "0%" } : { x: ["0%", "-50%"] }}
            transition={reduced ? { duration: 0 } : { duration: 25, repeat: Infinity, ease: "linear" }}
            className={reduced ? "flex items-center justify-center gap-10" : "flex gap-10"}>
            {[...Array(reduced ? 6 : 28)].map((_, i) => (
              <div key={i} className="w-24 h-24 border border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#252528] flex items-center justify-center shrink-0">
                <div className="w-10 h-10 bg-gray-100 dark:bg-[#333]" />
              </div>
            ))}
          </motion.div>
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white dark:from-[#1C1C1E] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white dark:from-[#1C1C1E] to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}

export default function Clients() {
  return (
    <ErrorBoundary fallback={
    <section className="py-16 bg-white dark:bg-[#1C1C1E] overflow-hidden">
        <div className="max-w-[115rem] mx-auto px-6 lg:px-12 text-center">
          <p className="text-[#666] dark:text-white/70 text-sm">Clients section temporarily unavailable</p>
        </div>
      </section>
    }>
      <ClientsCarousel />
    </ErrorBoundary>
  );
}
