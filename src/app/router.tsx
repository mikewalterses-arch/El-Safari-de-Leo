import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Home } from '@/pages/Home/Home';
import { Map } from '@/pages/Map/Map';
import { Collection } from '@/pages/Collection/Collection';
import { Diary } from '@/pages/Diary/Diary';
import { NewSighting } from '@/pages/NewSighting/NewSighting';
import { Profile } from '@/pages/Profile/Profile';

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
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
