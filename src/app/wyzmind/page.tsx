"use client";
import { useState, useRef, useEffect, ReactNode, useCallback } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import { FiCpu, FiLayers, FiBarChart2, FiZap, FiFolder, FiMaximize } from "react-icons/fi";

const FEATURES = [
  {
    id: "ai",
    title: "AI Intake & Automation",
    icon: <FiCpu />,
    layman: "Stop drowning in DMs and emails, let smart forms handle the busywork.",
    details: "AI reads every inquiry, figures out what the person actually wants, and either books them automatically or drafts a proposal before you even wake up. Like having a 24/7 assistant that never sleeps, never forgets, and never sends typos."
  },
  {
    id: "strategy",
    title: "Creative Strategy Engine",
    icon: <FiLayers />,
    layman: "A brainstorming partner that actually remembers your brand.",
    details: "It studies your style, your past work, and your audience. Then it generates campaign ideas, content calendars, and creative briefs that actually fit your vibe, not generic templates. Think of it as your creative co-pilot."
  },
  {
    id: "portals",
    title: "Client Portals & Dashboards",
    icon: <FiBarChart2 />,
    layman: "One link. Everything your client needs, no more text message chaos.",
    details: "Each client gets their own dashboard: project timeline, file delivery, invoices, messaging. They stop texting you at 11PM asking for that one file. Everything is right there. You look professional, they feel taken care of."
  },
  {
    id: "booking",
    title: "Booking & Workflow Systems",
    icon: <FiZap />,
    layman: "The boring stuff handled so you can focus on the actual work.",
    details: "Automated scheduling that syncs with your calendar. Payment processing built into every booking. Project management pipelines that move tasks from 'client sent materials' to 'delivered' without you micromanaging anything."
  },
  {
    id: "content",
    title: "Content & Media Management",
    icon: <FiFolder />,
    layman: "Your files stop being a disaster zone, forever.",
    details: "Automatic file organization and naming. Cloud storage structure that makes sense. Media library with tags, search, and version history. You'll never dig through folders named 'final_FINAL_v3_REALFINAL.psd' again."
  },
  {
    id: "3d",
    title: "3D & Interactive Systems",
    icon: <FiMaximize />,
    layman: "Go beyond flat screens into immersive experiences.",
    details: "3D modeling pipelines for product visualization, VR integration for virtual galleries, and interactive media tools for installations. This is where we push creative output past what a flat JPEG can do."
  },
];

const STACK_ITEMS = [
  { name: "Ollama + Local LLMs", category: "AI", layman: "Runs AI models on your own computer, no subscriptions, no data leaks", detail: "deepseek-coder, llama3.2, llava - all running locally or tunneled through our Shadow PC GPU node." },
  { name: "Qdrant Vector DB", category: "Data", layman: "The brain's memory, stores knowledge so AI can find the right answer instantly", detail: "1.17M+ vectors across 3 collections. Semantic search that actually understands what you mean." },
  { name: "Neo4j Graph DB", category: "Data", layman: "Maps how everything connects, people, projects, skills, relationships", detail: "Knowledge graph that links clients to projects to tools to past work. Not just search - discovery." },
  { name: "Redis Queue", category: "Infra", layman: "The to-do list that makes sure nothing gets dropped or forgotten", detail: "Append-only Omega queue handling task scheduling, message passing, and request buffering." },
  { name: "MongoDB Atlas", category: "Data", layman: "Cloud database that stores all the structured stuff, forms, users, projects", detail: "Schema-flexible document store. Handles everything from contact forms to client project data." },
  { name: "Heroku", category: "Infra", layman: "Runs the backend services that keep everything online 24/7", detail: "Hosts Python bridge API, n8n workflows, and background processing jobs." },
  { name: "Python + PowerShell", category: "Infra", layman: "The glue code and automation scripts that tie everything together", detail: "570+ Python modules in _ENGINE/, 800+ PowerShell functions in wyz_os.ps1." },
  { name: "Next.js + Vercel", category: "Platform", layman: "The website framework, what you're looking at right now", detail: "This entire site runs on Next.js 16 with Turbopack, deployed globally on Vercel's edge network." },
  { name: "Stripe Payments", category: "Platform", layman: "Handles all the money stuff, subscriptions, invoices, checkout", detail: "Integrated into booking flows, plans, and merch. Automated billing, receipts, and payment tracking." },
  { name: "Resend Email", category: "Platform", layman: "Sends all the emails, confirmations, newsletters, client updates", detail: "Transactional and marketing email delivery. Branded templates for every notification type." },
  { name: "n8n Automation", category: "Infra", layman: "Visual workflow builder, connect apps and automate repetitive tasks", detail: "18 active workflows handling contact intake, data processing, and cross-service orchestration." },
];

