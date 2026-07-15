"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";

// ─── Neural grid canvas ───────────────────────────────────────────────────────
interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
  pulseSpeed: number;
}

function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const NODE_COUNT = Math.min(Math.floor((W * H) / 12000), 80);
    const CONNECTION_DIST = 160;

    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1.5,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    }));

    // Spread initial positions in a grid-ish pattern for visual density
    nodes.forEach((n, i) => {
      const cols = Math.ceil(Math.sqrt(NODE_COUNT));
      const col = i % cols;
      const row = Math.floor(i / cols);
      n.x = (col / cols) * W + (Math.random() - 0.5) * (W / cols);
      n.y = (row / Math.ceil(NODE_COUNT / cols)) * H + (Math.random() - 0.5) * 80;
    });

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Move nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += n.pulseSpeed;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.35;
            const shimmer = 0.5 + 0.5 * Math.sin(a.pulse + b.pulse);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99,102,241,${alpha * shimmer})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        const glow = 0.6 + 0.4 * Math.sin(n.pulse);
        const r = n.radius * glow;

        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${0.06 * glow})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r);
        grad.addColorStop(0, `rgba(165,180,252,${0.9 * glow})`);
        grad.addColorStop(1, `rgba(99,102,241,${0.6 * glow})`);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => v.toFixed(decimals));
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const controls = animate(mv, to, { duration: 1.8, ease: "easeOut" });
    const unsub = rounded.on("change", setDisplay);
    return () => {
      controls.stop();
      unsub();
    };
  }, [mv, to, rounded]);

  return <span>{display}</span>;
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="relative h-px w-full overflow-hidden rounded-full bg-white/10">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #818cf8, #6366f1, #a78bfa)",
          boxShadow: "0 0 8px rgba(99,102,241,0.8)",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ ease: "easeOut", duration: 0.4 }}
      />
    </div>
  );
}

// ─── Boot log lines ────────────────────────────────────────────────────────────
const LOG_LINES = [
  "Initialising Kubernetes node pool…",
  "Connecting to Kafka broker cluster…",
  "Loading ML model registry…",
  "Establishing Redis sentinel connection…",
  "Bootstrapping Prometheus metrics exporter…",
  "Calibrating KS-test baseline distribution…",
  "Starting A/B experiment tracker…",
  "Sync + async inference paths online.",
  "InferGrid ready · 699 RPS capacity confirmed.",
];

// ─── Main splash screen ───────────────────────────────────────────────────────
export function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("ig-splash-seen")) {
      setVisible(false);
      onComplete?.();
      return;
    }

    const total = LOG_LINES.length;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      setLogIndex(step);
      setProgress(Math.round((step / total) * 100));

      if (step >= total) {
        clearInterval(interval);
        setTimeout(() => {
          setExiting(true);
          sessionStorage.setItem("ig-splash-seen", "1");
          setTimeout(() => {
            setVisible(false);
            onComplete?.();
          }, 800);
        }, 600);
      }
    }, 280);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#050507" }}
          initial={{ opacity: 1 }}
          exit={{
            clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"],
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <NeuralCanvas />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, #050507 100%)",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-10 px-6 text-center">
            {/* Logo mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute"
                >
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle
                      cx="60"
                      cy="60"
                      r="56"
                      stroke="url(#ring-grad)"
                      strokeWidth="1"
                      strokeDasharray="8 4"
                    />
                    <defs>
                      <linearGradient id="ring-grad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6366f1" />
                        <stop offset="0.5" stopColor="#a78bfa" stopOpacity="0.2" />
                        <stop offset="1" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="absolute"
                >
                  <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      stroke="rgba(165,180,252,0.25)"
                      strokeWidth="0.5"
                      strokeDasharray="3 12"
                    />
                  </svg>
                </motion.div>

                <div
                  className="relative grid h-16 w-16 place-items-center rounded-2xl text-2xl font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                    boxShadow:
                      "0 0 30px rgba(99,102,241,0.5), 0 0 60px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}
                >
                  IG
                  <motion.div
                    className="absolute inset-0 rounded-2xl overflow-hidden"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                  >
                    <div
                      className="h-full w-1/2"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                        transform: "skewX(-20deg)",
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col items-center gap-1"
              >
                <span
                  className="text-3xl font-semibold tracking-tight text-white"
                  style={{ fontFamily: "var(--font-geist-sans, sans-serif)" }}
                >
                  InferGrid
                </span>
                <span className="text-xs font-medium tracking-[0.25em] uppercase text-indigo-400/80">
                  Distributed ML Inference
                </span>
              </motion.div>
            </motion.div>

            {/* Live stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex gap-10"
            >
              {[
                { label: "RPS capacity", value: 699, suffix: "" },
                { label: "p95 latency", value: 100, suffix: "ms" },
                { label: "Failure rate", value: 0, suffix: "%" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <span className="tabular-nums text-2xl font-semibold text-white">
                    {stat.suffix === "%" && stat.value === 0 ? (
                      "0%"
                    ) : (
                      <>
                        <AnimatedNumber to={stat.value} />
                        {stat.suffix && (
                          <span className="ml-0.5 text-base font-medium text-indigo-400">
                            {stat.suffix}
                          </span>
                        )}
                      </>
                    )}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Boot terminal */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="w-full max-w-md"
            >
              <div
                className="rounded-xl border border-white/[0.07] p-4 font-mono text-xs text-left"
                style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(8px)" }}
              >
                <div className="mb-3 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                  <span className="ml-2 text-zinc-600 text-[10px] tracking-widest uppercase">infergrid — boot</span>
                </div>

                <div className="space-y-1 min-h-[6rem]">
                  {LOG_LINES.slice(0, logIndex).map((line, i) => {
                    const isLast = i === logIndex - 1;
                    const isDone = i < logIndex - 1;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-start gap-2 leading-5 ${
                          isDone ? "text-zinc-500" : "text-indigo-300"
                        }`}
                      >
                        <span className={isDone ? "text-emerald-600" : "text-indigo-500"}>
                          {isDone ? "✓" : "›"}
                        </span>
                        <span>{line}</span>
                        {isLast && (
                          <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="ml-0.5 inline-block w-1.5 h-3.5 bg-indigo-400 align-text-bottom"
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-4 space-y-1.5">
                  <ProgressBar progress={progress} />
                  <div className="flex justify-between text-[10px] text-zinc-600">
                    <span>Initialising platform</span>
                    <span className="tabular-nums text-indigo-500">{progress}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
            style={{ background: "linear-gradient(to top, #050507, transparent)" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
