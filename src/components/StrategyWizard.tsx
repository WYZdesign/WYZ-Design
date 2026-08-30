"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronRight, FiCheck, FiRotateCcw } from "react-icons/fi";
import { useZeal } from "@/components/ZealProvider";
import { useModalA11y } from "@/hooks/useModalA11y";

interface Step { q: string; options: { label: string; value: string }[]; }

const STEPS: Step[] = [
  {
    q: "What service are you looking for?",
    options: [
      { label: "Photography", value: "photo" },
      { label: "Graphic Design", value: "design" },
      { label: "Videography", value: "video" },
      { label: "Web Design", value: "web" },
      { label: "Multiple Services", value: "multi" },
      { label: "Not Sure Yet", value: "unsure" },
    ],
  },
  {
    q: "What's the goal of your project?",
    options: [
      { label: "Brand Launch / Rebrand", value: "launch" },
      { label: "Event Coverage", value: "event" },
      { label: "Product / Promo Content", value: "promo" },
      { label: "Social Media Growth", value: "social" },
      { label: "Website / Online Presence", value: "website" },
    ],
  },
  {
    q: "What's your budget range?",
    options: [
      { label: "Under $200", value: "low" },
      { label: "$200 – $500", value: "mid" },
      { label: "$500 – $1,000", value: "high" },
      { label: "$1,000+", value: "premium" },
      { label: "Monthly Plan", value: "monthly" },
    ],
  },
  {
    q: "How soon do you need this?",
    options: [
      { label: "ASAP (24–48 hrs)", value: "rush" },
      { label: "This Week", value: "week" },
      { label: "Within 2 Weeks", value: "twoweeks" },
      { label: "No Rush", value: "flexible" },
    ],
  },
];

interface Recommendation { title: string; services: { name: string; price: string; note: string }[]; plan: string; planPrice: string; planNote: string; total: string; }

