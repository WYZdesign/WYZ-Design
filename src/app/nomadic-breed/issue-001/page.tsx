import { Metadata } from "next";
import Link from "next/link";
import { FiArrowLeft, FiDownload, FiShare2, FiHeart } from "react-icons/fi";

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

const ISSUE_001_JSON_LD = {
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

const issue = {
  issueNumber: 1,
  volume: "Vol. 1",
  title: "Nomadic Breed",
  subtitle: "A Wild Yet Zealous Publication",
  publishDate: "2026-01-15",
  pageCount: 16,
  coverImage: "/images/nomadic-breed/issue-001/cover.jpg",
  description:
    "The inaugural issue of Nomadic Breed Magazine. Featuring Nomadic Status Vol. 1, Breed Files from the concrete jungle, In Transit dispatches, Pack Light survival guide, and Exit Wounds poetry.",
  tagline: "A Wild Yet Zealous Publication",
  price: "Free Digital / $15 Print",
  issn: "TBD",
  publisher: "WYZ Design",
  editor: "Torreé Marcel",
  creativeDirector: "Torreé Marcel",
};

const tocItems = [
  { title: "Nomadic Status Vol. 1", desc: "Rogue Visionaries - Profiles of emerging underground creatives redefining success.", icon: "🔥" },
  { title: "Breed Files", desc: "Echoes of the Concrete Jungle - Gritty photo essays from the underground.", icon: "📸" },
  { title: "In Transit", desc: "Postcards from the Borderless - Journal entries from artists in motion.", icon: "✈️" },
  { title: "Pack Light", desc: "Nomad Survival Guide - What's in the bag, kit, playlist, and spiritual toolkit.", icon: "🎒" },
  { title: "Exit Wounds", desc: "Beauty in Ruin - Poetic essays, last words, and breakup letters to old selves.", icon: "🩸" },
  { title: "Breed Talk", desc: "Raw Interviews - Mini conversations with impact players.", icon: "🎤" },
  { title: "The Fold", desc: "Community Bulletin - Shoutouts, grant ops, collab calls, resource directory.", icon: "📋" },
  { title: "Breed Lookbook", desc: "Dying Breed Crew Collection - Seasonal editorial fashion feature.", icon: "👕" },
];

  export default function Issue001Page() {
  const issue = {
    issueNumber: 1,
    volume: "Vol. 1",
    title: "Nomadic Breed",
    subtitle: "A Wild Yet Zealous Publication",
    publishDate: "2026-01-15",
    pageCount: 16,
    coverImage: "/images/nomadic-breed/issue-001/cover.jpg",
    description:
      "The inaugural issue of Nomadic Breed Magazine. Featuring Nomadic Status Vol. 1, Breed Files from the concrete jungle, In Transit dispatches, Pack Light survival guide, and Exit Wounds poetry.",
    tagline: "A Wild Yet Zealous Publication",
    price: "Free Digital / $15 Print",
    issn: "TBD",
    publisher: "WYZ Design",
    editor: "Torreé Marcel",
    creativeDirector: "Torreé Marcel",
  };

  const tocItems = [
    { title: "Nomadic Status Vol. 1", desc: "Rogue Visionaries - Profiles of emerging underground creatives redefining success.", icon: "🔥" },
    { title: "Breed Files", desc: "Echoes of the Concrete Jungle - Gritty photo essays from the underground.", icon: "📸" },
    { title: "In Transit", desc: "Postcards from the Borderless - Journal entries from artists in motion.", icon: "✈️" },
    { title: "Pack Light", desc: "Nomad Survival Guide - What's in the bag, kit, playlist, and spiritual toolkit.", icon: "🎒" },
    { title: "Exit Wounds", desc: "Beauty in Ruin - Poetic essays, last words, and breakup letters to old selves.", icon: "🩸" },
    { title: "Breed Talk", desc: "Raw Interviews - Mini conversations with impact players.", icon: "🎤" },
    { title: "The Fold", desc: "Community Bulletin - Shoutouts, grant ops, collab calls, resource directory.", icon: "📋" },
    { title: "Breed Lookbook", desc: "Dying Breed Crew Collection - Seasonal editorial fashion feature.", icon: "👕" },
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
            <div className="inline-block px-4 py-1.5 bg-[#DF3131]/10 text-[#DF3131] text-[11px] font-bold tracking-[0.15em] uppercase rounded-full mb-4">
              Issue 001 · Vol. 1
            </div>
            <h1 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] tracking-[0.04em] leading-[0.9] mb-4">
              <span className="text-[#6E6E6E] dark:text-[#888]">Nomadic Breed</span>
              <span className="text-[#DF3131]">Issue 001</span>
            </h1>
            <p className="text-[#666] dark:text-[#aaa] text-[16px] leading-relaxed max-w-2xl mx-auto mb-6">
              The inaugural issue of Nomadic Breed Magazine. Digital-first, print-ready.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <span className="px-3 py-1 bg-[#DF3131]/10 text-[#DF3131] text-[11px] font-bold tracking-[0.1em] uppercase rounded-full">
                Vol. 1 · Issue 001
              </span>
              <span className="px-3 py-1 bg-[#6E6E6E]/10 text-[#6E6E6E] text-[11px] font-bold tracking-[0.1em] uppercase rounded-full">
                Jan 2026
              </span>
              <span className="px-3 py-1 bg-[#C9A227]/10 text-[#8C6A1D] text-[11px] font-bold tracking-[0.1em] uppercase rounded-full">
                16 Pages
              </span>
            </div>
          </header>
        </section>

          {/* Magazine Flipbook */}
          <section className="max-w-5xl mx-auto px-6 pb-12">
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
              {tocItems.map((item, i) => (
                <div key={i} className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] rounded-2xl p-6 hover:border-[#DF3131]/30 hover:-translate-y-1 transition-all">
                  <span className="text-3xl mb-3 block">{item.icon}</span>
                  <h3 className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] text-[1.1rem] tracking-[0.03em] mb-2">{item.title}</h3>
                  <p className="text-[#666] dark:text-[#aaa] text-[14px] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="max-w-4xl mx-auto px-6 pb-16 text-center">
            <div className="bg-[#0A0A0A] rounded-2xl p-6 sm:p-8 lg:p-10">
              <h2 className="font-heading font-black text-white text-[1.5rem] lg:text-[2rem] tracking-[0.04em] mb-4">
                Read the Full Issue
              </h2>
              <p className="text-white/60 text-[15px] mb-6 max-w-lg mx-auto">
                Flip through the full 16-page issue above, or download the PDF for offline reading.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/nomadic-breed/issue-001/download"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#111] font-heading font-bold text-[14px] tracking-[0.08em] uppercase hover:bg-[#DF3131] hover:text-white transition-all"
                >
                  Download PDF
                </a>
                <button
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-heading font-bold text-[14px] tracking-[0.08em] uppercase hover:bg-white hover:text-[#111] transition-all"
                >
                  Share Issue
                </button>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <div className="text-center">
            <Link href="/nomadic-breed" className="inline-flex items-center gap-2 text-[#666] dark:text-[#666] text-[14px] hover:text-[#DF3131] transition-colors">
              ← Back to Magazine
            </Link>
          </div>
        </main>
      </>
    );
}