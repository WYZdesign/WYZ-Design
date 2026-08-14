import type { Metadata } from "next";

const BASE = "https://www.wyzdesign.com";
const OG_IMAGE = `${BASE}/wyz-og-image.png`;
const LOGO = `${BASE}/wyz-crown-square.png`;

export const BRAND = {
  name: "WYZ Design",
  tagline: "Creative Direction & Production",
  description: "Photography, graphic design, web design, videography, branding, and printing. Los Angeles + Chicago. Sharp creative work that does what it's supposed to do.",
  shortDesc: "Creative direction and production agency in Los Angeles.",
  url: BASE,
  ogImage: OG_IMAGE,
  logo: LOGO,
  phone: "+1-213-399-9610",
  email: "info@wyzdesign.com",
  socials: {
    instagram: "https://instagram.com/wyzdesign",
    facebook: "https://facebook.com/wyzdesign",
    tiktok: "https://tiktok.com/@wyzdesign",
    youtube: "https://youtube.com/channel/UCfd75GcUKsGqWo-sgSQjZBg",
    linkedin: "https://linkedin.com/in/torre-harris",
  },
  location: "Los Angeles, CA",
  keywords: ["WYZ Design", "creative agency", "Los Angeles", "photography", "graphic design", "branding", "web design", "printing", "event production", "videography"],
} as const;

type PageSEO = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  noindex?: boolean;
  priority?: number;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
};

