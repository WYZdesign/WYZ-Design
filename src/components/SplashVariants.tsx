"use client";

/*
 WYZ Design - Splash Gallery (16 selected variants)
 Save as: src/app/splash-gallery/page.tsx -> live at /splash-gallery

 2026-10-08 pass (Claude): cut from 24 down to the 13 strongest, most
 distinct variants, fixed the pointer system so every single one now
 responds to mouse OR phone tilt through the exact same code path (most
 of the old 24 had no gyro wiring at all, and a couple had no live mouse
 wiring either -- Glitch's RGB-split only ever triggered from gyro, never
 from the mouse, before this pass). Added 3 new variants researched from
 current award-site interaction patterns: GrainReveal (film-grain mask
 reveal), CursorRibbon (tapered glowing trail), LiquidChrome (chrome
 blob that tracks the pointer). Every variant now reads one shared
 pointer ref that is written by mouse movement on desktop and by
 device tilt on phones -- nothing here depends on a tap or a swipe to
 work, only on the one-time OS permission gesture `useGyroPermission`
 already binds to the page's first touch/click.
*/

import { useEffect, useRef, useState, useCallback } from "react";
import { useGyroPermission } from "@/hooks/useGyroPermission";
import { useSplashScrollLock } from "@/hooks/useSplashScrollLock";
import { prefersReducedMotion } from "@/lib/utils";
const R = "#DF3131", RD = "#B82020", G = "#D49341", GL = "#F9AD4D", OW = "#FFFFFF", CH = "#262626", DK = "#161311";

