import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
const AccessDeniedPage = () => <div className="p-8 text-center"><h1 className="text-2xl font-bold text-red-600">Access Denied</h1><p className="mt-2 text-gray-600">You do not have permission to view this page.</p></div>;
import { Spinner } from '@/components/ui'

type GuardType = 'authenticated' | 'admin' | 'guest'

interface ProtectedRouteProps {
  guard: GuardType
}

export function ProtectedRoute({ guard }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  // While auth state is resolving, render a centered loading spinner
  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    )
  }

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
        return <AccessDeniedPage />
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
