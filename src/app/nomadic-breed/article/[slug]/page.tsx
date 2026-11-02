import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiShare2, FiHeart, FiBookmark, FiClock, FiUser, FiTag } from "react-icons/fi";
import ScrollReveal from "@/components/ScrollReveal";

interface ArticleProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticleProps): Promise<Metadata> {
  const { slug } = await params;
  // In production, fetch from CMS/database
  const article = getArticleBySlug(slug);
  if (!article) {
    return { title: "Article Not Found" };
  }
  return {
    title: `${article.title} | Nomadic Breed`,
    description: article.excerpt,
    alternates: { canonical: `https://www.wyzdesign.com/nomadic-breed/article/${slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://www.wyzdesign.com/nomadic-breed/article/${slug}`,
      siteName: "Nomadic Breed",
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
      images: [{ url: article.heroImage, width: 1200, height: 675 }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.heroImage],
    },
    other: {
      "article:published_time": article.publishedAt,
      "article:author": article.author.name,
      "article:section": article.category,
      "article:tag": article.tags.join(","),
    },
  };
}

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  heroImage: string;
  heroAlt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    bio: string;
    avatar: string;
    role: string;
  };
  issue: {
    number: number;
    volume: string;
    title: string;
  };
  featured: boolean;
}

function getArticleBySlug(slug: string): Article | null {
  // In production, fetch from CMS/database
  // Mock data for now
  const articles: Record<string, Article> = {
    "nomadic-status-vol-1-rogue-visionaries": {
      slug: "nomadic-status-vol-1-rogue-visionaries",
      title: "Nomadic Status Vol. 1: Rogue Visionaries",
      excerpt: "Meet the underground creatives redefining success on their own terms. From LA's alley galleries to Berlin's basement clubs, these are the voices shaping culture from the margins.",
      content: `
        <p class="lead">The first volume of Nomadic Status introduces five creators who refuse to wait for permission.</p>
        <h2>Mara Kuznetsova — Sound Architect, Berlin</h2>
        <p>Mara doesn't make music for clubs. She makes it for abandoned warehouses, forest clearings, and the moments between heartbeats. Her modular synth rig travels in a pelican case; her studio is wherever the power outlet works.</p>
        <p>"I don't make ambient music. I make music for the spaces between things," she says, adjusting a patch cable. "The silence between notes is where the real composition lives."</p>
        <h2>Diego "Daze" Morales — Muralist, Los Angeles</h2>
        <p>Daze paints on walls that will be painted over in six months. He knows this. He paints anyway.</p>
        <p>"The city eats its children," he says, rolling a joint on a folded newspaper. "But it also gives them walls. I'm just returning the favor."</p>
        <h2>Jade "Jinx" Chen — Cyber-Punk Couturier, Tokyo</h2>
        <p>Jade's garments carry circuit boards instead of sequins. Her latest collection, "Glitch Gospel," debuted in a Shibuya parking garage to an audience of 200 people who found the location via a burned CD left in a convenience store.</p>
        <p>"Fashion is just code you wear," she says. "I'm just debugging the system."</p>
      `,
      heroImage: "/images/nomadic-breed/articles/nomadic-status-vol-1-hero.jpg",
      heroAlt: "Collage of featured artists: Mara in Berlin studio, Daze painting mural, Jade in Tokyo workshop",
      category: "Nomadic Status",
      tags: ["profiles", "underground", "creative freedom", "Berlin", "Los Angeles", "Tokyo"],
      publishedAt: "2026-01-15T00:00:00Z",
      readTime: "12 min read",
      author: {
        name: "Torreé Marcel",
        bio: "Founder and Creative Director of WYZ Design. Built from Chicago's DIY scene. Photographer, designer, and chronicler of the underground.",
        avatar: "/images/authors/torre-marcel.jpg",
        role: "Editor-in-Chief",
      },
      issue: { number: 1, volume: "Vol. 1", title: "Nomadic Breed" },
      featured: true,
    },
    "breed-files-echoes-concrete-jungle": {
      slug: "breed-files-echoes-concrete-jungle",
      title: "Breed Files: Echoes of the Concrete Jungle",
      excerpt: "A photo essay documenting the raw beauty of urban decay and the artists who transform it. From abandoned Detroit factories to Tokyo's neon alleys.",
      content: `
        <p class="lead">The city doesn't ask permission to decay. Artists just show up and make it beautiful anyway.</p>
        <h2>Detroit: The Packard Plant</h2>
        <p>Once the crown jewel of American automotive ambition, the Packard Plant now hosts raves, photo shoots, and graffiti legends. We spent three nights there with a crew of Detroit photographers.</p>
        <h2>Tokyo: Golden Gai After Midnight</h2>
        <p>Six square blocks. Two hundred bars. Zero tourists who stay past 3 AM. The real Golden Gai wakes up when the last train leaves.</p>
        <h2>Detroit: The Heidelberg Project</h2>
        <p>Tyree Guyton's open-air art environment has survived arson, city demolition orders, and gentrification. It's still there. It's still growing.</p>
      `,
      heroImage: "/images/nomadic-breed/articles/breed-files-hero.jpg",
      heroAlt: "Abandoned factory with graffiti art, neon lights cutting through broken windows",
      category: "Breed Files",
      tags: ["photography", "urban exploration", "street art", "Detroit", "Tokyo"],
      publishedAt: "2026-01-15T00:00:00Z",
      readTime: "18 min read",
      author: {
        name: "Mara Kuznetsova",
        bio: "Sound artist and documentarian. Based between Berlin and Detroit. Chronicles the spaces between structures.",
        avatar: "/images/authors/mara-kuznetsova.jpg",
        role: "Contributing Photographer",
      },
      issue: { number: 1, volume: "Vol. 1", title: "Nomadic Breed" },
      featured: false,
    },
    "in-transit-postcards-borderless": {
      slug: "in-transit-postcards-borderless",
      title: "In Transit: Postcards from the Borderless",
      excerpt: "Journal entries from artists who live in motion. No fixed address, no permanent studio—just the work and the road.",
      content: `
        <p class="lead">Home is where your hard drive is backed up.</p>
        <h2>Entry 1: The Night Train to Marfa</p>
        <p>Left Austin at midnight. The desert doesn't look like photos—it looks like forever. Stopped at a gas station in Fort Stockton where the clerk knew my name from an Instagram post three years ago.</p>
        <h2>Entry 2: Berlin Winter</p>
        <p>Minus 12 Celsius. The studio heating is broken. Making an album in a coat. The cold makes the bass heavier.</p>
        <h2>Entry 3: Tokyo Subway, 3:47 AM</p>
        <p>Last train. The salarymen are asleep. A kid in a Dying Breed Crew hoodie sketches in a notebook. I don't ask what he's drawing. Some things aren't for me.</p>
      `,
      heroImage: "/images/nomadic-breed/articles/in-transit-hero.jpg",
      heroAlt: "Train window view blurring into abstract light streaks, night cityscape",
      category: "In Transit",
      tags: ["travel", "journal", "Marfa", "Berlin", "Tokyo", "nomadic lifestyle"],
      publishedAt: "2026-01-15T00:00:00Z",
      readTime: "10 min read",
      author: {
        name: "Diego 'Daze' Morales",
        bio: "Muralist and nomad. Paints walls that disappear. Documents the ones that don't.",
        avatar: "/images/authors/diego-morales.jpg",
        role: "Contributing Writer",
      },
      issue: { number: 1, volume: "Vol. 1", title: "Nomadic Breed" },
      featured: false,
    },
  };
  return articles[slug] || null;
}

