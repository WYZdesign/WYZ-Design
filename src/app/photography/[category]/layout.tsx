import type { Metadata } from "next";

const CATEGORY_META: Record<string, { label: string; desc: string }> = {
  Events: { label: "Events", desc: "Live shows, mixers, workshops, and community gatherings photographed by WYZ Design." },
  Outdoors: { label: "Outdoors", desc: "Natural light, urban landscapes, and open air portraits by WYZ Design." },
  Studio: { label: "Studio", desc: "Controlled lighting, headshots, and creative studio work by WYZ Design." },
  Boudoir: { label: "Boudoir", desc: "Intimate, editorial, and personal portrait sessions by WYZ Design." },
  Bodypaint: { label: "Bodypaint", desc: "Body as canvas. Art, paint, texture, and expression by WYZ Design." },
  Urbex: { label: "Urbex", desc: "Abandoned spaces, urban decay, and industrial textures by WYZ Design." },
  Products: { label: "Products", desc: "Commercial product photography, mockups, and branding shots by WYZ Design." },
  Conceptual: { label: "Conceptual", desc: "Idea driven work. Abstract, surreal, and experimental imagery by WYZ Design." },
  Portraits: { label: "Portraits", desc: "Expressive portrait sessions capturing personality and emotion by WYZ Design." },
  Concerts: { label: "Concerts", desc: "Live music performances, venue shoots, and artist coverage by WYZ Design." },
  Street: { label: "Street", desc: "Urban storytelling through candid street photography by WYZ Design." },
  Editorial: { label: "Editorial", desc: "Magazine-style shoots, fashion editorials, and styled storytelling by WYZ Design." },
  Commercial: { label: "Commercial", desc: "Brand campaigns, product launches, and commercial advertising work by WYZ Design." },
};

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const key = category.charAt(0).toUpperCase() + category.slice(1);
  const meta = CATEGORY_META[key] ?? { label: key, desc: `Professional ${category} photography by WYZ Design in Los Angeles.` };
  const title = `${meta.label} Photography | WYZ Design`;
  const canonical = `https://www.wyzdesign.com/photography/${category}`;
  return {
    title,
    description: meta.desc,
    keywords: [`${meta.label.toLowerCase()} photography`, "Los Angeles photographer", "WYZ Design", "creative photography"],
    alternates: { canonical },
    openGraph: {
      title,
      description: meta.desc,
      url: canonical,
      siteName: "WYZ Design",
      type: "website",
      images: [{ url: "https://www.wyzdesign.com/wyz-og-image.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description: meta.desc, images: ["https://www.wyzdesign.com/wyz-og-image.png"] },
  };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
