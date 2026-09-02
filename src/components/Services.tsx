"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiCamera, FiPenTool, FiVideo, FiUsers, FiGlobe } from "react-icons/fi";

const SERVICE_CATEGORIES = [
  { icon: FiCamera, title: "Photography", href: "/photography" },
  { icon: FiPenTool, title: "Graphic Design", href: "/designs" },
  { icon: FiVideo, title: "Videography", href: "/services" },
  { icon: FiUsers, title: "Consultation", href: "/services" },
  { icon: FiGlobe, title: "Web Design", href: "/web-design" },
];

const BOOKINGS = [
  { name: "Photoshoot", price: "$100", duration: "1 hr", desc: "Capture authentic moments with sleek, professional photography.", href: "/booking-calendar/photoshoot" },
  { name: "Photo Retouching", price: "Varies", duration: "2 hr", desc: "Basic to Advanced Professional Photo Retouching", href: "/booking-calendar/photo-retouching" },
  { name: "Event Photography", price: "$200", duration: "3 hr", desc: "Expertly capturing every moment, from public showcases to private events and behind-the-scenes.", href: "/booking-calendar/event-photography" },
];

export default function Services() {
  return (
    <section className="py-20 bg-white dark:bg-[#1C1C1E]">
      <div className="max-w-[115rem] mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#333333] dark:text-white tracking-[0.15em]">S{" "}E{" "}R{" "}V{" "}I{" "}C{" "}E{" "}S</h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-16">
          {SERVICE_CATEGORIES.map((s) => {
            const I = s.icon;
            return (
              <Link key={s.title} href={s.href}
                className="flex flex-col items-center gap-2 p-5 border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] hover:shadow-sm transition-all group">
                <I className="w-6 h-6 text-[#DF3131] group-hover:scale-110 transition-transform" />
                <span className="text-[15px] tracking-[0.1em] font-semibold text-[#333333] dark:text-white text-center">{s.title}</span>
              </Link>
            );
          })}
        </motion.div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-heading font-bold text-[#333333] dark:text-white tracking-[0.1em]">Service Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BOOKINGS.map((b, i) => (
            <motion.div key={b.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="border border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#252528] hover:shadow-md transition-all">
              <div className="aspect-[16/10] bg-gray-100 dark:bg-[#333] flex items-center justify-center">
                <FiCamera className="w-10 h-10 text-[#CBCBCA]" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-heading font-bold text-[#333333] dark:text-white">{b.name}</h3>
                <p className="text-[13px] text-[#666665] dark:text-white/70 mt-1 mb-4 leading-relaxed">{b.desc}</p>
                <Link href={b.href} className="text-[15px] tracking-[0.1em] text-[#DF3131] font-semibold hover:underline">Read More</Link>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E2E2E2] dark:border-[#444] text-[13px]">
                  <span className="text-[#666] dark:text-white/70">{b.duration}</span>
                  <span className="font-bold text-[#333333] dark:text-white">{b.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
