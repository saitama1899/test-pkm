import { useQuery } from "@tanstack/react-query";
import { fetchTypes } from "../api/typesApi";
import { pokemonKeys } from "./pokemonKeys";

export function usePokemonTypes() {
  return useQuery({
    queryKey: pokemonKeys.types(),
    queryFn: fetchTypes,
    staleTime: 24 * 60 * 60_000,
  });
}
