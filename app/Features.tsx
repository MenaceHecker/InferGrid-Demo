"use client";

import { motion } from "motion/react";
import {
  Activity,
  Gauge,
  GitFork,
  Radar,
  Scaling,
  Zap,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Dual request path",
    body: "Predictions run inline while capacity allows, then spill to a Kafka-backed async path under load — one endpoint, two execution modes.",
  },
  {
    icon: Radar,
    title: "Model-drift detection",
    body: "A KS-test compares the live confidence distribution against a baseline every 60 seconds and fires a Prometheus alert on divergence.",
  },
  {
    icon: GitFork,
    title: "A/B model rollouts",
    body: "Register versions, set a traffic split, and route per request through the Experiment Tracker — with a 500ms timeout and automatic fallback.",
  },
  {
    icon: Scaling,
    title: "Autoscaling on live traffic",
    body: "A Prometheus Adapter exposes custom metrics so the HPA scales the API from 1 to 6 replicas against real request pressure, not just CPU.",
  },
  {
    icon: Activity,
    title: "Observed end to end",
    body: "Every prediction is counted, timed, and its confidence recorded in Prometheus, with three Grafana dashboards over the whole pipeline.",
  },
  {
    icon: Gauge,
    title: "Honest latency budgets",
    body: "Sync p95 stays under 100ms to 50 users; the async path trades a little latency for 699 RPS by absorbing spikes through the queue.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Features() {
  return (
    <motion.section
      id="features"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      className="flex w-full flex-col gap-10 border-t border-black/[.08] py-20 dark:border-white/[.1]"
    >
      <motion.div variants={fadeUp} className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Capabilities
        </span>
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          What it takes to run a model in production.
        </h2>
        <p className="max-w-2xl leading-7 text-zinc-600 dark:text-zinc-400">
          Serving predictions is the easy part. InferGrid is built around
          everything else — load, drift, rollouts, autoscaling, and the
          observability to know it&apos;s all working.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="flex flex-col gap-3 rounded-2xl border border-black/[.08] bg-white/60 p-5 dark:border-white/[.1] dark:bg-white/[.02]"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-black/[.05] text-black dark:bg-white/[.08] dark:text-zinc-100">
                <Icon className="size-5" />
              </span>
              <h3 className="text-base font-medium text-black dark:text-zinc-50">
                {f.title}
              </h3>
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {f.body}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
