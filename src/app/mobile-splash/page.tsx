"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiArrowRight, FiMapPin, FiCamera, FiCalendar, FiPackage } from "react-icons/fi";

const WYZ_RED = "#DF3131";
const WYZ_GOLD = "#D49341";
const WYZ_GREEN = "#D49341";
const WIZARD_O = "#FFFFFF";
const CHARCOAL = "#262626";
const DARK = "#161311";

interface SplashConcept {
  id: number;
  title: string;
  description: string;
  color: string;
  author: string;
}

const concepts: SplashConcept[] = [
  {
    id: 1,
    title: "Tilt-Navigate Splash",
    description: "Gyro-tilted WYZ logo that physically leans as device tilts, with CaretType reveal and floating geometric gold accents.",
    color: WYZ_RED,
    author: "Based on Awwwards tilt-tilt effects, WYZ Wyzbrand redesign"
  },
  {
    id: 2,
    title: "Gradient Swirl Intro",
    description: "Gradient mesh blob effect with gold particle trails, WYZ initials wipe away like a magic eraser. Auto-proceed after 3s.",
    color: WYZ_GREEN,
    author: "Inspired by Red C Mobile's fluid shapes"
  },
  {
    id: 3,
    title: "Micro-Interaction Loader",
    description: "Loading bar that fills with 10% increments revealing a different WYZ service icon each time. Count-up text: 'Crafting digital experiences • 0% → 100%'.",
    color: WYZ_RED,
    author: "Based on T-Mobile Game of Phones micro-interactions"
  },
  {
    id: 4,
    title: "3D Cube Reveal",
    description: "Device points at spinning 3D WYZ monogram cube with each face representing a portfolio category (Web, Print, UX, Branding). Tilt rotates cube.",
    color: WYZ_GREEN,
    author: "Inspired by Apple WWDC device orientation UI"
  },
  {
    id: 5,
    title: "Vertical Scroll Cascade",
    description: "Tall single-page intro with logo locked at top, scroll-triggered reveal of 5 value propositions with staggered animation. Bottom CTA appears at 75% scroll.",
    color: WYZ_RED,
    author: "Based on modern vertical scroll storytelling"
  },
  {
    id: 6,
    title: "Particle Field Hero",
    description: "Black background with interactive particle field (gold particles). User drag creates trails, particles orbit WYZ name. Double-tap anywhere → portfolio masonry grid.",
    color: WYZ_GREEN,
    author: "Inspired by Stripe Dashboard particle interactions"
  },
  {
    id: 7,
    title: "Scratch-to-Reveal",
    description: "Matte gold foil WYZ logo with scratch effect. Swipe/scratch reveals hidden portfolio thumbnails underneath. Inspired by print finishing techniques.",
    color: WYZ_RED,
    author: "Based on WYZ Design print heritage and visual printing effects"
  },
  {
    id: 8,
    title: "Hologram Stack",
    description: "WYZ logo appears as floating 3D hologram stack, device tilt rotates stack showing layered brand elements. Tap stack to 'flip' through Logo → Typography → Color → Motion.",
    color: WYZ_GREEN,
    author: "Inspired by futuristic hologram UI patterns"
  },
  {
    id: 9,
    title: "Timeline Scroll Journey",
    description: "Vertical timeline spanning entire screen height (WYZ since 2018). Scroll reveals key milestones with year markers. Current year (2024) has animated 'What's Next?' teaser.",
    color: WYZ_RED,
    author: "Based on modern timeline storytelling"
  },
  {
    id: 10,
    title: "Minimalist Pulse",
    description: "Stark white background with single WYZ logo center-screen, subtle breathing pulse animation (2s cycle), gold accent line draws itself from left to right on page load. Pulse invitingly.",
    color: WYZ_GREEN,
    author: "Based on minimalist interfaces and precise micro-interactions"
  }
];

export default function MobileSplashPage() {
  const [ready, setReady] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<SplashConcept | null>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark to-[#1a1412]" />
        <div className="absolute inset-0" style={{ 
          background: `radial-gradient(circle at 20% 20%, ${WYZ_RED}20 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${WYZ_GREEN}20 0%, transparent 50%)` 
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col">
        <header className="text-center mb-8">
          <h1 className="text-[1.5rem] sm:text-[2.5rem] font-heading font-black tracking-[0.08em] mb-4">
            <span style={{ color: WIZARD_O }}>WYZ</span> <span style={{ color: WYZ_RED }}>Mobile Splash Pages</span>
          </h1>
          <p className="text-[#999] text-sm max-w-2xl mx-auto">
            10 mobile-first splash concepts inspired by award-winning design sites, with WYZ Design polish and intent.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {concepts.map((concept) => (
            <div
              key={concept.id}
              className="group relative bg-[#252528] rounded-xl border border-[#333] p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedConcept(concept)}
            >
              <div className="mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${concept.color}20` }}
                >
                  {concept.id % 2 === 0 ? (
                    <FiMapPin className="w-5 h-5" style={{ color: concept.color }} />
                  ) : (
                    <FiCamera className="w-5 h-5" style={{ color: concept.color }} />
                  )}
                </div>
                <h3 
                  className="font-heading font-bold text-[1.1rem] mb-2"
                  style={{ color: WIZARD_O }}
                >
                  {concept.title}
                </h3>
                <p 
                  className="text-[#999] text-sm leading-relaxed"
                >
                  {concept.description}
                </p>
              </div>
              <div 
                className="absolute top-4 right-4 text-xs"
                style={{ color: concept.color, opacity: 0.6 }}
              >
                Concept {concept.id}
              </div>
              <div 
                className="absolute bottom-4 left-4 text-xs italic"
                style={{ color: "#666" }}
              >
                — {concept.author}
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </main>

        <footer className="text-center mt-auto">
          <p className="text-[#666] text-sm mb-4">
            Swipe or tap any concept to explore deeper implementation details
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs" style={{ color: "#555" }}>
            <span>Source: Awwwards, FWA, CSS Design Awards</span>
            <span>•</span>
            <span>Touch-first design principles</span>
            <span>•</span>
            <span>WYZ Design signature gold/red palette</span>
          </div>
        </footer>
      </div>

      {selectedConcept && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6"
          style={{ animation: "wzFadeIn 0.2s ease-out both" }}
          onClick={() => setSelectedConcept(null)}
        >
          <div 
            className="bg-[#252528] rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 
                className="text-2xl font-heading font-black"
                style={{ color: selectedConcept.color }}
              >
                {selectedConcept.title}
              </h2>
              <button
                onClick={() => setSelectedConcept(null)}
                className="text-[#999] hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-[#ccc] leading-relaxed">
                {selectedConcept.description}
              </p>
              <div 
                className="border-t border-[#333] pt-4 mt-4"
                style={{ color: "#777" }}
              >
                <p className="text-sm">
                  <strong>Implementation inspiration:</strong> {selectedConcept.author}
                </p>
                <p className="text-sm mt-2">
                  <strong>Technical approach:</strong> Mobile-first with touch interactions, support for both iOS (DeviceOrientationEvent) and Android, progressive enhancement.
                </p>
                <p className="text-sm mt-2">
                  <strong>Visual style:</strong> Gold (#D49341) and Red (#DF3131) color palette with dark background, Swiss grid typography, print-inspired effects.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes wzFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes wzScaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @font-face {
          font-family: 'Montserrat';
          src: url('/fonts/montserrat.woff2') format('woff2');
          font-weight: 900;
          font-style: normal;
        }
        .font-heading {
          font-family: 'Montserrat', system-ui, sans-serif;
          font-weight: 900;
        }
      `}</style>
    </div>
  );
}
