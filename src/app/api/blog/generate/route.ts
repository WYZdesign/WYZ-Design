import { NextRequest, NextResponse } from "next/server";
import { openrouterChat } from "@/lib/openrouter";

const IS_VERCEL = !!process.env.VERCEL;

/**
 * Generates a blog post using LLM based on a topic, style, and length.
 */
export async function POST(req: NextRequest) {
  try {
    const { topic, style = "professional", length = "medium" } = await req.json();
    if (!topic) return NextResponse.json({ error: "Topic required" }, { status: 400 });

    const prompts: Record<string, string> = {
      medium: "Write a 300-500 word blog post",
      short: "Write a 100-200 word blog post",
      long: "Write a 600-900 word blog post",
    };

    const prompt = `${prompts[length] || prompts.medium} about "${topic}" in a ${style} tone.
Use markdown formatting with headings. Include an engaging intro and a clear conclusion.
Write as WYZ Design's blog — a creative agency in Chicago.`;

    const content = await openrouterChat({
      messages: [{ role: "user", content: prompt }],
      maxTokens: 1000,
      temperature: 0.8,
      title: "WYZ Design Blog Generator",
    });
    if (content) return NextResponse.json({ content });

    if (!IS_VERCEL) {
      const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
      try {
        const resp = await fetch(`${OLLAMA_URL}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: "deepseek-coder", prompt, stream: false, options: { temperature: 0.8, num_predict: 1000 } }),
        });
        const data = await resp.json();
        if (data.response) return NextResponse.json({ content: data.response });
      } catch (e) { console.error("[blog:ollama]", e); }
    }

    return NextResponse.json({ content: "", error: "AI service unavailable. Please try again later." });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
