export interface AiChatMessage {
  role: string;
  content: string;
}

export interface StreamChatWithFallbackOptions {
  messages: AiChatMessage[];
  ollamaModel?: string;
  fallbackText: string | ((lastUserMessage: string) => string);
  ollamaTimeoutMs?: number;
  fallbackDelayMs?: number;
  fallbackChunkChars?: number;
}

/**
 * Tries Ollama chat streaming first (Shadow PC GPU tunnel), bounded by a hard
 * timeout so an unreachable/slow tunnel can't stall the request up to Vercel's
 * maxDuration before the reliable fallback runs. When Ollama fails, times out,
 * or returns no body, streams a locally generated response with a typing
 * animation. Both phases respond as text/plain chunked streaming.
 */
export async function streamChatWithFallback(opts: StreamChatWithFallbackOptions): Promise<Response> {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11435";
  const ollamaModel = opts.ollamaModel || "deepseek-coder:6.7b";
  const ollamaTimeoutMs = opts.ollamaTimeoutMs ?? 3500;
  const fallbackDelayMs = opts.fallbackDelayMs ?? 15;
  const fallbackChunkChars = opts.fallbackChunkChars ?? 3;

  try {
    const ollamaController = new AbortController();
    const ollamaTimeout = setTimeout(() => ollamaController.abort(), ollamaTimeoutMs);
    let ollamaRes: Response;
    try {
      ollamaRes = await fetch(`${ollamaUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: ollamaModel,
          messages: opts.messages,
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

  const lastMsg = opts.messages[opts.messages.length - 1];
  const lastUser = lastMsg?.content?.toLowerCase() || "";
  const response =
    typeof opts.fallbackText === "function" ? opts.fallbackText(lastUser) : opts.fallbackText;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < response.length) {
          controller.enqueue(encoder.encode(response.slice(i, i + fallbackChunkChars)));
          i += fallbackChunkChars;
        } else {
          clearInterval(interval);
          controller.close();
        }
      }, fallbackDelayMs);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
