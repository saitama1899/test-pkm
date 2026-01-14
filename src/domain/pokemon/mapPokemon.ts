
import { PokemonDetailResponse } from "../../api/pokemon";
import type { Pokemon } from "./models";

function statValue(detail: PokemonDetailResponse, statName: string): number {
  const s = detail.stats.find((x) => x.stat.name === statName);
  return s?.base_stat ?? 0;
}

export function mapPokemon(detail: PokemonDetailResponse): Pokemon {
  return {
    id: detail.id,
    name: detail.name,
    sprite: detail.sprites.front_default ?? null,
    types: detail.types.map((t) => t.type.name),
    stats: {
      hp: statValue(detail, "hp"),
      attack: statValue(detail, "attack"),
      defense: statValue(detail, "defense"),
      speed: statValue(detail, "speed"),
    },
  };
}
