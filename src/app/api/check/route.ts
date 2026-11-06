import { loadCity } from "@/lib/cities";
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

  // Step 4 adds the real LLM call here when LLM_API_KEY is set.
  const result = mockCheck(city, description);

  return Response.json({
    mode: "mock",
    city: { id: city.id, name: city.name, nameLocal: city.nameLocal },
    disclaimer: city.disclaimer,
    result,
  });
}
