import { useQuery } from "@tanstack/react-query";
import { fetchPokemon } from "../api/pokemon";
import { mapPokemon } from "../domain/pokemon/mapPokemon";
import { pokemonKeys } from "./pokemonKeys";

export function usePokemon(name: string) {
  return useQuery({
    queryKey: pokemonKeys.detail(name),
    queryFn: () => fetchPokemon(name),
    select: mapPokemon,
    staleTime: 5 * 60_000,
  });
}
