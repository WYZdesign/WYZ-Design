"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";

interface Message { role: "user" | "assistant"; content: string; }

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! Ask me about WYZ Design services, pricing, or anything else!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const u = input.trim(); setInput(""); setMessages(p => [...p, { role: "user", content: u }]); setLoading(true);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [...messages, { role: "user", content: u }].map(m => ({ role: m.role, content: m.content })) }) });
      const d = await r.json();
      setMessages(p => [...p, { role: "assistant", content: d.reply || "Sorry, try again." }]);
    } catch { setMessages(p => [...p, { role: "assistant", content: "Connection error." }]); }
    finally { setLoading(false); }
  }

  return (<>
    <AnimatePresence>{open && (
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-20 right-4 sm:bottom-20 sm:right-6 z-50 w-[340px] sm:w-[380px] max-w-[calc(100vw-2rem)] bg-white border border-[#E2E2E2] shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E2E2] bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#DF3131] flex items-center justify-center text-white text-xs font-bold">W</div>
            <div><p className="text-sm font-bold text-[#333333]">WYZi Assistant</p><p className="text-[13px] text-[#8F8F8F]">Powered by Ollama</p></div>
          </div>
          <button onClick={() => setOpen(false)} className="text-[#8F8F8F] hover:text-[#333333]"><FiX className="w-5 h-5" /></button>
        </div>
        <div className="h-80 overflow-y-auto p-4 space-y-3 bg-white">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-3 py-2 text-[13px] ${m.role === "user" ? "bg-[#DF3131] text-white" : "bg-gray-100 text-[#333333]"}`}>{m.content}</div>
            </div>
          ))}
          {loading && <div className="text-[#8F8F8F] text-[15px] px-3"><span className="animate-pulse">...</span></div>}
          <div ref={endRef} />
        </div>
        <div className="border-t border-[#E2E2E2] p-3 flex gap-2 bg-white">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask about services, pricing..." className="flex-1 px-3 py-2 border border-[#E2E2E2] text-[13px] text-[#333333] placeholder:text-[#8F8F8F] focus:border-[#DF3131] outline-none" />
          <button onClick={send} disabled={loading || !input.trim()} className="p-2 bg-[#DF3131] hover:bg-[#B82020] text-white disabled:opacity-50 transition-colors"><FiSend className="w-4 h-4" /></button>
        </div>
      </motion.div>
    )}</AnimatePresence>
    <button onClick={() => setOpen(!open)} aria-label={open ? "Close chat" : "Open chat"} className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-[#DF3131] hover:bg-[#B82020] text-white shadow-lg flex items-center justify-center transition-all rounded-full sm:rounded-none">
      {open ? <FiX className="w-5 h-5 sm:w-6 sm:h-6" /> : <FiMessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
    </button>
  </>);
}
