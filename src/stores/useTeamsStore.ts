import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Pokemon } from "../domain/pokemon/models";

type Team = {
  id: string;
  name: string;
  createdAt: number;
  members: Pokemon[]; // guardamos modelo (incluye sprite + stats)
};

type TeamsState = {
  draft: Pokemon[];
  teams: Team[];
  message: string | null;

  addToDraft: (p: Pokemon) => void;
  removeDraftAt: (index: number) => void;
  clearDraft: () => void;

  saveDraftAsTeam: () => void;
  clearMessage: () => void;

  swapDraft: (from: number, to: number) => void;
  shuffleDraft: () => void;
  sortDraftByAttackDesc: () => void;
};

function uid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useTeamsStore = create<TeamsState>()(
  persist(
    (set, get) => ({
      draft: [],
      teams: [],
      message: null,

      addToDraft: (p) => {
        const { draft } = get();
        if (draft.length >= 6) {
          set({ message: "Máximo 6 Pokémon en el equipo!!" });
          return;
        }
        // se permiten repetidos
        set({ draft: [...draft, p] });
      },

      removeDraftAt: (index) => {
        const { draft } = get();
        if (index < 0 || index >= draft.length) return;
        set({ draft: draft.filter((_, i) => i !== index) });
      },

      clearDraft: () => set({ draft: [], message: "Equipo limpiado." }),

      saveDraftAsTeam: () => {
        const { draft, teams } = get();
        if (draft.length === 0) {
          set({ message: "Añade al menos 1 Pokémon antes de crear." });
          return;
        }

        const nextNumber = teams.length + 1;
        const team: Team = {
          id: uid(),
          name: `Equipo ${nextNumber}`,
          createdAt: Date.now(),
          members: draft,
        };

        set({
          teams: [team, ...teams],
          draft: [],
          message: "Has creado un nuevo equipo!",
        });
      },

      clearMessage: () => set({ message: null }),

      swapDraft: (from, to) => {
        const { draft } = get();
        if (from === to) return;
        if (from < 0 || to < 0 || from >= draft.length || to >= draft.length) return;

        const next = [...draft];
        [next[from], next[to]] = [next[to], next[from]];
        set({ draft: next, message: "Orden actualizado." });
      },

      shuffleDraft: () => {
        const { draft } = get();
        if (draft.length < 2) return;

        const next = [...draft];
        for (let i = next.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [next[i], next[j]] = [next[j], next[i]];
        }
        set({ draft: next, message: "Equipo mezclado." });
      },

      sortDraftByAttackDesc: () => {
        const { draft } = get();
        if (draft.length < 2) return;

        const next = [...draft].sort((a, b) => b.stats.attack - a.stats.attack);
        set({ draft: next, message: "Ordenado por ATK (desc)." });
      },
    }),
    {
      name: "poke-teams-store",
      partialize: (s) => ({ draft: s.draft, teams: s.teams }), // no persistimos message
    },
  ),
);
