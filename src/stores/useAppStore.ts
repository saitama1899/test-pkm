import { create } from "zustand";

type AppState = {
  appName: string;
  setAppName: (name: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  appName: "Poke Teams",
  setAppName: (appName) => set({ appName }),
}));
