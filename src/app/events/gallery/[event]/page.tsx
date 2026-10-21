import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GalleryView from "@/components/GalleryView";
import { EVENT_GALLERIES, EVENT_KEYS } from "@/lib/data/event-galleries";

function bySlug(slug: string) {
  return EVENT_KEYS.find((k) => EVENT_GALLERIES[k].slug === slug);
}

export function generateStaticParams() {
  return EVENT_KEYS.map((k) => ({ event: EVENT_GALLERIES[k].slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ event: string }> }): Promise<Metadata> {
  const { event } = await params;
  const key = bySlug(event);
  if (!key) return {};
  return {
    title: `${EVENT_GALLERIES[key].label} | WYZ Design`,
    description: `Photos from ${EVENT_GALLERIES[key].label}, shot by WYZ Design.`,
    alternates: { canonical: `/events/gallery/${event}` },
  };
}

export default async function EventGalleryPage({ params }: { params: Promise<{ event: string }> }) {
  const { event } = await params;
  const key = bySlug(event);
  if (!key) notFound();
  const g = EVENT_GALLERIES[key];
  return (
    <GalleryView
      label={g.label}
      desc="Event coverage"
      items={g.images.map((src, i) => ({
        src,
        title: `${g.label} - ${String(i + 1).padStart(2, "0")}`,
        sub: "Event",
      }))}
      backHref="/events/gallery"
      backLabel="All Event Galleries"
      showFilters={false}
      siblings={[{ href: "/events", label: "Back to Events" }]}
    />
  );
}
