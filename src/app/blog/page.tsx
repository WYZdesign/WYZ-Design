"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiClock, FiTag, FiSearch, FiTrendingUp } from "react-icons/fi";
import ScrollReveal from "@/components/ScrollReveal";
import TextReveal from "@/components/TextReveal";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const POSTS = [
 { id: 1, title: "Behind the Scenes: FD Mixer Vol. 6", excerpt: "An inside look at our latest event photography session, from setup to the final shots.", date: "May 15, 2026", cat: "Events", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop", featured: true, readTime: "5 min" },
 { id: 2, title: "Logo Design Trends for 2026", excerpt: "The top logo styles dominating this year and how WYZ Design stays ahead of the curve.", date: "Apr 28, 2026", cat: "Design", img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop", featured: false, readTime: "4 min" },
 { id: 3, title: "How to Prepare for Your Photoshoot", excerpt: "A complete guide to getting camera-ready, wardrobe, lighting preferences, and posing tips.", date: "Apr 10, 2026", cat: "Photography", img: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=600&fit=crop", featured: false, readTime: "6 min" },
 { id: 4, title: "Why Your Brand Needs a Style Guide", excerpt: "Consistency is king. Here is why every business needs a cohesive visual identity.", date: "Mar 22, 2026", cat: "Branding", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop", featured: false, readTime: "3 min" },
 { id: 5, title: "Event Photography: Capturing the Moment", excerpt: "Techniques we use to freeze authentic moments at live events and concerts.", date: "Mar 5, 2026", cat: "Events", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop", featured: false, readTime: "5 min" },
 { id: 6, title: "The Power of Retouching", excerpt: "Why professional retouching matters and how it elevates your portfolio.", date: "Feb 18, 2026", cat: "Photography", img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop", featured: false, readTime: "4 min" },
 { id: 7, title: "Top 10 Branding Trends for 2026", excerpt: "From kinetic logos to AI-generated palettes, these emerging brand design trends are reshaping how businesses present themselves. Stay ahead of the curve with what is defining visual identity this year.", date: "July 10, 2026", cat: "Branding", img: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop", featured: false, readTime: "7 min" },
 { id: 8, title: "Why Your Business Needs a Professional Website", excerpt: "Your website is your digital storefront and first impressions happen in milliseconds. A professional web presence builds trust, drives conversions, and keeps you competitive in an online-first world.", date: "July 8, 2026", cat: "Web Design", img: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop", featured: false, readTime: "5 min" },
 { id: 9, title: "The Art of Event Photography: Capturing Moments", excerpt: "Great event photography goes beyond pointing and shooting, it is about reading the room, anticipating emotion, and telling a story through frames. Here are the techniques that separate snapshots from art.", date: "July 5, 2026", cat: "Photography", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop", featured: false, readTime: "6 min" },
 { id: 10, title: "Custom Printing: From Concept to Creation", excerpt: "Taking a design from screen to physical product involves color profiles, material selection, and finishing techniques. This walkthrough covers the full custom printing pipeline.", date: "July 2, 2026", cat: "Printing", img: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&h=600&fit=crop", featured: false, readTime: "5 min" },
 { id: 11, title: "How to Build a Strong Social Media Presence", excerpt: "Consistency, authenticity, and strategy are the pillars of a social media presence that actually converts. Learn the frameworks that turn followers into loyal customers.", date: "June 28, 2026", cat: "Marketing", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop", featured: false, readTime: "4 min" },
 { id: 12, title: "Freelance Designer's Guide to Client Management", excerpt: "Managing expectations, scope, and communication is what separates thriving freelancers from burning out. These battle-tested strategies will keep your clients happy and your boundaries intact.", date: "June 25, 2026", cat: "Business", img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop", featured: false, readTime: "6 min" },
];

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
 <main className="pb-16 bg-white dark:bg-[#232326]">
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
 <div className="grid grid-cols-1 lg:grid-cols-2 h-[50vh] max-h-[500px]">
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
  <Link href="#articles" className="hidden lg:block relative overflow-hidden group">
  <Image src={featured.img} alt={featured.title} fill className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" priority />
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
 <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8F8F8F] w-4 h-4" />
 <input
 type="text"
 placeholder="Search articles..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
  className="w-full pl-11 pr-4 py-3 border-2 border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#2b2b2e] text-[16px] text-[#333] dark:text-[#e0e0e0] placeholder-[#8F8F8F] outline-none focus:border-[#DF3131] transition-all rounded-lg"
/>
 </div>
 </div>
 </ScrollReveal>

 <ScrollReveal animation="fadeUp" delay={0.15}>
 <div className="sticky top-20 lg:top-24 z-10 bg-white dark:bg-[#232326] py-3 -mx-6 px-6 lg:-mx-12 lg:px-12">
 <div className="flex gap-2 flex-wrap">
 {CATS.map(c => (
 <button key={c} onClick={() => setCat(c)}
 className={`px-5 py-2.5 min-h-[44px] text-[13px] font-semibold tracking-[0.08em] rounded-full border-2 transition-all ${cat === c ? "bg-[#DF3131] text-white border-[#DF3131] shadow-md shadow-[#DF3131]/20" : "bg-white text-[#666] border-[#E2E2E2] dark:bg-[#2b2b2e] dark:text-[#e0e0e0] dark:border-[#444] hover:border-[#DF3131] hover:text-[#DF3131]"}`}>
 {c}
 </button>
 ))}
 </div>
 </div>
 </ScrollReveal>

  {/* Post Grid */}
  <ErrorBoundary fallback={
    <div className="text-center py-20">
      <p className="text-[#8F8F8F] text-lg">Failed to load articles</p>
      <p className="text-[#8F8F8F] text-sm mt-1">Please try again later</p>
    </div>
  }>
  <div id="articles" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {filtered.map((p, i) => (
    <ScrollReveal key={p.id} animation="fadeUp" delay={0.08 * i}>
    <article className="blog-card group bg-white dark:bg-[#2b2b2e] rounded-xl overflow-hidden border border-[#E2E2E2] dark:border-[#333] cursor-pointer min-h-[44px]">
      <div className="relative h-56 overflow-hidden">
      <Image src={p.img} alt={p.title} fill className="blog-img w-full h-full object-cover dark:brightness-110" priority />
      </div>
      <span className="absolute -top-4 left-4 px-3 py-1 bg-[#DF3131] text-white text-[11px] font-bold tracking-[0.1em] uppercase rounded z-10">{p.cat}</span>
    <div className="p-5 sm:p-6 text-center">
    <div className="flex items-center justify-center gap-3 text-[#8F8F8F] dark:text-[#aaa] text-[12px] mb-3">
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
   </article>
   </ScrollReveal>
  ))}
  </div>
  </ErrorBoundary>

 {filtered.length === 0 && (
 <div className="text-center py-20">
 <FiSearch className="w-12 h-12 text-[#E2E2E2] mx-auto mb-4" />
 <p className="text-[#8F8F8F] text-lg">No articles found</p>
 <p className="text-[#8F8F8F] text-sm mt-1">Try a different search or category</p>
 </div>
 )}

  </div>
  </main>
 );
}
