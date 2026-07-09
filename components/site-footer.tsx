import Link from "next/link";

const GITHUB_URL = "https://github.com/MenaceHecker/InferGrid";
const STACK = [
  "Python",
  "FastAPI",
  "Kubernetes",
  "Kafka",
  "Redis",
  "Prometheus",
  "Grafana",
  "PostgreSQL",
  "GCP",
];

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-black/[.08] bg-zinc-50 font-sans dark:border-white/[.1] dark:bg-black">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12 sm:px-10">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div className="flex max-w-xs flex-col gap-3">
            <span className="flex items-center gap-2 text-base font-semibold tracking-tight text-black dark:text-zinc-50">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-foreground text-xs font-bold text-background">
                IG
              </span>
              InferGrid
            </span>
            <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              A distributed ML inference platform — built to learn what it takes
              to run a model in production.
            </p>
          </div>

          <nav className="flex flex-col gap-3 text-sm">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Explore
            </span>
            <Link
              href="/demo"
              className="text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Live demo
            </Link>
            <Link
              href="/#architecture"
              className="text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Architecture
            </Link>
            <Link
              href="/#benchmarks"
              className="text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Benchmarks
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Source ↗
            </a>
          </nav>
        </div>

        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {STACK.map((s, i) => (
            <span
              key={s}
              className="font-mono text-xs text-zinc-400 dark:text-zinc-500"
            >
              {s}
              {i < STACK.length - 1 && (
                <span className="ml-2 text-zinc-300 dark:text-zinc-700">·</span>
              )}
            </span>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-black/[.06] pt-6 text-xs text-zinc-400 sm:flex-row dark:border-white/[.08]">
          <span>Built by MenaceHecker · Demo site for the InferGrid platform.</span>
          <span className="font-mono">Live endpoint: 35.255.145.27</span>
        </div>
      </div>
    </footer>
  );
}
