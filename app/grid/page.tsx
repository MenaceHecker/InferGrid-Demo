import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import InferGrid from "./InferGrid";

export const metadata: Metadata = {
  title: "InferGrid · Live Demo",
  description:
    "An interactive cellular automaton where each cell's next state is inferred from its neighbors.",
};

export default function GridPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft />
            Back home
          </Link>
        </Button>
        <ThemeToggle />
      </div>
      <main className="mt-8 flex w-full max-w-2xl flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            InferGrid
          </h1>
          <p className="max-w-md text-zinc-600 dark:text-zinc-400">
            Each cell infers its next state from its eight neighbors. Seed a
            pattern, then press Play to watch it evolve.
          </p>
        </div>
        <InferGrid />
      </main>
    </div>
  );
}
