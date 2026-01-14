import { BASE_URL } from "./utils";

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export type TypeListResponse = {
  results: Array<{ name: string; url: string }>;
};

export type TypeDetailResponse = {
  pokemon: Array<{
    pokemon: { name: string; url: string };
    slot: number;
  }>;
};

export function fetchTypes() {
  return getJson<TypeListResponse>(`${BASE_URL}/type`);
}

export function fetchPokemonByType(type: string) {
  return getJson<TypeDetailResponse>(`${BASE_URL}/type/${type}`);
}