const CSS = `
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
function CrownLogo({ size = 70, style }: { size?: number; style?: React.CSSProperties }) {
 const [broken, setBroken] = useState(false);
 if (!broken) {
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
 <button className="wyz-enter" style={{ animation: "wyzFade .8s ease .5s both", pointerEvents: "auto" }} onClick={onEnter} autoFocus aria-label="Enter WYZ Design">Enter Site</button>
 </div>
 );
}

type VProps = { onEnter?: () => void };
const center: React.CSSProperties = { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", pointerEvents: "none", zIndex: 5 };
const stageBox = (bg: string): React.CSSProperties => ({ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: bg, overflowX: "hidden", overflowY: "hidden" });
const fullCanvas: React.CSSProperties = { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, width: "100%", height: "100%" };

/* ---------- ONE POINTER, TWO SOURCES ----------
 Every variant reads this single ref. On a mouse-driven device it is
 written by mousemove/mouseleave on the stage element. On a phone it is
 written by deviceorientation (gamma/beta mapped into the same 0..width /
 0..height space) once useGyroPermission's one-time gesture-gated request
 grants it -- no tap, no swipe, just tilt. Whichever source actually fires
 on a given device is the one that drives the variant; there is nothing
 variant-specific to wire up, which is also what was broken before: most
 of the old 24 variants only listened for the mouse and sat dead on a
 phone, and one (Glitch) only ever checked the gyro path and sat dead on
 desktop. Centralizing it here means every kept variant gets both for
 free. */
function usePointerField(ref: React.RefObject<HTMLDivElement | null>) {
 const p = useRef({ x: -999, y: -999, on: false });

 useEffect(() => {
  const el = ref.current;
  if (!el) return;
  // Touch devices fire synthetic mouse events on tap/swipe; ignore those so the
  // splash is driven only by real mouse movement, or by device motion/tilt.
  const touchPrimary = (typeof window !== "undefined") && (window.matchMedia("(hover: none), (pointer: coarse)").matches || "ontouchstart" in window);
  if (touchPrimary) return;
  const onMove = (e: MouseEvent) => {
   const sc = (e as MouseEvent & { sourceCapabilities?: { firesTouchEvents?: boolean } }).sourceCapabilities;
   if (sc && sc.firesTouchEvents) return;
   const r = el.getBoundingClientRect(); p.current = { x: e.clientX - r.left, y: e.clientY - r.top, on: true };
  };
  const onLeave = () => { p.current.on = false; };
  el.addEventListener("mousemove", onMove, { passive: true });
  el.addEventListener("mouseleave", onLeave, { passive: true });
  return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
 }, [ref]);

 const onGyroGranted = useCallback((setCleanup: (fn: () => void) => void) => {
  const handler = (e: DeviceOrientationEvent) => {
   if (e.gamma === null || e.beta === null || !ref.current) return;
   const r = ref.current.getBoundingClientRect();
   const nx = Math.max(0, Math.min(1, (e.gamma + 45) / 90));
   const ny = Math.max(0, Math.min(1, (e.beta + 45) / 90));
   p.current = { x: nx * r.width, y: ny * r.height, on: true };
  };
  window.addEventListener("deviceorientation", handler, { passive: true });
  setCleanup(() => window.removeEventListener("deviceorientation", handler));
 }, [ref]);
 useGyroPermission(onGyroGranted);

 return p;
}

function useStage() {
 const ref = useRef<HTMLDivElement>(null);
 const mouse = usePointerField(ref);
 return { ref, mouse, onMove: () => {}, onLeave: () => {} };
}
function fit(c: HTMLCanvasElement) { const p = c.parentElement!; c.width = p.clientWidth; c.height = p.clientHeight; return { W: c.width, H: c.height }; }

/* ============ 16 CURATED VARIANTS ============ */
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

export function Depth({ onEnter }: VProps) {
 const ref = useRef<HTMLDivElement>(null), layers = useRef<HTMLDivElement[]>([]), br = useRef<HTMLDivElement>(null);
 const defs = [{ s: 330, c: R, o: .1, f: .06, rot: 45 }, { s: 450, c: G, o: .08, f: .1, rot: 45 }, { s: 240, c: R, o: .07, f: .16, rot: 0 }];
 const pointer = usePointerField(ref);
 const smooth = useRef({ dx: 0, dy: 0 });
 useEffect(() => {
  let raf = 0;
  const t = () => {
   const m = pointer.current;
   if (m.on && ref.current) {
    const r = ref.current.getBoundingClientRect();
    const tx = m.x / r.width - .5, ty = m.y / r.height - .5;
    smooth.current.dx += (tx - smooth.current.dx) * .12;
    smooth.current.dy += (ty - smooth.current.dy) * .12;
    const { dx, dy } = smooth.current;
    layers.current.forEach((el, i) => { if (el) el.style.transform = `translate(${dx * defs[i].f * 260}px,${dy * defs[i].f * 260}px) rotate(${defs[i].rot}deg)`; });
    if (br.current) br.current.style.transform = `translate(${dx * -22}px,${dy * -22}px)`;
   }
   raf = requestAnimationFrame(t);
  };
  raf = requestAnimationFrame(t);
  return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [pointer]);
 return <div ref={ref} style={stageBox("#1b1714")}>{defs.map((d, i) => <div key={i} ref={el => { if (el) layers.current[i] = el; }} style={{ position: "absolute", border: `1px solid ${d.c}`, opacity: d.o, width: d.s, height: d.s, left: `${20 + i * 22}%`, top: `${15 + i * 18}%`, transition: "transform .1s linear", borderRadius: d.rot ? 0 : "50%", transform: `rotate(${d.rot}deg)` }} />)}<div ref={br} style={{ position: "absolute", inset: 0, transition: "transform .1s linear" }}><Brand onEnter={onEnter} /></div></div>;
}

export function Glitch({ onEnter }: VProps) {
 const ref = useRef<HTMLDivElement>(null);
 const pointer = usePointerField(ref);
 const [go, setGo] = useState(false);

 useEffect(() => {
  let raf = 0;
  const t = () => {
   if (pointer.current.on && !go) setGo(true);
   raf = requestAnimationFrame(t);
  };
  raf = requestAnimationFrame(t);
  return () => cancelAnimationFrame(raf);
 }, [pointer, go]);

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

export function Smoke({ onEnter }: VProps) {
 const ref = useRef<HTMLDivElement>(null); const pointer = usePointerField(ref); const cv = useRef<HTMLCanvasElement>(null), puffs = useRef<any[]>([]);
 useEffect(() => {
 const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c), raf = 0;
 const t = () => { x.fillStyle = "rgba(20,17,16,.18)"; x.fillRect(0, 0, W, H); const a = puffs.current; for (let i = a.length - 1; i >= 0; i--) { const q = a[i]; q.life -= .012; q.x += q.vx; q.y += q.vy; q.sz += .4; if (q.life <= 0) { a.splice(i, 1); continue; } x.beginPath(); x.arc(q.x, q.y, q.sz, 0, 7); x.fillStyle = `rgba(${q.g ? "212,147,65" : "223,49,49"},${q.life * .18})`; x.fill(); } raf = requestAnimationFrame(t); };
 t(); const r = () => { const z = fit(c); W = z.W; H = z.H; }; addEventListener("resize", r); return () => { cancelAnimationFrame(raf); removeEventListener("resize", r); };
 }, []);
 const lastSpawn = useRef({ x: -999, y: -999 });
 useEffect(() => {
  let raf = 0;
  const t = () => {
   const m = pointer.current;
   if (m.on) {
    const moved = Math.hypot(m.x - lastSpawn.current.x, m.y - lastSpawn.current.y);
    if (moved > 3) {
     lastSpawn.current = { x: m.x, y: m.y };
     for (let k = 0; k < 2; k++) puffs.current.push({ x: m.x + (Math.random() - .5) * 10, y: m.y + (Math.random() - .5) * 10, life: 1, vx: (Math.random() - .5) * .4, vy: -.3 - Math.random() * .5, sz: 6 + Math.random() * 10, g: Math.random() > .5 });
     if (puffs.current.length > 140) puffs.current = puffs.current.slice(-140);
    }
   }
   raf = requestAnimationFrame(t);
  };
  raf = requestAnimationFrame(t);
  return () => cancelAnimationFrame(raf);
 }, [pointer]);
 return <div ref={ref} style={stageBox("#141110")}><canvas ref={cv} style={fullCanvas} /><Brand onEnter={onEnter} /></div>;
}

export function Ripple({ onEnter }: VProps) {
 const ref = useRef<HTMLDivElement>(null); const pointer = usePointerField(ref);
 const last = useRef(0), lastPos = useRef({ x: -999, y: -999 });
 const spawn = (px: number, py: number, op: number) => { const d = document.createElement("div"); d.style.cssText = `position:absolute;left:${px}px;top:${py}px;width:18px;height:18px;border-radius:50%;border:2px solid rgba(223,49,49,${op});pointer-events:none;animation:wyzRipple 1.6s ease-out forwards`; ref.current!.appendChild(d); d.addEventListener("animationend", () => d.remove()); };
 useEffect(() => {
  let raf = 0;
  const t = () => {
   const m = pointer.current;
   if (m.on) {
    const moved = Math.hypot(m.x - lastPos.current.x, m.y - lastPos.current.y);
    const n = Date.now();
    if (moved > 16 && n - last.current > 90) { last.current = n; lastPos.current = { x: m.x, y: m.y }; spawn(m.x, m.y, .4); }
   }
   raf = requestAnimationFrame(t);
  };
  raf = requestAnimationFrame(t);
  return () => cancelAnimationFrame(raf);
 }, [pointer]);
 const onClick = (e: React.MouseEvent) => { const r = ref.current!.getBoundingClientRect(); spawn(e.clientX - r.left, e.clientY - r.top, .7); };
 return <div ref={ref} onClick={onClick} style={stageBox(OW)}><Brand theme="light" onEnter={onEnter} /></div>;
}

export function Spotlight({ onEnter }: VProps) {
 const { ref, mouse, onMove, onLeave } = useStage(); const li = useRef<HTMLDivElement>(null);
 useEffect(() => { const el = ref.current!; const p = { x: el.clientWidth / 2, y: el.clientHeight / 2 }; let raf = 0; const t = () => { const m = mouse.current; p.x += (m.x - p.x) * .12; p.y += (m.y - p.y) * .12; if (li.current) li.current.style.background = `radial-gradient(360px circle at ${p.x}px ${p.y}px, rgba(223,49,49,.2), rgba(212,147,65,.1) 42%, transparent 70%)`; raf = requestAnimationFrame(t); }; t(); return () => cancelAnimationFrame(raf); }, [mouse]);
 return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={stageBox(DK)}><div ref={li} style={{ position: "absolute", inset: 0 }} /><Brand onEnter={onEnter} /></div>;
}

export function Magnetic({ onEnter }: VProps) {
 const ref = useRef<HTMLDivElement>(null); const inner = useRef<HTMLDivElement>(null);
 const pointer = usePointerField(ref);
 const smooth = useRef({ dx: 0, dy: 0 });
 useEffect(() => {
  let raf = 0;
  const t = () => {
   const m = pointer.current;
   if (m.on && ref.current) {
    const r = ref.current.getBoundingClientRect();
    const tx = m.x / r.width - .5, ty = m.y / r.height - .5;
    smooth.current.dx += (tx - smooth.current.dx) * .15;
    smooth.current.dy += (ty - smooth.current.dy) * .15;
    if (inner.current) inner.current.style.transform = `translate(${smooth.current.dx * 38}px,${smooth.current.dy * 38}px)`;
   }
   raf = requestAnimationFrame(t);
  };
  raf = requestAnimationFrame(t);
  return () => cancelAnimationFrame(raf);
 }, [pointer]);
 return <div ref={ref} style={stageBox(DK)}><div ref={inner} style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, transition: "transform .05s linear" }}><Brand onEnter={onEnter} /></div></div>;
}

export function TiltGlass({ onEnter }: VProps) {
 const ref = useRef<HTMLDivElement>(null), card = useRef<HTMLDivElement>(null), gl = useRef<HTMLDivElement>(null);
 const pointer = usePointerField(ref);
 const smooth = useRef({ px: .5, py: .5 });
 useEffect(() => {
  let raf = 0;
  const t = () => {
   const m = pointer.current;
   if (m.on && ref.current && card.current && gl.current) {
    const r = ref.current.getBoundingClientRect();
    const tx = m.x / r.width, ty = m.y / r.height;
    smooth.current.px += (tx - smooth.current.px) * .14;
    smooth.current.py += (ty - smooth.current.py) * .14;
    const { px, py } = smooth.current;
    card.current.style.transform = `perspective(900px) rotateY(${(px - .5) * 18}deg) rotateX(${(.5 - py) * 18}deg)`;
    gl.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.22), transparent 55%)`;
   }
   raf = requestAnimationFrame(t);
  };
  raf = requestAnimationFrame(t);
  return () => cancelAnimationFrame(raf);
 }, [pointer]);
 return <div ref={ref} style={stageBox("#17130f")}><div style={center}><div ref={card} style={{ position: "relative", padding: "46px 58px", borderRadius: 20, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.13)", backdropFilter: "blur(10px)", transition: "transform .08s linear", display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "auto" }}><div ref={gl} style={{ position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none" }} /><div style={{ marginBottom: 14 }}><CrownLogo size={62} /></div><Wordmark color={OW} /><p className="wyz-tag" style={{ color: "rgba(254,254,253,.55)" }}>Creative Agency</p><button className="wyz-enter" style={{ pointerEvents: "auto" }} onClick={onEnter}>Enter Site</button></div></div></div>;
}

