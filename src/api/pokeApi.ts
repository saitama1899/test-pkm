import type { PokemonListResponse } from "./types";
import { BASE_URL } from "./utils";

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
