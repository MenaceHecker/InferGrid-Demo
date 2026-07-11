"use client";

import { useState } from "react";
import { motion } from "motion/react";

// ── Benchmark data (GKE endpoint · sklearn TF-IDF + LogReg · 60s per scenario) ──
const USERS = [10, 50, 100, 200];
const LAT = {
  p50: [45, 46, 48, 57],
  p95: [61, 90, 120, 230],
  p99: [240, 230, 230, 390],
};
const RPS = [14.2, 70.5, 139.5, 272.2];
const ASYNC = { rps: 699.0, p50: 190, p95: 360, p99: 450 }; // 200 users, async path

// ── Chart geometry (viewBox units) ──
const W = 620;
const H = 300;
const PAD = { l: 44, r: 56, t: 16, b: 36 };
const PLOT_W = W - PAD.l - PAD.r;
const PLOT_H = H - PAD.t - PAD.b;
const BASE_Y = PAD.t + PLOT_H;
const STEP = PLOT_W / (USERS.length - 1);

const xAt = (i: number) => PAD.l + i * STEP;
const yAt = (v: number, max: number) => PAD.t + (1 - v / max) * PLOT_H;
const pct = (px: number) => `${(px / W) * 100}%`;

const LAT_MAX = 400;
const RPS_MAX = 300;
const LAT_TICKS = [0, 100, 200, 300, 400];
const RPS_TICKS = [0, 100, 200, 300];

const SERIES = [
  { key: "p99" as const, label: "p99", color: "var(--s3)" },
  { key: "p95" as const, label: "p95", color: "var(--s2)" },
  { key: "p50" as const, label: "p50", color: "var(--s1)" },
];

function linePath(values: number[], max: number) {
  return values
    .map((v, i) => `${i === 0 ? "M" : "L"}${xAt(i)},${yAt(v, max)}`)
    .join(" ");
}

function barPath(cx: number, w: number, top: number, r: number) {
  const x = cx - w / 2;
  return `M${x},${BASE_Y} L${x},${top + r} Q${x},${top} ${x + r},${top} L${
    x + w - r
  },${top} Q${x + w},${top} ${x + w},${top + r} L${x + w},${BASE_Y} Z`;
}

function GridAndAxis({
  ticks,
  max,
  unit,
}: {
  ticks: number[];
  max: number;
  unit: string;
}) {
  return (
    <g>
      {ticks.map((t) => {
        const y = yAt(t, max);
        return (
          <g key={t}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={y}
              y2={y}
              stroke="var(--grid)"
              strokeWidth={1}
            />
            <text
              x={PAD.l - 8}
              y={y + 3}
              textAnchor="end"
              fontSize={11}
              fill="var(--muted)"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {t}
            </text>
          </g>
        );
      })}
      <text
        x={PAD.l - 8}
        y={PAD.t - 4}
        textAnchor="end"
        fontSize={10}
        fill="var(--muted)"
      >
        {unit}
      </text>
      {USERS.map((u, i) => (
        <text
          key={u}
          x={xAt(i)}
          y={BASE_Y + 20}
          textAnchor="middle"
          fontSize={11}
          fill="var(--muted)"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {u}
        </text>
      ))}
    </g>
  );
}

/** Invisible hover columns aligned to each data x-position. */
function HoverZones({
  active,
  onActivate,
}: {
  active: number | null;
  onActivate: (i: number | null) => void;
}) {
  return (
    <div className="absolute inset-0" onMouseLeave={() => onActivate(null)}>
      {USERS.map((u, i) => (
        <button
          key={u}
          aria-label={`${u} concurrent users`}
          onMouseEnter={() => onActivate(i)}
          onFocus={() => onActivate(i)}
          onBlur={() => onActivate(null)}
          className="absolute top-0 bottom-0 cursor-default"
          style={{
            left: pct(xAt(i) - STEP / 2),
            width: pct(STEP),
            background:
              active === i
                ? "color-mix(in srgb, var(--muted) 8%, transparent)"
                : "transparent",
          }}
        />
      ))}
    </div>
  );
}

