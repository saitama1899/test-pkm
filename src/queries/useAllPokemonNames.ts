import { useQuery } from "@tanstack/react-query";
import { fetchAllPokemonNames } from "../api/allPokemon";

export const allNamesKey = ["pokemon", "allNames"] as const;

export function useAllPokemonNames() {
  return useQuery({
    queryKey: allNamesKey,
    queryFn: fetchAllPokemonNames,
    staleTime: 24 * 60 * 60_000,
  });
}
