import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeHtml } from "@/lib/dompurify";
import { getServiceClient } from "@/lib/supabase";
import { logger } from "@/lib/logger";

const PAGES_DIR = join(process.cwd(), "_PAGES");
const ALLOWED_PAGES = new Set(["home", "about", "photography", "designs", "events", "services", "plans", "merch", "faq", "blog", "booking", "community", "contact", "web-design", "printing", "gift-card", "3pointprogram", "model-archive"]);

const WIX_TEMPLATE = `<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',-apple-system,sans-serif;font-size:22px;color:#333;background:#FEFEFD;line-height:1.75;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4,h5,h6{font-family:'Montserrat',sans-serif;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#333}
a{color:#DF3131;text-decoration:none}a:hover{color:#B82020}img{max-width:100%}
.wyz-red{color:#DF3131}.wyz-gold{color:#D49341}.wyz-bg-red{background:#DF3131}.wyz-bg-white{background:#fff}.wyz-bg-offwhite{background:#FEFEFD}
.wyz-container{max-width:115rem;margin:0 auto;padding:0 2rem}.wyz-container-sm{max-width:50rem;margin:0 auto;padding:0 2rem}
.wyz-navbar{background:#fff;border-bottom:1px solid #E2E2E2;position:sticky;top:0;z-index:50}.wyz-nav-inner{max-width:115rem;margin:0 auto;padding:0 2rem;display:flex;align-items:center;justify-content:space-between;height:6rem}
.wyz-logo{font-family:'Montserrat',sans-serif;font-weight:900;font-size:1.5rem;letter-spacing:.05em;color:#333}.wyz-nav-links{display:flex;gap:1.5rem}.wyz-nav-links a{color:#333;font-size:.8rem;letter-spacing:.15em;font-weight:600;text-transform:uppercase}
.wyz-hero-section{padding:8rem 2rem 6rem;text-align:center;background:#FEFEFD;position:relative;overflow:hidden}
.wyz-hero-section::before{content:'';position:absolute;inset:0;opacity:.03;background-image:radial-gradient(circle at 50% 50%,#DF3131 1px,transparent 1px);background-size:40px 40px;pointer-events:none}
.wyz-hero-title{font-family:'Montserrat',sans-serif;font-size:clamp(3rem,8vw,7rem);font-weight:900;line-height:.95;letter-spacing:.03em}
.wyz-hero-text{font-size:1.15rem;color:#666;max-width:650px;margin:1.5rem auto;line-height:1.7}
.wyz-section{padding:5rem 0}.wyz-section-title{text-align:center;font-size:2rem;letter-spacing:.15em;margin-bottom:2.5rem}.wyz-subtitle{text-align:center;font-size:1.5rem;letter-spacing:.1em;margin-bottom:2rem}.wyz-subtext{text-align:center;color:#666;font-size:1rem;margin-top:-1.5rem;margin-bottom:2.5rem}
.wyz-card{border:1px solid #E2E2E2;background:#fff;padding:1.5rem}.wyz-card:hover{border-color:#DF3131}
.wyz-card-center{text-align:center}.wyz-card-featured{border-color:#DF3131;position:relative}.wyz-card-icon{font-size:2rem;margin-bottom:.5rem}.wyz-card-label{font-size:.75rem;font-weight:700;letter-spacing:.1em;margin-top:.5rem}
.wyz-card-img{aspect-ratio:16/10;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:2.5rem;margin:-1.5rem -1.5rem 1rem}
.wyz-card-title{font-size:1.1rem;margin-bottom:.5rem}.wyz-card-desc{font-size:.9rem;color:#666;line-height:1.6;margin-bottom:.75rem}
.wyz-card-footer{display:flex;justify-content:space-between;padding-top:.75rem;border-top:1px solid #E2E2E2;font-size:.8rem}.wyz-card-accent{height:4px;margin:-1.5rem -1.5rem 1.5rem}
.wyz-price{font-weight:700}.wyz-price-big{font-size:2.25rem;font-weight:900;margin:.75rem 0}.wyz-price-big span{font-size:.9rem;font-weight:400;color:#666}
.wyz-value{font-size:.7rem;color:#DF3131;font-weight:600;margin-bottom:1rem}.wyz-feature-list{list-style:none;padding:0;margin:1rem 0;text-align:left;font-size:.8rem;color:#666;line-height:2.2}
.wyz-badge{background:#DF3131;color:#fff;font-size:.6rem;font-weight:700;padding:.25rem .75rem;display:inline-block;margin:-1.5rem auto 1rem;letter-spacing:.05em}
.wyz-services-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:.5rem;margin-bottom:2.5rem}.wyz-booking-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
.wyz-pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.25rem}.wyz-cta-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
.wyz-clients-row{display:flex;gap:1.5rem;justify-content:center;flex-wrap:wrap}.wyz-client-logo{width:5rem;height:5rem;background:#f5f5f5;border:1px solid #E2E2E2}
.wyz-faq-list{display:flex;flex-direction:column;gap:.5rem}.wyz-faq-item{border:1px solid #E2E2E2;background:#fff;padding:1.25rem}.wyz-faq-q{font-weight:600;font-size:1rem}.wyz-faq-a{color:#666;font-size:.9rem;margin-top:.5rem;line-height:1.6}
.wyz-btn{display:inline-block;padding:1rem 2.2rem;font-size:.9rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;border:none;cursor:pointer;text-decoration:none;transition:background .2s}.wyz-btn-red{background:#DF3131;color:#fff}.wyz-btn-red:hover{background:#B82020;color:#fff}.wyz-btn-dark{background:#333;color:#fff;border:1px solid #333}.wyz-btn-dark:hover{background:#444;color:#fff}
.wyz-link{font-size:.8rem;font-weight:700;letter-spacing:.05em}.wyz-link-arrow::after{content:' →'}
.wyz-footer{background:#fff;border-top:1px solid #E2E2E2;padding:3rem 0}.wyz-footer-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;margin-bottom:2rem}.wyz-footer-title{font-size:.9rem;letter-spacing:.1em;margin-bottom:1rem}.wyz-footer a,.wyz-footer-text{display:block;font-size:.8rem;color:#666;line-height:2}.wyz-footer a:hover{color:#DF3131}.wyz-footer-bottom{text-align:center;font-size:.75rem;color:#999;padding-top:1.5rem;border-top:1px solid #E2E2E2}.wyz-socials{display:flex;gap:.75rem;margin-top:1rem;font-size:1.25rem}
@media(max-width:768px){.wyz-services-grid{grid-template-columns:repeat(3,1fr)}.wyz-booking-grid,.wyz-cta-grid,.wyz-footer-grid{grid-template-columns:1fr}.wyz-nav-links{display:none}}
</style>
<nav class="wyz-navbar"><div class="wyz-nav-inner"><a href="/" class="wyz-logo">WYZ <span class="wyz-red">Design</span></a><div class="wyz-nav-links"><a href="/photography">PHOTOGRAPHY</a><a href="/designs">DESIGNS</a><a href="/events">EVENTS</a><a href="/services">SERVICES</a><a href="/plans">PLANS</a><a href="/faq">FAQ</a></div></div></nav>
<section class="wyz-hero-section"><div class="wyz-container"><h1 class="wyz-hero-title">YOUR ONE <span class="wyz-red">STOP SHOP</span></h1><p class="wyz-hero-text">WYZ Design™ (pronounced "wise") helps startups and established brands stand out with photography, videography, graphic and web design, custom printing, event planning, marketing consulting, and SEO audits. Every project is built to make your brand look sharper and reach more people, with flexible packages that fit your budget.</p><a href="/services" class="wyz-btn wyz-btn-red">Get Started</a></div></section>
<section class="wyz-section wyz-bg-white"><div class="wyz-container"><h2 class="wyz-section-title">SERVICES</h2><div class="wyz-services-grid"><a href="/photography" class="wyz-card wyz-card-center"><div class="wyz-card-icon">📸</div><p class="wyz-card-label">Photography</p></a><a href="/designs" class="wyz-card wyz-card-center"><div class="wyz-card-icon">🎨</div><p class="wyz-card-label">Graphic Design</p></a><a href="/services" class="wyz-card wyz-card-center"><div class="wyz-card-icon">🎬</div><p class="wyz-card-label">Videography</p></a><a href="/services" class="wyz-card wyz-card-center"><div class="wyz-card-icon">💡</div><p class="wyz-card-label">Consultation</p></a><a href="/web-design" class="wyz-card wyz-card-center"><div class="wyz-card-icon">🌐</div><p class="wyz-card-label">Web Design</p></a></div><h3 class="wyz-subtitle">Service Information</h3><div class="wyz-booking-grid"><div class="wyz-card"><div class="wyz-card-img">📸</div><h4 class="wyz-card-title">Photoshoot</h4><p class="wyz-card-desc">Capture authentic moments with sleek, professional photography.</p><a href="/booking-calendar/photoshoot" class="wyz-link">Read More</a><div class="wyz-card-footer"><span>1 hr</span><span class="wyz-price">$100</span></div></div><div class="wyz-card"><div class="wyz-card-img">🖼</div><h4 class="wyz-card-title">Photo Retouching</h4><p class="wyz-card-desc">Basic to Advanced Professional Photo Retouching</p><a href="/booking-calendar/photo-retouching" class="wyz-link">Read More</a><div class="wyz-card-footer"><span>2 hr</span><span class="wyz-price">Varies</span></div></div><div class="wyz-card"><div class="wyz-card-img">🎉</div><h4 class="wyz-card-title">Event Photography</h4><p class="wyz-card-desc">Catching every moment, from public showcases to private events and behind-the-scenes.</p><a href="/booking-calendar/event-photography" class="wyz-link">Read More</a><div class="wyz-card-footer"><span>3 hr</span><span class="wyz-price">$200</span></div></div></div></div></section>
<section class="wyz-section wyz-bg-offwhite"><div class="wyz-container"><h2 class="wyz-section-title">pricing plans</h2><p class="wyz-subtext">Affordable Plans for Any Budget</p><div class="wyz-pricing-grid"><div class="wyz-card wyz-card-center"><div class="wyz-card-accent wyz-bg-red"></div><h4 class="wyz-card-title">Starter Pack</h4><div class="wyz-price-big">$250<span>/month</span></div><p class="wyz-value">$725 Value</p><ul class="wyz-feature-list"><li>✓ (1) Two-Hour Photoshoot</li><li>✓ (1) Video Promo + Editing</li><li>✓ (1) Free Graphic Design</li><li>✓ Marketing Consultations</li><li>✓ Zeal Rewards</li></ul><a href="/plans" class="wyz-btn wyz-btn-dark">subscribe</a></div><div class="wyz-card wyz-card-center wyz-card-featured"><div class="wyz-badge">MOST POPULAR</div><h4 class="wyz-card-title">Business Boost</h4><div class="wyz-price-big">$500<span>/month</span></div><p class="wyz-value">$2,025 Value</p><ul class="wyz-feature-list"><li>✓ (3) Graphic Designs</li><li>✓ (2) Two-Hour Photoshoots</li><li>✓ (2) Promo Video Shoots</li><li>✓ Digital Printing Service</li><li>✓ Marketing Strategy</li></ul><a href="/plans" class="wyz-btn wyz-btn-red">subscribe</a></div><div class="wyz-card wyz-card-center"><h4 class="wyz-card-title">Pro Plus</h4><div class="wyz-price-big">$750<span>/month</span></div><p class="wyz-value">$1,425 Value</p><ul class="wyz-feature-list"><li>✓ (3) Two-Hour Photoshoots</li><li>✓ (3) Graphic Designs</li><li>✓ (3) Promo Video Shoots</li><li>✓ Digital Printing Service</li><li>✓ Marketing Strategy</li></ul><a href="/plans" class="wyz-btn wyz-btn-dark">subscribe</a></div><div class="wyz-card wyz-card-center"><h4 class="wyz-card-title">Ultimate Suite</h4><div class="wyz-price-big">$1,000<span>/month</span></div><p class="wyz-value">$5,000+ Value</p><ul class="wyz-feature-list"><li>✓ Unlimited Photoshoots</li><li>✓ Unlimited Graphic Designs</li><li>✓ Unlimited Video + Editing</li><li>✓ Web Design + Maintenance</li><li>✓ Event Planning Service</li></ul><a href="/plans" class="wyz-btn wyz-btn-dark">subscribe</a></div></div></div></section>
<section class="wyz-section wyz-bg-white"><div class="wyz-container"><h2 class="wyz-section-title">Clients</h2><div class="wyz-clients-row"><div class="wyz-client-logo"></div><div class="wyz-client-logo"></div><div class="wyz-client-logo"></div><div class="wyz-client-logo"></div><div class="wyz-client-logo"></div><div class="wyz-client-logo"></div><div class="wyz-client-logo"></div><div class="wyz-client-logo"></div></div></div></section>
<section class="wyz-section wyz-bg-offwhite"><div class="wyz-container"><div class="wyz-cta-grid"><div class="wyz-card"><h4 class="wyz-card-title">GRAPHIC DESIGNS</h4><p class="wyz-card-desc">Stand out with graphic design that actually gets attention. Visit the graphic design page to browse our portfolio.</p><a href="/designs" class="wyz-link wyz-link-arrow">View Gallery</a></div><div class="wyz-card"><h4 class="wyz-card-title">PHOTOGRAPHY</h4><p class="wyz-card-desc">Photography that catches your brand at its best, from product shots to lifestyle imagery. Visit our photography page to view albums.</p><a href="/photography" class="wyz-link wyz-link-arrow">View Albums</a></div><div class="wyz-card"><h4 class="wyz-card-title">EVENT RECAPS</h4><p class="wyz-card-desc">Relive the night with our event recaps. We catch every moment so you can tell your story your way. Visit our event recaps page to see it for yourself.</p><a href="/events" class="wyz-link wyz-link-arrow">View Recaps</a></div></div></div></section>
<section class="wyz-section wyz-bg-white"><div class="wyz-container wyz-container-sm"><h2 class="wyz-section-title">Services</h2><h3 class="wyz-subtitle">FAQ</h3><div class="wyz-faq-list"><div class="wyz-faq-item"><div class="wyz-faq-q">What services does WYZ Design offer?</div><div class="wyz-faq-a">WYZ Design offers photography, graphic design, videography, web design, digital printing, and marketing/branding consultations.</div></div><div class="wyz-faq-item"><div class="wyz-faq-q">How much does a photoshoot session cost?</div><div class="wyz-faq-a">Our photoshoot sessions start at $100 per hour, including free basic retouching and a 24-hour turnaround.</div></div><div class="wyz-faq-item"><div class="wyz-faq-q">Can WYZ Design help with website design?</div><div class="wyz-faq-a">Yes, we offer professional website design services starting at a flat rate of $500 for up to 5 pages.</div></div><div class="wyz-faq-item"><div class="wyz-faq-q">Do you provide printing services?</div><div class="wyz-faq-a">Absolutely! We offer digital printing for various materials such as stickers, flyers, prints, and posters.</div></div><div class="wyz-faq-item"><div class="wyz-faq-q">Do you offer marketing consultations?</div><div class="wyz-faq-a">Yes, marketing and branding strategy consultations at $50 per hour with expert advice and actionable steps.</div></div></div></div></section>
<footer class="wyz-footer"><div class="wyz-container"><div class="wyz-footer-grid"><div><a href="/" class="wyz-logo">WYZ <span class="wyz-red">Design</span></a><p class="wyz-footer-text">Full-spectrum creative agency. Photography, design, web, print, motion. Chicago, IL.</p><div class="wyz-socials"><a href="https://twitter.com/WYZdesign">🐦</a><a href="https://www.facebook.com/wyzdesign">📘</a><a href="https://www.instagram.com/wyzdesign/">📷</a><a href="https://www.linkedin.com/in/torre%C3%A9-harris-11180b89/">💼</a><a href="https://www.tiktok.com/@wyzdesign">🎵</a><a href="https://www.youtube.com/channel/UCfd75GcUKsGqWo-sgSQjZBg">▶️</a></div></div><div><h4 class="wyz-footer-title">QUICK LINKS</h4><a href="/model-archive">Be a model</a><a href="/merch">Merch Store</a><a href="/account/my-account">Members</a><a href="/service-page/creative-consultation">Consultation</a><a href="/designs">Designs</a><a href="/photography">Photography</a></div><div><h4 class="wyz-footer-title">Legal</h4><a href="/privacy-policy">Privacy Policy</a><a href="/refund-return-policy">Return/Refund Policy</a><a href="/terms-and-conditions">Terms & Conditions</a><a href="/copyright-notice">Copyright Notice</a><a href="/shipping-policy">Shipping Policy</a></div><div><h4 class="wyz-footer-title">Contact</h4><p class="wyz-footer-text">📞 (213) 399-9610</p><p class="wyz-footer-text">✉️ info@wyzdesign.com</p><p class="wyz-footer-text">📍 Los Angeles, CA + Chicago, IL</p></div></div><p class="wyz-footer-bottom">© 2025 WYZ Design LLC. All rights reserved.</p></div></footer>`;

