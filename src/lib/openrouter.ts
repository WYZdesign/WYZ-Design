const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || "";
const IS_VERCEL = !!process.env.VERCEL;

const FREE_MODELS = [
  "openrouter/free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "qwen/qwen3-coder:free",
  "openai/gpt-oss-20b:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "google/gemma-4-26b-a4b-it:free",
  "poolside/laguna-m.1:free",
  "nvidia/nemotron-nano-12b-v2-vl:free",
];

interface OpenRouterOpts {
  messages: { role: string; content: string }[];
  maxTokens?: number;
  temperature?: number;
  title?: string;
}

export async function openrouterChat(opts: OpenRouterOpts): Promise<string> {
  if (!IS_VERCEL || !OPENROUTER_KEY) return "__SKIP__";

  for (const model of FREE_MODELS) {
    try {
      const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          "HTTP-Referer": "https://wyzdesign.com",
          "X-Title": opts.title || "WYZ Design",
        },
        body: JSON.stringify({
          model,
          messages: opts.messages,
          max_tokens: opts.maxTokens ?? 500,
          temperature: opts.temperature ?? 0.7,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      }
      if (resp.status === 429) continue;
      if (resp.status === 404) continue;
    } catch {
      continue;
    }
  }
  return "";
}
