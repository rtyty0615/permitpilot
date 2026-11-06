import type { CheckResponse } from "@/lib/schema";
import { t, type Lang } from "./i18n";

const SEVERITY_STYLES = {
  high: "border-red-300 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100",
  medium: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100",
  low: "border-zinc-300 bg-zinc-50 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200",
};

const MODE_STYLES = {
  live: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  mock: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  fallback: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
};

export function ResultView({ data, lang }: { data: CheckResponse; lang: Lang }) {
  const L = t[lang];
  const { result } = data;

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${MODE_STYLES[data.mode]}`}>
          {L.modes[data.mode]}
        </span>
        <p className="mt-3 text-lg">{result.summary}</p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-zinc-500">{L.timeline}</dt>
            <dd className="mt-1 font-medium">{result.estimatedTimeline}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500">{L.nextStep}</dt>
            <dd className="mt-1 font-medium">{result.nextStep}</dd>
          </div>
        </dl>
      </div>

      {result.redFlags.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold">{L.redFlags}</h2>
          <ul className="mt-3 space-y-2">
            {result.redFlags.map((flag, i) => (
              <li key={i} className={`rounded-xl border p-4 ${SEVERITY_STYLES[flag.severity]}`}>
                <p className="font-medium">
                  <span className="mr-2 text-xs font-semibold uppercase tracking-wide">{L.severity[flag.severity]}</span>
                  {flag.issue}
                </p>
                <p className="mt-1 text-sm opacity-90">{flag.advice}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold">
          {L.permits} <span className="text-zinc-500">({result.permits.length})</span>
        </h2>
        <ol className="mt-3 space-y-3">
          {result.permits.map((permit, i) => (
            <li key={i} className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">
                  {permit.name}
                  {permit.nameLocal && <span className="ml-2 font-normal text-zinc-500">{permit.nameLocal}</span>}
                </h3>
                {permit.estimatedDays != null && (
                  <span className="text-sm text-zinc-500">
                    ~{permit.estimatedDays} {L.days}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-400">{permit.agency}</p>
              <p className="mt-2 text-zinc-700 dark:text-zinc-300">{permit.why}</p>
              {permit.documents.length > 0 && (
                <>
                  <p className="mt-3 text-sm font-medium text-zinc-500">{L.documents}</p>
                  <ul className="mt-1 space-y-1">
                    {permit.documents.map((doc) => (
                      <li key={doc}>
                        <label className="flex gap-2 text-sm">
                          <input type="checkbox" className="mt-0.5 accent-emerald-700" />
                          {doc}
                        </label>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          ))}
        </ol>
      </div>

      <p className="text-sm text-zinc-500">{data.disclaimer}</p>
    </div>
  );
}
