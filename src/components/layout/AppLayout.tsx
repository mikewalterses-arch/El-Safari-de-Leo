import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Container } from '@/components/layout/Container';

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-surface text-foreground">
      <Header />
      <main className="pb-28">
        <Container>
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </Container>
      </main>
      <BottomNav />
    </div>
  );
}

function RouteFallback() {
  return (
    <div className="flex justify-center py-20">
      <span
        aria-label="Cargando"
        className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"
      />
    </div>
  );
}
