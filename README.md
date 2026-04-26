# El Safari de Leo

PWA personal de avistamientos de animales para Leo (7 años).

Estado: **fase 1 — cimientos** (scaffolding, Tailwind, Firebase SDK, router placeholder, layout base, security rules, PWA mínima, repo).

## Stack
React 19 + Vite 6 + TypeScript + Tailwind + React Router + Zustand + Firebase (Auth, Firestore, Storage) + Leaflet + vite-plugin-pwa. pnpm como gestor.

## Desarrollo
```sh
pnpm install
cp .env.example .env.local   # rellenar valores de Firebase
pnpm dev
```

## Estructura
- `src/app/` — shell de la app (router, providers).
- `src/pages/` — páginas por ruta.
- `src/components/layout|ui/` — layout y primitives.
- `src/features/` — lógica por dominio (sightings, animals…).
- `src/lib/` — utilidades transversales (firebase, helpers).
- `src/stores/` — Zustand stores.
- `src/types/` — tipos compartidos (espejo de Firestore).
- `firebase/` — security rules y config CLI.
