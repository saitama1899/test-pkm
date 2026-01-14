export type PokemonDetailResponse = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
  types: Array<{
    slot: number;
    type: { name: string; url: string };
  }>;
  stats: Array<{
    base_stat: number;
    stat: { name: string; url: string };
  }>;
};

const BASE_URL = "https://pokeapi.co/api/v2";

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export function fetchPokemon(name: string) {
  return getJson<PokemonDetailResponse>(`${BASE_URL}/pokemon/${name}`);
}