export function Duotone({ onEnter }: VProps) {
 const { ref, mouse, onMove, onLeave } = useStage(); const li = useRef<HTMLDivElement>(null);
 useEffect(() => { const el = ref.current!; const p = { x: el.clientWidth / 2, y: el.clientHeight / 2 }; let raf = 0; const t = () => { const m = mouse.current; p.x += (m.x - p.x) * .1; p.y += (m.y - p.y) * .1; if (li.current) li.current.style.background = `radial-gradient(300px circle at ${p.x}px ${p.y}px, rgba(255,255,255,.22), transparent 70%)`; raf = requestAnimationFrame(t); }; t(); return () => cancelAnimationFrame(raf); }, [mouse]);
 return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={stageBox("#1a1410")}>
 <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#3a2a18,#1a1410 60%)", mixBlendMode: "luminosity", opacity: .5 }} />
 <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg,rgba(223,49,49,.35),rgba(212,147,65,.3))", mixBlendMode: "color" }} />
 <div ref={li} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay" }} /><Brand onEnter={onEnter} /></div>;
}

export function GemBurst({ onEnter }: VProps) {
 const ref = useRef<HTMLDivElement>(null); const pointer = usePointerField(ref); const cv = useRef<HTMLCanvasElement>(null), parts = useRef<any[]>([]), burstFn = useRef<any>(null);
 useEffect(() => {
 const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c), raf = 0;
 const burst = (bx: number, by: number) => { for (let i = 0; i < 26; i++) { const a = Math.random() * 7, sp = 1 + Math.random() * 5; parts.current.push({ x: bx, y: by, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, c: Math.random() > .5 ? "46,196,244" : (Math.random() > .5 ? "212,147,65" : "223,49,49"), sz: 2 + Math.random() * 3 }); } };
 burstFn.current = burst; burst(W / 2, H / 2);
 const t = () => { x.fillStyle = "rgba(15,12,11,.2)"; x.fillRect(0, 0, W, H); const a = parts.current; for (let i = a.length - 1; i >= 0; i--) { const q = a[i]; q.vy += .04; q.x += q.vx; q.y += q.vy; q.life -= .012; if (q.life <= 0) { a.splice(i, 1); continue; } x.save(); x.translate(q.x, q.y); x.rotate(q.x * .01); x.fillStyle = `rgba(${q.c},${q.life})`; x.fillRect(-q.sz, -q.sz, q.sz * 2, q.sz * 2); x.restore(); } raf = requestAnimationFrame(t); };
 t(); const r = () => { const z = fit(c); W = z.W; H = z.H; }; addEventListener("resize", r); return () => { cancelAnimationFrame(raf); removeEventListener("resize", r); };
 }, []);
 const lastBurst = useRef({ x: -999, y: -999 });
 useEffect(() => {
  let raf = 0;
  const t = () => {
   const m = pointer.current;
   if (m.on && burstFn.current) {
    const moved = Math.hypot(m.x - lastBurst.current.x, m.y - lastBurst.current.y);
    if (moved > 60) { lastBurst.current = { x: m.x, y: m.y }; burstFn.current(m.x, m.y); }
   }
   raf = requestAnimationFrame(t);
  };
  raf = requestAnimationFrame(t);
  return () => cancelAnimationFrame(raf);
 }, [pointer]);
 return <div ref={ref} style={stageBox("#0f0c0b")}><canvas ref={cv} style={fullCanvas} /><Brand onEnter={onEnter} /></div>;
}

