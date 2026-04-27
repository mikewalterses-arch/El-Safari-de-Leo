import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Home } from '@/pages/Home/Home';

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
const Intro = lazy(() =>
  import('@/pages/Intro/Intro').then((m) => ({ default: m.Intro })),
);
const SightingEdit = lazy(() =>
  import('@/pages/SightingEdit/SightingEdit').then((m) => ({
    default: m.SightingEdit,
  })),
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
      { path: 'sighting/:sightingId/edit', element: <SightingEdit /> },
      { path: 'intro', element: <Intro /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
