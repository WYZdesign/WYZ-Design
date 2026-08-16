"use client";

import { motion } from "framer-motion";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function ClientsCarousel() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-[115rem] mx-auto px-6 lg:px-12">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-2xl font-heading font-bold text-[#333333] text-center mb-10 tracking-[0.1em]">Clients</motion.h2>
        <div className="relative overflow-hidden">
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="flex gap-10">
            {[...Array(28)].map((_, i) => (
              <div key={i} className="w-24 h-24 border border-[#E2E2E2] bg-white flex items-center justify-center shrink-0">
                <div className="w-10 h-10 bg-gray-100" />
              </div>
            ))}
          </motion.div>
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}

export default function Clients() {
  return (
    <ErrorBoundary fallback={
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-[115rem] mx-auto px-6 lg:px-12 text-center">
          <p className="text-[#8F8F8F] text-sm">Clients section temporarily unavailable</p>
        </div>
      </section>
    }>
      <ClientsCarousel />
    </ErrorBoundary>
  );
}