export default async function ArticlePage({ params }: ArticleProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1C1C1E] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="font-heading font-black text-[#333] dark:text-white text-2xl mb-4">Article Not Found</h1>
          <p className="text-[#666] dark:text-white/70 mb-6">The article you're looking for doesn't exist or has been moved.</p>
          <Link href="/nomadic-breed" className="inline-block px-6 py-3 bg-[#DF3131] text-white font-bold tracking-[0.1em] uppercase hover:bg-[#B82020]">
            Back to Magazine
          </Link>
        </div>
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.heroImage,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
      url: `https://www.wyzdesign.com/author/${article.author.name.toLowerCase().replace(/\s+/g, "-")}`,
      image: article.author.avatar,
    },
    publisher: {
      "@type": "Organization",
      name: "Nomadic Breed",
      logo: { "@type": "ImageObject", url: "https://www.wyzdesign.com/wyz-logo.png" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.wyzdesign.com/nomadic-breed/article/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="pb-20 bg-white dark:bg-[#1C1C1E]">
        <article>
          {/* Hero */}
          <header className="relative min-h-[60vh] min-h-[700px] overflow-hidden">
            <Image
              src={article.heroImage}
              alt={article.heroAlt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111]/90 to-transparent" />
            <div className="relative z-10 max-w-4xl mx-auto px-6 h-full flex flex-col justify-end pb-16">
              <div className="mb-4 flex flex-wrap gap-2">
                <Link
                  href={`/nomadic-breed/category/${article.category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-3 py-1 bg-[#DF3131]/10 text-[#DF3131] text-[11px] font-bold tracking-[0.15em] uppercase rounded-full"
                >
                  {article.category}
                </Link>
                <span className="px-3 py-1 bg-white/10 dark:bg-black/10 text-white/60 text-[11px] font-bold tracking-[0.15em] uppercase rounded-full">
                  {article.issue.volume} · Issue {article.issue.number}
                </span>
              </div>
              <h1 className="font-heading font-black text-white text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] tracking-[0.04em] leading-[0.9] mb-6">
                {article.title}
              </h1>
              <p className="text-white/70 text-[16px] sm:text-[18px] leading-relaxed max-w-2xl mb-8">
                {article.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Image src={article.author.avatar} alt={article.author.name} width={32} height={32} className="rounded-full" />
                  <div>
                    <p className="text-white font-bold text-[13px]">{article.author.name}</p>
                    <p className="text-white/50 text-[11px]">{article.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-[13px]">
                  <FiClock className="w-4 h-4" /> {article.readTime}
                </div>
              </div>
            </div>
          </header>

          {/* Article Body */}
          <div className="max-w-3xl mx-auto px-6 pb-20">
            <ScrollReveal animation="fadeUp">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
            </ScrollReveal>

            {/* Tags */}
            <footer className="mt-16 pt-8 border-t border-[#E2E2E2] dark:border-[#333]">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#666] dark:text-[#aaa]">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/nomadic-breed/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                      className="px-3 py-1 bg-[#DF3131]/10 text-[#DF3131] text-[11px] font-bold tracking-[0.08em] uppercase rounded-full hover:bg-[#DF3131] hover:text-white transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link href={`/author/${article.author.name.toLowerCase().replace(/\s+/g, "-")}`} className="flex items-center gap-2">
                    <Image src={article.author.avatar} alt={article.author.name} width={24} height={24} className="rounded-full" />
                    <span className="text-[13px] font-bold text-[#333] dark:text-white">{article.author.name}</span>
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 bg-white/5 dark:bg-black/5 border border-white/10 dark:border-white/10 rounded-full hover:bg-[#DF3131]/20 hover:border-[#DF3131] transition-all" aria-label="Bookmark">
                    <FiBookmark className="w-5 h-5 text-[#666] dark:text-[#aaa]" />
                  </button>
                  <button className="p-2 bg-white/5 dark:bg-black/5 border border-white/10 dark:border-white/10 rounded-full hover:bg-[#DF3131]/20 hover:border-[#DF3131] transition-all" aria-label="Share">
                    <FiShare2 className="w-5 h-5 text-[#666] dark:text-[#aaa]" />
                  </button>
                </div>
              </div>
            </footer>

            {/* Author Bio */}
            <section className="mt-16 pt-8 border-t border-[#E2E2E2] dark:border-[#333]">
              <div className="flex gap-6">
                <Image src={article.author.avatar} alt={article.author.name} width={80} height={80} className="rounded-full shrink-0" />
                <div>
                  <h3 className="font-heading font-bold text-[#333] dark:text-white text-[1.1rem] mb-2">{article.author.name}</h3>
                  <p className="text-[#666] dark:text-white/70 text-[13px] mb-2">{article.author.bio}</p>
                  <p className="text-[#DF3131] text-[11px] font-bold tracking-[0.1em] uppercase">{article.author.role}</p>
                </div>
              </div>
            </section>

            {/* Related Articles */}
            <section className="mt-16">
              <h2 className="font-heading font-black text-[#333] dark:text-white text-[1.5rem] mb-8">More from Issue {article.issue.number}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { slug: "nomadic-status-vol-1-rogue-visionaries", title: "Nomadic Status Vol. 1: Rogue Visionaries", image: "/images/nomadic-breed/articles/nomadic-status-vol-1-hero.jpg", category: "Nomadic Status" },
                  { slug: "breed-files-echoes-concrete-jungle", title: "Breed Files: Echoes of the Concrete Jungle", image: "/images/nomadic-breed/articles/breed-files-hero.jpg", category: "Breed Files" },
                  { slug: "in-transit-postcards-borderless", title: "In Transit: Postcards from the Borderless", image: "/images/nomadic-breed/articles/in-transit-hero.jpg", category: "In Transit" },
                ].map((related) => (
                  <Link key={related.slug} href={`/nomadic-breed/article/${related.slug}`} className="group block">
                    <div className="relative aspect-video bg-[#f5f5f5] dark:bg-[#252528] rounded-xl overflow-hidden mb-3">
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#DF3131] mb-1">{related.category}</p>
                    <p className="font-heading font-bold text-[#333] dark:text-white leading-snug line-clamp-2">{related.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </article>
      </main>
    </>
  );
}