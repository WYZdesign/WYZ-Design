import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GalleryView from "@/components/GalleryView";
import MODEL_GALLERIES from "@/lib/data/model-galleries.json";

const MODELS = MODEL_GALLERIES as Record<string, string[]>;

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function bySlug(slug: string) {
  return Object.keys(MODELS).find((name) => slugify(name) === slug);
}

export function generateStaticParams() {
  return Object.keys(MODELS).map((name) => ({ model: slugify(name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ model: string }> }): Promise<Metadata> {
  const { model } = await params;
  const name = bySlug(model);
  if (!name) return {};
  return {
    title: `${name} | WYZ Design Model Archive`,
    description: `Photo gallery for ${name}.`,
    alternates: { canonical: `/model-archive/gallery/${model}` },
  };
}

export default async function ModelGalleryPage({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  const name = bySlug(model);
  if (!name) notFound();
  const images = MODELS[name];
  return (
    <GalleryView
      label={name}
      desc="Model archive"
      items={images.map((src, i) => ({
        src,
        title: `${name} - ${String(i + 1).padStart(2, "0")}`,
        sub: "Model",
      }))}
      backHref="/model-archive/gallery"
      backLabel="All Model Galleries"
      showFilters={false}
      siblings={[{ href: "/model-archive", label: "Back to Model Archive" }]}
    />
  );
}
