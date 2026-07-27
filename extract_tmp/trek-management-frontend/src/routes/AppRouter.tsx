import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { UserLayout } from '@/layouts/UserLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

// Public pages
const HomePage = lazy(() => import('@/pages/public/HomePage'))
const TrekListingPage = lazy(() => import('@/pages/public/TrekListingPage'))
const TrekDetailPage = lazy(() => import('@/pages/public/TrekDetailPage'))

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'))
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'))

// User pages
const ProfilePage = lazy(() => import('@/pages/user/ProfilePage'))
const BookingsPage = lazy(() => import('@/pages/user/BookingsPage'))
const BookingDetailPage = lazy(() => import('@/pages/user/BookingDetailPage'))

// Admin pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminTreksPage = lazy(() => import('@/pages/admin/AdminTreksPage'))
const AdminTrekDetailPage = lazy(() => import('@/pages/admin/AdminTrekDetailPage'))
const AdminDeparturesPage = lazy(() => import('@/pages/admin/AdminDeparturesPage'))
const AdminBookingsPage = lazy(() => import('@/pages/admin/AdminBookingsPage'))
const AdminBookingDetailPage = lazy(() => import('@/pages/admin/AdminBookingDetailPage'))

// Minimal loading fallback — replaced with skeleton later
function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-beige)' }}
    >
      <div
        className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--color-forest)', borderTopColor: 'transparent' }}
      />
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
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
              <Route path={ROUTES.BOOKING_DETAIL} element={<BookingDetailPage />} />
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
    </BrowserRouter>
  )
}
