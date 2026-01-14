import { Outlet } from "react-router-dom";
import { useEffect } from "react";

import styles from "./PokedexLayout.module.css";

import { useTeamsStore } from "../../stores/useTeamsStore";

import { useBattleStore } from "../../stores/useBattleStore";
import { usePokedexMode } from "./usePokemonMode";
import { BattlePreviewPanel } from "../../features/home/BattlePreviewPanel";
import { CreatePreviewPanel } from "../../features/home/CreatePreviewPanel";

export default function PokedexLayout() {
  const mode = usePokedexMode();

  const saveDraftAsTeam = useTeamsStore((s) => s.saveDraftAsTeam);

  const selectedA = useBattleStore((s) => s.selectedA);
  const selectedB = useBattleStore((s) => s.selectedB);
  const prepare = useBattleStore((s) => s.prepare);
  const start = useBattleStore((s) => s.start);
  const phase = useBattleStore((s) => s.phase);
  const tick = useBattleStore((s) => s.tick);

  const actionLabel = mode === "create" ? "CREAR" : mode === "teams" ? "LUCHAR" : "OK";

  const onAction = () => {
    if (mode === "create") {
      saveDraftAsTeam();
      return;
    }

    if (mode === "teams") {
      if (!selectedA || !selectedB) return;

      prepare();
      start();
      tick();
    }
  };

  const actionDisabled = mode === "teams" ? !selectedA || !selectedB : false;

  useEffect(() => {
    if (mode !== "teams") return;
    if (phase !== "fighting") return;

    const id = window.setInterval(() => tick(), 2000);
    return () => window.clearInterval(id);
  }, [mode, phase, tick]);

  return (
    <div className={styles.screen}>
      <section className={styles.listPanel}>
        <div className={styles.listScroll}>
          <Outlet />
        </div>
      </section>

      <div className={styles.bottomRow}>
        <section className={styles.previewPanel}>
          {mode === "teams" ? <BattlePreviewPanel /> : <CreatePreviewPanel />}
        </section>

        <button
          type="button"
          className={styles.previewAction}
          aria-label={actionLabel}
          onClick={onAction}
          disabled={actionDisabled}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
