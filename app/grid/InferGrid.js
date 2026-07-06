"use client";

import { useCallback, useEffect, useState } from "react";

const COLS = 36;
const ROWS = 22;
const TICK_MS = 100;

const emptyGrid = () => Array.from({ length: ROWS * COLS }, () => false);

const randomGrid = () =>
  // Deterministic-free randomness is fine here; this only runs on the client
  // after mount, so it never causes hydration mismatches.
  Array.from({ length: ROWS * COLS }, () => Math.random() > 0.72);

// Count live neighbors on a toroidal (wrap-around) grid, then apply Conway's
// rules to infer the next generation for every cell.
function step(cells) {
  const next = new Array(ROWS * COLS);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let live = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = (r + dr + ROWS) % ROWS;
          const nc = (c + dc + COLS) % COLS;
          if (cells[nr * COLS + nc]) live++;
        }
      }
      const i = r * COLS + c;
      next[i] = cells[i] ? live === 2 || live === 3 : live === 3;
    }
  }
  return next;
}

export default function InferGrid() {
  const [cells, setCells] = useState(emptyGrid);
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);

  const advance = useCallback(() => {
    setCells((prev) => step(prev));
    setGeneration((g) => g + 1);
  }, []);

  // The interval is recreated whenever `running` toggles, so it only ever
  // ticks while the simulation is playing.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(advance, TICK_MS);
    return () => clearInterval(id);
  }, [running, advance]);

  const toggle = (i) => {
    setCells((prev) => {
      const next = prev.slice();
      next[i] = !next[i];
      return next;
    });
  };

  const reset = (factory) => {
    setRunning(false);
    setGeneration(0);
    setCells(factory);
  };

  const liveCount = cells.reduce((n, alive) => n + (alive ? 1 : 0), 0);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          className="h-10 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:opacity-90"
        >
          {running ? "Pause" : "Play"}
        </button>
        <button
          onClick={advance}
          disabled={running}
          className="h-10 rounded-full border border-black/[.12] px-5 text-sm font-medium transition-colors hover:bg-black/[.04] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[.18] dark:hover:bg-white/[.06]"
        >
          Step
        </button>
        <button
          onClick={() => reset(randomGrid)}
          className="h-10 rounded-full border border-black/[.12] px-5 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.18] dark:hover:bg-white/[.06]"
        >
          Randomize
        </button>
        <button
          onClick={() => reset(emptyGrid)}
          className="h-10 rounded-full border border-black/[.12] px-5 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.18] dark:hover:bg-white/[.06]"
        >
          Clear
        </button>
      </div>

      <div
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
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Generation <span className="font-medium tabular-nums">{generation}</span>
        {" · "}
        <span className="font-medium tabular-nums">{liveCount}</span> live cells
        {" · "}click cells to seed a pattern
      </p>
    </div>
  );
}
