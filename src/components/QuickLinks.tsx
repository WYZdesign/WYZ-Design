import Link from "next/link";

const LINKS = [
  { href: "/model-archive", label: "Be a model" },
  { href: "/merch", label: "Merch Store" },
  { href: "/account/my-account", label: "Members" },
  { href: "/service-page/creative-consultation", label: "consultation" },
  { href: "/designs", label: "Designs" },
  { href: "/photography", label: "photography" },
  { href: "/events", label: "DIY events" },
  { href: "/featured-artist", label: "Get featured" },
  { href: "/partnerships", label: "Partnerships" },
  { href: "/plans", label: "SuBSCRIPTIONS" },
  { href: "/gift-card", label: "Gift card" },
  { href: "/model-archive", label: "model archive" },
];

export default function QuickLinks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[115rem] mx-auto px-6 lg:px-12">
        <h2 className="text-2xl font-heading font-bold text-[#333333] tracking-[0.1em] mb-8">QUICK LINKS</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="text-[15px] tracking-[0.08em] text-[#666665] hover:text-[#DF3131] transition-colors py-1.5">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[#E2E2E2]">
          <p className="text-[13px] text-[#666665] tracking-[0.08em]">DIGITAL PRINTING</p>
          <p className="text-[15px] text-[#8F8F8F] mt-1">| FLYERS | STICKERS | POSTERS | PRINTS |</p>
        </div>
      </div>
    </section>
  );
}
