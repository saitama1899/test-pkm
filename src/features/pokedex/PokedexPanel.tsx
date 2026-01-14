import PokemonCard from "../../components/PokemonCard/PokemonCard";
import styles from "./PokedexPanel.module.css";

type PokedexPanelProps = {
  names: string[];
};

export default function PokedexPanel({ names }: PokedexPanelProps) {
  return (
    <ul className={styles.list}>
      {names.map((name) => (
        <PokemonCard key={name} name={name} />
      ))}
    </ul>
  );
}