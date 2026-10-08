"""Redesign flip-card fronts (plans, web-design, printing): full-stretched image
+ black/80 overlay + white text. Move badges/hints to card backs (info + pricing).
Adds Image imports and per-card img fields. LF files; anchors asserted unique."""
import sys

EDITS = {}

# ---------------- plans/page.tsx ----------------
P = r"V:\wyzdesign\src\app\plans\page.tsx"
EDITS[P] = [
    # Image import
    ('import Link from "next/link";',
     'import Link from "next/link";\nimport Image from "next/image";'),
    # PLANS img fields
    ('  { name: "Starter Pack", price: "$250", value: "$725 Value", popular: false },',
     '  { name: "Starter Pack", price: "$250", value: "$725 Value", popular: false, img: "/images/services/Photography.webp" },'),
    ('  { name: "Business Boost", price: "$500", value: "$2,025 Value", popular: true },',
     '  { name: "Business Boost", price: "$500", value: "$2,025 Value", popular: true, img: "/images/services/Logo Design.jpg" },'),
    ('  { name: "Pro Plus", price: "$750", value: "$1,425 Value", popular: false },',
     '  { name: "Pro Plus", price: "$750", value: "$1,425 Value", popular: false, img: "/images/services/Video Shoot.jpg" },'),
    ('  { name: "Ultimate Suite", price: "$1,000", value: "$5,000+ Value", popular: false },',
     '  { name: "Ultimate Suite", price: "$1,000", value: "$5,000+ Value", popular: false, img: "/images/services/Website Design.jpg" },'),
    # WEB_ADDONS img fields
    ('  { name: "Startup", original: "$650/mo", discounted: "$500/mo", desc: "Launch your dream business with confidence. Our startup plan offers the essential tools and support you need to succeed." },',
     '  { name: "Startup", original: "$650/mo", discounted: "$500/mo", desc: "Launch your dream business with confidence. Our startup plan offers the essential tools and support you need to succeed.", img: "/images/web-design/site_1.jpg" },'),
    ('  { name: "Artist", original: "$400/mo", discounted: "$250/mo", desc: "Keep it simple. Our subscription plan gives independent artists and brands everything they need to succeed." },',
     '  { name: "Artist", original: "$400/mo", discounted: "$250/mo", desc: "Keep it simple. Our subscription plan gives independent artists and brands everything they need to succeed.", img: "/images/web-design/site_2.jpg" },'),
    ('  { name: "Enterprise", original: "$900/mo", discounted: "$750/mo", desc: "Power up your business with a plan that does it all. Built to help you cut costs, work smarter, and grow." },',
     '  { name: "Enterprise", original: "$900/mo", discounted: "$750/mo", desc: "Power up your business with a plan that does it all. Built to help you cut costs, work smarter, and grow.", img: "/images/web-design/site_3.jpg" },'),
    # PlanCard front -> image + black/80 + white name
    ("""      {/* Front */}
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out`} style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)" }}>
        <div className={`relative bg-white dark:bg-[#252528] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col items-center justify-center ${
          p.popular
            ? "border-[4px] border-[#DF3131] shadow-lg shadow-[#DF3131]/20 scale-[1.03]"
            : "border border-[#E2E2E2] hover:border-[#DF3131]/50"
        }`}>
          {p.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#DF3131] text-white text-[13px] font-bold px-5 py-1.5 tracking-[0.08em] shadow-lg shadow-[#DF3131]/40 z-10">
              Most Popular
            </div>
          )}
          <div className="p-7 text-center flex flex-col items-center justify-center h-full">
            <h3 className="font-heading font-bold text-[#333333] dark:text-[#e0e0e0] text-center mb-3">{p.name}</h3>
            <div className="mt-2 text-center">
              <span className="whitespace-nowrap text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-heading font-black text-[#333333] dark:text-[#e0e0e0]">{p.price}</span>
              <span className="text-[#666] text-sm ml-2">/month</span>
            </div>
            <span className="inline-block mt-1 text-[14px] text-[#DF3131] font-semibold text-center">{p.value}</span>
            <p className="text-[14px] text-[#666] text-center mt-4">Click to flip for full details</p>
          </div>
        </div>
      </div>""",
     """      {/* Front */}
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out`} style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)" }}>
        <div className="relative w-full h-full overflow-hidden border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#DF3131]/10">
          <Image src={p.img} alt={p.name} fill sizes="(max-width:640px) 100vw, 25vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 flex items-center justify-center z-10 px-6 text-center">
            <h3 className="font-heading font-black text-white text-[26px] tracking-[0.06em] text-center drop-shadow-lg uppercase">{p.name}</h3>
          </div>
        </div>
      </div>"""),
    # PlanCard back: add Most Popular badge
    ("""          <div className="relative z-10 text-center">
            <h3 className="font-heading font-black text-white text-[22px] tracking-[0.03em] mb-3">{p.name}</h3>""",
     """          <div className="relative z-10 text-center">
            {p.popular && (
              <div className="inline-block bg-white text-[#DF3131] text-[12px] font-bold px-4 py-1 tracking-[0.08em] mb-3">★ MOST POPULAR</div>
            )}
            <h3 className="font-heading font-black text-white text-[22px] tracking-[0.03em] mb-3">{p.name}</h3>"""),
    # WebAddonCard front -> image + black/80 + white name
    ("""      {/* Front */}
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out`} style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)" }}>
        <div className={`border p-5 bg-white dark:bg-[#252528] text-center transition-all hover:-translate-y-1 hover:shadow-lg h-full ${
          i === 0
            ? "border-[4px] border-[#DF3131] shadow-md shadow-[#DF3131]/20"
            : "border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131]/50"
        }`}>
          {i === 0 && (
            <span className="text-[13px] font-bold text-[#DF3131] tracking-[0.08em] mb-2">Recommended</span>
          )}
          <h3 className="font-heading font-bold text-[#333333] dark:text-[#e0e0e0] text-center mb-3">{w.name}</h3>
          <div className="mt-2 text-center">
            <span className="text-xs text-[#666] dark:text-white/40 line-through">{w.original}</span>{" "}
            <span className="whitespace-nowrap text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-heading font-black text-[#333333] dark:text-white">{w.discounted}</span>
          </div>
          <p className="text-[16px] text-[#666666] dark:text-white/60 mt-2 text-center">{w.desc}</p>
        </div>
      </div>""",
     """      {/* Front */}
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out`} style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)" }}>
        <div className="relative w-full h-full overflow-hidden border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#DF3131]/10">
          <Image src={w.img} alt={w.name} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 flex items-center justify-center z-10 px-6 text-center">
            <h3 className="font-heading font-black text-white text-[24px] tracking-[0.06em] text-center drop-shadow-lg uppercase">{w.name}</h3>
          </div>
        </div>
      </div>"""),
    # WebAddonCard back: add Recommended badge
    ("""          <div className="relative z-10 text-center">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white mb-2">Web Design Add-On</span>""",
     """          <div className="relative z-10 text-center">
            {i === 0 && (
              <div className="inline-block bg-white text-[#DF3131] text-[11px] font-bold px-3 py-1 tracking-[0.1em] mb-2">★ RECOMMENDED</div>
            )}
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white mb-2">Web Design Add-On</span>"""),
]

