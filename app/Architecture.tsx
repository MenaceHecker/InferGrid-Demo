"use client";

import { motion } from "motion/react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Cpu,
  Database,
  GitFork,
  Globe,
  LineChart,
  Radar,
  Scaling,
  Server,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

type Node = {
  icon: LucideIcon;
  title: string;
  meta: string;
};

const requestPath: Node[] = [
  { icon: Globe, title: "Client", meta: "POST /predict" },
  { icon: Server, title: "Inference API", meta: "FastAPI :8000" },
  { icon: Waypoints, title: "Kafka", meta: "model-a/b.requests" },
  { icon: Cpu, title: "Consumer Worker", meta: "confluent-kafka" },
  { icon: Database, title: "Redis", meta: "results · TTL 5min" },
];

const control: Node[] = [
  { icon: GitFork, title: "Experiment Tracker", meta: "FastAPI :8001 · GET /ab/active" },
  { icon: Database, title: "Cloud SQL", meta: "PostgreSQL · versions + traffic split" },
];

const observability: Node[] = [
  { icon: Activity, title: "Prometheus", meta: ":9090 · scrapes API + drift" },
  { icon: LineChart, title: "Grafana", meta: "three live dashboards" },
  { icon: Radar, title: "Drift Detector", meta: "KS-test every 60s" },
  { icon: Scaling, title: "HPA", meta: "1–6 replicas · custom metrics" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function NodeCard({ node }: { node: Node }) {
  const Icon = node.icon;
  return (
    <div className="flex flex-1 items-center gap-3 rounded-xl border border-black/[.08] bg-white px-4 py-3 dark:border-white/[.1] dark:bg-zinc-950">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-black/[.05] text-black dark:bg-white/[.08] dark:text-zinc-100">
        <Icon className="size-[18px]" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-black dark:text-zinc-50">
          {node.title}
        </p>
        <p className="truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
          {node.meta}
        </p>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div
      aria-hidden
      className="flex shrink-0 items-center justify-center text-zinc-400 dark:text-zinc-600"
    >
      <ArrowDown className="size-4 md:hidden" />
      <ArrowRight className="hidden size-4 md:block" />
    </div>
  );
}

function Panel({
  label,
  caption,
  nodes,
}: {
  label: string;
  caption: string;
  nodes: Node[];
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col gap-4 rounded-2xl border border-black/[.08] bg-zinc-50/60 p-5 dark:border-white/[.1] dark:bg-white/[.02]"
    >
      <div>
        <h3 className="text-sm font-semibold text-black dark:text-zinc-50">
          {label}
        </h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          {caption}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {nodes.map((n) => (
          <NodeCard key={n.title} node={n} />
        ))}
      </div>
    </motion.div>
  );
}

export function Architecture() {
  return (
    <motion.section
      id="architecture"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="flex w-full flex-col gap-10 border-t border-black/[.08] py-20 dark:border-white/[.1]"
    >
      <motion.div variants={fadeUp} className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Architecture
        </span>
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          One request, two paths, fully observed.
        </h2>
        <p className="max-w-2xl leading-7 text-zinc-600 dark:text-zinc-400">
          The API serves a prediction inline while in-flight requests stay below
          a threshold. Under load it hands the job to Kafka and returns a{" "}
          <span className="font-mono text-sm">202 + job_id</span>, delivering the
          result over WebSocket once the worker writes it to Redis.
        </p>
      </motion.div>

      {/* Primary request path */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col items-stretch gap-3 md:flex-row md:items-center"
      >
        {requestPath.map((node, i) => (
          <div
            key={node.title}
            className="flex flex-col items-stretch gap-3 md:flex-1 md:flex-row md:items-center"
          >
            <NodeCard node={node} />
            {i < requestPath.length - 1 && <Connector />}
          </div>
        ))}
      </motion.div>

      {/* Supporting planes */}
      <div className="grid gap-4 md:grid-cols-2">
        <Panel
          label="A/B routing"
          caption="Per-request routing to model A or B, with a 500ms timeout and automatic fallback if the tracker is slow."
          nodes={control}
        />
        <Panel
          label="Observability & autoscaling"
          caption="Every prediction is counted, timed, and its confidence recorded. Drift alerts fire on distribution shift; the HPA scales on live traffic."
          nodes={observability}
        />
      </div>
    </motion.section>
  );
}