export const PAGES: Record<string, PageSEO> = {
  home: {
    title: "WYZ Design | Creative Direction & Production - Los Angeles",
    description: "WYZ Design is the creative problem you hire when your brand is tired of looking like it was designed by a committee. Photography, design, web, print, motion. Los Angeles.",
    path: "",
    keywords: ["creative agency Los Angeles", "photography", "graphic design", "web design", "branding", "printing", "event production"],
    priority: 1,
    changeFrequency: "weekly",
  },
  about: {
    title: "About",
    description: "Founded by Torreé Marcel, WYZ Design is a creative agency built from Chicago's DIY art and music scene. Over 60 events produced, 30+ clients supported. Now based in Los Angeles.",
    path: "/about",
    keywords: ["WYZ Design founder", "Torreé Marcel", "creative agency story", "Los Angeles creative"],
    priority: 0.7,
    changeFrequency: "yearly",
  },
  services: {
    title: "Services",
    description: "Professional photography, graphic design, videography, web design, branding, and consultation services. Transparent pricing, fast turnaround. Book online today.",
    path: "/services",
    keywords: ["creative services", "photography services", "graphic design services", "web design services", "branding services", "Los Angeles"],
    priority: 0.9,
    changeFrequency: "monthly",
  },
  photography: {
    title: "Photography",
    description: "Professional photography services — portraits, events, editorial, and commercial. High-resolution images with 24-hour turnaround. Book your session now.",
    path: "/photography",
    keywords: ["professional photography", "portrait photography", "event photography", "Los Angeles photographer", "editorial photography"],
    priority: 0.9,
    changeFrequency: "weekly",
  },
  events: {
    title: "Events & Event Production",
    description: "Event production, concert photography, and promotional content creation. From concept to curtains — flyers, social rollout, photo/video recap. Book your event.",
    path: "/events",
    keywords: ["event production", "concert photography", "event flyers", "Los Angeles events", "event planning"],
    priority: 0.8,
    changeFrequency: "weekly",
  },
  designs: {
    title: "Design Portfolio",
    description: "Logo design, branding, flyers, album covers, and graphic design portfolio. See our latest work for artists, brands, and businesses across Los Angeles.",
    path: "/designs",
    keywords: ["graphic design portfolio", "logo design", "branding design", "flyer design", "album cover design"],
    priority: 0.8,
    changeFrequency: "weekly",
  },
  "web-design": {
    title: "Web Design",
    description: "Custom website design and development. No templates, no cookie-cutter solutions. Fast, responsive, SEO-optimized websites that actually convert. Starting at $500.",
    path: "/web-design",
    keywords: ["web design", "website development", "custom website", "responsive design", "SEO website", "Los Angeles web design"],
    priority: 0.8,
    changeFrequency: "monthly",
  },
  printing: {
    title: "Digital Printing",
    description: "Professional digital printing for stickers, flyers, prints, and posters. Premium paper stocks, vibrant colors, fast turnaround. Order online.",
    path: "/printing",
    keywords: ["digital printing", "sticker printing", "flyer printing", "poster printing", "print shop Los Angeles"],
    priority: 0.7,
    changeFrequency: "monthly",
  },
  plans: {
    title: "Pricing Plans",
    description: "Flexible monthly plans for brands, studios, and businesses. From $250/mo — design tasks, strategy calls, content, event support. Cancel anytime.",
    path: "/plans",
    keywords: ["creative agency pricing", "monthly retainer", "branding plan", "design subscription", "creative services pricing"],
    priority: 0.7,
    changeFrequency: "monthly",
  },
  blog: {
    title: "Blog",
    description: "Insights on creative direction, branding, photography, web design, and the business of making things that look good. From the WYZ Design team.",
    path: "/blog",
    keywords: ["creative blog", "design tips", "branding advice", "photography tips", "web design trends"],
    priority: 0.7,
    changeFrequency: "daily",
  },
  contact: {
    title: "Contact",
    description: "Get in touch with WYZ Design. Book a free consultation, ask about services, or start your next project. Based in Los Angeles, serving clients nationwide.",
    path: "/contact",
    keywords: ["contact WYZ Design", "book consultation", "creative agency contact", "Los Angeles design"],
    priority: 0.6,
    changeFrequency: "yearly",
  },
  faq: {
    title: "FAQ",
    description: "Frequently asked questions about WYZ Design services, pricing, turnaround times, booking, and more. Get instant answers to common questions.",
    path: "/faq",
    keywords: ["WYZ Design FAQ", "creative services questions", "photography pricing", "web design cost"],
    priority: 0.5,
    changeFrequency: "yearly",
  },
  merch: {
    title: "Merch Store",
    description: "Official WYZ Design merchandise — hoodies, tees, accessories. Premium quality streetwear inspired by the creative community.",
    path: "/merch",
    keywords: ["WYZ Design merch", "streetwear", "creative agency merchandise", "designer clothing"],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "gift-card": {
    title: "Gift Cards",
    description: "Give the gift of creative work. WYZ Design gift cards are perfect for anyone who needs photography, design, or branding help. Digital delivery.",
    path: "/gift-card",
    keywords: ["creative gift card", "photography gift card", "design gift card", "WYZ Design gift"],
    priority: 0.6,
    changeFrequency: "yearly",
  },
  "featured-artist": {
    title: "Featured Artist of the Month",
    description: "WYZ Design spotlights emerging artists, musicians, and creatives. Get featured — submit your work for a chance to be highlighted on our platform.",
    path: "/featured-artist",
    keywords: ["featured artist", "emerging artist", "artist spotlight", "creative showcase"],
    priority: 0.7,
    changeFrequency: "weekly",
  },
  "model-archive": {
    title: "Model Archive",
    description: "Meet the models and talent behind WYZ Design's portfolio. Browse our roster of professional models available for shoots and collaborations.",
    path: "/model-archive",
    keywords: ["model portfolio", "talent roster", "model booking", "photography models"],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  gallery: {
    title: "Gallery",
    description: "Browse the WYZ Design gallery — photography, design work, events, and creative projects. Visual storytelling at its finest.",
    path: "/gallery",
    keywords: ["creative gallery", "photography gallery", "design portfolio", "visual portfolio"],
    priority: 0.6,
    changeFrequency: "weekly",
  },
  community: {
    title: "Community",
    description: "Join the WYZ Design creative community. Connect with artists, designers, photographers, and brands building something real.",
    path: "/community",
    keywords: ["creative community", "artist network", "design community Los Angeles"],
    priority: 0.5,
    changeFrequency: "weekly",
  },
  partnerships: {
    title: "Partnerships",
    description: "Partner with WYZ Design for brand collaborations, creative campaigns, and strategic alliances. Let's build something together.",
    path: "/partnerships",
    keywords: ["brand partnership", "creative collaboration", "business partnership"],
    priority: 0.5,
    changeFrequency: "monthly",
  },
  wyzmind: {
    title: "WYZMiND Systems",
    description: "AI-powered creative infrastructure — intake bots, client portals, booking automation, workflow intelligence. Technology that scales your creative business.",
    path: "/wyzmind",
    keywords: ["AI creative tools", "client portal", "booking automation", "workflow intelligence"],
    priority: 0.7,
    changeFrequency: "monthly",
  },
  search: {
    title: "Search",
    description: "Search WYZ Design — find services, portfolio work, articles, and resources across our entire platform.",
    path: "/search",
    noindex: true,
    priority: 0.3,
    changeFrequency: "yearly",
  },
  "case-studies": {
    title: "Case Studies",
    description: "See how WYZ Design has helped brands and artists transform their creative presence. Real results, real projects, real impact.",
    path: "/case-studies",
    keywords: ["creative case studies", "design portfolio", "client results"],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "case-studies-artfinix": {
    title: "Case Study: Artfinix",
    description: "How WYZ Design helped Artfinix build a complete brand identity — from logo to web to social presence.",
    path: "/case-studies/artfinix",
    keywords: ["Artfinix", "brand identity", "case study"],
    priority: 0.5,
    changeFrequency: "yearly",
  },
  "case-studies-kid-bode": {
    title: "Case Study: Kid Bode",
    description: "How WYZ Design partnered with Kid Bode for event production, promotional content, and brand growth.",
    path: "/case-studies/kid-bode",
    keywords: ["Kid Bode", "event production", "case study"],
    priority: 0.5,
    changeFrequency: "yearly",
  },
  "service-photoshoot": {
    title: "Photoshoot Service",
    description: "Professional photoshoot sessions starting at $100/hr. Includes lighting, creative direction, and 20+ edited high-resolution images. Book now.",
    path: "/service-page/photoshoot",
    keywords: ["photoshoot booking", "professional photoshoot", "portrait session", "Los Angeles photoshoot"],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "service-retouching": {
    title: "Photo Retouching Service",
    description: "Professional photo retouching from basic cleanup to advanced editing. Fast turnaround, transparent pricing. Starting at $50.",
    path: "/service-page/photo-retouching",
    keywords: ["photo retouching", "image editing", "professional retouching"],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "service-event-photo": {
    title: "Event Photography Service",
    description: "Expert event photography — concerts, showcases, private events, corporate functions. Starting at $200 for 3 hours. Book today.",
    path: "/service-page/event-photography",
    keywords: ["event photography", "concert photography", "event documentation"],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "service-consultation": {
    title: "Creative Consultation",
    description: "Free creative consultation to unleash your brand's potential. Expert strategy sessions with actionable steps. Book your free call.",
    path: "/service-page/creative-consultation",
    keywords: ["creative consultation", "brand strategy", "free consultation"],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "booking-photoshoot": {
    title: "Book a Photoshoot",
    description: "Book your photoshoot session with WYZ Design. Choose your date, time, and package. Secure your spot online.",
    path: "/booking-calendar/photoshoot",
    noindex: true,
    priority: 0.5,
  },
  "booking-retouching": {
    title: "Book Photo Retouching",
    description: "Submit your photos for professional retouching. Upload, describe your needs, and get a quote.",
    path: "/booking-calendar/photo-retouching",
    noindex: true,
    priority: 0.5,
  },
  "booking-event-photo": {
    title: "Book Event Photography",
    description: "Book event photography for your concert, showcase, or private event. Check availability and pricing.",
    path: "/booking-calendar/event-photography",
    noindex: true,
    priority: 0.5,
  },
  "booking-consultation": {
    title: "Book a Consultation",
    description: "Schedule a free creative consultation. Pick a time that works for you and let's discuss your project.",
    path: "/booking-calendar/consultation",
    noindex: true,
    priority: 0.5,
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description: "How WYZ Design collects, uses, and protects your personal information. GDPR-compliant privacy policy.",
    path: "/privacy-policy",
    priority: 0.2,
    changeFrequency: "yearly",
  },
  "terms-and-conditions": {
    title: "Terms & Conditions",
    description: "Terms of service for using WYZ Design's website and services. Read our policies on bookings, payments, and usage.",
    path: "/terms-and-conditions",
    priority: 0.2,
    changeFrequency: "yearly",
  },
  "refund-return-policy": {
    title: "Refund & Return Policy",
    description: "WYZ Design's refund and return policy for services and merchandise. Fair terms, transparent process.",
    path: "/refund-return-policy",
    priority: 0.2,
    changeFrequency: "yearly",
  },
  "shipping-policy": {
    title: "Shipping Policy",
    description: "Shipping rates, delivery times, and policies for WYZ Design merchandise orders. Domestic and international shipping.",
    path: "/shipping-policy",
    priority: 0.2,
    changeFrequency: "yearly",
  },
  "copyright-notice": {
    title: "Copyright Notice",
    description: "Copyright information for WYZ Design. All rights reserved. Terms for using our creative work and intellectual property.",
    path: "/copyright-notice",
    priority: 0.2,
    changeFrequency: "yearly",
  },
};

export function getPageSEO(pageKey: string): Metadata {
  const page = PAGES[pageKey];
  if (!page) return {};

  const canonical = `${BASE}${page.path}`;
  const ogImage = page.ogImage || OG_IMAGE;

  return {
    title: page.title.includes("WYZ Design") ? page.title : undefined,
    description: page.description,
    keywords: page.keywords || [...BRAND.keywords],
    robots: page.noindex ? { index: false, follow: true } : { index: true, follow: true },
    alternates: {
      canonical,
    },
    openGraph: {
      title: page.title.includes("WYZ Design") ? page.title : `${page.title} | WYZ Design`,
      description: page.description,
      url: canonical,
      siteName: BRAND.name,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${page.title} - ${BRAND.name}` }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title.includes("WYZ Design") ? page.title : `${page.title} | WYZ Design`,
      description: page.description,
      images: [ogImage],
    },
  };
}
