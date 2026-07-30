"use client";
import { useState, useEffect, useRef } from "react";
const SPLASHES = [
 { src: "/images/splash-gallery/splash_1.jpg", title: "Abstract Flow" },
 { src: "/images/splash-gallery/splash_2.jpg", title: "Neon Nights" },
 { src: "/images/splash-gallery/splash_3.jpg", title: "Urban Pulse" },
 { src: "/images/splash-gallery/splash_4.jpg", title: "Color Storm" },
 { src: "/images/splash-gallery/splash_5.jpg", title: "Digital Dreams" },
 { src: "/images/splash-gallery/splash_6.jpg", title: "Retro Wave" },
 { src: "/images/splash-gallery/splash_7.jpg", title: "Minimal Edge" },
 { src: "/images/splash-gallery/splash_8.jpg", title: "Bold Statement" },
 { src: "/images/splash-gallery/splash_9.jpg", title: "Creative Fire" },
 { src: "/images/splash-gallery/splash_10.jpg", title: "Fresh Cut" },
];

function useGyro() {
 const [gyro, setGyro] = useState({ x: 0, y: 0, z: 0 });
 const hasGyro = useRef(false);

 useEffect(() => {
 const handler = (e: DeviceOrientationEvent) => {
 hasGyro.current = true;
 const x = (e.gamma ?? 0) / 45;
 const y = (e.beta ?? 0) / 90;
 const z = (e.alpha ?? 0) / 180;
 setGyro({ x: Number(x.toFixed(3)), y: Number(y.toFixed(3)), z: Number(z.toFixed(3)) });
 };

 if (typeof DeviceOrientationEvent !== "undefined") {
 if ((DeviceOrientationEvent as any).requestPermission) {
 (DeviceOrientationEvent as any).requestPermission()
 .then(() => window.addEventListener("deviceorientation", handler))
 .catch(() => {});
 } else {
 window.addEventListener("deviceorientation", handler);
 }
 }

 return () => window.removeEventListener("deviceorientation", handler);
 }, []);

 return { gyro, hasGyro: hasGyro.current };
}

export default function SplashShowcasePage() {
 const [selected, setSelected] = useState<number | null>(null);
 const [ready, setReady] = useState(false);
 const { gyro, hasGyro } = useGyro();
 const [isTouch, setIsTouch] = useState(false);

 useEffect(() => {
 document.documentElement.style.background = "#111";
 document.body.style.background = "#111";
 document.body.style.backgroundColor = "#111";
 setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
 requestAnimationFrame(() => {
 requestAnimationFrame(() => {
 setReady(true);
 });
 });
 return () => {
 document.documentElement.style.background = "";
 document.body.style.background = "";
 document.body.style.backgroundColor = "";
 };
 }, []);

 if (!ready) {
 return <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#111]"/>;
 }

 return (
 <main className="pb-16 bg-white dark:bg-[#111]">
 <div className="max-w-[115rem] mx-auto px-4 lg:px-12">
 <div className="text-center mb-8 md:mb-12">
 <h1 className="text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-heading font-black tracking-[0.08em] mb-3 whitespace-nowrap">
 <span className="text-[#333] dark:text-white">SPLASH</span> <span className="text-[#DF3131]">SHOWCASE</span>
 </h1>
 <p className="text-[#666] dark:text-white/40 text-sm">{isTouch && hasGyro ? "Tilt your phone to explore" : "Static splash screen showcase"}</p>
 </div>
 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
 {SPLASHES.map((s, i) => {
 const stagger = i * 0.15;
 const tx = isTouch && hasGyro ? gyro.x * 8 : 0;
 const ty = isTouch && hasGyro ? gyro.y * 8 : 0;
 const tz = isTouch && hasGyro ? gyro.z * 3 : 0;
 const scaleImg = isTouch && hasGyro ? 1 + Math.abs(gyro.x) * 0.05 : 1;

 return (
 <div
 key={i}
 className="relative group cursor-pointer overflow-hidden rounded-xl aspect-video select-none"
 onClick={() => setSelected(i)}
 style={{
 transform: hasGyro
 ? `perspective(800px) translate3d(${tx}px, ${-ty}px, ${tz}px)`
 : undefined,
 transition: "transform 0.3s ease-out",
 }}
 >
 <div
 className="w-full h-full"
 style={{
 transition: "transform 0.3s ease-out",
 }}
 >
 <img
 src={s.src}
 alt={s.title}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
 style={isTouch && hasGyro ? {
 transform: `scale(${scaleImg}) translate3d(${tx * 0.5}px, ${ty * 0.5}px, 0)`,
 transition: "transform 0.3s ease-out",
 } : undefined}
 />
 </div>
 <div
 className="absolute inset-0 bg-black/0 sm:group-hover:bg-black/50 bg-black/30 sm:bg-black/0 transition-colors flex items-end p-3 md:p-4 sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
 style={isTouch && hasGyro ? {
 opacity: 0.3 + Math.abs(gyro.y) * 0.5,
 transition: "opacity 0.3s ease-out",
 } : undefined}
 >
 <p className="text-[#333] dark:text-white font-heading font-bold text-xs md:text-sm tracking-[0.1em]">{s.title}</p>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {selected !== null && (
 <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8" onClick={() => setSelected(null)}>
 <img src={SPLASHES[selected].src} alt={SPLASHES[selected].title} width={900} height={506} className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg" />
 <p className="absolute bottom-8 text-[#333] dark:text-white font-heading font-bold tracking-[0.1em]">{SPLASHES[selected].title}</p>
 </div>
 )}
 </main>
 );
}
