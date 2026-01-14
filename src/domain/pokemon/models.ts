export type Pokemon = {
  id: number;
  name: string;
  sprite: string | null;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
};
