import { z } from "zod";

// What the browser sends to POST /api/check.
export const CheckRequest = z.object({
  city: z.string().regex(/^[a-z-]+$/, "Invalid city id"),
  description: z.string().trim().min(10, "Describe your project in a bit more detail").max(1000),
});
export type CheckRequest = z.infer<typeof CheckRequest>;

// What /api/check returns. The LLM's output must match this shape too.
export const CheckResult = z.object({
  summary: z.string(),
  permits: z.array(
    z.object({
      name: z.string(),
      nameLocal: z.string().nullish(),
      agency: z.string(),
      why: z.string(),
      documents: z.array(z.string()),
      estimatedDays: z.number().nullish(),
    }),
  ),
  redFlags: z.array(
    z.object({
      severity: z.enum(["high", "medium", "low"]),
      issue: z.string(),
      advice: z.string(),
    }),
  ),
  estimatedTimeline: z.string(),
  nextStep: z.string(),
});
export type CheckResult = z.infer<typeof CheckResult>;

// Full JSON body returned by POST /api/check on success.
export type CheckResponse = {
  mode: "live" | "mock" | "fallback";
  city: { id: string; name: string; nameLocal?: string };
  disclaimer: string;
  result: CheckResult;
};

// What the page needs to know about each city to render the switcher.
export type CityOption = { id: string; name: string; nameLocal?: string; examples: string[] };

// Shape of a city rules pack in src/data/cities/<id>.json.
export type CityRules = {
  id: string;
  name: string;
  nameLocal?: string;
  country: string;
  useRecordName: string; // what the official record of a space's permitted use is called locally
  disclaimer: string;
  examples: string[];
  permits: {
    id: string;
    name: string;
    nameLocal?: string;
    agency: string;
    agencyLocal?: string;
    appliesWhen: string;
    documents: string[];
    typicalDays: number;
  }[];
  zoningNotes: string[];
};
