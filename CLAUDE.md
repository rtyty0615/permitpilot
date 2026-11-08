@AGENTS.md

# PermitPilot

AI permit pre-check for cities, Taipei first. See PLAN.md for the pitch, architecture and timeline.

## Conventions

- Next.js App Router + TypeScript + Tailwind. Source lives in `src/`.
- LLM calls happen only in server code (`src/app/api/**`, `src/lib/**`), never in client components.
- LLM provider is OpenAI-compatible and configured by env vars: `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`.
  With no `LLM_API_KEY`, the API runs in mock mode and returns a canned result.
- City rules packs live in `src/data/cities/<city>.json`. Adding a city should need no code changes:
  add the JSON file and its id to `src/data/cities/index.json`. Reuse permit ids across cities
  (`business-registration`, `change-of-use`, …) so mock mode keyword matching works everywhere.
- Validate all LLM output before returning it to the client.
- Never commit `.env.local` or real keys; document new env vars in `.env.example`.

## Commands

- `npm run dev`: local dev server on http://localhost:3000
- `npm run build`: production build (run before pushing)
- `npm run lint`
