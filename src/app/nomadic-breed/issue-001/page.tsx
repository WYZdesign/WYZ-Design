import { Metadata } from "next";
import Link from "next/link";
import { InterviewIcon, PhotoEssayIcon, TransitIcon, PackIcon, ExitWoundsIcon, StatusIcon, FoldIcon, LookbookIcon } from "@/components/magazine/NomadicIcons";

export const metadata: Metadata = {
  title: "Nomadic Breed Issue 001 | A Wild Yet Zealous Publication",
  description:
    "The inaugural issue of Nomadic Breed Magazine. Featuring Nomadic Status Vol. 1, Breed Files from the concrete jungle, In Transit dispatches, Pack Light survival guide, and Exit Wounds poetry. Digital-first, print-ready.",
  alternates: { canonical: "https://www.wyzdesign.com/nomadic-breed/issue-001" },
  openGraph: {
    title: "Nomadic Breed Issue 001",
    description: "The inaugural issue of Nomadic Breed Magazine. Digital-first, print-ready.",
    url: "https://www.wyzdesign.com/nomadic-breed/issue-001",
    siteName: "WYZ Design",
    type: "article",
    images: [{ url: "/images/nomadic-breed/issue-001/cover.jpg", width: 1200, height: 1560 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nomadic Breed Issue 001",
    description: "The inaugural issue of Nomadic Breed Magazine. Digital-first, print-ready.",
    images: ["/images/nomadic-breed/issue-001/cover.jpg"],
  },
};

const ISSUE_001_JSON_LD_STRING = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Periodical",
  name: "Nomadic Breed Issue 001",
  description: "A 2026 independent magazine from WYZ Design, digital-first, documenting the people, places and scenes that move culture.",
  url: "https://www.wyzdesign.com/nomadic-breed/issue-001",
  publisher: { "@type": "Organization", name: "WYZ Design", url: "https://www.wyzdesign.com" },
  datePublished: "2026-01-15",
  issueNumber: 1,
  volumeNumber: "1",
  isPartOf: {
    "@type": "Periodical",
    name: "Nomadic Breed",
  },
});

export default function Issue001Page() {
  const tocItems = [
    { Icon: StatusIcon, title: "Nomadic Status Vol. 1", desc: "Rogue Visionaries - Profiles of emerging underground creatives redefining success." },
    { Icon: PhotoEssayIcon, title: "Breed Files", desc: "Echoes of the Concrete Jungle - Gritty photo essays from the underground." },
    { Icon: TransitIcon, title: "In Transit", desc: "Postcards from the Borderless - Journal entries from artists in motion." },
    { Icon: PackIcon, title: "Pack Light", desc: "Nomad Survival Guide - What's in the bag, kit, playlist, and spiritual toolkit." },
    { Icon: ExitWoundsIcon, title: "Exit Wounds", desc: "Beauty in Ruin - Poetic essays, last words, and breakup letters to old selves." },
    { Icon: InterviewIcon, title: "Breed Talk", desc: "Raw Interviews - Mini conversations with impact players." },
    { Icon: FoldIcon, title: "The Fold", desc: "Community Bulletin - Shoutouts, grant ops, collab calls, resource directory." },
    { Icon: LookbookIcon, title: "Breed Lookbook", desc: "Dying Breed Crew Collection - Seasonal editorial fashion feature." },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Periodical",
          name: "Nomadic Breed Issue 001",
          description: "A 2026 independent magazine from WYZ Design, digital-first, documenting the people, places and scenes that move culture.",
          url: "https://www.wyzdesign.com/nomadic-breed/issue-001",
          publisher: { "@type": "Organization", name: "WYZ Design", url: "https://www.wyzdesign.com" },
          datePublished: "2026-01-15",
          issueNumber: 1,
          volumeNumber: "1",
          isPartOf: {
            "@type": "Periodical",
            name: "Nomadic Breed",
          },
        }) }}
      />
      <main className="pb-20 bg-white dark:bg-[#1C1C1E]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: ISSUE_001_JSON_LD_STRING }}
        />
        <section className="pb-20 bg-white dark:bg-[#1C1C1E]">
          <header className="max-w-4xl mx-auto px-6 pt-16 pb-8 text-center">
            <h1 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] tracking-[0.04em] leading-[0.95] mb-6">
              <span className="text-[#6E6E6E] dark:text-[#888] block">Nomadic Breed</span>
              <span className="text-[#DF3131] block">Issue 001</span>
            </h1>
            <p className="text-[#666] dark:text-[#aaa] text-[16px] leading-relaxed max-w-2xl mx-auto mb-6">
              The inaugural issue of Nomadic Breed Magazine. Digital-first, print-ready.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              <span className="whitespace-nowrap px-2.5 py-1 bg-[#DF3131]/10 text-[#DF3131] text-[11px] font-bold tracking-[0.06em] uppercase rounded-full">
                Vol. 1 · Issue 001
              </span>
              <span className="whitespace-nowrap px-2.5 py-1 bg-[#6E6E6E]/10 text-[#6E6E6E] text-[11px] font-bold tracking-[0.06em] uppercase rounded-full">
                Jan 2026
              </span>
              <span className="whitespace-nowrap px-2.5 py-1 bg-[#C9A227]/10 text-[#8C6A1D] text-[11px] font-bold tracking-[0.06em] uppercase rounded-full">
                16 Pages
              </span>
            </div>
          </header>
        </section>

        {/* Magazine Flipbook */}
        <section className="max-w-5xl mx-auto px-6 pb-12 pt-6">
          <div
            className="relative aspect-[2/3] max-w-[800px] mx-auto rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="h-full flex items-center justify-center bg-[#111]">
                <span className="text-white/50 text-[14px] font-bold tracking-[0.1em] uppercase">
                  Magazine Flipbook Preview
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Issue Details & TOC */}
        <section className="max-w-4xl mx-auto px-6 pb-16 border-t border-[#E2E2E2] dark:border-[#333] pt-12">
          <h2 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[1.5rem] lg:text-[2rem] tracking-[0.04em] mb-8 text-center">
            What's Inside Issue 001
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {tocItems.map((item, i) => {
              const Icon = item.Icon;
              return (
                <div key={i} className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] rounded-2xl p-6 hover:border-[#DF3131]/30 hover:-translate-y-1 transition-all flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#6E6E6E]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#6E6E6E]" />
                  </div>
                  <h3 className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] text-[1.1rem] tracking-[0.03em] mb-2">{item.title}</h3>
                  <p className="text-[#666] dark:text-[#aaa] text-[14px] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Navigation */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-[#666] dark:text-[#666] text-[14px] hover:text-[#DF3131] transition-colors">
            ← Back to Site
          </Link>
        </div>
      </main>
    </>
  );
}