const STACK_CATEGORIES = ["All", "AI", "Data", "Infra", "Platform"];

export default function WYZMiNDPage() {
   const [activeFeature, setActiveFeature] = useState<string | null>(null);
   const [activeStackCat, setActiveStackCat] = useState("All");
   const [expandedStack, setExpandedStack] = useState<string | null>(null);
   const brainCanvasRef = useRef<HTMLCanvasElement>(null);

   useEffect(() => {
     const c = brainCanvasRef.current;
     if (!c) return;
     const cx = c.getContext("2d");
     if (!cx) return;
     let animId: number;
     const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
      function resize() {
        const w = c!.offsetWidth;
        const h = c!.offsetHeight;
        c!.width = w * 2;
        c!.height = h * 2;
        cx!.setTransform(2, 0, 0, 2, 0, 0);
        nodes.length = 0;
        for (let i = 0; i < 40; i++) {
          nodes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 2 + 1,
          });
        }
      }
     resize();
     window.addEventListener("resize", resize);
     function draw() {
       const w = c!.offsetWidth;
       const h = c!.offsetHeight;
       cx!.clearRect(0, 0, w, h);
       for (let i = 0; i < nodes.length; i++) {
         for (let j = i + 1; j < nodes.length; j++) {
           const dx = nodes[i].x - nodes[j].x;
           const dy = nodes[i].y - nodes[j].y;
           const dist = Math.sqrt(dx * dx + dy * dy);
           if (dist < 120) {
             cx!.beginPath();
             cx!.strokeStyle = `rgba(223,49,49,${0.4 * (1 - dist / 120)})`;
             cx!.lineWidth = 0.5;
             cx!.moveTo(nodes[i].x, nodes[i].y);
             cx!.lineTo(nodes[j].x, nodes[j].y);
             cx!.stroke();
           }
         }
       }
       nodes.forEach((n) => {
         n.x += n.vx;
         n.y += n.vy;
         if (n.x < 0 || n.x > w) n.vx *= -1;
         if (n.y < 0 || n.y > h) n.vy *= -1;
         cx!.beginPath();
         cx!.fillStyle = "rgba(223,49,49,0.6)";
         cx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
         cx!.fill();
       });
       animId = requestAnimationFrame(draw);
     }
     draw();
     return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
   }, []);

  const filteredStack = activeStackCat === "All"
    ? STACK_ITEMS
    : STACK_ITEMS.filter((s) => s.category === activeStackCat);

  return (
    <main className="bg-white dark:bg-[#1C1C1E] min-h-screen text-[#333] dark:text-[#e0e0e0] pb-20">
      <ScrollReveal animation="fadeUp">
{/* Hero */}
          <section className="relative min-h-[75vh] py-24 px-6 text-center border-b border-[#E2E2E2] dark:border-[#444] overflow-hidden hero-banner">
    <div className="absolute inset-0 hero-grad-wyzmind z-0" />
    <div className="absolute inset-0 bg-black/20 z-[1]" />
    {/* Neural network canvas background */}
    <canvas ref={brainCanvasRef} className="absolute inset-0 z-[2] w-full h-full" style={{ opacity: 0.3 }} />
    <div className="relative z-10 pt-32 lg:pt-40">
            <p className="text-[#DF3131] text-[13px] font-heading font-bold tracking-[0.2em] uppercase mb-2">WYZMiND</p>
 <h1 className="text-[1.75rem] sm:text-[2.5rem] md:text-[3.5rem] font-heading font-black tracking-[0.05em] text-white mb-6 sm:mb-8" style={{ lineHeight: 0, overflowWrap: "break-word" }}>
               creative<br />
               <span className="text-[#DF3131]">AI Brain</span>
             </h1>
            <p className="text-white/70 text-[16px] sm:text-lg max-w-2xl mx-auto leading-relaxed">
              The behind-the-scenes engine that keeps WYZ Design running smooth. Automation, client systems, creative tools, built for us, eventually for you.
            </p>
            </div>
          </section>

        {/* Features — dynamic interactive cards */}
        <section className="max-w-[90rem] mx-auto px-6 lg:px-12 py-16">
          <h2 className="text-center font-heading font-black text-[1.5rem] sm:text-[2rem] tracking-[0.05em] text-[#333] dark:text-[#e0e0e0] mb-4">What It Powers</h2>
          <p className="text-center text-[#666] dark:text-[#b0b0b0] text-[16px] mb-12">Click any card to explore what each system actually does</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
              {FEATURES.map((f) => {
                const isActive = activeFeature === f.id;
                return (
                  <div key={f.id}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isActive}
                    aria-label={`${f.title} - ${f.layman}`}
                    onClick={() => setActiveFeature(isActive ? null : f.id)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveFeature(isActive ? null : f.id); } }}
                    style={{ minHeight: "380px" }}
                    className={`relative cursor-pointer transition-all duration-500 rounded-lg overflow-hidden flex flex-col justify-between ${
                      isActive ? "ring-2 ring-[#DF3131] ring-offset-2 dark:ring-offset-[#252528] shadow-2xl shadow-[#DF3131]/20 z-10 bg-white dark:bg-[#252528]" : "bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] hover:-translate-y-1 hover:shadow-lg"
                    }`}>
                    {/* Card content — icon stacked on top of title and description */}
                    <div className="flex flex-col items-center text-center p-7 flex-1 justify-center">
                      <div className="text-4xl mb-4 text-[#DF3131]">
                        {f.icon}
                      </div>
                      <h3 className="font-heading font-bold text-[17px] text-[#333] dark:text-[#e0e0e0] text-center mb-3">
                        {f.title}
                      </h3>
                      <p className="text-[14px] leading-relaxed text-[#666] dark:text-[#b0b0b0] text-center">
                        {f.layman}
                      </p>
                    </div>

                    {/* Expanded detail */}
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      isActive ? "max-h-[600px] opacity-100 border-t border-[#E2E2E2] dark:border-[#444]" : "max-h-0 opacity-0"
                    }`}>
                      <div className="p-5 text-center bg-gray-50 dark:bg-[#1a1a1c]">
                        <p className="text-[#333] dark:text-[#e0e0e0] text-[14px] leading-relaxed">{f.details}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
        </section>

        {/* Stack — interactive tabs */}
        <section className="bg-white dark:bg-[#111] border-y border-[#E2E2E2] dark:border-[#333] py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-black text-[1.5rem] sm:text-[2rem] tracking-[0.05em] .5 text-[#333] dark:text-white text-center mb-4">The Stack</h2>
            <p className="text-[#666] dark:text-white/30 text-[13px] text-center mb-8">Everything we use to build and run WYZ Design, explained like you&apos;re not a programmer</p>

            {/* Category tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {STACK_CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => { setActiveStackCat(cat); setExpandedStack(null); }}
                  className={`px-4 py-2 rounded-full text-[12px] font-bold tracking-[0.08em] uppercase transition-all ${
                    activeStackCat === cat ? "bg-[#DF3131] text-white" : "bg-[#E2E2E2] dark:bg-white/10 text-[#666] dark:text-white/50 hover:bg-[#ccc] dark:hover:bg-white/20 hover:text-[#333] dark:hover:text-white/80"
                  }`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Stack items */}
            <div className="space-y-2">
              {filteredStack.map((item) => {
                const isOpen = expandedStack === item.name;
                return (
                  <div key={item.name}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    aria-label={`${item.name} - ${item.layman}`}
                    onClick={() => setExpandedStack(isOpen ? null : item.name)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpandedStack(isOpen ? null : item.name); } }}
                    className={`cursor-pointer transition-all duration-300 rounded-lg ${
                      isOpen ? "bg-[#E2E2E2] dark:bg-white/15 border border-[#ccc] dark:border-white/30" : "bg-[#F5F5F3] dark:bg-white/5 border border-[#E2E2E2] dark:border-white/10 hover:bg-[#eee] dark:hover:bg-white/10 hover:border-[#ccc] dark:hover:border-white/20"
                    }`}>
                    <div className="px-5 py-3.5 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-[#333] dark:text-white text-[14px] font-heading font-bold tracking-[0.03em] mb-2">{item.name}</p>
                        <p className="text-[#666] dark:text-white/40 text-[12px] mt-0.5">{item.layman}</p>
                      </div>
                      <span className={`text-[#666] dark:text-white/40 text-[14px] transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`}>▼</span>
                    </div>
                    <div className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[200px] opacity-100 pb-4" : "max-h-0 opacity-0"}`}>
                      <div className="px-5 border-t border-[#E2E2E2] dark:border-white/10 pt-3">
                        <p className="text-[#666] dark:text-white/60 text-[13px] leading-relaxed">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="font-heading font-black text-[1.5rem] sm:text-[2rem] tracking-[0.05em] mb-4">Want Systems Built for Your Business?</h2>
          <p className="text-[#666] dark:text-[#b0b0b0] text-[16px] max-w-xl mx-auto mb-8 leading-relaxed">
            WYZMiND infrastructure is currently internal. Custom client systems are available for brands and studios needing AI automation, booking intelligence, and creative workflow tools.
          </p>
          <Link href="/contact" className="inline-block bg-[#DF3131] text-white border-2 border-[#DF3131] px-8 py-4 font-heading font-bold tracking-[0.15em] uppercase text-[14px] hover:bg-[#b82020] hover:border-[#b82020] transition-all">
            Inquire About Systems
          </Link>
        </section>
      </ScrollReveal>
    </main>
  );
}