export function MeshDrift({ onEnter }: VProps) {
 const ref = useRef<HTMLDivElement>(null), mesh = useRef<HTMLDivElement>(null);
 const pointer = usePointerField(ref);
 const smooth = useRef({ dx: 0, dy: 0 });
 useEffect(() => {
  let raf = 0;
  const t = () => {
   const m = pointer.current;
   if (m.on && ref.current && mesh.current) {
    const r = ref.current.getBoundingClientRect();
    const tx = m.x / r.width - .5, ty = m.y / r.height - .5;
    smooth.current.dx += (tx - smooth.current.dx) * .08;
    smooth.current.dy += (ty - smooth.current.dy) * .08;
    mesh.current.style.transform = `translate(${smooth.current.dx * 30}px,${smooth.current.dy * 30}px) scale(1.12)`;
   }
   raf = requestAnimationFrame(t);
  };
  raf = requestAnimationFrame(t);
  return () => cancelAnimationFrame(raf);
 }, [pointer]);
 return <div ref={ref} style={stageBox(OW)}><div ref={mesh} style={{ position: "absolute", inset: "-12%", transition: "transform .1s linear", filter: "blur(34px)", animation: "wyzPulse 8s ease-in-out infinite", background: "radial-gradient(circle at 25% 30%,rgba(223,49,49,.42),transparent 40%),radial-gradient(circle at 75% 35%,rgba(212,147,65,.42),transparent 40%),radial-gradient(circle at 50% 82%,rgba(249,173,77,.36),transparent 45%)" }} /><Brand theme="light" onEnter={onEnter} /></div>;
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

export function WaveRipple({ onEnter }: VProps) {
  const ref = useRef<HTMLDivElement>(null); const p = usePointerField(ref); const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c), raf = 0, t = 0;
    const tick = () => { x.clearRect(0, 0, W, H); t += .015; const m = p.current; for (let i = 0; i < 5; i++) { x.beginPath(); for (let px = 0; px <= W; px += 4) { const y = H / 2 + Math.sin(px * .008 + t + i * 1.2) * 60 * Math.sin(t * .5 + i) + Math.cos(px * .005 - t * .7) * 30 + (m.on ? (m.y - H / 2) * .15 : 0); px === 0 ? x.moveTo(px, y) : x.lineTo(px, y); } x.strokeStyle = i % 2 ? R : G; x.globalAlpha = .15 + i * .03; x.lineWidth = 1.5 + i * .5; x.stroke(); } x.globalAlpha = 1; raf = requestAnimationFrame(tick); };
    tick(); const r = () => { const z = fit(c); W = z.W; H = z.H; }; addEventListener("resize", r); return () => { cancelAnimationFrame(raf); removeEventListener("resize", r); };
  }, []);
  return <div ref={ref} style={stageBox("#0e0c0b")}><canvas ref={cv} style={fullCanvas} /><Brand onEnter={onEnter} /></div>;
}

