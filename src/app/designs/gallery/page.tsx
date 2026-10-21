import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DESIGN_CATEGORIES, DESIGN_CATEGORY_KEYS } from "@/lib/data/design-galleries";

export const metadata: Metadata = {
  title: "Design Gallery | WYZ Design",
  description: "Browse cover art, logos and flyers by category.",
  alternates: { canonical: "/designs/gallery" },
};

export default function DesignGalleryIndex() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-24 px-6">
      <h1 className="font-heading font-black text-white text-center text-[2rem] sm:text-[2.6rem] tracking-[0.1em] uppercase mb-3">
        Design Gallery
      </h1>
      <p className="text-white/50 text-center mb-10 max-w-xl mx-auto">
        The carousels on the Designs page are the highlights. Here you can browse every piece, filtered by category and type.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {DESIGN_CATEGORY_KEYS.map((k) => {
          const d = DESIGN_CATEGORIES[k];
          const cover = d.items[0]?.src || "/images/wyz-crown.png";
          return (
            <Link
              key={k}
              href={`/designs/gallery/${k}`}
              className="group border border-white/10 hover:border-[#DF3131] rounded-lg overflow-hidden bg-white/[0.03] transition-colors"
            >
              <div className="relative aspect-[4/3] bg-black">
                <Image src={cover} alt={d.label} fill unoptimized className="object-contain p-4" />
              </div>
              <div className="p-4">
                <h2 className="text-white font-heading font-bold uppercase tracking-[0.1em] group-hover:text-[#DF3131] transition-colors">
                  {d.label}
                </h2>
                <p className="text-white/40 text-sm mt-1">{d.items.length} pieces</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <Link href="/designs" className="text-white/40 hover:text-[#DF3131] text-sm transition-colors">
          Back to Designs
        </Link>
      </div>
    </div>
  );
}
