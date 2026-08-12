"use client";
import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const CURTAIN_TRANSITION = { duration: 0.5, ease: [0.7, 0, 0.3, 1] } as const;
const CONTENT_TRANSITION = { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as const;
const CONTENT_EXIT_TRANSITION = { duration: 0.3, ease: [0.22, 1, 0.36, 1] } as const;

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  useEffect(() => {
    if (!isFirstRender) {
      window.scrollTo(0, 0);
    }
  }, [pathname, isFirstRender]);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        <motion.div
          className="fixed inset-0 z-[9998] bg-[#DF3131] pointer-events-none"
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={{ scaleX: 0, transformOrigin: "right" }}
          exit={{ scaleX: 1, transformOrigin: "left", transition: { duration: 0.5, ease: [0.7, 0, 0.3, 1] } }}
          transition={{ ...CURTAIN_TRANSITION, delay: 0.1 }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { ...CONTENT_TRANSITION, delay: 0.35 },
          }}
          exit={{
            opacity: 0,
            y: -20,
            scale: 0.98,
            transition: CONTENT_EXIT_TRANSITION,
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
