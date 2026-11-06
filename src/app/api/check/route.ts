import { checkWithLlm } from "@/lib/check";
import { loadCity } from "@/lib/cities";
import { llmConfigured } from "@/lib/llm";
import { mockCheck } from "@/lib/mock";
import { CheckRequest } from "@/lib/schema";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = CheckRequest.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const { city: cityId, description } = parsed.data;
  const city = await loadCity(cityId);
  if (!city) {
    return Response.json({ error: `No rules pack for city "${cityId}"` }, { status: 404 });
  }

  let mode: "live" | "mock" | "fallback" = "mock";
  let result;
  if (llmConfigured()) {
    try {
      result = await checkWithLlm(city, description);
      mode = "live";
    } catch (err) {
      // Keep the demo alive: log the real error on the server, answer with the mock.
      console.error("LLM check failed:", err);
      mode = "fallback";
    }
  }
  result ??= mockCheck(city, description);

  return Response.json({
    mode,
    city: { id: city.id, name: city.name, nameLocal: city.nameLocal },
    disclaimer: city.disclaimer,
    result,
  });
}
