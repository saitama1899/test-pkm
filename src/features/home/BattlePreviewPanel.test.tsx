import { render, screen } from "@testing-library/react";
import { BattlePreviewPanel } from "./BattlePreviewPanel";
import "@testing-library/jest-dom";

jest.mock("../../stores/useBattleStore", () => ({
  useBattleStore: (selector: any) =>
    selector({
      selectedA: { name: "Equipo 1" },
      selectedB: { name: "Equipo 4" },
      phase: "finished",
      current: null,
      winners: [{ round: 1, winner: "pikachu", team: "Equipo 1" }],
      summary: {
        teamA: { name: "Equipo 1", alive: 2, fainted: 4 },
        teamB: { name: "Equipo 4", alive: 0, fainted: 6 },
      },
    }),
}));

describe("BattlePreviewPanel (UI)", () => {
  it("muestra resumen final y ganadores por ronda cuando phase=finished", () => {
    render(<BattlePreviewPanel />);

    expect(screen.getByText("Equipo 1")).toBeInTheDocument();
    expect(screen.getByText("2 vivos · 4 debilitados")).toBeInTheDocument();

    expect(screen.getByText("Equipo 4")).toBeInTheDocument();
    expect(screen.getByText("0 vivos · 6 debilitados")).toBeInTheDocument();

    expect(screen.getByText("Ganadores por ronda")).toBeInTheDocument();
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();

    // No debe renderizar "VS" fuera de fighting
    expect(screen.queryByText("VS")).not.toBeInTheDocument();
  });
});
