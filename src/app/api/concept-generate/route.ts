import { NextRequest, NextResponse } from "next/server";
import { openrouterChat } from "@/lib/openrouter";
import { logger } from "@/lib/logger";

const IS_VERCEL = !!process.env.VERCEL;

/**
 * Generates creative design concepts using LLM from a user vision description.
 */
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "Text required" }, { status: 400 });

    const prompt = `You are a creative design concept generator for WYZ Design, a bold creative studio in LA. The user describes a vision, mood, or theme. Respond with 3-4 creative direction ideas including: color palette suggestions, typography style, visual elements, and overall mood. Keep it concise and inspiring. Format with bullet points.\n\nUser vision: "${text}"`;

    const result = await openrouterChat({
      messages: [{ role: "user", content: prompt }],
      maxTokens: 500,
      temperature: 0.8,
      title: "WYZ Design Concept Generator",
    });
    if (result) return NextResponse.json({ content: result });

    if (!IS_VERCEL) {
      const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
      try {
        const resp = await fetch(`${OLLAMA_URL}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: "deepseek-coder", prompt, stream: false }),
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.response) return NextResponse.json({ content: data.response });
        }
      } catch (e) { logger.error("concept-generate:ollama", e); }
    }

    return NextResponse.json({ content: "AI is currently unavailable. Contact us directly for creative direction." });
  } catch {
    return NextResponse.json({ content: "AI is currently unavailable. Contact us directly for creative direction." });
  }
}
