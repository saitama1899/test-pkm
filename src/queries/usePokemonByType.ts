import { useQuery } from "@tanstack/react-query";
import { fetchPokemonByType } from "../api/typesApi";
import { pokemonKeys } from "./pokemonKeys";

export function usePokemonByType(type: string) {
  return useQuery({
    queryKey: pokemonKeys.byType(type),
    queryFn: () => fetchPokemonByType(type),
    enabled: Boolean(type) && type !== "all",
    staleTime: 10 * 60_000,
    select: (data) => data.pokemon.map((x) => x.pokemon.name),
  });
}
