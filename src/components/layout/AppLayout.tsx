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
          <Outlet />
        </Container>
      </main>
      <BottomNav />
    </div>
  );
}
