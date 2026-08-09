"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { IoChevronDown } from "react-icons/io5";
import { FiSun, FiMoon, FiSearch } from "react-icons/fi";
import { useTheme } from "@/components/ThemeProvider";

const NAV_LINKS = [
  { href: "/home", label: "H O M E" },
  { href: "/photography", label: "P H O T O G R A P H Y" },
  { href: "/designs", label: "D E S I G N S" },
  { href: "/events", label: "E V E N T S" },
  { href: "/services", label: "S E R V I C E S" },
];

const MORE_LINKS = [
  { href: "/about", label: "A B O U T" },
  { href: "/plans", label: "P L A N S" },
  { href: "/merch", label: "M E R C H" },

  { href: "/wyzmind", label: "W Y Z M i N D" },
  { href: "/printing", label: "P R I N T I N G" },
  { href: "/web-design", label: "W E B . D E S I G N" },

  { href: "/featured-artist", label: "F. A. O. T. M." },
  { href: "/blog", label: "B L O G" },
  { href: "/loyalty", label: "L O Y A L T Y" },
  { href: "/gift-card", label: "G I F T . C A R D" },
  { href: "/contact", label: "C O N T A C T" },
  { href: "/community", label: "C O M M U N I T Y" },
  { href: "/faq", label: "F. A. Q." },
];

const ALL_LINKS = [...NAV_LINKS, ...MORE_LINKS];

const ALL_PAGES = [
  { title: "Photography", href: "/photography", desc: "Portraits, events, and editorial shoots", tags: ["photo", "camera", "portrait", "event", "headshot"] },
  { title: "Designs", href: "/designs", desc: "Logo design, cover art, flyers, and branding", tags: ["logo", "design", "flyer", "brand", "graphic", "cover art"] },
  { title: "Events", href: "/events", desc: "Event photography and videography", tags: ["event", "party", "concert", "mixer", "live"] },
  { title: "Services", href: "/services", desc: "All creative services offered", tags: ["service", "price", "booking", "consultation"] },
  { title: "About", href: "/about", desc: "Our mission, founder, and brands", tags: ["about", "mission", "founder", "torree", "story", "brand"] },
  { title: "Plans & Pricing", href: "/plans", desc: "Subscription plans and à la carte pricing", tags: ["plan", "price", "subscription", "monthly", "package"] },
  { title: "Merch Store", href: "/merch", desc: "Official WYZ Design merchandise", tags: ["merch", "store", "shop", "buy", "tshirt", "hoodie"] },
  { title: "Printing", href: "/printing", desc: "Business cards, flyers, banners, stickers", tags: ["print", "business card", "flyer", "banner", "sticker"] },
  { title: "Web Design", href: "/web-design", desc: "Custom website design and development", tags: ["web", "website", "site", "seo", "online"] },
  { title: "Gift Cards", href: "/gift-card", desc: "Gift cards for any occasion", tags: ["gift", "card", "present", "voucher"] },
  { title: "Booking", href: "/booking", desc: "Book a session or consultation", tags: ["book", "schedule", "appointment", "session"] },
  { title: "FAQ", href: "/faq", desc: "Frequently asked questions", tags: ["faq", "question", "help", "answer", "support"] },
  { title: "Blog", href: "/blog", desc: "News, tips, and behind-the-scenes", tags: ["blog", "news", "post", "article", "update"] },
  { title: "Gallery", href: "/gallery", desc: "Complete portfolio of our work", tags: ["gallery", "portfolio", "collection", "showcase"] },
  { title: "Loyalty Program", href: "/loyalty", desc: "Earn points and unlock rewards", tags: ["loyalty", "rewards", "points", "perks", "vip"] },
  { title: "Featured Artist", href: "/featured-artist", desc: "Artist of the Month spotlight", tags: ["artist", "featured", "spotlight", "monthly"] },
  { title: "Creative Consultation", href: "/service-page/creative-consultation", desc: "Free 30-minute strategy session", tags: ["consultation", "strategy", "free", "session"] },
  { title: "Photoshoot", href: "/service-page/photoshoot", desc: "Professional photoshoot services", tags: ["photoshoot", "photo", "session", "studio"] },
  { title: "Photo Retouching", href: "/service-page/photo-retouching", desc: "Professional photo retouching", tags: ["retouch", "edit", "photo", "polish"] },
  { title: "Event Photography", href: "/service-page/event-photography", desc: "Event coverage and documentation", tags: ["event", "coverage", "documentation"] },
  { title: "Model Archive", href: "/model-archive", desc: "Every talent who has graced our lens", tags: ["model", "talent", "archive", "roster"] },
  { title: "Community", href: "/community", desc: "Community discussions", tags: ["forum", "community", "discussion", "chat"] },
  { title: "Privacy Policy", href: "/privacy-policy", desc: "How we handle your data", tags: ["privacy", "policy", "data", "gdpr"] },
  { title: "Terms & Conditions", href: "/terms-and-conditions", desc: "Terms of service", tags: ["terms", "conditions", "legal"] },
  { title: "My Account", href: "/account/my-account", desc: "Login and account settings", tags: ["account", "login", "register", "profile"] },
];