/* ---------- NEW: researched off current award-site patterns ---------- */

/* Film-grain reveal: a crisp brand layer sits under a grainy, noisy
 veil; a soft circular window around the pointer/tilt position clears
 the grain so the crisp layer shows through. The grain/clean-reveal
 combo is one of the most common moves on current award-site splash
 and hero treatments (texture + a cursor-gated reveal window). */
export function GrainReveal({ onEnter }: VProps) {
  const ref = useRef<HTMLDivElement>(null); const p = usePointerField(ref);
  const cv = useRef<HTMLCanvasElement>(null); const mask = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -1, y: -1 });
  useEffect(() => {
    const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c); const raf = 0;
    const draw = () => {
      const img = x.createImageData(W, H);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 10 + Math.random() * 26;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      x.putImageData(img, 0, 0);
    };
    draw();
    const iv = setInterval(draw, 90);
    const r = () => { const z = fit(c); W = z.W; H = z.H; draw(); };
    addEventListener("resize", r);
    return () => { clearInterval(iv); cancelAnimationFrame(raf); removeEventListener("resize", r); };
  }, []);
  useEffect(() => {
    let raf = 0;
    const t = () => {
      const m = p.current;
      if (m.on) {
        pos.current.x += (m.x - pos.current.x) * .18;
        pos.current.y += (m.y - pos.current.y) * .18;
        if (mask.current) mask.current.style.maskImage = mask.current.style.webkitMaskImage = `radial-gradient(260px circle at ${pos.current.x}px ${pos.current.y}px, transparent 0%, transparent 55%, black 100%)`;
      }
      raf = requestAnimationFrame(t);
    };
    raf = requestAnimationFrame(t);
    return () => cancelAnimationFrame(raf);
  }, [p]);
  return (
    <div ref={ref} style={stageBox("#0c0a09")}>
      <div style={{ position: "absolute", inset: 0 }}><Brand onEnter={onEnter} /></div>
      <div ref={mask} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: .85 }}>
        <canvas ref={cv} style={fullCanvas} />
      </div>
    </div>
  );
}

