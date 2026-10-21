import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MODEL_GALLERIES from "@/lib/data/model-galleries.json";

export const metadata: Metadata = {
  title: "Model Galleries | WYZ Design",
  description: "Browse every model in the WYZ Design archive.",
  alternates: { canonical: "/model-archive/gallery" },
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function ModelGalleryIndex() {
  const models = Object.entries(MODEL_GALLERIES as Record<string, string[]>);
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-28 pb-28 px-6 sm:px-10 lg:px-16">
      <h1 className="font-heading font-black text-white text-center text-[2rem] sm:text-[2.6rem] tracking-[0.1em] uppercase mb-4">
        Model Galleries
      </h1>
      <p className="text-white/50 text-center mb-14 max-w-2xl mx-auto">
        {models.length} models, each with a curated gallery. Pick one to browse the full set.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-6 max-w-[110rem] mx-auto">
        {models.map(([name, images]) => (
          <Link
            key={name}
            href={`/model-archive/gallery/${slugify(name)}`}
            className="group border border-white/10 hover:border-[#DF3131] rounded-xl overflow-hidden bg-white/[0.03] transition-colors"
          >
            <div className="relative aspect-[3/4] bg-black">
              <Image
                src={images[0] || "/images/wyz-crown.png"}
                alt={name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <p className="text-white text-[12px] font-bold uppercase tracking-[0.06em] truncate group-hover:text-[#DF3131] transition-colors">
                {name}
              </p>
              <p className="text-white/40 text-[11px] mt-1">{images.length} photos</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-14">
        <Link href="/model-archive" className="text-white/40 hover:text-[#DF3131] text-sm transition-colors">
          Back to Model Archive
        </Link>
      </div>
    </div>
  );
}
