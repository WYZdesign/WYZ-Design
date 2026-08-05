"use client";

import { useState, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";

const TESTIMONIALS = [
  {
    quote: "I hired him for my wedding. He did remarkable work. If you ever need a photographer I would definitely recommend this person.",
    name: "Andrew Vickers",
    role: "Google Review",
    location: "Chicago, IL",
  },
  {
    quote: "Whether it's aiding your multimedia needs for your project or hosting awesome events, WYZ Design does a lot of dope work to enhance artistic endeavors and build community.",
    name: "Tim Perez",
    role: "Google Review",
    location: "Chicago, IL",
  },
  {
    quote: "Consistency in every aspect of service. Made me an established brand and has got me so many opportunities. Don't hesitate to bring your business here.",
    name: "Robert Sykes Jr",
    role: "Google Review",
    location: "Chicago, IL",
  },
  {
    quote: "This is a very solid place, the owner is awesome.",
    name: "900 Montae",
    role: "Google Review",
    location: "Chicago, IL",
  },
  {
    quote: "Artistic abilities stand out with unique designs and high-quality photography delivered quickly. Work consistently improves before deadlines, reflecting a fast-paced and efficient environment.",
    name: "Atly",
    role: "Business Review",
    location: "Chicago, IL",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => setActive((a) => (a + 1) % TESTIMONIALS.length), []);
  const prev = useCallback(() => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), []);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const t = TESTIMONIALS[active];

  return (
    <section className="py-16 bg-gradient-to-b from-zinc-950 to-black overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-[1.5rem] sm:text-[2rem] font-heading font-black text-white tracking-[0.1em] uppercase mb-2">
          What Clients <span className="text-[#DF3131]">Say</span>
        </h2>
        <div className="w-16 h-1 bg-[#DF3131] mx-auto mb-10" />

        <div className="relative min-h-[240px] flex items-center justify-center">
          <button
            onClick={prev}
            className="absolute left-0 z-10 p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Previous testimonial"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          <div className="px-12" key={active}>
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="w-5 h-5 fill-[#D49341] text-[#D49341]" />
              ))}
            </div>
            <blockquote className="text-white/80 text-lg sm:text-xl leading-relaxed mb-6 max-w-2xl mx-auto italic">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <p className="text-white font-bold text-sm tracking-[0.08em] uppercase">{t.name}</p>
            <p className="text-white/50 text-xs mt-1">{t.role} &mdash; {t.location}</p>
          </div>

          <button
            onClick={next}
            className="absolute right-0 z-10 p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Next testimonial"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === active ? "bg-[#DF3131] w-6" : "bg-white/30 hover:bg-white/50"}`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
