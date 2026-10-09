import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiUsers, FiShoppingBag, FiStar, FiCalendar } from "react-icons/fi";

const SITE = "https://www.wyzdesign.com";



const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Brand",
  name: "Dying Breed Crew",
  description: "The community and clothing arm of WYZ Design. A collective of artists, musicians, models, and culture-makers who refuse to blend in.",
  url: `${SITE}/dying-breed-crew`,
  parentOrganization: { "@type": "Organization", name: "WYZ Design", url: SITE },
};

const merchItems = [
  { img: "/images/merch/dbc-logo.png", name: "DBC Logo Tee", price: "$30" },
  { img: "/images/merch/dbc_zip-up-hoodie.jpg", name: "Zip-Up Hoodie", price: "$55" },
  { img: "/images/merch/dbc_ribbed-beanie.jpg", name: "Ribbed Beanie", price: "$25" },
  { img: "/images/merch/dbc_denim-tee.jpg", name: "Denim Tee", price: "$35" },
  { img: "/images/merch/dbc_cropped-hoodie.jpg", name: "Cropped Hoodie", price: "$45" },
  { img: "/images/merch/dbc_hooded-long-sleeve-tee.jpg", name: "Hooded Long Sleeve", price: "$40" },
];

export default function DyingBreedCrewPage() {
  return (
    <section className="pb-20 bg-white dark:bg-[#1C1C1E]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      

      {/* What We Are */}
      <section className="max-w-4xl mx-auto px-6 section-gap text-center">
        <h2 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[1.8rem] lg:text-[2.2rem] tracking-[0.04em] mb-6">
          Not Just a Brand. A <span className="text-[#8F5E1E]">Standard</span>.
        </h2>
        <p className="text-[#666] dark:text-[#666] text-[16px] leading-relaxed max-w-2xl mx-auto">
          DBC represents the doers. The ones who show up, the ones who create when nobody&apos;s watching. We make gear that reflects that energy. Limited runs, real quality, no mass production. If you know, you know.
        </p>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] rounded-2xl p-8 text-center">
            <FiUsers className="w-8 h-8 mx-auto text-[#8F5E1E] mb-4" />
            <h3 className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] text-[1rem] tracking-[0.03em] mb-2">The Collective</h3>
            <p className="text-[#666] dark:text-[#666] text-[14px] leading-relaxed">Artists, musicians, models, photographers, and culture-makers. DBC is the crew that makes it happen.</p>
          </div>
          <div className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] rounded-2xl p-8 text-center">
            <FiStar className="w-8 h-8 mx-auto text-[#8F5E1E] mb-4" />
            <h3 className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] text-[1rem] tracking-[0.03em] mb-2">Limited Runs</h3>
            <p className="text-[#666] dark:text-[#666] text-[14px] leading-relaxed">We don&apos;t mass produce. Every drop is intentional. When it&apos;s gone, it&apos;s gone. That&apos;s the point.</p>
          </div>
          <div className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] rounded-2xl p-8 text-center">
            <FiCalendar className="w-8 h-8 mx-auto text-[#8F5E1E] mb-4" />
            <h3 className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] text-[1rem] tracking-[0.03em] mb-2">Events & Collabs</h3>
            <p className="text-[#666] dark:text-[#666] text-[14px] leading-relaxed">Pop-ups, showcase events, creative collaborations. DBC shows up in the real world, not just on screens.</p>
          </div>
        </div>
      </section>

      {/* Merch Preview */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[1.5rem] lg:text-[2rem] tracking-[0.04em]">
            Latest Drops
          </h2>
          <Link href="/merch" className="inline-flex items-center gap-2 text-[#8F5E1E] text-[14px] font-bold tracking-[0.08em] uppercase hover:gap-3 transition-all">
            View All <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {merchItems.map((item) => (
            <Link key={item.name} href="/merch" className="group block bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="relative aspect-square bg-[#F5F5F3] dark:bg-[#1C1C1E] overflow-hidden">
                <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 50vw, 33vw" />
              </div>
              <div className="p-4">
                <p className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] text-[14px] tracking-[0.02em]">{item.name}</p>
                <p className="text-[#8F5E1E] font-bold text-[13px] mt-1">{item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-[#0A0A0A] rounded-2xl p-10 text-center">
          <h2 className="font-heading font-black text-white text-[1.5rem] lg:text-[2rem] tracking-[0.04em] mb-4">
            Rep the Crew
          </h2>
          <p className="text-white/60 text-[15px] mb-6 max-w-lg mx-auto">
            DBC gear is limited, intentional, and built for the culture. Grab what resonates. Wear it like you mean it.
          </p>
          <Link href="/merch" className="inline-flex items-center gap-2 px-8 py-4 bg-[#D49341] text-[#1C1408] font-heading font-bold text-[14px] tracking-[0.08em] uppercase hover:bg-[#C08230] transition-all">
            Shop DBC <FiArrowRight className="w-4 h-4" />
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
