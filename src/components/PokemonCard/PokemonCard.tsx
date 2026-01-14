import styles from "./PokemonCard.module.css";
import { usePokemon } from "../../queries/usePokemon";
import { useTeamsStore } from "../../stores/useTeamsStore";

type PokemonCardProps = { name: string };

export default function PokemonCard({ name }: PokemonCardProps) {
  const { data, isLoading, isError } = usePokemon(name);
  const addToDraft = useTeamsStore((s) => s.addToDraft);

  if (isLoading) {
    return (
      <li className={styles.card}>
        <p className={styles.muted}>Cargando {name}…</p>
      </li>
    );
  }

  if (isError || !data) {
    return (
      <li className={styles.card}>
        <p className={styles.error}>Error cargando {name}</p>
      </li>
    );
  }

  return (
    <li className={styles.card} onClick={() => addToDraft(data)} role="button" tabIndex={0}>
      {data.sprite ? <img className={styles.sprite} src={data.sprite} alt={data.name} /> : null}

      <div className={styles.meta}>
        <p className={styles.name}>{data.name}</p>

        <div className={styles.types}>
          {data.types.map((t) => (
            <span key={t} className={styles.pill}>
              {t}
            </span>
          ))}
        </div>

        <div className={styles.stats}>
          <span>ATK {data.stats.attack}</span>
          <span>DEF {data.stats.defense}</span>
          <span>SPD {data.stats.speed}</span>
        </div>
      </div>
    </li>
  );
}
