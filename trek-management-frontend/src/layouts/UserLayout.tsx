import { Outlet, NavLink } from 'react-router-dom'
import { User, Calendar, LogOut } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export function UserLayout() {
  const { logout } = useAuth()

  const navItems = [
    { name: 'Profile', href: ROUTES.PROFILE, icon: User },
    { name: 'Bookings', href: ROUTES.BOOKINGS, icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar (Mobile/Tablet) */}
      <div className="lg:hidden border-b border-border bg-card px-4 py-4 sticky top-0 z-10 flex items-center justify-between">
        <span className="font-display font-bold text-lg text-foreground">My Account</span>
        <div className="flex gap-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-sm font-semibold transition-colors ${
                    isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
              </NavLink>
            )
          })}
          <button
            onClick={() => void logout()}
            className="text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card p-6 min-h-screen sticky top-0">
          <div className="mb-8">
            <h2 className="font-display font-bold text-xl text-foreground">My Account</h2>
          </div>
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-muted-foreground hover:bg-accent/5 hover:text-foreground'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
          <div className="mt-auto pt-4 border-t border-border">
            <button
              onClick={() => void logout()}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
