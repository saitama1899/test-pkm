import { useQuery, useQueryClient } from "@tanstack/react-query";
import { allNamesKey } from "./useAllPokemonNames";
import { fetchAllPokemonNames } from "../api/allPokemon";
import { fetchPokemonByType } from "../api/typesApi";

export type SearchResult = {
  total: number;
  page: string[];
};

export function usePokemonSearch(params: {
  q: string; // ya debounced y normalizado
  type: string;
  offset: number;
  limit: number;
}) {
  const { q, type, offset, limit } = params;
  const qc = useQueryClient();

  return useQuery({
    queryKey: ["pokemon", "search", { q, type, offset, limit }] as const,
    queryFn: async (): Promise<SearchResult> => {
      // 1) dataset base según tipo
      let baseNames: string[];

      if (type === "all") {
        // intenta usar cache de allNames
        baseNames =
          qc.getQueryData<string[]>(allNamesKey) ??
          (await qc.fetchQuery({ queryKey: allNamesKey, queryFn: fetchAllPokemonNames }));
      } else {
        const typeDetail = await fetchPokemonByType(type);
        baseNames = typeDetail.pokemon.map((x) => x.pokemon.name);
      }

      // 2) filtro por texto (q)
      const filtered = q ? baseNames.filter((n) => n.includes(q)) : baseNames;

      // 3) paginación client-side para resultados filtrados
      const page = filtered.slice(offset, offset + limit);

      return { total: filtered.length, page };
    },
    // clave: así no “parpadea” al cambiar offset, y mantiene la página anterior mientras carga
    placeholderData: (prev) => prev,
    staleTime: 10 * 60_000,
  });
}
