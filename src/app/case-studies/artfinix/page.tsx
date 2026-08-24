"use client";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import SocialShare from "@/components/SocialShare";

export default function ArtfinixCaseStudy() {
  return (
    <main className="bg-white dark:bg-[#111] min-h-screen pb-20">
      <ScrollReveal animation="fadeUp">
        <section className="bg-[#1a1a2e] text-white py-24 px-6 text-center">
          <p className="text-[#e94560] text-[13px] font-heading font-bold tracking-[0.2em] uppercase mb-2">Case Study</p>
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] font-heading font-black tracking-[0.05em] mb-6 sm:mb-8">
            ART<span className="text-[#e94560]">FINIX</span>
          </h1>
          <p className="text-white/60 text-[16px] sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Commercial strategy, promotional content, photography, and visual storytelling for a youth arts organization built on community service and mentorship.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { label: "Client", value: "Artfinix Foundation" },
              { label: "Scope", value: "Commercial Strategy + Visual Content" },
              { label: "Focus", value: "Youth Arts + Community Mentorship" },
            ].map(s => (
              <div key={s.label} className="border border-[#E2E2E2] dark:border-[#444] p-6">
                <p className="text-[11px] font-heading font-bold tracking-[0.15em] uppercase text-[#888] dark:text-[#666] mb-2">{s.label}</p>
                <p className="text-[14px] text-[#333] dark:text-[#e0e0e0]">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <SocialShare title="Artfinix Foundation Case Study" url="https://www.wyzdesign.com/case-studies/artfinix" description="Commercial strategy, promotional content, photography, and visual storytelling for a youth arts organization." />
          </div>

          <div className="space-y-6 text-[15px] text-[#666] dark:text-[#888] leading-relaxed mb-12">
            <p>Artfinix is a youth arts foundation focused on community service and mentorship. They needed more than a promo video. They needed a full narrative strategy that translated their mission into content that moved people: parents, donors, students, and the community.</p>
            <p>WYZ Design developed the commercial blueprint, planned the shoot structure, captured b-roll of performances and student practice sessions, and designed the visual storytelling arc around emotional connection and mission clarity.</p>
          </div>

          <h2 className="font-heading font-black text-[1.5rem] text-[#333] dark:text-[#e0e0e0] tracking-[0.05em] mb-4">Strategy & Deliverables</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {[
              { title: "Student Interviews", desc: "On camera testimonials from students and parents vouching for the program's impact." },
              { title: "Performance B-Roll", desc: "Captured practice sessions, performances, and behind the scenes moments at the studio." },
              { title: "Mission Narrative", desc: "Developed story arc connecting community service, mentorship, and artistic growth." },
              { title: "Commercial Blueprint", desc: "Full production plan with emotional beats, audience targeting, and testing strategy." },
              { title: "Photography Suite", desc: "Event photos, student portraits, and environmental shots for web and social use." },
              { title: "Iteration Strategy", desc: "Plan for testing audience response and refining future commercials based on data." },
            ].map(d => (
              <div key={d.title} className="bg-[#F5F5F3] dark:bg-[#2b2b2e] p-6">
                <h3 className="font-heading font-bold text-[15px] text-[#333] dark:text-[#e0e0e0] mb-3">{d.title}</h3>
                <p className="text-[14px] text-[#666] dark:text-[#888]">{d.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center bg-[#F5F5F3] dark:bg-[#2b2b2e] p-12">
            <p className="text-[#666] dark:text-[#888] text-[15px] italic mb-6 max-w-xl mx-auto leading-relaxed">
              This project shows WYZ Design is not just a content production shop. It is a strategic creative partner that translates mission into visual narrative.
            </p>
            <Link href="/contact" className="inline-block border-2 border-[#333] dark:border-[#e0e0e0] text-[#333] dark:text-[#e0e0e0] px-8 py-4 font-heading font-bold tracking-[0.15em] uppercase text-[14px] hover:bg-[#333] hover:text-white dark:hover:bg-[#e0e0e0] dark:hover:text-[#111] transition-all">
              Start Your Project
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
