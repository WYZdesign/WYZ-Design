import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { BRANDS } from "@/lib/brands";

const SITE = "https://www.wyzdesign.com";

export const metadata: Metadata = {
  title: "Our Brands | WYZ Design",
  description: "WYZ Design is the parent of Wild Yet Zealous, Dying Breed Crew, and Nomadic Breed. One creative ecosystem, four brands, built by Torreé Marcel Harris.",
  alternates: { canonical: `${SITE}/brands` },
  openGraph: {
    title: "Our Brands | WYZ Design",
    description: "Wild Yet Zealous, Dying Breed Crew, Nomadic Breed, and WYZ Design. One creative ecosystem built by Torreé Marcel Harris.",
    url: `${SITE}/brands`,
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: `${SITE}/wyz-og-image.png`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Our Brands | WYZ Design", description: "One creative ecosystem, four brands.", images: [`${SITE}/wyz-og-image.png`] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "WYZ Design Brands",
  description: "WYZ Design, Wild Yet Zealous, Dying Breed Crew, and Nomadic Breed. One creative ecosystem built by Torreé Marcel Harris.",
  url: `${SITE}/brands`,
  about: { "@id": `${SITE}/#organization` },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE },
    { "@type": "ListItem", position: 2, name: "Brands", item: `${SITE}/brands` },
  ],
};

export default function BrandsPage() {
  return (
    <main className="pb-20 bg-white dark:bg-[#232326]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
        <div className="text-center pt-16 pb-12">
          <span className="inline-block px-4 py-1.5 bg-[#DF3131]/10 text-[#DF3131] text-[12px] font-bold tracking-[0.15em] uppercase rounded-full mb-4">The Ecosystem</span>
          <h1 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[2rem] sm:text-[2.5rem] lg:text-[3rem] tracking-[0.04em] leading-tight mb-4">
            One Vision. <span className="text-[#DF3131]">Four Brands.</span>
          </h1>
          <p className="text-[#666] dark:text-[#999] text-[16px] lg:text-[18px] max-w-2xl mx-auto leading-relaxed">
            Everything we make lives under one roof. WYZ Design is the company, and these three brands are how that vision shows up in the world.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-8">
          {BRANDS.map((b) => (
            <Link
              key={b.name}
              href={b.href}
              className="group relative overflow-hidden rounded-2xl border border-[#E2E2E2] dark:border-[#333] bg-white dark:bg-[#2b2b2e] p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: b.color }} />
              <span className="inline-block text-[12px] font-bold tracking-[0.15em] uppercase mb-3" style={{ color: b.color }}>
                {b.tagline}
              </span>
              <h2 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[1.5rem] tracking-[0.03em] mb-3">{b.name}</h2>
              <p className="text-[#666] dark:text-[#999] text-[15px] leading-relaxed mb-5">{b.shortDesc}</p>
              <span className="inline-flex items-center gap-1.5 text-[#DF3131] text-[13px] font-bold tracking-[0.08em] uppercase group-hover:gap-3 transition-all">
                {b.cta} <FiArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center p-8 bg-[#F5F5F3] dark:bg-[#2b2b2e] rounded-2xl">
          <p className="text-[#333] dark:text-[#e0e0e0] font-heading font-bold text-[1.15rem] mb-1">Built by Torreé Marcel Harris</p>
          <p className="text-[#666] dark:text-[#999] text-[14px]">
            Founder and Creative Director of WYZ Design and its family of brands.{" "}
            <Link href="/about" className="text-[#DF3131] hover:underline font-semibold">Read the full story</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
