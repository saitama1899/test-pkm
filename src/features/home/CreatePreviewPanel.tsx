import type React from "react";
import styles from "../../app/layouts/PokedexLayout.module.css";
import { useTeamsStore } from "../../stores/useTeamsStore";

export function CreatePreviewPanel() {
  const draft = useTeamsStore((s) => s.draft);
  const message = useTeamsStore((s) => s.message);
  const removeDraftAt = useTeamsStore((s) => s.removeDraftAt);

  const swapDraft = useTeamsStore((s) => s.swapDraft);
  const shuffleDraft = useTeamsStore((s) => s.shuffleDraft);
  const sortDraftByAttackDesc = useTeamsStore((s) => s.sortDraftByAttackDesc);
  const clearDraft = useTeamsStore((s) => s.clearDraft);

  const onDragStart = (e: React.DragEvent<HTMLButtonElement>, from: number) => {
    e.dataTransfer.setData("text/plain", String(from));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent<HTMLButtonElement>, _to: number, canDrop: boolean) => {
    if (!canDrop) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: React.DragEvent<HTMLButtonElement>, to: number, canDrop: boolean) => {
    if (!canDrop) return;
    e.preventDefault();
    const raw = e.dataTransfer.getData("text/plain");
    const from = Number(raw);
    if (Number.isNaN(from)) return;
    swapDraft(from, to);
  };

  return (
    <>
      <div className={styles.statusLine} role="status" aria-live="polite">
        <span className={styles.statusPrompt}>
          <b>Prof. Oak: </b>
        </span>
        <span className={styles.statusText}>
          {message ?? "Listo. Selecciona tu equipo ¡Máximo 6!"}
        </span>
      </div>

      <div className={styles.slots} aria-label="Selected team preview">
        {Array.from({ length: 6 }).map((_, i) => {
          const p = draft[i];
          const has = Boolean(p);
          const canDropHere = has;

          return (
            <button
              key={i}
              type="button"
              className={has ? styles.slotFilled : styles.slotEmpty}
              onClick={() => (has ? removeDraftAt(i) : undefined)}
              aria-label={has ? `Slot ${i + 1}: ${p.name}` : `Empty slot ${i + 1}`}
              draggable={has}
              onDragStart={(e) => (has ? onDragStart(e, i) : undefined)}
              onDragOver={(e) => onDragOver(e, i, canDropHere)}
              onDrop={(e) => onDrop(e, i, canDropHere)}
            >
              {has && p.sprite ? (
                <>
                  <img className={styles.slotImg} src={p.sprite} alt={p.name} />
                  <span className={styles.slotOverlay} aria-hidden="true">
                    <span className={styles.slotIcon}>-</span>
                  </span>
                </>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className={styles.actionsRow}>
        <button type="button" className={styles.actionBtn} onClick={clearDraft}>
          LIMPIAR
        </button>

        <button
          type="button"
          className={styles.actionBtn}
          onClick={shuffleDraft}
          disabled={draft.length < 2}
        >
          ALEATORIO
        </button>

        <button
          type="button"
          className={styles.actionBtn}
          onClick={sortDraftByAttackDesc}
          disabled={draft.length < 2}
        >
          ATK ↓
        </button>
      </div>
    </>
  );
}
