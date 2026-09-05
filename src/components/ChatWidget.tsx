"use client";

import { useState, useRef, useEffect } from "react";
import { useZeal } from "@/components/ZealProvider";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface WyzChatOpenDetail {
  prefill?: string;
}

const QUICK_REPLIES = [
  "What services do you offer?",
  "Show me pricing plans",
  "I need a photoshoot",
  "Tell me about merch",
];

export default function ChatWidget() {
  const { earn } = useZeal();
  const [isOpen, setIsOpen] = useState(false);
  const [scrollHidden, setScrollHidden] = useState(false);
  // Mirrors the fix in ScrollToTop.tsx: Navbar's mobile menu sets
  // document.body.dataset.mobileOpen reactively off its own state, but that's
  // a plain DOM read with nothing to make THIS component re-render when it
  // changes — without it the chat bubble stayed fully visible/clickable right
  // on top of the open mobile nav panel. A MutationObserver gives this
  // component its own re-render trigger tied to the real DOM change.
  const [bodyLocked, setBodyLocked] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey! I'm the WYZ Design assistant. I can help you learn about our services, check pricing, or get you booked. How can I help today?" },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const handler = () => {
      setScrollHidden(true);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => setScrollHidden(false), 600);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const body = document.body;
    const check = () => setBodyLocked(body.style.overflow === "hidden" || body.dataset.mobileOpen === "true");
    check();
    const observer = new MutationObserver(check);
    observer.observe(body, { attributes: true, attributeFilter: ["style", "data-mobile-open"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onWyzChatOpen = (e: Event) => {
      const detail = (e as CustomEvent<WyzChatOpenDetail>).detail;
      if (detail?.prefill) setInput(detail.prefill);
      if (!isOpen) void earn("open-chat");
      setIsOpen(true);
    };
    window.addEventListener("wyz-chat-open", onWyzChatOpen);
    return () => window.removeEventListener("wyz-chat-open", onWyzChatOpen);
  }, [earn, isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMessage = { role: "user" as const, content: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    // Add empty assistant message
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    // Client-side safety net: the server route now bounds its own Ollama call,
    // but if anything upstream still stalls (slow network, proxy buffering),
    // never leave the widget stuck on "..." with the input disabled forever.
    const controller = new AbortController();
    const watchdog = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: "Sorry, something went wrong. Please try again." };
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        const timedOut = updated[updated.length - 1]?.content === "";
        updated[updated.length - 1] = {
          role: "assistant",
          content: timedOut
            ? "That's taking longer than it should. Please try again, or reach us directly at info@wyzdesign.com."
            : "Sorry, I'm having trouble connecting. Please try again.",
        };
        return updated;
      });
    } finally {
      clearTimeout(watchdog);
    }

    setIsStreaming(false);
  };

  return (
    <>
      {/* Chat Bubble */}
      <button
        onClick={() => { if (!isOpen) void earn("open-chat"); setIsOpen(!isOpen); }}
        className={`fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 ${
          isOpen ? "bg-[#333] rotate-90" : "bg-[#DF3131] animate-pulse"
        } ${!isOpen && (scrollHidden || bodyLocked) ? "opacity-0 pointer-events-none translate-y-2" : ""}`}
        aria-label={isOpen ? "Close chat" : "Open chat assistant"}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[100] w-[360px] max-w-[calc(100vw-3rem)] bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-[#E2E2E2] dark:border-[#333] overflow-hidden flex flex-col" style={{ height: "min(520px, calc(100vh - 8rem))" }}>
          {/* Header */}
          <div className="bg-[#DF3131] px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-heading font-bold text-[14px] tracking-[0.03em]">WYZ Design</p>
              <p className="text-white/60 text-[11px]">AI Assistant</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/60 text-[10px]">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#DF3131] text-white rounded-br-md"
                    : "bg-[#f0f0f0] dark:bg-[#2a2a2a] text-[#333] dark:text-[#e0e0e0] rounded-bl-md"
                }`}>
                  {msg.content}
                  {isStreaming && i === messages.length - 1 && msg.role === "assistant" && (
                    <span className="inline-block w-1.5 h-4 bg-[#DF3131] ml-1 animate-pulse" />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && !isStreaming && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr}
                  onClick={() => sendMessage(qr)}
                  className="px-3 py-1.5 text-[11px] font-bold tracking-[0.03em] bg-white dark:bg-[#2a2a2a] border border-[#E2E2E2] dark:border-[#444] text-[#666] dark:text-[#b0b0b0] rounded-full hover:border-[#DF3131] hover:text-[#DF3131] transition-all"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-[#E2E2E2] dark:border-[#333]">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about services, pricing..."
                aria-label="Type a message"
                disabled={isStreaming}
                className="flex-1 px-4 py-2.5 bg-[#f5f5f5] dark:bg-[#2a2a2a] border border-[#E2E2E2] dark:border-[#444] rounded-full text-[13px] text-[#333] dark:text-[#e0e0e0] placeholder:text-[#757575] focus:border-[#DF3131] outline-none transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="w-10 h-10 bg-[#DF3131] rounded-full flex items-center justify-center text-white hover:bg-[#B82020] transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
