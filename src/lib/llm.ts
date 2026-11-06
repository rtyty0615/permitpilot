// Minimal client for any OpenAI-compatible chat completions API (GMI Cloud, OpenAI, etc.).
// Server-only: it reads the API key from env vars.

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export function llmConfigured(): boolean {
  return Boolean(process.env.LLM_API_KEY && process.env.LLM_BASE_URL && process.env.LLM_MODEL);
}

export async function chat(messages: ChatMessage[]): Promise<string> {
  const res = await fetch(`${process.env.LLM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL,
      messages,
      temperature: 0.2,
      max_tokens: 2000,
    }),
    signal: AbortSignal.timeout(45_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`LLM API ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("LLM API returned no message content");
  return content;
}

// Models sometimes wrap JSON in ```json fences or add a sentence around it.
// Take the outermost {...} block and parse it.
export function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("No JSON object in LLM output");
  return JSON.parse(text.slice(start, end + 1));
}