/* Cursor ribbon: a tapered, glowing trail of lagged points chases the
 pointer, drawn as a single smooth filled path rather than discrete
 dots -- the "luxury light trail" look several current award sites use
 for their cursor replacement. */
export function CursorRibbon({ onEnter }: VProps) {
  const ref = useRef<HTMLDivElement>(null); const p = usePointerField(ref); const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c), raf = 0;
    const N = 16;
    const trail = Array.from({ length: N }, () => ({ x: W / 2, y: H / 2 }));
    const tick = () => {
      x.clearRect(0, 0, W, H);
      const m = p.current;
      if (m.on) { trail[0].x += (m.x - trail[0].x) * .35; trail[0].y += (m.y - trail[0].y) * .35; }
      for (let i = 1; i < N; i++) { trail[i].x += (trail[i - 1].x - trail[i].x) * .4; trail[i].y += (trail[i - 1].y - trail[i].y) * .4; }
      for (let i = 0; i < N - 1; i++) {
        const w = (1 - i / N) * 9;
        const t = i / N;
        x.beginPath();
        x.moveTo(trail[i].x, trail[i].y);
        x.lineTo(trail[i + 1].x, trail[i + 1].y);
        x.lineWidth = Math.max(1, w);
        x.strokeStyle = t < .5 ? R : G;
        x.globalAlpha = (1 - t) * .8;
        x.lineCap = "round";
        x.stroke();
      }
      x.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    tick();
    const r = () => { const z = fit(c); W = z.W; H = z.H; };
    addEventListener("resize", r);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", r); };
  }, [p]);
  return <div ref={ref} style={stageBox(DK)}><canvas ref={cv} style={fullCanvas} /><Brand onEnter={onEnter} /></div>;
}

