"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

const CONCEPTS = [
  { name: "Yu Yi", meaning: "Embodies the universal yearning for connection — a thread that binds us across distance, culture, and time.", img: "/images/merch/dbc-archive/98442d-488e206ac0954202bc9563140aa2b55b~mv2.jpg", category: "Arc Collection" },
  { name: "Divine Woman", meaning: "A rose, vibrant and alive, emerges from a tangle of thorns, embodying resilience and the beauty that persists through struggle.", img: "/images/merch/dbc-archive/98442d-b3c114b8dab6450887e3d3aee9c71030~mv2.jpg", category: "Crater Collection" },
  { name: "Entropy", meaning: "The inevitable drift toward disorder — but within that chaos, a new order emerges. A celebration of beautiful decomposition.", img: "/images/merch/dbc-archive/98442d-bd1e1406036d4ba99d4f8197e1495337~mv2.jpg", category: "Arc Collection" },
  { name: "Femme Fatale I", meaning: "Dangerous elegance captured in ink. The first chapter of a two-part series exploring power and allure.", img: "/images/merch/dbc-archive/98442d-c13840a266e44b959886dc63b5826213~mv2.jpg", category: "Era Collection" },
  { name: "Femme Fatale II", meaning: "The sequel deepens the narrative — where the first was invitation, this is confrontation.", img: "/images/merch/dbc-archive/98442d-95706f79d3f649dd9dda6bc28ef99f65~mv2.jpg", category: "Era Collection" },
  { name: "Galactic Spill", meaning: "Cosmic chaos rendered in pigment. A nebula of color that refuses to stay within the lines.", img: "/images/merch/dbc-archive/98442d-71e847c4dd9546b0bef2a69d72d2baa6~mv2.jpg", category: "Crater Collection" },
  { name: "Toxic Blossom", meaning: "Beauty that kills. A flower blooming in poisoned soil — a reminder that the most stunning things often grow in the harshest places.", img: "/images/merch/dbc-archive/98442d-7ef7fb49e39942f687d13018406e72a8~mv2.jpg", category: "Arc Collection" },
  { name: "Crown Heights", meaning: "The weight of self-sovereignty. Every ruler carries the burden of their crown — this design wears it proudly.", img: "/images/merch/dbc-archive/98442d-3aa0e795baf84e72affb65d9c1cf76a6~mv2.jpg", category: "Era Collection" },
  { name: "Neon Dystopia", meaning: "A vision of tomorrow painted in fluorescent hues. Where technology meets rebellion, and the future is hand-painted.", img: "/images/merch/dbc-archive/98442d-a35038eae10c4de8a68b7ca3aa5f28f3~mv2.jpg", category: "Crater Collection" },
  { name: "Last of a Dying Breed", meaning: "The motto. The mission. A declaration that while the breed may be dying, the spirit is immortal.", img: "/images/merch/dbc-archive/98442d-60d7fe9cb1a14d4696d62ca1b5902cdf~mv2.jpg", category: "Arc Collection" },
];

const COLLECTIONS = ["All", "Arc Collection", "Crater Collection", "Era Collection"];

export default function ConceptArchivePage() {
  const [activeCollection, setActiveCollection] = useState("All");
  const [expandedConcept, setExpandedConcept] = useState<number | null>(null);

  const filtered = activeCollection === "All" ? CONCEPTS : CONCEPTS.filter(c => c.category === activeCollection);

  return (
    <main className="min-h-screen bg-white dark:bg-[#1C1C1E] pb-20">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-[#111] overflow-hidden hero-banner">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-black to-[#DF3131]/20" />
        <div className="relative z-10 text-center px-6 pt-24">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#DF3131] block mb-3">THE ART BEHIND THE WEAR</span>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] font-heading font-black text-white tracking-[0.08em] mb-4" style={{ lineHeight: 0.9 }}>
            CONCEPT<br />ARCHIVE
          </h1>
          <p className="text-white/50 text-[15px] max-w-lg mx-auto leading-relaxed">
            Every design tells a story. Every graphic carries meaning. Explore the narratives behind the art that goes on our merch.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-[130rem] mx-auto px-6 lg:px-12 pt-12">
        <ScrollReveal animation="fadeUp">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {COLLECTIONS.map(col => (
              <button key={col} onClick={() => setActiveCollection(col)}
                className={`px-5 py-2.5 text-[12px] font-bold tracking-[0.1em] uppercase rounded-full transition-all duration-300 ${
                  activeCollection === col
                    ? "bg-[#DF3131] text-white shadow-lg shadow-[#DF3131]/30 scale-105"
                    : "bg-white dark:bg-[#252528] text-[#666] dark:text-[#b0b0b0] border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] hover:text-[#DF3131] hover:scale-105"
                }`}>
                {col}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Concepts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((concept, i) => (
            <ScrollReveal key={concept.name} animation="fadeUp" delay={i * 0.05}>
              <div
                className="group cursor-pointer"
                onClick={() => setExpandedConcept(expandedConcept === i ? null : i)}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f5] dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] transition-all duration-500 hover:shadow-2xl hover:shadow-[#DF3131]/10">
                  <Image src={concept.img} alt={concept.name} fill className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#DF3131] mb-2 block">{concept.category}</span>
                    <h3 className="font-heading font-black text-white text-[1.5rem] tracking-[0.03em] mb-2">{concept.name}</h3>
                    <p className={`text-white/70 text-[14px] leading-relaxed transition-all duration-500 ${expandedConcept === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0 sm:max-h-0 sm:opacity-0"} overflow-hidden`}>
                      {concept.meaning}
                    </p>
                    {expandedConcept !== i && (
                      <p className="text-white/40 text-[12px] mt-2 sm:block hidden">Tap to read the story</p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal animation="fadeUp" delay={0.2}>
          <div className="text-center mt-16 py-12 border-t border-[#E2E2E2] dark:border-[#444]">
            <h2 className="font-heading font-black text-[1.5rem] sm:text-[2rem] text-[#333] dark:text-[#e0e0e0] tracking-[0.06em] mb-4">WEAR THE STORY</h2>
            <p className="text-[#666] dark:text-[#b0b0b0] text-[15px] mb-8 max-w-md mx-auto">Every concept becomes a product. Pick the story that resonates with you.</p>
            <Link href="/merch" className="inline-block px-10 py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.15em] uppercase text-[14px] hover:bg-[#B82020] transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#DF3131]/30">
              SHOP MERCH
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
