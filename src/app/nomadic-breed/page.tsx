import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { InterviewIcon, PhotoEssayIcon, ProcessIcon, StatusIcon } from "@/components/magazine/NomadicIcons";

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
  { Icon: InterviewIcon, title: "Long-Form Interviews", desc: "Artists, builders, and organizers on how the work actually gets made. The decisions, the dead ends, and the parts nobody puts in a press release." },
  { Icon: PhotoEssayIcon, title: "Photo Essays", desc: "Full shoots from the archive, sequenced as stories instead of a grid of highlights. One body of work, told properly." },
  { Icon: ProcessIcon, title: "Process Documentation", desc: "The brief, the references, the revisions and the reasoning. Documentation of the process, not just the final image." },
  { Icon: StatusIcon, title: "Nomadic Status", desc: "A recurring editorial spotlight on one person or crew per issue: where they are, what they are building, and what comes next." },
];

const issues = [
  {
    number: 1,
    volume: "Vol. 1",
    title: "Nomadic Breed Issue 001",
    subtitle: "A Wild Yet Zealous Publication",
    publishDate: "2026-01-15",
    pageCount: 16,
    coverImage: "/images/nomadic-breed/issue-001/cover.jpg",
    description: "The inaugural issue. Featuring Nomadic Status Vol. 1, Breed Files from the concrete jungle, In Transit dispatches, Pack Light survival guide, and Exit Wounds poetry.",
    tagline: "A Wild Yet Zealous Publication",
    price: "Free Digital / $15 Print",
    featured: true,
  },
];

