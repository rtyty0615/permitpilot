import { chat, extractJson } from "./llm";
import { CheckResult, type CityRules } from "./schema";

const OUTPUT_SHAPE = `{
  "summary": string,              // 1-2 sentences
  "permits": [{
    "name": string,
    "nameLocal": string,          // local-language name, if the rules pack has one
    "agency": string,             // include the local-language agency name in parentheses
    "why": string,                // why THIS project needs it
    "documents": string[],
    "estimatedDays": number
  }],
  "redFlags": [{ "severity": "high" | "medium" | "low", "issue": string, "advice": string }],
  "estimatedTimeline": string,    // overall, e.g. "6-9 weeks"
  "nextStep": string              // the single most useful thing to do first
}`;

function systemPrompt(city: CityRules): string {
  return `You are PermitPilot, a permit pre-check assistant for ${city.name}.
A resident describes a project. Tell them which permits they need, which office handles each one,
what documents to prepare, what is likely to get them rejected, and how long it will take.

Rules:
- Use ONLY permits from the rules pack below. Do not invent permits or agencies.
- Include a permit only if it plausibly applies to this project. Explain "why" in terms of their project.
- Use the zoning notes to find red flags. Add red flags for anything risky or unclear in their description.
- Reply in the same language the resident wrote in (English or Traditional Chinese).
- Respond with a single JSON object only, no markdown, matching this shape:
${OUTPUT_SHAPE}

Rules pack for ${city.name}:
${JSON.stringify({ permits: city.permits, zoningNotes: city.zoningNotes })}`;
}

export async function checkWithLlm(city: CityRules, description: string): Promise<CheckResult> {
  const text = await chat([
    { role: "system", content: systemPrompt(city) },
    { role: "user", content: description },
  ]);
  // Never trust LLM output: validate it against the schema before it reaches the browser.
  return CheckResult.parse(extractJson(text));
}
