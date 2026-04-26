# El Safari de Leo

PWA personal de avistamientos de animales para Leo (7 años). Regalo de cumpleaños — deadline **2026-06-07**.

## Stack

React 19 + Vite 6 + TypeScript + Tailwind v4 + React Router + Firebase (Auth, Firestore, Storage) + vite-plugin-pwa. Wikipedia + Wikidata como catálogo dinámico, Nominatim para reverse geocoding, iNaturalist para animales por ubicación, Leaflet para mapa, Recharts para gráficos, Wikimedia Commons para sonidos. pnpm como gestor.

## Desarrollo

```sh
pnpm install
cp .env.example .env.local   # rellenar valores de Firebase
pnpm dev
```

Build de producción y vista previa de PWA:

```sh
pnpm build && pnpm preview
```

## Estructura

- `src/app/` — shell (router, providers, App).
- `src/pages/` — páginas por ruta.
- `src/components/layout|ui/` — layout y primitives.
- `src/features/` — lógica por dominio: `auth/`, `animals/`, `sightings/`, `user/`.
- `src/lib/` — utilidades transversales: `firebase.ts`, `wikipedia.ts`, `wikidata.ts`, `geolocation.ts`, `cn.ts`.
- `src/types/` — tipos compartidos (espejo de Firestore).
- `firebase/` — security rules.

## Roadmap

| fase | estado | qué incluye |
|---|---|---|
| **1 — Cimientos** | ✅ | Scaffolding, Tailwind tokens, Firebase SDK, router, layout, security rules, PWA, onboarding de cumpleaños. |
| **2 — Avistamiento core** | ✅ | Auth email link, catálogo Wikipedia, captura foto + compresión, GPS + Nominatim, flujo de nuevo avistamiento. |
| **3 — Visualización** | 🚧 | Mapa Leaflet, clase taxonómica Wikidata, gráficos en perfil, "Cerca de mí" iNaturalist, sonidos Wikimedia. |
| **4 — Colección & Euskera** | ⏳ | Pokédex, diario cronológico, bilingüe es/eu (UI + Wikipedia eu). |
| **5 — Logros & Animaciones** | ⏳ | Sistema de logros expandido, animaciones de descubrimiento (framer-motion). |
| **6 — Pulido & Deploy** | ⏳ | Pulido UX, deploy a Firebase Hosting, logo definitivo del león, pruebas pre-cumple. |

## Pre-requisitos en Firebase Console

Antes de probar el flujo de avistamiento, en https://console.firebase.google.com/project/el-safari-de-leo:

1. **Firestore Database** → Create → Production mode → región `europe-west1`.
2. **Storage** → Get started → región `europe-west1`.
3. Desplegar las security rules:
   ```sh
   pnpm dlx firebase-tools login
   pnpm dlx firebase-tools deploy --only firestore:rules,storage
   ```
