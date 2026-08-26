import { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { validateCsrf } from "@/lib/csrf";

const MAX_MESSAGES = 20;
const MAX_CONTENT_CHARS = 2000;

interface ChatMessage {
  role: string;
  content: string;
}

const KNOWLEDGE = `You are the WYZ Design AI assistant. You help visitors learn about services, pricing, booking, and the brand. Be concise, personable, and helpful. Use contractions. No em dashes. No AI jargon.

## ABOUT WYZ DESIGN
WYZ Design is a creative agency founded by Torreé Marcel Harris, based in Los Angeles and Chicago. We work with startup businesses, individual artists, and established companies. Our motto: "Built by Artists, for Artists."

VALUES: Show Up and Do the Work (no outsourcing), Creativity Earns Real Money (real work, real compensation), Fast Never Sloppy (speed from skill, not shortcuts), Built by Artists for Artists (we build what we wish existed).

We work with clients remotely anywhere in the world. Contact: info@wyzdesign.com, (213) 399-9610.

## SERVICES (all flat-rate, no hidden fees)
- Photoshoot: $100/hr — portraits, headshots, creative work, product photography
- Photo Retouching: $50 — basic to advanced professional retouching
- Event Photography: $200/3hr — live events, concerts, showcases, private functions
- Graphic Design: $150/3hr — logos, branding, marketing materials
- Logo Design: $100/3hr — custom logos with research and brainstorming
- Brand Identity Package: $300/6hr — complete brand system: logo, colors, typography, guidelines
- Video Shoot: $200/3hr — professional video production and visual storytelling
- Video Editing: $200/4hr — premium editing with latest software
- Motion Graphics: $150/2hr — custom animated graphics for promotional content
- Website Design: $500/3hr — professional website design and organization
- SEO Audit: $50/1hr — in-depth website audit for growth strategy
- Creative Consultation: Free/30min — no-pressure game plan session
- Logo Consultation: $50/2hr — in-depth research and brainstorming
- Marketing Consultation: $50/1hr — straightforward marketing advice

## SUBSCRIPTION PLANS
- Starter Pack: $250/mo ($725 value) — 1 photoshoot, 1 video promo, 1 graphic design, marketing consultations, Zeal Rewards perks
- Business Boost: $500/mo ($2,025 value) — 3 graphic designs, 2 photoshoots, 2 video shoots, $100 printing, consultations (MOST POPULAR)
- Pro Plus: $750/mo ($1,425 value) — 3 photoshoots, 3 designs, 3 video shoots, $250 printing, consultations
- Ultimate Suite: $1,000/mo ($5,000+ value) — unlimited everything plus web design, event planning, dedicated support
All plans auto-renew monthly. Cancel anytime.

## WEB DESIGN ADD-ON PLANS
- Startup: $500/mo — launch your business online
- Artist: $250/mo — everything independent artists need
- Enterprise: $750/mo — full-service power plan

## MERCH (WYZ Crown clothing line)
Shop at /merch. Products: denim tees ($35), zip-up hoodies ($65), hooded long sleeves ($45), cropped hoodies ($55), ribbed beanies ($25), snapback caps ($33), crop tops ($30), denim tote bags ($40), ceramic mugs ($15), stainless tumblers ($28), embroidered patches ($12), embroidered socks ($30), water bottles ($22), organic aprons ($32).
Concept Archive at /merch/concepts — each design has a name and story.

## PHOTOGRAPHY
Categories: Events, Outdoors, Studio, Boudoir, Bodypaint, Urbex, Products, Conceptual.
78+ models in archive. 500+ photos. Auto-scrolling filmstrips showcase the work.
Book a photoshoot: /booking-calendar/photoshoot
Book event photography: /booking-calendar/event-photography

## PRINTING
Paper types: Premium Gloss, Matte Photo, Luster/Pearl, Satin/Semi-Gloss.
Sticker cuts: Kiss Cut (vinyl only, peel-off backing) and Die Cut (custom shape).
Products: vinyl stickers, prints/posters, buttons, business cards, flyers, banners.
Get a quote at /printing.

## ZEAL REWARDS
Our loyalty program is Zeal Rewards and points are called Zeal. Four tiers:
- Recruit (0 Zeal): where everyone starts
- Zealot (500 Zeal): early perks and bonus quest access
- Champion (2,000 Zeal): bigger perks and priority drops
- Legend (5,000 Zeal): top-tier perks and VIP treatment
Earn Zeal: daily login (+2), newsletter signup (+50), consultation booking (+100), purchases (1 Zeal per $1), referrals (+500). Quests, achievements, and hidden easter eggs award bonus Zeal too.

## EVENTS
We curate and cover events: concerts, showcases, private functions. Past events include live performances, art shows, and community gatherings. Event photography starts at $200. See /events.

## BOOKING
Free creative consultation: /booking
Quick booking: /booking-calendar/photoshoot, /booking-calendar/event-photography
Email: info@wyzdesign.com
Phone: (213) 399-9610

## FAQ HIGHLIGHTS
- We work with startups, artists, and established companies
- We handle the full creative process: design, photo, video, web, printing, events
- Remote clients welcome worldwide
- Custom printing for business cards, flyers, stickers, posters, banners
- Event planning from concept to execution
- Quality guaranteed — we work closely with every client

## BEHAVIOR
- If someone seems ready to book, direct them to /booking
- If they want pricing, summarize the relevant service or plan
- If they ask about merch, mention the Concept Archive too
- Keep responses under 3 sentences unless they ask for detail
- Be warm and direct, not corporate`;

export async function POST(req: NextRequest) {
  try {
    if (!validateCsrf(req)) {
      return new Response("Invalid origin", { status: 403 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await rateLimit(`chat:${ip}`, 20, 60_000);
    if (!rl.ok) return new Response("Too many requests", { status: 429 });

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
      return new Response("Invalid messages", { status: 400 });
    }

    // Clamp before forwarding: cap history size and truncate oversized content
    const clampedMessages: ChatMessage[] = messages
      .map((m): ChatMessage => ({
        role: m?.role === "assistant" ? "assistant" : "user",
        content: typeof m?.content === "string" ? m.content.slice(0, MAX_CONTENT_CHARS) : "",
      }))
      .filter((m) => m.content.trim().length > 0);

    if (clampedMessages.length === 0) {
      return new Response("Invalid messages", { status: 400 });
    }

    const lastMsg = clampedMessages[clampedMessages.length - 1];

    // Keep only last 10 messages for context window
    const recentMessages = clampedMessages.slice(-10);

    const systemMessage = { role: "system", content: KNOWLEDGE };
    const allMessages = [systemMessage, ...recentMessages];

    // Try Ollama first (Shadow PC GPU tunnel). Bounded with a hard timeout so an
    // unreachable/slow tunnel can't stall the whole request up to Vercel's
    // maxDuration (30s per vercel.json) before the reliable fallback ever runs —
    // that stall is what was showing as a permanent "..." in the widget in prod.
    try {
      const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11435";
      const ollamaController = new AbortController();
      const ollamaTimeout = setTimeout(() => ollamaController.abort(), 3500);
      let ollamaRes: Response;
      try {
        ollamaRes = await fetch(`${ollamaUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "deepseek-coder:6.7b",
            messages: allMessages,
            stream: true,
          }),
          signal: ollamaController.signal,
        });
      } finally {
        clearTimeout(ollamaTimeout);
      }

      if (ollamaRes.ok && ollamaRes.body) {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        const reader = ollamaRes.body.getReader();

        const stream = new ReadableStream({
          async start(controller) {
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n").filter(Boolean);
                for (const line of lines) {
                  try {
                    const parsed = JSON.parse(line);
                    if (parsed.message?.content) {
                      controller.enqueue(encoder.encode(parsed.message.content));
                    }
                  } catch {}
                }
              }
            } catch {}
            controller.close();
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Transfer-Encoding": "chunked",
          },
        });
      }
    } catch {}

    // Fallback: smart pattern matching
    const lastUser = lastMsg?.content?.toLowerCase() || "";
    let response = "";

    if (lastUser.includes("price") || lastUser.includes("cost") || lastUser.includes("how much")) {
      response = "Our services start at free (creative consultation!) and go up from there. Photoshoots are $100/hr, graphic design $150/3hr, video $200/3hr. Our subscription plans offer the best value: Starter $250/mo, Business Boost $500/mo (most popular), Pro Plus $750/mo, Ultimate Suite $1,000/mo. Want me to break down what's included?";
    } else if (lastUser.includes("book") || lastUser.includes("schedule")) {
      response = "You can book a free 30-minute creative consultation right now at /booking. For quick booking, we have /booking-calendar/photoshoot and /booking-calendar/event-photography. No pressure, just a game plan for your brand.";
    } else if (lastUser.includes("service") || lastUser.includes("what do you") || lastUser.includes("offer")) {
      response = "We handle the full creative process: photography ($100/hr), graphic design ($150/3hr), video production ($200/3hr), web design ($500+), printing, and events. We also have a merch line and Zeal Rewards. Everything is flat-rate pricing. Want details on any specific service?";
    } else if (lastUser.includes("plan") || lastUser.includes("subscription")) {
      response = "We have 4 subscription plans: Starter ($250/mo) for basics, Business Boost ($500/mo) for growing brands (most popular), Pro Plus ($750/mo) for serious creators, and Ultimate Suite ($1,000/mo) for full-service everything. All include Zeal Rewards perks and consultations.";
    } else if (lastUser.includes("merch") || lastUser.includes("shop") || lastUser.includes("clothing")) {
      response = "Check out our WYZ Crown merch at /merch: denim tees, hoodies, beanies, caps, mugs, tumblers, patches, socks. We also have a Concept Archive at /merch/concepts where each design has a name and story. Every purchase supports the crew.";
    } else if (lastUser.includes("loyalty") || lastUser.includes("reward") || lastUser.includes("point")) {
      response = "It's called Zeal Rewards and points are called Zeal. Four tiers: Recruit (0), Zealot (500), Champion (2,000), Legend (5,000). Earn Zeal with daily logins (+2), newsletter signups (+50), consultation bookings (+100), purchases (1 Zeal per $1), and referrals (+500). Quests, achievements, and easter eggs award bonus Zeal too.";
    } else if (lastUser.includes("photo") || lastUser.includes("camera") || lastUser.includes("shoot")) {
      response = "Photography starts at $100/hr. We cover Events, Outdoors, Studio, Boudoir, Bodypaint, Urbex, Products, and Conceptual. 78+ models in our archive. Book at /booking-calendar/photoshoot or /booking-calendar/event-photography.";
    } else if (lastUser.includes("web") || lastUser.includes("website") || lastUser.includes("site")) {
      response = "Website design starts at $500 for up to 5 pages. We also have web design add-on plans: Startup ($500/mo), Artist ($250/mo), Enterprise ($750/mo). All sites are modern, responsive, and built to convert visitors into customers.";
    } else if (lastUser.includes("print") || lastUser.includes("sticker") || lastUser.includes("flyer")) {
      response = "We offer custom printing: vinyl stickers, prints/posters, buttons, business cards, flyers, banners. Paper types include Premium Gloss, Matte, Luster/Pearl, and Satin. Sticker cuts: Kiss Cut and Die Cut. Get a quote at /printing.";
    } else if (lastUser.includes("event")) {
      response = "We curate and cover events: concerts, showcases, private functions. Event photography starts at $200/3hr. We handle everything from concept to execution. See /events or book at /booking-calendar/event-photography.";
    } else if (lastUser.includes("consult")) {
      response = "Free creative consultation (30 min) at /booking. We also offer Logo Consultation ($50/2hr) and Marketing Consultation ($50/1hr). No pressure, just a clear game plan for your brand.";
    } else if (lastUser.includes("hello") || lastUser.includes("hi") || lastUser.includes("hey") || lastUser.includes("what's up")) {
      response = "Hey! Welcome to WYZ Design. I can help you learn about our services, check pricing, or get you booked. What are you looking for?";
    } else if (lastUser.includes("who") || lastUser.includes("about") || lastUser.includes("founder")) {
      response = "WYZ Design was founded by Torreé Marcel Harris. We're a creative agency based in LA and Chicago, working with startups, artists, and established companies. Our motto: Built by Artists, for Artists. Remote clients welcome worldwide.";
    } else if (lastUser.includes("thank")) {
      response = "You're welcome! If you need anything else, I'm here. Have a great day!";
    } else {
      response = "I can help with that! Here's what I know best: our services (photography, design, video, web, printing), pricing (starting free for consultations), subscription plans ($250-$1,000/mo), merch, Zeal Rewards, and booking. What would you like to know more about?";
    }

    // Simulate streaming
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        let i = 0;
        const interval = setInterval(() => {
          if (i < response.length) {
            controller.enqueue(encoder.encode(response.slice(i, i + 3)));
            i += 3;
          } else {
            clearInterval(interval);
            controller.close();
          }
        }, 15);
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch {
    return new Response("Error processing request", { status: 500 });
  }
}
