"use client";

import { ReactNode } from "react";

interface EnhancedMarqueeProps {
  children: ReactNode;
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
  pauseOnHover?: boolean;
  className?: string;
  gradientFade?: boolean;
}

const speeds = {
  slow: "35s",
  normal: "22s",
  fast: "13s",
};

export default function EnhancedMarquee({
  children,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className = "",
  gradientFade = false,
}: EnhancedMarqueeProps) {
  const animName =
    direction === "left" ? "wyzMarqueeLeft" : "wyzMarqueeRight";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {gradientFade && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent dark:from-[#1C1C1E]" />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent dark:from-[#1C1C1E]" />
        </>
      )}
      <div
        className={`wyz-marquee-track flex whitespace-nowrap ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
        style={{
          animation: `${animName} ${speeds[speed]} linear infinite`,
          width: "max-content",
        }}
      >
        {children}
        {children}
        {children}
        {children}
      </div>

      <style>{`
        @keyframes wyzMarqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wyzMarqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wyz-marquee-track { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
