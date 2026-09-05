"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FiChevronLeft, FiChevronRight, FiStar, FiTwitter, FiLinkedin } from "react-icons/fi";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const TESTIMONIALS = [
  {
    quote: "I hired him for my wedding. He did remarkable work. If you ever need a photographer I would definitely recommend this person.",
    name: "Andrew Vickers",
    role: "Google Review",
    location: "Chicago, IL",
    link: "https://www.google.com/search?q=Andrew+Vickers+review"
  },
  {
    quote: "Whether it's aiding your multimedia needs for your project or hosting awesome events, WYZ Design does a lot of dope work to help artists level up and build community.",
    name: "Tim Perez",
    role: "Google Review",
    location: "Chicago, IL",
    link: "https://www.google.com/search?q=Tim+Perez+review"
  },
  {
    quote: "Consistency in every aspect of service. Made me an established brand and has got me so many opportunities. Don't hesitate to bring your business here.",
    name: "Robert Sykes Jr",
    role: "Google Review",
    location: "Chicago, IL",
    link: "https://www.google.com/search?q=Robert+Sykes+Jr+review"
  },
  {
    quote: "This is a very solid place, the owner is awesome.",
    name: "900 Montae",
    role: "Google Review",
    location: "Chicago, IL",
    link: "https://www.google.com/search?q=900+Montae+review"
  },
  {
    quote: "Artistic abilities stand out with unique designs and high-quality photography delivered quickly. Work consistently improves before deadlines, reflecting a fast-paced and efficient environment.",
    name: "Atly",
    role: "Business Review",
    location: "Chicago, IL",
    link: "https://www.google.com/search?q=Atly+review"
  },
];

export default function Testimonials() {
  return (
    <ErrorBoundary fallback={
      <section className="py-16 bg-gradient-to-b from-zinc-950 to-black text-center">
        <p className="text-white/50 text-sm">Testimonials temporarily unavailable</p>
      </section>
    }>
      <TestimonialsSliderInner />
    </ErrorBoundary>
  );
}

function TestimonialsSliderInner() {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const next = useCallback(() => setActive((a) => (a + 1) % TESTIMONIALS.length), []);
  const prev = useCallback(() => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), []);

  useEffect(() => {
    const t = setInterval(() => { if (!pausedRef.current) next(); }, 6000);
    return () => clearInterval(t);
  }, [next]);

  const pauseAndResume = () => {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => { pausedRef.current = false; }, 5000);
  };

  const t = TESTIMONIALS[active];

  return (
    <section className="py-16 bg-gradient-to-b from-zinc-950 to-black overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-[1.5rem] sm:text-[2rem] font-heading font-black text-white tracking-[0.1em] uppercase mb-2">
          What Clients <span className="text-[#DF3131]">Say</span>
        </h2>
        <div className="w-16 h-1 bg-[#DF3131] mx-auto mb-6" />

        <div className="relative min-h-[240px] flex items-center justify-center">
          <button
            onClick={() => { prev(); pauseAndResume(); }}
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
            <blockquote className="text-white text-lg sm:text-xl leading-relaxed mb-6 max-w-2xl mx-auto italic">
              &ldquo;
              {t.quote}
              &rdquo;
            </blockquote>
            <p className="text-white font-bold text-sm tracking-[0.08em] uppercase">
              <a href={t.link} target="_blank" rel="noopener noreferrer" className="hover:text-[#DF3131] transition-colors cursor-pointer">
                {t.name}
              </a>
            </p>
            <p className="text-white/70 text-xs mt-1">{t.role} &mdash; {t.location}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-[#666] dark:text-white/40">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(t.quote)}&url=${encodeURIComponent(t.link ?? '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  <FiTwitter className="w-3 h-3 mr-1" />
                  Twitter
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(t.link ?? '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#0A66C2] transition-colors">
                  <FiLinkedin className="w-3 h-3 mr-1" />
                  LinkedIn
                </a>
              </div>
          </div>

          <button
            onClick={() => { next(); pauseAndResume(); }}
            className="absolute right-0 z-10 p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Next testimonial"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="testimonial-dots flex justify-center items-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="p-1 border-0 bg-transparent flex items-center justify-center min-w-[24px] min-h-[24px] cursor-pointer"
              aria-label={`Testimonial ${i + 1}`}
            >
              <span className={`rounded-full transition-all ${i === active ? "bg-[#DF3131] w-4 h-1.5" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
