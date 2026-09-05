"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import { FiTwitter, FiFacebook, FiLinkedin, FiLink2, FiCheck } from "react-icons/fi";

const SHARE_URL = "https://wyzdesign.com/case-studies";
const SHARE_TEXT = "Check out WYZ Design case studies - real projects, real results.";

const SOCIAL_SHARE = [
  { name: "Twitter", icon: FiTwitter, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`, color: "hover:text-[#1DA1F2]" },
  { name: "Facebook", icon: FiFacebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`, color: "hover:text-[#1877F2]" },
  { name: "LinkedIn", icon: FiLinkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`, color: "hover:text-[#0A66C2]" },
];

function ShareButton({ href, icon: Icon, name, color }: { href: string; icon: React.ElementType; name: string; color: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Share on ${name}`}
      className={`w-10 h-10 flex items-center justify-center rounded-full border border-[#E2E2E2] dark:border-[#444] text-[#666] dark:text-white/60 transition-all ${color} hover:border-current hover:scale-110`}
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}

const CASE_STUDIES = [
  {
    slug: "artfinix",
    title: "Artfinix Foundation",
    tag: "Commercial Strategy + Visual Storytelling",
    desc: "Full narrative strategy, commercial blueprint, and visual content for a youth arts organization built on community mentorship.",
    color: "#e94560",
  },
  {
    slug: "kid-bode",
    title: "Kid Bode",
    tag: "Artist Branding + Content Production",
    desc: "Brand identity, photography, video content, and campaign strategy for an emerging music artist.",
    color: "#DF3131",
  },
  {
    slug: "gft-foods",
    title: "GFT Foods",
    tag: "Rebrand + Packaging + Digital Launch",
    desc: "Complete rebrand from local shop to national player: new logo, packaging system, e-commerce site, and social content. 3x inquiry rate in 30 days.",
    color: "#2E7D32",
  },
  {
    slug: "dawneeahs-glow",
    title: "Dawneeah's Glow",
    tag: "Brand Identity + Photography + E-Commerce",
    desc: "Full brand identity, product photography, Shopify build, and social strategy for skincare founder. $180K revenue in first 90 days.",
    color: "#7C4DFF",
  },
];

export default function CaseStudiesIndex() {
  const [linkCopied, setLinkCopied] = useState(false);

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <main className="bg-white dark:bg-[#111] min-h-screen pb-20">
      <ScrollReveal animation="fadeUp">
        <section className="py-20 px-6 text-center pt-32 lg:pt-40">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.05em] mb-6 sm:mb-8">
            CASE <span className="text-[#DF3131]">STUDIES</span>
          </h1>
          <p className="text-[#666] dark:text-[#666] text-[16px] max-w-xl mx-auto leading-relaxed">
            Real projects. Real results. How WYZ Design helps artists, brands, studios, and culture driven businesses turn ideas into execution.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6">
          <div className="space-y-6">
            {CASE_STUDIES.map(cs => (
              <Link key={cs.slug} href={`/case-studies/${cs.slug}`}
                className="block border border-[#E2E2E2] dark:border-[#444] p-8 hover:shadow-lg hover:border-[#DF3131]/30 transition-all group">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <span className="text-[12px] font-heading font-bold tracking-[0.1em] uppercase mb-2" style={{ color: cs.color }}>{cs.tag}</span>
                    <h2 className="text-[20px] sm:text-[24px] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.03em] group-hover:text-[#DF3131] transition-colors mb-4">{cs.title}</h2>
                    <p className="text-[14px] text-[#666] dark:text-[#666] mt-3 max-w-2xl">{cs.desc}</p>
                  </div>
                  <span className="text-[#ccc] dark:text-[#666] group-hover:text-[#DF3131] transition-colors text-[24px] hidden sm:block">→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16 p-12 bg-[#F5F5F3] dark:bg-[#252528]">
            <h2 className="font-heading font-black text-[1.5rem] text-[#333] dark:text-[#e0e0e0] tracking-[0.05em] mb-4">Your Project Here</h2>
            <p className="text-[#666] dark:text-[#666] text-[15px] max-w-lg mx-auto mb-6">Want to be the next case study? Let us build something worth documenting.</p>
            <div className="flex flex-col items-center gap-4">
              <Link href="/contact" className="inline-block bg-[#DF3131] text-white px-10 py-4 font-heading font-bold tracking-[0.15em] uppercase text-[14px] hover:bg-[#B82020] transition-all">
                Start a Project
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-[#666] dark:text-white/40 font-bold tracking-[0.1em] uppercase">Share</span>
                {SOCIAL_SHARE.map(s => (
                  <ShareButton key={s.name} {...s} />
                ))}
                <button
                  onClick={copyShareLink}
                  aria-label={linkCopied ? "Link copied" : "Copy link"}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all hover:scale-110 ${
                    linkCopied
                      ? "border-green-500 text-green-500"
                      : "border-[#E2E2E2] dark:border-[#444] text-[#666] dark:text-white/60 hover:text-[#DF3131] hover:border-[#DF3131]"
                  }`}
                >
                  {linkCopied ? <FiCheck className="w-4 h-4" /> : <FiLink2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