/**
 * Returns HTML content for a named page, or the default WYZ template if not found.
 * @method GET
 * @request Query param `page` (default "home") — page name
 * @response JSON with html string and exists boolean
 * @auth None
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = url.searchParams.get("page") || "home";
  
  if (!ALLOWED_PAGES.has(page)) {
    return NextResponse.json({ error: "Invalid page" }, { status: 400 });
  }

  if (process.env.VERCEL) {
    try {
      const sb = getServiceClient();
      const { data } = await sb.from("page_content").select("html").eq("page", page).single();
      if (data?.html) return NextResponse.json({ html: data.html, exists: true });
    } catch { /* fall through to template */ }
    return NextResponse.json({ html: WIX_TEMPLATE, exists: false });
  }
  
  if (!existsSync(PAGES_DIR)) mkdirSync(PAGES_DIR, { recursive: true });
  
  const file = join(PAGES_DIR, `${page}.html`);
  if (existsSync(file)) {
    return NextResponse.json({ html: readFileSync(file, "utf-8"), exists: true });
  }
  
  return NextResponse.json({ html: WIX_TEMPLATE, exists: false });
}

/**
 * Saves HTML content for a named page to disk.
 * @method POST
 * @request Body `{ page: string, html: string }`, Header `X-Admin-Token` (must match ADMIN_PASSWORD env)
 * @response JSON with success status
 * @auth Admin token required, rate-limited (10 req/min), HTML sanitized
 */
