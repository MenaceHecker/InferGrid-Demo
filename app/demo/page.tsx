import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { PredictDemo } from "./PredictDemo";

export const metadata: Metadata = {
  title: "InferGrid · Live Inference Demo",
  description:
    "Classify text against the InferGrid inference API — a TF-IDF + LogReg model over the 20 Newsgroups topics, served on Kubernetes.",
};

export default function DemoPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-10 font-sans dark:bg-black">
      <div className="flex w-full max-w-3xl items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft />
            Back home
          </Link>
        </Button>
        <ThemeToggle />
      </div>
      <main className="mt-8 flex w-full max-w-3xl flex-col gap-8">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Live demo
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Classify text with the inference API
          </h1>
          <p className="max-w-xl leading-7 text-zinc-600 dark:text-zinc-400">
            Your text is proxied server-side to the InferGrid{" "}
            <span className="font-mono text-sm">/predict</span> endpoint, which
            routes it through a TF-IDF + LogReg classifier trained on the 20
            Newsgroups corpus and returns the topic with a confidence score.
          </p>
        </div>
        <PredictDemo />
      </main>
    </div>
  );
}
