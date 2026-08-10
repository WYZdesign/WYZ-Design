"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiMessageCircle, FiZap, FiDollarSign, FiCamera, FiLayout, FiCalendar, FiPrinter, FiSend, FiHelpCircle, FiArrowRight } from "react-icons/fi";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import TextReveal from "@/components/TextReveal";

const FAQS = [
  { q: "What exactly is a creative design agency?", a: "A creative design agency offers web design, graphic design, marketing, branding, and event curation to help individuals and companies build and promote their brands effectively.", icon: FiZap },
  { q: "What kind of clients does WYZ Design work with?", a: "We work with startup businesses, individual artists, and established companies looking to enhance their brand identity and marketing strategies.", icon: FiSend },
  { q: "How can WYZ Design help me grow my brand?", a: "From web design and marketing strategies to custom printing and 3D sculpting, our team has the expertise to support your brand's success across every channel.", icon: FiZap },
  { q: "Can WYZ Design help me with branding and marketing?", a: "Yes. We develop strong brand identities, create marketing plans, and execute campaigns to help you reach your target audience effectively.", icon: FiLayout },
  { q: "How can WYZ Design assist independent artists?", a: "We offer graphic design, photography, and event curation to help you showcase your work and promote your brand to a wider audience.", icon: FiCamera },
  { q: "What sets WYZ Design apart from other agencies?", a: "We deliver high-quality, personalized services at competitive pricing. Our team has a wide range of skills, allowing us to provide comprehensive support for all your creative and business needs.", icon: FiZap },
  { q: "How does WYZ Design approach web design?", a: "We take a strategic approach, creating sites that are visually appealing and user-friendly, designed around your goals and target audience. Pricing starts at $500 for up to 5 pages.", icon: FiLayout },
  { q: "What custom printing services do you offer?", a: "Business cards, flyers, brochures, stickers, posters, and promotional materials, all custom-designed to reflect your brand's identity. Contact us for pricing details.", icon: FiPrinter },
  { q: "Can WYZ Design help with event planning?", a: "Yes. We create unique, memorable events that promote your brand and engage your audience from concept to execution. Event photography starts at $200.", icon: FiCalendar },
  { q: "How do I get started?", a: "Contact us with your needs and goals. We'll develop a personalized plan of action that meets your unique requirements. Book a free consultation at info@wyzdesign.com.", icon: FiSend },
  { q: "How do you ensure quality and satisfaction?", a: "We work closely with every client, understanding goals and requirements, then deliver personalized solutions that exceed expectations.", icon: FiHelpCircle },
  { q: "Can WYZ Design work with clients remotely?", a: "Absolutely. We have extensive experience working with clients remotely and can serve you anywhere in the world.", icon: FiZap },
];

const CATEGORIES = ["All", "Design", "Marketing", "Events", "Printing", "Getting Started"];

const CATEGORY_MAP: Record<string, number[]> = {
  "Design": [0, 6],
  "Marketing": [3, 5],
  "Events": [8],
  "Printing": [7],
  "Getting Started": [9, 10, 11],
};

