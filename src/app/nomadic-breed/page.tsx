import Link from "next/link";

import { FiArrowRight, FiBookOpen, FiImage, FiEdit3, FiStar } from "react-icons/fi";
import type { IconType } from "react-icons";

const SERVICE_ICONS: Record<string, IconType> = {
  FiBookOpen,
  FiImage,
  FiEdit3,
  FiStar,
};

const SITE = "https://www.wyzdesign.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Periodical",
  name: "Nomadic Breed",
  description: "A 2026 independent magazine from WYZ Design, digital-first, documenting the people, places and scenes that move culture.",
  url: `${SITE}/nomadic-breed`,
  publisher: { "@type": "Organization", name: "WYZ Design", url: SITE },
};

const sections = [
  { icon: "FiBookOpen", title: "Long-Form Interviews", desc: "Artists, builders, and organizers on how the work actually gets made. The decisions, the dead ends, and the parts nobody puts in a press release." },
  { icon: "FiImage", title: "Photo Essays", desc: "Full shoots from the archive, sequenced as stories instead of a grid of highlights. One body of work, told properly." },
  { icon: "FiEdit3", title: "Process Documentation", desc: "The brief, the references, the revisions and the reasoning. Documentation of the process, not just the final image." },
  { icon: "FiStar", title: "Nomadic Status", desc: "A recurring editorial spotlight on one person or crew per issue: where they are, what they are building, and what comes next." },
];

export default function NomadicBreedPage() {
  return (
    <section className="pb-20 bg-white dark:bg-[#1C1C1E]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* The publication */}
      <section className="max-w-4xl mx-auto px-6 section-gap text-center">
        <h2 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[1.8rem] lg:text-[2.2rem] tracking-[0.04em] mb-6">
          The <span className="text-[#6E6E6E]">Magazine</span>
        </h2>
        <p className="text-[#666] dark:text-[#666] text-[16px] leading-relaxed max-w-2xl mx-auto">
          Nomadic Breed is an independent magazine published under WYZ Design. Founded in January 2022
          alongside the agency, it is digital-first with print to follow, and it is built around one idea:
          document the people and scenes that move culture, properly and on the record.
        </p>
      </section>

      {/* What is inside */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h3 className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] text-[1.1rem] tracking-[0.12em] uppercase text-center mb-8">
          What&apos;s Inside
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sections.map((s) => {
            const Icon = SERVICE_ICONS[s.icon] ?? FiBookOpen;
            return (
              <div key={s.title} className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#6E6E6E]/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#6E6E6E]" />
                </div>
                <h3 className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] text-[1.1rem] tracking-[0.03em] mb-3">{s.title}</h3>
                <p className="text-[#666] dark:text-[#666] text-[14px] leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-[#0A0A0A] rounded-2xl p-10 text-center">
          <h2 className="font-heading font-black text-white text-[1.5rem] lg:text-[2rem] tracking-[0.04em] mb-4">
            Pitch It, Shoot It, or Write for It
          </h2>
          <p className="text-white/60 text-[15px] mb-6 max-w-lg mx-auto">
            The magazine runs on contributors: photographers, writers, and the people doing the work.
            If you have a story that belongs in it, start the conversation.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#6E6E6E] text-[#0A0A0A] font-heading font-bold text-[14px] tracking-[0.08em] uppercase hover:bg-[#00CCE6] transition-all">
            Get in Touch <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Back to brands */}
      <div className="text-center">
        <Link href="/brands" className="inline-flex items-center gap-2 text-[#666] dark:text-[#666] text-[14px] hover:text-[#DF3131] transition-colors">
          <FiArrowRight className="w-4 h-4 rotate-180" /> Back to all brands
        </Link>
      </div>
    </section>
  );
}
