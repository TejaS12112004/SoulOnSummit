import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-beige)' }}>
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>

      {/* Footer — slot for when component is built */}
      <footer id="public-footer" />
    </div>
  )
}
