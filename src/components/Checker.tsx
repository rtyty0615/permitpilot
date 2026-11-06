"use client";

import { useRef, useState } from "react";
import type { CheckResponse } from "@/lib/schema";
import { EXAMPLES, t, type Lang } from "./i18n";
import { ResultView } from "./ResultView";

export function Checker() {
  const [lang, setLang] = useState<Lang>("en");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CheckResponse | null>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const L = t[lang];

  async function check(text: string) {
    setLoading(true);
    setError(null);
    setData(null);
    // On small screens the results start below the fold; bring the loading state into view.
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: "taipei", description: text }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? L.error);
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : L.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-16">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Taipei · 臺北市</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">PermitPilot</h1>
          <p className="mt-2 text-lg text-zinc-700 dark:text-zinc-300">{L.tagline}</p>
        </div>
        <div className="flex shrink-0 rounded-full border border-zinc-300 p-0.5 text-sm dark:border-zinc-700">
          {(["en", "zh"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-full px-3 py-1 ${lang === l ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "text-zinc-600 dark:text-zinc-400"}`}
            >
              {l === "en" ? "EN" : "中文"}
            </button>
          ))}
        </div>
      </header>

      <p className="mt-6 text-zinc-600 dark:text-zinc-400">{L.intro}</p>

      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          check(description);
        }}
      >
        <label htmlFor="description" className="text-sm font-medium">
          {L.label}
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={L.placeholder}
          rows={4}
          maxLength={1000}
          className="mt-2 w-full resize-y rounded-xl border border-zinc-300 bg-white p-3 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-900"
        />

        <p className="mt-3 text-sm text-zinc-500">{L.examples}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setDescription(ex);
                check(ex);
              }}
              className="rounded-full border border-zinc-300 px-3 py-1 text-left text-sm text-zinc-700 hover:border-emerald-600 hover:text-emerald-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-emerald-400"
            >
              {ex}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || description.trim().length < 10}
          className="mt-6 w-full rounded-xl bg-emerald-700 px-5 py-3 font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          {loading ? L.checking : L.submit}
        </button>
      </form>

      <section ref={resultsRef} className="mt-10 scroll-mt-4" aria-live="polite">
        {loading && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
            ))}
          </div>
        )}
        {error && (
          <p className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error}
          </p>
        )}
        {data && <ResultView data={data} lang={lang} />}
      </section>
    </main>
  );
}