function LatencyChart() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <figure className="relative m-0 flex flex-col gap-3">
      <figcaption className="flex items-center justify-between">
        <span className="text-sm font-medium text-black dark:text-zinc-50">
          Latency vs concurrent users
        </span>
        <div className="flex items-center gap-3">
          {SERIES.map((s) => (
            <span
              key={s.key}
              className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400"
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: s.color }}
              />
              {s.label}
            </span>
          ))}
        </div>
      </figcaption>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
          aria-label="Line chart of p50, p95 and p99 latency across 10 to 200 concurrent users">
          <GridAndAxis ticks={LAT_TICKS} max={LAT_MAX} unit="ms" />
          {active !== null && (
            <line
              x1={xAt(active)}
              x2={xAt(active)}
              y1={PAD.t}
              y2={BASE_Y}
              stroke="var(--axis)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}
          {SERIES.map((s, si) => (
            <motion.path
              key={s.key}
              d={linePath(LAT[s.key], LAT_MAX)}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1 * si }}
            />
          ))}
          {SERIES.map((s) =>
            LAT[s.key].map((v, i) => (
              <circle
                key={`${s.key}-${i}`}
                cx={xAt(i)}
                cy={yAt(v, LAT_MAX)}
                r={active === i ? 4.5 : 3}
                fill={s.color}
                stroke="var(--surface)"
                strokeWidth={2}
              />
            ))
          )}
          {/* direct end-labels (identity is position + text, not color alone) */}
          {SERIES.map((s) => {
            const last = LAT[s.key].length - 1;
            return (
              <text
                key={`lbl-${s.key}`}
                x={xAt(last) + 8}
                y={yAt(LAT[s.key][last], LAT_MAX) + 3}
                fontSize={11}
                fill="var(--ink2)"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {s.label}
              </text>
            );
          })}
        </svg>

        <HoverZones active={active} onActivate={setActive} />

        {active !== null && (
          <div
            className="pointer-events-none absolute top-2 z-10 -translate-x-1/2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs shadow-sm dark:border-white/10 dark:bg-zinc-900"
            style={{ left: pct(xAt(active)) }}
          >
            <div className="mb-1 font-medium text-black dark:text-zinc-50">
              {USERS[active]} users
            </div>
            {SERIES.map((s) => (
              <div
                key={s.key}
                className="flex items-center justify-between gap-3 text-zinc-600 dark:text-zinc-300"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: s.color }}
                  />
                  {s.label}
                </span>
                <span className="tabular-nums">{LAT[s.key][active]}ms</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </figure>
  );
}

function ThroughputChart() {
  const [active, setActive] = useState<number | null>(null);
  const barW = 46;
  return (
    <figure className="relative m-0 flex flex-col gap-3">
      <figcaption className="flex items-center justify-between">
        <span className="text-sm font-medium text-black dark:text-zinc-50">
          Sync throughput vs concurrent users
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          requests / second
        </span>
      </figcaption>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
          aria-label="Bar chart of sync throughput in requests per second across 10 to 200 concurrent users">
          <GridAndAxis ticks={RPS_TICKS} max={RPS_MAX} unit="RPS" />
          {RPS.map((v, i) => {
            const top = yAt(v, RPS_MAX);
            return (
              <g key={i}>
                <motion.path
                  d={barPath(xAt(i), barW, top, 4)}
                  fill="var(--bar)"
                  opacity={active === null || active === i ? 1 : 0.55}
                  style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.08 * i }}
                />
                <text
                  x={xAt(i)}
                  y={top - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={500}
                  fill="var(--ink2)"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {v.toFixed(0)}
                </text>
              </g>
            );
          })}
        </svg>

        <HoverZones active={active} onActivate={setActive} />

        {active !== null && (
          <div
            className="pointer-events-none absolute top-2 z-10 -translate-x-1/2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs shadow-sm dark:border-white/10 dark:bg-zinc-900"
            style={{ left: pct(xAt(active)) }}
          >
            <div className="font-medium text-black dark:text-zinc-50">
              {USERS[active]} users
            </div>
            <div className="tabular-nums text-zinc-600 dark:text-zinc-300">
              {RPS[active].toFixed(1)} RPS
            </div>
          </div>
        )}
      </div>
    </figure>
  );
}

