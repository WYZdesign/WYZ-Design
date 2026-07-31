"use client";

import { useState, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";

const TESTIMONIALS = [
  {
    quote: "WYZ Design took our brand from 'local shop' to 'national player.' The logo redesign alone brought in 3x our usual inquiry rate within 30 days.",
    name: "Marcus J.",
    role: "Founder, GFT Foods",
    location: "Chicago, IL",
  },
  {
    quote: "I've worked with agencies that charge 3x more and deliver half the quality. Torree understands brand identity at a level most designers don't.",
    name: "Diana K.",
    role: "Creative Director, Dawneeah's Glow",
    location: "Atlanta, GA",
  },
  {
    quote: "The photography and retouching quality is unmatched. Our model portfolio went from amateur to editorial-grade in one shoot.",
    name: "James R.",
    role: "Casting Director, Nomadic Breed",
    location: "Los Angeles, CA",
  },
  {
    quote: "Full-stack creative execution. They did our logo, our website, our merch designs, and our event flyers — and every piece was fire.",
    name: "Lisa T.",
    role: "Owner, XXtra Society",
    location: "Houston, TX",
  },
  {
    quote: "The FD Drive system alone is worth it. We get our raw photos delivered within hours of the shoot, organized and ready for review.",
    name: "Andre W.",
    role: "Producer, Studio One Ink",
    location: "Brooklyn, NY",
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