function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label="Toggle dark mode"
      className={`w-11 h-11 flex items-center justify-center rounded-full border transition-all text-lg ${className || "border-white/30 text-white hover:bg-white/10"}`}>
      {theme === "dark" ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof ALL_PAGES>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  useEffect(() => { document.body.style.overflow = mobileOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [mobileOpen]);
  useEffect(() => { if (!mobileOpen) return; const close = (e: TouchEvent | MouseEvent) => { const target = e.target as HTMLElement; if (!target.closest("[data-more-dropdown]") && !target.closest("[data-more-btn]")) setMoreOpen(false); }; document.addEventListener("touchstart", close); return () => document.removeEventListener("touchstart", close); }, [mobileOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    const matched = ALL_PAGES.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    ).slice(0, 3);
    setSearchResults(matched);
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  if (pathname?.startsWith("/muse")) {
    return (
      <nav className="fixed top-3 left-3 z-50">
        <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:scale-110 active:scale-95 transition-all">
          <Image src="/images/wyz-crown.png" alt="WYZ Design" fill className="w-5 h-5 object-contain" loading="lazy" />
        </Link>
      </nav>
    );
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
        <div className="absolute inset-0 overflow-hidden wyz-red-gradient">
          <video src="/videos/wyz-nav-bg.mp4" className="hidden lg:block absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline preload="metadata" />
          <div className="absolute inset-0 bg-black/15" />
        </div>
        <div className="relative max-w-[115rem] mx-auto pr-8 lg:pr-16">
          <div className="flex items-center h-20 lg:h-24">
            {/* Logo */}
              <Link href="/" className="flex items-center gap-2 shrink-0 relative pl-4 sm:pl-6 lg:pl-0">
                <Image src="/images/wyz-crown.png" alt="WYZ Design" width={70} height={70} className="hover:scale-110 transition-transform" loading="lazy" />
            </Link>

            {/* Nav links */}
            <div className="hidden lg:flex flex-1 items-center justify-evenly px-10">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href}
                  className={`px-4 py-3 text-[14px] tracking-[0.2em] font-semibold whitespace-nowrap transition-all duration-[400ms] ${
                    isActive(l.href) ? "text-white" : "text-white/70 hover:text-white hover:scale-105 active:text-white/80"
                  }`}
                  style={isActive(l.href) ? { textShadow: "0 0 8px rgba(255,255,255,0.8)" } : undefined}>
                  {l.label}
                </Link>
              ))}
              <div className="relative" data-more-dropdown onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
                <button data-more-btn onClick={() => setMoreOpen(!moreOpen)}
                  className={`px-4 py-3 text-[14px] tracking-[0.2em] font-semibold flex items-center gap-1 whitespace-nowrap transition-colors duration-[400ms] ${
                    MORE_LINKS.some(l => isActive(l.href)) ? "text-white" : "text-white/70 hover:text-white active:text-white/80"
                  }`}
                  style={MORE_LINKS.some(l => isActive(l.href)) ? { textShadow: "0 0 8px rgba(255,255,255,0.8)" } : undefined}>
                  M O R E <IoChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 shadow-xl z-50 rounded-lg overflow-hidden"
                      style={{ background: "rgba(0,0,0,0.85)" }}>
                      <div className="absolute inset-0 overflow-hidden wyz-red-gradient">
                        <video src="/videos/wyz-nav-bg.mp4" className="hidden lg:block absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline preload="metadata" />
                        <div className="absolute inset-0 bg-black/15" />
                      </div>
                      <div className="relative z-10">
                        {MORE_LINKS.map((l) => (
                          <Link key={l.href} href={l.href}
                            className={`block px-5 py-3 text-[13px] tracking-[0.15em] font-semibold transition-colors duration-[400ms] ${
                              isActive(l.href) ? "text-white bg-white/10 font-bold" : "text-white/70 hover:text-white hover:bg-white/5 active:text-white/80"
                            }`}>
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Inline Search + Login (desktop) */}
            <div className="hidden lg:flex items-center gap-4 ml-6 shrink-0" ref={searchContainerRef}>
              <div className="relative">
                <AnimatePresence initial={false}>
                  {searchOpen ? (
                    <motion.div key="search-input" initial={{ width: 44 }} animate={{ width: 288 }} exit={{ width: 44 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="relative h-11">
                      <input ref={searchInputRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                        onKeyDown={e => { if (e.key === "Enter") { const q = searchQuery.trim(); if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`; } if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); } }}
                        placeholder="Search..."
                        className="absolute inset-0 w-full pl-4 pr-11 text-[13px] border-[1.5px] border-[#DF3131] rounded-full bg-white text-[#333] placeholder:text-[#999] outline-none transition-colors" />
                      <button onClick={() => { const q = searchQuery.trim(); if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`; }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full text-[#DF3131] hover:bg-[#DF3131]/10 transition-colors">
                        <FiSearch className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {searchFocused && searchResults.length > 0 && (
                          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-[#E2E2E2] overflow-hidden z-50">
                            {searchResults.map((r, i) => (
                              <Link key={i} href={r.href} onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
                                className="flex items-center justify-between px-4 py-3 hover:bg-[#DF3131]/5 transition-colors group border-b border-[#E2E2E2] last:border-b-0">
                                <div>
                                  <p className="text-[13px] font-semibold text-[#333] group-hover:text-[#DF3131] transition-colors">{r.title}</p>
                                  <p className="text-[11px] text-[#8F8F8F] mt-0.5">{r.desc}</p>
                                </div>
                                <FiSearch className="w-3 h-3 text-[#8F8F8F] group-hover:text-[#DF3131] transition-colors shrink-0 ml-3" />
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.button key="search-btn" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                      onClick={() => setSearchOpen(true)}
                      className="w-11 h-11 flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-all">
                      <FiSearch className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              <Link href="/account/my-account" data-kp-light
                className="px-6 py-2 text-[14px] font-semibold tracking-[0.1em] border-[1.5px] border-white rounded-full transition-all bg-white text-[#DF3131] hover:bg-[#DF3131] hover:text-white hover:border-[#DF3131] dark:bg-white dark:text-[#DF3131] dark:hover:bg-[#DF3131] dark:hover:text-white dark:border-white">
                Login
              </Link>
              <ThemeToggle />
            </div>

            <div className="lg:hidden ml-auto flex items-center gap-3">
              <ThemeToggle />
              <button aria-label={mobileOpen ? "Close menu" : "Open menu"} className="p-2 text-white" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white dark:bg-[#1C1C1E] lg:hidden flex flex-col pt-24">
            {/* Mobile search */}
            <div className="px-6 pt-2 pb-4">
              <input type="text" placeholder="Search WYZ..."
                className="w-full px-4 py-3 text-[14px] border border-[#E2E2E2] dark:border-[#333] bg-white dark:bg-[#252528] text-[#333] dark:text-[#e0e0e0] placeholder:text-[#999] focus:border-[#DF3131] outline-none"
                onKeyDown={(e) => { if (e.key === "Enter") { const q = (e.target as HTMLInputElement).value.trim(); if (q) { window.location.href = `/search?q=${encodeURIComponent(q)}`; setMobileOpen(false); } } }} />
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
              {ALL_LINKS.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <Link href={l.href} onClick={() => setMobileOpen(false)}
                    className={`block py-3 text-[15px] tracking-[0.15em] font-semibold ${
                      isActive(l.href) ? "text-[#DF3131]" : "text-[#333333] dark:text-[#e0e0e0] hover:text-[#DF3131]"
                    }`}>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-6 pt-4 border-t-[2px] border-[#E2E2E2] dark:border-[#333] flex items-center justify-between">
                <Link href="/account/my-account" onClick={() => setMobileOpen(false)}
                  className="text-center py-3 px-6 text-[14px] font-semibold border-[1.5px] border-[#DF3131] text-[#DF3131] hover:bg-[#DF3131] hover:text-white rounded-full transition-all dark:bg-[#252528] dark:text-[#DF3131] dark:hover:bg-[#333] dark:hover:text-[#DF3131] dark:border-[#DF3131]">
                  Login
                </Link>
                <ThemeToggle className="border-[#DF3131] text-[#DF3131] dark:border-[#e0e0e0] dark:text-[#e0e0e0] hover:bg-[#DF3131]/10 dark:hover:bg-[#e0e0e0]/10" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