const BOT_RESPONSES: Record<string, string> = {
  "services": "We offer photography ($100/hr), graphic design ($75+), videography ($200), web design ($500+), printing, branding, marketing consultations ($50), and full event planning. What interests you most?",
  "photography": "WYZ Design offers professional photography services starting at $100/hr. This includes headshots, event coverage, product photography, and more. Would you like to book a session?",
  "web design": "We build custom websites starting at $500 for up to 5 pages. Our sites are modern, responsive, and optimized for conversions. Want a free consultation?",
  "printing": "We offer custom printing for flyers, stickers, posters, business cards, and more. Upload your design or let us create one for you. Visit our printing page for details!",
  "branding": "Our branding packages include logo design, brand guidelines, color palettes, typography, and marketing collateral. We tailor everything to your vision.",
  "event": "WYZ Design handles event photography, videography, and full event recaps. We've covered concerts, corporate events, and private parties. Want to book us for your next event?",
  "pricing": "Our pricing starts at $100/hr for photography, $500 for web design, and $50 for marketing consultations. We also have monthly subscription plans starting at $250.",
  "price": "Our pricing starts at $100/hr for photography, $500 for web design, and $50 for marketing consultations. We also have monthly subscription plans starting at $250.",
  "cost": "Photography starts at $100/hr, graphic design at $75, videography at $200, web design at $500+, and consultations at $50. Monthly plans from $250.",
  "subscribe": "Our most popular plan is the Starter Pack at $250/month ($725 value). It includes photography, graphic design, and marketing support. Check out /plans for all tiers.",
  "plan": "We have 4 plans: Starter ($250/mo), Business Boost ($500/mo), Pro Plus ($750/mo), and Ultimate Suite ($1,000/mo). Each includes different service combinations.",
  "video": "We offer event videography, recap videos, and promotional content. Our video services start at $200 for event coverage. Want to discuss your project?",
  "retouching": "Photo retouching services range from basic cleanup to advanced professional retouching. Pricing varies based on complexity. Upload your photos to get a quote!",
  "consultation": "We offer free creative consultations, logo consultations ($50), and marketing consultations ($50). Book one at info@wyzdesign.com or call (213) 399-9610.",
  "book": "You can book services through our website or by contacting us at info@wyzdesign.com / (213) 399-9610. Which service are you interested in?",
  "contact": "Reach us at info@wyzdesign.com or call (213) 399-9610. We're based in Los Angeles, CA.",
  "hello": "Hey! I'm the WYZ Design assistant. I can help you with info about our services, pricing, booking, and more. What are you looking for?",
  "hi": "Hi there! Welcome to WYZ Design. How can I help you today?",
  "help": "I can answer questions about our photography, web design, printing, branding, events, pricing, and more. Just ask away!",
  "default": "Great question! For detailed assistance with that, I'd recommend reaching out to our team directly at info@wyzdesign.com or calling (213) 399-9610. Is there anything else I can help with?",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(BOT_RESPONSES)) {
    if (key === "default") continue;
    if (lower.includes(key)) return response;
  }
  return BOT_RESPONSES.default;
}

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hey! I'm the WYZ Design assistant. Ask me anything about our services, pricing, or how to get started." },
  ]);
  const [chatOpen, setChatOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatOpen) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatOpen]);

  const filteredFaqs = FAQS.filter((faq) => {
    const q = faq.q.toLowerCase();
    const a = faq.a.toLowerCase();
    const s = search.toLowerCase();
    if (!s) return activeCategory === "All" || (CATEGORY_MAP[activeCategory]?.includes(FAQS.indexOf(faq)) ?? false);
    const synonyms: Record<string, string[]> = {
      pricing: ["price", "cost", "how much", "rate", "affordable", "expensive", "cheap", "value", "plan", "subscription"],
      cost: ["price", "pricing", "how much", "rate", "affordable"],
      photography: ["photo", "photos", "shoot", "headshot", "camera", "portrait"],
      design: ["graphic", "logo", "brand", "branding", "visual"],
      event: ["events", "party", "concert", "venue", "planning"],
      web: ["website", "site", "online", "digital"],
      printing: ["print", "flyers", "posters", "stickers", "business cards"],
      video: ["videography", "film", "footage", "recording"],
    };
    const expandedTerms = [s];
    for (const [key, syns] of Object.entries(synonyms)) {
      if (s.includes(key)) expandedTerms.push(...syns);
    }
    const matches = expandedTerms.some((term) => q.includes(term) || a.includes(term));
    const matchesCategory = activeCategory === "All" || (CATEGORY_MAP[activeCategory]?.includes(FAQS.indexOf(faq)) ?? false);
    return matches && matchesCategory;
  });

  function handleSend() {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: "bot", text: getBotResponse(userMsg) }]);
    }, 600);
  }

  return (
    <main className="pb-12 bg-white dark:bg-[#1C1C1E]">
      <style>{`
        .faq-item{transition:all .3s ease}
        .faq-item:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.06)}
      `}</style>

      <style>{`
        @keyframes heroGradFaq{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      `}</style>

      <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
        {/* Hero */}
        <ScrollReveal animation="fadeUp" duration={1}>
          <div className="relative overflow-hidden -mx-6 lg:-mx-12 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-[50vh] max-h-[500px]">
              <div className="relative overflow-hidden flex items-center justify-center" style={{background:"linear-gradient(-45deg, rgba(223,49,49,0.8), rgba(26,26,26,0.9), rgba(139,0,0,0.7), rgba(42,42,42,0.85), rgba(223,49,49,0.8))",backgroundSize:"400% 400%",animation:"heroGradFaq 8s ease infinite"}}>
                <video src="/videos/wyz-nav-bg.mp4" muted loop autoPlay playsInline className="hidden lg:block absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#DF3131]/80 to-[#1a1a1a]/90" />
                <div className="relative z-10 text-center px-8">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg mx-auto">
                    <FiHelpCircle className="w-8 h-8 text-[#DF3131]" />
                  </div>
                  <TextReveal text="F.A.Q." className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-white tracking-[0.08em] leading-[1.05] mb-3" tag="h1" />
                  <p className="text-white/70 text-base sm:text-lg max-w-md mx-auto">Simplifying Creative Success, Find answers to everything</p>
                </div>
              </div>
              <div className="hidden lg:flex flex-col items-center justify-center h-full px-10 lg:px-16 text-center bg-white dark:bg-[#1C1C1E]">
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <AnimatedCounter end={12} suffix="+" className="font-heading font-black text-[1.5rem] text-[#333] dark:text-white" labelClassName="text-[11px] text-[#8F8F8F] dark:text-white/50 tracking-[0.1em] uppercase" label="Questions" />
                  <AnimatedCounter end={6} className="font-heading font-black text-[1.5rem] text-[#333] dark:text-white" labelClassName="text-[11px] text-[#8F8F8F] dark:text-white/50 tracking-[0.1em] uppercase" label="Topics" />
                  <div className="text-center">
                    <p className="font-heading font-black text-[1.5rem] text-[#333] dark:text-white">24/7</p>
                    <p className="text-[11px] text-[#8F8F8F] dark:text-white/50 tracking-[0.1em] uppercase">AI Answers</p>
                  </div>
                </div>
                <p className="text-[#666] dark:text-[#b0b0b0] text-[16px] max-w-sm mb-6 leading-relaxed">Can't find what you're looking for? Our AI assistant is always here to help with instant answers.</p>
                <button onClick={() => setChatOpen(true)} className="px-8 py-3 bg-[#DF3131] text-white text-[13px] font-bold tracking-[0.1em] hover:bg-[#B82020] transition-all hover:scale-105 inline-flex items-center gap-2">
                  ASK WYZ AI <FiArrowRight />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Search */}
        <ScrollReveal animation="fadeUp" delay={0.1}>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8F8F8F] w-5 h-5" />
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-5 py-4 border-2 border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#252528] text-[16px] text-[#333] dark:text-[#e0e0e0] placeholder-[#8F8F8F] outline-none focus:border-[#DF3131] transition-all rounded-xl shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* WYZ Design AI Bot */}
        <ScrollReveal animation="scaleIn" delay={0.2}>
          <div className="mt-12 mb-12">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#DF3131] to-[#B82020] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#DF3131]/30 mb-5">
                <FiMessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-heading font-black text-[2rem] sm:text-[2.5rem] md:text-[3rem] tracking-[0.15em] text-[#333] dark:text-[#e0e0e0] uppercase mb-4">
                ASK WYZ AI
              </h2>
              <p className="text-[16px] text-[#8F8F8F] dark:text-[#b0b0b0] max-w-2xl mx-auto">
                Got a question? Our AI assistant knows everything about WYZ Design.
              </p>
            </div>

            <div className="max-w-[52rem] mx-auto border-2 border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#252528] overflow-hidden rounded-2xl shadow-2xl">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-[#DF3131] to-[#B82020] px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-[#DF3131] font-heading font-black text-[14px]">WYZ</span>
                  </div>
                  <div>
                    <p className="text-white font-heading font-bold text-[15px]">WYZ Design AI</p>
                    <p className="text-white/80 text-[12px] flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Always here to help
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setChatOpen(!chatOpen)} 
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-[20px] transition-all hover:scale-110"
                >
                  {chatOpen ? "−" : "+"}
                </button>
              </div>

              {/* Chat Body */}
              <div className={`transition-all duration-500 ${chatOpen ? "h-[450px]" : "h-0"} overflow-hidden`}>
                <div className="h-full flex flex-col bg-gradient-to-b from-[#FFFFFF] to-white dark:from-[#252528] dark:to-[#252528]">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] px-5 py-4 text-[16px] leading-relaxed shadow-md ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-[#DF3131] to-[#B82020] text-white rounded-2xl rounded-br-sm"
                            : "bg-white dark:bg-[#252528] text-[#333] dark:text-[#e0e0e0] rounded-2xl rounded-bl-sm border border-[#E2E2E2] dark:border-[#444]"
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

              {/* Chat Input */}
              <div className="border-t-2 border-[#E2E2E2] dark:border-[#444] p-5 flex gap-3 bg-white dark:bg-[#252528]">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask about services, pricing, booking..."
                      className="flex-1 px-5 py-3 border-2 border-[#E2E2E2] text-[16px] text-[#333] dark:text-[#e0e0e0] dark:bg-[#252528] dark:border-[#444] placeholder-[#8F8F8F] outline-none focus:border-[#DF3131] transition-all rounded-lg"
                    />
                    <button
                      onClick={handleSend}
                      className="px-6 py-3 bg-gradient-to-r from-[#DF3131] to-[#B82020] text-white font-heading font-bold text-[13px] tracking-[0.08em] uppercase hover:shadow-lg transition-all rounded-lg hover:scale-105"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>

              {/* Collapsed quick actions */}
              {!chatOpen && (
                <div className="px-6 py-5 flex flex-wrap gap-3 bg-gradient-to-b from-[#FFFFFF] to-white dark:from-[#252528] dark:to-[#252528]">
                  {["What services do you offer?", "How much does it cost?", "How do I get started?"].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setChatOpen(true);
                        setChatMessages((prev) => [...prev, { role: "user", text: q }]);
                        setTimeout(() => {
                          setChatMessages((prev) => [...prev, { role: "bot", text: getBotResponse(q) }]);
                        }, 600);
                      }}
                      className="px-4 py-2 text-[12px] border-2 border-[#E2E2E2] dark:border-[#444] text-[#666] dark:text-white/70 hover:border-[#DF3131] hover:text-[#DF3131] transition-all rounded-lg hover:shadow-md hover:scale-105"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* FAQ Accordion */}
        <div className="mt-12 space-y-4">
          {filteredFaqs.length === 0 && (
            <div className="text-center py-16">
              <FiSearch className="w-12 h-12 text-[#E2E2E2] mx-auto mb-4" />
              <p className="text-[#8F8F8F] text-lg">No questions match your search.</p>
              <p className="text-[#8F8F8F] text-sm mt-1">Try different keywords or browse all categories.</p>
            </div>
          )}
          {filteredFaqs.map((faq, i) => {
            const realIndex = FAQS.indexOf(faq);
            const isOpen = open === realIndex;
            const Icon = faq.icon;
            return (
              <ScrollReveal key={realIndex} animation="fadeUp" delay={0.04 * i}>
                <div
                  className={`faq-item border-2 bg-white dark:bg-[#252528] overflow-hidden transition-all duration-300 rounded-xl ${
                    isOpen ? "border-[#DF3131] shadow-lg shadow-[#DF3131]/10" : "border-[#E2E2E2] hover:border-[#DF3131]/50"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : realIndex)}
                    aria-expanded={isOpen}
                    aria-label={faq.q}
                    className="w-full flex items-center gap-4 px-6 py-5 text-left group"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen ? "bg-[#DF3131] text-white" : "bg-white dark:bg-[#252528] text-[#DF3131] border-2 border-[#E2E2E2] dark:border-[#444] group-hover:border-[#DF3131]"
                    }`}>
                      <span className="font-heading font-bold text-[13px]">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                     <span className={`flex-1 min-w-0 font-heading font-bold text-[16px] pr-4 transition-colors leading-snug ${
                       isOpen ? "text-[#DF3131]" : "text-[#333] dark:text-[#e0e0e0] group-hover:text-[#DF3131]"
                     }`}>
                       <span className="faq-marquee">
                         <span className="faq-marquee-inner">{faq.q}</span>
                         <span className="faq-marquee-inner" aria-hidden="true">{faq.q}</span>
                       </span>
                     </span>
                    <span className={`text-xl font-bold shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen ? "bg-[#DF3131] text-white rotate-45" : "bg-white dark:bg-[#252528] text-[#DF3131] border-2 border-[#E2E2E2] dark:border-[#444] group-hover:border-[#DF3131]"
                    }`}>
                      +
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: isOpen ? "400px" : "0", opacity: isOpen ? 1 : 0 }}
                  >
                    <div className="px-6 pb-6 pt-4 border-t-2 border-[#E2E2E2] dark:border-[#444] bg-gradient-to-br from-[#FFFFFF] to-white dark:from-[#252528] dark:to-[#252528]">
                      <p className="text-[16px] text-[#666] dark:text-[#b0b0b0] leading-[1.8]">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </main>
  );
}
