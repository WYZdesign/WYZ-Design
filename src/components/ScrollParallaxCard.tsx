"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { prefersReducedMotion } from "@/lib/utils";

interface ScrollParallaxCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  scaleAmount?: number;
  yAmount?: number;
}

export default function ScrollParallaxCard({
  children,
  className = "",
  tiltAmount = 12,
  scaleAmount = 1.06,
  yAmount = 30,
}: ScrollParallaxCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) setReducedMotion(true);
  }, []);

  const frozenProgress = useMotionValue(0.5);
  const scrollSource = reducedMotion ? frozenProgress : scrollYProgress;

  const rotateX = useTransform(scrollSource, [0, 0.3, 0.7, 1], [tiltAmount, 0, 0, -tiltAmount]);
  const scale = useTransform(scrollSource, [0, 0.3, 0.7, 1], [0.92, scaleAmount, scaleAmount, 0.92]);
  const y = useTransform(scrollSource, [0, 0.5, 1], [yAmount, 0, -yAmount]);
  const opacity = useTransform(scrollSource, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX,
        scale,
        y,
        opacity,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      {children}
    </motion.div>
  );
}
