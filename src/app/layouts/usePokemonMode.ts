import { useMatch } from "react-router-dom";

export type PokedexMode = "create" | "teams" | "other";

export function usePokedexMode(): PokedexMode {
  const isCreate = useMatch({ path: "/", end: true });
  const isTeams = useMatch("/teams");

  if (isCreate) return "create";
  if (isTeams) return "teams";
  return "other";
}
