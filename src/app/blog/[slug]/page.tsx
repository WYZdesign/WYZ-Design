import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, BLOG_AUTHOR } from "@/lib/blog";
import { FiArrowLeft, FiClock, FiTag, FiCalendar } from "react-icons/fi";
import SocialShare from "@/components/SocialShare";
import ReadTracker from "./ReadTracker";

const SITE = "https://www.wyzdesign.com";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = `${SITE}/blog/${post.slug}`;
  return {
    title: `${post.title} | WYZ Design`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: "WYZ Design",
      type: "article",
      images: [{ url: post.img, width: 800, height: 600, alt: post.title }],
      publishedTime: post.dateISO,
      authors: [BLOG_AUTHOR.url],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.img],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.img,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    author: {
      "@type": "Person",
      name: BLOG_AUTHOR.name,
      url: BLOG_AUTHOR.url,
    },
    publisher: {
      "@type": "Organization",
      name: "WYZ Design",
      logo: { "@type": "ImageObject", url: `${SITE}/wyz-crown-square.png` },
    },
    mainEntityOfPage: `${SITE}/blog/${post.slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE}/blog/${post.slug}` },
    ],
  };

  return (
    <main className="pb-20 bg-white dark:bg-[#1C1C1E]">
      <ReadTracker />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="max-w-[52rem] mx-auto px-6 lg:px-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[#666] dark:text-[#666] text-[14px] hover:text-[#DF3131] transition-colors pt-8 mb-6">
          <FiArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <span className="inline-block px-3 py-1 bg-[#DF3131] text-white text-[11px] font-bold tracking-[0.1em] uppercase rounded mb-4">{post.cat}</span>
        <h1 className="font-heading font-black text-[#333] dark:text-[#e0e0e0] text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] leading-tight tracking-[0.02em] mb-4">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-[#666] dark:text-[#aaa] text-[13px] mb-8">
          <span className="flex items-center gap-1.5"><FiCalendar className="w-3.5 h-3.5" /> {post.date}</span>
          <span className="flex items-center gap-1.5"><FiClock className="w-3.5 h-3.5" /> {post.readTime}</span>
          <span className="flex items-center gap-1.5"><FiTag className="w-3.5 h-3.5" /> {post.cat}</span>
          <SocialShare title={post.title} url={`${SITE}/blog/${post.slug}`} description={post.excerpt} />
        </div>

        <div className="relative w-full h-[16rem] sm:h-[22rem] lg:h-[26rem] rounded-xl overflow-hidden mb-10">
          <Image src={post.img} alt={post.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 52rem" />
        </div>

        <div className="space-y-8">
          {post.content.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] text-[1.25rem] lg:text-[1.5rem] tracking-[0.02em] mb-4">{section.heading}</h2>
              )}
              <div className="space-y-4">
                {section.paragraphs.map((p, j) => (
                  <p key={j} className="text-[#444] dark:text-[#b0b0b0] text-[16px] lg:text-[17px] leading-relaxed">{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 p-8 bg-[#F5F5F3] dark:bg-[#252528] rounded-xl text-center">
          <p className="text-[#333] dark:text-[#e0e0e0] font-heading font-bold text-[1.1rem] mb-2">Written by {BLOG_AUTHOR.name}</p>
          <p className="text-[#666] dark:text-[#666] text-[14px] mb-5">Founder of WYZ Design. Photography, design, and the business of making things that look good.</p>
          <Link href="/contact" className="inline-block px-8 py-3 bg-[#DF3131] text-white text-[13px] font-bold tracking-[0.1em] uppercase rounded-full hover:bg-[#B82020] transition-colors">
            Work With Us
          </Link>
        </div>
      </div>
    </main>
  );
}
