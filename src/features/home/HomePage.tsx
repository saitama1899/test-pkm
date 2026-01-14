// src/features/home/HomePage.tsx
import { useMemo, useState } from "react";
import styles from "./HomePage.module.css";

import PokedexPanel from "../pokedex/PokedexPanel";

import { usePokemonTypes } from "../../queries/usePokemonTypes";
import { usePokemonList } from "../../queries/usePokemonList";
import { usePokemonSearch } from "../../queries/usePokemonSearch";
import { useDebouncedValue } from "../../hooks/useDebounceValue";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim().toLowerCase(), 300);

  const [type, setType] = useState<string>("all");

  const [offset, setOffset] = useState(0);
  const limit = 21;

  const typesQuery = usePokemonTypes();

  // Modo normal: lista paginada server-side (cache por página)
  const listQuery = usePokemonList({ limit, offset });

  // Modo búsqueda: cache por key exacta (q+type+offset+limit)
  const isSearchMode = debouncedSearch.length > 0 || type !== "all";

  const searchQuery = usePokemonSearch({
    q: debouncedSearch,
    type,
    offset,
    limit,
  });

  const typeOptions = useMemo(() => {
    const raw = typesQuery.data?.results?.map((t) => t.name) ?? [];
    const cleaned = raw.filter((t) => t !== "unknown" && t !== "shadow");
    return ["all", ...cleaned];
  }, [typesQuery.data]);

  const names = isSearchMode
    ? (searchQuery.data?.page ?? [])
    : (listQuery.data?.results.map((p) => p.name) ?? []);

  const total = isSearchMode ? (searchQuery.data?.total ?? 0) : (listQuery.data?.count ?? 0);

  const start = total === 0 ? 0 : offset + 1;
  const end = total === 0 ? 0 : Math.min(offset + limit, total);

  const isLoading =
    typesQuery.isLoading || (isSearchMode ? searchQuery.isLoading : listQuery.isLoading);

  const isError = typesQuery.isError || (isSearchMode ? searchQuery.isError : listQuery.isError);

  const onChangeType = (v: string) => {
    setType(v);
    setOffset(0);
  };

  const onChangeSearch = (v: string) => {
    setSearch(v);
    setOffset(0);
  };

  return (
    <div className={styles.home}>
      <div className={styles.controls}>
        <input
          className={styles.search}
          value={search}
          onChange={(e) => onChangeSearch(e.target.value)}
          placeholder="Buscar Pokémon…"
          aria-label="Buscar Pokémon"
        />

        <select
          className={styles.select}
          value={type}
          onChange={(e) => onChangeType(e.target.value)}
          aria-label="Filter by type"
        >
          {typeOptions.map((t) => (
            <option key={t} value={t}>
              {t === "all" ? "Todos" : t}
            </option>
          ))}
        </select>
      </div>

      {/* SOLO la lista scrollea */}
      <div className={styles.listArea}>
        {isLoading ? <p style={{ color: "rgba(255,255,255,0.8)" }}>Cargando…</p> : null}
        {isError ? <p style={{ color: "rgba(255,255,255,0.8)" }}>Error cargando datos.</p> : null}

        <PokedexPanel names={names} />
      </div>

      {/* Paginación: flechas triangulares */}
      <div className={styles.paginationBar}>
        <button
          className={styles.triangleButton}
          type="button"
          onClick={() => setOffset((v) => Math.max(0, v - limit))}
          disabled={offset === 0}
          aria-label="Previous page"
        >
          <span className={styles.triangle} />
        </button>

        <span className={styles.paginationHint}>
          {total ? `${start}-${end} / ${total}` : "0 / 0"}
        </span>

        <button
          className={styles.triangleButton}
          type="button"
          onClick={() => setOffset((v) => v + limit)}
          disabled={offset + limit >= total}
          aria-label="Next page"
        >
          <span className={`${styles.triangle} ${styles.triangleLeft}`} />
        </button>
      </div>
    </div>
  );
}