function DataTable() {
  return (
    <details className="group rounded-xl border border-black/[.08] bg-white/60 px-4 py-3 text-sm dark:border-white/[.1] dark:bg-white/[.02]">
      <summary className="cursor-pointer list-none font-medium text-zinc-600 select-none dark:text-zinc-300">
        <span className="group-open:hidden">Show data table</span>
        <span className="hidden group-open:inline">Hide data table</span>
      </summary>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-left tabular-nums">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-zinc-500">
              <th className="py-2 pr-4 font-medium">Users</th>
              <th className="py-2 pr-4 font-medium">Path</th>
              <th className="py-2 pr-4 font-medium">p50</th>
              <th className="py-2 pr-4 font-medium">p95</th>
              <th className="py-2 pr-4 font-medium">p99</th>
              <th className="py-2 font-medium">RPS</th>
            </tr>
          </thead>
          <tbody className="text-zinc-700 dark:text-zinc-300">
            {USERS.map((u, i) => (
              <tr key={u} className="border-t border-black/[.06] dark:border-white/[.08]">
                <td className="py-2 pr-4">{u}</td>
                <td className="py-2 pr-4">sync</td>
                <td className="py-2 pr-4">{LAT.p50[i]}ms</td>
                <td className="py-2 pr-4">{LAT.p95[i]}ms</td>
                <td className="py-2 pr-4">{LAT.p99[i]}ms</td>
                <td className="py-2">{RPS[i].toFixed(1)}</td>
              </tr>
            ))}
            <tr className="border-t border-black/[.06] dark:border-white/[.08]">
              <td className="py-2 pr-4">200</td>
              <td className="py-2 pr-4">async</td>
              <td className="py-2 pr-4">{ASYNC.p50}ms</td>
              <td className="py-2 pr-4">{ASYNC.p95}ms</td>
              <td className="py-2 pr-4">{ASYNC.p99}ms</td>
              <td className="py-2">{ASYNC.rps.toFixed(1)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  );
}

export function Benchmarks() {
  return (
    <section
      id="benchmarks"
      className="viz-root flex w-full flex-col gap-10 border-t border-black/[.08] py-20 dark:border-white/[.1]"
    >
      <style>{`
        .viz-root {
          --grid:#e1e0d9; --axis:#c3c2b7; --muted:#898781;
          --ink:#0b0b0b; --ink2:#52514e; --surface:#fcfcfb;
          --s1:#86b6ef; --s2:#3987e5; --s3:#184f95; --bar:#2a78d6;
        }
        .dark .viz-root {
          --grid:#2c2c2a; --axis:#383835; --muted:#898781;
          --ink:#ffffff; --ink2:#c3c2b7; --surface:#1a1a19;
          --s1:#9ec5f4; --s2:#3987e5; --s3:#184f95; --bar:#3987e5;
        }
      `}</style>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Benchmarks
        </span>
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Measured under load, not on a laptop.
        </h2>
        <p className="max-w-2xl leading-7 text-zinc-600 dark:text-zinc-400">
          Load-tested against the live GKE endpoint — sklearn TF-IDF + LogReg,
          60 seconds per scenario. The sync path holds p95 under 100ms up to 50
          users; the async path sustains far higher throughput by absorbing the
          spike through Kafka.
        </p>
      </div>

      {/* headline stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { v: "699", u: "RPS", l: "Async peak throughput" },
          { v: "0", u: "", l: "Failed requests" },
          { v: "67,963", u: "", l: "Total requests sent" },
          { v: "272", u: "RPS", l: "Sync peak @ 200 users" },
        ].map((s) => (
          <div
            key={s.l}
            className="flex flex-col gap-1 rounded-xl border border-black/[.08] bg-white/60 px-4 py-4 transition-colors hover:border-black/[.16] dark:border-white/[.1] dark:bg-white/[.02] dark:hover:border-white/[.2]"
          >
            <span className="text-2xl font-semibold tracking-tight text-black tabular-nums dark:text-zinc-50">
              {s.v}
              {s.u && (
                <span className="ml-0.5 text-sm font-medium text-zinc-500">
                  {s.u}
                </span>
              )}
            </span>
            <span className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              {s.l}
            </span>
          </div>
        ))}
      </div>

      {/* charts */}
      <div className="grid gap-8 rounded-2xl border border-black/[.08] bg-zinc-50/60 p-6 lg:grid-cols-2 dark:border-white/[.1] dark:bg-white/[.02]">
        <LatencyChart />
        <ThroughputChart />
      </div>

      <DataTable />
    </section>
  );
}
