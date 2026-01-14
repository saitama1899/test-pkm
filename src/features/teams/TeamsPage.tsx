import { useEffect } from "react";
import { useTeamsStore } from "../../stores/useTeamsStore";
import { useBattleStore } from "../../stores/useBattleStore";
import styles from "./TeamsPage.module.css";

export default function TeamsPage() {
  const teams = useTeamsStore((s) => s.teams);

  const pickTeam = useBattleStore((s) => s.pickTeam);
  const reset = useBattleStore((s) => s.reset);

  // reset al entrar y salir de /teams
  useEffect(() => {
    reset();
    return () => reset();
  }, [reset]);

  if (teams.length === 0) {
    return <p style={{ color: "rgba(255,255,255,0.8)" }}>Aún no tienes equipos guardados.</p>;
  }

  return (
    <section className={styles.teamsPage}>
      <div className={styles.teamsScroll}>
        {teams.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => pickTeam({ id: t.id, name: t.name, members: t.members })}
            style={{
              textAlign: "left",
              border: "none",
              cursor: "pointer",
              background: "rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <strong>{t.name}</strong>
              <span style={{ opacity: 0.7, fontSize: 12 }}>
                {new Date(t.createdAt).toLocaleString()}
              </span>
            </div>

            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                gap: 8,
              }}
            >
              {t.members.map((p, i) => (
                <div
                  key={`${t.id}-${i}-${p.name}`}
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    aspectRatio: "1 / 1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                  title={p.name}
                >
                  {p.sprite ? (
                    <img
                      src={p.sprite}
                      alt={p.name}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
