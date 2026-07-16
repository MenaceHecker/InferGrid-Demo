"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const GITHUB_URL = "https://github.com/MenaceHecker/InferGrid";

// lucide-react dropped brand icons, so the GitHub mark is inlined.
function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

const stats = [
  { value: "699", unit: "RPS", label: "Async throughput at 200 concurrent users" },
  { value: "<100", unit: "ms", label: "Sync p95 latency up to 50 users" },
  { value: "0", unit: "", label: "Failures across 67,963 load-test requests" },
  { value: "60", unit: "s", label: "Model-drift checks via KS-test" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Hero() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center gap-8 text-center sm:items-start sm:text-left"
    >
      <motion.div variants={item} className="flex flex-col gap-5">
        <span className="inline-flex w-fit items-center gap-2 self-center rounded-full border border-black/[.1] px-3 py-1 text-xs font-medium text-zinc-600 sm:self-start dark:border-white/[.15] dark:text-zinc-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          Live on GKE · 200 concurrent users, zero failures
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-black sm:text-5xl dark:text-zinc-50">
          Distributed ML inference,
          <br className="hidden sm:block" /> built for production.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          InferGrid serves models under real load, absorbing traffic spikes
          with a sync + an async request path, catching silent model drift, and
          rolling out new versions safely with A/B routing. Running on
          Kubernetes with Kafka, Redis, and full Prometheus/Grafana
          observability.
        </p>
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row">
        <Button asChild size="default" className="h-12 px-6 text-base">
          <Link href="/demo">
            Try the live demo here
            <ArrowRight />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="default"
          className="h-12 px-6 text-base"
        >
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <GithubIcon />
            View source
          </a>
        </Button>
      </motion.div>

      <motion.dl
        variants={item}
        className="mt-4 grid w-full grid-cols-2 gap-x-8 gap-y-6 border-t border-black/[.08] pt-8 sm:grid-cols-4 dark:border-white/[.1]"
      >
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1 text-left">
            <dt className="text-3xl font-semibold tracking-tight text-black tabular-nums dark:text-zinc-50">
              {s.value}
              {s.unit && (
                <span className="ml-0.5 text-lg font-medium text-zinc-500">
                  {s.unit}
                </span>
              )}
            </dt>
            <dd className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              {s.label}
            </dd>
          </div>
        ))}
      </motion.dl>
    </motion.div>
  );
}
