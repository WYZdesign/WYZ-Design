"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiSearch, FiArrowRight } from "react-icons/fi";

const ALL_PAGES = [
  { title: "Photography", href: "/photography", desc: "Portraits, events, and editorial shoots", tags: ["photo", "camera", "portrait", "event", "headshot"] },
  { title: "Designs", href: "/designs", desc: "Logo design, cover art, flyers, and branding", tags: ["logo", "design", "flyer", "brand", "graphic", "cover art"] },
  { title: "Events", href: "/events", desc: "Event photography and videography", tags: ["event", "party", "concert", "mixer", "live"] },
  { title: "Services", href: "/services", desc: "All creative services offered", tags: ["service", "price", "booking", "consultation"] },
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

function SearchContent() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") || "";
  const [query, setQuery] = useState(initial);
  const [results, setResults] = useState<typeof ALL_PAGES>([]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const matched = ALL_PAGES.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    );
    setResults(matched);
  }, [query]);

  return (
    <main className="pb-16 bg-white dark:bg-[#232326]">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-[#333] dark:text-white tracking-[0.15em] mb-6 sm:mb-8">S E A R C H</h1>
        <div className="relative mb-10">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8F8F8F] w-5 h-5" />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} autoFocus placeholder="Search pages, services, content..."
            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#444] rounded-xl text-[#333] dark:text-white text-lg outline-none focus:border-[#DF3131] transition-colors" />
        </div>
        {query.trim() && (
          <p className="text-[#8F8F8F] text-sm mb-6">{results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;</p>
        )}
        <div className="space-y-3">
          {results.map((r, i) => (
            <Link key={i} href={r.href}
              className="block bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#444] rounded-xl p-5 hover:shadow-md hover:border-[#DF3131]/30 transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-[#333] dark:text-white group-hover:text-[#DF3131] transition-colors mb-3">{r.title}</h3>
                  <p className="text-[#8F8F8F] dark:text-white/50 text-sm mt-0.5">{r.desc}</p>
                </div>
                <FiArrowRight className="text-[#8F8F8F] group-hover:text-[#DF3131] transition-colors shrink-0 ml-4" />
              </div>
            </Link>
          ))}
        </div>
        {query.trim() && results.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#8F8F8F] text-lg mb-2">No results found</p>
            <p className="text-[#8F8F8F] text-sm">Try different keywords or browse our <Link href="/services" className="text-[#DF3131] underline">services</Link></p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="pb-16 bg-white"><div className="max-w-3xl mx-auto px-6 text-center py-20 text-[#8F8F8F]">Loading search...</div></main>}>
      <SearchContent />
    </Suspense>
  );
}