# ---------------- web-design/page.tsx ----------------
P = r"V:\wyzdesign\src\app\web-design\page.tsx"
EDITS[P] = [
    ('import Link from "next/link";',
     'import Link from "next/link";\nimport Image from "next/image";'),
    # FlipCard signature gains img
    ('function FlipCard({ plan }: { plan: { name: string; price: string; features: string[]; accent: boolean } }) {',
     'function FlipCard({ plan }: { plan: { name: string; price: string; features: string[]; accent: boolean; img: string } }) {'),
    # Plan data img fields
    ('                  { name: "Starter", price: "$499", features: ["1-page landing", "Mobile responsive", "Contact form", "Basic SEO", "7-day delivery"], accent: false },',
     '                  { name: "Starter", price: "$499", features: ["1-page landing", "Mobile responsive", "Contact form", "Basic SEO", "7-day delivery"], accent: false, img: "/images/web-design/site_1.jpg" },'),
    ('                  { name: "Business", price: "$1,299", features: ["Up to 5 pages", "Custom design", "CMS integration", "Advanced SEO", "Analytics setup", "14-day delivery"], accent: true },',
     '                  { name: "Business", price: "$1,299", features: ["Up to 5 pages", "Custom design", "CMS integration", "Advanced SEO", "Analytics setup", "14-day delivery"], accent: true, img: "/images/web-design/site_2.jpg" },'),
    ('                  { name: "E-Commerce", price: "$2,499", features: ["Unlimited products", "Payment processing", "Inventory management", "Custom checkout", "Full SEO suite", "30-day delivery"], accent: false },',
     '                  { name: "E-Commerce", price: "$2,499", features: ["Unlimited products", "Payment processing", "Inventory management", "Custom checkout", "Full SEO suite", "30-day delivery"], accent: false, img: "/images/web-design/site_3.jpg" },'),
    # Front -> image + black/80 + white name
    ("""      {/* Front */}
      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
        <div className={`w-full h-full p-8 text-center flex flex-col items-center justify-center ${plan.accent ? "bg-[#DF3131] text-white shadow-xl shadow-[#DF3131]/30 border-4 border-[#DF3131]" : "bg-white border border-[#E2E2E2] hover:border-[#DF3131] hover:shadow-xl hover:shadow-[#DF3131]/10"}`}>
          {plan.accent && <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#333] dark:bg-[#111] text-white text-[11px] font-bold tracking-[0.1em] px-4 py-1 uppercase mb-2">★ Most Popular</span>}
          <h3 className={`font-heading font-bold text-[18px] tracking-[0.1em] uppercase mb-2 ${plan.accent ? "text-white" : "text-[#333]"}`}>{plan.name}</h3>
          <p className={`text-[2.5rem] font-heading font-black mb-4 ${plan.accent ? "text-white" : "text-[#DF3131]"}`}>{plan.price}</p>
          <p className={`text-[12px] tracking-[0.15em] uppercase ${plan.accent ? "text-white/60" : "text-[#666]"}`}>Tap to see what&apos;s included</p>
        </div>
      </div>""",
     """      {/* Front */}
      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
        <div className="relative w-full h-full overflow-hidden border border-[#E2E2E2] hover:border-[#DF3131] transition-all shadow-sm hover:shadow-xl hover:shadow-[#DF3131]/10">
          <Image src={plan.img} alt={plan.name} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 flex items-center justify-center z-10 px-6 text-center">
            <h3 className="font-heading font-black text-white text-[22px] tracking-[0.1em] uppercase text-center drop-shadow-lg">{plan.name}</h3>
          </div>
        </div>
      </div>"""),
    # Back: Most Popular badge above title
    ("""          <div className="text-center">
            <h3 className={`font-heading font-bold text-[16px] tracking-[0.1em] uppercase mb-1 ${plan.accent ? "text-white" : "text-[#DF3131]"}`}>{plan.name}</h3>""",
     """          <div className="text-center">
            {plan.accent && <span className="inline-block bg-white text-[#DF3131] text-[11px] font-bold tracking-[0.1em] px-4 py-1 uppercase mb-2">★ Most Popular</span>}
            <h3 className={`font-heading font-bold text-[16px] tracking-[0.1em] uppercase mb-1 ${plan.accent ? "text-white" : "text-[#DF3131]"}`}>{plan.name}</h3>"""),
]

