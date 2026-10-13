"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { logger } from "@/lib/logger";
import { sanitizeHtml } from "@/lib/dompurify";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import FDDriveBrowser from "@/components/FDDriveBrowser";
import FDCalendar from "@/components/FDCalendar";
import { useModalA11y } from "@/hooks/useModalA11y";
import { FiClock, FiMapPin, FiVideo, FiImage, FiFileText, FiFolder } from "react-icons/fi";
import { LA_STUDIOS, PROMPTS, BUILDINGS, FD_EVENTS } from "@/lib/data/fd";

const LOCAL_API = process.env.NEXT_PUBLIC_FD_API || "http://localhost:8080";
const POLL_INTERVAL = 3000;
const MAX_POLLS = 160;

interface Message {
  role: "user" | "assistant" | "system" | "error";
  content: string;
}

export default function FDOraclePage() {
  const [apiUrl, setApiUrl] = useState(LOCAL_API);
  const [online, setOnline] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [jobStatus, setJobStatus] = useState("");
  const [activeStudio, setActiveStudio] = useState<string | null>(null);
  const [activeBuilding, setActiveBuilding] = useState(BUILDINGS[0]);
  const [eventTab, setEventTab] = useState<"all" | "LA" | "NY">("all");
  const [selectedEvent, setSelectedEvent] = useState<typeof FD_EVENTS[0] | null>(null);
  const [showApiSettings, setShowApiSettings] = useState(false);

  useModalA11y(() => setSelectedEvent(null), { lockScroll: true, active: selectedEvent !== null });
  const chatRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollDown = () => setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }), 100);

  const checkHealth = useCallback(async () => {
    // Try local bridge API
    try {
      const r = await fetch(`${LOCAL_API}/fd/health`, { signal: AbortSignal.timeout(2000) });
      const d = await r.json();
      if (d.status === "online") { setOnline(true); return; }
    } catch (e) { logger.warn("fd-page", `Local health check failed: ${e}`); }

    // Fall back to cloud Oracle
    try {
      const r = await fetch("/api/fd/oracle", { signal: AbortSignal.timeout(5000) });
      const d = await r.json();
      setOnline(d.status === "online");
    } catch { setOnline(false); }
  }, []);

  useEffect(() => { checkHealth(); }, [checkHealth]);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const addMsg = (role: Message["role"], content: string) => { setMessages(prev => [...prev, { role, content }]); scrollDown(); };

  const sendMessage = async (msg?: string) => {
    const text = msg || input.trim();
    if (!text || generating) return;
    setGenerating(true); setInput(""); setJobStatus("Thinking...");
    addMsg("user", text);

    // Try local API first, fall back to cloud Oracle
    try {
      const r = await fetch(`${apiUrl}/fd/health`, { signal: AbortSignal.timeout(3000) });
      if (r.ok) {
        setJobStatus("Contacting Oracle...");
        const chatR = await fetch(`${apiUrl}/fd/chat`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, message: text }),
          signal: AbortSignal.timeout(10000),
        });
        const d = await chatR.json();
        setSessionId(d.session_id);
        let attempts = 0;
        setJobStatus("Generating ideas...");
        pollRef.current = setInterval(async () => {
          attempts++;
          try {
            const jr = await fetch(`${apiUrl}/fd/job/${d.job_id}`, { signal: AbortSignal.timeout(5000) });
            const job = await jr.json();
            if (job.status === "done") { clearInterval(pollRef.current!); setJobStatus(""); setGenerating(false); addMsg("assistant", job.response); }
            else if (job.status === "error") { clearInterval(pollRef.current!); setJobStatus(""); setGenerating(false); addMsg("error", job.error || "Generation failed"); }
            else if (attempts >= MAX_POLLS) { clearInterval(pollRef.current!); setJobStatus(""); setGenerating(false); addMsg("error", "Timed out."); }
          } catch { clearInterval(pollRef.current!); setJobStatus(""); setGenerating(false); addMsg("error", "Lost connection."); }
        }, POLL_INTERVAL);
        return;
      }
    } catch (e) { logger.warn("fd-page", `Local chat API failed, falling back to cloud: ${e}`); }

    // Cloud fallback
    setJobStatus("Oracle (cloud)...");
    try {
      const r = await fetch("/api/fd/oracle", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: text }),
        signal: AbortSignal.timeout(35000),
      });
      const d = await r.json();
      if (d.error) { setGenerating(false); setJobStatus(""); addMsg("error", d.error); }
      else { setSessionId(d.session_id); setGenerating(false); setJobStatus(""); addMsg("assistant", d.response); }
    } catch { setGenerating(false); setJobStatus(""); addMsg("error", "Oracle unavailable. Add OPENROUTER_API_KEY to Vercel env."); }
  };

  const formatContent = (text: string) => {
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\[ANALYST\]/gi, '<div class="flex items-center gap-2 mt-4 mb-2"><span class="w-2 h-2 rounded-full bg-[#DF3131]"></span><span class="text-[#C9A227] font-bold text-xs tracking-wider">ANALYST</span></div>')
      .replace(/\[MUSE\]/gi, '<div class="flex items-center gap-2 mt-4 mb-2"><span class="w-2 h-2 rounded-full bg-purple-500"></span><span class="text-purple-400 font-bold text-xs tracking-wider">MUSE</span></div>')
      .replace(/\n/g, "<br>");
    return sanitizeHtml(formatted);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ═══ HERO - ORACLE GENERATOR ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 25% 50%, rgba(223,49,49,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(139,92,246,0.2) 0%, transparent 50%)" }} />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/70 text-sm mb-4">
                <span>FD Photo Studio LA  ·  AI Event Intelligence</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-white tracking-tight mb-6 sm:mb-8">
                FD <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF3131] to-[#F9AD4D]">ORACLE</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 mt-3 max-w-2xl mx-auto">
                Event brainstorm engine. Describe what you want, get eccentric, profitable, shoot-ready concepts using FD&apos;s 37 LA stages.
              </p>
            </div>
          </motion.div>

          {/* Chat */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              <div ref={chatRef} className="h-80 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-md">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#DF3131] to-[#F9AD4D] flex items-center justify-center text-2xl">FD</div>
                      <p className="text-zinc-400 text-sm mb-6">The Oracle knows all 37 LA stages, your past events, and what sells. Start a conversation or use a prompt below.</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {PROMPTS.slice(0, 4).map(p => (
                          <button key={p.label} onClick={() => setInput(p.prompt)} className="px-3 py-1.5 text-xs rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all">
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`p-4 rounded-xl text-sm border-l-4 ${m.role === "user" ? "bg-amber-500/10 border-amber-500 ml-8" : m.role === "assistant" ? "bg-zinc-800/50 border-[#DF3131]" : m.role === "error" ? "bg-red-500/10 border-red-500" : "bg-zinc-800/50 border-zinc-600"}`}>
                    {m.role !== "user" && <div className="text-xs font-bold mb-1 text-zinc-500 uppercase tracking-wider">{m.role === "assistant" ? "Oracle" : m.role}</div>}
                    <div className="text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatContent(m.content) }} />
                  </div>
                ))}
                {generating && (
                  <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-[#DF3131] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-[#DF3131] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-[#DF3131] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-zinc-500 text-sm">{jobStatus}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Prompt Buttons */}
              <div className="px-4 py-3 border-t border-zinc-800 flex flex-wrap gap-2">
                {PROMPTS.map(p => (
                  <button key={p.label} onClick={() => setInput(p.prompt)} className="px-3 py-1.5 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 transition-all">
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Describe the event you want... (e.g., '3 ideas using Olympic underwater and Hill rain room')"
                    className="flex-1 min-w-0 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#DF3131] transition-all text-sm"
                    disabled={generating} />
                  <button onClick={() => sendMessage()} disabled={generating || !input.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-[#DF3131] to-[#B82020] hover:from-[#B82020] hover:to-[#DF3131] text-white font-bold rounded-xl disabled:opacity-50 transition-all flex items-center gap-2">
                    Generate
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${online ? "bg-green-500" : "bg-yellow-500"} ${online ? "" : "animate-pulse"}`} />
                    <span className="text-xs text-zinc-600">{online ? "Oracle Online" : "Oracle (cloud standby)"}</span>
                  </div>
                  <button onClick={() => setShowApiSettings(!showApiSettings)} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Settings</button>
                </div>
                {showApiSettings && (
                  <div className="mt-3 flex gap-2">
                    <input type="text" value={apiUrl} onChange={e => setApiUrl(e.target.value)}
                      className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400 focus:outline-none focus:border-zinc-600" placeholder="API URL" />
                    <button onClick={() => checkHealth()}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs rounded-lg text-zinc-400 transition-all">Connect</button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ STUDIO EXPLORER ═══ */}
      <section className="section-gap px-4 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">LA STUDIOS <span className="text-[#DF3131]">EXPLORER</span></h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">37 stages across 6 LA buildings. Select a building to browse its unique studios.</p>
            </div>
          </ScrollReveal>

          {/* Building Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {BUILDINGS.map((b) => {
              const count = LA_STUDIOS.filter(s => s.building === b).length;
              return (
                <button key={b} onClick={() => setActiveBuilding(b)}
                  className={`px-5 py-3 text-sm font-bold rounded-lg transition-all uppercase tracking-wider ${activeBuilding === b ? "bg-[#DF3131] text-white shadow-lg shadow-[#DF3131]/20" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-600"}`}
                  style={activeBuilding === b ? { boxShadow: `0 0 30px ${LA_STUDIOS.find(s => s.building === b)?.color}30` } : {}}
                >
                  {b} <span className="text-xs opacity-60 ml-1">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Active Building Header */}
          <div className="mb-8 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
            <p className="text-zinc-400 text-sm">
              <span className="text-white font-bold">{activeBuilding}</span> - {" "}
              {activeBuilding === "Olympic" && "5 premium stages: underwater, car turntable, private jet, cyclorama, industrial bay"}
              {activeBuilding === "Hill" && "8 versatile stages: cyclorama, rain room, mirror array, LED cave, brick, concrete, tile, and more"}
              {activeBuilding === "Yukon" && "5 creative stages: infinity cove, warehouse, water studio, abstract painted, RGB cave room"}
              {activeBuilding === "Art" && "4 fine art spaces: gallery white box, northern light window, theatrical spotlight, geometric minimal"}
              {activeBuilding === "Loft" && "6 lifestyle stages: sun-lit loft, vintage living room, kitchen, bedroom, rooftop deck, distressed walls"}
              {activeBuilding === "Main" && "6 signature stages: cyclorama, concrete, brick gallery, dark set, beige cove, white infinity"}
            </p>
          </div>

          {/* Studio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LA_STUDIOS.filter(s => s.building === activeBuilding).map((studio, i) => (
              <ScrollReveal key={studio.name} animation="scaleIn" delay={i * 0.05}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  onMouseEnter={() => setActiveStudio(studio.name)}
                  onMouseLeave={() => setActiveStudio(null)}
                  className="group relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 cursor-pointer"
                  style={{ boxShadow: activeStudio === studio.name ? `0 0 30px ${studio.color}20` : "none" }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element -- remote studio image from data, not a build asset */}
                    <img src={studio.image} alt={studio.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white mb-3">{studio.name}</h3>
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: `${studio.color}20`, color: studio.color }}>{studio.building}</span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">{studio.feature}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INTERACTIVE CALENDAR ═══ */}
      <section className="section-gap px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">EVENT <span className="text-[#DF3131]">CALENDAR</span></h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Interactive calendar, hover events for preview, click for full details. Filter by city and search.</p>
            </div>
          </ScrollReveal>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {(["all", "LA", "NY"] as const).map(tab => (
              <button key={tab} onClick={() => setEventTab(tab)}
                className={`px-6 py-3 text-sm font-bold rounded-lg transition-all uppercase tracking-wider ${eventTab === tab ? "bg-[#DF3131] text-white" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-600"}`}>
                {tab === "all" ? "All Cities" : tab === "LA" ? "Los Angeles" : "New York"}
              </button>
            ))}
          </div>

          <FDCalendar events={FD_EVENTS} eventTab={eventTab} onEventClick={(e) => setSelectedEvent(e)} />
        </div>
      </section>

      {/* ═══ EVENT LIGHTBOX ═══ */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Event details">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${selectedEvent.status === "upcoming" ? "text-green-400" : "text-zinc-500"}`}>
                    {selectedEvent.status === "upcoming" ? "Upcoming" : "Past Event"}
                  </span>
                  <span className="text-xs text-zinc-500">{selectedEvent.dateLabel}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{selectedEvent.title}</h3>
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
                  <span className="flex items-center gap-1.5"><FiClock className="w-4 h-4 text-zinc-500" /> {selectedEvent.time}</span>
                </div>
                <p className="text-sm text-zinc-400 mb-4 flex items-center gap-1.5"><FiMapPin className="w-4 h-4 shrink-0 text-zinc-500" /> {selectedEvent.location}</p>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Price</p>
                    <p className="text-lg font-bold text-white">{selectedEvent.price}</p>
                  </div>
                  <a href={selectedEvent.url} target="_blank" rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#DF3131] hover:bg-[#B82020] text-white text-sm font-bold rounded-lg transition-all">
                    {selectedEvent.status === "upcoming" ? "Get Tickets" : "View on Eventbrite"}
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-800 bg-zinc-900/50">
                <button onClick={() => {
                  const filtered = FD_EVENTS.filter(e => eventTab === "all" || e.city === eventTab);
                  const idx = filtered.indexOf(selectedEvent);
                  const prev = idx > 0 ? filtered[idx - 1] : filtered[filtered.length - 1];
                  setSelectedEvent(prev);
                }} className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1">← Previous</button>
                <span className="text-xs text-zinc-600">{(() => { const filtered = FD_EVENTS.filter(e => eventTab === "all" || e.city === eventTab); return `${filtered.indexOf(selectedEvent) + 1} / ${filtered.length}`; })()}</span>
                <button onClick={() => {
                  const filtered = FD_EVENTS.filter(e => eventTab === "all" || e.city === eventTab);
                  const idx = filtered.indexOf(selectedEvent);
                  const next = idx < filtered.length - 1 ? filtered[idx + 1] : filtered[0];
                  setSelectedEvent(next);
                }} className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1">Next →</button>
              </div>
              <button onClick={() => setSelectedEvent(null)} aria-label="Close event detail"
                className="absolute top-4 right-4 w-8 h-8 min-w-[44px] min-h-[44px] rounded-full bg-black/50 text-white flex items-center justify-center text-sm hover:bg-black/80 transition-all">✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ GOOGLE DRIVE ARCHIVE ═══ */}
      <section className="section-gap px-4 bg-gradient-to-b from-zinc-950 to-black border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">FD EVENTS <span className="text-[#DF3131]">ARCHIVE</span></h2>
              <p className="text-zinc-400 text-lg max-w-3xl mx-auto">
                Browse the full FD event archive, clips, recap variants, photos, and production files organized by event.
                Everything is accessible to view and download directly from Google Drive.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 text-sm text-zinc-600">
                <span className="flex items-center gap-1.5"><FiVideo className="w-4 h-4" /> Clips &amp; Videos</span>
                <span className="flex items-center gap-1.5"><FiImage className="w-4 h-4" /> Photos &amp; Images</span>
                <span className="flex items-center gap-1.5"><FiFileText className="w-4 h-4" /> Documents</span>
                <span className="flex items-center gap-1.5"><FiFolder className="w-4 h-4" /> Event Folders</span>
              </div>
            </div>
          </ScrollReveal>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 md:p-6">
            <FDDriveBrowser />
          </div>

          <div className="mt-6 text-center">
            <a href="https://drive.google.com/drive/folders/1x4Ya8VMdtt8wfG8jil-V_TxRuaEWht0T"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors">
              <span>Open in Google Drive</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="section-gap px-4 bg-black border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal animation="fadeUp">
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-white mb-4 max-w-[calc(100vw-3rem)] mx-auto">HOW THE <span className="text-[#DF3131]">ORACLE</span> WORKS</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="p-6 rounded-xl border border-[#DF3131]/30 bg-gradient-to-br from-[#DF3131]/10 to-transparent">
                <h3 className="text-[#C9A227] font-bold text-lg mb-3">THE ANALYST</h3>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#DF3131] mt-2 shrink-0" />Checks 82+ past events for redundancy</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#DF3131] mt-2 shrink-0" />Validates pricing and profitability</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#DF3131] mt-2 shrink-0" />Ensures TFP/low-cost model viability</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#DF3131] mt-2 shrink-0" />LA-only unless NY explicitly requested</li>
                </ul>
              </div>
              <div className="p-6 rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent">
                <h3 className="text-purple-400 font-bold text-lg mb-3">THE MUSE</h3>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />Generates never-done-before concepts</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />Uses unique studio features (jet, underwater, RGB cave)</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />Low-setup, high-creative-impact events</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />Mixes studio features across buildings for visual variety</li>
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
