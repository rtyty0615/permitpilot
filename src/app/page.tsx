export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-4 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
        Taipei · 臺北市
      </p>
      <h1 className="text-4xl font-semibold tracking-tight">PermitPilot</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        Describe what you want to build or open. Get the permits, offices,
        documents and red flags before you file.
      </p>
      <p className="text-sm text-zinc-500">
        Coming soon. Demo-grade rules data, not legal advice.
      </p>
    </main>
  );
}
