"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/dist/DrawSVGPlugin";

gsap.registerPlugin(DrawSVGPlugin);

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

    nodes.forEach((n, i) => {
      const cols = Math.ceil(Math.sqrt(NODE_COUNT));
      const col = i % cols;
      const row = Math.floor(i / cols);
      n.x = (col / cols) * W + (Math.random() - 0.5) * (W / cols);
      n.y = (row / Math.ceil(NODE_COUNT / cols)) * H + (Math.random() - 0.5) * 80;
    });

    function draw() {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += n.pulseSpeed;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

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
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
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
  "Sync + async inference paths online",
  "InferGrid ready · 699 RPS capacity confirmed",
];

// ─── Main splash screen ───────────────────────────────────────────────────────
export function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);
  const [logIndex, setLogIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ringOuterRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);
  // SVG circle refs for DrawSVGPlugin
  const outerCircleRef = useRef<SVGCircleElement>(null);
  const innerCircleRef = useRef<SVGCircleElement>(null);
  // Circuit-trace path refs
  const circuitPath1Ref = useRef<SVGPathElement>(null);
  const circuitPath2Ref = useRef<SVGPathElement>(null);
  const circuitPath3Ref = useRef<SVGPathElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const logoTextRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressPctRef = useRef<HTMLSpanElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const glowBlobRef = useRef<HTMLDivElement>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);
  const stat1Ref = useRef<HTMLDivElement>(null);
  const stat2Ref = useRef<HTMLDivElement>(null);
  const stat3Ref = useRef<HTMLDivElement>(null);

  function spawnParticles() {
    const container = particleContainerRef.current;
    if (!container) return;
    const cx = container.offsetWidth / 2;
    const cy = container.offsetHeight / 2;
    for (let i = 0; i < 22; i++) {
      const dot = document.createElement("div");
      const size = Math.random() * 4 + 2;
      dot.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        border-radius:50%;
        background:hsl(${230 + Math.random() * 50},90%,${65 + Math.random() * 20}%);
        left:${cx}px;top:${cy}px;pointer-events:none;
      `;
      container.appendChild(dot);
      const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 60 + Math.random() * 120;
      gsap.fromTo(
        dot,
        { x: 0, y: 0, opacity: 1, scale: 1 },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          opacity: 0,
          scale: 0,
          duration: 0.7 + Math.random() * 0.5,
          ease: "power2.out",
          onComplete: () => dot.remove(),
        }
      );
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem("ig-splash-seen")) {
      setVisible(false);
      onComplete?.();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Fade in root
      tl.fromTo(rootRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });

      // Glow blob breathes in
      tl.fromTo(
        glowBlobRef.current,
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" },
        "<"
      );

      // Logo box pops in with spring
      tl.fromTo(
        logoBoxRef.current,
        { scale: 0.3, opacity: 0, rotation: -15 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.7, ease: "back.out(2.2)" },
        "-=0.6"
      );

      // Rings appear (fade in wrapper divs)
      tl.fromTo(
        ringOuterRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        "-=0.4"
      );
      tl.fromTo(
        ringInnerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        "-=0.25"
      );

      // DrawSVG — outer ring draws from 0% to 100%
      tl.fromTo(
        outerCircleRef.current,
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 1.1, ease: "power2.inOut" },
        "-=0.28"
      );

      // DrawSVG — inner ring draws in slightly offset
      tl.fromTo(
        innerCircleRef.current,
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" },
        "-=0.9"
      );

      // DrawSVG — circuit trace paths
      tl.fromTo(
        [circuitPath1Ref.current, circuitPath2Ref.current, circuitPath3Ref.current],
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 0.7, stagger: 0.12, ease: "power3.inOut" },
        "-=0.6"
      );

      // Shimmer sweep
      tl.fromTo(
        ".splash-shimmer",
        { x: "-110%" },
        { x: "220%", duration: 0.8, ease: "power1.inOut" },
        "-=0.1"
      );

      // Particle burst
      tl.call(() => spawnParticles(), [], "-=0.3");

      // Logo wordmark slides up
      tl.fromTo(
        logoTextRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.2"
      );

      // Stats stagger in
      tl.fromTo(
        [stat1Ref.current, stat2Ref.current, stat3Ref.current],
        { opacity: 0, y: 16, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12, ease: "back.out(1.5)" },
        "-=0.1"
      );

      // Animate stat counters
      tl.call(
        () => {
          gsap.to({ val: 0 }, {
            val: 699, duration: 1.6, ease: "power2.out",
            onUpdate: function () {
              const el = stat1Ref.current?.querySelector(".stat-value");
              if (el) el.textContent = Math.round((this.targets() as {val:number}[])[0].val).toString();
            },
          });
          gsap.to({ val: 0 }, {
            val: 100, duration: 1.4, ease: "power2.out",
            onUpdate: function () {
              const el = stat2Ref.current?.querySelector(".stat-value");
              if (el) el.textContent = Math.round((this.targets() as {val:number}[])[0].val).toString();
            },
          });
        },
        [],
        "-=0.4"
      );

      // Terminal slides up
      tl.fromTo(
        terminalRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.2"
      );

      // Boot log ticks
      tl.call(() => {
        const total = LOG_LINES.length;
        let step = 0;
        const interval = setInterval(() => {
          step++;
          setLogIndex(step);
          const pct = Math.round((step / total) * 100);
          gsap.to(progressFillRef.current, { width: `${pct}%`, duration: 0.35, ease: "power1.out" });
          if (progressPctRef.current) progressPctRef.current.textContent = `${pct}%`;

          if (step >= total) {
            clearInterval(interval);
            setTimeout(() => {
              sessionStorage.setItem("ig-splash-seen", "1");
              const exitTl = gsap.timeline({
                onComplete: () => { setVisible(false); onComplete?.(); },
              });
              exitTl
                .to(terminalRef.current, { opacity: 0, y: -10, duration: 0.3, ease: "power2.in" })
                .to(statsRef.current, { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" }, "-=0.15")
                .to(logoRef.current, { scale: 1.08, opacity: 0, duration: 0.4, ease: "power3.in" }, "-=0.1")
                .to(glowBlobRef.current, { scale: 3, opacity: 0, duration: 0.6, ease: "power3.in" }, "-=0.3")
                .to(rootRef.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "power4.inOut" }, "-=0.2");
            }, 500);
          }
        }, 280);
      }, [], "+=0.1");

      // Continuous scanline
      gsap.to(scanlineRef.current, {
        y: "100vh", duration: 3, ease: "none", repeat: -1, repeatDelay: 2,
      });

      // Logo glow pulse
      gsap.to(logoBoxRef.current, {
        boxShadow:
          "0 0 50px rgba(99,102,241,0.85), 0 0 100px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
        duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#050507", opacity: 0 }}
    >
      <NeuralCanvas />

      {/* Ambient glow blob */}
      <div
        ref={glowBlobRef}
        className="pointer-events-none absolute"
        style={{
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0.06) 50%, transparent 75%)",
          transform: "translate(-50%, -50%)", left: "50%", top: "50%", opacity: 0,
        }}
      />

      {/* Scanline sweep */}
      <div
        ref={scanlineRef}
        className="pointer-events-none absolute inset-x-0"
        style={{
          top: "-2px", height: "2px",
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(165,180,252,0.8), rgba(99,102,241,0.6), transparent)",
          boxShadow: "0 0 12px rgba(99,102,241,0.8)",
        }}
      />

      {/* CRT overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)" }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, #050507 100%)" }}
      />

      {/* Particle container */}
      <div ref={particleContainerRef} className="pointer-events-none absolute inset-0" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-6 text-center">

        {/* Logo mark */}
        <div ref={logoRef} className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">

            {/* Outer rotating ring — drawn by DrawSVGPlugin */}
            <div ref={ringOuterRef} className="absolute" style={{ opacity: 0 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}>
                <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
                  <defs>
                    <linearGradient id="ring-grad-outer" x1="0" y1="0" x2="140" y2="140" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6366f1" />
                      <stop offset="0.45" stopColor="#a78bfa" stopOpacity="0.15" />
                      <stop offset="1" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  <circle
                    ref={outerCircleRef}
                    cx="70" cy="70" r="65"
                    stroke="url(#ring-grad-outer)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Inner counter-rotating ring — drawn by DrawSVGPlugin */}
            <div ref={ringInnerRef} className="absolute" style={{ opacity: 0 }}>
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
                <svg width="108" height="108" viewBox="0 0 108 108" fill="none">
                  <circle
                    ref={innerCircleRef}
                    cx="54" cy="54" r="50"
                    stroke="rgba(165,180,252,0.35)"
                    strokeWidth="0.75"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Logo box with circuit-trace SVG overlay */}
            <div
              ref={logoBoxRef}
              className="relative grid h-16 w-16 place-items-center rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                boxShadow: "0 0 30px rgba(99,102,241,0.5), 0 0 60px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
                opacity: 0,
              }}
            >
              {/* Circuit trace paths drawn by DrawSVGPlugin */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
              >
                {/* Horizontal trace top */}
                <path
                  ref={circuitPath1Ref}
                  d="M8 16 H28 V24 H44"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Vertical trace left */}
                <path
                  ref={circuitPath2Ref}
                  d="M16 8 V28 H24 V40 H36"
                  stroke="rgba(165,180,252,0.4)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Bottom trace */}
                <path
                  ref={circuitPath3Ref}
                  d="M20 56 H40 V48 H52"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* IG wordmark */}
              <span className="relative z-10 text-2xl font-bold text-white select-none">IG</span>

              {/* Shimmer sweep */}
              <div
                className="splash-shimmer absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                  transform: "skewX(-20deg)", pointerEvents: "none",
                }}
              />
            </div>
          </div>

          <div ref={logoTextRef} className="flex flex-col items-center gap-1" style={{ opacity: 0 }}>
            <span className="text-3xl font-semibold tracking-tight text-white" style={{ fontFamily: "var(--font-geist-sans, sans-serif)" }}>
              InferGrid
            </span>
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-indigo-400/80">
              Distributed ML Inference
            </span>
          </div>
        </div>

        {/* Live stats */}
        <div ref={statsRef} className="flex gap-10">
          <div ref={stat1Ref} className="flex flex-col items-center gap-1" style={{ opacity: 0 }}>
            <span className="tabular-nums text-2xl font-semibold text-white">
              <span className="stat-value">0</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">RPS capacity</span>
          </div>
          <div ref={stat2Ref} className="flex flex-col items-center gap-1" style={{ opacity: 0 }}>
            <span className="tabular-nums text-2xl font-semibold text-white">
              <span className="stat-value">0</span>
              <span className="ml-0.5 text-base font-medium text-indigo-400">ms</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">p95 latency</span>
          </div>
          <div ref={stat3Ref} className="flex flex-col items-center gap-1" style={{ opacity: 0 }}>
            <span className="tabular-nums text-2xl font-semibold text-white">0%</span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">Failure rate</span>
          </div>
        </div>

        {/* Boot terminal */}
        <div ref={terminalRef} className="w-full max-w-md" style={{ opacity: 0 }}>
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
              <AnimatePresence>
                {LOG_LINES.slice(0, logIndex).map((line, i) => {
                  const isLast = i === logIndex - 1;
                  const isDone = i < logIndex - 1;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18 }}
                      className={`flex items-start gap-2 leading-5 ${isDone ? "text-zinc-500" : "text-indigo-300"}`}
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
              </AnimatePresence>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="relative h-px w-full overflow-hidden rounded-full bg-white/10">
                <div
                  ref={progressFillRef}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: "0%",
                    background: "linear-gradient(90deg, #818cf8, #6366f1, #a78bfa)",
                    boxShadow: "0 0 8px rgba(99,102,241,0.8)",
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-600">
                <span>Initialising platform</span>
                <span ref={progressPctRef} className="tabular-nums text-indigo-500">0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{ background: "linear-gradient(to top, #050507, transparent)" }}
      />
    </div>
  );
}
