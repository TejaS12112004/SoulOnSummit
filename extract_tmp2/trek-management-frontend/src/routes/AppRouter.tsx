import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ROUTES } from '@/constants/routes'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { UserLayout } from '@/layouts/UserLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

// Public pages
const HomePage = lazy(() => import('@/features/home/pages/HomePage'))
const TrekListingPage = lazy(() => import('@/features/treks/pages/TrekListingPage'))
const TrekDetailPage = lazy(() => import('@/features/treks/pages/TrekDetailPage'))

// Auth pages
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'))
const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmailPage'))

// User pages
const ProfilePage = lazy(() => import('@/features/user/pages/ProfilePage'))
const BookingsPage = lazy(() => import('@/features/user/pages/BookingsPage'))
const BookingPage = lazy(() => import('@/features/booking/pages/BookingPage'))
const BookingSummaryPage = lazy(() => import('@/features/booking/pages/BookingSummaryPage'))

// Admin pages
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'))
const AdminTreksPage = lazy(() => import('@/features/admin/pages/AdminTreksPage'))
const AdminTrekDetailPage = lazy(() => import('@/features/admin/pages/AdminTrekDetailPage'))
const AdminDeparturesPage = lazy(() => import('@/features/admin/pages/AdminDeparturesPage'))
const AdminBookingsPage = lazy(() => import('@/features/admin/pages/AdminBookingsPage'))
const AdminBookingDetailPage = lazy(() => import('@/features/admin/pages/AdminBookingDetailPage'))

// Minimal loading fallback — replaced with skeleton later
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-forest border-t-transparent animate-spin" />
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
          {/* ── Public routes ───────────────────────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.TREKS} element={<TrekListingPage />} />
            <Route path={ROUTES.TREK_DETAIL} element={<TrekDetailPage />} />
          </Route>

          {/* ── Auth routes (guest only — redirect if already logged in) ── */}
          <Route element={<ProtectedRoute guard="guest" />}>
            <Route element={<AuthLayout />}>
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
              <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
              <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
            </Route>
          </Route>

          {/* ── Authenticated user routes ────────────────────────────────── */}
          <Route element={<ProtectedRoute guard="authenticated" />}>
            <Route element={<UserLayout />}>
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
              <Route path={ROUTES.BOOKINGS} element={<BookingsPage />} />
              <Route path={ROUTES.BOOKING_NEW} element={<BookingPage />} />
              <Route path={ROUTES.BOOKING_SUMMARY} element={<BookingSummaryPage />} />
            </Route>
          </Route>

          {/* ── Admin routes ─────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute guard="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path={ROUTES.ADMIN} element={<AdminDashboardPage />} />
              <Route path={ROUTES.ADMIN_TREKS} element={<AdminTreksPage />} />
              <Route path={ROUTES.ADMIN_TREK_DETAIL} element={<AdminTrekDetailPage />} />
              <Route path={ROUTES.ADMIN_DEPARTURES} element={<AdminDeparturesPage />} />
              <Route path={ROUTES.ADMIN_BOOKINGS} element={<AdminBookingsPage />} />
              <Route path={ROUTES.ADMIN_BOOKING_DETAIL} element={<AdminBookingDetailPage />} />
            </Route>
          </Route>

          {/* ── Catch-all ────────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  </BrowserRouter>
)
}
