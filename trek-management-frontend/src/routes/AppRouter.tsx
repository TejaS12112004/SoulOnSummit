import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { SkipLink } from '@/components/ui/SkipLink'
import { RouteFocusHandler } from '@/components/ui/RouteFocusHandler'
import { ROUTES } from '@/constants/routes'
const PublicLayout = lazy(() => import('@/layouts/PublicLayout').then(m => ({ default: m.PublicLayout })))

const HomePage = lazy(() => import('@/features/home/pages/HomePage'))
const TrekListingPage = lazy(() => import('@/features/treks/pages/TrekListingPage'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))

// Minimal loading fallback — replaced with skeleton later
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-[#1F4D3A] border-t-transparent animate-spin" />
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <RouteFocusHandler />
      <SkipLink />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
          {/* ── Public routes ───────────────────────────────────────────── */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.TREKS} element={<TrekListingPage />} />
            {/* Catch-all routes render HomePage with Navbar */}
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  </BrowserRouter>
)
}
