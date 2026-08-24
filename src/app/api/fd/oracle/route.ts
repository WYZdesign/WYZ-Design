import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const FREE_MODEL = "google/gemini-2.0-flash-exp:free";

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

const FD_KNOWLEDGE_BASE = `# FD PHOTO STUDIO: COMPLETE KNOWLEDGE BASE

## ABOUT FD
FD Photo Studio is LA's premier studio rental company with 60+ stages across LA and NY. Founded ~2017, they've hosted 200+ events. Website: fdphotostudio.com

## LA STUDIO BUILDINGS: COMPLETE INVENTORY

### OLYMPIC BUILDING: 3316 E Olympic Blvd, Los Angeles, CA 90023
| Studio | Feature | SqFt | Best For |
|--------|---------|------|----------|
| Olympic 1 (Underwater) | Large underwater tank, submerged shooting windows | 800 | Mermaid, aquatic editorial, ethereal beauty |
| Olympic 2 (Black Cyc-wall) | Black infinity cyclorama | 1,850 | Dark editorial, dramatic single-light portraits |
| Olympic 3 (Car Turntable) | Motorized rotating platform, RGB tunnel, TV wall | 2,100 | Automotive, motion, product hero shots, music videos |
| Olympic 4 (Private Jet) | Full private jet interior: cockpit + passenger cabin | 810 | Luxury fashion, travel editorial, lifestyle campaigns |
| Olympic 5 (Metal Garage) | Industrial metal, roll-up door, boxing ring | 3,500 | Urban edge, automotive, grunge fashion, streetwear |

### HILL BUILDING: 1808 S Hill St, Los Angeles, CA 90015
| Studio | Feature | SqFt | Best For |
|--------|---------|------|----------|
| Hill 1 (White Floor) | Clean white floor, modern minimal | 860 | Product, fashion, clean beauty |
| Hill 2 (Light Wall) | LED-lit wall, adjustable colors | 880+ | Edge-lit portraits, color-drenched editorial |
| Hill 3 (Mirror Wall) | Floor-to-ceiling mirrors | 1,720 | Infinite reflections, surreal compositions, dance |
| Hill 4 (Tuscan/Jungle) | Tuscan villa meets tropical jungle | 1,400 | Boho, exotic, textured lifestyle |
| Hill 5 (Pink Wall) | Full millennial pink room | 670 | Monochrome fashion, Instagram-ready beauty |
| Hill 6 (Moroccan Shower) | Ornate Moroccan tile, archways | 940 | Exotic editorial, boudoir, swimwear |
| Hill 7 (Rain Room) | Controlled rain effects, waterproof lighting | 760 | Moody water portraits, dramatic wet fashion |
| Hill 8 (Concrete Wall) | Brutalist concrete | 780 | Avant-garde, industrial, hard shadows |

### YUKON BUILDING: 12828 Yukon Ave, Hawthorne, CA 90250
| Studio | Feature | SqFt | Best For |
|--------|---------|------|----------|
| Yukon 1 (Corner Cyc) | White corner cyc wall | 1,860 | Clean product, commercial fashion |
| Yukon 2 (White Steps) | White steps with cyc wall | 1,140 | Editorial, group shots, commercial |
| Yukon 3 (Water Studio) | In-ground water pool | 1,200 | Splash, swimwear, aquatic editorial |
| Yukon 4 (Light Cube) | RGB light cube, reflective mylar | 1,860 | Neon, futuristic, color-saturated concepts |
| Yukon 5 (RGB Cave) | Fully programmable ceiling LEDs | 1,500 | Immersive color wash, music, avant-garde |

### ART BUILDING: 1048 Santee St, Los Angeles, CA 90015
| Studio | Feature | SqFt | Best For |
|--------|---------|------|----------|
| Art 1 (White Steps) | Tiered white platforms | 1,390 | Clean editorial, fashion, group |
| Art 2 (Wood Floor) | Warm wood floors, chandelier | 1,220 | Classic portraits, warm lifestyle |
| Art 3 (Flower Wall) | Massive flower wall | - | Romantic, botanical, feminine beauty |
| Art 4 (Wood Corner) | Corner windows, natural wood | 1,800 | Golden hour, natural light, intimate |

### LOFT BUILDING: DTLA
| Studio | Feature | Best For |
|--------|---------|----------|
| Loft 1 (French Loft) | Herringbone floors, ornate moldings | Classic French aesthetic, lifestyle |
| Loft 2 (Scandinavian) | Minimal Nordic, light wood | Clean modern, hygge vibes |
| Loft 3 (French Manor) | Dark wood, chandeliers | Old money, grand portraits |
| Loft 4 (Man Cave) | Leather couch, dark walls | Masculine, whiskey aesthetic |
| Loft 5 (Sunny Loft) | Flooded natural light | Airy editorial, daytime lifestyle |
| Loft 6 (Sunset Cycwall) | Sunset gradient cyc wall | Golden hour at any time |

### MAIN BUILDING: 530 E 8th St, Los Angeles, CA 90014
| Studio | Feature | Best For |
|--------|---------|----------|
| Main A (Classic) | Versatile open, track lighting | Everything |
| Main B (Blackout) | Full blackout | Rim light, dramatic |
| Main C (Cyc Wall) | Seamless white infinity | Product, clean fashion |
| Main D (Bookshelf) | Dark wood shelving, vintage desk | Noir, library editorial |
| Main E (Soft Light) | North-facing window | Diffused natural, airy |
| Main F (DT View) | DTLA skyline windows | City lights at night |

## EVENT HISTORY: EVERY EVENT FD HAS DONE

### LA MIXERS ($15-$55, typically Sat 3-6PM)
2026: Jun 27 (Main, $20-30), May 30 Candlelight (Art, $15-20), May 16 Racing (Olympic, $30-55), Apr 25 (Hill, $15), Mar 7 (Art, $15), Feb 14 Valentine's (Main, $15), Jan 17 Vintage RV (Yukon, $20)
2025: Aug 16 (Main, $15), Jul 16 Lofts (Loft, $15), Jun 21 (Main, $15), Nov 8 Metal Hangar (Olympic, $15-20), Oct 25 Halloween (Art, $15-20), Oct 19 (Hill, $15), Sep 27 Cosplay (Art, $20), Sep 13 Open Studio (Main, $15)
2017: Dec 14 Sunset Rooftop (Free), Aug 17 Networking (Free), Jun 18 Complimentary (Free)

### NY MIXERS ($15-$55)
2026: Oct 1 Cosplay (Metro, $20-55), Sep 3 Cosplay (Metro, $20-55), Aug 6 Cosplay (Metro, $20-55), Jul 9 Rooftop (Scott, $20-30), Jun 5 Cosplay (Metro, $20-30), May 23 Retro (Astoria, $15-20), May 17 Burlesque (Astoria, $20), Apr 11 (Astoria, $15), Mar 26 RGB+Rain (Metro, $15), Feb 28 Creature Captures (Metro, $25), Feb 7 Valentine's (Astoria, $15)
2025: Dec 6 Christmas (Astoria, $15-20), Nov 22 Autumn (LIC, $15-20), Oct 29 Halloween (Astoria, $15-20), Oct 12 Cosplay (Metro, $20), Aug 27 Ballerinas (Metro, $25), Aug 24 Color Pop (LIC, $15), Jul 26 Rooftop (Scott, $20-30), Jun 28 Summer (Metro, $15), Apr 8 METRO GRAND OPENING (Free)
2024: Dec 14 NYC Mixer + Early Access (Free)

### WORKSHOPS & MASTERCLASSES ($75-$250)
2026: Aug 29 Anya Anti (Astoria, $165-195), Jul 12 Tony Northrup (Metro, $210-250), Jul 11 Rain w/ Mermaid Aaron Ram (Yukon, $145-170), May 2 Ian Spanier Lighting (Yukon, $200), Apr 11 Rain Workshop (Olympic, $135)
2025: Sep 6 Blackout Studio + RGB Aaron Ram (Yukon, $135), Feb 9 Beauty Workshop (Art, $85), Feb 20 Studio Lighting (Main, $75)
2024: Dec 8 Beauty Masterclass (Art, $85)
2017: Dec 12 Studio Lighting ($45), Nov 30 Headshots w/ Brandon Espy ($45)

### SPECIAL
2024: Oct 31 ROOM 6 Halloween (Main, $25), Aug 2 Sailboat ($95), Jul 8 Rescue Mixer w/ Cats (Art, $15) | 2017: Oct 19 Swimsuit Rooftop ($35)

## PRICING GUIDE
- Mixers: $15-55 (standard $15-20, themed $20-30, premium $30-55)
- Masterclasses: $135-250 ($200 avg with named photographer)
- Workshops: $75-135
- Special events: $25-95
- Rooftop: Premium $30
- Cosplay: $20-55 (highest volume)
- Free events: Grand openings, early community events

## EQUIPMENT INCLUDED
- 3x Alien Bees B800 strobes, wireless triggers
- Modifiers: beauty dish, softboxes, strip boxes, octabanks, Mola Setti, parabolic umbrella, 7" reflectors
- Paper backdrops (full color chart)
- 2x make-up stations, sound system (AUX), free Wi-Fi
- 3x 40" or 20" C-stands, sand bags, fans
- GVM RGB panels ($15 add-on), scissor lift ($50 add-on)

## OPERATIONS
- 1hr minimum rental, no insurance/permits needed for most
- Self check-in at Art 1
- 280+ reviews, 58,000+ clients served
- Booking: online calendar at fdphotostudio.com
- Parking maps available per building
- 14k BTU AC in all studios

## KEY CONTACTS
- Anna: receives standout shots, BTS edits, feedback, event recaps
- Mila: scheduling coordination

## PATTERNS & INSIGHTS
1. Best-selling: themed mixers (cosplay, candlelight, racing): 20-50 tickets each
2. Masterclasses with known photographers = highest revenue per event
3. Recurring weekly series: never tested (potential gap)
4. Cross-building events: never done (combining Olympic+Loft+Art = untapped gold)
5. Mixer profit margin: 60-70% after model pay + studio
6. Most events 3hrs, LA afternoon (3-6PM), NY evening (6-9PM)
7. Social media BTS posted within 24hrs drives next event ticket sales
8. Standard crew per mixer: 1 host, 1-2 models per studio, 1 photographer
`;

