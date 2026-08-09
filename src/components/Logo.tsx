import Image from "next/image";
import { useState } from "react";
export default function Logo({
 size = 44, className = "", showText = false,
}: { size?: number; className?: string; showText?: boolean; }) {
  const [broken, setBroken] = useState(false);
  const h = Math.round(size * 0.66);
  return (
  <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
  {broken ? (
  <svg viewBox="0 0 128 84" width={size} height={h} aria-label="WYZ Design">
  <path d="M6 80 L2 34 L26 50 L40 16 L54 40 L64 8 L80 34 L104 24 L122 80 Z" fill="#F9AD4D" stroke="#1d1408" strokeWidth="2.5" strokeLinejoin="round" />
  <path d="M64 8 L61 78 M40 16 L45 72 M104 24 L98 74" fill="none" stroke="#1d1408" strokeWidth="2" opacity=".5" />
  <path d="M66 64 L116 64 M70 73 L118 73" stroke="#1d1408" strokeWidth="2" opacity=".45" />
  <g transform="translate(110 13)">
  <path d="M0 -8 L8 -1 L0 10 L-8 -1 Z" fill="#2EC4F4" stroke="#0e7fb0" strokeWidth="1.3" strokeLinejoin="round" />
  <path d="M-8 -1 L8 -1 M0 -8 L0 10" stroke="#0e7fb0" strokeWidth=".8" opacity=".7" />
  </g>
  </svg>
  ) : (
  <Image src="/wyz-crown-square.png" alt="WYZ Design" width={size} height={h}
  style={{ objectFit: "contain", display: "block" }} onError={() => setBroken(true)} priority />
  )}
  {showText && (
  <span style={{ fontFamily: "var(--font-heading,'Montserrat',sans-serif)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", fontSize: Math.round(size * 0.42), color: "currentColor" }}>
  WYZ Design
  </span>
  )}
  </span>
  );
}
