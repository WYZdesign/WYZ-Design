"use client";

// Shared brand-lockup pieces extracted from src/components/SplashVariants.tsx
// (oversized-file split, board S6). Every splash variant renders <Brand/>
// (or the raw CrownLogo/Wordmark) inside its own canvas/pointer stage;
// this file holds only the brand chrome, not any variant's interaction logic.

import { useEffect, useRef, useState } from "react";

export const R = "#DF3131", RD = "#B82020", G = "#C9A227", GL = "#F9AD4D", OW = "#FFFFFF", CH = "#262626", DK = "#161311";

export const CSS = `
@keyframes wyzDraw { to { stroke-dashoffset: 0; } }
@keyframes wyzFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
@keyframes wyzRipple { from{transform:translate(-50%,-50%) scale(0);opacity:.6} to{transform:translate(-50%,-50%) scale(28);opacity:0} }
@keyframes wyzFade { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
@keyframes wyzBlink { 50%{opacity:0} }
@keyframes wyzPulse { 50%{opacity:.65} }
.wyz-lockup{font-family:'Montserrat',system-ui,sans-serif;font-weight:900;text-transform:uppercase;letter-spacing:.04em;line-height:.84;display:inline-flex;flex-direction:column;align-items:center;font-size:clamp(46px,9vw,104px)}
.wyz-grad{background:linear-gradient(100deg,${R},${G},${R});-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.wyz-tag{font-family:'Montserrat',system-ui,sans-serif;text-transform:uppercase;letter-spacing:.28em;font-size:13px;font-weight:600;margin:16px 0 0}
.wyz-enter{pointer-events:auto;margin-top:28px;font-family:'Montserrat',system-ui,sans-serif;text-transform:uppercase;letter-spacing:.14em;font-weight:700;font-size:14px;color:${OW};background:${R};border:none;padding:15px 36px;border-radius:3px;cursor:pointer;transition:background .2s,transform .1s}
.wyz-enter:hover{background:${RD}}
.wyz-enter:active{transform:scale(.97)}
.wyz-pdraw path{stroke-dasharray:300;stroke-dashoffset:300;animation:wyzDraw 1.9s ease forwards}
.wyz-card{position:relative;aspect-ratio:16/10;border-radius:14px;overflow:hidden;cursor:pointer;border:1px solid #2a2522;transition:transform .2s,border-color .2s}
.wyz-card:hover{transform:translateY(-4px);border-color:${R}}
.wyz-glitch{position:relative}
.wyz-glitch::before,.wyz-glitch::after{content:attr(data-t);position:absolute;left:0;top:0}
.wyz-glitch.go::before{color:${R};clip-path:inset(0 0 55% 0);transform:translateX(-5px)}
.wyz-glitch.go::after{color:#00b4d8;clip-path:inset(55% 0 0 0);transform:translateX(5px)}
`;

/* ---------- LOGO ---------- */
export function CrownLogo({ size = 70, style }: { size?: number; style?: React.CSSProperties }) {
 const [broken, setBroken] = useState(false);
  if (!broken) {
  // eslint-disable-next-line @next/next/no-img-element -- tiny inline brand mark with an onError raster fallback
  return <img src="/wyz-crown.webp" alt="WYZ Design" width={size} height={Math.round(size * 0.66)} style={{ objectFit: "contain", ...style }} onError={() => setBroken(true)} />;
 }
 return (
 <svg viewBox="0 0 128 84" width={size} height={size * 84 / 128} style={style} aria-hidden="true">
 <path d="M6 80 L2 34 L26 50 L40 16 L54 40 L64 8 L80 34 L104 24 L122 80 Z" stroke="#1d1408" strokeWidth="2.5" strokeLinejoin="round" />
 <path d="M64 8 L61 78 M40 16 L45 72 M104 24 L98 74" fill="none" stroke="#1d1408" strokeWidth="2" opacity=".5" />
 <path d="M66 64 L116 64 M70 73 L118 73" stroke="#1d1408" strokeWidth="2" opacity=".45" />
 <g transform="translate(110 13)">
 <path d="M0 -8 L8 -1 L0 10 L-8 -1 Z" fill="#2EC4F4" stroke="#0e7fb0" strokeWidth="1.3" strokeLinejoin="round" />
 <path d="M-8 -1 L8 -1 M0 -8 L0 10" stroke="#0e7fb0" strokeWidth="0.8" opacity=".7" />
 </g>
 </svg>
 );
}

/* ---------- WORDMARK (DESIGN scaled to match WYZ width) ---------- */
export function Wordmark({ color = OW }: { color?: string }) {
 const a = useRef<HTMLSpanElement>(null), b = useRef<HTMLSpanElement>(null);
 useEffect(() => {
 const fix = () => {
 if (!a.current || !b.current) return;
 b.current.style.transform = "scaleX(1)";
 const w = a.current.getBoundingClientRect().width, d = b.current.getBoundingClientRect().width;
 if (d > 0) b.current.style.transform = `scaleX(${w / d})`;
 };
 fix(); window.addEventListener("resize", fix);
 const t = setTimeout(fix, 120);
 return () => { window.removeEventListener("resize", fix); clearTimeout(t); };
 }, []);
 return (
 <span className="wyz-lockup" style={{ animation: "wyzFade .8s ease .1s both" }}>
 <span ref={a} style={{ color }}>WYZ</span>
 <span ref={b} className="wyz-grad" style={{ fontSize: "0.46em", transformOrigin: "center top", marginTop: ".06em" }}>DESIGN</span>
 </span>
 );
}

export function Brand({ theme = "dark", draw = false, onEnter }: { theme?: "dark" | "light"; draw?: boolean; onEnter?: () => void }) {
 const dark = theme === "dark";
 return (
 <div style={center}>
 <div className={draw ? "wyz-pdraw" : ""} style={{ marginBottom: 18, animation: "wyzFade .8s ease both" }}><CrownLogo size={72} /></div>
 <Wordmark color={dark ? OW : CH} />
 <p className="wyz-tag" style={{ color: dark ? "rgba(254,254,253,.5)" : "#757575", animation: "wyzFade .8s ease .3s both" }}>Creative Agency</p>
 <button className="wyz-enter" style={{ animation: "wyzFade .8s ease .5s both", pointerEvents: "auto" }} onClick={onEnter} autoFocus aria-label="Enter WYZ Design">Enter Site</button>
 </div>
 );
}

export type VProps = { onEnter?: () => void };
export const center: React.CSSProperties = { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", pointerEvents: "none", zIndex: 5 };
export const stageBox = (bg: string): React.CSSProperties => ({ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: bg, overflowX: "hidden", overflowY: "hidden" });
export const fullCanvas: React.CSSProperties = { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, width: "100%", height: "100%" };
