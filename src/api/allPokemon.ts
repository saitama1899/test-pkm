import { BASE_URL } from "./utils";

type PokemonListResponse = {
  results: Array<{ name: string; url: string }>;
};

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export async function fetchAllPokemonNames() {
  const data = await getJson<PokemonListResponse>(`${BASE_URL}/pokemon?limit=100000&offset=0`);
  return data.results.map((p) => p.name);
}
