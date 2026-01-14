import { create } from "zustand";
import type { Pokemon } from "../domain/pokemon/models";
import {
  simulateBattle,
  type TeamLite,
  type BattleEvent,
  type RoundWinner,
  type Summary,
} from "../features/teams/simulateBattle";

type Phase = "selecting" | "ready" | "fighting" | "finished";

type BattleState = {
  // selección (cíclica)
  selectedA: TeamLite | null;
  selectedB: TeamLite | null;
  replaceIndex: 0 | 1;

  // ejecución
  phase: Phase;
  events: BattleEvent[];
  cursor: number; // índice del evento actual
  current: BattleEvent | null;

  // resultado final
  winners: RoundWinner[];
  summary: Summary | null;

  // actions
  reset: () => void;
  pickTeam: (t: TeamLite) => void;

  prepare: () => void; // genera events + summary + winners
  start: () => void; // pone fighting y resetea cursor
  tick: () => void; // avanza 1 evento
};

export const useBattleStore = create<BattleState>((set, get) => ({
  selectedA: null,
  selectedB: null,
  replaceIndex: 0,

  phase: "selecting",
  events: [],
  cursor: 0,
  current: null,

  winners: [],
  summary: null,

  reset: () =>
    set({
      selectedA: null,
      selectedB: null,
      replaceIndex: 0,
      phase: "selecting",
      events: [],
      cursor: 0,
      current: null,
      winners: [],
      summary: null,
    }),

  pickTeam: (t) => {
    const { phase } = get();

    // Si había un combate terminado (o logs previos), al tocar selección volvemos al modo base
    if (phase === "finished") {
      set({
        phase: "selecting",
        events: [],
        cursor: 0,
        current: null,
        winners: [],
        summary: null,
      });
    }

    const { selectedA, selectedB, replaceIndex, phase: nextPhase } = get();
    if (nextPhase === "fighting") return;

    // A vacío
    if (!selectedA) {
      set({ selectedA: t, phase: "selecting" });
      return;
    }
    // B vacío
    if (!selectedB) {
      set({ selectedB: t, phase: "ready" });
      return;
    }

    // ambos llenos → reemplazo alterno (A, luego B, luego A...)
    if (replaceIndex === 0) {
      set({ selectedA: t, replaceIndex: 1, phase: "ready" });
    } else {
      set({ selectedB: t, replaceIndex: 0, phase: "ready" });
    }
  },

  prepare: () => {
    const { selectedA, selectedB } = get();
    if (!selectedA || !selectedB) return;

    const sim = simulateBattle(selectedA, selectedB);
    set({
      events: sim.events,
      winners: sim.winners,
      summary: sim.summary,
      cursor: 0,
      current: null,
      phase: "ready",
    });
  },

  start: () => {
    const { selectedA, selectedB, events } = get();
    if (!selectedA || !selectedB) return;

    // si aún no hay eventos, no arrancamos (debe llamarse prepare antes)
    if (events.length === 0) return;

    set({
      phase: "fighting",
      cursor: 0,
      current: null,
    });
  },

  tick: () => {
    const { phase, events, cursor } = get();
    if (phase !== "fighting") return;

    if (cursor >= events.length) {
      set({ phase: "finished" });
      return;
    }

    set({
      current: events[cursor],
      cursor: cursor + 1,
    });
  },
}));