/* Liquid chrome: a soft, blobby metallic highlight drifts to and
 wobbles around the pointer, color-cycling between silver, gold and
 red like brushed chrome catching light -- the "liquid metal" look
 common on current premium/creative-agency award sites. */
export function LiquidChrome({ onEnter }: VProps) {
  const ref = useRef<HTMLDivElement>(null); const p = usePointerField(ref); const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current!, x = c.getContext("2d")!; let { W, H } = fit(c), raf = 0, t = 0;
    const pos = { x: W / 2, y: H / 2 };
    const blobs = Array.from({ length: 5 }, (_, i) => ({ ox: Math.cos(i * 1.3) * 40, oy: Math.sin(i * 1.3) * 40, sp: .6 + i * .15, r: 60 + i * 14 }));
    const tick = () => {
      t += .012;
      x.clearRect(0, 0, W, H);
      const m = p.current;
      const tx = m.on ? m.x : W / 2, ty = m.on ? m.y : H / 2;
      pos.x += (tx - pos.x) * .08; pos.y += (ty - pos.y) * .08;
      x.globalCompositeOperation = "lighter";
      blobs.forEach((b, i) => {
        const bx = pos.x + Math.cos(t * b.sp + i) * b.oy;
        const by = pos.y + Math.sin(t * b.sp + i) * b.ox;
        const grad = x.createRadialGradient(bx, by, 0, bx, by, b.r);
        const hue = i % 3 === 0 ? "223,49,49" : i % 3 === 1 ? "212,147,65" : "230,230,235";
        grad.addColorStop(0, `rgba(${hue},.26)`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        x.fillStyle = grad;
        x.beginPath(); x.arc(bx, by, b.r, 0, 7); x.fill();
      });
      x.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };
    tick();
    const r = () => { const z = fit(c); W = z.W; H = z.H; pos.x = W / 2; pos.y = H / 2; };
    addEventListener("resize", r);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", r); };
  }, [p]);
  return <div ref={ref} style={stageBox("#0e0c0b")}><canvas ref={cv} style={fullCanvas} /><Brand onEnter={onEnter} /></div>;
}

/* ============ REGISTRY + RANDOM + GALLERY ============ */
const VARIANTS: { name: string; desc: string; Comp: (p: VProps) => React.JSX.Element; bg: string }[] = [
 { name: "Constellation", desc: "Particle web links to your cursor or tilt", Comp: Constellation, bg: DK },
 { name: "Depth parallax", desc: "Layers tilt in perspective with your phone", Comp: Depth, bg: "#1b1714" },
 { name: "Glitch type", desc: "RGB-split wordmark jitters awake on first move", Comp: Glitch, bg: DK },
 { name: "Smoke trail", desc: "Wisps follow your cursor or tilt, nonstop", Comp: Smoke, bg: "#141110" },
 { name: "Ripple", desc: "Every move or tilt sends out rings", Comp: Ripple, bg: OW },
 { name: "Spotlight", desc: "A torch reveals the mark", Comp: Spotlight, bg: DK },
 { name: "Magnetic", desc: "Letters lean toward your cursor or tilt", Comp: Magnetic, bg: DK },
 { name: "Tilt glass", desc: "Glass card tilts in 3D with glare", Comp: TiltGlass, bg: "#17130f" },
 { name: "Duotone", desc: "Photo behind red/gold, lit by cursor", Comp: Duotone, bg: "#1a1410" },
 { name: "Gem burst", desc: "Cyan/gold shards explode as you move", Comp: GemBurst, bg: "#0f0c0b" },
 { name: "Mesh drift", desc: "Gradient mesh drifts with parallax", Comp: MeshDrift, bg: OW },
 { name: "Vortex", desc: "Spiral particle storm orbits your pointer", Comp: Vortex, bg: "#0d0b09" },
 { name: "Wave ripple", desc: "Layered sine waves follow cursor or tilt", Comp: WaveRipple, bg: "#0e0c0b" },
 { name: "Grain reveal", desc: "Film grain clears in a window around you", Comp: GrainReveal, bg: "#0c0a09" },
 { name: "Cursor ribbon", desc: "A glowing tapered trail chases your pointer", Comp: CursorRibbon, bg: DK },
 { name: "Liquid chrome", desc: "A metallic blob drifts and catches the light", Comp: LiquidChrome, bg: "#0e0c0b" },
];

