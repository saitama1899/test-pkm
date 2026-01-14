import { useQuery } from "@tanstack/react-query";
import { fetchPokemonList } from "../api/pokeApi";
import { pokemonKeys } from "./pokemonKeys";

export function usePokemonList(params: { limit: number; offset: number }) {
  return useQuery({
    queryKey: pokemonKeys.list(params),
    queryFn: () => fetchPokemonList(params),
  });
}
