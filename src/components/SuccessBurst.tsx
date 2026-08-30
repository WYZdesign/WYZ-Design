"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessBurstProps {
  show: boolean;
  onComplete?: () => void;
}

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  angle: (i * 30) * (Math.PI / 180),
  distance: 40 + Math.random() * 30,
  size: 4 + Math.random() * 4,
  delay: Math.random() * 0.15,
}));

export default function SuccessBurst({ show, onComplete }: SuccessBurstProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => { setVisible(false); onComplete?.(); }, 800);
      return () => clearTimeout(t);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.6, delay: p.delay, ease: "easeOut" }}
              className="absolute rounded-full bg-[#DF3131]"
              style={{ width: p.size, height: p.size }}
            />
          ))}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-8 h-8 rounded-full border-2 border-[#DF3131]"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