/* Picks a variant that is never the same as the one shown last time (in
 this tab, via sessionStorage), so testing "surprise me" a few times in a
 row can't land on a repeat and read as "it's always the same 3 or 4" --
 a true uniform random draw over a small, visually-similar-looking set
 can still feel that way by chance, so this removes that chance entirely
 on top of curating the set itself down to 16 variants that actually look
 different from one another (the old 24 had seven different dot-cloud-
 on-dark-background variants alone, which is most of why a random pick
 kept reading as "the same thing" even when the index genuinely changed). */
const LAST_KEY = "wyz-splash-last";
function pickVariant(): number {
 let last = -1;
 try { last = Number(sessionStorage.getItem(LAST_KEY)); } catch {}
 let next = Math.floor(Math.random() * VARIANTS.length);
 if (VARIANTS.length > 1 && next === last) next = (next + 1 + Math.floor(Math.random() * (VARIANTS.length - 1))) % VARIANTS.length;
 try { sessionStorage.setItem(LAST_KEY, String(next)); } catch {}
 return next;
}

export function RandomSplash(props: VProps) {
 const [i, setI] = useState<number | null>(null);
 useEffect(() => {
   if (prefersReducedMotion()) return;
   setI(pickVariant());
 }, []);
 if (i === null) return <div style={stageBox(DK)}><style>{CSS}</style><Brand onEnter={props.onEnter} /></div>;
 const C = VARIANTS[i].Comp;
 return <><style>{CSS}</style><C {...props} /></>;
}

export default function SplashGallery() {
 const [open, setOpen] = useState<number | null>(null);
 useSplashScrollLock(open !== null);
 useEffect(() => { if (open === null) return; const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, [open]);
 const surprise = () => setOpen(pickVariant());
 const Active = open !== null ? VARIANTS[open].Comp : null;
 return (
 <div style={{ minHeight: "100vh", background: "#0e0c0b", padding: "48px 32px", fontFamily: "var(--font-body),system-ui,sans-serif" }}>
 <style>{CSS}</style>
 <div style={{ maxWidth: 1180, margin: "0 auto" }}>
 <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, color: OW, textAlign: "center", letterSpacing: ".05em", fontSize: 38, margin: 0 }}>SPLASH <span style={{ color: R }}>GALLERY</span></h1>
 <p style={{ color: "#757575", textAlign: "center", marginTop: 8, fontSize: 15 }}>{VARIANTS.length} variants, each built to feel the same whether you use a mouse or tilt your phone. Only the one you open animates.</p>
 <div style={{ textAlign: "center", margin: "18px 0 28px" }}><button onClick={surprise} style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", fontSize: 13, color: OW, background: R, border: "none", padding: "12px 26px", borderRadius: 3, cursor: "pointer" }}>Surprise me &rarr;</button></div>
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
 <button onClick={() => setOpen(null)} style={{ position: "absolute", top: 16, right: 16, zIndex: 210, padding: "8px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,.25)", background: "rgba(255,255,255,.1)", backdropFilter: "blur(6px)", color: "#fff", fontSize: 13, cursor: "pointer" }}>&larr; Back to gallery</button>
 <div style={{ position: "absolute", top: 18, left: 18, zIndex: 210, color: "rgba(255,255,255,.45)", fontSize: 13, fontFamily: "'Montserrat',sans-serif", letterSpacing: ".1em" }}>{VARIANTS[open!].name}</div>
 </div>
 )}
 </div>
 );
}
