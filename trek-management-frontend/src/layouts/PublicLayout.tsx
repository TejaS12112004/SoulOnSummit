import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';

export function PublicLayout() {
  const { pathname } = useLocation();
  const isHero = pathname === '/' || pathname === '/home';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-beige)' }}>
      <Navbar />

      {/* Spacer so fixed navbar never overlaps page content. The homepage's
          hero is full-bleed and intentionally sits behind the transparent navbar. */}
      {!isHero && <div className="h-navbar shrink-0" aria-hidden="true" />}

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>

      {/* Footer — slot for when component is built */}
      <footer id="public-footer" />
    </div>
  )
}
