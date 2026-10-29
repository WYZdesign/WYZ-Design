"use client";

/*
 WYZ Design - Splash Gallery (18 selected variants)

 2026-10-15 pass: phones now draw only from the tilt-native variants. Four
 pieces in the desktop set are cursor-oriented (CursorRibbon, Spotlight's
 torch, GrainReveal's cursor window, Duotone's cursor light) and have no
 meaning without a pointer, so each entry carries a `mobile` flag and
 RandomSplash filters by `isTouchPrimary()`; two new tilt-first variants
 (TiltLevel, TiltSheen) were added so the phone set is built around the
 tilt gesture rather than a mouse effect standing in for one.

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

import { useEffect, useState } from "react";
import { useSplashScrollLock } from "@/hooks/useSplashScrollLock";
import { prefersReducedMotion } from "@/lib/utils";
import { R, OW, DK, CSS, Brand, stageBox, type VProps } from "@/components/splash/SplashBrand";
import { Constellation, Depth, Glitch, Smoke, Ripple, Spotlight, Magnetic, TiltGlass, Duotone, GemBurst, MeshDrift, Vortex, WaveRipple, GrainReveal, CursorRibbon, LiquidChrome, TiltLevel, TiltSheen } from "@/components/splash/SplashVariantComponents";

/* ============ REGISTRY + RANDOM + GALLERY ============ */
const VARIANTS: { name: string; desc: string; Comp: (p: VProps) => React.JSX.Element; bg: string; mobile: boolean }[] = [
 { name: "Constellation", desc: "Particle web links to your cursor or tilt", Comp: Constellation, bg: DK, mobile: true },
 { name: "Depth parallax", desc: "Layers tilt in perspective with your phone", Comp: Depth, bg: "#1b1714", mobile: true },
 { name: "Glitch type", desc: "RGB-split wordmark jitters awake on first move", Comp: Glitch, bg: DK, mobile: true },
 { name: "Smoke trail", desc: "Wisps follow your cursor or tilt, nonstop", Comp: Smoke, bg: "#141110", mobile: true },
 { name: "Ripple", desc: "Every move or tilt sends out rings", Comp: Ripple, bg: OW, mobile: true },
 { name: "Spotlight", desc: "A torch reveals the mark", Comp: Spotlight, bg: DK, mobile: false },
 { name: "Magnetic", desc: "Letters lean toward your cursor or tilt", Comp: Magnetic, bg: DK, mobile: true },
 { name: "Tilt glass", desc: "Glass card tilts in 3D with glare", Comp: TiltGlass, bg: "#17130f", mobile: true },
 { name: "Duotone", desc: "Photo behind red/gold, lit by cursor", Comp: Duotone, bg: "#1a1410", mobile: false },
 { name: "Gem burst", desc: "Cyan/gold shards explode as you move", Comp: GemBurst, bg: "#0f0c0b", mobile: true },
 { name: "Mesh drift", desc: "Gradient mesh drifts with parallax", Comp: MeshDrift, bg: OW, mobile: true },
 { name: "Vortex", desc: "Spiral particle storm orbits your pointer", Comp: Vortex, bg: "#0d0b09", mobile: true },
 { name: "Wave ripple", desc: "Layered sine waves follow cursor or tilt", Comp: WaveRipple, bg: "#0e0c0b", mobile: true },
 { name: "Grain reveal", desc: "Film grain clears in a window around you", Comp: GrainReveal, bg: "#0c0a09", mobile: false },
 { name: "Cursor ribbon", desc: "A glowing tapered trail chases your pointer", Comp: CursorRibbon, bg: DK, mobile: false },
 { name: "Liquid chrome", desc: "A metallic blob drifts and catches the light", Comp: LiquidChrome, bg: "#0e0c0b", mobile: true },
 { name: "Tilt level", desc: "A horizon levels and a bead slides with tilt", Comp: TiltLevel, bg: "#0e0c0b", mobile: true },
 { name: "Tilt sheen", desc: "A raking light sweeps the mark as you tilt", Comp: TiltSheen, bg: "#0e0c0b", mobile: true },
];

export const VARIANT_COUNT = VARIANTS.length;
export const MOBILE_VARIANT_COUNT = VARIANTS.filter((v) => v.mobile).length;

/** True on phones/tablets: no hover, coarse pointer, touch events present. */
export function isTouchPrimary(): boolean {
 if (typeof window === "undefined") return false;
 try {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches || "ontouchstart" in window;
 } catch {
  return false;
 }
}

/* Picks the next variant from a shuffled "bag": every eligible variant goes
 in once, in random order, and each call pops one off. A true uniform random
 draw can by chance keep landing on the same few variants for a long run of
 visits -- with 18 (and growing) variants that reads as "it's always the
 same 3 or 4" even though nothing is actually broken, just unlucky. Drawing
 from a bag instead guarantees every variant is seen exactly once before any
 repeat, re-shuffling once the bag empties. The bag lives in localStorage
 (not sessionStorage) so it persists across tabs and visits on the same
 browser/device -- the whole point is that repeat visits, not just repeat
 calls in one tab, eventually surface everything. Desktop and mobile track
 separate bags since they draw from different pools. */
function shuffledBag(pool: number[]): number[] {
 const bag = [...pool];
 for (let i = bag.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [bag[i], bag[j]] = [bag[j], bag[i]];
 }
 return bag;
}
function pickVariant(mobileOnly = false): number {
 // On touch devices only the tilt-native variants are eligible: the
 // cursor-oriented pieces (cursor ribbon, torch reveal, cursor-gated grain,
 // duotone lit by cursor) have no meaning without a pointer.
 const pool = VARIANTS.map((_, i) => i).filter((i) => (mobileOnly ? VARIANTS[i].mobile : true));
 const bagKey = `wyz-splash-bag-${mobileOnly ? "mobile" : "all"}`;
 let bag: number[] = [];
 try {
  const raw = localStorage.getItem(bagKey);
  if (raw) bag = (JSON.parse(raw) as number[]).filter((i) => pool.includes(i));
 } catch {}
 if (bag.length === 0) bag = shuffledBag(pool);
 const next = bag.pop();
 try { localStorage.setItem(bagKey, JSON.stringify(bag)); } catch {}
 return next ?? pool[0];
}

export function RandomSplash(props: VProps) {
 const [i, setI] = useState<number | null>(null);
 useEffect(() => {
   if (prefersReducedMotion()) return;
   setI(pickVariant(isTouchPrimary()));
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
 <p style={{ color: "#757575", textAlign: "center", marginTop: 8, fontSize: 15 }}>{VARIANTS.length} variants. Phones get only the {VARIANTS.filter((v) => v.mobile).length} tilt-native ones; desktop gets all {VARIANTS.length}. Only the one you open animates.</p>
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
