"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Loader2, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

// Human-readable names for the 20 Newsgroups labels the model returns.
const LABELS: Record<string, string> = {
  "alt.atheism": "Atheism",
  "comp.graphics": "Computer Graphics",
  "comp.os.ms-windows.misc": "MS Windows",
  "comp.sys.ibm.pc.hardware": "PC Hardware",
  "comp.sys.mac.hardware": "Mac Hardware",
  "comp.windows.x": "X Window System",
  "misc.forsale": "For Sale",
  "rec.autos": "Autos",
  "rec.motorcycles": "Motorcycles",
  "rec.sport.baseball": "Baseball",
  "rec.sport.hockey": "Hockey",
  "sci.crypt": "Cryptography",
  "sci.electronics": "Electronics",
  "sci.med": "Medicine",
  "sci.space": "Space",
  "soc.religion.christian": "Christianity",
  "talk.politics.guns": "Gun Politics",
  "talk.politics.mideast": "Mideast Politics",
  "talk.politics.misc": "Politics",
  "talk.religion.misc": "Religion",
};

const SAMPLES = [
  "NASA confirmed the spacecraft entered orbit around the moon after a three-day journey.",
  "The goalie made 40 saves as the team clinched the playoff series in overtime.",
  "A new encryption standard uses elliptic-curve keys to secure messages end to end.",
  "Doctors reported the vaccine significantly reduced infection rates in the latest trials.",
];

interface PredictOk {
  ok: true;
  data: {
    prediction: string;
    confidence: number;
    model_backend: string;
    model_version: string;
  };
  latencyMs: number;
  endpoint: string;
}

interface PredictErr {
  ok: false;
  error: string;
  reason?: string;
  status?: number;
  latencyMs?: number;
  endpoint?: string;
}

type PredictResult = PredictOk | PredictErr;

export function PredictDemo() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResult | null>(null);

  async function run() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      setResult((await res.json()) as PredictResult);
    } catch {
      setResult({ ok: false, error: "network" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label htmlFor="predict-input" className="sr-only">
          Text to classify
        </label>
        <textarea
          id="predict-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") run();
          }}
          rows={4}
          maxLength={10_000}
          placeholder="Paste a news snippet and InferGrid will classify its topic…"
          className="w-full resize-y rounded-xl border border-black/[.12] bg-white px-4 py-3 text-sm leading-6 text-black outline-none transition-colors placeholder:text-zinc-400 focus:border-black/[.25] dark:border-white/[.15] dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-white/[.3]"
        />

        <div className="flex flex-wrap gap-2">
          {SAMPLES.map((s, i) => (
            <button
              key={i}
              onClick={() => setText(s)}
              className="rounded-full border border-black/[.1] px-3 py-1 text-xs text-zinc-600 transition-colors hover:bg-black/[.04] dark:border-white/[.15] dark:text-zinc-400 dark:hover:bg-white/[.06]"
            >
              {LABELS[
                ["sci.space", "rec.sport.hockey", "sci.crypt", "sci.med"][i]
              ] ?? `Sample ${i + 1}`}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-zinc-400">
            {text.length}/10,000 · ⌘↵ to run
          </span>
          <Button onClick={run} disabled={!text.trim() || loading}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Zap />
            )}
            {loading ? "Classifying…" : "Run inference"}
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.ok ? "ok" : "err"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {result.ok ? (
              <ResultCard result={result} />
            ) : (
              <OfflineCard result={result} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultCard({ result }: { result: PredictOk }) {
  const { prediction, confidence, model_backend, model_version } = result.data;
  const pretty = LABELS[prediction] ?? prediction;
  const pct = Math.round(confidence * 100);
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Predicted topic
          </p>
          <p className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {pretty}
          </p>
          <p className="font-mono text-xs text-zinc-400">{prediction}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold tabular-nums text-black dark:text-zinc-50">
            {pct}%
          </p>
          <p className="text-xs text-zinc-500">confidence</p>
        </div>
      </div>

      {/* confidence meter */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-black/[.06] dark:bg-white/[.1]">
        <motion.div
          className="h-full rounded-full bg-[#2a78d6] dark:bg-[#3987e5]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <dl className="grid grid-cols-3 gap-4 border-t border-black/[.06] pt-4 text-sm dark:border-white/[.08]">
        <Meta label="Backend" value={model_backend} />
        <Meta label="Version" value={model_version} />
        <Meta label="Latency" value={`${result.latencyMs}ms`} />
      </dl>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="font-mono text-black dark:text-zinc-50">{value}</dd>
    </div>
  );
}

function OfflineCard({ result }: { result: PredictErr }) {
  const isOffline = result.error === "offline" || result.error === "network";
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-amber-500/30 bg-amber-50/50 p-6 dark:border-amber-400/20 dark:bg-amber-950/10">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="flex flex-col gap-1">
          <p className="font-medium text-black dark:text-zinc-50">
            {isOffline
              ? "Live backend is offline"
              : "Request could not be completed"}
          </p>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {isOffline
              ? "The GKE inference endpoint isn’t reachable right now — the demo cluster is spun down to save cost. The request path below is exactly what runs against a live deployment."
              : `The proxy returned "${result.error}"${
                  result.status ? ` (status ${result.status})` : ""
                }.`}
          </p>
          {result.endpoint && (
            <p className="font-mono text-xs text-zinc-400">
              tried {result.endpoint}
              {result.reason ? ` · ${result.reason}` : ""}
              {typeof result.latencyMs === "number"
                ? ` · ${result.latencyMs}ms`
                : ""}
            </p>
          )}
        </div>
      </div>

      <Contract />
    </div>
  );
}

function Contract() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <CodeBlock
        title="Request"
        code={`POST /predict
Content-Type: application/json

{ "text": "NASA launched a new rocket." }`}
      />
      <CodeBlock
        title="Response"
        code={`200 OK

{
  "prediction": "sci.space",
  "confidence": 0.94,
  "model_backend": "onnx",
  "model_version": "primary"
}`}
      />
    </div>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/[.08] bg-white/70 dark:border-white/[.1] dark:bg-zinc-950/60">
      <div className="border-b border-black/[.06] px-3 py-1.5 text-xs font-medium text-zinc-500 dark:border-white/[.08]">
        {title}
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-5 text-zinc-700 dark:text-zinc-300">
        {code}
      </pre>
    </div>
  );
}
