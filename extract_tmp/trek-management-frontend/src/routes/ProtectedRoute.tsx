import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'

type GuardType = 'authenticated' | 'admin' | 'guest'

interface ProtectedRouteProps {
  guard: GuardType
}

export function ProtectedRoute({ guard }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  // While auth state is resolving, render nothing (avoids flash)
  if (loading) return null

  switch (guard) {
    case 'authenticated':
      if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
      }
      return <Outlet />

    case 'admin':
      if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
      }
      if (!isAdmin) {
        return <Navigate to={ROUTES.HOME} replace />
      }
      return <Outlet />

    case 'guest':
      // Redirect already-logged-in users away from auth pages
      if (isAuthenticated) {
        const from = (location.state as { from?: Location })?.from?.pathname ?? ROUTES.HOME
        return <Navigate to={from} replace />
      }
      return <Outlet />
  }
}
