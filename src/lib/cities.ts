import type { CityRules } from "./schema";

// Loads src/data/cities/<id>.json. Returns null if no rules pack exists for that city.
export async function loadCity(id: string): Promise<CityRules | null> {
  try {
    const mod = await import(`@/data/cities/${id}.json`);
    return mod.default as CityRules;
  } catch {
    return null;
  }
}
