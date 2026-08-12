"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollParallaxCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  scaleAmount?: number;
}

export default function ScrollParallaxCard({
  children,
  className = "",
  tiltAmount = 8,
  scaleAmount = 1.05,
}: ScrollParallaxCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [tiltAmount, 0, -tiltAmount]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, scaleAmount, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX,
        scale,
        opacity,
        transformStyle: "preserve-3d",
        perspective: 1200,
      }}
    >
      {children}
    </motion.div>
  );
}
