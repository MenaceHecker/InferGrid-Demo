import Link from "next/link";
import InferGrid from "./InferGrid";

export const metadata = {
  title: "InferGrid · Live Demo",
  description:
    "An interactive cellular automaton where each cell's next state is inferred from its neighbors.",
};

export default function GridPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ← Back home
          </Link>
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
