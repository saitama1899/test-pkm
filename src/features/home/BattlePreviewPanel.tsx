import styles from "../../app/layouts/PokedexLayout.module.css";
import { useBattleStore } from "../../stores/useBattleStore";

export function BattlePreviewPanel() {
  const a = useBattleStore((s) => s.selectedA);
  const b = useBattleStore((s) => s.selectedB);

  const phase = useBattleStore((s) => s.phase);
  const current = useBattleStore((s) => s.current);

  const winners = useBattleStore((s) => s.winners);
  const summary = useBattleStore((s) => s.summary);

  return (
    <>
      <div className={styles.statusLine} role="status" aria-live="polite">
        <span className={styles.statusPrompt}>
          <b>Prof. Oak: </b>
        </span>
        <span className={styles.statusText}>
          {renderBattleStatus(a?.name ?? null, b?.name ?? null, phase)}
        </span>
      </div>

      {phase === "finished" && summary ? (
        <div className={styles.resultBox}>
          <div className={styles.resultSummary}>
            <div className={styles.summaryRow}>
              <strong>{summary.teamA.name}</strong>
              <span>
                {summary.teamA.alive} vivos · {summary.teamA.fainted} debilitados
              </span>
            </div>

            <div className={styles.summaryRow}>
              <strong>{summary.teamB.name}</strong>
              <span>
                {summary.teamB.alive} vivos · {summary.teamB.fainted} debilitados
              </span>
            </div>
          </div>

          <div className={styles.resultRounds}>
            <div className={styles.resultSubTitle}>Ganadores por ronda</div>

            <ul className={styles.roundList}>
              {winners.map((w) => (
                <li key={`${w.round}-${w.winner}`}>
                  R{w.round}: <b>{w.winner}</b> <span className={styles.roundTeam}>({w.team})</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.resultHint}>Selecciona otro equipo para reiniciar.</div>
        </div>
      ) : (
        <>
          {/* VS solo si está luchando */}
          {phase === "fighting" ? (
            <div className={styles.battleTop}>
              <div className={styles.battleSlot}>
                {current?.left?.sprite ? (
                  <img
                    className={styles.battleImg}
                    src={current.left.sprite}
                    alt={current.left.name}
                  />
                ) : (
                  <div className={styles.battlePlaceholder} />
                )}
              </div>

              <div className={styles.vs}>VS</div>

              <div className={styles.battleSlot}>
                {current?.right?.sprite ? (
                  <img
                    className={styles.battleImg}
                    src={current.right.sprite}
                    alt={current.right.name}
                  />
                ) : (
                  <div className={styles.battlePlaceholder} />
                )}
              </div>
            </div>
          ) : null}

          {/* consola */}
          <div className={styles.battleLog}>
            <span className={styles.logPrompt}>&gt;</span>
            <span className={styles.logText}>
              {phase === "fighting"
                ? (current?.line ?? "...")
                : a && b
                  ? "¿Combatir?"
                  : "Selecciona equipos..."}
            </span>
          </div>
        </>
      )}
    </>
  );
}

function renderBattleStatus(a: string | null, b: string | null, phase: string) {
  if (!a && !b) return "Elige 2 equipos.";
  if (a && !b) return `${a}`;
  if (a && b) {
    if (phase === "fighting") return `${a} vs ${b}`;
    if (phase === "finished") return `${a} vs ${b} · Resultado final`;
    return `${a} vs ${b} ¿Combatir?`;
  }
  return "Elige 2 equipos.";
}
