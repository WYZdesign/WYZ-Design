"use client";

/*
 WYZ Design — Splash Gallery (24 variants)
 Save as: src/app/splash-gallery/page.tsx → live at /splash-gallery
*/

import { useEffect, useRef, useState, useCallback } from "react";
import { useGyroPermission } from "@/hooks/useGyroPermission";
const R = "#DF3131", RD = "#B82020", G = "#D49341", GL = "#F9AD4D", OW = "#FFFFFF", CH = "#262626", DK = "#161311";

const CSS = `
@keyframes wyzDraw { to { stroke-dashoffset: 0; } }
@keyframes wyzFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
@keyframes wyzRipple { from{transform:translate(-50%,-50%) scale(0);opacity:.6} to{transform:translate(-50%,-50%) scale(28);opacity:0} }
@keyframes wyzFade { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
@keyframes wyzMarq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
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
function CrownLogo({ size = 70, style }: { size?: number; style?: React.CSSProperties }) {
 const [broken, setBroken] = useState(false);
 if (!broken) {
 return <img src="/wyz-crown.png" alt="WYZ Design" width={size} height={Math.round(size * 0.66)} style={{ objectFit: "contain", ...style }} onError={() => setBroken(true)} />;
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
function Wordmark({ color = OW }: { color?: string }) {
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

function Brand({ theme = "dark", draw = false, onEnter }: { theme?: "dark" | "light"; draw?: boolean; onEnter?: () => void }) {
 const dark = theme === "dark";
 return (
 <div style={center}>
 <div className={draw ? "wyz-pdraw" : ""} style={{ marginBottom: 18, animation: "wyzFade .8s ease both" }}><CrownLogo size={72} /></div>
 <Wordmark color={dark ? OW : CH} />
 <p className="wyz-tag" style={{ color: dark ? "rgba(254,254,253,.5)" : "#757575", animation: "wyzFade .8s ease .3s both" }}>Creative Agency</p>
 <button className="wyz-enter" style={{ animation: "wyzFade .8s ease .5s both", pointerEvents: "auto" }} onClick={onEnter}>Enter Site</button>
 </div>
 );
}

type VProps = { onEnter?: () => void };
const center: React.CSSProperties = { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", pointerEvents: "none", zIndex: 5 };
const stageBox = (bg: string): React.CSSProperties => ({ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: bg, overflowX: "hidden", overflowY: "hidden" });
const fullCanvas: React.CSSProperties = { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, width: "100%", height: "100%" };

/* ---------- GYRO POINTER (iOS-gated via useGyroPermission) ---------- */
function useDeviceTiltAsPointer(ref: React.RefObject<HTMLDivElement | null>) {
 const p = useRef({ x: -999, y: -999, on: false });

 const onGranted = useCallback((setCleanup: (fn: () => void) => void) => {
   const handler = (e: DeviceOrientationEvent) => {
     if (e.gamma === null || e.beta === null || !ref.current) return;
     const r = ref.current.getBoundingClientRect();
     const nx = (e.gamma + 45) / 90;
     const ny = (e.beta + 45) / 90;
     p.current = {
       x: Math.max(0, Math.min(1, nx)) * r.width,
       y: Math.max(0, Math.min(1, ny)) * r.height,
       on: true
     };
   };
   window.addEventListener("deviceorientation", handler, { passive: true });
   setCleanup(() => window.removeEventListener("deviceorientation", handler));
 }, [ref]);

 useGyroPermission(onGranted);
 return p;
}

function usePointerField(ref: React.RefObject<HTMLDivElement | null>) {
 const p = useRef({ x: -999, y: -999, on: false });
 useEffect(() => {
  const el = ref.current;
  if (!el) return;
  const onMove = (e: MouseEvent) => { const r = el.getBoundingClientRect(); p.current = { x: e.clientX - r.left, y: e.clientY - r.top, on: true }; };
  const onLeave = () => { p.current.on = false; };
  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);
  return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
 }, [ref]);
 return p;
}
function useStage() {
 const ref = useRef<HTMLDivElement>(null);
 const mouse = useRef({ x: -999, y: -999, on: false });
 const onMove = (e: React.MouseEvent) => { const r = ref.current!.getBoundingClientRect(); mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top, on: true }; };
 const onLeave = () => { mouse.current.on = false; };
 return { ref, mouse, onMove, onLeave };
}
function fit(c: HTMLCanvasElement) { const p = c.parentElement!; c.width = p.clientWidth; c.height = p.clientHeight; return { W: c.width, H: c.height }; }

/* ============ ORIGINAL 10 ============ */
export function Constellation({ onEnter }: VProps) {
 const { ref, mouse, onMove, onLeave } = useStage(); const cv = useRef<HTMLCanvasElement>(null);
 useEffect(() => {
 const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c), raf = 0;
 const N = 70, ps = Array.from({ length: N }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5, r: Math.random() * 2 + 1, g: Math.random() > .6 }));
 const t = () => {
 x.clearRect(0, 0, W, H); const m = mouse.current;
 for (const a of ps) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1; const nr = m.on && Math.hypot(a.x - m.x, a.y - m.y) < 150; x.beginPath(); x.arc(a.x, a.y, nr ? a.r * 2 : a.r, 0, 7); x.fillStyle = a.g ? G : R; x.globalAlpha = nr ? .95 : .4; x.fill(); }
 x.globalAlpha = 1;
 for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const a = ps[i], b = ps[j], d = Math.hypot(a.x - b.x, a.y - b.y); if (d < 92) { x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.strokeStyle = `rgba(212,147,65,${(1 - d / 92) * .22})`; x.lineWidth = .6; x.stroke(); } }
 if (m.on) for (const a of ps) { const d = Math.hypot(a.x - m.x, a.y - m.y); if (d < 150) { x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(m.x, m.y); x.strokeStyle = `rgba(223,49,49,${(1 - d / 150) * .5})`; x.lineWidth = .7; x.stroke(); } }
 raf = requestAnimationFrame(t);
 };
 t(); const r = () => { const z = fit(c); W = z.W; H = z.H; }; addEventListener("resize", r);
 return () => { cancelAnimationFrame(raf); removeEventListener("resize", r); };
 }, [mouse]);
 return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={stageBox(DK)}><canvas ref={cv} style={fullCanvas} /><Brand onEnter={onEnter} /></div>;
}

export function Aurora({ onEnter }: VProps) {
 const { ref, mouse, onMove, onLeave } = useStage(); const b1 = useRef<HTMLDivElement>(null), b2 = useRef<HTMLDivElement>(null);
 useEffect(() => {
 const el = ref.current!, W = el.clientWidth, H = el.clientHeight; let raf = 0; const p1 = { x: W * .4, y: H * .4 }, p2 = { x: W * .6, y: H * .6 };
 const t = () => { const m = mouse.current; p1.x += ((m.x - W * .15) - p1.x) * .04; p1.y += ((m.y - H * .15) - p1.y) * .04; p2.x += ((W - m.x - W * .15) - p2.x) * .03; p2.y += ((H - m.y - H * .15) - p2.y) * .03; if (b1.current) { b1.current.style.left = p1.x + "px"; b1.current.style.top = p1.y + "px"; } if (b2.current) { b2.current.style.left = p2.x + "px"; b2.current.style.top = p2.y + "px"; } raf = requestAnimationFrame(t); };
 t(); return () => cancelAnimationFrame(raf);
 }, [mouse]);
 return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={stageBox(OW)}><div ref={b1} style={{ position: "absolute", width: "60%", height: "60%", borderRadius: "50%", filter: "blur(20px)", background: "radial-gradient(circle,rgba(223,49,49,.45),transparent 65%)" }} /><div ref={b2} style={{ position: "absolute", width: "55%", height: "55%", borderRadius: "50%", filter: "blur(20px)", background: "radial-gradient(circle,rgba(212,147,65,.42),transparent 65%)" }} /><Brand theme="light" onEnter={onEnter} /></div>;
}

export function Depth({ onEnter }: VProps) {
 const ref = useRef<HTMLDivElement>(null), layers = useRef<HTMLDivElement[]>([]), br = useRef<HTMLDivElement>(null);
 const defs = [{ s: 330, c: R, o: .1, f: .06, rot: 45 }, { s: 450, c: G, o: .08, f: .1, rot: 45 }, { s: 240, c: R, o: .07, f: .16, rot: 0 }];
 const gyroPointer = useDeviceTiltAsPointer(ref);
 const onMove = (e: React.MouseEvent) => { const r = ref.current!.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5; layers.current.forEach((el, i) => { if (el) el.style.transform = `translate(${dx * defs[i].f * 260}px,${dy * defs[i].f * 260}px) rotate(${defs[i].rot}deg)`; }); if (br.current) br.current.style.transform = `translate(${dx * -22}px,${dy * -22}px)`; };
 useEffect(() => {
   let raf = 0;
   const t = () => {
     const gp = gyroPointer.current;
     if (gp.on) {
       const dx = (gp.x / (ref.current?.clientWidth || 1)) - .5;
       const dy = (gp.y / (ref.current?.clientHeight || 1)) - .5;
       layers.current.forEach((el, i) => { if (el) el.style.transform = `translate(${dx * defs[i].f * 260}px,${dy * defs[i].f * 260}px) rotate(${defs[i].rot}deg)`; });
       if (br.current) br.current.style.transform = `translate(${dx * -22}px,${dy * -22}px)`;
     }
     raf = requestAnimationFrame(t);
   };
   raf = requestAnimationFrame(t);
   return () => cancelAnimationFrame(raf);
 }, [gyroPointer]);
 return <div ref={ref} onMouseMove={onMove} onMouseLeave={() => {}} style={stageBox("#1b1714")}>{defs.map((d, i) => <div key={i} ref={el => { if (el) layers.current[i] = el; }} style={{ position: "absolute", border: `1px solid ${d.c}`, opacity: d.o, width: d.s, height: d.s, left: `${20 + i * 22}%`, top: `${15 + i * 18}%`, transition: "transform .3s ease", borderRadius: d.rot ? 0 : "50%", transform: `rotate(${d.rot}deg)` }} />)}<div ref={br} style={{ position: "absolute", inset: 0, transition: "transform .3s ease" }}><Brand onEnter={onEnter} /></div></div>;
}

export function CrownDraw({ onEnter }: VProps) {
 const dots = useRef(Array.from({ length: 8 }, () => ({ l: 10 + Math.random() * 80, t: 10 + Math.random() * 80, g: Math.random() > .5, d: Math.random() * 2, s: 3 + Math.random() * 3 })));
 return <div style={stageBox(OW)}>{dots.current.map((p, i) => <div key={i} style={{ position: "absolute", width: 6, height: 6, borderRadius: "50%", background: p.g ? G : R, opacity: .3, left: `${p.l}%`, top: `${p.t}%`, animation: `wyzFloat ${p.s}s ease-in-out ${p.d}s infinite` }} />)}<Brand theme="light" draw onEnter={onEnter} /></div>;
}

export function Split({ onEnter }: VProps) {
 const [open, setOpen] = useState(false);
 useEffect(() => { const t = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true))); return () => cancelAnimationFrame(t); }, []);
 return <div style={stageBox(DK)}><div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: "50%", backgroundColor: R, transition: "transform 1.2s cubic-bezier(.16,1,.3,1)", transform: open ? "translateX(-46%)" : "none" }} /><div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", right: 0, backgroundColor: G, transition: "transform 1.2s cubic-bezier(.16,1,.3,1)", transform: open ? "translateX(46%)" : "none" }} /><Brand onEnter={onEnter} /></div>;
}

export function Nebula({ onEnter }: VProps) {
 const { ref, mouse, onMove, onLeave } = useStage(); const cv = useRef<HTMLCanvasElement>(null);
 useEffect(() => {
 const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c), raf = 0;
 const N = 80, ps = Array.from({ length: N }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, r: Math.random() * 2 + 1, g: Math.random() > .65 }));
 const t = () => {
 x.clearRect(0, 0, W, H); const m = mouse.current;
 for (const a of ps) { if (m.on) { const dx = a.x - m.x, dy = a.y - m.y, d = Math.hypot(dx, dy); if (d < 120 && d > 0) { a.vx += dx / d * .6; a.vy += dy / d * .6; } } a.vx *= .96; a.vy *= .96; a.x += a.vx; a.y += a.vy; if (a.x < 0) a.x = W; if (a.x > W) a.x = 0; if (a.y < 0) a.y = H; if (a.y > H) a.y = 0; x.beginPath(); x.arc(a.x, a.y, a.r, 0, 7); x.fillStyle = a.g ? G : R; x.globalAlpha = .55; x.fill(); }
 x.globalAlpha = 1; for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const a = ps[i], b = ps[j], d = Math.hypot(a.x - b.x, a.y - b.y); if (d < 80) { x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.strokeStyle = `rgba(223,49,49,${(1 - d / 80) * .18})`; x.lineWidth = .6; x.stroke(); } }
 raf = requestAnimationFrame(t);
 };
 t(); const r = () => { const z = fit(c); W = z.W; H = z.H; }; addEventListener("resize", r); return () => { cancelAnimationFrame(raf); removeEventListener("resize", r); };
 }, [mouse]);
 return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={stageBox("#13100e")}><canvas ref={cv} style={fullCanvas} /><Brand onEnter={onEnter} /></div>;
}

export function Glitch({ onEnter }: VProps) {
 const ref = useRef<HTMLDivElement>(null);
 const gyroPointer = useDeviceTiltAsPointer(ref);
 const [go, setGo] = useState(false);

 useEffect(() => {
   let raf = 0;
   const t = () => {
     const gp = gyroPointer.current;
     if (gp.on) {
       if (!go) setGo(true);
     }
     raf = requestAnimationFrame(t);
   };
   raf = requestAnimationFrame(t);
   return () => cancelAnimationFrame(raf);
 }, [gyroPointer, go]);

 return (
   <div ref={ref} style={stageBox(DK)}>
     <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0px, rgba(255,255,255,.035) 1px, transparent 1px, transparent 3px)", pointerEvents: "none" }} />
     <div style={center}>
       <span className={`wyz-glitch ${go ? "go" : ""}`} data-t="WYZ DESIGN" style={{ fontFamily: "'Montserrat',system-ui,sans-serif", fontWeight: 900, textTransform: "uppercase", letterSpacing: ".04em", lineHeight: .84, fontSize: "clamp(46px,9vw,104px)", color: OW }}>WYZ DESIGN</span>
       <p className="wyz-tag" style={{ color: "rgba(254,254,253,.5)" }}>Creative Agency</p>
       <button className="wyz-enter" onClick={onEnter}>Enter Site</button>
     </div>
   </div>
 );
}

export function Orbital({ onEnter }: VProps) {
 const { ref, mouse, onMove, onLeave } = useStage(); const cv = useRef<HTMLCanvasElement>(null);
 useEffect(() => {
 const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c), raf = 0, cx = W / 2, cy = H / 2;
 const N = 44, ps = Array.from({ length: N }, () => ({ a: Math.random() * 7, rx: 90 + Math.random() * 180, ry: 50 + Math.random() * 120, sp: .004 + Math.random() * .01, g: Math.random() > .6, sz: Math.random() * 2 + 1, tilt: Math.random() * Math.PI }));
 const t = () => { x.clearRect(0, 0, W, H); const m = mouse.current, boost = m.on ? 1 + (1 - Math.min(1, Math.hypot(m.x - cx, m.y - cy) / 300)) * 2.5 : 1; for (const o of ps) { o.a += o.sp * boost; const ex = Math.cos(o.a) * o.rx, ey = Math.sin(o.a) * o.ry, px = cx + ex * Math.cos(o.tilt) - ey * Math.sin(o.tilt), py = cy + ex * Math.sin(o.tilt) + ey * Math.cos(o.tilt); x.beginPath(); x.arc(px, py, o.sz, 0, 7); x.fillStyle = o.g ? G : R; x.globalAlpha = .6; x.fill(); } x.globalAlpha = 1; raf = requestAnimationFrame(t); };
 t(); const r = () => { const z = fit(c); W = z.W; H = z.H; cx = W / 2; cy = H / 2; }; addEventListener("resize", r); return () => { cancelAnimationFrame(raf); removeEventListener("resize", r); };
 }, [mouse]);
 return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={stageBox("#13100e")}><canvas ref={cv} style={fullCanvas} /><Brand onEnter={onEnter} /></div>;
}

export function Smoke({ onEnter }: VProps) {
 const ref = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null), puffs = useRef<any[]>([]);
 useEffect(() => {
 const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c), raf = 0;
 const t = () => { x.fillStyle = "rgba(20,17,16,.18)"; x.fillRect(0, 0, W, H); const a = puffs.current; for (let i = a.length - 1; i >= 0; i--) { const q = a[i]; q.life -= .012; q.x += q.vx; q.y += q.vy; q.sz += .4; if (q.life <= 0) { a.splice(i, 1); continue; } x.beginPath(); x.arc(q.x, q.y, q.sz, 0, 7); x.fillStyle = `rgba(${q.g ? "212,147,65" : "223,49,49"},${q.life * .18})`; x.fill(); } raf = requestAnimationFrame(t); };
 t(); const r = () => { const z = fit(c); W = z.W; H = z.H; }; addEventListener("resize", r); return () => { cancelAnimationFrame(raf); removeEventListener("resize", r); };
 }, []);
 const onMove = (e: React.MouseEvent) => { const r = ref.current!.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top; for (let k = 0; k < 2; k++) puffs.current.push({ x: mx + (Math.random() - .5) * 10, y: my + (Math.random() - .5) * 10, life: 1, vx: (Math.random() - .5) * .4, vy: -.3 - Math.random() * .5, sz: 6 + Math.random() * 10, g: Math.random() > .5 }); if (puffs.current.length > 140) puffs.current = puffs.current.slice(-140); };
 return <div ref={ref} onMouseMove={onMove} style={stageBox("#141110")}><canvas ref={cv} style={fullCanvas} /><Brand onEnter={onEnter} /></div>;
}

export function Ripple({ onEnter }: VProps) {
 const ref = useRef<HTMLDivElement>(null), last = useRef(0);
 const spawn = (px: number, py: number, op: number) => { const d = document.createElement("div"); d.style.cssText = `position:absolute;left:${px}px;top:${py}px;width:18px;height:18px;border-radius:50%;border:2px solid rgba(223,49,49,${op});pointer-events:none;animation:wyzRipple 1.6s ease-out forwards`; ref.current!.appendChild(d); d.addEventListener("animationend", () => d.remove()); };
 const onMove = (e: React.MouseEvent) => { const n = Date.now(); if (n - last.current < 90) return; last.current = n; const r = ref.current!.getBoundingClientRect(); spawn(e.clientX - r.left, e.clientY - r.top, .4); };
 const onClick = (e: React.MouseEvent) => { const r = ref.current!.getBoundingClientRect(); spawn(e.clientX - r.left, e.clientY - r.top, .7); };
 return <div ref={ref} onMouseMove={onMove} onClick={onClick} style={stageBox(OW)}><Brand theme="light" onEnter={onEnter} /></div>;
}

/* ============ NEW 10 ============ */
export function Spotlight({ onEnter }: VProps) {
 const { ref, mouse, onMove, onLeave } = useStage(); const li = useRef<HTMLDivElement>(null);
 useEffect(() => { const el = ref.current!; const p = { x: el.clientWidth / 2, y: el.clientHeight / 2 }; let raf = 0; const t = () => { const m = mouse.current; p.x += (m.x - p.x) * .12; p.y += (m.y - p.y) * .12; if (li.current) li.current.style.background = `radial-gradient(360px circle at ${p.x}px ${p.y}px, rgba(223,49,49,.2), rgba(212,147,65,.1) 42%, transparent 70%)`; raf = requestAnimationFrame(t); }; t(); return () => cancelAnimationFrame(raf); }, [mouse]);
 return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={stageBox(DK)}><div ref={li} style={{ position: "absolute", inset: 0 }} /><Brand onEnter={onEnter} /></div>;
}

export function Magnetic({ onEnter }: VProps) {
 const ref = useRef<HTMLDivElement>(null); const inner = useRef<HTMLDivElement>(null);
 const gyroPointer = useDeviceTiltAsPointer(ref);
 const onMove = (e: React.MouseEvent) => { const r = ref.current!.getBoundingClientRect(); const dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5; if (inner.current) inner.current.style.transform = `translate(${dx * 38}px,${dy * 38}px)`; };
 const onLeave = () => { if (inner.current) inner.current.style.transform = "translate(0,0)"; };
 useEffect(() => {
   let raf = 0;
   const t = () => {
     const gp = gyroPointer.current;
     if (gp.on && inner.current && ref.current) {
       const r = ref.current.getBoundingClientRect();
       const dx = (gp.x / r.width) - .5;
       const dy = (gp.y / r.height) - .5;
       inner.current.style.transform = `translate(${dx * 38}px,${dy * 38}px)`;
     }
     raf = requestAnimationFrame(t);
   };
   raf = requestAnimationFrame(t);
   return () => cancelAnimationFrame(raf);
 }, [gyroPointer]);
 return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={stageBox(DK)}><div ref={inner} style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, transition: "transform .15s ease" }}><Brand onEnter={onEnter} /></div></div>;
}

export function TiltGlass({ onEnter }: VProps) {
 const ref = useRef<HTMLDivElement>(null), card = useRef<HTMLDivElement>(null), gl = useRef<HTMLDivElement>(null);
 const gyroPointer = useDeviceTiltAsPointer(ref);
 const onMove = (e: React.MouseEvent) => { const r = ref.current!.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height; if (card.current) card.current.style.transform = `perspective(900px) rotateY(${(px - .5) * 18}deg) rotateX(${(.5 - py) * 18}deg)`; if (gl.current) gl.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.22), transparent 55%)`; };
 const onLeave = () => { if (card.current) card.current.style.transform = "perspective(900px) rotateY(0) rotateX(0)"; };
 useEffect(() => {
   let raf = 0;
   const t = () => {
     const gp = gyroPointer.current;
     if (gp.on && ref.current && card.current && gl.current) {
       const r = ref.current.getBoundingClientRect();
       const px = gp.x / r.width;
       const py = gp.y / r.height;
       card.current.style.transform = `perspective(900px) rotateY(${(px - .5) * 18}deg) rotateX(${(.5 - py) * 18}deg)`;
       gl.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.22), transparent 55%)`;
     }
     raf = requestAnimationFrame(t);
   };
   raf = requestAnimationFrame(t);
   return () => cancelAnimationFrame(raf);
 }, [gyroPointer]);
 return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={stageBox("#17130f")}><div style={center}><div ref={card} style={{ position: "relative", padding: "46px 58px", borderRadius: 20, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.13)", backdropFilter: "blur(10px)", transition: "transform .2s ease", display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "auto" }}><div ref={gl} style={{ position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none" }} /><div style={{ marginBottom: 14 }}><CrownLogo size={62} /></div><Wordmark color={OW} /><p className="wyz-tag" style={{ color: "rgba(254,254,253,.55)" }}>Creative Agency</p><button className="wyz-enter" style={{ pointerEvents: "auto" }} onClick={onEnter}>Enter Site</button></div></div></div>;
}

export function SineWaves({ onEnter }: VProps) {
 const { ref, mouse, onMove, onLeave } = useStage(); const cv = useRef<HTMLCanvasElement>(null);
 useEffect(() => {
 const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c), raf = 0, ph = 0; const waves = [{ c: R, a: 1, sp: 1 }, { c: G, a: .7, sp: 1.3 }, { c: R, a: .5, sp: .7 }];
 const t = () => { x.clearRect(0, 0, W, H); ph += .02; const m = mouse.current, my = m.on ? m.y / H : .5; waves.forEach((w, wi) => { x.beginPath(); for (let px = 0; px <= W; px += 6) { const amp = 40 + my * 120, y = H / 2 + Math.sin(px * .01 + ph * w.sp + wi) * amp * w.a + Math.sin(px * .02 - ph) * 10; px === 0 ? x.moveTo(px, y) : x.lineTo(px, y); } x.strokeStyle = w.c; x.globalAlpha = .35; x.lineWidth = 1.5; x.stroke(); }); x.globalAlpha = 1; raf = requestAnimationFrame(t); };
 t(); const r = () => { const z = fit(c); W = z.W; H = z.H; }; addEventListener("resize", r); return () => { cancelAnimationFrame(raf); removeEventListener("resize", r); };
 }, [mouse]);
 return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={stageBox("#13100e")}><canvas ref={cv} style={fullCanvas} /><Brand onEnter={onEnter} /></div>;
}

export function Duotone({ onEnter }: VProps) {
 const { ref, mouse, onMove, onLeave } = useStage(); const li = useRef<HTMLDivElement>(null);
 useEffect(() => { const el = ref.current!; const p = { x: el.clientWidth / 2, y: el.clientHeight / 2 }; let raf = 0; const t = () => { const m = mouse.current; p.x += (m.x - p.x) * .1; p.y += (m.y - p.y) * .1; if (li.current) li.current.style.background = `radial-gradient(300px circle at ${p.x}px ${p.y}px, rgba(255,255,255,.22), transparent 70%)`; raf = requestAnimationFrame(t); }; t(); return () => cancelAnimationFrame(raf); }, [mouse]);
 return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={stageBox("#1a1410")}>
 <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#3a2a18,#1a1410 60%)", mixBlendMode: "luminosity", opacity: .5 }} />
 <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg,rgba(223,49,49,.35),rgba(212,147,65,.3))", mixBlendMode: "color" }} />
 <div ref={li} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay" }} /><Brand onEnter={onEnter} /></div>;
}

export function Marquee({ onEnter }: VProps) {
 const rows = [{ d: "normal", dur: 18, o: .08 }, { d: "reverse", dur: 24, o: .05 }, { d: "normal", dur: 14, o: .07 }];
 const txt = "WYZ DESIGN \u00A0\u2022\u00A0 CREATIVE AGENCY \u00A0\u2022\u00A0 ";
 return <div style={stageBox(DK)}><div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: "2vh", overflow: "hidden" }}>{rows.map((r, i) => <div key={i} style={{ whiteSpace: "nowrap", animation: `wyzMarq ${r.dur}s linear infinite ${r.d}`, opacity: r.o, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: "10vh", textTransform: "uppercase", color: i % 2 ? G : OW, letterSpacing: ".02em" }}>{txt.repeat(4)}</div>)}</div><Brand onEnter={onEnter} /></div>;
}

export function CaretType({ onEnter }: VProps) {
 const [displayed, setDisplayed] = useState("");
 const words = ["WYZ", "DESIGN"];
 const full = words.join(" ");
 useEffect(() => {
   let i = 0;
   const iv = setInterval(() => {
     i++;
     setDisplayed(full.slice(0, i));
     if (i >= full.length) clearInterval(iv);
   }, 140);
   return () => clearInterval(iv);
 }, []);
 return (
   <div style={stageBox("#0d0b0a")}>
     <div style={center}>
       <span style={{ fontFamily: "'Montserrat',system-ui,sans-serif", fontWeight: 900, textTransform: "uppercase", letterSpacing: ".04em", lineHeight: .84, fontSize: "clamp(46px,9vw,104px)", color: OW }}>
         {displayed.split("").map((ch, i) => {
           const isW = i < 3;
           return <span key={i} style={{ color: isW ? OW : undefined, opacity: 1 }}>{ch}</span>;
         })}
       </span>
       <span style={{ display: "inline-block", width: 3, height: "clamp(40px,8vw,90px)", background: R, marginLeft: 2, animation: "wyzBlink 1s step-end infinite", verticalAlign: "middle" }} />
     </div>
     <div style={{ ...center, top: "auto", bottom: "12%", position: "absolute" }}>
       <p className="wyz-tag" style={{ color: "rgba(254,254,253,.5)" }}>Creative Agency</p>
       <button className="wyz-enter" onClick={onEnter}>Enter Site</button>
     </div>
   </div>
 );
}

export function GemBurst({ onEnter }: VProps) {
 const ref = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null), parts = useRef<any[]>([]), burstFn = useRef<any>(null);
 useEffect(() => {
 const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c), raf = 0;
 const burst = (bx: number, by: number) => { for (let i = 0; i < 26; i++) { const a = Math.random() * 7, sp = 1 + Math.random() * 5; parts.current.push({ x: bx, y: by, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, c: Math.random() > .5 ? "46,196,244" : (Math.random() > .5 ? "212,147,65" : "223,49,49"), sz: 2 + Math.random() * 3 }); } };
 burstFn.current = burst; burst(W / 2, H / 2);
 const t = () => { x.fillStyle = "rgba(15,12,11,.2)"; x.fillRect(0, 0, W, H); const a = parts.current; for (let i = a.length - 1; i >= 0; i--) { const q = a[i]; q.vy += .04; q.x += q.vx; q.y += q.vy; q.life -= .012; if (q.life <= 0) { a.splice(i, 1); continue; } x.save(); x.translate(q.x, q.y); x.rotate(q.x * .01); x.fillStyle = `rgba(${q.c},${q.life})`; x.fillRect(-q.sz, -q.sz, q.sz * 2, q.sz * 2); x.restore(); } raf = requestAnimationFrame(t); };
 t(); const r = () => { const z = fit(c); W = z.W; H = z.H; }; addEventListener("resize", r); return () => { cancelAnimationFrame(raf); removeEventListener("resize", r); };
 }, []);
 const onMove = (e: React.MouseEvent) => { if (Math.random() > .85 && burstFn.current) { const r = ref.current!.getBoundingClientRect(); burstFn.current(e.clientX - r.left, e.clientY - r.top); } };
 return <div ref={ref} onMouseMove={onMove} style={stageBox("#0f0c0b")}><canvas ref={cv} style={fullCanvas} /><Brand onEnter={onEnter} /></div>;
}

export function GridWarp({ onEnter }: VProps) {
 const { ref, mouse, onMove, onLeave } = useStage(); const cv = useRef<HTMLCanvasElement>(null);
 useEffect(() => {
 const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c), raf = 0; const gap = 34;
 const t = () => { x.clearRect(0, 0, W, H); const m = mouse.current; for (let gx = gap; gx < W; gx += gap) for (let gy = gap; gy < H; gy += gap) { let px = gx, py = gy; const d0 = Math.hypot(gx - m.x, gy - m.y); if (m.on && d0 < 140 && d0 > 0) { const push = (140 - d0) / 140 * 26; px += (gx - m.x) / d0 * push; py += (gy - m.y) / d0 * push; } const near = m.on && d0 < 140; x.beginPath(); x.arc(px, py, near ? 2.2 : 1.3, 0, 7); x.fillStyle = near ? G : "rgba(223,49,49,.5)"; x.globalAlpha = near ? .9 : .4; x.fill(); } x.globalAlpha = 1; raf = requestAnimationFrame(t); };
 t(); const r = () => { const z = fit(c); W = z.W; H = z.H; }; addEventListener("resize", r); return () => { cancelAnimationFrame(raf); removeEventListener("resize", r); };
 }, [mouse]);
 return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={stageBox("#13100e")}><canvas ref={cv} style={fullCanvas} /><Brand onEnter={onEnter} /></div>;
}

export function MeshDrift({ onEnter }: VProps) {
 const ref = useRef<HTMLDivElement>(null), mesh = useRef<HTMLDivElement>(null);
 const gyroPointer = useDeviceTiltAsPointer(ref);
 const onMove = (e: React.MouseEvent) => { const r = ref.current!.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5; if (mesh.current) mesh.current.style.transform = `translate(${dx * 30}px,${dy * 30}px) scale(1.12)`; };
 useEffect(() => {
   let raf = 0;
   const t = () => {
     const gp = gyroPointer.current;
     if (gp.on && ref.current && mesh.current) {
       const r = ref.current.getBoundingClientRect();
       const dx = (gp.x / r.width) - .5;
       const dy = (gp.y / r.height) - .5;
       mesh.current.style.transform = `translate(${dx * 30}px,${dy * 30}px) scale(1.12)`;
     }
     raf = requestAnimationFrame(t);
   };
   raf = requestAnimationFrame(t);
   return () => cancelAnimationFrame(raf);
 }, [gyroPointer]);
 return <div ref={ref} onMouseMove={onMove} style={stageBox(OW)}><div ref={mesh} style={{ position: "absolute", inset: "-12%", transition: "transform .3s ease", filter: "blur(34px)", animation: "wyzPulse 8s ease-in-out infinite", background: "radial-gradient(circle at 25% 30%,rgba(223,49,49,.42),transparent 40%),radial-gradient(circle at 75% 35%,rgba(212,147,65,.42),transparent 40%),radial-gradient(circle at 50% 82%,rgba(249,173,77,.36),transparent 45%)" }} /><Brand theme="light" onEnter={onEnter} /></div>;
}

export function Vortex({ onEnter }: VProps) {
  const ref = useRef<HTMLDivElement>(null); const p = usePointerField(ref); const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c), raf = 0, t = 0;
    const N = 90;
    const particles = Array.from({ length: N }, (_, i) => ({ a: (i / N) * Math.PI * 2, r: 40 + Math.random() * 160, sp: 0.003 + Math.random() * 0.008, g: Math.random() > 0.6, sz: Math.random() * 2 + 1 }));
    const tick = () => {
      x.clearRect(0, 0, W, H); t += 0.016; const m = p.current;
      const cx = W / 2 + (m.on ? (m.x - W / 2) * 0.3 : 0);
      const cy = H / 2 + (m.on ? (m.y - H / 2) * 0.3 : 0);
      for (const pt of particles) {
        pt.a += pt.sp * (1 + t * 0.1);
        const spiral = Math.sin(pt.a * 3 + t) * 30;
        const px = cx + Math.cos(pt.a) * (pt.r + spiral) + Math.sin(pt.a * 5 + t) * 15;
        const py = cy + Math.sin(pt.a) * (pt.r + spiral) * 0.7;
        x.beginPath(); x.arc(px, py, pt.sz, 0, 7);
        x.fillStyle = pt.g ? G : R; x.globalAlpha = 0.55 + Math.sin(pt.a + t) * 0.2;
        x.fill();
      }
      x.globalAlpha = 1; raf = requestAnimationFrame(tick);
    };
    tick();
    const r = () => { const z = fit(c); W = z.W; H = z.H; };
    addEventListener("resize", r);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", r); };
  }, []);
  return <div ref={ref} style={stageBox("#0d0b09")}><canvas ref={cv} style={fullCanvas} /><Brand onEnter={onEnter} /></div>;
}

export function Particles({ onEnter }: VProps) {
  const ref = useRef<HTMLDivElement>(null); const p = usePointerField(ref); const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c), raf = 0;
    const N = 120, ps = Array.from({ length: N }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.5 + .5, speed: Math.random() * .3 + .1, angle: Math.random() * Math.PI * 2, drift: (Math.random() - .5) * .01 }));
    const t = () => { x.clearRect(0, 0, W, H); const m = p.current; for (const dot of ps) { dot.angle += dot.drift; dot.x += Math.cos(dot.angle) * dot.speed + (m.on ? (m.x - dot.x) * .003 : 0); dot.y += Math.sin(dot.angle) * dot.speed + (m.on ? (m.y - dot.y) * .003 : 0); if (dot.x < 0) dot.x = W; if (dot.x > W) dot.x = 0; if (dot.y < 0) dot.y = H; if (dot.y > H) dot.y = 0; const dist = m.on ? Math.hypot(dot.x - m.x, dot.y - m.y) : 999; const glow = dist < 120; x.beginPath(); x.arc(dot.x, dot.y, glow ? dot.r * 3 : dot.r, 0, 7); x.fillStyle = glow ? R : G; x.globalAlpha = glow ? .8 : .25; x.fill(); } x.globalAlpha = 1; raf = requestAnimationFrame(t); };
    t(); const r = () => { const z = fit(c); W = z.W; H = z.H; }; addEventListener("resize", r); return () => { cancelAnimationFrame(raf); removeEventListener("resize", r); };
  }, []);
  return <div ref={ref} style={stageBox(DK)}><canvas ref={cv} style={fullCanvas} /><Brand onEnter={onEnter} /></div>;
}

export function WaveRipple({ onEnter }: VProps) {
  const ref = useRef<HTMLDivElement>(null); const p = usePointerField(ref); const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c), raf = 0, t = 0;
    const tick = () => { x.clearRect(0, 0, W, H); t += .015; const m = p.current; for (let i = 0; i < 5; i++) { x.beginPath(); for (let px = 0; px <= W; px += 4) { const y = H / 2 + Math.sin(px * .008 + t + i * 1.2) * 60 * Math.sin(t * .5 + i) + Math.cos(px * .005 - t * .7) * 30 + (m.on ? (m.y - H / 2) * .15 : 0); px === 0 ? x.moveTo(px, y) : x.lineTo(px, y); } x.strokeStyle = i % 2 ? R : G; x.globalAlpha = .15 + i * .03; x.lineWidth = 1.5 + i * .5; x.stroke(); } x.globalAlpha = 1; raf = requestAnimationFrame(tick); };
    tick(); const r = () => { const z = fit(c); W = z.W; H = z.H; }; addEventListener("resize", r); return () => { cancelAnimationFrame(raf); removeEventListener("resize", r); };
  }, []);
  return <div ref={ref} style={stageBox("#0e0c0b")}><canvas ref={cv} style={fullCanvas} /><Brand onEnter={onEnter} /></div>;
}

export function HexGrid({ onEnter }: VProps) {
  const ref = useRef<HTMLDivElement>(null); const p = usePointerField(ref); const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c), raf = 0;
    const hexR = 28, hexW = hexR * Math.sqrt(3), hexH = hexR * 2;
    const t = () => { x.clearRect(0, 0, W, H); const m = p.current; for (let row = 0; row * hexH * .75 < H + hexH; row++) for (let col = 0; col * hexW < W + hexW; col++) { const cx = col * hexW + (row % 2 ? hexW / 2 : 0); const cy = row * hexH * .75; const pulse = Math.sin(Date.now() * .002 + cx * .01 + cy * .01) * .3 + .7; x.beginPath(); for (let i = 0; i < 6; i++) { const angle = Math.PI / 3 * i - Math.PI / 6; const hx = cx + hexR * Math.cos(angle); const hy = cy + hexR * Math.sin(angle); i === 0 ? x.moveTo(hx, hy) : x.lineTo(hx, hy); } x.closePath(); x.strokeStyle = m.on && Math.hypot(cx - m.x, cy - m.y) < 150 ? R : "rgba(223,49,49,.2)"; x.globalAlpha = m.on && Math.hypot(cx - m.x, cy - m.y) < 150 ? .9 : pulse * .3; x.lineWidth = m.on && Math.hypot(cx - m.x, cy - m.y) < 150 ? 2 : 1; x.stroke(); } x.globalAlpha = 1; raf = requestAnimationFrame(t); };
    t(); const r = () => { const z = fit(c); W = z.W; H = z.H; }; addEventListener("resize", r); return () => { cancelAnimationFrame(raf); removeEventListener("resize", r); };
  }, []);
  return <div ref={ref} style={stageBox(DK)}><canvas ref={cv} style={fullCanvas} /><Brand onEnter={onEnter} /></div>;
}

/* ============ REGISTRY + RANDOM + GALLERY ============ */
const VARIANTS: { name: string; desc: string; Comp: (p: VProps) => React.JSX.Element; bg: string }[] = [
 { name: "Constellation", desc: "Particle web links to your cursor", Comp: Constellation, bg: DK },
 { name: "Aurora", desc: "Soft red/gold light follows the mouse", Comp: Aurora, bg: OW },
 { name: "Depth parallax", desc: "Layers tilt in perspective", Comp: Depth, bg: "#1b1714" },
 { name: "Crown draw", desc: "Logo draws itself, editorial light", Comp: CrownDraw, bg: OW },
 { name: "Split reveal", desc: "Red/gold halves slide apart", Comp: Split, bg: DK },
 { name: "Nebula", desc: "Particles flee the cursor", Comp: Nebula, bg: "#13100e" },
 { name: "Glitch type", desc: "RGB-split wordmark jitter", Comp: Glitch, bg: DK },
 { name: "Orbital", desc: "Particles orbit, cursor speeds them", Comp: Orbital, bg: "#13100e" },
 { name: "Smoke trail", desc: "Wisps follow your cursor", Comp: Smoke, bg: "#141110" },
 { name: "Ripple", desc: "Move or click for expanding rings", Comp: Ripple, bg: OW },
 { name: "Spotlight", desc: "A torch reveals the mark", Comp: Spotlight, bg: DK },
 { name: "Magnetic", desc: "Letters lean toward your cursor", Comp: Magnetic, bg: DK },
 { name: "Tilt glass", desc: "Glass card tilts in 3D with glare", Comp: TiltGlass, bg: "#17130f" },
 { name: "Sine waves", desc: "Wave field bends with mouse height", Comp: SineWaves, bg: "#13100e" },
 { name: "Duotone", desc: "Photo behind red/gold, lit by cursor", Comp: Duotone, bg: "#1a1410" },
 { name: "Marquee", desc: "Kinetic type bands scroll past", Comp: Marquee, bg: DK },
 { name: "Caret type", desc: "Terminal-style typed reveal", Comp: CaretType, bg: "#0d0b0a" },
 { name: "Gem burst", desc: "Cyan/gold shards explode outward", Comp: GemBurst, bg: "#0f0c0b" },
 { name: "Grid warp", desc: "Dot grid bends around the cursor", Comp: GridWarp, bg: "#13100e" },
  { name: "Mesh drift", desc: "Gradient mesh drifts with parallax", Comp: MeshDrift, bg: OW },
  { name: "Particles", desc: "Swarming dots converge on pointer", Comp: Particles, bg: DK },
  { name: "Wave ripple", desc: "Layered sine waves follow cursor", Comp: WaveRipple, bg: "#0e0c0b" },
  { name: "Hex grid", desc: "Honeycomb glows near your pointer", Comp: HexGrid, bg: DK },
  { name: "Vortex", desc: "Spiral particle storm orbits center", Comp: Vortex, bg: "#0d0b09" },
];

export function RandomSplash(props: VProps) {
 const [i, setI] = useState<number | null>(null);
 useEffect(() => { setI(Math.floor(Math.random() * VARIANTS.length)); }, []);
 if (i === null) return <div style={stageBox(DK)}><style>{CSS}</style><Brand onEnter={props.onEnter} /></div>;
 const C = VARIANTS[i].Comp;
 return <><style>{CSS}</style><C {...props} /></>;
}

export default function SplashGallery() {
 const [open, setOpen] = useState<number | null>(null);
 useEffect(() => { if (open === null) return; const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, [open]);
 const surprise = () => setOpen(Math.floor(Math.random() * VARIANTS.length));
 const Active = open !== null ? VARIANTS[open].Comp : null;
 return (
 <div style={{ minHeight: "100vh", background: "#0e0c0b", padding: "48px 32px", fontFamily: "var(--font-body),system-ui,sans-serif" }}>
 <style>{CSS}</style>
 <div style={{ maxWidth: 1180, margin: "0 auto" }}>
 <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, color: OW, textAlign: "center", letterSpacing: ".05em", fontSize: 38, margin: 0 }}>SPLASH <span style={{ color: R }}>GALLERY</span></h1>
  <p style={{ color: "#757575", textAlign: "center", marginTop: 8, fontSize: 15 }}>24 brand-matched variants with mouse, touch &amp; gyroscope support. Only the one you open animates.</p>
 <div style={{ textAlign: "center", margin: "18px 0 28px" }}><button onClick={surprise} style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", fontSize: 13, color: OW, background: R, border: "none", padding: "12px 26px", borderRadius: 3, cursor: "pointer" }}>Surprise me →</button></div>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
 {VARIANTS.map((v, i) => (
 <button key={i} className="wyz-card" style={{ background: v.bg }} onClick={() => setOpen(i)}>
 <div style={{ position: "absolute", inset: 0, background: v.bg === OW ? "radial-gradient(circle at 50% 45%,rgba(223,49,49,.12),transparent 60%)" : "radial-gradient(circle at 50% 45%,rgba(223,49,49,.22),transparent 60%)" }} />
 <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 16, textAlign: "left", background: "linear-gradient(to top,rgba(0,0,0,.85),transparent)" }}>
 <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, color: "#fff", letterSpacing: ".05em", textTransform: "uppercase", fontSize: 16 }}>{v.name}</div>
 <div style={{ color: "#bbb", fontSize: 12.5, marginTop: 3 }}>{v.desc}</div>
 </div>
 </button>
 ))}
 </div>
 </div>
 {Active !== null && (
 <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
 <div style={{ position: "absolute", inset: 0 }}><Active onEnter={() => setOpen(null)} /></div>
 <button onClick={() => setOpen(null)} style={{ position: "absolute", top: 16, right: 16, zIndex: 210, padding: "8px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,.25)", background: "rgba(255,255,255,.1)", backdropFilter: "blur(6px)", color: "#fff", fontSize: 13, cursor: "pointer" }}>← Back to gallery</button>
 <div style={{ position: "absolute", top: 18, left: 18, zIndex: 210, color: "rgba(255,255,255,.45)", fontSize: 13, fontFamily: "'Montserrat',sans-serif", letterSpacing: ".1em" }}>{VARIANTS[open!].name}</div>
 </div>
 )}
 </div>
 );
}
