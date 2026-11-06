# PermitPilot — 4-Hour Build Plan

> **AI permit pre-check for cities. Taipei first, built to go anywhere.**
> Describe what you want to build or open, in plain English or 中文. In seconds,
> PermitPilot tells you which permits you need, which office handles them, what
> documents to bring, what's likely to get you rejected, and how long it should take.

## The pitch (YC RFS: "AI for City Hall")

- **Problem:** Permits are the first wall every builder and small business hits. Residents
  don't know what they need, and city staff spend their days sending back incomplete
  applications. Every month of delay costs money, and some projects never get built.
- **Wedge:** A resident-facing pre-check that catches missing items *before* a resident
  files. That means fewer rejections and less staff time.
- **Why Taipei first:** It's dense, has a mix of residential and commercial use, and has
  a bilingual population. It's a hard, realistic test case.
- **Why it's global:** Each city is a **rules pack** (a JSON file of permit types,
  agencies, documents and zoning notes). Adding San Francisco means writing a new rules
  pack, not new code. There are 19,000 US cities, and almost all of them still do this
  by hand.

## How it works

```
[Browser form] --POST /api/check--> [Next.js API route (server)]
                                       ├─ loads city rules pack (src/data/cities/taipei.json)
                                       ├─ builds prompt: rules + user's project
                                       ├─ calls LLM (OpenAI-compatible API → GMI Cloud)
                                       ├─ validates JSON output (zod)
                                       └─ returns structured result
[Result cards] <-------------------- { permits[], documents[], redFlags[], timeline, nextStep }
```

- **Stack:** Next.js (App Router) + TypeScript + Tailwind, deployed on Vercel.
- **AI:** any OpenAI-compatible endpoint. The provider is chosen by env vars (`LLM_BASE_URL`, `LLM_API_KEY`,
  `LLM_MODEL`), so you can switch between GMI Cloud and other providers without code changes.
- **Mock mode:** if no API key is set, the API returns a canned result, so the UI never
  blocks on the AI.
- **Secrets:** API keys live only on the server (`.env.local` locally, Vercel env vars in prod).
  They never reach the browser.

## Timeline (6:30 → 10:30)

| Time | Step | Done when | Claude Code skill practiced |
|---|---|---|---|
| 0:00–0:20 | **1. Setup**: scaffold, GitHub over SSH, CLAUDE.md | Repo pushed | Project memory (CLAUDE.md) |
| 0:20–0:40 | **2. Deploy hello world to Vercel** | Live URL works | Deploy *early*, not at the end |
| 0:40–1:10 | **3. Rules pack + `/api/check` in mock mode** | `curl` returns JSON | Plan mode before coding |
| 1:10–1:50 | **4. Real LLM call**: prompt, JSON output, zod validation, errors | Real answer for 3 test inputs | Reading docs, debugging API errors |
| 1:50–2:50 | **5. UI**: input box, example chips, loading state, result cards, EN/中文 | Looks demo-ready | Browser preview, iterating on screenshots |
| 2:50–3:20 | **6. Stretch**: city switcher (Taipei ↔ San Francisco) *or* staff "completeness check" | Second city works | Small, scoped asks |
| 3:20–3:40 | **7. Ship**: Vercel env vars, production test, phone check | Prod URL uses real AI | `/code-review` before the final push |
| 3:40–4:00 | **8. Demo**: README, 90-sec video | Submitted | — |

**Rules:** commit after every step. If a step runs 15 minutes over, cut scope, not sleep.
Mock mode means there is always something to demo.

## 90-second demo script

1. **(0–15s) Problem:** "Opening a café in Taipei means up to N permits across M offices.
   Most people find out what they missed when they get rejected."
2. **(15–60s) Live:** Type "I want to open a 20-seat café with a small kitchen on the
   1st floor of an old apartment building in Da'an." Show the permits, agencies, document checklist and
   red flags (e.g. change of building use, fire safety).
3. **(60–75s) Global:** Switch the city to San Francisco, run the same question, and show a different answer. "New city =
   new rules pack, zero new code."
4. **(75–90s) Vision:** "Start with residents, then sell the staff-side pre-check to
   City Hall. 19,000 US cities still do this by hand."

## Test inputs

- 在大安區老公寓一樓開一間 20 個座位的咖啡廳，有簡單廚房
- Renovate my apartment and add a rooftop structure in Zhongshan District
- Open a home-based English tutoring class for 10 kids
- Put up a large LED sign outside my shop on Zhongxiao East Road

> ⚠️ Demo-grade rules data: simplified and not legal advice. Say so on the page.
