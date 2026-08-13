"use client";
import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;
const CONTENT_EASE = [0.22, 1, 0.36, 1] as const;

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => { setIsFirstRender(false); }, []);
  useEffect(() => { if (!isFirstRender) window.scrollTo(0, 0); }, [pathname, isFirstRender]);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        {/* Red curtain — wipes in on exit */}
        <motion.div
          className="fixed inset-0 z-[9998] bg-[#DF3131] pointer-events-none origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 0 }}
          exit={{ scaleX: 1, transition: { duration: 0.6, ease: CURTAIN_EASE } }}
        />
        {/* Dark curtain — wipes out after red */}
        <motion.div
          className="fixed inset-0 z-[9998] bg-[#111] pointer-events-none origin-right"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0, transition: { duration: 0.6, ease: CURTAIN_EASE, delay: 0.1 } }}
          exit={{ scaleX: 0 }}
        />
        {/* Content — fades in with blur */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: CONTENT_EASE, delay: 0.5 } }}
          exit={{ opacity: 0, y: -30, filter: "blur(4px)", transition: { duration: 0.3, ease: CONTENT_EASE } }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
