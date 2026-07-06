"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, Shuffle, SkipForward, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { COLS, TICK_MS, useGridStore } from "@/lib/grid-store";

export default function InferGrid() {
  const cells = useGridStore((s) => s.cells);
  const running = useGridStore((s) => s.running);
  const generation = useGridStore((s) => s.generation);
  const liveCount = useGridStore((s) => s.liveCount);
  const toggle = useGridStore((s) => s.toggle);
  const advance = useGridStore((s) => s.advance);
  const setRunning = useGridStore((s) => s.setRunning);
  const randomize = useGridStore((s) => s.randomize);
  const clear = useGridStore((s) => s.clear);

  // The interval is recreated whenever `running` toggles, so it only ever
  // ticks while the simulation is playing.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(advance, TICK_MS);
    return () => clearInterval(id);
  }, [running, advance]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => setRunning(!running)}>
          {running ? <Pause /> : <Play />}
          {running ? "Pause" : "Play"}
        </Button>
        <Button variant="outline" onClick={advance} disabled={running}>
          <SkipForward />
          Step
        </Button>
        <Button variant="outline" onClick={randomize}>
          <Shuffle />
          Randomize
        </Button>
        <Button variant="outline" onClick={clear}>
          <Trash2 />
          Clear
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="grid w-full max-w-2xl gap-px rounded-lg border border-black/[.08] bg-black/[.06] p-px dark:border-white/[.12] dark:bg-white/[.08]"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        role="grid"
        aria-label="Cellular automaton grid"
      >
        {cells.map((alive, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            aria-label={`cell ${i}`}
            className={`aspect-square rounded-[1px] transition-colors ${
              alive
                ? "bg-foreground"
                : "bg-background hover:bg-black/[.08] dark:hover:bg-white/[.12]"
            }`}
          />
        ))}
      </motion.div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Generation{" "}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={generation}
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 6, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-block font-medium tabular-nums"
          >
            {generation}
          </motion.span>
        </AnimatePresence>
        {" · "}
        <span className="font-medium tabular-nums">{liveCount}</span> live cells
        {" · "}click cells to seed a pattern
      </p>
    </div>
  );
}
