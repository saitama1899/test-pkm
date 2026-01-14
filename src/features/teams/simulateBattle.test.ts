import { simulateBattle } from "./simulateBattle";

function p(name: string, atk: number, def: number, spd: number) {
  return {
    id: name,
    name,
    sprite: "",
    types: [],
    stats: {
      hp: 1,
      attack: atk,
      defense: def,
      specialAttack: 1,
      specialDefense: 1,
      speed: spd,
    },
  };
}

describe("simulateBattle (lógica)", () => {
  it("regla 4: si nadie supera defensa, gana el más rápido", () => {
    const teamA = {
      id: "a",
      name: "Equipo A",
      members: [p("A1", 10, 999, 100)],
    };

    const teamB = {
      id: "b",
      name: "Equipo B",
      members: [p("B1", 10, 999, 10)],
    };

    const res = simulateBattle(teamA as any, teamB as any);

    expect(res.winners[0]).toMatchObject({ winner: "A1", team: "Equipo A" });
    expect(res.summary.teamA.alive).toBe(1);
    expect(res.summary.teamB.alive).toBe(0);

    expect(res.events.some((e) => e.line.includes("Nadie supera DEF"))).toBe(true);
  });
});