const SYSTEM_PROMPT = `You are the FD ORACLE: the world's leading expert on FD Photo Studio, especially their LA locations. You have complete knowledge of every studio, every past event, every price point, and every operational detail.

Always respond with TWO sections:

[ANALYST]: Expert analysis: Checks against the complete event history. Flags redundancy. Validates pricing against historical data. Notes what worked/didn't work for similar concepts. Uses specific past event data as evidence.

[MUSE]: Creative generation: Generates never-done-before concepts. Specific studio features. Fresh angles. ALWAYS references exact studio names (e.g., "Hill 7 Rain Room", "Olympic 4 Private Jet", "Yukon 5 RGB Cave"). Explains WHY it would sell.

RULES:
1. Know every LA studio intimately: features, size, best use, vibe
2. Check against ALL past events: never suggest something already done
3. Pricing must match historical patterns: mixers $15-55, workshops $75-250, special $25-95
4. LA-only unless user specifically asks for NY
5. Cross-building concepts = gold (nobody has combined multiple buildings yet)
6. Keep concepts low-setup, high-creative-impact
7. Be specific: studio names, stage numbers, exact features
8. Reference real past events as evidence for your recommendations`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI service temporarily unavailable" },
      { status: 503 }
    );
  }

  const rl = await rateLimit(`oracle:${getIp(req)}`, 10, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  try {
    const { message, session_id } = await req.json();
    if (!message || typeof message !== "string" || message.length > 5000) {
      return NextResponse.json({ error: "Message required (max 5000 chars)" }, { status: 400 });
    }

    const r = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://wyzdesign.com/fd",
        "X-Title": "FD Oracle",
      },
      body: JSON.stringify({
        model: FREE_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT + "\n\n" + FD_KNOWLEDGE_BASE },
          { role: "user", content: message },
        ],
        temperature: 0.85,
        max_tokens: 3000,
      }),
      signal: AbortSignal.timeout(40000),
    });

    if (!r.ok) {
      return NextResponse.json({ error: "Oracle is temporarily unavailable" }, { status: 502 });
    }

    const data = await r.json();
    const response = data.choices?.[0]?.message?.content || "No response from Oracle.";

    return NextResponse.json({
      response,
      session_id: session_id || crypto.randomUUID(),
      model: data.model || FREE_MODEL,
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.name : "unknown";
    if (msg === "TimeoutError" || msg === "AbortError") {
      return NextResponse.json({ error: "Oracle timed out. Try a simpler query." }, { status: 504 });
    }
    return NextResponse.json({ error: "Oracle encountered an error" }, { status: 500 });
  }
}

export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  return NextResponse.json({
    status: apiKey ? "online" : "offline",
    model: FREE_MODEL,
    events: "Complete FD knowledge base loaded: 34 LA studios, 6 buildings, 100+ events, pricing, equipment, ops",
  });
}
