import cityIds from "@/data/cities/index.json";
import type { CityOption, CityRules } from "./schema";

// Loads src/data/cities/<id>.json. Returns null if no rules pack exists for that city.
export async function loadCity(id: string): Promise<CityRules | null> {
  try {
    const mod = await import(`@/data/cities/${id}.json`);
    return mod.default as CityRules;
  } catch {
    return null;
  }
}

// Every city listed in src/data/cities/index.json, in that order.
export async function listCities(): Promise<CityOption[]> {
  const cities = await Promise.all(cityIds.map(loadCity));
  return cities
    .filter((c): c is CityRules => c !== null)
    .map(({ id, name, nameLocal, examples }) => ({ id, name, nameLocal, examples }));
}
