import { ThemeToggle } from "@/components/theme-toggle";
import { Hero } from "./Hero";
import { Architecture } from "./Architecture";
import { Benchmarks } from "./Benchmarks";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex w-full max-w-5xl flex-1 flex-col px-6 sm:px-10">
        <header className="flex items-center justify-between py-6">
          <span className="flex items-center gap-2 text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background text-sm font-bold">
              IG
            </span>
            InferGrid
          </span>
          <ThemeToggle />
        </header>
        <main>
          <section className="py-16 sm:py-24">
            <Hero />
          </section>
          <Architecture />
          <Benchmarks />
        </main>
      </div>
    </div>
  );
}