export default function NomadicBreedPage({ asSection = false }: { asSection?: boolean } = {}) {
  const currentIssue = issues[0];

  const sectionCards = sections.map((s) => {
    const Icon = s.Icon;
    return (
      <Link
        key={s.title}
        href={`/nomadic-breed/category/${s.title.toLowerCase().replace(/\s+/g, "-")}`}
        className="group block h-full"
      >
        <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center bg-white dark:bg-[#252528] p-8 hover:bg-[#DF3131]/[0.04] dark:hover:bg-[#DF3131]/10 transition-colors">
          <div className="w-14 h-14 rounded-full bg-[#6E6E6E]/10 flex items-center justify-center mb-5 group-hover:bg-[#DF3131]/10 transition-colors">
            <Icon className="w-7 h-7 text-[#6E6E6E] group-hover:text-[#DF3131] transition-colors" />
          </div>
          <h3 className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] text-[1.1rem] tracking-[0.03em] mb-3">{s.title}</h3>
          <p className="text-[#666] dark:text-[#666] text-[14px] leading-relaxed">{s.desc}</p>
        </div>
      </Link>
    );
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="pb-20 bg-white dark:bg-[#1C1C1E]">

        {/* Banner: plain white, fully centered, no cover background */}
        <section className="relative bg-white dark:bg-[#1C1C1E] border-b border-[#E2E2E2] dark:border-[#333]">
          <div className="max-w-4xl mx-auto px-6 py-14 sm:py-20 flex flex-col items-center justify-center text-center">
            <div className="flex flex-nowrap items-center justify-center gap-1.5 mb-5">
              <span className="whitespace-nowrap px-2 py-0.5 bg-[#DF3131]/10 text-[#DF3131] text-[9px] sm:text-[10px] font-bold tracking-[0.06em] uppercase rounded-full">
                Vol. 1 · Issue 001
              </span>
              <span className="whitespace-nowrap px-2 py-0.5 bg-[#6E6E6E]/10 text-[#6E6E6E] text-[9px] sm:text-[10px] font-bold tracking-[0.06em] uppercase rounded-full">
                Jan 2026
              </span>
              <span className="whitespace-nowrap px-2 py-0.5 bg-[#C9A227]/10 text-[#8C6A1D] text-[9px] sm:text-[10px] font-bold tracking-[0.06em] uppercase rounded-full">
                16 Pages
              </span>
            </div>
            {asSection ? (
              <h2 className="font-heading font-black text-[#333] dark:text-white text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] tracking-[0.04em] leading-[0.95] mb-4 text-center">
                <span className="text-[#6E6E6E] dark:text-[#888] block">Nomadic Breed</span>
                <span className="text-[#DF3131] block">Issue 001</span>
              </h2>
            ) : (
              <h1 className="font-heading font-black text-[#333] dark:text-white text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] tracking-[0.04em] leading-[0.95] mb-4 text-center">
                <span className="text-[#6E6E6E] dark:text-[#888] block">Nomadic Breed</span>
                <span className="text-[#DF3131] block">Issue 001</span>
              </h1>
            )}
            <p className="text-[#666] dark:text-white/70 text-[16px] sm:text-[18px] leading-relaxed max-w-2xl mx-auto mb-8 text-center">
              The inaugural issue of Nomadic Breed Magazine. Digital-first, print-ready.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/nomadic-breed/issue-001"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#DF3131] text-white font-heading font-bold text-[14px] tracking-[0.08em] uppercase hover:bg-[#B82020] transition-all"
              >
                Read Issue 001 <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Cover preview: full dimensions, not cropped */}
        <section className="max-w-5xl mx-auto px-6 pb-4 pt-12 sm:pt-16 z-10 relative">
          <div className="mx-auto w-full max-w-[340px] sm:max-w-[420px]">
            <Image
              src={currentIssue.coverImage}
              alt="Nomadic Breed Issue 001 cover"
              width={1200}
              height={1800}
              sizes="(max-width: 640px) 80vw, 420px"
              className="w-full h-auto object-contain rounded-xl shadow-2xl"
            />
          </div>
        </section>

        {/* What is Nomadic Breed */}
        <section className="max-w-4xl mx-auto px-6 section-gap text-center">
          <h2 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[1.8rem] lg:text-[2.2rem] tracking-[0.04em] mb-6">
            The <span className="text-[#6E6E6E] dark:text-[#888]">Magazine</span>
          </h2>
          <p className="text-[#666] dark:text-[#666] text-[16px] leading-relaxed max-w-2xl mx-auto mb-8">
            Nomadic Breed is an independent magazine published under WYZ Design. Founded in January 2022
            alongside the agency, it is digital-first with print to follow, and it is built around one idea:
            document the people and scenes that move culture, properly and on the record.
          </p>
        </section>

        {/* What's Inside - Section Cards */}
        <section className="pb-20">
          <h3 className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] text-[1.1rem] tracking-[0.12em] uppercase text-center mb-8 px-6">
            What&apos;s Inside Every Issue
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E2E2E2] dark:bg-[#333] border-y border-[#E2E2E2] dark:border-[#333]">
            {sectionCards}
          </div>
        </section>

        {/* Issues Archive */}
        <section className="max-w-5xl mx-auto px-6 pb-20 border-t border-[#E2E2E2] dark:border-[#333] pt-12">
          <h2 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[1.5rem] lg:text-[2rem] tracking-[0.04em] mb-8 text-center">
            Issues Archive
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <Link key={issue.number} href={`/nomadic-breed/issue-${issue.number.toString().padStart(3, "0")}`} className="group block">
                <div className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] rounded-2xl overflow-hidden hover:border-[#DF3131]/30 hover:-translate-y-1 transition-all">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <Image
                      src={issue.coverImage}
                      alt={issue.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    {issue.featured && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-[#DF3131] text-white text-[10px] font-bold tracking-[0.1em] uppercase rounded">
                          Featured
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-1">
                      <span className="whitespace-nowrap px-2 py-1 bg-black/70 text-white text-[10px] font-bold tracking-[0.1em] uppercase rounded">
                        {issue.volume} · Issue {issue.number.toString().padStart(3, "0")}
                      </span>
                      <span className="whitespace-nowrap px-2 py-1 bg-black/70 text-white text-[10px] font-bold tracking-[0.05em] rounded">
                        {issue.pageCount} Pages
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-black text-[#333] dark:text-white text-[1.1rem] tracking-[0.03em] mb-2 group-hover:text-[#DF3131] transition-colors">
                      {issue.title}
                    </h3>
                    <p className="text-[#666] dark:text-[#aaa] text-[13px] leading-relaxed mb-3 line-clamp-2">{issue.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold tracking-[0.1em] uppercase">
                      <span className="px-2 py-0.5 bg-[#DF3131]/10 text-[#DF3131] rounded">Digital-First</span>
                      <span className="px-2 py-0.5 bg-[#6E6E6E]/10 text-[#6E6E6E] rounded">Print-Ready</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {[0, 1].map((i) => (
              <div key={`placeholder-${i}`} className="bg-white dark:bg-[#252528] border border-dashed border-[#E2E2E2] dark:border-[#333] rounded-2xl overflow-hidden">
                <div className="relative aspect-[2/3] flex items-center justify-center bg-[#F5F5F3] dark:bg-[#1C1C1E]">
                  <span className="px-2 py-1 text-[10px] font-bold tracking-[0.1em] uppercase text-[#999] dark:text-[#666]">
                    Coming Soon
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-black text-[#999] dark:text-[#666] text-[1.1rem] tracking-[0.03em] mb-2">
                    Issue {`00${i + 2}`}
                  </h3>
                  <p className="text-[#999] dark:text-[#666] text-[13px] leading-relaxed">In the works.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div className="bg-[#0A0A0A] rounded-2xl p-6 sm:p-8 lg:p-10 text-center">
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
    </>
  );
}
