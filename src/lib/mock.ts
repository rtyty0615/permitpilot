import type { CheckResult, CityRules } from "./schema";

// Keyword → permit ids. Lets mock mode give different answers for different projects
// without calling an LLM.
const KEYWORDS: [RegExp, string[]][] = [
  [/caf[eé]|coffee|restaurant|food|bar|咖啡|餐|飲|食/i, ["business-registration", "change-of-use", "food-business-registration", "fire-safety", "interior-renovation"]],
  [/sign|led|billboard|招牌|廣告/i, ["signboard"]],
  [/tutor|class|school|lesson|補習|教室|課/i, ["cram-school", "change-of-use", "fire-safety"]],
  [/renovat|rooftop|remodel|deck|裝修|頂樓|加蓋/i, ["interior-renovation"]],
  [/home|住家|自家/i, ["home-occupation"]],
  [/shop|store|studio|business|店|工作室/i, ["business-registration"]],
];

export function mockCheck(city: CityRules, description: string): CheckResult {
  const ids = new Set(
    KEYWORDS.filter(([re]) => re.test(description)).flatMap(([, permitIds]) => permitIds),
  );
  // Not every city has every permit id; fall back to business registration if nothing matched.
  let permits = city.permits.filter((p) => ids.has(p.id));
  if (permits.length === 0) permits = city.permits.filter((p) => p.id === "business-registration");

  const longestDays = Math.max(...permits.map((p) => p.typicalDays));
  const rooftop = /rooftop|頂樓|加蓋/i.test(description);

  return {
    summary: `Based on your description, you likely need ${permits.length} permit(s) in ${city.name}. This is a mock answer; connect an LLM for a tailored check.`,
    permits: permits.map((p) => ({
      name: p.name,
      nameLocal: p.nameLocal,
      agency: p.agencyLocal ? `${p.agency} (${p.agencyLocal})` : p.agency,
      why: p.appliesWhen,
      documents: p.documents,
      estimatedDays: p.typicalDays,
    })),
    redFlags: [
      rooftop
        ? {
            severity: "high",
            issue: "Rooftop additions without a permit can be ordered removed.",
            advice: "Check whether any existing rooftop structure is permitted before planning new work.",
          }
        : {
            severity: "medium",
            issue: "Your space's permitted use may not match what you plan to do.",
            advice: `Look up the ${city.useRecordName} for your unit before signing a lease.`,
          },
    ],
    estimatedTimeline: `About ${Math.ceil(longestDays / 7)}–${Math.ceil((longestDays * 1.5) / 7)} weeks if steps run in parallel.`,
    nextStep: `Get the ${city.useRecordName} for your address and check its zoning before you sign anything.`,
  };
}
