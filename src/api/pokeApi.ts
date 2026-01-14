import type { PokemonListResponse } from "./types";

const BASE_URL = "https://pokeapi.co/api/v2";

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export function fetchPokemonList(params: { limit: number; offset: number }) {
  const { limit, offset } = params;
  const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
  return getJson<PokemonListResponse>(url);
}
