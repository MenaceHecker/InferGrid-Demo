import { create } from "zustand";

export const COLS = 36;
export const ROWS = 22;
export const TICK_MS = 100;

export type Cells = boolean[];

const emptyGrid = (): Cells =>
  Array.from({ length: ROWS * COLS }, () => false);

const randomGrid = (): Cells =>
  // Runs only on the client (via an action), so Math.random never causes a
  // hydration mismatch.
  Array.from({ length: ROWS * COLS }, () => Math.random() > 0.72);

// Count live neighbors on a toroidal (wrap-around) grid, then apply Conway's
// rules to infer the next generation for every cell.
function nextGeneration(cells: Cells): Cells {
  const next: Cells = new Array(ROWS * COLS);
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

interface GridState {
  cells: Cells;
  running: boolean;
  generation: number;
  liveCount: number;
  toggle: (index: number) => void;
  advance: () => void;
  setRunning: (running: boolean) => void;
  randomize: () => void;
  clear: () => void;
}

const countLive = (cells: Cells) =>
  cells.reduce((n, alive) => n + (alive ? 1 : 0), 0);

export const useGridStore = create<GridState>((set) => ({
  cells: emptyGrid(),
  running: false,
  generation: 0,
  liveCount: 0,
  toggle: (index) =>
    set((state) => {
      const cells = state.cells.slice();
      cells[index] = !cells[index];
      return { cells, liveCount: countLive(cells) };
    }),
  advance: () =>
    set((state) => {
      const cells = nextGeneration(state.cells);
      return {
        cells,
        generation: state.generation + 1,
        liveCount: countLive(cells),
      };
    }),
  setRunning: (running) => set({ running }),
  randomize: () => {
    const cells = randomGrid();
    set({ cells, running: false, generation: 0, liveCount: countLive(cells) });
  },
  clear: () =>
    set({ cells: emptyGrid(), running: false, generation: 0, liveCount: 0 }),
}));
