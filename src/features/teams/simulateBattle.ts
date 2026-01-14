import { Pokemon } from "../../domain/pokemon/models";


export type TeamLite = {
  id: string;
  name: string;
  members: Pokemon[];
};

export type BattleEvent = {
  left: Pokemon | null;
  right: Pokemon | null;
  line: string;
};

export type RoundWinner = {
  round: number;
  winner: string;
  team: string;
};

export type Summary = {
  teamA: { name: string; alive: number; fainted: number };
  teamB: { name: string; alive: number; fainted: number };
};

export function simulateBattle(
  teamA: TeamLite,
  teamB: TeamLite,
): {
  events: BattleEvent[];
  winners: RoundWinner[];
  summary: Summary;
} {
  const events: BattleEvent[] = [];
  const winners: RoundWinner[] = [];

  let ai = 0;
  let bi = 0;

  let aliveA = teamA.members.length;
  let aliveB = teamB.members.length;
  let faintA = 0;
  let faintB = 0;

  const push = (line: string, left: Pokemon | null, right: Pokemon | null) =>
    events.push({ line, left, right });

  push(`Inicio: ${teamA.name} vs ${teamB.name}`, null, null);

  let round = 1;

  while (ai < teamA.members.length && bi < teamB.members.length) {
    const A = teamA.members[ai];
    const B = teamB.members[bi];

    push(`Ronda ${round}: ${A.name} vs ${B.name}`, A, B);

    // 1) mayor speed ataca primero
    const aFirst = A.stats.speed >= B.stats.speed;
    const first = aFirst ? A : B;
    const second = aFirst ? B : A;

    const firstTeamName = aFirst ? teamA.name : teamB.name;
    const secondTeamName = aFirst ? teamB.name : teamA.name;

    push(`${first.name} [${firstTeamName}]  ataca primero (SPD).`, A, B);

    // 2) si ATK > DEF => debilita
    if (first.stats.attack > second.stats.defense) {
      push(`${first.name} [${firstTeamName}]  supera DEF → ${second.name} [${secondTeamName}] debilitado.`, A, B);

      winners.push({ round, winner: first.name, team: firstTeamName });

      // ganador sigue, perdedor avanza
      if (aFirst) {
        bi += 1;
        aliveB -= 1;
        faintB += 1;
      } else {
        ai += 1;
        aliveA -= 1;
        faintA += 1;
      }
    } else {
      // 3) lento ataca
      push(`${second.name} [${secondTeamName}] responde (SPD menor).`, A, B);

      if (second.stats.attack > first.stats.defense) {
        push(`${second.name} [${secondTeamName}] supera DEF → ${first.name} [${firstTeamName}]  debilitado.`, A, B);

        winners.push({ round, winner: second.name, team: secondTeamName });

        // ganador sigue, perdedor avanza
        if (aFirst) {
          ai += 1;
          aliveA -= 1;
          faintA += 1;
        } else {
          bi += 1;
          aliveB -= 1;
          faintB += 1;
        }
      } else {
        // 4) nadie supera DEF → gana el más rápido
        push(`Nadie supera DEF → gana el más rápido: ${first.name} [${firstTeamName}] .`, A, B);

        winners.push({ round, winner: first.name, team: firstTeamName });

        if (aFirst) {
          bi += 1;
          aliveB -= 1;
          faintB += 1;
        } else {
          ai += 1;
          aliveA -= 1;
          faintA += 1;
        }
      }
    }

    round += 1;
  }

  const winnerTeam = ai < teamA.members.length ? teamA.name : teamB.name;
  push(`Fin del combate. Ganador: ${winnerTeam}.`, null, null);

  return {
    events,
    winners,
    summary: {
      teamA: { name: teamA.name, alive: aliveA, fainted: faintA },
      teamB: { name: teamB.name, alive: aliveB, fainted: faintB },
    },
  };
}
