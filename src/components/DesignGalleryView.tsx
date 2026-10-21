"use client";

import GalleryView from "@/components/GalleryView";
import { DESIGN_CATEGORIES, DESIGN_CATEGORY_KEYS } from "@/lib/data/design-galleries";

export default function DesignGalleryView({ category }: { category: string }) {
  const data = DESIGN_CATEGORIES[category];
  return (
    <GalleryView
      label={data.label}
      desc={data.desc}
      items={data.items}
      backHref="/designs"
      backLabel="Back to Designs"
      siblings={DESIGN_CATEGORY_KEYS.filter((k) => k !== category).map((k) => ({
        href: `/designs/gallery/${k}`,
        label: `View ${DESIGN_CATEGORIES[k].label}`,
      }))}
    />
  );
}
