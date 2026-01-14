## 🧩 Pokédex Battle App

Aplicación Frontend en **React + TypeScript** que simula la creación de equipos Pokémon y combates entre ellos, siguiendo reglas específicas de enfrentamiento.  
El proyecto está orientado a una **arquitectura profesional**, con separación clara de dominios, estado global con Zustand y pruebas unitarias con Jest + React Testing Library.

[Live demo](https://test-pkm.vercel.app)


<img width="400"  alt="Captura de pantalla 2026-01-14 103108" src="https://github.com/user-attachments/assets/1fae6ebf-56f0-4a2d-bd06-679b369602b3" />
<img width="400" alt="Captura de pantalla 2026-01-14 103122" src="https://github.com/user-attachments/assets/637c5d74-ba5b-4ebe-83f8-1673d3392c09" />
<img width="400" alt="Captura de pantalla 2026-01-14 103135" src="https://github.com/user-attachments/assets/b26295bc-9fdf-4356-ab40-4c02d5e71b80" />
<img width="400"  alt="Captura de pantalla 2026-01-14 103201" src="https://github.com/user-attachments/assets/a5e53dea-3fd8-40dc-9bd3-e679688f3249" />

---

### 🚀 Instalación y ejecución

```bash
npm i
npm run dev

http://localhost:5173
```

Tests

```bash
npm test
```

### 🧠 Arquitectura y decisiones técnicas

#### 📦 Separación por dominios

- domain/ contiene modelos puros sin dependencias de React.
- stores/ centraliza toda la lógica de estado (Zustand).
- features/ agrupa UI + lógica de cada caso de uso.

#### 🔁 Estado global con Zustand

useTeamsStore:

- Draft del equipo
- Guardado de equipos
- Ordenación, shuffle, limpieza

useBattleStore:

- Selección cíclica de equipos
- Simulación completa del combate
- Logs secuenciales (tick por intervalo)

Toda la lógica de combate vive fuera de los componentes, lo que facilita testing y mantenimiento.

#### 🧪 Testing-first friendly

- La simulación de combate está desacoplada del UI.
- Los tests usan la misma lógica real del juego.
- No hay mocks innecesarios de lógica crítica.

#### 🎨 UI y experiencia

- Layout tipo Pokédex minimalista
- Scroll independiente por panel
- Consola estilo terminal para feedback
- Animación temporal de combate (1 acción / 2s)
- Interacción drag & drop para ordenar equipos

#### 🧠 Arquitectura

#### 🧱 Dependencias

Core
- Node.js: 18.x
- React: 18.x
- TypeScript: 5.x
- Vite: 5.x

Estado y datos
- Zustand: ^4.x
- @tanstack/react-query: ^5.x

Testing

Jest: ^29.x
- @testing-library/react: ^14.x
- @testing-library/jest-dom: ^6.x

Estilos
- CSS Modules
- Design tokens propios (variables CSS)

Para los estilos lo he abordado de una manera similar a como estoy utilizando ahora mismo styled components.

#### 🗂️ Estructura de carpetas

```bash
src/
├── app/
│   └── layouts/
│       └── PokedexLayout.tsx        # Layout principal (gris + verde)
│
├── domain/
│   └── pokemon/
│       └── models.ts                # Modelos de dominio (Pokemon, Stats)
│
├── features/
│   ├── home/
│   │   ├── HomePage.tsx             # Pokédex + búsqueda + filtros
│   │   ├── CreatePreviewPanel.tsx   # Panel verde (crear equipo)
│   │   └── BattlePreviewPanel.tsx   # Panel verde (combate)
│   │
│   └── teams/
│       └── TeamsPage.tsx            # Selección de equipos para combate
│
├── hooks/
│   └── useDebouncedValue.ts         # Debounce para buscador
│
├── queries/
│   ├── usePokemonList.ts            # Listado paginado (cacheado)
│   ├── usePokemonSearch.ts          # Búsqueda + tipo
│   └── usePokemonTypes.ts           # Tipos Pokémon
│
├── stores/
│   ├── useTeamsStore.ts             # Draft + equipos guardados
│   └── useBattleStore.ts            # Lógica completa del combate
│
├── test/
│   ├── battle.logic.test.ts         # Test unitario de lógica
│   └── ui.preview.test.tsx          # Test unitario de UI
│
└── main.tsx

```
