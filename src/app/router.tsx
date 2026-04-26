import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Home } from '@/pages/Home/Home';

// Code splitting: las páginas pesadas (Map con Leaflet, Profile con Recharts,
// AnimalDetail con audio, NewSighting con framer-motion + browser-image-compression)
// se cargan bajo demanda. El initial load solo trae Home + layout + auth.
const Map = lazy(() =>
  import('@/pages/Map/Map').then((m) => ({ default: m.Map })),
);
const Collection = lazy(() =>
  import('@/pages/Collection/Collection').then((m) => ({ default: m.Collection })),
);
const Diary = lazy(() =>
  import('@/pages/Diary/Diary').then((m) => ({ default: m.Diary })),
);
const NewSighting = lazy(() =>
  import('@/pages/NewSighting/NewSighting').then((m) => ({ default: m.NewSighting })),
);
const Profile = lazy(() =>
  import('@/pages/Profile/Profile').then((m) => ({ default: m.Profile })),
);
const AnimalDetail = lazy(() =>
  import('@/pages/AnimalDetail/AnimalDetail').then((m) => ({ default: m.AnimalDetail })),
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'mapa', element: <Map /> },
      { path: 'coleccion', element: <Collection /> },
      { path: 'diario', element: <Diary /> },
      { path: 'nuevo', element: <NewSighting /> },
      { path: 'perfil', element: <Profile /> },
      { path: 'animal/:animalId', element: <AnimalDetail /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
