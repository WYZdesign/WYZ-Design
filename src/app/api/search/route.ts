import { NextRequest, NextResponse } from "next/server";

const IS_VERCEL = !!process.env.VERCEL;

interface StaticResult {
  title: string;
  href: string;
  desc: string;
}

const STATIC_PAGES: StaticResult[] = [
  { title: "Home", href: "/", desc: "WYZ Design, bold creative studio in LA" },
  { title: "Photography", href: "/photography", desc: "Model portfolios, events, headshots, editorial photography" },
  { title: "Events", href: "/events", desc: "Event photography, recaps, and coverage" },
  { title: "Designs", href: "/designs", desc: "Graphic design, branding, visual identity" },
  { title: "Web Design", href: "/web-design", desc: "Web development, landing pages, e-commerce" },
  { title: "Services", href: "/services", desc: "Full creative services for photo, video, web, and design" },
  { title: "Blog", href: "/blog", desc: "Articles, insights, and creative industry news" },
  { title: "Merch", href: "/merch", desc: "Print-on-demand apparel, accessories, and art" },
  { title: "Plans & Pricing", href: "/plans", desc: "Starter, Business, Pro, and Ultimate plans" },
  { title: "Community", href: "/community", desc: "Forums, discussions, and creator community" },
  { title: "Contact", href: "/contact", desc: "Get in touch to book a call or send a message" },
  { title: "Portfolio", href: "/case-studies", desc: "Our creative work and case studies" },
  { title: "About", href: "/about", desc: "Who we are, what we do, and why" },
  { title: "Case Studies", href: "/case-studies", desc: "Deep dives into past projects and results" },
  { title: "FAQ", href: "/faq", desc: "Frequently asked questions" },
  { title: "Featured Artist", href: "/featured-artist", desc: "FAOTM art store and featured creators" },
  { title: "Match", href: "/match", desc: "Get matched with the perfect service package for your brand" },
  { title: "Account", href: "/account/my-account", desc: "Manage your profile, bookings, and loyalty points" },
  { title: "3-Point Program", href: "/3pointprogram", desc: "Boost your brand in 3 focused sessions" },
  { title: "Booking", href: "/booking-calendar/photoshoot", desc: "Book a photoshoot or consultation" },
  { title: "Search", href: "/search", desc: "Search the entire WYZ Design site" },
  { title: "Sitemap", href: "/sitemap.xml", desc: "XML sitemap of all pages" },
  { title: "Privacy Policy", href: "/privacy-policy", desc: "How we handle your data" },
  { title: "Terms of Service", href: "/terms-and-conditions", desc: "Terms and conditions" },
];

function simpleTextSearch(query: string, limit: number): StaticResult[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return STATIC_PAGES.filter((p) => {
    const title = p.title.toLowerCase();
    const desc = p.desc.toLowerCase();
    const hay = `${title} ${desc}`;
    return words.some((w) => hay.includes(w));
  }).slice(0, limit);
}

async function qdrantSearchFallback(query: string, limit: number) {
  const { qdrantSearch } = await import("@/lib/wyzmind");
  return qdrantSearch(query, limit);
}

/**
 * Performs search. On Vercel: static page matching. Locally: Qdrant vector search.
 * @method GET, POST
 * @request Query `?q=...` or Body `{ query: string }`
 * @response JSON with results array
 */
export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q") || req.nextUrl.searchParams.get("query") || "";
    if (!query) return NextResponse.json({ results: [] });

    if (IS_VERCEL) {
      const results = simpleTextSearch(query, 10);
      return NextResponse.json({ results });
    }

    const results = await qdrantSearchFallback(query, 10);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 });

    if (IS_VERCEL) {
      const results = simpleTextSearch(query, 10);
      return NextResponse.json({ results });
    }

    const results = await qdrantSearchFallback(query, 10);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
