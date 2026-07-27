import { Outlet } from 'react-router-dom'

export function AdminLayout() {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--color-slate)', color: 'var(--color-snow)' }}
    >
      {/* Sidebar slot */}
      <aside id="admin-sidebar" className="w-64 shrink-0" />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar slot */}
        <header id="admin-topbar" />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
