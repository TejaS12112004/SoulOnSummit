import { Outlet } from 'react-router-dom'

export function UserLayout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-beige)' }}>
      {/* User-specific nav slot */}
      <header id="user-navbar" />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