export async function POST(req: Request) {
  const token = req.headers.get("x-admin-token") || "";
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw || token !== adminPw) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { ok, remaining } = await rateLimit(`pages:${ip}`, 10, 60_000);
  if (!ok) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const { page, html } = await req.json();
    if (!page || !html) return NextResponse.json({ error: "page and html required" }, { status: 400 });

    const pageName = page.replace(/[^a-zA-Z0-9_-]/g, "");
    if (pageName.length > 64) return NextResponse.json({ error: "Invalid page name" }, { status: 400 });
    if (!ALLOWED_PAGES.has(pageName)) return NextResponse.json({ error: "Page not allowed" }, { status: 400 });

    const cleaned = sanitizeHtml(html);

    if (process.env.VERCEL) {
      const sb = getServiceClient();
      await sb.from("page_content").upsert({ page: pageName, html: cleaned }, { onConflict: "page" });
    } else {
      if (!existsSync(PAGES_DIR)) mkdirSync(PAGES_DIR, { recursive: true });
      writeFileSync(join(PAGES_DIR, `${pageName}.html`), cleaned, "utf-8");
    }

    return NextResponse.json({ success: true, remaining });
  } catch (e: unknown) {
    logger.error("pages:POST", e);
    return NextResponse.json({ error: "Failed to save page" }, { status: 500 });
  }
}