function getRecommendation(answers: string[]): Recommendation {
  const [service, goal, budget, timeline] = answers;

  const rec: Recommendation = { title: "", services: [], plan: "", planPrice: "", planNote: "", total: "" };

  // Determine services
  if (service === "photo" || service === "unsure") {
    rec.services.push({ name: "Photoshoot (1 hr)", price: "$100", note: "Professional photography, free retouching" });
    if (goal === "event") {
      rec.services = [{ name: "Event Photography (3 hr)", price: "$200", note: "Full event coverage, candid + posed" }];
    }
  } else if (service === "design") {
    rec.services.push({ name: "Graphic Design", price: "$75", note: "3 revisions included" });
    if (goal === "launch") {
      rec.services.push({ name: "Logo Design", price: "$100", note: "5 revisions, full brand identity" });
    }
  } else if (service === "video") {
    rec.services.push({ name: "Video Shoot (3 hr)", price: "$200", note: "Professional video production" });
    rec.services.push({ name: "Video Editing", price: "$200", note: "Adobe suite, 4 hr editing" });
  } else if (service === "web") {
    rec.services.push({ name: "Website Design (5 pages)", price: "$500", note: "Responsive, SEO-ready" });
    rec.services.push({ name: "SEO Audit", price: "$50", note: "In-depth growth strategy" });
  } else if (service === "multi") {
    rec.services = [
      { name: "Photoshoot (1 hr)", price: "$100", note: "Professional photography" },
      { name: "Graphic Design", price: "$75", note: "3 revisions included" },
      { name: "Video Promo", price: "$200", note: "3 hr shoot + editing" },
    ];
  }

  // Determine plan recommendation
  if (budget === "monthly") {
    if (service === "multi" || service === "unsure") {
      rec.plan = "Business Boost";
      rec.planPrice = "$500/mo";
      rec.planNote = "Best value for multi-service needs, $2,025/mo value";
    } else {
      rec.plan = "Starter Pack";
      rec.planPrice = "$250/mo";
      rec.planNote = "Perfect single-service starter, $725/mo value";
    }
  } else if (budget === "premium" || budget === "high") {
    rec.plan = "Pro Plus";
    rec.planPrice = "$750/mo";
    rec.planNote = "Unlimited shoots + designs + video, $1,425/mo value";
  } else if (budget === "mid") {
    if (service === "multi") {
      rec.plan = "Starter Pack";
      rec.planPrice = "$250/mo";
      rec.planNote = "Covers multiple services at one flat rate, $725/mo value";
    }
  }

  // Calculate total
  const serviceTotal = rec.services.reduce((sum, s) => {
    const price = parseInt(s.price.replace(/[^0-9]/g, ""));
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  rec.total = serviceTotal > 0 ? `$${serviceTotal}` : "Varies";

  return rec;
}

export default function StrategyWizard() {
  const { earn } = useZeal();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<Recommendation | null>(null);
  const earnedCompleteRef = useRef(false);

  useModalA11y(() => setOpen(false), { lockScroll: true, active: open });

  function pick(val: string) {
    const next = [...answers, val];
    setAnswers(next);
    if (next.length === STEPS.length) {
      setResult(getRecommendation(next));
      setStep(STEPS.length);
      if (!earnedCompleteRef.current) {
        earnedCompleteRef.current = true;
        void earn("complete-wizard");
      }
    } else {
      setStep(step + 1);
    }
  }

  function reset() { setStep(0); setAnswers([]); setResult(null); }

  const resultSummary = result
    ? result.plan
      ? `${result.plan} plan (${result.planPrice})`
      : result.services[0]?.name || "your recommendation"
    : "";

  return (
    <>
      <div className="mt-12 p-6 border border-[#DF3131] bg-[#DF3131]/5 flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="text-left">
           <h3 className="text-[20.7px] font-heading font-bold text-[#333333] dark:text-white">Strategy Wizard</h3>
           <p className="text-[13px] text-[#666665] dark:text-white/60 mt-1 max-w-2xl text-left">
            Answer 4 quick questions and get a personalized service recommendation with exact pricing and the best plan for your needs.
          </p>
        </div>
        <button onClick={() => { reset(); setOpen(true); }} className="shrink-0 px-6 py-3 bg-[#DF3131] text-white text-[15px] font-bold tracking-[0.08em] hover:bg-[#B82020] transition-colors sm:self-center">
          Start Wizard
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()} className="bg-white dark:bg-[#252528] max-w-[560px] w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto border border-[#E2E2E2] dark:border-[#444] shadow-[0_25px_60px_rgba(0,0,0,.25)]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E2E2E2] dark:border-[#444] flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-[0.15em] text-[#DF3131] uppercase">Strategy Wizard</p>
                <p className="text-[13px] text-[#666] dark:text-white/60 mt-0.5">
                  {step < STEPS.length ? `Question ${step + 1} of ${STEPS.length}` : "Your Recommendation"}
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#666] dark:text-white/60 hover:text-[#333] dark:hover:text-white text-xl leading-none">&times;</button>
            </div>

            {/* Progress bar */}
            {step < STEPS.length && (
              <div className="h-[3px] bg-[#E2E2E2] dark:bg-[#444]">
                <motion.div animate={{ width: `${((step) / STEPS.length) * 100}%` }} transition={{ duration: 0.3 }} className="h-full bg-[#DF3131]" />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step < STEPS.length && (
                  <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h3 className="text-lg font-heading font-bold text-[#333] dark:text-white mb-4">{STEPS[step].q}</h3>
                    <div className="space-y-2">
                      {STEPS[step].options.map(opt => (
                        <button key={opt.value} onClick={() => pick(opt.value)} className="flex items-center gap-3 px-[18px] py-[14px] border border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#252528] cursor-pointer transition-all duration-200 text-left w-full group hover:border-[#DF3131] hover:bg-[#DF3131] hover:text-white">
                          <span className="w-[28px] h-[28px] border-2 border-[#DF3131] text-[#DF3131] flex items-center justify-center shrink-0 transition-all duration-200 group-hover:border-white group-hover:text-white"><FiChevronRight className="w-4 h-4" /></span>
                          <span className="text-sm font-semibold text-[#333] dark:text-white group-hover:text-white">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {result && (
                  <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-[#DF3131] rounded-full flex items-center justify-center mx-auto mb-3">
                        <FiCheck className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-[1.15rem] sm:text-[1.15rem] font-heading font-bold text-[#333] dark:text-white">Here's Your Plan</h3>
                      <p className="text-[13px] text-[#666] dark:text-white/60 mt-1">Based on your answers, here's what we recommend</p>
                    </div>

                    {/* Recommended services */}
                    {result.services.map((s, i) => (
                      <div key={i} className="p-4 border border-[#E2E2E2] dark:border-[#444] bg-[#FAFAF9] dark:bg-[#1C1C1E]">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-heading font-extrabold text-[#333] dark:text-white text-sm mb-2">{s.name}</h4>
                            <p className="text-[13px] text-[#666] dark:text-white/60">{s.note}</p>
                          </div>
                          <span className="text-[15px] font-bold text-[#DF3131] shrink-0 ml-3">{s.price}</span>
                        </div>
                      </div>
                    ))}

                    {/* Total */}
<div className="p-4 border border-[#E2E2E2] dark:border-[#444] bg-[#FAFAF9] dark:bg-[#1C1C1E] flex flex-col items-center justify-center text-center gap-2">
                       <h4 className="font-heading font-extrabold text-[#333] dark:text-white text-sm !mb-0">À La Carte Total</h4>
                       <span className="text-[18px] font-bold text-[#DF3131]">{result.total}</span>
                     </div>

                    {/* Plan recommendation */}
                    {result.plan && (
                      <div className="p-5 bg-[#DF3131] text-white text-center">
                        <p className="text-[11px] font-bold tracking-[0.15em] uppercase opacity-80">Recommended Plan</p>
                        <h3 className="font-heading font-black text-xl mt-1">{result.plan}</h3>
                        <p className="text-[18px] font-bold mt-1">{result.planPrice}</p>
                        <p className="text-[14px] opacity-90 mt-1">{result.planNote}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <button onClick={reset} className="flex items-center gap-2 px-4 py-2.5 border border-[#E2E2E2] dark:border-[#444] text-[13px] font-bold text-[#333] dark:text-white/70 hover:border-[#DF3131] hover:text-[#DF3131] transition-all">
                        <FiRotateCcw className="w-3.5 h-3.5" /> Start Over
                      </button>
                      <button onClick={() => setOpen(false)} className="flex-1 px-4 py-2.5 bg-[#DF3131] text-white text-[13px] font-bold tracking-[0.08em] hover:bg-[#B82020] transition-colors">
                        Get Started
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                      <Link href="/web-design" className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-[#E2E2E2] dark:border-[#444] text-[13px] font-bold text-[#333] dark:text-white/70 hover:border-[#DF3131] hover:text-[#DF3131] transition-all">
                        Price It Yourself
                      </Link>
                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent("wyz-chat-open", { detail: { prefill: `Hi! I just took your match quiz and got: ${resultSummary}. Can you tell me more?` } }))}
                        className="flex-1 px-4 py-2.5 bg-[#DF3131] text-white text-[13px] font-bold tracking-[0.08em] hover:bg-[#B82020] transition-colors"
                      >
                        Ask the Assistant
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