# ---------------- printing/page.tsx ----------------
P = r"V:\wyzdesign\src\app\printing\page.tsx"
EDITS[P] = [
    # signature gains img
    ("""function FlipCardInline({ title, subtitle, backTitle, backContent, backNote, backBg, orderLink, orderLabel, orderClass }: {
  title: string; subtitle: string; backTitle: string; backContent: React.ReactNode; backNote: string; backBg: string; orderLink: string; orderLabel: string; orderClass: string;
}) {""",
     """function FlipCardInline({ title, subtitle, img, backTitle, backContent, backNote, backBg, orderLink, orderLabel, orderClass }: {
  title: string; subtitle: string; img: string; backTitle: string; backContent: React.ReactNode; backNote: string; backBg: string; orderLink: string; orderLabel: string; orderClass: string;
}) {"""),
    # front -> image + black/80 + white title + subtitle
    ("""      {/* Front */}
      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
        <div className="border border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#252528] p-8 lg:p-10 text-center hover:border-[#DF3131] transition-all hover:shadow-xl hover:shadow-[#DF3131]/10 h-full flex flex-col justify-center">
          <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.15em] uppercase text-[#333] dark:text-[#e0e0e0] group-hover:text-[#DF3131] transition-colors mb-4">{title}</h2>
          <p className="text-[#DF3131] text-[16px] tracking-[0.1em] uppercase opacity-80 group-hover:opacity-100 transition-opacity">{subtitle}</p>
          <div className="mt-6 flex items-center justify-center gap-2 text-[13px] text-[#666] dark:text-[#aaa]">
            <span>Hover or tap to see pricing</span>
            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>""",
     """      {/* Front */}
      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
        <div className="relative w-full h-full overflow-hidden border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] transition-all hover:shadow-xl hover:shadow-[#DF3131]/10">
          <Image src={img} alt={title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 text-center">
            <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black tracking-[0.15em] uppercase text-white drop-shadow-lg">{title}</h2>
            <p className="text-white/80 text-[15px] tracking-[0.1em] uppercase mt-3">{subtitle}</p>
          </div>
        </div>
      </div>"""),
    # per-card images
    ('    title="VINYL STICKERS"\n    subtitle="Prices based on size, calculated by average inches."',
     '    title="VINYL STICKERS"\n    subtitle="Prices based on size, calculated by average inches."\n    img="/images/printing/die_cut.jpg"'),
    ('    title="PRINTS + POSTERS"\n    subtitle="Prices based on size, calculated by average inches."',
     '    title="PRINTS + POSTERS"\n    subtitle="Prices based on size, calculated by average inches."\n    img="/images/printing/print_1.jpg"'),
    ('    title="BUTTONS"\n    subtitle="Custom pin-back buttons for any occasion."',
     '    title="BUTTONS"\n    subtitle="Custom pin-back buttons for any occasion."\n    img="/images/printing/paper_1.jpg"'),
]

fail = 0
for path, edits in EDITS.items():
    src = open(path, encoding="utf-8", newline="").read()
    for old, new in edits:
        c = src.count(old)
        if c != 1:
            print(f"FAIL {path.split(chr(92))[-1]}: anchor count={c}: {old[:70]!r}")
            fail += 1
            continue
        src = src.replace(old, new, 1)
    open(path, "w", encoding="utf-8", newline="").write(src)
    print(f"OK {path.split(chr(92))[-1]} ({len(edits)} edits)")
sys.exit(1 if fail else 0)
