import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiMapPin, FiCamera, FiCalendar, FiPackage } from "react-icons/fi";

const SITE = "https://www.wyzdesign.com";

export const metadata: Metadata = {
  title: "Nomadic Breed",
  description: "The mobile arm of WYZ Design. Pop-up shoots, touring event coverage, and the WYZ standard delivered wherever the work takes us.",
  alternates: { canonical: `${SITE}/nomadic-breed` },
  openGraph: {
    title: "Nomadic Breed — WYZ Design",
    description: "Pop-up shoots, touring event coverage, and the WYZ standard delivered wherever the work takes us.",
    url: `${SITE}/nomadic-breed`,
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: `${SITE}/images/client-logos/nomadic-breed.jpg`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Nomadic Breed — WYZ Design", description: "Pop-up shoots, touring event coverage, and the WYZ standard delivered wherever the work takes us.", images: [`${SITE}/images/client-logos/nomadic-breed.jpg`] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Brand",
  name: "Nomadic Breed",
  description: "The mobile arm of WYZ Design. Pop-up shoots, touring event coverage, and the WYZ standard delivered wherever the work takes us.",
  url: `${SITE}/nomadic-breed`,
  parentOrganization: { "@type": "Organization", name: "WYZ Design", url: SITE },
};

const services = [
  { icon: "FiCamera", title: "Pop-Up Shoots", desc: "No studio? No problem. We bring the full WYZ setup to any location — warehouse rooftops, parking garages, desert highways. Every location is a set." },
  { icon: "FiCalendar", title: "Touring Event Coverage", desc: "Concerts, festivals, brand activations, private events. We travel with the culture and document it at the highest level." },
  { icon: "FiMapPin", title: "On-Location Branding", desc: "Your brand deserves more than a white-wall studio. We shoot on-location to give your visuals real context and real energy." },
  { icon: "FiPackage", title: "Travel Packages", desc: "Multi-day shoots, city-to-city coverage, content batching for touring artists and traveling brands. One crew, one standard, everywhere." },
];

export default function NomadicBreedPage() {
  return (
    <main className="pb-20 bg-white dark:bg-[#1C1C1E]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0A0A0A] py-24 lg:py-32">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/client-logos/nomadic-breed.jpg" alt="" fill className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/60 to-[#0A0A0A]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 bg-[#00E5FF]/10 text-[#00E5FF] text-[12px] font-bold tracking-[0.15em] uppercase rounded-full mb-6">
            The Movement
          </span>
          <h1 className="font-heading font-black text-white text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] tracking-[0.04em] leading-[0.9] mb-6">
            NOMADIC<br />
            <span className="text-[#00E5FF]">BREED</span>
          </h1>
          <p className="text-white/70 text-[16px] lg:text-[18px] max-w-xl mx-auto leading-relaxed mb-8">
            The mobile arm of WYZ Design. Built for creators who don&apos;t stay in one place. We bring the standard wherever the work takes us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00E5FF] text-[#0A0A0A] font-heading font-bold text-[14px] tracking-[0.08em] uppercase hover:bg-[#00CCE6] transition-all">
              Book a Pop-Up <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/events" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-heading font-bold text-[14px] tracking-[0.08em] uppercase hover:border-[#00E5FF] hover:text-[#00E5FF] transition-all">
              See Events <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[1.8rem] lg:text-[2.2rem] tracking-[0.04em] mb-6">
          Every Location Is a <span className="text-[#00E5FF]">Set</span>
        </h2>
        <p className="text-[#666] dark:text-[#999] text-[16px] leading-relaxed max-w-2xl mx-auto">
          Nomadic Breed was built for the creators who move. Artists on tour, brands doing pop-ups, events that happen once — you need a crew that can show up anywhere and deliver the same quality as a studio shoot. That&apos;s us. We pack light, move fast, and never compromise on the standard.
        </p>
      </section>

      {/* Services */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((s) => (
            <div key={s.title} className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center mb-4">
                <FiCamera className="w-5 h-5 text-[#00E5FF]" />
              </div>
              <h3 className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] text-[1.1rem] tracking-[0.03em] mb-3">{s.title}</h3>
              <p className="text-[#666] dark:text-[#999] text-[14px] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-[#0A0A0A] rounded-2xl p-10 text-center">
          <h2 className="font-heading font-black text-white text-[1.5rem] lg:text-[2rem] tracking-[0.04em] mb-4">
            Ready to Take It on the Road?
          </h2>
          <p className="text-white/60 text-[15px] mb-6 max-w-lg mx-auto">
            Whether it&apos;s a single pop-up or a multi-city tour, Nomadic Breed delivers. Let&apos;s talk about where we&apos;re headed next.
          </p>
          <Link href="/booking" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00E5FF] text-[#0A0A0A] font-heading font-bold text-[14px] tracking-[0.08em] uppercase hover:bg-[#00CCE6] transition-all">
            Book a Shoot <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Back to brands */}
      <div className="text-center">
        <Link href="/brands" className="inline-flex items-center gap-2 text-[#666] dark:text-[#999] text-[14px] hover:text-[#DF3131] transition-colors">
          <FiArrowRight className="w-4 h-4 rotate-180" /> Back to all brands
        </Link>
      </div>
    </main>
  );
}
