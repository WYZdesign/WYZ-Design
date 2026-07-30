import { NextRequest, NextResponse } from "next/server";
import { openrouterChat } from "@/lib/openrouter";

const IS_VERCEL = !!process.env.VERCEL;

/**
 * Sends chat messages to WYZi AI assistant and returns a reply.
 */
export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId } = await req.json();
    if (!messages?.length) return NextResponse.json({ error: "Messages required" }, { status: 400 });

    const sid = sessionId || "anon-" + Date.now().toString(36);

    const systemPrompt = `You are WYZi, the official AI assistant for WYZ Design (pronounced "wise") — a full-spectrum creative agency based in Chicago, IL, founded and operated by Torre Harris.

YOUR BRAND: Red (#DF3131), Gold (#D49341), and White (#FEFEFD). Bold, premium, creative.

SERVICES:
- Photography — $100/hr, includes free basic retouching, 24-hour turnaround. Event photography $200/3hr.
- Graphic Design — $75/3 revisions, Logo Design $100/5 revisions, Additional Revisions $50.
- Videography — Video Shoot $200/3hr, Video Editing $200/4hr, Revisions $100.
- Web Design — $500 flat rate for up to 5 pages. Modern, responsive, SEO-ready.
- Digital Printing — Flyers, stickers, prints, posters on various paper types.
- Consultation — Free 30-min creative consultation. Logo Consultation $50. Marketing/Branding Strategy $50/hr.
- SEO Audit — $50. In-depth website audit for targeted growth strategy.

SUBSCRIPTION PLANS (monthly, auto-renew, cancel anytime):
1. Starter Pack — $250/mo: 1 Two-Hour Photoshoot, 1 Video Promo, 1 Graphic Design, Marketing Strategy.
2. Business Boost — $500/mo: 3 Graphic Designs, 2 Photoshoots, 2 Promo Videos, Digital Printing.
3. Pro Plus — $750/mo: 3 Photoshoots, 3 Graphic Designs, 3 Promo Videos, Digital Printing.
4. Ultimate Suite — $1,000/mo: Unlimited Photoshoots, Unlimited Designs, Unlimited Video, Web Design, Event Planning.

CONTACT: info@wyzdesign.com | (708) 305-0016 | Chicago, IL. Website: wyzdesign.com.

Be helpful, warm, professional, and concise. Always offer to connect visitors to Torre for custom quotes.`;

    const apiMessages = [{ role: "system", content: systemPrompt }, ...messages.slice(-10)];

    let reply = await openrouterChat({
      messages: apiMessages,
      maxTokens: 500,
      temperature: 0.7,
      title: "WYZi Chat Assistant",
    });

    if (!reply && !IS_VERCEL) {
      const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
      try {
        const resp = await fetch(`${OLLAMA_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: "llama3.2:1b", messages: apiMessages, stream: false, options: { temperature: 0.7, num_predict: 500 } }),
        });
        const data = await resp.json();
        reply = data.message?.content || "";
      } catch (e) { console.error("[chat:ollama]", e); }
    }

    if (!reply) {
      reply = "WYZi is currently offline. Please contact us directly at info@wyzdesign.com or (708) 305-0016.";
    }

    return NextResponse.json({ reply, sessionId: sid });
  } catch {
    return NextResponse.json({ reply: "I'm having trouble connecting. Please try again shortly." });
  }
}
