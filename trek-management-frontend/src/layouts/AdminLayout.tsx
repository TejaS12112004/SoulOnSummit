import { Outlet } from 'react-router-dom'

export function AdminLayout() {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--color-slate)', color: 'var(--color-snow)' }}
    >
      {/* Sidebar slot */}
      <aside id="admin-sidebar" className="hidden md:block w-64 shrink-0" />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar slot */}
        <header id="admin-topbar" />

        <main id="main-content" tabIndex={-1} className="flex-1 p-6 focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
