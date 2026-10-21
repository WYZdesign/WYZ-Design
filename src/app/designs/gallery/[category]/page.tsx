import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DesignGalleryView from "@/components/DesignGalleryView";
import { DESIGN_CATEGORIES, DESIGN_CATEGORY_KEYS } from "@/lib/data/design-galleries";

export function generateStaticParams() {
  return DESIGN_CATEGORY_KEYS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const data = DESIGN_CATEGORIES[category];
  if (!data) return {};
  return {
    title: `${data.label} | WYZ Design`,
    description: data.desc,
    alternates: { canonical: `/designs/gallery/${category}` },
  };
}

export default async function DesignCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!DESIGN_CATEGORIES[category]) notFound();
  return <DesignGalleryView category={category} />;
}
