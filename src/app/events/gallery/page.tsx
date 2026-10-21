import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EVENT_GALLERIES, EVENT_KEYS } from "@/lib/data/event-galleries";

export const metadata: Metadata = {
  title: "Event Galleries | WYZ Design",
  description: "Browse photos from the events WYZ Design has covered.",
  alternates: { canonical: "/events/gallery" },
};

export default function EventGalleryIndex() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-28 pb-28 px-6 sm:px-10 lg:px-16">
      <h1 className="font-heading font-black text-white text-center text-[2rem] sm:text-[2.6rem] tracking-[0.1em] uppercase mb-4">
        Event Galleries
      </h1>
      <p className="text-white/50 text-center mb-14 max-w-2xl mx-auto">
        Every event we have shot, in one place. Pick an event to browse the full set.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-[110rem] mx-auto">
        {EVENT_KEYS.map((key) => {
          const g = EVENT_GALLERIES[key];
          const cover = g.images[0] || "/images/wyz-crown.png";
          return (
            <Link
              key={key}
              href={`/events/gallery/${g.slug}`}
              className="group border border-white/10 hover:border-[#DF3131] rounded-xl overflow-hidden bg-white/[0.03] transition-colors"
            >
              <div className="relative aspect-[4/3] bg-black">
                <Image src={cover} alt={g.label} fill unoptimized className="object-cover" />
              </div>
              <div className="p-5">
                <h2 className="text-white font-heading font-bold uppercase tracking-[0.08em] group-hover:text-[#DF3131] transition-colors">
                  {g.label}
                </h2>
                <p className="text-white/40 text-sm mt-2">{g.images.length} photos</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-14">
        <Link href="/events" className="text-white/40 hover:text-[#DF3131] text-sm transition-colors">
          Back to Events
        </Link>
      </div>
    </div>
  );
}
