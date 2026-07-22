import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-beige)' }}>
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer — slot for when component is built */}
      <footer id="public-footer" />
    </div>
  )
}
