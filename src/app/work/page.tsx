"use client";

import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { COVER_ART_WYZ } from "@/data/designs-data";

const DESIGN_IMAGE = COVER_ART_WYZ[0] ?? "/images/designs/cover-art/1.jpg";
const PHOTOGRAPHY_IMAGE = "/images/photography-categories/Studio.JPG";

function Panel({
  href,
  label,
  image,
  tagline,
  align,
}: {
  href: string;
  label: string;
  image: string;
  tagline: string;
  align: "left" | "right";
}) {
  return (
    <Link
      href={href}
      className="group relative flex-1 min-h-[50vh] sm:min-h-screen overflow-hidden flex items-center justify-center transition-all duration-700 ease-out sm:hover:flex-[1.6]"
    >
      <SafeImage
        src={image}
        alt={label}
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/55 group-hover:bg-black/35 transition-colors duration-500" />
      <div className="relative z-10 text-center px-6">
        <h2 className="text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] font-heading font-black text-white tracking-[0.08em] mb-3">
          {label}
        </h2>
        <p className="text-white/80 text-[13px] sm:text-[15px] max-w-xs mx-auto mb-4">{tagline}</p>
        <span className="inline-block text-[11px] sm:text-[12px] font-bold tracking-[0.2em] uppercase text-white border-b-2 border-[#DF3131] pb-1">
          View {label.toLowerCase()}
        </span>
      </div>
      <span className="sr-only">{align === "left" ? "Design portfolio" : "Photography portfolio"}</span>
    </Link>
  );
}

export default function WorkGateway() {
  return (
    <main className="relative bg-black -mt-20 lg:-mt-24 pt-20 lg:pt-24">
      <h1 className="sr-only">Our Work</h1>
      <section className="relative flex flex-col sm:flex-row min-h-screen">
        <Panel
          href="/designs"
          label="Design"
          image={DESIGN_IMAGE}
          tagline="Logos, flyers, cover art, and brand systems built to stand out."
          align="left"
        />
        <Panel
          href="/photography"
          label="Photography"
          image={PHOTOGRAPHY_IMAGE}
          tagline="Events, portraits, studio, and editorial work shot to last."
          align="right"
        />
        {/* Seam label, sits on the center line, lets clicks pass through to the half underneath */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="bg-black/70 px-5 py-3 sm:px-8 sm:py-4 text-center">
            <p className="text-white text-[12px] sm:text-[14px] font-bold tracking-[0.15em] uppercase">
              Two sides. One studio.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#FEFEFD] dark:bg-[#111] py-12 sm:py-16 text-center px-6">
        <p className="text-[#333] dark:text-[#ccc] text-[14px] sm:text-[16px] max-w-md mx-auto mb-6">
          Not sure which one you need? Most projects use both. Tell us what you are building and we will point you the right way.
        </p>
        <Link
          href="/booking"
          className="inline-block px-8 py-3 bg-[#DF3131] text-white text-[13px] font-bold tracking-[0.12em] uppercase hover:bg-[#B82020] transition-all"
        >
          Book a call
        </Link>
      </section>
    </main>
  );
}
