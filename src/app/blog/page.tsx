"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { FiArrowRight, FiClock, FiTag, FiSearch, FiTrendingUp } from "react-icons/fi";
import ScrollReveal from "@/components/ScrollReveal";
import TextReveal from "@/components/TextReveal";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { POSTS } from "@/lib/blog";

const CATS = ["All", "Events", "Design", "Photography", "Branding", "Web Design", "Printing", "Marketing", "Business"];

export default function BlogPage() {
 const [cat, setCat] = useState("All");
 const [search, setSearch] = useState("");

 const featured = POSTS.find(p => p.featured) ?? POSTS[0];
 const filtered = useMemo(() => {
 let list = cat === "All" ? POSTS.filter(p => !p.featured) : POSTS.filter(p => p.cat === cat && !p.featured);
 if (search) {
 const s = search.toLowerCase();
 list = list.filter(p => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s));
 }
 return list;
 }, [cat, search]);

 return (
 <main className="pb-16 bg-white dark:bg-[#1C1C1E]">
 <style>{`
 .blog-card{transition:all .35s ease}
 .blog-card:hover{transform:translateY(-5px);box-shadow:0 16px 32px rgba(0,0,0,.1)}
 .blog-card:hover .blog-img{transform:scale(1.08)}
 .blog-img{transition:transform .6s ease}
 @keyframes heroGradBlog{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
 `}</style>

 <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
 {/* Hero */}
 <ScrollReveal animation="fadeUp" duration={1}>
 <div className="relative overflow-hidden -mx-6 lg:-mx-12 mb-12">
  <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] max-h-[800px]">
 <div className="relative overflow-hidden" style={{background:"linear-gradient(-45deg, #DF3131, #c02020, #1a1a1a, #8B0000, #DF3131)",backgroundSize:"400% 400%",animation:"heroGradBlog 8s ease infinite"}}>
 <div className="absolute inset-0 opacity-20" style={{backgroundImage:"url('data:image/svg+xml,%3Csvg width=&quot;40&quot; height=&quot;40&quot; viewBox=&quot;0 0 40 40&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><g=&quot;%23ffffff&quot;-opacity=&quot;0.3&quot;-rule=&quot;evenodd&quot;><path d=&quot;M0 40L40 0H20L0 20M40 40V20L20 40&quot;/&gt;&lt;/g&gt;&lt;/svg&gt;')"}} />
 <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
 <FiTrendingUp className="w-8 h-8 text-[#DF3131]" />
 </div>
 <TextReveal text="THE BLOG" className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-white tracking-[0.08em] leading-[1.05] mb-3" tag="h1" />
 <p className="text-white/70 text-base sm:text-lg max-w-md">News, insights, and behind-the-scenes from WYZ Design</p>
 </div>
 </div>
  {featured && (
  <Link href={`/blog/${featured.slug}`} className="hidden lg:block relative overflow-hidden group">
  <SafeImage src={featured.img} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" priority />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
  <div className="absolute bottom-0 left-0 right-0 p-10">
  <span className="inline-block px-3 py-1 bg-[#DF3131] text-white text-[11px] font-bold tracking-[0.1em] uppercase rounded mb-2">Featured</span>
  <h2 className="font-heading font-black text-white text-[1.5rem] tracking-[0.04em] mb-4">{featured.title}</h2>
   <p className="text-white/70 text-[16px] max-w-md">{featured.excerpt}</p>
  </div>
  </Link>
  )}
 </div>
 </div>
 </ScrollReveal>

 {/* Search + Categories */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
 <div className="relative flex-1 w-full">
 <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666] w-4 h-4" />
 <input
 type="text"
 placeholder="Search articles..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
  aria-label="Search blog posts"
  className="w-full pl-11 pr-4 py-3 border-2 border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#252528] text-[16px] text-[#333] dark:text-[#e0e0e0] placeholder-[#8F8F8F] outline-none focus:border-[#DF3131] transition-all rounded-lg"
/>
 </div>
 </div>
 </ScrollReveal>

 <ScrollReveal animation="fadeUp" delay={0.15}>
 <div className="sticky top-20 lg:top-24 z-10 bg-white dark:bg-[#1C1C1E] py-3 -mx-6 px-6 lg:-mx-12 lg:px-12">
 <div className="flex gap-2 flex-wrap">
 {CATS.map(c => (
 <button key={c} onClick={() => setCat(c)}
 className={`px-5 py-2.5 min-h-[44px] text-[13px] font-semibold tracking-[0.08em] rounded-full border-2 transition-all ${cat === c ? "bg-[#DF3131] text-white border-[#DF3131] shadow-md shadow-[#DF3131]/20" : "bg-white text-[#666] border-[#E2E2E2] dark:bg-[#252528] dark:text-[#e0e0e0] dark:border-[#444] hover:border-[#DF3131] hover:text-[#DF3131]"}`}>
 {c}
 </button>
 ))}
 </div>
 </div>
 </ScrollReveal>

  {/* Post Grid */}
  <ErrorBoundary fallback={
    <div className="text-center py-20">
      <p className="text-[#666] text-lg">Failed to load articles</p>
      <p className="text-[#666] text-sm mt-1">Please try again later</p>
    </div>
  }>
  <div id="articles" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {filtered.map((p, i) => (
    <ScrollReveal key={p.id} animation="fadeUp" delay={0.08 * i}>
    <Link href={`/blog/${p.slug}`} className="blog-card group block bg-white dark:bg-[#252528] rounded-xl overflow-hidden border border-[#E2E2E2] dark:border-[#333]">
      <div className="relative h-56 overflow-hidden">
      <SafeImage src={p.img} alt={p.title} className="blog-img w-full h-full object-cover dark:brightness-110" loading="lazy" priority={false} />
      <span className="absolute top-3 left-3 px-3 py-1 bg-[#DF3131] text-white text-[11px] font-bold tracking-[0.1em] uppercase rounded z-10">{p.cat}</span>
      </div>
    <div className="p-5 sm:p-6 text-center">
    <div className="flex items-center justify-center gap-3 text-[#666] dark:text-[#aaa] text-[12px] mb-3">
    <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {p.readTime}</span>
   <span>•</span>
   <span>{p.date}</span>
    </div>
   <h3 className="font-heading font-bold text-[#333] dark:text-[#e0e0e0] text-[17px] group-hover:text-[#DF3131] transition-colors leading-snug mb-3">{p.title}</h3>
   <p className="text-[#666] dark:text-[#999] text-[16px] leading-relaxed line-clamp-2">{p.excerpt}</p>
   <div className="mt-4 flex items-center justify-center gap-1 text-[#DF3131] text-[13px] font-semibold tracking-[0.06em] sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-opacity">
   READ MORE <FiArrowRight className="w-3.5 h-3.5" />
   </div>
    </div>
    </Link>
    </ScrollReveal>
  ))}
  </div>
  </ErrorBoundary>

 {filtered.length === 0 && (
 <div className="text-center py-20">
 <FiSearch className="w-12 h-12 text-[#E2E2E2] mx-auto mb-4" />
 <p className="text-[#666] text-lg">No articles found</p>
 <p className="text-[#666] text-sm mt-1">Try a different search or category</p>
 </div>
 )}

  </div>
  </main>
 );
}
